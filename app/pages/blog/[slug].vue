<script setup lang="ts">
  const route = useRoute()
  const { navigationItems } = usePortfolioData()
  const postsStore = usePostsStore()
  const {
    currentPost: post,
    detailError,
    detailLoading,
    likeError,
    likePending,
    relatedPosts,
  } = storeToRefs(postsStore)
  const slug = computed(() => route.params.slug?.toString() ?? '')

  const readingTime = computed(() => {
    const words = post.value?.content.trim().split(/\s+/).filter(Boolean).length ?? 0

    return `${Math.max(1, Math.ceil(words / 200))} min read`
  })

  function formatDate (value: string) {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value))
  }

  function loadPost (force = false) {
    return postsStore.fetchPost(slug.value, { force })
  }

  const relatedIdentity = computed(() => post.value
    ? JSON.stringify([post.value.id, post.value.skills, post.value.tags])
    : '',
  )

  watch(slug, () => void loadPost(), { immediate: true })
  watch(relatedIdentity, () => {
    if (post.value) {
      void postsStore.fetchRelatedPosts(post.value)
    }
  }, { immediate: true })

  useSeoMeta({
    description: () => post.value?.subtitle ?? 'Technical writing by Ignacio Castillo.',
    title: () => post.value?.title ?? 'Blog post',
  })
</script>

<template>
  <div>
    <PortfolioNavigation :items="navigationItems" />

    <v-container class="page-shell" max-width="980">
      <div class="page-surface pa-4 pa-sm-6 pa-md-10">
        <div v-if="detailLoading && !post" class="py-12 text-center">
          <v-progress-circular color="primary" indeterminate />
          <p class="text-medium-emphasis mt-4 mb-0">Loading post…</p>
        </div>

        <v-alert
          v-else-if="detailError && !post"
          color="error"
          icon="mdi-alert-circle-outline"
          title="Post unavailable"
          variant="tonal"
        >
          <p class="mb-4">{{ detailError }}</p>

          <v-btn class="text-none" size="small" variant="outlined" @click="loadPost(true)">
            Try again
          </v-btn>
        </v-alert>

        <div v-else-if="post" class="blog-detail">
          <article class="blog-post">
            <div class="blog-post__header">
              <v-img
                v-if="post.imageUrl"
                :alt="post.title"
                class="blog-post__image mb-8"
                cover
                height="360"
                :src="post.imageUrl"
              />

              <p class="blog-post__meta">
                {{ formatDate(post.publishedAt ?? post.createdAt) }} · {{ readingTime }}
              </p>

              <h1 class="blog-post__title">
                {{ post.title }}
              </h1>

              <p v-if="post.subtitle" class="blog-post__description">
                {{ post.subtitle }}
              </p>

              <div class="d-flex flex-wrap ga-2 mt-4">
                <v-chip
                  v-for="tag in post.tags"
                  :key="tag"
                  size="small"
                  variant="outlined"
                >
                  {{ tag }}
                </v-chip>
              </div>

              <div class="blog-post__engagement mt-6">
                <v-btn
                  :aria-pressed="post.isLiked"
                  class="text-none"
                  :color="post.isLiked ? 'primary' : undefined"
                  :loading="likePending"
                  :prepend-icon="post.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
                  rounded="xl"
                  :variant="post.isLiked ? 'tonal' : 'outlined'"
                  @click="postsStore.toggleLike()"
                >
                  {{ post.likeCount }} {{ post.likeCount === 1 ? 'like' : 'likes' }}
                </v-btn>

                <span class="text-medium-emphasis">{{ post.readCount }} reads</span>
              </div>

              <v-alert
                v-if="likeError"
                class="mt-4"
                color="error"
                density="compact"
                variant="tonal"
              >
                {{ likeError }}
              </v-alert>
            </div>

            <MDC class="content-prose mt-10" :value="post.content" />
          </article>

          <RelatedPosts :posts="relatedPosts" />
          <PostComments :post-id="post.id" />
        </div>

        <div v-else class="py-12 text-center">
          <h1 class="text-h4 mb-4">Post not found</h1>

          <p class="text-medium-emphasis mb-6">
            The requested article is not published or does not exist.
          </p>

          <v-btn class="text-none" color="primary" to="/blog">
            Back to blog
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
  .blog-detail,
  .blog-post,
  .blog-post__header,
  .blog-post__image,
  .content-prose {
    min-width: 0;
    width: 100%;
  }

  .blog-post__image {
    border: 1px solid var(--portfolio-border);
    border-radius: 24px;
  }

  .blog-post__meta {
    color: var(--portfolio-accent);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 14px;
    text-transform: uppercase;
  }

  .blog-post__title {
    font-size: clamp(2.3rem, 5vw, 4rem);
    line-height: 1.05;
    margin: 0 0 16px;
  }

  .blog-post__description {
    color: var(--portfolio-text-muted);
    font-size: 1.05rem;
    line-height: 1.8;
    margin: 0;
  }

  .blog-post__engagement {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  @media (max-width: 600px) {
    .blog-post__image {
      height: 240px !important;
    }

    .blog-post__title {
      font-size: clamp(2rem, 11vw, 3rem);
      overflow-wrap: anywhere;
    }

    .blog-post__description {
      font-size: 1rem;
      line-height: 1.65;
    }
  }
</style>
