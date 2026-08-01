<script setup lang="ts">
  import type { SkillCategory } from '@/composables/usePortfolioData'

  const props = defineProps<{
    categories: SkillCategory[]
  }>()

  const activeIndex = ref(0)

  const activeCategory = computed(() => props.categories[activeIndex.value] ?? null)
  const previousCategory = computed(() => props.categories[activeIndex.value - 1] ?? null)
  const nextCategory = computed(() => props.categories[activeIndex.value + 1] ?? null)
  const hasMultipleCategories = computed(() => props.categories.length > 1)

  watch(() => props.categories.length, (categoryCount) => {
    activeIndex.value = Math.min(activeIndex.value, Math.max(categoryCount - 1, 0))
  })

  function showCategory (index: number) {
    if (index < 0 || index >= props.categories.length) {
      return
    }

    activeIndex.value = index
  }
</script>

<template>
  <div
    aria-label="Skills by category carousel"
    class="skills-carousel"
    role="region"
  >
    <div v-if="hasMultipleCategories" class="skills-carousel__navigation">
      <v-btn
        aria-label="Show previous skill category"
        class="skills-carousel__step-control"
        :disabled="activeIndex === 0"
        icon="mdi-chevron-left"
        size="small"
        variant="text"
        @click="showCategory(activeIndex - 1)"
      />

      <v-tabs
        v-model="activeIndex"
        aria-label="Skill categories"
        center-active
        class="skills-carousel__tabs"
        color="primary"
        density="comfortable"
        :show-arrows="false"
      >
        <v-tab
          v-for="(category, index) in categories"
          :id="`skill-category-tab-${index}`"
          :key="category.title"
          :aria-controls="`skill-category-panel-${index}`"
          class="skills-carousel__tab text-none"
          :value="index"
        >
          {{ category.title }}
        </v-tab>
      </v-tabs>

      <v-btn
        aria-label="Show next skill category"
        class="skills-carousel__step-control"
        :disabled="activeIndex === categories.length - 1"
        icon="mdi-chevron-right"
        size="small"
        variant="text"
        @click="showCategory(activeIndex + 1)"
      />
    </div>

    <div v-if="activeCategory" class="skills-carousel__stage">
      <button
        v-if="previousCategory"
        :aria-label="`Show previous category: ${previousCategory.title}`"
        class="skills-carousel__peek skills-carousel__peek--previous"
        type="button"
        @click="showCategory(activeIndex - 1)"
      >
        <v-icon aria-hidden="true" icon="mdi-chevron-left" />
        <span>{{ previousCategory.title }}</span>
      </button>

      <v-window
        v-model="activeIndex"
        class="skills-carousel__window"
        :continuous="false"
        mandatory
        touch
      >
        <v-window-item
          v-for="(category, index) in categories"
          :id="`skill-category-panel-${index}`"
          :key="category.title"
          :aria-labelledby="`skill-category-tab-${index}`"
          role="tabpanel"
          :value="index"
        >
          <article class="skills-carousel__slide">
            <SkillCategoryCard :category="category" />
          </article>
        </v-window-item>
      </v-window>

      <button
        v-if="nextCategory"
        :aria-label="`Show next category: ${nextCategory.title}`"
        class="skills-carousel__peek skills-carousel__peek--next"
        type="button"
        @click="showCategory(activeIndex + 1)"
      >
        <span>{{ nextCategory.title }}</span>
        <v-icon aria-hidden="true" icon="mdi-chevron-right" />
      </button>
    </div>

    <div v-if="activeCategory" class="skills-carousel__status">
      <p aria-live="polite">
        {{ activeCategory.title }} · {{ activeIndex + 1 }} of {{ categories.length }}
      </p>

      <p v-if="hasMultipleCategories" class="skills-carousel__swipe-hint">
        <v-icon aria-hidden="true" icon="mdi-gesture-swipe-horizontal" size="small" />
        <span>Swipe or use the category controls to explore</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
  .skills-carousel {
    display: grid;
    gap: 16px;
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .skills-carousel__navigation {
    align-items: center;
    background: color-mix(in srgb, var(--portfolio-surface-start) 78%, transparent);
    border: 1px solid var(--portfolio-border);
    border-radius: 18px;
    display: grid;
    gap: 4px;
    grid-template-columns: minmax(0, 1fr);
    margin-inline: auto;
    max-width: 920px;
    min-width: 0;
    padding: 4px;
    width: 100%;
  }

  .skills-carousel__tabs {
    min-width: 0;
  }

  .skills-carousel__step-control {
    display: none;
  }

  .skills-carousel__tab {
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    min-width: max-content;
    padding-inline: 16px;
  }

  .skills-carousel__stage {
    isolation: isolate;
    min-width: 0;
    overflow: hidden;
    padding-block: 8px;
    position: relative;
    width: 100%;
  }

  .skills-carousel__window {
    margin-inline: auto;
    position: relative;
    width: min(720px, 100%);
    z-index: 2;
  }

  .skills-carousel__slide {
    min-width: 0;
    padding: 4px;
    width: 100%;
  }

  .skills-carousel__peek {
    align-items: center;
    appearance: none;
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--portfolio-accent) 11%, var(--portfolio-surface-start)),
        color-mix(in srgb, var(--portfolio-surface-end) 90%, transparent)
      );
    border: 1px solid var(--portfolio-border);
    border-radius: 22px;
    color: var(--portfolio-text-muted);
    cursor: pointer;
    display: none;
    font-size: 0.78rem;
    font-weight: 700;
    gap: 8px;
    height: calc(100% - 48px);
    max-height: 420px;
    min-height: 180px;
    overflow: hidden;
    padding: 20px;
    position: absolute;
    text-align: left;
    top: 24px;
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
    width: min(240px, 28%);
    z-index: 1;
  }

  .skills-carousel__peek--previous {
    justify-content: flex-start;
    left: 0;
    padding-right: 56px;
  }

  .skills-carousel__peek--next {
    justify-content: flex-end;
    padding-left: 56px;
    right: 0;
    text-align: right;
  }

  .skills-carousel__peek:hover,
  .skills-carousel__peek:focus-visible {
    border-color: color-mix(in srgb, var(--portfolio-accent) 54%, var(--portfolio-border));
    box-shadow: 0 14px 34px color-mix(in srgb, var(--portfolio-accent) 12%, transparent);
    outline: none;
  }

  .skills-carousel__peek--previous:hover,
  .skills-carousel__peek--previous:focus-visible {
    transform: translateX(-3px);
  }

  .skills-carousel__peek--next:hover,
  .skills-carousel__peek--next:focus-visible {
    transform: translateX(3px);
  }

  .skills-carousel__status {
    align-items: center;
    color: var(--portfolio-text-muted);
    display: flex;
    font-size: 0.82rem;
    gap: 16px;
    justify-content: space-between;
    margin-inline: auto;
    max-width: 720px;
    width: min(720px, 100%);
  }

  .skills-carousel__status p {
    margin: 0;
  }

  .skills-carousel__swipe-hint {
    align-items: center;
    display: none;
    gap: 6px;
  }

  @media (max-width: 959px) {
    .skills-carousel__navigation {
      grid-template-columns: auto minmax(0, 1fr) auto;
    }

    .skills-carousel__step-control {
      display: inline-flex;
    }

    .skills-carousel__window {
      width: min(680px, calc(100% - 48px));
    }

    .skills-carousel__peek {
      display: flex;
      padding: 14px;
      width: 86px;
    }

    .skills-carousel__peek span {
      display: none;
    }

    .skills-carousel__peek--previous {
      padding-right: 38px;
    }

    .skills-carousel__peek--next {
      padding-left: 38px;
    }

    .skills-carousel__status {
      width: calc(100% - 48px);
    }

    .skills-carousel__swipe-hint {
      display: flex;
    }
  }

  @media (max-width: 600px) {
    .skills-carousel {
      gap: 12px;
    }

    .skills-carousel__navigation {
      border-radius: 16px;
    }

    .skills-carousel__window {
      width: calc(100% - 32px);
    }

    .skills-carousel__slide {
      padding: 2px;
    }

    .skills-carousel__peek {
      border-radius: 18px;
      width: 62px;
    }

    .skills-carousel__peek--previous {
      padding-left: 8px;
      padding-right: 28px;
    }

    .skills-carousel__peek--next {
      padding-left: 28px;
      padding-right: 8px;
    }

    .skills-carousel__status {
      align-items: flex-start;
      display: grid;
      gap: 6px;
      width: calc(100% - 32px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .skills-carousel__window {
      --v-window-transition-duration: 0ms;
    }

    .skills-carousel__peek {
      transition: none;
    }

    .skills-carousel__peek:hover,
    .skills-carousel__peek:focus-visible {
      transform: none;
    }
  }
</style>
