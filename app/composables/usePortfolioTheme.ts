import type { PortfolioThemeName } from '~~/utils/portfolioThemes'
import { computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import {
  DEFAULT_PORTFOLIO_THEME,
  getPortfolioTheme,
  PORTFOLIO_THEME_OPTIONS,
  PORTFOLIO_THEME_STORAGE_KEY,
  PORTFOLIO_THEMES,
} from '~~/utils/portfolioThemes'

export function usePortfolioThemeState () {
  const themeName = useState<PortfolioThemeName>('portfolio-theme-name', () => DEFAULT_PORTFOLIO_THEME)

  const activeTheme = computed(() => getPortfolioTheme(themeName.value))

  function setTheme (name: PortfolioThemeName) {
    themeName.value = name
  }

  return {
    activeTheme,
    setTheme,
    themeName,
    themeOptions: PORTFOLIO_THEME_OPTIONS,
  }
}

export function usePortfolioThemeController () {
  const { activeTheme, themeName } = usePortfolioThemeState()
  const vuetifyTheme = useTheme()

  if (import.meta.client) {
    const savedTheme = window.localStorage.getItem(PORTFOLIO_THEME_STORAGE_KEY)

    if (savedTheme && savedTheme in PORTFOLIO_THEMES) {
      themeName.value = savedTheme as PortfolioThemeName
    }
  }

  useHead(() => ({
    htmlAttrs: {
      'data-portfolio-theme': activeTheme.value.name,
    },
    meta: [
      {
        name: 'theme-color',
        content: activeTheme.value.themeColor,
      },
    ],
  }))

  watch(
    activeTheme,
    (theme) => {
      vuetifyTheme.global.name.value = theme.name
    },
    { immediate: true },
  )

  if (import.meta.client) {
    watch(
      themeName,
      (value) => {
        window.localStorage.setItem(PORTFOLIO_THEME_STORAGE_KEY, value)
      },
      { immediate: true },
    )
  }
}
