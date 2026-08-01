<script setup lang="ts">
  import type { PostSummary } from '@/graphql/posts'

  defineProps<{
    posts: PostSummary[]
  }>()

  function formatDate (value: string) {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value))
  }
</script>

<template>
  <div class="blog-preview">
    <v-row>
      <v-col
        v-for="post in posts"
        :key="post.id"
        cols="12"
        md="4"
      >
        <v-card class="glass-card h-100 pa-6" rounded="xl" :to="`/blog/${post.slug}`">
          <p class="blog-preview__meta">
            {{ formatDate(post.publishedAt ?? post.createdAt) }}
          </p>

          <h3 class="blog-preview__title">
            {{ post.title }}
          </h3>

          <p class="blog-preview__summary">
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
      </v-col>
    </v-row>

    <div class="mt-6">
      <v-btn class="text-none" color="primary" to="/blog" variant="outlined">
        Explore all posts
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
  .blog-preview,
  .blog-preview :deep(.v-row),
  .blog-preview :deep(.v-col),
  .blog-preview :deep(.v-card) {
    max-width: 100%;
    min-width: 0;
  }

  .blog-preview,
  .blog-preview :deep(.v-row) {
    width: 100%;
  }

  .blog-preview__meta {
    color: var(--portfolio-accent);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 12px;
    text-transform: uppercase;
  }

  .blog-preview__title {
    margin: 0 0 12px;
  }

  .blog-preview__summary {
    color: var(--portfolio-text-muted);
    line-height: 1.7;
    margin: 0;
    overflow-wrap: anywhere;
  }

  @media (max-width: 600px) {
    :deep(.v-card) {
      padding: 20px !important;
    }

    .blog-preview__title {
      overflow-wrap: anywhere;
    }

    .blog-preview :deep(.v-chip) {
      height: auto;
      max-width: 100%;
      white-space: normal;
    }
  }
</style>
