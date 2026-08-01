<script setup lang="ts">
  const props = withDefaults(defineProps<{
    class?: string | null
    code?: string
    filename?: string | null
    highlights?: number[]
    language?: string | null
    meta?: string | null
  }>(), {
    class: null,
    code: '',
    filename: null,
    highlights: () => [],
    language: null,
    meta: null,
  })

  const isMermaid = computed(() => props.language?.toLowerCase() === 'mermaid')
</script>

<template>
  <MermaidDiagram v-if="isMermaid" :source="props.code" />
  <pre v-else :class="props.class"><slot /></pre>
</template>

<style>
  pre code .line {
    display: block;
  }
</style>
