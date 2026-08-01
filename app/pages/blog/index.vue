<script setup lang="ts">
  const { navigationItems } = usePortfolioData()
  const postsStore = usePostsStore()
  const {
    hasMorePosts,
    listError,
    listLoading,
    posts,
  } = storeToRefs(postsStore)

  onMounted(() => postsStore.fetchPosts())

  function formatDate (value: string) {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value))
  }

  useSeoMeta({
    description: 'Technical notes on architecture, distributed systems, security, and engineering practice.',
    title: 'Blog',
  })
</script>

<template>
  <div>
    <PortfolioNavigation :items="navigationItems" />

    <v-container class="page-shell" max-width="1180">
      <div class="page-surface pa-4 pa-sm-6 pa-md-10">
        <PortfolioSection
          id="blog-index"
          description="Technical writing on distributed systems, architecture, security, and lessons drawn from teaching and applied research."
          eyebrow="Writing"
          title="Blog"
        >
          <div class="blog-index">
            <v-alert
              v-if="listError && posts.length === 0"
              color="error"
              icon="mdi-alert-circle-outline"
              title="Posts are unavailable"
              variant="tonal"
            >
              <p class="mb-4">{{ listError }}</p>

              <v-btn class="text-none" size="small" variant="outlined" @click="postsStore.fetchPosts({ force: true })">
                Try again
              </v-btn>
            </v-alert>

            <div v-else-if="listLoading && posts.length === 0" class="py-12 text-center">
              <v-progress-circular color="primary" indeterminate />
              <p class="text-medium-emphasis mt-4 mb-0">Loading posts…</p>
            </div>

            <v-empty-state
              v-else-if="posts.length === 0"
              icon="mdi-post-outline"
              text="Published articles will appear here."
              title="No posts yet"
            />

            <v-card
              v-for="post in posts"
              :key="post.id"
              class="glass-card pa-6"
              rounded="xl"
              :to="`/blog/${post.slug}`"
            >
              <p class="blog-index__meta">
                {{ formatDate(post.publishedAt ?? post.createdAt) }}
              </p>

              <h2 class="blog-index__title">
                {{ post.title }}
              </h2>

              <p class="blog-index__description">
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
            </v-card>

            <div v-if="hasMorePosts" class="text-center pt-2">
              <v-btn
                class="text-none"
                color="primary"
                :loading="listLoading"
                prepend-icon="mdi-chevron-down"
                variant="outlined"
                @click="postsStore.loadMorePosts()"
              >
                Load more
              </v-btn>
            </div>
          </div>
        </PortfolioSection>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
  .blog-index {
    display: grid;
    gap: 18px;
  }

  .blog-index__meta {
    color: var(--portfolio-accent);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 12px;
    text-transform: uppercase;
  }

  .blog-index__title {
    margin: 0 0 12px;
  }

  .blog-index__description {
    color: var(--portfolio-text-muted);
    line-height: 1.8;
    margin: 0;
    max-width: 760px;
  }
</style>
