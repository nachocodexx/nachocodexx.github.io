<script setup lang="ts">
  import type { ProjectEntry } from '@/composables/usePortfolioData'

  const props = withDefaults(defineProps<{
    project: Pick<ProjectEntry, 'title' | 'logo'>
    size?: 'compact' | 'default' | 'hero'
  }>(), {
    size: 'default',
  })

  const fallbackLabel = computed(() => {
    if (props.project.logo?.label) {
      return props.project.logo.label
    }

    return props.project.title
      .split(/\s+/)
      .slice(0, 3)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('')
  })
</script>

<template>
  <div :class="['project-logo-badge', `project-logo-badge--${size}`]">
    <v-img
      v-if="project.logo?.src"
      :alt="project.logo.alt ?? `${project.title} logo`"
      cover
      :src="project.logo.src"
    />

    <span v-else class="project-logo-badge__fallback">
      {{ fallbackLabel }}
    </span>
  </div>
</template>

<style scoped>
  .project-logo-badge {
    align-items: center;
    background:
      radial-gradient(circle at top, color-mix(in srgb, var(--portfolio-accent) 24%, transparent), transparent 55%),
      linear-gradient(180deg, var(--portfolio-surface-start), var(--portfolio-surface-end));
    border: 1px solid color-mix(in srgb, var(--portfolio-accent) 32%, var(--portfolio-border));
    border-radius: 22px;
    box-shadow: var(--portfolio-shadow);
    color: var(--portfolio-text);
    display: inline-flex;
    flex-shrink: 0;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .project-logo-badge--compact {
    height: 54px;
    width: 54px;
  }

  .project-logo-badge--default {
    height: 68px;
    width: 68px;
  }

  .project-logo-badge--hero {
    border-radius: 26px;
    height: 104px;
    width: 104px;
  }

  .project-logo-badge :deep(.v-img) {
    height: 100%;
    width: 100%;
  }

  .project-logo-badge__fallback {
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .project-logo-badge--hero .project-logo-badge__fallback {
    font-size: 1.35rem;
  }

  @media (max-width: 600px) {
    .project-logo-badge--hero {
      border-radius: 20px;
      height: 80px;
      width: 80px;
    }

    .project-logo-badge--default {
      height: 58px;
      width: 58px;
    }
  }
</style>
