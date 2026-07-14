<script setup lang="ts">
  const route = useRoute()
  const { navigationItems } = usePortfolioData()

  const { data: post } = await useAsyncData(route.path, () => queryCollection('blog').path(route.path).first())

  if (post.value) {
    useSeoMeta({
      description: post.value.description,
      title: post.value.title,
    })
  }

  function formatDate (value: string) {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value))
  }
</script>

<template>
  <div>
    <PortfolioNavigation :items="navigationItems" />

    <v-container class="page-shell" max-width="980">
      <div class="page-surface pa-4 pa-sm-6 pa-md-10">
        <template v-if="post">
          <div class="blog-post__header">
            <p class="blog-post__meta">
              {{ formatDate(post.date) }}<span v-if="post.readingTime"> · {{ post.readingTime }}</span>
            </p>

            <h1 class="blog-post__title">
              {{ post.title }}
            </h1>

            <p class="blog-post__description">
              {{ post.description }}
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
          </div>

          <ContentRenderer class="content-prose mt-10" :value="post" />
        </template>

        <div v-else class="py-12 text-center">
          <h1 class="text-h4 mb-4">
            Post not found
          </h1>

          <p class="text-medium-emphasis mb-6">
            The requested article is not available in the content collection.
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
  .blog-post__header {
    max-width: 760px;
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

  @media (max-width: 600px) {
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
