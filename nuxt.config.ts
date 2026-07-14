import { PROJECT_ROUTE_PATHS, SKILL_ROUTE_PATHS } from './utils/portfolioContent'
import {
  createThemeBootScript,
  DEFAULT_PORTFOLIO_THEME,
  serializeAllThemeCssVars,
  VUETIFY_PORTFOLIO_THEMES,
} from './utils/portfolioThemes'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-21',
  ssr: false,
  devtools: { enabled: true },

  modules: ['@nuxt/fonts', 'vuetify-nuxt-module', '@nuxt/eslint', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/content'],

  css: ['@mdi/font/css/materialdesignicons.css', '@/assets/styles/main.scss'],

  app: {
    baseURL: '/',
    // process.env.NUXT_APP_BASE_URL ?? (process.env.NODE_ENV === 'production' ? '/personal-blog/' : '/'),
    head: {
      title: 'Ignacio Castillo',
      meta: [
        {
          name: 'description',
          content: 'Personal portfolio, academic repository, and technical blog for Ignacio Castillo.',
        },
      ],
      script: [
        {
          innerHTML: createThemeBootScript(),
        },
      ],
      style: [
        {
          innerHTML: serializeAllThemeCssVars(),
        },
      ],
    },
  },

  nitro: {
    preset: 'github-pages',
    prerender: {
      crawlLinks: true,
      routes: ['/', ...SKILL_ROUTE_PATHS, ...PROJECT_ROUTE_PATHS],
    },
  },

  routeRules: {
    '/**': { prerender: true },
  },

  vuetify: {
    moduleOptions: {
      styles: { configFile: 'assets/styles/settings.scss' },
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: DEFAULT_PORTFOLIO_THEME,
        themes: VUETIFY_PORTFOLIO_THEMES,
      },
    },
  },

  eslint: {
    config: {
      import: {
        package: 'eslint-plugin-import-lite',
      },
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
      },
    ],
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
  },

  content: {
    experimental: {
      sqliteConnector: 'native',
    },
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
          langs: ['ts', 'js', 'vue', 'shell', 'python', 'rust', 'scala', 'json', 'yaml'],
        },
      },
    },
  },
})