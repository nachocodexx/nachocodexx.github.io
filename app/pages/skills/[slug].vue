<script setup lang="ts">
  const route = useRoute()
  const {
    certificates,
    getEntriesForSkill,
    getSkillBySlug,
    getSkillCategoryBySlug,
    isSkillSlug,
    navigationItems,
    papers,
    projects,
    skillAssets,
  } = usePortfolioData()

  const slug = computed(() => route.params.slug?.toString() ?? '')
  const skill = computed(() => getSkillBySlug(slug.value))
  const category = computed(() => getSkillCategoryBySlug(slug.value))

  if (!skill.value || !isSkillSlug(slug.value)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Skill not found',
    })
  }

  const relatedProjects = computed(() => getEntriesForSkill(projects, skill.value.slug))
  const relatedCertificates = computed(() => getEntriesForSkill(certificates, skill.value.slug))
  const relatedPapers = computed(() => getEntriesForSkill(papers, skill.value.slug))
  const relatedAssets = computed(() => getEntriesForSkill(skillAssets, skill.value.slug))

  const { data: relatedPosts } = await useAsyncData(`skill-posts-${skill.value.slug}`, async () => {
    const posts = await queryCollection('blog').order('date', 'DESC').all()

    return posts.filter(post => post.skills.includes(skill.value!.slug))
  })

  useSeoMeta({
    description: `${skill.value.name} projects, writing, research, certifications, and supporting assets from Ignacio Castillo.`,
    title: `${skill.value.name} portal`,
  })

  function formatDate (value: string) {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value))
  }

  function getDoiUrl (doi: string) {
    return `https://doi.org/${doi}`
  }
</script>

<template>
  <div>
    <PortfolioNavigation :items="navigationItems" />

    <v-container class="page-shell" max-width="1120">
      <div class="page-surface pa-4 pa-sm-6 pa-md-10">
        <div class="skill-portal__hero">
          <div class="skill-portal__hero-copy">
            <p class="skill-portal__eyebrow">
              {{ category?.title }}
            </p>

            <h1 class="skill-portal__title">
              {{ skill?.name }}
            </h1>

            <p class="skill-portal__description">
              {{ skill?.note }}
            </p>
          </div>

          <div class="skill-portal__hero-meta">
            <v-chip class="text-none" color="primary" size="small" variant="tonal">
              Skill level {{ skill?.level }}%
            </v-chip>

            <v-btn class="text-none" prepend-icon="mdi-arrow-left" to="/#skills" variant="outlined">
              Back to skills
            </v-btn>
          </div>
        </div>

        <div class="skill-portal__summary-grid">
          <v-card class="glass-card pa-5" rounded="xl">
            <p class="skill-portal__summary-label">
              Related projects
            </p>

            <strong class="skill-portal__summary-value">{{ relatedProjects.length }}</strong>
          </v-card>

          <v-card class="glass-card pa-5" rounded="xl">
            <p class="skill-portal__summary-label">
              Blog posts
            </p>

            <strong class="skill-portal__summary-value">{{ relatedPosts?.length ?? 0 }}</strong>
          </v-card>

          <v-card class="glass-card pa-5" rounded="xl">
            <p class="skill-portal__summary-label">
              Certifications
            </p>

            <strong class="skill-portal__summary-value">{{ relatedCertificates.length }}</strong>
          </v-card>

          <v-card class="glass-card pa-5" rounded="xl">
            <p class="skill-portal__summary-label">
              Research papers
            </p>

            <strong class="skill-portal__summary-value">{{ relatedPapers.length }}</strong>
          </v-card>
        </div>

        <div class="skill-portal__sections">
          <section class="skill-portal__section">
            <div class="skill-portal__section-heading">
              <h2 class="skill-portal__section-title">
                Projects
              </h2>

              <p class="skill-portal__section-description">
                Selected portfolio work where this skill appears in delivery, architecture, or systems execution.
              </p>
            </div>

            <div v-if="relatedProjects.length > 0" class="skill-portal__card-grid">
              <ProjectPreviewCard
                v-for="project in relatedProjects"
                :key="project.slug"
                :project="project"
              />
            </div>

            <p v-else class="skill-portal__empty-state">
              No related projects are listed for this skill yet.
            </p>
          </section>

          <section class="skill-portal__section">
            <div class="skill-portal__section-heading">
              <h2 class="skill-portal__section-title">
                Blog posts
              </h2>

              <p class="skill-portal__section-description">
                Writing that explains how this skill informs engineering practice, system design, or teaching.
              </p>
            </div>

            <div v-if="relatedPosts?.length" class="skill-portal__card-grid">
              <v-card
                v-for="post in relatedPosts"
                :key="post.path"
                class="glass-card pa-6"
                rounded="xl"
                :to="post.path"
              >
                <p class="skill-portal__card-meta">
                  {{ formatDate(post.date) }}<span v-if="post.readingTime"> · {{ post.readingTime }}</span>
                </p>

                <h3 class="skill-portal__card-title">
                  {{ post.title }}
                </h3>

                <p class="skill-portal__card-copy">
                  {{ post.description }}
                </p>

                <div class="d-flex flex-wrap ga-2 mt-4">
                  <v-chip
                    v-for="tag in post.tags"
                    :key="tag"
                    size="small"
                    variant="outlined"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
              </v-card>
            </div>

            <p v-else class="skill-portal__empty-state">
              No blog posts are tagged for this skill yet.
            </p>
          </section>

          <section class="skill-portal__section">
            <div class="skill-portal__section-heading">
              <h2 class="skill-portal__section-title">
                Certifications
              </h2>

              <p class="skill-portal__section-description">
                Credentials and focused training that reinforce this area of practice.
              </p>
            </div>

            <div v-if="relatedCertificates.length > 0" class="skill-portal__list">
              <v-card
                v-for="certificate in relatedCertificates"
                :key="certificate.slug"
                class="glass-card pa-5"
                rounded="xl"
              >
                <div class="d-flex flex-column flex-md-row justify-space-between ga-4">
                  <div>
                    <h3 class="skill-portal__card-title">
                      {{ certificate.title }}
                    </h3>

                    <p class="skill-portal__card-subtitle">
                      {{ certificate.issuer }}
                    </p>

                    <p class="skill-portal__card-copy">
                      {{ certificate.category }} · Credential {{ certificate.credentialId }}
                    </p>

                    <div class="d-flex flex-wrap ga-2 mt-4">
                      <v-chip
                        v-for="tag in certificate.tags"
                        :key="tag"
                        size="small"
                        variant="outlined"
                      >
                        {{ tag }}
                      </v-chip>
                    </div>
                  </div>

                  <v-chip class="text-none" color="primary" size="small" variant="tonal">
                    {{ certificate.issued }}
                  </v-chip>
                </div>
              </v-card>
            </div>

            <p v-else class="skill-portal__empty-state">
              No certifications are currently associated with this skill.
            </p>
          </section>

          <section class="skill-portal__section">
            <div class="skill-portal__section-heading">
              <h2 class="skill-portal__section-title">
                Research papers
              </h2>

              <p class="skill-portal__section-description">
                Academic work that applies or extends this skill in storage, platforms, and systems research.
              </p>
            </div>

            <div v-if="relatedPapers.length > 0" class="skill-portal__card-grid">
              <v-card
                v-for="paper in relatedPapers"
                :key="paper.title"
                class="glass-card pa-6"
                rounded="xl"
              >
                <p class="skill-portal__card-meta">
                  {{ paper.venue }} · {{ paper.year }}
                </p>

                <h3 class="skill-portal__card-title">
                  {{ paper.title }}
                </h3>

                <p class="skill-portal__card-copy">
                  {{ paper.summary }}
                </p>

                <div class="mt-4 d-flex flex-wrap align-center ga-3">
                  <v-chip class="text-none" color="primary" size="small" variant="tonal">
                    DOI {{ paper.doi }}
                  </v-chip>

                  <a
                    class="skill-portal__doi-link d-inline-flex align-center ga-2"
                    :href="getDoiUrl(paper.doi)"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Open DOI</span>
                    <v-icon icon="mdi-open-in-new" size="18" />
                  </a>
                </div>
              </v-card>
            </div>

            <p v-else class="skill-portal__empty-state">
              No related papers are listed for this skill yet.
            </p>
          </section>

          <section class="skill-portal__section">
            <div class="skill-portal__section-heading">
              <h2 class="skill-portal__section-title">
                Assets
              </h2>

              <p class="skill-portal__section-description">
                Supporting diagrams and implementation assets that help explain or operationalize this skill.
              </p>
            </div>

            <div v-if="relatedAssets.length > 0" class="skill-portal__card-grid">
              <v-card
                v-for="asset in relatedAssets"
                :key="asset.title"
                class="glass-card pa-6"
                rounded="xl"
              >
                <p class="skill-portal__card-meta">
                  {{ asset.format }}
                </p>

                <h3 class="skill-portal__card-title">
                  {{ asset.title }}
                </h3>

                <p class="skill-portal__card-copy">
                  {{ asset.summary }}
                </p>
              </v-card>
            </div>

            <p v-else class="skill-portal__empty-state">
              No supporting assets are listed for this skill yet.
            </p>
          </section>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
  .skill-portal__hero {
    align-items: start;
    display: grid;
    gap: 24px;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .skill-portal__hero-copy {
    max-width: 720px;
  }

  .skill-portal__eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin: 0 0 14px;
    text-transform: uppercase;
  }

  .skill-portal__title {
    font-size: clamp(2.4rem, 5vw, 4.3rem);
    line-height: 1.02;
    margin: 0 0 18px;
  }

  .skill-portal__description {
    color: var(--portfolio-text-muted);
    font-size: 1.02rem;
    line-height: 1.8;
    margin: 0;
  }

  .skill-portal__hero-meta {
    align-items: end;
    display: grid;
    gap: 12px;
    justify-items: end;
  }

  .skill-portal__summary-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 32px;
  }

  .skill-portal__summary-label {
    color: var(--portfolio-text-muted);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 10px;
    text-transform: uppercase;
  }

  .skill-portal__summary-value {
    color: var(--portfolio-text);
    font-size: clamp(1.8rem, 3vw, 2.3rem);
    line-height: 1;
  }

  .skill-portal__sections {
    display: grid;
    gap: 32px;
    margin-top: 40px;
  }

  .skill-portal__section {
    display: grid;
    gap: 18px;
  }

  .skill-portal__section-heading {
    display: grid;
    gap: 8px;
    max-width: 720px;
  }

  .skill-portal__section-title {
    margin: 0;
  }

  .skill-portal__section-description {
    color: var(--portfolio-text-muted);
    line-height: 1.7;
    margin: 0;
  }

  .skill-portal__card-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .skill-portal__list {
    display: grid;
    gap: 16px;
  }

  .skill-portal__card-meta {
    color: var(--portfolio-accent);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 12px;
    text-transform: uppercase;
  }

  .skill-portal__card-title {
    margin: 0 0 10px;
  }

  .skill-portal__card-subtitle {
    color: var(--portfolio-text-soft);
    font-weight: 600;
    margin: 0 0 10px;
  }

  .skill-portal__card-copy {
    color: var(--portfolio-text-muted);
    line-height: 1.75;
    margin: 0;
  }

  .skill-portal__doi-link {
    color: var(--portfolio-accent);
    font-weight: 600;
  }

  .skill-portal__empty-state {
    color: var(--portfolio-text-muted);
    margin: 0;
  }

  @media (max-width: 960px) {
    .skill-portal__hero {
      grid-template-columns: 1fr;
    }

    .skill-portal__hero-meta {
      justify-items: start;
    }

    .skill-portal__summary-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .skill-portal__title {
      font-size: clamp(2.2rem, 12vw, 3.2rem);
      overflow-wrap: anywhere;
    }

    .skill-portal__hero-meta,
    .skill-portal__hero-meta :deep(.v-btn) {
      width: 100%;
    }

    .skill-portal__summary-grid {
      grid-template-columns: 1fr;
    }

    .skill-portal__card-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .skill-portal__card-meta,
    .skill-portal__card-copy {
      overflow-wrap: anywhere;
    }
  }
</style>
