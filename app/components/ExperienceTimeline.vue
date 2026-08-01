<script setup lang="ts">
  import type { ExperienceEntry } from '~/composables/usePortfolioData'

  const props = defineProps<{
    entries: ExperienceEntry[]
  }>()

  const selectedEntry = ref<ExperienceEntry | null>(null)
  const { getPaperByDoi, getProjectBySlug } = usePortfolioData()

  const timelineStyle = computed(() => ({
    '--experience-entry-count': props.entries.length,
  }))

  const isDialogOpen = computed({
    get: () => selectedEntry.value !== null,
    set: (isOpen: boolean) => {
      if (!isOpen) {
        selectedEntry.value = null
      }
    },
  })

  const relatedProjects = computed(() => {
    return selectedEntry.value?.projectSlugs.flatMap((slug) => {
      const project = getProjectBySlug(slug)

      return project ? [project] : []
    }) ?? []
  })

  const relatedPapers = computed(() => {
    return selectedEntry.value?.relatedPaperDois?.flatMap((doi) => {
      const paper = getPaperByDoi(doi)

      return paper ? [paper] : []
    }) ?? []
  })

  function getDoiUrl (doi: string) {
    return `https://doi.org/${doi}`
  }

  function openEntry (entry: ExperienceEntry) {
    selectedEntry.value = entry
  }

  function closeDialog () {
    selectedEntry.value = null
  }
</script>

<template>
  <div
    aria-label="Career and education timeline. Scroll horizontally to view every milestone."
    class="experience-timeline__scroller"
    role="region"
    tabindex="0"
  >
    <v-timeline
      align="center"
      class="experience-timeline"
      direction="horizontal"
      line-thickness="2"
      :style="timelineStyle"
      truncate-line="both"
    >
      <v-timeline-item
        v-for="entry in entries"
        :key="entry.id"
        :class="[
          'experience-timeline__item',
          `experience-timeline__item--${entry.kind}`,
        ]"
        :dot-color="entry.kind === 'education' ? 'success' : 'primary'"
        fill-dot
        :icon="entry.kind === 'education' ? 'mdi-school-outline' : 'mdi-briefcase-outline'"
        :icon-color="entry.kind === 'education' ? 'success' : 'primary'"
        :side="entry.kind === 'education' ? 'end' : 'start'"
        size="small"
      >
        <template #opposite>
          <span class="experience-timeline__period">
            {{ entry.period }}
          </span>
        </template>

        <v-card
          :aria-label="`View details for ${entry.role} at ${entry.organization}`"
          class="experience-timeline__card glass-card"
          rounded="xl"
          tag="button"
          type="button"
          @click="openEntry(entry)"
        >
          <p class="experience-timeline__organization">
            {{ entry.organization }}
          </p>

          <h3 class="experience-timeline__role">
            {{ entry.role }}
          </h3>

          <span class="experience-timeline__details-hint">
            <span>View details</span>
            <v-icon aria-hidden="true" icon="mdi-arrow-top-right" size="small" />
          </span>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>

  <p class="experience-timeline__scroll-hint">
    <v-icon aria-hidden="true" icon="mdi-gesture-swipe-horizontal" size="small" />
    <span>Scroll to explore every milestone</span>
  </p>

  <v-dialog
    v-model="isDialogOpen"
    max-width="640"
    :width="'calc(100% - 32px)'"
  >
    <v-card
      v-if="selectedEntry"
      class="experience-dialog glass-card"
      rounded="xl"
    >
      <div class="experience-dialog__header">
        <div>
          <p class="experience-dialog__organization">
            {{ selectedEntry.organization }}
          </p>

          <h2 class="experience-dialog__title">
            {{ selectedEntry.role }}
          </h2>
        </div>

        <v-btn
          :aria-label="`Close details for ${selectedEntry.role}`"
          icon="mdi-close"
          variant="text"
          @click="closeDialog"
        />
      </div>

      <v-card-text class="experience-dialog__content">
        <div class="experience-dialog__section">
          <p class="experience-dialog__label">
            Duration
          </p>

          <p class="experience-dialog__value">
            {{ selectedEntry.period }}
          </p>
        </div>

        <div class="experience-dialog__section">
          <p class="experience-dialog__label">
            Description
          </p>

          <p class="experience-dialog__description">
            {{ selectedEntry.summary }}
          </p>
        </div>

        <div
          v-if="selectedEntry.professionalLicense"
          class="experience-dialog__section"
        >
          <p class="experience-dialog__label">
            Professional license
          </p>

          <v-btn
            :aria-label="`Download professional license for ${selectedEntry.role}`"
            class="text-none"
            color="success"
            :download="selectedEntry.professionalLicense.downloadName"
            :href="selectedEntry.professionalLicense.url"
            prepend-icon="mdi-download"
            variant="tonal"
          >
            Download PDF
          </v-btn>
        </div>

        <div
          v-if="selectedEntry.thesis"
          class="experience-dialog__section"
        >
          <p class="experience-dialog__label">
            Thesis
          </p>

          <v-btn
            v-if="selectedEntry.thesis.status === 'available'"
            :aria-label="`Download thesis for ${selectedEntry.role}`"
            class="text-none"
            color="success"
            :download="selectedEntry.thesis.downloadName"
            :href="selectedEntry.thesis.url"
            prepend-icon="mdi-download"
            variant="tonal"
          >
            Download thesis
          </v-btn>

          <p v-else class="experience-dialog__value">
            In progress
          </p>
        </div>

        <div class="experience-dialog__section">
          <p class="experience-dialog__label">
            Related projects
          </p>

          <v-list
            v-if="relatedProjects.length > 0"
            class="experience-dialog__projects"
            lines="two"
          >
            <v-list-item
              v-for="project in relatedProjects"
              :key="project.slug"
              append-icon="mdi-arrow-right"
              class="experience-dialog__project"
              :subtitle="project.developmentYear"
              :title="project.title"
              :to="project.path"
              @click="closeDialog"
            />
          </v-list>

          <p v-else class="experience-dialog__empty-state">
            No related projects listed.
          </p>
        </div>

        <div
          v-if="selectedEntry.relatedPaperDois"
          class="experience-dialog__section"
        >
          <p class="experience-dialog__label">
            Related papers
          </p>

          <v-list
            v-if="relatedPapers.length > 0"
            class="experience-dialog__papers"
            lines="two"
          >
            <v-list-item
              v-for="paper in relatedPapers"
              :key="paper.doi"
              append-icon="mdi-open-in-new"
              :aria-label="`Open ${paper.title} on DOI.org in a new tab`"
              class="experience-dialog__paper"
              :href="getDoiUrl(paper.doi)"
              rel="noopener noreferrer"
              :subtitle="`${paper.venue} · ${paper.year}`"
              target="_blank"
              :title="paper.title"
            />
          </v-list>

          <p v-else class="experience-dialog__empty-state">
            No related papers listed.
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .experience-timeline__scroller {
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px 0 18px;
    scrollbar-color: var(--portfolio-accent) transparent;
    scrollbar-width: thin;
  }

  .experience-timeline__scroller:focus-visible {
    border-radius: 18px;
    outline: 2px solid var(--portfolio-accent);
    outline-offset: 4px;
  }

  .experience-timeline {
    grid-template-columns: repeat(var(--experience-entry-count), 204px);
    grid-template-rows: minmax(200px, auto) 30px minmax(200px, auto);
    min-height: 430px;
    min-width: max-content;
    padding-inline: 8px;
    width: max-content;
  }

  .experience-timeline__item {
    min-width: 0;
  }

  .experience-timeline__period {
    color: var(--portfolio-accent);
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  .experience-timeline__card {
    appearance: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 176px;
    padding: 20px;
    text-align: left;
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
    width: 180px;
  }

  .experience-timeline__scroll-hint {
    align-items: center;
    color: var(--portfolio-text-muted);
    display: none;
    font-size: 0.78rem;
    gap: 6px;
    justify-content: flex-end;
    margin: 2px 4px 0;
  }

  .experience-timeline__organization {
    color: var(--portfolio-accent);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    line-height: 1.5;
    margin: 0 0 8px;
    text-transform: uppercase;
  }

  .experience-timeline__role {
    font-size: 1rem;
    line-height: 1.35;
    margin: 0 0 10px;
  }

  .experience-timeline__details-hint {
    align-items: center;
    color: var(--portfolio-text-muted);
    display: flex;
    font-size: 0.78rem;
    font-weight: 700;
    gap: 4px;
    margin-top: auto;
  }

  .experience-timeline__card:focus-visible {
    outline: 2px solid var(--portfolio-accent);
    outline-offset: 3px;
  }

  .experience-timeline__item--education .experience-timeline__card {
    border-color: color-mix(in srgb, rgb(var(--v-theme-success)) 34%, var(--portfolio-border));
  }

  .experience-timeline__item--education .experience-timeline__organization,
  .experience-timeline__item--education .experience-timeline__period {
    color: rgb(var(--v-theme-success));
  }

  .experience-timeline__item--education .experience-timeline__card:focus-visible {
    outline-color: rgb(var(--v-theme-success));
  }

  .experience-timeline__item:hover .experience-timeline__card {
    border-color: color-mix(in srgb, var(--portfolio-accent) 54%, var(--portfolio-border));
    box-shadow: 0 16px 34px color-mix(in srgb, var(--portfolio-accent) 14%, transparent);
    transform: translateY(-4px);
  }

  .experience-timeline__item--education:hover .experience-timeline__card {
    border-color: color-mix(in srgb, rgb(var(--v-theme-success)) 58%, var(--portfolio-border));
    box-shadow: 0 16px 34px color-mix(in srgb, rgb(var(--v-theme-success)) 14%, transparent);
  }

  .experience-timeline__item :deep(.v-timeline-divider__dot) {
    transition:
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .experience-timeline__item:hover :deep(.v-timeline-divider__dot) {
    box-shadow: 0 0 0 7px color-mix(in srgb, var(--portfolio-accent) 16%, transparent);
    transform: scale(1.1);
  }

  .experience-timeline__item--education:hover :deep(.v-timeline-divider__dot) {
    box-shadow: 0 0 0 7px color-mix(in srgb, rgb(var(--v-theme-success)) 16%, transparent);
  }

  .experience-dialog {
    max-height: min(720px, calc(100dvh - 32px));
    overflow: hidden;
  }

  .experience-dialog__header {
    align-items: flex-start;
    display: flex;
    gap: 20px;
    justify-content: space-between;
    padding: 24px 24px 12px;
  }

  .experience-dialog__organization {
    color: var(--portfolio-accent);
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 8px;
    text-transform: uppercase;
  }

  .experience-dialog__title {
    font-size: clamp(1.3rem, 4vw, 1.75rem);
    line-height: 1.3;
    margin: 0;
  }

  .experience-dialog__content {
    display: grid;
    gap: 24px;
    overflow-y: auto;
    padding: 12px 24px 24px !important;
  }

  .experience-dialog__section {
    min-width: 0;
  }

  .experience-dialog__label {
    color: var(--portfolio-accent);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 8px;
    text-transform: uppercase;
  }

  .experience-dialog__value,
  .experience-dialog__description,
  .experience-dialog__empty-state {
    color: var(--portfolio-text-muted);
    line-height: 1.7;
    margin: 0;
  }

  .experience-dialog__value {
    color: var(--portfolio-text);
    font-weight: 700;
  }

  .experience-dialog__projects,
  .experience-dialog__papers {
    background: transparent;
    display: grid;
    gap: 8px;
    padding: 0;
  }

  .experience-dialog__project,
  .experience-dialog__paper {
    border: 1px solid var(--portfolio-border);
    border-radius: 14px;
  }

  .experience-dialog__project:hover,
  .experience-dialog__project:focus-visible,
  .experience-dialog__paper:hover,
  .experience-dialog__paper:focus-visible {
    border-color: color-mix(in srgb, var(--portfolio-accent) 54%, var(--portfolio-border));
  }

  @media (max-width: 1199px) {
    .experience-timeline__scroll-hint {
      display: flex;
    }
  }

  @media (max-width: 600px) {
    .experience-dialog__header {
      padding: 20px 20px 10px;
    }

    .experience-dialog__content {
      padding: 10px 20px 20px !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .experience-timeline__card,
    .experience-timeline__item :deep(.v-timeline-divider__dot) {
      transition: none;
    }

    .experience-timeline__item:hover .experience-timeline__card,
    .experience-timeline__item:hover :deep(.v-timeline-divider__dot) {
      transform: none;
    }
  }
</style>
