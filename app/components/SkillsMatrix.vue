<script setup lang="ts">
  import type { SkillCategory } from '@/composables/usePortfolioData'

  defineProps<{
    categories: SkillCategory[]
  }>()
</script>

<template>
  <div class="skills-matrix">
    <v-row>
      <v-col
        v-for="category in categories"
        :key="category.title"
        cols="12"
        md="6"
      >
        <SkillCategoryCard :category="category" />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
  .skills-matrix {
    display: grid;
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .skills-matrix :deep(.v-row),
  .skills-matrix :deep(.v-col) {
    max-width: 100%;
    min-width: 0;
  }

  .skills-matrix :deep(.v-row) {
    width: 100%;
  }
</style>
