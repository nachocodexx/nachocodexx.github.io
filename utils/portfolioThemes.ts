interface PortfolioVuetifyTheme {
  dark: boolean
  colors: Record<string, string>
}

interface PortfolioCssVars {
  [key: `--${string}`]: string
}

export interface PortfolioThemeDefinition {
  name: string
  label: string
  description: string
  themeColor: string
  vuetify: PortfolioVuetifyTheme
  cssVars: PortfolioCssVars
}

function definePortfolioTheme (theme: PortfolioThemeDefinition) {
  return theme
}

export const PORTFOLIO_THEMES = {
  obsidianNight: definePortfolioTheme({
    name: 'obsidianNight',
    label: 'Obsidian night',
    description: 'Deep black surfaces with restrained electric blue accents.',
    themeColor: '#040506',
    vuetify: {
      dark: true,
      colors: {
        background: '#040506',
        surface: '#0b0f14',
        'surface-bright': '#101826',
        'surface-light': '#121926',
        'surface-variant': '#101826',
        primary: '#4da3ff',
        secondary: '#24486e',
        info: '#63b2ff',
        success: '#63d4b7',
        warning: '#f0b85d',
      },
    },
    cssVars: {
      '--portfolio-bg': '#040506',
      '--portfolio-bg-elevated': '#0b0f14',
      '--portfolio-bg-soft': '#101826',
      '--portfolio-body-start': '#06080b',
      '--portfolio-body-middle': '#040506',
      '--portfolio-body-end': '#030405',
      '--portfolio-page-surface-start': 'rgba(16, 24, 38, 0.65)',
      '--portfolio-page-surface-end': 'rgba(7, 10, 15, 0.92)',
      '--portfolio-surface-start': 'rgba(14, 19, 29, 0.92)',
      '--portfolio-surface-end': 'rgba(9, 13, 20, 0.98)',
      '--portfolio-nav-bg': 'rgba(4, 5, 6, 0.55)',
      '--portfolio-nav-border': 'rgba(119, 175, 255, 0.12)',
      '--portfolio-border': 'rgba(119, 175, 255, 0.18)',
      '--portfolio-border-strong': 'rgba(119, 175, 255, 0.35)',
      '--portfolio-text': '#f4f7fb',
      '--portfolio-text-muted': 'rgba(226, 235, 250, 0.74)',
      '--portfolio-text-soft': 'rgba(226, 235, 250, 0.86)',
      '--portfolio-accent': '#4da3ff',
      '--portfolio-accent-soft': 'rgba(77, 163, 255, 0.12)',
      '--portfolio-accent-strong': 'rgba(77, 163, 255, 0.55)',
      '--portfolio-spotlight': 'rgba(77, 163, 255, 0.14)',
      '--portfolio-overlay-start': 'rgba(4, 5, 6, 0.92)',
      '--portfolio-overlay-mid': 'rgba(4, 5, 6, 0.62)',
      '--portfolio-overlay-end': 'rgba(4, 5, 6, 0.88)',
      '--portfolio-shadow': '0 24px 60px rgba(0, 0, 0, 0.4)',
      '--portfolio-code-bg': 'rgba(77, 163, 255, 0.08)',
      '--portfolio-code-text': '#cfe6ff',
      '--portfolio-pre-bg': 'rgba(8, 11, 17, 0.95)',
      '--portfolio-chat-panel': 'rgba(7, 10, 15, 0.96)',
      '--portfolio-chat-divider': 'rgba(119, 175, 255, 0.14)',
      '--portfolio-message-assistant': 'rgba(77, 163, 255, 0.1)',
      '--portfolio-message-user': 'rgba(255, 255, 255, 0.06)',
      '--portfolio-fab-shadow': '0 18px 45px rgba(15, 33, 56, 0.55)',
      '--portfolio-skill-visual-bg': 'rgba(6, 9, 14, 0.72)',
      '--portfolio-skill-visual-border': 'rgba(119, 175, 255, 0.18)',
      '--portfolio-node-fill-rgb': '77, 163, 255',
      '--portfolio-node-line-rgb': '115, 182, 255',
      '--portfolio-node-highlight-rgb': '170, 212, 255',
    },
  }),
  cenoteBlue: definePortfolioTheme({
    name: 'cenoteBlue',
    label: 'Cenote blue',
    description: 'A cooler midnight palette with cyan-blue architectural highlights.',
    themeColor: '#07111b',
    vuetify: {
      dark: true,
      colors: {
        background: '#07111b',
        surface: '#0c1721',
        'surface-bright': '#132536',
        'surface-light': '#173148',
        'surface-variant': '#12263a',
        primary: '#5db7ff',
        secondary: '#326993',
        info: '#80ccff',
        success: '#67d6ba',
        warning: '#f2c36a',
      },
    },
    cssVars: {
      '--portfolio-bg': '#07111b',
      '--portfolio-bg-elevated': '#0c1721',
      '--portfolio-bg-soft': '#132536',
      '--portfolio-body-start': '#08131e',
      '--portfolio-body-middle': '#07111b',
      '--portfolio-body-end': '#050d14',
      '--portfolio-page-surface-start': 'rgba(19, 37, 54, 0.7)',
      '--portfolio-page-surface-end': 'rgba(9, 16, 24, 0.94)',
      '--portfolio-surface-start': 'rgba(17, 27, 39, 0.94)',
      '--portfolio-surface-end': 'rgba(10, 18, 28, 0.98)',
      '--portfolio-nav-bg': 'rgba(7, 17, 27, 0.6)',
      '--portfolio-nav-border': 'rgba(121, 197, 255, 0.16)',
      '--portfolio-border': 'rgba(121, 197, 255, 0.2)',
      '--portfolio-border-strong': 'rgba(121, 197, 255, 0.38)',
      '--portfolio-text': '#eff8ff',
      '--portfolio-text-muted': 'rgba(220, 239, 255, 0.74)',
      '--portfolio-text-soft': 'rgba(220, 239, 255, 0.86)',
      '--portfolio-accent': '#5db7ff',
      '--portfolio-accent-soft': 'rgba(93, 183, 255, 0.14)',
      '--portfolio-accent-strong': 'rgba(93, 183, 255, 0.62)',
      '--portfolio-spotlight': 'rgba(93, 183, 255, 0.18)',
      '--portfolio-overlay-start': 'rgba(7, 17, 27, 0.9)',
      '--portfolio-overlay-mid': 'rgba(7, 17, 27, 0.56)',
      '--portfolio-overlay-end': 'rgba(6, 13, 21, 0.86)',
      '--portfolio-shadow': '0 24px 60px rgba(2, 10, 18, 0.48)',
      '--portfolio-code-bg': 'rgba(93, 183, 255, 0.1)',
      '--portfolio-code-text': '#d5efff',
      '--portfolio-pre-bg': 'rgba(7, 14, 21, 0.96)',
      '--portfolio-chat-panel': 'rgba(8, 15, 24, 0.97)',
      '--portfolio-chat-divider': 'rgba(121, 197, 255, 0.16)',
      '--portfolio-message-assistant': 'rgba(93, 183, 255, 0.12)',
      '--portfolio-message-user': 'rgba(255, 255, 255, 0.06)',
      '--portfolio-fab-shadow': '0 18px 45px rgba(8, 39, 68, 0.5)',
      '--portfolio-skill-visual-bg': 'rgba(8, 15, 24, 0.76)',
      '--portfolio-skill-visual-border': 'rgba(121, 197, 255, 0.22)',
      '--portfolio-node-fill-rgb': '93, 183, 255',
      '--portfolio-node-line-rgb': '128, 204, 255',
      '--portfolio-node-highlight-rgb': '194, 233, 255',
    },
  }),
  solarEmber: definePortfolioTheme({
    name: 'solarEmber',
    label: 'Solar ember',
    description: 'Dark obsidian surfaces with restrained amber highlights.',
    themeColor: '#0a0908',
    vuetify: {
      dark: true,
      colors: {
        background: '#0a0908',
        surface: '#15110e',
        'surface-bright': '#231912',
        'surface-light': '#2b1f16',
        'surface-variant': '#24180f',
        primary: '#e58a2f',
        secondary: '#8d5520',
        info: '#f0a95f',
        success: '#7ed2ad',
        warning: '#f3c16d',
      },
    },
    cssVars: {
      '--portfolio-bg': '#0a0908',
      '--portfolio-bg-elevated': '#15110e',
      '--portfolio-bg-soft': '#231912',
      '--portfolio-body-start': '#120d09',
      '--portfolio-body-middle': '#0a0908',
      '--portfolio-body-end': '#080706',
      '--portfolio-page-surface-start': 'rgba(35, 25, 18, 0.72)',
      '--portfolio-page-surface-end': 'rgba(12, 9, 7, 0.95)',
      '--portfolio-surface-start': 'rgba(28, 20, 15, 0.94)',
      '--portfolio-surface-end': 'rgba(17, 13, 10, 0.98)',
      '--portfolio-nav-bg': 'rgba(10, 9, 8, 0.62)',
      '--portfolio-nav-border': 'rgba(229, 138, 47, 0.16)',
      '--portfolio-border': 'rgba(229, 138, 47, 0.2)',
      '--portfolio-border-strong': 'rgba(229, 138, 47, 0.38)',
      '--portfolio-text': '#fbf3ec',
      '--portfolio-text-muted': 'rgba(247, 233, 219, 0.74)',
      '--portfolio-text-soft': 'rgba(247, 233, 219, 0.88)',
      '--portfolio-accent': '#e58a2f',
      '--portfolio-accent-soft': 'rgba(229, 138, 47, 0.14)',
      '--portfolio-accent-strong': 'rgba(229, 138, 47, 0.55)',
      '--portfolio-spotlight': 'rgba(229, 138, 47, 0.16)',
      '--portfolio-overlay-start': 'rgba(10, 9, 8, 0.9)',
      '--portfolio-overlay-mid': 'rgba(10, 9, 8, 0.58)',
      '--portfolio-overlay-end': 'rgba(12, 9, 7, 0.86)',
      '--portfolio-shadow': '0 24px 60px rgba(0, 0, 0, 0.44)',
      '--portfolio-code-bg': 'rgba(229, 138, 47, 0.1)',
      '--portfolio-code-text': '#ffd7ad',
      '--portfolio-pre-bg': 'rgba(14, 10, 8, 0.96)',
      '--portfolio-chat-panel': 'rgba(15, 11, 8, 0.97)',
      '--portfolio-chat-divider': 'rgba(229, 138, 47, 0.16)',
      '--portfolio-message-assistant': 'rgba(229, 138, 47, 0.12)',
      '--portfolio-message-user': 'rgba(255, 255, 255, 0.06)',
      '--portfolio-fab-shadow': '0 18px 45px rgba(74, 37, 10, 0.48)',
      '--portfolio-skill-visual-bg': 'rgba(18, 13, 10, 0.84)',
      '--portfolio-skill-visual-border': 'rgba(229, 138, 47, 0.22)',
      '--portfolio-node-fill-rgb': '229, 138, 47',
      '--portfolio-node-line-rgb': '244, 170, 97',
      '--portfolio-node-highlight-rgb': '255, 213, 163',
    },
  }),
  limestoneLight: definePortfolioTheme({
    name: 'limestoneLight',
    label: 'Limestone light',
    description: 'Warm stone surfaces with crisp blue accents for daylight reading.',
    themeColor: '#f4efe6',
    vuetify: {
      dark: false,
      colors: {
        background: '#f4efe6',
        surface: '#fffaf1',
        'surface-bright': '#ffffff',
        'surface-light': '#f7f1e8',
        'surface-variant': '#e6dccf',
        primary: '#2d72c9',
        secondary: '#7b8aa5',
        info: '#2d72c9',
        success: '#22806e',
        warning: '#bb7c1f',
      },
    },
    cssVars: {
      '--portfolio-bg': '#f4efe6',
      '--portfolio-bg-elevated': '#fffaf1',
      '--portfolio-bg-soft': '#e9dfd1',
      '--portfolio-body-start': '#faf5ee',
      '--portfolio-body-middle': '#f4efe6',
      '--portfolio-body-end': '#ece3d5',
      '--portfolio-page-surface-start': 'rgba(255, 250, 241, 0.94)',
      '--portfolio-page-surface-end': 'rgba(244, 239, 230, 0.98)',
      '--portfolio-surface-start': 'rgba(255, 250, 241, 0.96)',
      '--portfolio-surface-end': 'rgba(246, 241, 232, 0.98)',
      '--portfolio-nav-bg': 'rgba(255, 250, 241, 0.72)',
      '--portfolio-nav-border': 'rgba(45, 114, 201, 0.16)',
      '--portfolio-border': 'rgba(45, 114, 201, 0.18)',
      '--portfolio-border-strong': 'rgba(45, 114, 201, 0.28)',
      '--portfolio-text': '#1c2430',
      '--portfolio-text-muted': 'rgba(28, 36, 48, 0.74)',
      '--portfolio-text-soft': 'rgba(28, 36, 48, 0.86)',
      '--portfolio-accent': '#2d72c9',
      '--portfolio-accent-soft': 'rgba(45, 114, 201, 0.12)',
      '--portfolio-accent-strong': 'rgba(45, 114, 201, 0.48)',
      '--portfolio-spotlight': 'rgba(45, 114, 201, 0.09)',
      '--portfolio-overlay-start': 'rgba(244, 239, 230, 0.88)',
      '--portfolio-overlay-mid': 'rgba(244, 239, 230, 0.54)',
      '--portfolio-overlay-end': 'rgba(236, 227, 213, 0.84)',
      '--portfolio-shadow': '0 24px 60px rgba(61, 71, 88, 0.14)',
      '--portfolio-code-bg': 'rgba(45, 114, 201, 0.1)',
      '--portfolio-code-text': '#174883',
      '--portfolio-pre-bg': 'rgba(248, 243, 235, 0.98)',
      '--portfolio-chat-panel': 'rgba(255, 250, 241, 0.97)',
      '--portfolio-chat-divider': 'rgba(45, 114, 201, 0.12)',
      '--portfolio-message-assistant': 'rgba(45, 114, 201, 0.08)',
      '--portfolio-message-user': 'rgba(28, 36, 48, 0.06)',
      '--portfolio-fab-shadow': '0 18px 45px rgba(45, 114, 201, 0.18)',
      '--portfolio-skill-visual-bg': 'rgba(253, 248, 239, 0.92)',
      '--portfolio-skill-visual-border': 'rgba(45, 114, 201, 0.18)',
      '--portfolio-node-fill-rgb': '45, 114, 201',
      '--portfolio-node-line-rgb': '73, 142, 227',
      '--portfolio-node-highlight-rgb': '147, 191, 245',
    },
  }),
} as const

export type PortfolioThemeName = keyof typeof PORTFOLIO_THEMES

export const DEFAULT_PORTFOLIO_THEME: PortfolioThemeName = 'cenoteBlue'

export const PORTFOLIO_THEME_OPTIONS = Object.values(PORTFOLIO_THEMES)

export const PORTFOLIO_THEME_STORAGE_KEY = 'portfolio-theme'

export const VUETIFY_PORTFOLIO_THEMES = Object.fromEntries(
  Object.values(PORTFOLIO_THEMES).map(theme => [theme.name, theme.vuetify]),
) as Record<PortfolioThemeName, PortfolioVuetifyTheme>

export function getPortfolioTheme (name?: string) {
  if (name && name in PORTFOLIO_THEMES) {
    return PORTFOLIO_THEMES[name as PortfolioThemeName]
  }

  return PORTFOLIO_THEMES[DEFAULT_PORTFOLIO_THEME]
}

export function serializeThemeCssVars (theme: PortfolioThemeDefinition, selector = ':root') {
  const entries = Object.entries(theme.cssVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('')

  return `${selector} {${entries}}`
}

export function serializeAllThemeCssVars () {
  const defaultTheme = getPortfolioTheme(DEFAULT_PORTFOLIO_THEME)
  const themedBlocks = Object.values(PORTFOLIO_THEMES)
    .map(theme => serializeThemeCssVars(theme, `:root[data-portfolio-theme="${theme.name}"]`))
    .join('')

  return `${serializeThemeCssVars(defaultTheme)}${themedBlocks}`
}

export function createThemeBootScript () {
  const validThemes = JSON.stringify(Object.keys(PORTFOLIO_THEMES))

  return `(() => {
    const storageKey = ${JSON.stringify(PORTFOLIO_THEME_STORAGE_KEY)};
    const validThemes = new Set(${validThemes});
    const savedTheme = window.localStorage.getItem(storageKey);
    const theme = savedTheme && validThemes.has(savedTheme) ? savedTheme : ${JSON.stringify(DEFAULT_PORTFOLIO_THEME)};
    document.documentElement.setAttribute('data-portfolio-theme', theme);
  })();`
}
