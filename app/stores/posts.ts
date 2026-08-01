import type {
  CreatePostInput,
  CreatePostMutation,
  LikePostMutation,
  PostDetail,
  PostFilterInput,
  PostSummary,
  PublishedPostQuery,
  PublishedPostsQuery,
  UnlikePostMutation,
} from '@/graphql/posts'
import {
  CREATE_POST_MUTATION,
  LIKE_POST_MUTATION,
  PUBLISHED_POST_QUERY,
  PUBLISHED_POSTS_BY_SKILL_QUERY,
  PUBLISHED_POSTS_QUERY,
  RELATED_POSTS_QUERY,
  UNLIKE_POST_MUTATION,
} from '@/graphql/posts'
import {
  dedupeTimedCacheRequest,
  isTimedCacheFresh,
  readTimedCache,
  removeTimedCache,
  writeTimedCache,
} from '@/utils/timedCache'

const POSTS_CACHE_NAMESPACE = 'portfolio.posts-cache.v1'
const DEFAULT_PAGE_SIZE = 10
const RELATED_CANDIDATE_LIMIT = 12
const RELATED_POST_LIMIT = 3

interface PostsCacheData {
  nodes: PostSummary[]
  total: number
}

interface FetchOptions {
  force?: boolean
}

interface FetchListOptions extends FetchOptions {
  append?: boolean
  limit?: number
}

function errorMessage (error: unknown) {
  return error instanceof Error ? error.message : 'The posts service is unavailable.'
}

function isPostSummary (value: unknown): value is PostSummary {
  if (!value || typeof value !== 'object') {
    return false
  }

  const post = value as Partial<PostSummary>

  return typeof post.id === 'string'
    && typeof post.title === 'string'
    && (typeof post.subtitle === 'string' || post.subtitle === null)
    && (typeof post.imageUrl === 'string' || post.imageUrl === null)
    && typeof post.slug === 'string'
    && Array.isArray(post.skills)
    && post.skills.every(skill => typeof skill === 'string')
    && Array.isArray(post.tags)
    && post.tags.every(tag => typeof tag === 'string')
    && (post.status === 'draft' || post.status === 'published')
    && typeof post.createdAt === 'string'
    && (typeof post.publishedAt === 'string' || post.publishedAt === null)
    && typeof post.readCount === 'number'
    && Number.isFinite(post.readCount)
}

function isPostSummaryList (value: unknown): value is PostSummary[] {
  return Array.isArray(value) && value.every(isPostSummary)
}

function isPostsCacheData (value: unknown): value is PostsCacheData {
  if (!value || typeof value !== 'object') {
    return false
  }

  const data = value as Partial<PostsCacheData>

  return isPostSummaryList(data.nodes)
    && typeof data.total === 'number'
    && Number.isFinite(data.total)
}

function isPostDetail (value: unknown): value is PostDetail | null {
  if (value === null) {
    return true
  }

  if (!isPostSummary(value)) {
    return false
  }

  const post = value as Partial<PostDetail>

  return typeof post.content === 'string'
    && typeof post.isLiked === 'boolean'
    && typeof post.likeCount === 'number'
    && Number.isFinite(post.likeCount)
}

function listCacheKey (limit: number) {
  return `list:${limit}`
}

function latestCacheKey (limit: number) {
  return `latest:${limit}`
}

function skillCacheKey (skill: string, limit: number) {
  return `skill:${JSON.stringify([skill, limit])}`
}

function detailCacheKey (userId: string, slug: string) {
  return `detail:${JSON.stringify([userId, slug])}`
}

function relatedCacheKey (source: PostSummary) {
  return `related:${JSON.stringify([source.id, source.skills, source.tags])}`
}

export const usePostsStore = defineStore('posts', () => {
  const { $apollo } = useNuxtApp()
  const visitorStore = useVisitorStore()
  const posts = ref<PostSummary[]>([])
  const currentPost = ref<PostDetail | null>(null)
  const relatedPosts = ref<PostSummary[]>([])
  const latestPostsByLimit = ref<Record<string, PostSummary[]>>({})
  const skillPostsByKey = ref<Record<string, PostSummary[]>>({})
  const totalPosts = ref(0)
  const listLoading = ref(false)
  const detailLoading = ref(false)
  const likePending = ref(false)
  const createPending = ref(false)
  const relatedLoading = ref(false)
  const listError = ref('')
  const detailError = ref('')
  const likeError = ref('')
  const createError = ref('')
  const relatedError = ref('')
  const activeLatestLimits = new Set<number>()
  const activeSkillRequests = new Map<string, { limit: number, skill: string }>()
  let activeListKey = ''
  let activeListLimit = DEFAULT_PAGE_SIZE
  let activeListCachedAt = 0
  let activeDetail: { slug: string, userId: string } | null = null
  let activeDetailKey = ''
  let activeDetailCachedAt = 0
  let detailRequest = 0
  let activeRelatedSource: PostSummary | null = null
  let activeRelatedKey = ''
  let relatedRequest = 0
  let collectionGeneration = 0

  const hasMorePosts = computed(() => posts.value.length < totalPosts.value)

  function getLatestPosts (limit: number) {
    return latestPostsByLimit.value[String(limit)] ?? []
  }

  function getPostsForSkill (skill: string, limit = 6) {
    return skillPostsByKey.value[skillCacheKey(skill, limit)] ?? []
  }

  async function queryPosts (limit: number, offset: number) {
    const result = await $apollo.query<PublishedPostsQuery>({
      fetchPolicy: 'network-only',
      query: PUBLISHED_POSTS_QUERY,
      variables: { limit, offset },
    })

    return result.data?.posts
  }

  async function refreshPosts (key: string, limit: number, cachedCount: number) {
    const generation = collectionGeneration

    listLoading.value = true
    listError.value = ''

    try {
      const connection = await dedupeTimedCacheRequest(
        POSTS_CACHE_NAMESPACE,
        `${key}:refresh`,
        () => queryPosts(Math.max(limit, cachedCount), 0),
      )
      const nodes = connection?.nodes ?? []
      const data: PostsCacheData = {
        nodes,
        total: connection?.paginationInfo?.total ?? nodes.length,
      }

      if (generation !== collectionGeneration) {
        return nodes
      }

      const entry = writeTimedCache(POSTS_CACHE_NAMESPACE, key, data)

      if (activeListKey === key) {
        posts.value = [...data.nodes]
        totalPosts.value = data.total
        activeListCachedAt = entry.cachedAt
      }

      return data.nodes
    } catch (error) {
      if (activeListKey === key && posts.value.length === 0) {
        listError.value = errorMessage(error)
      }

      return posts.value
    } finally {
      if (activeListKey === key) {
        listLoading.value = false
      }
    }
  }

  async function fetchPosts (options: FetchListOptions = {}) {
    const append = options.append ?? false
    const limit = options.limit ?? DEFAULT_PAGE_SIZE
    const key = listCacheKey(limit)

    activeListLimit = limit

    if (append) {
      if (listLoading.value || activeListKey !== key) {
        return posts.value
      }

      const offset = posts.value.length
      const generation = collectionGeneration

      listLoading.value = true
      listError.value = ''

      try {
        const connection = await dedupeTimedCacheRequest(
          POSTS_CACHE_NAMESPACE,
          `${key}:page:${offset}`,
          () => queryPosts(limit, offset),
        )
        const nodes = connection?.nodes ?? []

        if (generation !== collectionGeneration) {
          return posts.value
        }

        posts.value = [
          ...posts.value,
          ...nodes.filter(node => !posts.value.some(post => post.id === node.id)),
        ]
        totalPosts.value = connection?.paginationInfo?.total ?? posts.value.length
        writeTimedCache(
          POSTS_CACHE_NAMESPACE,
          key,
          { nodes: [...posts.value], total: totalPosts.value } satisfies PostsCacheData,
          activeListCachedAt,
        )
      } catch (error) {
        listError.value = errorMessage(error)
      } finally {
        listLoading.value = false
      }

      return posts.value
    }

    const entry = readTimedCache(POSTS_CACHE_NAMESPACE, key, isPostsCacheData)

    if (activeListKey !== key) {
      activeListKey = key
      listLoading.value = false
      posts.value = entry ? [...entry.data.nodes] : []
      totalPosts.value = entry?.data.total ?? 0
    } else if (entry) {
      posts.value = [...entry.data.nodes]
      totalPosts.value = entry.data.total
    }

    activeListCachedAt = entry?.cachedAt ?? 0
    listError.value = ''

    if (!options.force && isTimedCacheFresh(entry)) {
      return posts.value
    }

    const refresh = refreshPosts(key, limit, entry?.data.nodes.length ?? posts.value.length)

    if (entry && !options.force) {
      void refresh
      return posts.value
    }

    return await refresh
  }

  async function loadMorePosts () {
    if (!listLoading.value && hasMorePosts.value) {
      await fetchPosts({ append: true, limit: activeListLimit })
    }
  }

  async function fetchLatestPosts (limit: number, options: FetchOptions = {}) {
    const key = latestCacheKey(limit)
    const stateKey = String(limit)
    const entry = readTimedCache(POSTS_CACHE_NAMESPACE, key, isPostSummaryList)
    const generation = collectionGeneration

    activeLatestLimits.add(limit)

    if (entry) {
      latestPostsByLimit.value[stateKey] = [...entry.data]
    } else if (!(stateKey in latestPostsByLimit.value)) {
      latestPostsByLimit.value[stateKey] = []
    }

    if (!options.force && isTimedCacheFresh(entry)) {
      return getLatestPosts(limit)
    }

    const refresh = dedupeTimedCacheRequest(
      POSTS_CACHE_NAMESPACE,
      `${key}:refresh`,
      async () => {
        const nodes = (await queryPosts(limit, 0))?.nodes ?? []

        if (generation !== collectionGeneration) {
          return getLatestPosts(limit)
        }

        writeTimedCache(POSTS_CACHE_NAMESPACE, key, nodes)
        latestPostsByLimit.value[stateKey] = [...nodes]

        return nodes
      },
    ).catch(() => getLatestPosts(limit))

    if (entry && !options.force) {
      void refresh
      return getLatestPosts(limit)
    }

    return await refresh
  }

  async function fetchPostsForSkill (
    skill: string,
    limit = 6,
    options: FetchOptions = {},
  ) {
    const key = skillCacheKey(skill, limit)
    const entry = readTimedCache(POSTS_CACHE_NAMESPACE, key, isPostSummaryList)
    const generation = collectionGeneration

    activeSkillRequests.set(key, { limit, skill })

    if (entry) {
      skillPostsByKey.value[key] = [...entry.data]
    } else if (!(key in skillPostsByKey.value)) {
      skillPostsByKey.value[key] = []
    }

    if (!options.force && isTimedCacheFresh(entry)) {
      return getPostsForSkill(skill, limit)
    }

    const refresh = dedupeTimedCacheRequest(
      POSTS_CACHE_NAMESPACE,
      `${key}:refresh`,
      async () => {
        const result = await $apollo.query<PublishedPostsQuery>({
          fetchPolicy: 'network-only',
          query: PUBLISHED_POSTS_BY_SKILL_QUERY,
          variables: { limit, offset: 0, skill },
        })
        const nodes = result.data?.posts.nodes ?? []

        if (generation !== collectionGeneration) {
          return getPostsForSkill(skill, limit)
        }

        writeTimedCache(POSTS_CACHE_NAMESPACE, key, nodes)
        skillPostsByKey.value[key] = [...nodes]

        return nodes
      },
    ).catch(() => getPostsForSkill(skill, limit))

    if (entry && !options.force) {
      void refresh
      return getPostsForSkill(skill, limit)
    }

    return await refresh
  }

  async function fetchPost (slug: string, options: FetchOptions = {}) {
    const userId = visitorStore.initializeVisitor()
    const key = detailCacheKey(userId, slug)
    const entry = readTimedCache(POSTS_CACHE_NAMESPACE, key, isPostDetail)

    if (activeDetailKey !== key) {
      activeDetailKey = key
      activeDetail = { slug, userId }
      detailRequest += 1
      detailLoading.value = false
      relatedRequest += 1
      activeRelatedKey = ''
      activeRelatedSource = null
      relatedPosts.value = []
      relatedLoading.value = false
      relatedError.value = ''
      currentPost.value = entry?.data ?? null
    } else if (entry) {
      currentPost.value = entry.data
    }

    const request = detailRequest
    activeDetailCachedAt = entry?.cachedAt ?? 0
    detailError.value = ''
    likeError.value = ''

    if (!options.force && isTimedCacheFresh(entry)) {
      return currentPost.value
    }

    detailLoading.value = true

    const refresh = dedupeTimedCacheRequest(
      POSTS_CACHE_NAMESPACE,
      `${key}:refresh`,
      async () => {
        const result = await $apollo.query<PublishedPostQuery>({
          fetchPolicy: 'network-only',
          query: PUBLISHED_POST_QUERY,
          variables: { slug, userId },
        })
        const post = result.data?.posts.nodes[0]
        const detail: PostDetail | null = post
          ? {
              ...post,
              isLiked: post.viewerLikes.nodes.length > 0,
              likeCount: post.likes.paginationInfo?.total ?? 0,
            }
          : null
        if (request === detailRequest && activeDetailKey === key) {
          const cached = writeTimedCache(POSTS_CACHE_NAMESPACE, key, detail)

          currentPost.value = detail
          activeDetailCachedAt = cached.cachedAt
        }

        return detail
      },
    ).catch((error: unknown) => {
      if (
        request === detailRequest
        && activeDetailKey === key
        && currentPost.value === null
      ) {
        detailError.value = errorMessage(error)
      }

      return currentPost.value
    }).finally(() => {
      if (request === detailRequest && activeDetailKey === key) {
        detailLoading.value = false
      }
    })

    if (entry && !options.force) {
      void refresh
      return currentPost.value
    }

    return await refresh
  }

  function relatedScore (post: PostSummary, source: PostSummary) {
    const sourceSkills = new Set(source.skills.map(skill => skill.toLowerCase()))
    const sourceTags = new Set(source.tags.map(tag => tag.toLowerCase()))
    const sharedSkills = post.skills.filter(skill => sourceSkills.has(skill.toLowerCase())).length
    const sharedTags = post.tags.filter(tag => sourceTags.has(tag.toLowerCase())).length

    return (sharedSkills * 3) + sharedTags
  }

  function publishedTime (post: PostSummary) {
    return new Date(post.publishedAt ?? post.createdAt).getTime()
  }

  async function queryRelatedPosts (filters: PostFilterInput, limit: number) {
    const result = await $apollo.query<PublishedPostsQuery>({
      fetchPolicy: 'network-only',
      query: RELATED_POSTS_QUERY,
      variables: { filters, limit },
    })

    return result.data?.posts.nodes ?? []
  }

  async function fetchRelatedPosts (source: PostSummary, options: FetchOptions = {}) {
    const key = relatedCacheKey(source)
    const entry = readTimedCache(POSTS_CACHE_NAMESPACE, key, isPostSummaryList)

    if (activeRelatedKey !== key) {
      activeRelatedKey = key
      activeRelatedSource = {
        ...source,
        skills: [...source.skills],
        tags: [...source.tags],
      }
      relatedRequest += 1
      relatedLoading.value = false
      relatedPosts.value = entry ? [...entry.data] : []
    } else if (entry) {
      relatedPosts.value = [...entry.data]
    }

    const request = relatedRequest
    const generation = collectionGeneration

    relatedError.value = ''

    if (!options.force && isTimedCacheFresh(entry)) {
      return relatedPosts.value
    }

    relatedLoading.value = true

    const refresh = dedupeTimedCacheRequest(
      POSTS_CACHE_NAMESPACE,
      `${key}:refresh`,
      async () => {
        const topicFilters: NonNullable<PostFilterInput['or']> = []

        if (source.skills.length > 0) {
          topicFilters.push({ skills: { array_overlap: source.skills } })
        }

        if (source.tags.length > 0) {
          topicFilters.push({ tags: { array_overlap: source.tags } })
        }

        const baseFilters: PostFilterInput = {
          id: { ne: source.id },
          status: { eq: 'published' },
        }
        const candidates = topicFilters.length > 0
          ? await queryRelatedPosts({ ...baseFilters, or: topicFilters }, RELATED_CANDIDATE_LIMIT)
          : []
        const ranked = candidates
          .filter(post => post.id !== source.id)
          .toSorted((left, right) => {
            const scoreDifference = relatedScore(right, source) - relatedScore(left, source)

            return scoreDifference || (publishedTime(right) - publishedTime(left))
          })

        if (ranked.length < RELATED_POST_LIMIT) {
          const recent = await queryRelatedPosts(baseFilters, RELATED_CANDIDATE_LIMIT)

          for (const post of recent) {
            if (!ranked.some(candidate => candidate.id === post.id)) {
              ranked.push(post)
            }
          }
        }

        const result = ranked.slice(0, RELATED_POST_LIMIT)

        if (generation !== collectionGeneration) {
          return relatedPosts.value
        }

        writeTimedCache(POSTS_CACHE_NAMESPACE, key, result)

        if (request === relatedRequest && activeRelatedKey === key) {
          relatedPosts.value = [...result]
        }

        return result
      },
    ).catch((error: unknown) => {
      if (
        request === relatedRequest
        && activeRelatedKey === key
        && relatedPosts.value.length === 0
      ) {
        relatedError.value = errorMessage(error)
      }

      return relatedPosts.value
    }).finally(() => {
      if (request === relatedRequest && activeRelatedKey === key) {
        relatedLoading.value = false
      }
    })

    if (entry && !options.force) {
      void refresh
      return relatedPosts.value
    }

    return await refresh
  }

  async function toggleLike () {
    const post = currentPost.value
    const key = activeDetailKey
    const cachedAt = activeDetailCachedAt

    if (!post || likePending.value) {
      return
    }

    likePending.value = true
    likeError.value = ''

    try {
      const userId = await visitorStore.ensureRegistered()

      if (post.isLiked) {
        await $apollo.mutate<UnlikePostMutation>({
          mutation: UNLIKE_POST_MUTATION,
          variables: { postId: post.id, userId },
        })
        post.isLiked = false
        post.likeCount = Math.max(0, post.likeCount - 1)
      } else {
        await $apollo.mutate<LikePostMutation>({
          mutation: LIKE_POST_MUTATION,
          variables: { postId: post.id, userId },
        })
        post.isLiked = true
        post.likeCount += 1
      }

      if (key) {
        if (activeDetailKey === key && currentPost.value === post) {
          detailRequest += 1
          detailLoading.value = false
        }

        writeTimedCache(
          POSTS_CACHE_NAMESPACE,
          key,
          { ...post },
          cachedAt,
        )
      }
    } catch (error) {
      likeError.value = errorMessage(error)
    } finally {
      likePending.value = false
    }
  }

  function invalidatePostCollections () {
    collectionGeneration += 1
    removeTimedCache(
      POSTS_CACHE_NAMESPACE,
      key => (
        key.startsWith('list:')
        || key.startsWith('latest:')
        || key.startsWith('skill:')
        || key.startsWith('related:')
      ),
    )
    posts.value = []
    totalPosts.value = 0
    activeListCachedAt = 0
    latestPostsByLimit.value = {}
    skillPostsByKey.value = {}
    relatedPosts.value = []
    activeRelatedKey = ''
    activeRelatedSource = null
  }

  async function createPost (input: CreatePostInput) {
    createPending.value = true
    createError.value = ''

    try {
      const result = await $apollo.mutate<CreatePostMutation>({
        mutation: CREATE_POST_MUTATION,
        variables: input,
      })

      if (!result.data?.createPost) {
        throw new Error('The posts service did not return the created post.')
      }

      invalidatePostCollections()

      return result.data.createPost
    } catch (error) {
      createError.value = errorMessage(error)
      return null
    } finally {
      createPending.value = false
    }
  }

  function refreshActiveCaches () {
    if (activeListKey) {
      void fetchPosts({ limit: activeListLimit })
    }

    for (const limit of activeLatestLimits) {
      void fetchLatestPosts(limit)
    }

    for (const { limit, skill } of activeSkillRequests.values()) {
      void fetchPostsForSkill(skill, limit)
    }

    if (activeDetail) {
      void fetchPost(activeDetail.slug)
    }

    if (activeRelatedSource) {
      const source = currentPost.value?.id === activeRelatedSource.id
        ? currentPost.value
        : activeRelatedSource

      void fetchRelatedPosts(source)
    }
  }

  return {
    createError,
    createPending,
    createPost,
    currentPost,
    detailError,
    detailLoading,
    fetchLatestPosts,
    fetchPost,
    fetchPosts,
    fetchPostsForSkill,
    fetchRelatedPosts,
    getLatestPosts,
    getPostsForSkill,
    hasMorePosts,
    latestPostsByLimit,
    likeError,
    likePending,
    listError,
    listLoading,
    loadMorePosts,
    posts,
    refreshActiveCaches,
    relatedError,
    relatedLoading,
    relatedPosts,
    skillPostsByKey,
    toggleLike,
    totalPosts,
  }
})
