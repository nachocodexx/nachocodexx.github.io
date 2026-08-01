import type {
  Comment,
  CommentsQuery,
  CreateCommentMutation,
} from '@/graphql/comments'
import {
  COMMENTS_QUERY,
  CREATE_COMMENT_MUTATION,
} from '@/graphql/comments'
import {
  dedupeTimedCacheRequest,
  isTimedCacheFresh,
  readTimedCache,
  writeTimedCache,
} from '@/utils/timedCache'

const COMMENTS_CACHE_NAMESPACE = 'portfolio.comments-cache.v1'
const AUTHOR_NAME_KEY = 'portfolio.comment-author.v1'
const COMMENT_RATE_LIMIT_KEY = 'portfolio.comment-rate-limit.v1'
const COMMENTS_PAGE_SIZE = 10
const COMMENT_COOLDOWN_BASE_SECONDS = 15
const COMMENT_COOLDOWN_MAX_LEVEL = 5
const COMMENT_COOLDOWN_MAX_SECONDS = 300
const COMMENT_COOLDOWN_RESET_MS = 30 * 60 * 1000

interface CommentRateLimitState {
  cooldownLevel: number
  cooldownUntil: number
  lastCommentAt: number
}

interface CommentsCacheData {
  nodes: Comment[]
  total: number
}

interface FetchCommentsOptions {
  append?: boolean
  force?: boolean
}

function errorMessage (error: unknown) {
  return error instanceof Error ? error.message : 'The comments service is unavailable.'
}

function commentsCacheKey (postId: string) {
  return `post:${postId}`
}

function isComment (value: unknown): value is Comment {
  if (!value || typeof value !== 'object') {
    return false
  }

  const comment = value as Partial<Comment>

  return typeof comment.id === 'string'
    && typeof comment.postId === 'string'
    && typeof comment.userId === 'string'
    && typeof comment.authorName === 'string'
    && typeof comment.content === 'string'
    && (typeof comment.parentId === 'string' || comment.parentId === null)
    && typeof comment.createdAt === 'string'
}

function isCommentsCacheData (value: unknown): value is CommentsCacheData {
  if (!value || typeof value !== 'object') {
    return false
  }

  const data = value as Partial<CommentsCacheData>

  return Array.isArray(data.nodes)
    && data.nodes.every(isComment)
    && typeof data.total === 'number'
    && Number.isFinite(data.total)
}

export const useCommentsStore = defineStore('comments', () => {
  const { $apollo } = useNuxtApp()
  const visitorStore = useVisitorStore()
  const comments = ref<Comment[]>([])
  const totalComments = ref(0)
  const authorName = ref('')
  const loading = ref(false)
  const submitPending = ref(false)
  const cooldownRemaining = ref(0)
  const loadError = ref('')
  const submitError = ref('')
  let activePostId = ''
  let activeCachedAt = 0
  let requestVersion = 0
  let activeRequestController: AbortController | null = null
  let cooldownLevel = 0
  let cooldownUntil = 0
  let lastCommentAt = 0
  let cooldownTimer: ReturnType<typeof setInterval> | null = null
  let rateLimitInitialized = false

  const hasMoreComments = computed(() => comments.value.length < totalComments.value)
  const isCoolingDown = computed(() => cooldownRemaining.value > 0)

  function stopCooldownTimer () {
    if (cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }

  function syncCooldownRemaining () {
    cooldownRemaining.value = Math.max(
      0,
      Math.ceil((cooldownUntil - Date.now()) / 1000),
    )

    if (cooldownRemaining.value === 0) {
      stopCooldownTimer()
    }
  }

  function startCooldownTimer () {
    syncCooldownRemaining()

    if (cooldownRemaining.value > 0 && !cooldownTimer) {
      cooldownTimer = setInterval(syncCooldownRemaining, 1000)
    }
  }

  function resetRateLimit () {
    cooldownLevel = 0
    cooldownUntil = 0
    lastCommentAt = 0
    cooldownRemaining.value = 0
    stopCooldownTimer()
  }

  function validRateLimitState (value: unknown): value is CommentRateLimitState {
    if (!value || typeof value !== 'object') {
      return false
    }

    const state = value as Partial<CommentRateLimitState>

    return Number.isInteger(state.cooldownLevel)
      && state.cooldownLevel! >= 0
      && state.cooldownLevel! <= COMMENT_COOLDOWN_MAX_LEVEL
      && Number.isFinite(state.cooldownUntil)
      && state.cooldownUntil! >= 0
      && Number.isFinite(state.lastCommentAt)
      && state.lastCommentAt! >= 0
      && state.cooldownUntil! <= state.lastCommentAt! + (COMMENT_COOLDOWN_MAX_SECONDS * 1000)
  }

  function initializeRateLimit () {
    if (!import.meta.client || rateLimitInitialized) {
      return
    }

    rateLimitInitialized = true

    try {
      const storedState = JSON.parse(localStorage.getItem(COMMENT_RATE_LIMIT_KEY) ?? 'null')

      if (!validRateLimitState(storedState)) {
        resetRateLimit()
        return
      }

      const now = Date.now()

      if (
        storedState.lastCommentAt > now
        || now - storedState.lastCommentAt >= COMMENT_COOLDOWN_RESET_MS
      ) {
        resetRateLimit()
        return
      }

      cooldownLevel = storedState.cooldownLevel
      cooldownUntil = storedState.cooldownUntil
      lastCommentAt = storedState.lastCommentAt
      startCooldownTimer()
    } catch {
      resetRateLimit()
    }
  }

  function persistRateLimit () {
    if (!import.meta.client) {
      return
    }

    try {
      localStorage.setItem(COMMENT_RATE_LIMIT_KEY, JSON.stringify({
        cooldownLevel,
        cooldownUntil,
        lastCommentAt,
      } satisfies CommentRateLimitState))
    } catch {
      // The in-memory cooldown still applies when browser storage is unavailable.
    }
  }

  function beginCooldown () {
    const now = Date.now()

    if (now - lastCommentAt >= COMMENT_COOLDOWN_RESET_MS) {
      cooldownLevel = 0
    }

    const durationSeconds = Math.min(
      COMMENT_COOLDOWN_BASE_SECONDS * (2 ** cooldownLevel),
      COMMENT_COOLDOWN_MAX_SECONDS,
    )

    lastCommentAt = now
    cooldownUntil = now + (durationSeconds * 1000)
    cooldownLevel = Math.min(cooldownLevel + 1, COMMENT_COOLDOWN_MAX_LEVEL)
    persistRateLimit()
    startCooldownTimer()
  }

  function initializeAuthorName () {
    if (!import.meta.client || authorName.value) {
      return
    }

    try {
      authorName.value = localStorage.getItem(AUTHOR_NAME_KEY) ?? ''
    } catch {
      authorName.value = ''
    }
  }

  function rememberAuthorName (value: string) {
    if (!import.meta.client) {
      return
    }

    try {
      localStorage.setItem(AUTHOR_NAME_KEY, value)
    } catch {
      // Comment submission still works when browser storage is unavailable.
    }
  }

  function abortActiveRequest () {
    activeRequestController?.abort()
    activeRequestController = null
  }

  async function queryComments (
    postId: string,
    limit: number,
    offset: number,
    controller: AbortController,
  ) {
    const result = await $apollo.query<CommentsQuery>({
      context: {
        fetchOptions: {
          signal: controller.signal,
        },
      },
      fetchPolicy: 'network-only',
      query: COMMENTS_QUERY,
      variables: { limit, offset, postId },
    })

    return result.data?.comments
  }

  async function refreshComments (
    postId: string,
    key: string,
    cachedCount: number,
    request: number,
  ) {
    loading.value = true
    loadError.value = ''

    try {
      const connection = await dedupeTimedCacheRequest(
        COMMENTS_CACHE_NAMESPACE,
        `${key}:refresh`,
        () => {
          const controller = new AbortController()

          activeRequestController = controller

          return queryComments(
            postId,
            Math.max(COMMENTS_PAGE_SIZE, cachedCount),
            0,
            controller,
          )
        },
      )
      const nodes = connection?.nodes ?? []
      const data: CommentsCacheData = {
        nodes,
        total: connection?.paginationInfo?.total ?? nodes.length,
      }

      if (request === requestVersion && activePostId === postId) {
        const entry = writeTimedCache(COMMENTS_CACHE_NAMESPACE, key, data)

        comments.value = [...data.nodes]
        totalComments.value = data.total
        activeCachedAt = entry.cachedAt
      }

      return data.nodes
    } catch (error) {
      if (
        request === requestVersion
        && activePostId === postId
        && comments.value.length === 0
      ) {
        loadError.value = errorMessage(error)
      }

      return comments.value
    } finally {
      if (request === requestVersion && activePostId === postId) {
        loading.value = false
        activeRequestController = null
      }
    }
  }

  async function appendComments (postId: string, key: string) {
    if (activePostId !== postId) {
      return comments.value
    }

    const request = requestVersion
    const offset = comments.value.length
    const controller = new AbortController()

    activeRequestController = controller
    loading.value = true
    loadError.value = ''

    try {
      const connection = await dedupeTimedCacheRequest(
        COMMENTS_CACHE_NAMESPACE,
        `${key}:page:${offset}`,
        () => queryComments(postId, COMMENTS_PAGE_SIZE, offset, controller),
      )

      if (request !== requestVersion || activePostId !== postId) {
        return comments.value
      }

      const nodes = connection?.nodes ?? []

      comments.value = [
        ...comments.value,
        ...nodes.filter(node => !comments.value.some(comment => comment.id === node.id)),
      ]
      totalComments.value = connection?.paginationInfo?.total ?? comments.value.length
      writeTimedCache(
        COMMENTS_CACHE_NAMESPACE,
        key,
        { nodes: [...comments.value], total: totalComments.value } satisfies CommentsCacheData,
        activeCachedAt,
      )
    } catch (error) {
      if (request === requestVersion && activePostId === postId) {
        loadError.value = errorMessage(error)
      }
    } finally {
      if (request === requestVersion && activePostId === postId) {
        loading.value = false
        activeRequestController = null
      }
    }

    return comments.value
  }

  async function fetchComments (
    postId: string,
    options: FetchCommentsOptions = {},
  ) {
    const append = options.append ?? false

    if (!postId || (append && loading.value)) {
      return comments.value
    }

    const key = commentsCacheKey(postId)

    if (append) {
      return await appendComments(postId, key)
    }

    const entry = readTimedCache(
      COMMENTS_CACHE_NAMESPACE,
      key,
      isCommentsCacheData,
    )

    if (activePostId !== postId) {
      abortActiveRequest()
      requestVersion += 1
      activePostId = postId
      loading.value = false
      comments.value = entry ? [...entry.data.nodes] : []
      totalComments.value = entry?.data.total ?? 0
      submitError.value = ''
    } else if (entry) {
      comments.value = [...entry.data.nodes]
      totalComments.value = entry.data.total
    }

    const request = requestVersion

    activeCachedAt = entry?.cachedAt ?? 0
    loadError.value = ''

    if (!options.force && isTimedCacheFresh(entry)) {
      return comments.value
    }

    const refresh = refreshComments(
      postId,
      key,
      entry?.data.nodes.length ?? comments.value.length,
      request,
    )

    if (entry && !options.force) {
      void refresh
      return comments.value
    }

    return await refresh
  }

  async function loadMoreComments () {
    if (activePostId && hasMoreComments.value && !loading.value) {
      await fetchComments(activePostId, { append: true })
    }
  }

  async function createComment (postId: string, content: string) {
    initializeRateLimit()

    const trimmedName = authorName.value.trim()
    const trimmedContent = content.trim()

    if (
      !postId
      || !trimmedName
      || !trimmedContent
      || submitPending.value
      || isCoolingDown.value
    ) {
      return null
    }

    submitPending.value = true
    submitError.value = ''

    try {
      const userId = await visitorStore.ensureRegistered()
      const result = await $apollo.mutate<CreateCommentMutation>({
        mutation: CREATE_COMMENT_MUTATION,
        variables: {
          authorName: trimmedName,
          content: trimmedContent,
          postId,
          userId,
        },
      })
      const comment = result.data?.createComment

      if (!comment) {
        throw new Error('The comments service did not return the created comment.')
      }

      authorName.value = trimmedName
      rememberAuthorName(trimmedName)

      if (activePostId === postId) {
        requestVersion += 1
        abortActiveRequest()
        loading.value = false

        if (!comments.value.some(item => item.id === comment.id)) {
          comments.value = [comment, ...comments.value]
          totalComments.value += 1
        }
      }

      const key = commentsCacheKey(postId)
      const cached = readTimedCache(
        COMMENTS_CACHE_NAMESPACE,
        key,
        isCommentsCacheData,
      )
      const nodes = cached?.data.nodes ?? (activePostId === postId ? comments.value : [])
      const patchedNodes = nodes.some(item => item.id === comment.id)
        ? nodes
        : [comment, ...nodes]
      let total = 1
      let patchedCachedAt = cached?.cachedAt ?? 0

      if (cached) {
        total = cached.data.total + (nodes.length === patchedNodes.length ? 0 : 1)
      } else if (activePostId === postId) {
        total = totalComments.value
        patchedCachedAt = activeCachedAt
      }

      writeTimedCache(
        COMMENTS_CACHE_NAMESPACE,
        key,
        { nodes: patchedNodes, total } satisfies CommentsCacheData,
        patchedCachedAt,
      )

      beginCooldown()

      return comment
    } catch (error) {
      submitError.value = errorMessage(error)
      return null
    } finally {
      submitPending.value = false
    }
  }

  function refreshActiveCache () {
    if (activePostId) {
      void fetchComments(activePostId)
    }
  }

  return {
    authorName,
    comments,
    cooldownRemaining,
    createComment,
    fetchComments,
    hasMoreComments,
    initializeAuthorName,
    initializeRateLimit,
    isCoolingDown,
    loadError,
    loading,
    loadMoreComments,
    refreshActiveCache,
    submitError,
    submitPending,
    totalComments,
  }
})
