<script setup lang="ts">
  import type { ProjectEntry } from '@/composables/usePortfolioData'

  const props = withDefaults(defineProps<{
    project: ProjectEntry
    showCategory?: boolean
    maxTechnologies?: number
  }>(), {
    maxTechnologies: 5,
    showCategory: true,
  })

  const visibleTechnologies = computed(() => props.project.technologies.slice(0, props.maxTechnologies))
  const remainingTechnologyCount = computed(() => Math.max(props.project.technologies.length - visibleTechnologies.value.length, 0))
</script>

<template>
  <v-card class="glass-card project-preview-card h-100 pa-5 pa-md-6" rounded="xl" :to="project.path">
    <div class="project-preview-card__header d-flex align-start justify-space-between ga-4">
      <div class="project-preview-card__identity d-flex align-start ga-4">
        <ProjectLogoBadge :project="project" size="default" />

        <div>
          <p class="project-preview-card__meta">
            {{ project.developmentYear }}
          </p>

          <h3 class="project-preview-card__title">
            {{ project.title }}
          </h3>

          <div class="d-flex flex-wrap ga-2 mt-3">
            <v-chip
              v-if="showCategory"
              size="small"
              variant="tonal"
            >
              {{ project.categoryTitle }}
            </v-chip>

            <v-chip size="small" variant="outlined">
              {{ project.type }}
            </v-chip>
          </div>
        </div>
      </div>

      <v-icon color="primary" icon="mdi-arrow-top-right-thin-circle-outline" />
    </div>

    <p class="project-preview-card__summary mt-5">
      {{ project.summary }}
    </p>

    <div class="d-flex flex-wrap ga-2 mt-5">
      <v-chip
        v-for="technology in visibleTechnologies"
        :key="technology"
        size="small"
        variant="outlined"
      >
        {{ technology }}
      </v-chip>

      <v-chip
        v-if="remainingTechnologyCount > 0"
        size="small"
        variant="tonal"
      >
        +{{ remainingTechnologyCount }} more
      </v-chip>
    </div>
  </v-card>
</template>

<style scoped>
  .project-preview-card {
    max-width: 100%;
    min-width: 0;
    transition:
      transform 180ms ease,
      border-color 220ms ease,
      box-shadow 220ms ease;
  }

  .project-preview-card:hover {
    transform: translateY(-3px);
  }

  .project-preview-card__meta {
    color: var(--portfolio-accent);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0;
    text-transform: uppercase;
  }

  .project-preview-card__title {
    margin: 10px 0 0;
  }

  .project-preview-card__summary {
    color: var(--portfolio-text-muted);
    display: -webkit-box;
    line-height: 1.75;
    margin-bottom: 0;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    overflow-wrap: anywhere;
  }

  @media (max-width: 600px) {
    .project-preview-card__header {
      gap: 10px !important;
    }

    .project-preview-card__identity {
      gap: 12px !important;
      min-width: 0;
    }

    .project-preview-card__title {
      overflow-wrap: anywhere;
    }

    .project-preview-card :deep(.v-chip) {
      height: auto;
      max-width: 100%;
      white-space: normal;
    }
  }
</style>
