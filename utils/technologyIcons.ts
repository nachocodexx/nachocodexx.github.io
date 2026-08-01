const TECHNOLOGY_ICONS: Readonly<Record<string, string>> = {
  angular: 'mdi-angular',
  asyncio: 'mdi-sync',
  docker: 'mdi-docker',
  fastapi: 'mdi-api',
  httpx: 'mdi-web',
  javascript: 'mdi-language-javascript',
  mkdocs: 'mdi-book-open-page-variant-outline',
  mongodb: 'mdi-leaf',
  'node.js': 'mdi-nodejs',
  nuitka: 'mdi-package-variant-closed',
  oop: 'mdi-cube-outline',
  opentelemetry: 'mdi-chart-timeline-variant-shimmer',
  pinia: 'mdi-fruit-pineapple',
  poetry: 'mdi-feather',
  pydantic: 'mdi-shield-check-outline',
  pytest: 'mdi-test-tube',
  python: 'mdi-language-python',
  react: 'mdi-react',
  redis: 'mdi-lightning-bolt-outline',
  rust: 'mdi-language-rust',
  sleddb: 'mdi-database-cog-outline',
  swagger: 'mdi-api',
  tinydb: 'mdi-database-outline',
  typescript: 'mdi-language-typescript',
  vite: 'mdi-lightning-bolt',
  vue: 'mdi-vuejs',
  vuetify: 'mdi-vuetify',
  yaml: 'mdi-code-json',
  zensical: 'mdi-book-open-page-variant-outline',
  zeromq: 'mdi-access-point',
}

const DEFAULT_TECHNOLOGY_ICON = 'mdi-code-tags'

export function getTechnologyIcon (technology: string) {
  return TECHNOLOGY_ICONS[technology.trim().toLowerCase()] ?? DEFAULT_TECHNOLOGY_ICON
}
