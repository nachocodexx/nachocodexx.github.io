<script setup lang="ts">
  import type { BlogPreviewItem } from '@/components/BlogPreview.vue'

  const {
    certificates,
    navigationItems,
    papers,
    projectGroups,
    skillCategories,
  } = usePortfolioData()

  const { data: blogPosts } = await useAsyncData<BlogPreviewItem[]>('home-blog-preview', async () => {
    const posts = await queryCollection('blog').order('date', 'DESC').all()

    return posts.slice(0, 3).map(post => ({
      date: post.date,
      description: post.description,
      path: post.path,
      readingTime: post.readingTime,
      tags: post.tags,
      title: post.title,
    }))
  })

  useSeoMeta({
    description: 'Portfolio, academic repository, and technical blog for Ignacio Castillo.',
    title: 'Ignacio Castillo',
  })
</script>

<template>
  <div>
    <PortfolioNavigation :items="navigationItems" />
    <PortfolioHero />

    <v-container class="portfolio-shell" max-width="1180">
      <div class="section-stack">
        <PortfolioSection
          id="about"
          description="A concise view of engineering focus, teaching experience, and the kind of systems work this site brings together."
          eyebrow="Profile"
          title="About"
        >
          <v-card class="about-card glass-card pa-4 pa-sm-6 pa-md-8" rounded="xl">
            <p class="text-body-1 text-md-h6 text-medium-emphasis mb-0" style="line-height: 1.9;">
              I am a <span class="font-weight-bold">software engineer</span> with a <span class="font-weight-bold">Master</span> and <span class="font-weight-bold">Ph.D. in engineering and computational technologies</span> from CINVESTAV. My work focuses on  distributed systems, software architecture, and system design, blending academic research with practical development experience.
              Throughout my career, I have worked across the entire lifecycle of software systems, managing projects from initial design to production deployment. 
              My professional background includes:
            </p>

            <ul class="about-card__list">
              <li class="text-body-1 text-md-h6 text-medium-emphasis mb-0" style="line-height: 1.9;">Designing and deploying distributed systems on private infrastructure for national data platforms.</li>
              <li class="text-body-1 text-md-h6 text-medium-emphasis mb-0" style="line-height: 1.9;">Developing applications using Python, Rust, Scala, and Node.js.</li>
              <li class="text-body-1 text-md-h6 text-medium-emphasis mb-0" style="line-height: 1.9;">Executing distributed load and stress testing using virtualization, automation tools, and linux scripting.</li>
              <li class="text-body-1 text-md-h6 text-medium-emphasis mb-0" style="line-height: 1.9;">Conducting IT security audits for operation layers in electoral systems.</li>
              <li class="text-body-1 text-md-h6 text-medium-emphasis mb-0" style="line-height: 1.9;">Managing cloud infrastructure and cloud administration.</li>
              <li class="text-body-1 text-md-h6 text-medium-emphasis mb-0" style="line-height: 1.9;">Managing engineering teams as a software architect for the PRONACES project.</li>
            </ul>

            <p class="text-body-1 text-md-h6 text-medium-emphasis mb-0" style="line-height: 1.9;">
              Outside of core systems engineering, I enjoy teaching student engineers and exploring hands-on electronics.
            </p>

            <!-- {{ aboutSummary }} -->
          </v-card>
        </PortfolioSection>

        <PortfolioSection
          id="skills"
          description="A structured view of core systems strengths, programming languages, delivery frameworks, and data platforms."
          eyebrow="Capabilities"
          title="Skills matrix"
        >
          <SkillsMatrix :categories="skillCategories" />
        </PortfolioSection>

        <PortfolioSection
          id="projects"
          description="Selected work that reflects software architecture, secure delivery, and systems thinking across product and research environments."
          eyebrow="Portfolio"
          title="Projects gallery"
        >
          <ProjectsGallery :groups="projectGroups" />
        </PortfolioSection>

        <PortfolioSection
          id="certificates"
          description="Browse verified training in cybersecurity, development workflows, Python, and project delivery. Select a certificate to preview its PDF and credential details."
          eyebrow="Credentials"
          title="Certificates"
        >
          <CertificatesList :certificates="certificates" />
        </PortfolioSection>

        <PortfolioSection
          id="research-papers"
          description="Recent academic work and publication references connected to software architecture, teaching platforms, and infrastructure resilience."
          eyebrow="Publications"
          title="Research papers"
        >
          <ResearchPapersList :papers="papers" />
        </PortfolioSection>

        <PortfolioSection
          id="blog"
          description="A markdown-backed technical writing space for architecture, systems, security, and engineering practice."
          eyebrow="Writing"
          title="Blog module"
        >
          <BlogPreview :posts="blogPosts ?? []" />
        </PortfolioSection>

        <PortfolioSection
          id="contact"
          description="Start a conversation about engineering, research, teaching, or collaboration opportunities."
          eyebrow="Get in touch"
          title="Contact"
        >
          <ContactSection />
        </PortfolioSection>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
  .about-card {
    max-width: 100%;
    min-width: 0;
    overflow-wrap: anywhere;
    width: 100%;
  }

  .about-card :is(p, li) {
    max-width: 100%;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .about-card__list {
    display: grid;
    gap: 8px;
    max-width: 100%;
    min-width: 0;
    padding-left: 24px;
    width: 100%;
  }

  @media (max-width: 600px) {
    .about-card__list {
      padding-left: 20px;
    }
  }
</style>
