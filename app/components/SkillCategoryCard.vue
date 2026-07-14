<script setup lang="ts">
  import type { SkillCategory } from '@/composables/usePortfolioData'

  defineProps<{
    category: SkillCategory
  }>()

  function getLevelSteps (level: number) {
    const activeSteps = Math.max(1, Math.min(5, Math.round(level / 20)))

    return Array.from({ length: 5 }, (_, index) => index < activeSteps)
  }
</script>

<template>
  <v-card class="skill-category-card glass-card h-100 pa-6" rounded="xl">
    <div class="skill-category-card__header">
      <div>
        <p class="skill-category-card__title">
          {{ category.title }}
        </p>

        <p class="skill-category-card__description">
          {{ category.description }}
        </p>
      </div>
    </div>

    <div class="skill-category-card__items">
      <NuxtLink
        v-for="skill in category.items"
        :key="skill.slug"
        class="skill-category-card__item"
        :to="`/skills/${skill.slug}`"
      >
        <div class="skill-category-card__item-top">
          <div class="skill-category-card__item-copy">
            <div class="skill-category-card__item-heading">
              <span class="skill-category-card__item-icon">
                <v-icon :icon="skill.icon" size="18" />
              </span>

              <strong class="skill-category-card__item-label">{{ skill.name }}</strong>
            </div>

            <p v-if="skill.note" class="skill-category-card__item-note">
              {{ skill.note }}
            </p>
          </div>

          <div class="skill-category-card__item-meta">
            <div :aria-label="`${skill.level}% proficiency`" class="skill-category-card__level-icons">
              <v-icon
                v-for="(isActive, index) in getLevelSteps(skill.level)"
                :key="`${skill.name}-${index}`"
                :class="['skill-category-card__level-icon', { 'skill-category-card__level-icon--active': isActive }]"
                icon="mdi-square-rounded"
                size="10"
              />
            </div>

            <span class="skill-category-card__item-value">{{ skill.level }}%</span>
          </div>
        </div>

        <v-progress-linear
          bg-color="transparent"
          class="skill-category-card__progress"
          color="primary"
          height="8"
          :model-value="skill.level"
          rounded
        />
      </NuxtLink>
    </div>
  </v-card>
</template>

<style scoped>
  .skill-category-card {
    align-content: start;
    display: grid;
    gap: 24px;
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .skill-category-card__header {
    display: grid;
    gap: 8px;
    min-width: 0;
  }

  .skill-category-card__title {
    color: var(--portfolio-text);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    margin: 0 0 8px;
  }

  .skill-category-card__description {
    color: var(--portfolio-text-muted);
    line-height: 1.7;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .skill-category-card__items {
    display: grid;
    gap: 18px;
    min-width: 0;
  }

  .skill-category-card__item {
    background: var(--portfolio-skill-visual-bg);
    border: 1px solid transparent;
    border-radius: 18px;
    cursor: pointer;
    display: block;
    max-width: 100%;
    min-width: 0;
    padding: 14px 14px 12px;
    transition:
      border-color 220ms ease,
      transform 220ms ease,
      box-shadow 220ms ease,
      background 220ms ease;
  }

  .skill-category-card__item:focus-visible,
  .skill-category-card__item:hover {
    border-color: var(--portfolio-skill-visual-border);
    box-shadow: 0 10px 30px var(--portfolio-accent-soft);
    outline: none;
    transform: translateY(-2px);
  }

  .skill-category-card__item-top {
    align-items: flex-start;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .skill-category-card__item-copy {
    min-width: 0;
  }

  .skill-category-card__item-heading {
    align-items: center;
    display: flex;
    gap: 10px;
  }

  .skill-category-card__item-icon {
    align-items: center;
    background: var(--portfolio-accent-soft);
    border: 1px solid var(--portfolio-skill-visual-border);
    border-radius: 12px;
    color: var(--portfolio-accent);
    display: inline-flex;
    flex: 0 0 auto;
    height: 30px;
    justify-content: center;
    width: 30px;
  }

  .skill-category-card__item-label {
    color: var(--portfolio-text);
    display: block;
    font-size: 0.97rem;
    line-height: 1.35;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .skill-category-card__item-note {
    color: var(--portfolio-text-muted);
    font-size: 0.88rem;
    line-height: 1.55;
    margin: 8px 0 0;
    overflow-wrap: anywhere;
  }

  .skill-category-card__item-meta {
    align-items: flex-end;
    display: grid;
    gap: 8px;
    justify-items: end;
    white-space: nowrap;
  }

  .skill-category-card__level-icons {
    display: inline-flex;
    gap: 4px;
  }

  .skill-category-card__level-icon {
    color: var(--portfolio-border-strong);
    opacity: 0.65;
    transform: rotate(45deg);
    transition:
      color 220ms ease,
      opacity 220ms ease,
      transform 220ms ease;
  }

  .skill-category-card__level-icon--active {
    color: var(--portfolio-accent);
    opacity: 1;
  }

  .skill-category-card__item-value {
    color: var(--portfolio-accent);
    font-size: 0.86rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .skill-category-card__progress {
    opacity: 0.94;
    transition:
      opacity 220ms ease,
      transform 220ms ease;
  }

  .skill-category-card__item:focus-visible .skill-category-card__progress,
  .skill-category-card__item:hover .skill-category-card__progress {
    opacity: 1;
    transform: scaleY(1.04);
  }

  .skill-category-card__item:focus-visible .skill-category-card__level-icon--active,
  .skill-category-card__item:hover .skill-category-card__level-icon--active {
    transform: rotate(45deg) scale(1.08);
  }

  @media (max-width: 600px) {
    .skill-category-card {
      padding: 20px !important;
    }

    .skill-category-card__item {
      padding: 12px;
    }

    .skill-category-card__item-top {
      flex-direction: column;
    }

    .skill-category-card__item-meta {
      justify-items: start;
    }
  }
</style>
