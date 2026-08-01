<script setup lang="ts">
  import type { MermaidConfig } from 'mermaid'
  import { renderMermaid } from '@/utils/renderMermaid.client'

  const props = defineProps<{
    source: string
  }>()

  const { activeTheme } = usePortfolioThemeState()
  const container = ref<HTMLElement | null>(null)
  const svg = ref('')
  const renderError = ref('')
  const isRendering = ref(false)
  let renderVersion = 0

  function mermaidConfig (): MermaidConfig {
    const theme = activeTheme.value

    return {
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      flowchart: {
        useMaxWidth: true,
      },
      securityLevel: 'strict',
      sequence: {
        useMaxWidth: true,
      },
      startOnLoad: false,
      suppressErrorRendering: true,
      theme: 'base',
      themeVariables: {
        background: theme.vuetify.colors.background,
        darkMode: theme.vuetify.dark,
        lineColor: theme.vuetify.colors.primary,
        primaryBorderColor: theme.vuetify.colors.primary,
        primaryColor: theme.vuetify.colors['surface-bright'],
        primaryTextColor: theme.cssVars['--portfolio-text'],
        secondaryColor: theme.vuetify.colors['surface-variant'],
        secondaryTextColor: theme.cssVars['--portfolio-text'],
        tertiaryColor: theme.vuetify.colors.surface,
        tertiaryTextColor: theme.cssVars['--portfolio-text'],
      },
    }
  }

  function readableError (error: unknown) {
    if (!(error instanceof Error)) {
      return 'Check the Mermaid syntax in this code block.'
    }

    return error.message.split('\n').find(Boolean)
      ?? 'Check the Mermaid syntax in this code block.'
  }

  async function renderDiagram () {
    const definition = props.source.trim()
    const currentVersion = ++renderVersion

    svg.value = ''
    renderError.value = ''

    if (!definition) {
      isRendering.value = false
      renderError.value = 'The Mermaid diagram is empty.'
      return
    }

    isRendering.value = true

    try {
      const result = await renderMermaid(definition, mermaidConfig())

      if (currentVersion !== renderVersion) {
        return
      }

      svg.value = result.svg
      await nextTick()

      if (container.value) {
        result.bindFunctions?.(container.value)
      }
    } catch (error) {
      if (currentVersion === renderVersion) {
        svg.value = ''
        renderError.value = readableError(error)
      }
    } finally {
      if (currentVersion === renderVersion) {
        isRendering.value = false
      }
    }
  }

  watch(
    [() => props.source, () => activeTheme.value.name],
    () => void renderDiagram(),
    { immediate: true },
  )

  onBeforeUnmount(() => {
    renderVersion += 1
  })
</script>

<template>
  <div
    :aria-busy="isRendering"
    class="mermaid-diagram"
  >
    <div v-if="isRendering && !svg" class="mermaid-diagram__loading">
      <v-progress-circular color="primary" indeterminate size="28" width="3" />
      <span>Rendering diagram…</span>
    </div>

    <div v-else-if="renderError" class="mermaid-diagram__error" role="alert">
      <strong>Diagram could not be rendered.</strong>
      <span>{{ renderError }}</span>

      <pre><code>{{ source }}</code></pre>
    </div>

    <!-- Mermaid sanitizes the generated SVG with strict security enabled. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-else ref="container" class="mermaid-diagram__canvas" v-html="svg" />
  </div>
</template>

<style scoped>
  .mermaid-diagram {
    background: var(--portfolio-pre-bg);
    border: 1px solid var(--portfolio-border);
    border-radius: 18px;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
  }

  .mermaid-diagram__canvas {
    max-width: 100%;
    overflow-x: auto;
    padding: 24px;
  }

  .mermaid-diagram__canvas :deep(svg) {
    display: block;
    height: auto;
    margin-inline: auto;
    max-width: 100%;
  }

  .mermaid-diagram__loading,
  .mermaid-diagram__error {
    align-items: center;
    display: flex;
    gap: 12px;
    padding: 24px;
  }

  .mermaid-diagram__loading {
    color: var(--portfolio-text-muted);
    justify-content: center;
  }

  .mermaid-diagram__error {
    align-items: stretch;
    color: var(--portfolio-text-muted);
    flex-direction: column;
  }

  .mermaid-diagram__error strong {
    color: rgb(var(--v-theme-error));
  }

  .mermaid-diagram__error pre {
    margin: 8px 0 0;
    white-space: pre;
  }

  @media (max-width: 600px) {
    .mermaid-diagram__canvas,
    .mermaid-diagram__loading,
    .mermaid-diagram__error {
      padding: 16px;
    }
  }
</style>
