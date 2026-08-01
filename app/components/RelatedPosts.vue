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
  <section
    v-if="posts.length > 0"
    aria-labelledby="related-posts-title"
    class="related-posts"
  >
    <div class="related-posts__heading">
      <p class="related-posts__eyebrow">Keep reading</p>
      <h2 id="related-posts-title">Related posts</h2>
    </div>

    <v-row>
      <v-col
        v-for="post in posts"
        :key="post.id"
        cols="12"
        md="4"
        sm="6"
      >
        <v-card
          class="glass-card h-100 pa-5"
          rounded="xl"
          :to="`/blog/${post.slug}`"
        >
          <p class="related-posts__meta">
            {{ formatDate(post.publishedAt ?? post.createdAt) }}
          </p>

          <h3 class="related-posts__title">{{ post.title }}</h3>

          <p v-if="post.subtitle" class="related-posts__summary">
            {{ post.subtitle }}
          </p>

          <div v-if="post.tags.length > 0" class="d-flex flex-wrap ga-2 mt-4">
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
  </section>
</template>

<style scoped>
  .related-posts {
    border-top: 1px solid var(--portfolio-border);
    margin-top: 64px;
    min-width: 0;
    padding-top: 48px;
  }

  .related-posts__heading {
    margin-bottom: 24px;
  }

  .related-posts__eyebrow,
  .related-posts__meta {
    color: var(--portfolio-accent);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .related-posts__eyebrow {
    margin: 0 0 8px;
  }

  .related-posts__heading h2 {
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    margin: 0;
  }

  .related-posts__meta {
    margin: 0 0 12px;
  }

  .related-posts__title {
    line-height: 1.3;
    margin: 0 0 12px;
    overflow-wrap: anywhere;
  }

  .related-posts__summary {
    color: var(--portfolio-text-muted);
    line-height: 1.65;
    margin: 0;
    overflow-wrap: anywhere;
  }

  @media (max-width: 600px) {
    .related-posts {
      margin-top: 48px;
      padding-top: 40px;
    }

    .related-posts :deep(.v-chip) {
      height: auto;
      max-width: 100%;
      white-space: normal;
    }
  }
</style>
