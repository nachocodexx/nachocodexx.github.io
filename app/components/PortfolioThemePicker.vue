<script setup lang="ts">
  import type { PortfolioThemeName } from '~~/utils/portfolioThemes'

  withDefaults(defineProps<{
    compact?: boolean
  }>(), {
    compact: false,
  })

  const { activeTheme, setTheme, themeOptions } = usePortfolioThemeState()

  function selectTheme (name: PortfolioThemeName) {
    setTheme(name)
  }
</script>

<template>
  <v-menu location="bottom end">
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        class="portfolio-theme-picker__button text-none"
        :icon="compact ? 'mdi-palette-outline' : undefined"
        prepend-icon="mdi-palette-outline"
        rounded="xl"
        variant="outlined"
      >
        <span v-if="!compact">{{ activeTheme.label }}</span>
      </v-btn>
    </template>

    <v-card class="portfolio-theme-picker glass-card" rounded="xl">
      <div class="portfolio-theme-picker__header">
        <p class="portfolio-theme-picker__eyebrow">
          Theme
        </p>

        <strong>{{ activeTheme.label }}</strong>
      </div>

      <v-list bg-color="transparent" class="py-0">
        <v-list-item
          v-for="theme in themeOptions"
          :key="theme.name"
          class="portfolio-theme-picker__item"
          @click="selectTheme(theme.name as PortfolioThemeName)"
        >
          <template #prepend>
            <span
              class="portfolio-theme-picker__swatch"
              :style="{
                background: `linear-gradient(135deg, ${theme.cssVars['--portfolio-bg-elevated']} 0%, ${theme.cssVars['--portfolio-accent']} 100%)`,
              }"
            />
          </template>

          <v-list-item-title>
            {{ theme.label }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ theme.description }}
          </v-list-item-subtitle>

          <template #append>
            <v-icon
              v-if="theme.name === activeTheme.name"
              color="primary"
              icon="mdi-check-circle"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped>
  .portfolio-theme-picker__button {
    border-color: var(--portfolio-nav-border);
    color: var(--portfolio-text-muted);
  }

  .portfolio-theme-picker {
    border: 1px solid var(--portfolio-border-strong);
    width: min(292px, calc(100vw - 32px));
  }

  .portfolio-theme-picker__header {
    border-bottom: 1px solid var(--portfolio-border);
    padding: 18px 20px 14px;
  }

  .portfolio-theme-picker__eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    margin: 0 0 4px;
    text-transform: uppercase;
  }

  .portfolio-theme-picker__item {
    padding-bottom: 12px;
    padding-top: 12px;
  }

  :deep(.v-list-item-subtitle) {
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .portfolio-theme-picker__swatch {
    border: 1px solid var(--portfolio-border);
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
    display: inline-flex;
    height: 16px;
    margin-right: 8px;
    width: 16px;
  }
</style>
