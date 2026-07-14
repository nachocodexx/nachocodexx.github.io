<script setup lang="ts">
  const { navigationItems } = usePortfolioData()

  // const { data: posts } = await useAsyncData('blog-index', () => queryCollection('blog').order('date', 'DESC').all())
  const posts:any[] = []

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
            <v-card
              v-for="post in posts ?? []"
              :key="post.path"
              class="glass-card pa-6"
              rounded="xl"
              :to="post.path"
            >
              <p class="blog-index__meta">
                {{ formatDate(post.date) }}<span v-if="post.readingTime"> · {{ post.readingTime }}</span>
              </p>

              <h2 class="blog-index__title">
                {{ post.title }}
              </h2>

              <p class="blog-index__description">
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
            </v-card>
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
