<script setup lang="ts">
  import { getTechnologyIcon } from '~~/utils/technologyIcons'

  const route = useRoute()
  const {
    getProjectBySlug,
    getProjectsByTitles,
    getSkillBySlug,
    navigationItems,
  } = usePortfolioData()

  const slug = computed(() => route.params.slug?.toString() ?? '')
  const project = computed(() => getProjectBySlug(slug.value))

  if (!project.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found',
    })
  }

  const relatedProjects = computed(() =>
    getProjectsByTitles(project.value.relatedProjects)
      .filter(relatedProject => relatedProject.slug !== project.value?.slug),
  )

  const unmatchedRelatedProjects = computed(() => {
    const matchedTitles = new Set(relatedProjects.value.map(relatedProject => relatedProject.title))

    return project.value.relatedProjects.filter(title => !matchedTitles.has(title))
  })

  const skillLinks = computed(() =>
    project.value.skills.flatMap((skillSlug) => {
      const skill = getSkillBySlug(skillSlug)

      return skill ? [skill] : []
    }),
  )

  const externalLinks = computed(() =>
    project.value.links.flatMap(link => (link.href ? [{ ...link, href: link.href }] : [])),
  )
  const referenceLinks = computed(() => project.value.links.filter(link => !link.href))

  useSeoMeta({
    description: project.value.summary,
    title: `${project.value.title} project`,
  })
</script>

<template>
  <div>
    <PortfolioNavigation :items="navigationItems" />

    <v-container class="page-shell" max-width="1180">
      <div class="page-surface pa-4 pa-sm-6 pa-md-10">
        <div class="project-page__hero">
          <div class="project-page__hero-copy">
            <p class="project-page__eyebrow">
              {{ project.categoryTitle }}
            </p>

            <div class="project-page__hero-title">
              <ProjectLogoBadge :project="project" size="hero" />

              <div>
                <h1 class="project-page__title">
                  {{ project.title }}
                </h1>

                <p class="project-page__description">
                  {{ project.description }}
                </p>
              </div>
            </div>

            <div class="d-flex flex-wrap ga-2 mt-5">
              <v-chip color="primary" size="small" variant="tonal">
                {{ project.type }}
              </v-chip>

              <v-chip size="small" variant="outlined">
                {{ project.developmentYear }}
              </v-chip>

              <v-chip size="small" variant="outlined">
                {{ project.technologies.length }} technologies
              </v-chip>
            </div>
          </div>

          <div class="project-page__hero-actions">
            <v-btn class="text-none" prepend-icon="mdi-arrow-left" to="/#projects" variant="outlined">
              Back to projects
            </v-btn>

            <v-btn
              v-if="externalLinks[0]?.href"
              class="text-none"
              color="primary"
              :href="externalLinks[0].href"
              prepend-icon="mdi-open-in-new"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ externalLinks[0].label }}
            </v-btn>
          </div>
        </div>

        <div class="project-page__summary-grid">
          <v-card class="glass-card pa-5" rounded="xl">
            <p class="project-page__summary-label">
              Group
            </p>

            <strong class="project-page__summary-value">{{ project.categoryTitle }}</strong>
          </v-card>

          <v-card class="glass-card pa-5" rounded="xl">
            <p class="project-page__summary-label">
              References
            </p>

            <strong class="project-page__summary-value">{{ project.links.length }}</strong>
          </v-card>

          <v-card class="glass-card pa-5" rounded="xl">
            <p class="project-page__summary-label">
              Related projects
            </p>

            <strong class="project-page__summary-value">{{ project.relatedProjects.length }}</strong>
          </v-card>

          <v-card class="glass-card pa-5" rounded="xl">
            <p class="project-page__summary-label">
              Skill signals
            </p>

            <strong class="project-page__summary-value">{{ project.skills.length }}</strong>
          </v-card>
        </div>

        <div class="project-page__sections">
          <section class="project-page__section">
            <div class="project-page__section-heading">
              <h2 class="project-page__section-title">
                Overview
              </h2>

              <p class="project-page__section-description">
                A full project snapshot persisted from the curated `projects.txt` registry into TypeScript data for the portfolio.
              </p>
            </div>

            <v-card class="glass-card pa-6" rounded="xl">
              <p class="project-page__body-copy">
                {{ project.description }}
              </p>
            </v-card>
          </section>

          <section v-if="project.gallery && project.gallery.length > 0" class="project-page__section">
            <div class="project-page__section-heading">
              <h2 class="project-page__section-title">
                Gallery
              </h2>

              <p class="project-page__section-description">
                A visual walkthrough of the project. Select any preview to open the full gallery viewer.
              </p>
            </div>

            <ProjectImageGallery
              :images="project.gallery"
              :title="project.title"
            />
          </section>

          <section class="project-page__section">
            <div class="project-page__section-heading">
              <h2 class="project-page__section-title">
                Technologies
              </h2>

              <p class="project-page__section-description">
                Core languages, frameworks, storage tools, and platform pieces associated with this work.
              </p>
            </div>

            <v-card class="glass-card pa-6" rounded="xl">
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="technology in project.technologies"
                  :key="technology"
                  class="project-page__technology-chip"
                  size="small"
                  variant="outlined"
                >
                  <v-icon
                    aria-hidden="true"
                    class="project-page__technology-icon"
                    :icon="getTechnologyIcon(technology)"
                    size="16"
                  />

                  {{ technology }}
                </v-chip>
              </div>
            </v-card>
          </section>

          <section class="project-page__section">
            <div class="project-page__section-heading">
              <h2 class="project-page__section-title">
                Links and references
              </h2>

              <p class="project-page__section-description">
                Registered resource labels from the source inventory. Live URLs can be attached later without changing the page structure.
              </p>
            </div>

            <div class="project-page__two-column-grid">
              <v-card class="glass-card pa-6" rounded="xl">
                <p class="project-page__card-label">
                  Active links
                </p>

                <div v-if="externalLinks.length > 0" class="d-flex flex-wrap ga-3">
                  <v-btn
                    v-for="link in externalLinks"
                    :key="link.label"
                    class="text-none"
                    color="primary"
                    :href="link.href"
                    prepend-icon="mdi-open-in-new"
                    rel="noopener noreferrer"
                    target="_blank"
                    variant="tonal"
                  >
                    {{ link.label }}
                  </v-btn>
                </div>

                <p v-else class="project-page__empty-state">
                  No external URL has been attached yet for this project.
                </p>
              </v-card>

              <v-card class="glass-card pa-6" rounded="xl">
                <p class="project-page__card-label">
                  Registered references
                </p>

                <div v-if="referenceLinks.length > 0" class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="link in referenceLinks"
                    :key="link.label"
                    size="small"
                    variant="tonal"
                  >
                    {{ link.label }}
                  </v-chip>
                </div>

                <p v-else class="project-page__empty-state">
                  All registered references currently have active URLs.
                </p>
              </v-card>
            </div>
          </section>

          <section class="project-page__section">
            <div class="project-page__section-heading">
              <h2 class="project-page__section-title">
                Related project network
              </h2>

              <p class="project-page__section-description">
                Cross-project relationships captured from the original portfolio inventory.
              </p>
            </div>

            <div v-if="relatedProjects.length > 0" class="project-page__card-grid">
              <ProjectPreviewCard
                v-for="relatedProject in relatedProjects"
                :key="relatedProject.slug"
                :max-technologies="4"
                :project="relatedProject"
              />
            </div>

            <div v-if="unmatchedRelatedProjects.length > 0" class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="title in unmatchedRelatedProjects"
                :key="title"
                size="small"
                variant="outlined"
              >
                {{ title }}
              </v-chip>
            </div>

            <p v-if="relatedProjects.length === 0 && unmatchedRelatedProjects.length === 0" class="project-page__empty-state">
              No related projects were registered for this entry.
            </p>
          </section>

          <section class="project-page__section">
            <div class="project-page__section-heading">
              <h2 class="project-page__section-title">
                Skills connection
              </h2>

              <p class="project-page__section-description">
                Portfolio skill areas inferred from the project technologies and architecture profile.
              </p>
            </div>

            <v-card class="glass-card pa-6" rounded="xl">
              <div class="d-flex flex-wrap ga-3">
                <v-btn
                  v-for="skill in skillLinks"
                  :key="skill.slug"
                  class="text-none"
                  :to="`/skills/${skill.slug}`"
                  variant="outlined"
                >
                  {{ skill.name }}
                </v-btn>
              </div>
            </v-card>
          </section>

        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
  .project-page__hero {
    align-items: start;
    display: grid;
    gap: 24px;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .project-page__hero-copy {
    max-width: 860px;
  }

  .project-page__eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin: 0 0 16px;
    text-transform: uppercase;
  }

  .project-page__hero-title {
    align-items: start;
    display: flex;
    gap: 18px;
  }

  .project-page__title {
    font-size: clamp(2.4rem, 5vw, 4.2rem);
    line-height: 1.02;
    margin: 0 0 18px;
  }

  .project-page__description {
    color: var(--portfolio-text-muted);
    line-height: 1.85;
    margin: 0;
  }

  .project-page__hero-actions {
    display: grid;
    gap: 12px;
    justify-items: end;
  }

  .project-page__summary-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 32px;
  }

  .project-page__summary-label,
  .project-page__card-label {
    color: var(--portfolio-text-muted);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 10px;
    text-transform: uppercase;
  }

  .project-page__summary-value {
    color: var(--portfolio-text);
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    line-height: 1.1;
  }

  .project-page__sections {
    display: grid;
    gap: 32px;
    margin-top: 40px;
  }

  .project-page__section {
    display: grid;
    gap: 18px;
  }

  .project-page__section-heading {
    display: grid;
    gap: 8px;
    max-width: 760px;
  }

  .project-page__section-title {
    margin: 0;
  }

  .project-page__section-description,
  .project-page__body-copy,
  .project-page__empty-state {
    color: var(--portfolio-text-muted);
    line-height: 1.8;
    margin: 0;
  }

  .project-page__two-column-grid,
  .project-page__card-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .project-page__technology-chip {
    padding-inline: 10px 12px;
  }

  .project-page__technology-icon {
    color: var(--portfolio-accent);
    margin-inline-end: 6px;
  }

  @media (max-width: 960px) {
    .project-page__hero {
      grid-template-columns: 1fr;
    }

    .project-page__hero-actions {
      justify-items: start;
    }

    .project-page__summary-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .project-page__hero-title {
      align-items: start;
      flex-direction: column;
    }

    .project-page__summary-grid {
      grid-template-columns: 1fr;
    }

    .project-page__title {
      font-size: clamp(2.1rem, 12vw, 3.2rem);
      overflow-wrap: anywhere;
    }

    .project-page__hero-actions,
    .project-page__hero-actions :deep(.v-btn) {
      width: 100%;
    }

    .project-page__two-column-grid,
    .project-page__card-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .project-page__body-copy,
    .project-page__section-description {
      overflow-wrap: anywhere;
    }
  }
</style>
