<script setup lang="ts">
  import type { ProjectGroup } from '@/composables/usePortfolioData'

  defineProps<{
    groups: ProjectGroup[]
  }>()
</script>

<template>
  <div class="projects-gallery">
    <section
      v-for="group in groups"
      :key="group.slug"
      class="projects-gallery__section"
    >
      <div class="projects-gallery__section-heading">
        <p class="projects-gallery__section-eyebrow">
          Project section
        </p>

        <h3 class="projects-gallery__section-title">
          {{ group.title }}
        </h3>

        <p class="projects-gallery__section-description">
          {{ group.description }}
        </p>

        <div v-if="group.highlightTag" class="d-flex flex-wrap ga-2">
          <v-chip color="primary" size="small" variant="tonal">
            {{ group.highlightTag }}
          </v-chip>
        </div>

        <p v-if="group.funding" class="projects-gallery__section-funding">
          {{ group.funding }}
        </p>

        <!-- <div v-if="group.technologies?.length" class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="technology in group.technologies"
            :key="technology"
            size="small"
            variant="outlined"
          >
            {{ technology }}
          </v-chip>
        </div> -->

        <div v-if="group.links?.length" class="d-flex flex-wrap ga-3">
          <v-btn
            v-for="link in group.links"
            :key="link.label"
            class="text-none"
            color="primary"
            :href="link.href"
            prepend-icon="mdi-open-in-new"
            rel="noopener noreferrer"
            target="_blank"
            variant="tonal"
          >
            {{ link.label }}
          </v-btn>
        </div>
      </div>

      <v-row>
        <v-col
          v-for="project in group.projects"
          :key="project.slug"
          cols="12"
          md="6"
          xl="4"
        >
          <ProjectPreviewCard :project="project" :show-category="false" />
        </v-col>
      </v-row>
    </section>
  </div>
</template>

<style scoped>
  .projects-gallery {
    display: grid;
    gap: 40px;
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .projects-gallery__section {
    display: grid;
    gap: 18px;
    max-width: 100%;
    min-width: 0;
  }

  .projects-gallery__section-heading {
    display: grid;
    gap: 8px;
    max-width: 720px;
    min-width: 0;
  }

  .projects-gallery__section-eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    margin: 0;
    text-transform: uppercase;
  }

  .projects-gallery__section-title {
    margin: 0;
  }

  .projects-gallery__section-description {
    color: var(--portfolio-text-muted);
    line-height: 1.75;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .projects-gallery__section-funding {
    color: var(--portfolio-text-muted);
    font-size: 0.9rem;
    line-height: 1.65;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .projects-gallery :deep(.v-row),
  .projects-gallery :deep(.v-col) {
    max-width: 100%;
    min-width: 0;
  }

  .projects-gallery :deep(.v-row) {
    width: 100%;
  }
</style>
