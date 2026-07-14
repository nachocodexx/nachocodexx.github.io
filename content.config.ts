import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
import { PORTFOLIO_SKILL_SLUGS } from './utils/portfolioContent'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        readingTime: z.string().optional(),
        skills: z.array(z.enum(PORTFOLIO_SKILL_SLUGS)).default([]),
        tags: z.array(z.string()).default([]),
      }),
    }),
  },
})
