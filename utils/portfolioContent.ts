export const PORTFOLIO_SKILL_SLUGS = [
  'distributed-systems',
  'software-architecture',
  'algorithms',
  'data-structures',
  'networking',
  'programming',
  'ui-design',
  'python',
  'typescript',
  'javascript',
  'rust',
  'scala',
  'r',
  'vue',
  'fastapi',
  'tauri',
  'sql',
  'postgresql',
  'mongodb',
  'redis',
  'cybersecurity',
  'git',
  'linux',
  'agile',
  'project-management',
  'electronics',
  'kurrentdb',
] as const

export type SkillSlug = typeof PORTFOLIO_SKILL_SLUGS[number]

export interface ProjectLink {
  label: string
  href?: string
}

export interface ProjectLogo {
  src?: string
  alt?: string
  label?: string
}

export interface ProjectGalleryImage {
  src: string
  alt: string
  caption?: string
}

export interface ProjectEntry {
  slug: string
  path: string
  categorySlug: string
  categoryTitle: string
  title: string
  type: string
  summary: string
  description: string
  technologies: string[]
  developmentYear: string
  skills: SkillSlug[]
  links: ProjectLink[]
  relatedProjects: string[]
  logo?: ProjectLogo
  gallery?: ProjectGalleryImage[]
}

export interface ProjectGroup {
  slug: string
  title: string
  description: string
  highlightTag?: string
  funding?: string
  technologies?: string[]
  links?: ProjectLink[]
  projects: ProjectEntry[]
}

export interface CertificateEntry {
  slug: string
  title: string
  issuer: string
  issued: string
  credentialId: string
  category: string
  tags: string[]
  skills: SkillSlug[]
  pdfUrl: string
}

export interface PaperEntry {
  title: string
  authors: string
  venue: string
  year: string
  summary: string
  doi: string
  skills: SkillSlug[]
}

export interface SkillAssetEntry {
  title: string
  format: string
  summary: string
  skills: SkillSlug[]
  href?: string
}

export interface SkillItem {
  slug: SkillSlug
  icon: string
  name: string
  level: number
  note?: string
}

export interface SkillCategory {
  title: string
  description: string
  items: SkillItem[]
}

export interface NavigationItem {
  label: string
  to: string
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'About', to: '/#about' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Certificates', to: '/#certificates' },
  { label: 'Research papers', to: '/#research-papers' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/#contact' },
]

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Core skills',
    description: 'The broad engineering areas that shape architecture decisions, system behavior, and long-term maintainability.',
    items: [
      { slug: 'distributed-systems', icon: 'mdi-graph-outline', name: 'Distributed Systems', level: 95, note: 'Designing resilient services, coordination flows, and runtime trade-offs.' },
      { slug: 'software-architecture', icon: 'mdi-sitemap-outline', name: 'Software Architecture', level: 94, note: 'Structuring platforms for clarity, evolution, and operational reliability.' },
      { slug: 'algorithms', icon: 'mdi-function-variant', name: 'Algorithms', level: 88, note: 'Using efficient problem-solving patterns for systems and data-intensive work.' },
      { slug: 'data-structures', icon: 'mdi-database-outline', name: 'Data Structures', level: 89, note: 'Choosing practical structures that support performance and correctness.' },
      { slug: 'networking', icon: 'mdi-lan-connect', name: 'Networking', level: 84, note: 'Understanding service communication, latency behavior, and infrastructure boundaries.' },
      { slug: 'programming', icon: 'mdi-code-braces', name: 'Programming', level: 93, note: 'Turning ideas into maintainable implementations across research and product contexts.' },
      { slug: 'ui-design', icon: 'mdi-palette-outline', name: 'UI Design', level: 78, note: 'Shaping clear interfaces with attention to usability and visual restraint.' },
    ],
  },
  {
    title: 'Programming Languages',
    description: 'Primary languages used across systems engineering, backend development, data work, and interactive products.',
    items: [
      { slug: 'python', icon: 'mdi-language-python', name: 'Python', level: 94, note: 'Backend services, automation, data processing, and research-oriented tooling.' },
      { slug: 'typescript', icon: 'mdi-language-typescript', name: 'TypeScript', level: 92, note: 'Typed front-end and full-stack work with maintainable component and API design.' },
      { slug: 'javascript', icon: 'mdi-language-javascript', name: 'JavaScript', level: 90, note: 'Practical browser and platform work with a strong understanding of the ecosystem.' },
      { slug: 'rust', icon: 'mdi-cog-outline', name: 'Rust', level: 86, note: 'Systems-focused development with reliability and performance in mind.' },
      { slug: 'scala', icon: 'mdi-lambda', name: 'Scala', level: 84, note: 'Functional and distributed programming for more demanding platform scenarios.' },
      { slug: 'r', icon: 'mdi-chart-bell-curve-cumulative', name: 'R', level: 74, note: 'Statistical analysis and data exploration for academic and applied research.' },
    ],
  },
  {
    title: 'Frameworks',
    description: 'Delivery-focused tools for building interfaces, APIs, and desktop experiences.',
    items: [
      { slug: 'vue', icon: 'mdi-vuejs', name: 'Vue', level: 92, note: 'Component-driven UI development with a focus on smooth, readable experiences.' },
      { slug: 'fastapi', icon: 'mdi-api', name: 'FastAPI', level: 87, note: 'Structured API development with strong typing and production-friendly ergonomics.' },
      { slug: 'tauri', icon: 'mdi-application-brackets-outline', name: 'Tauri', level: 79, note: 'Lightweight desktop application delivery with web technologies and native integration.' },
    ],
  },
  {
    title: 'Databases',
    description: 'Storage and platform technologies used to support production systems, observability, and data-heavy services.',
    items: [
      { slug: 'sql', icon: 'mdi-database-search-outline', name: 'SQL', level: 91, note: 'Data modeling, querying, and performance-aware relational access patterns.' },
      { slug: 'postgresql', icon: 'mdi-elephant', name: 'PostgreSQL', level: 89, note: 'Transactional workloads, schema design, and dependable data services.' },
      { slug: 'mongodb', icon: 'mdi-leaf', name: 'MongoDB', level: 81, note: 'Document-oriented storage when flexibility and fast iteration are priorities.' },
      { slug: 'redis', icon: 'mdi-lightning-bolt-outline', name: 'Redis', level: 82, note: 'Caching, ephemeral state, and low-latency coordination patterns.' },
      {slug:'kurrentdb', icon:'mdi-database-clock-outline', name:'KurrentDB', level: 70, note:'It is an event-driven, time-series database designed for high-throughput data ingestion and real-time analytics.'},
    ],
  },
  {
    title: 'Engineering practices',
    description: 'Security, source control, operating systems, and delivery practices used to support dependable engineering work.',
    items: [
      { slug: 'cybersecurity', icon: 'mdi-shield-lock-outline', name: 'Cybersecurity', level: 86, note: 'Assessing risk, protecting systems, and responding to security events.' },
      { slug: 'git', icon: 'mdi-source-branch', name: 'Git', level: 92, note: 'Version control and collaborative development workflows across complex codebases.' },
      { slug: 'linux', icon: 'mdi-linux', name: 'Linux', level: 88, note: 'Command-line tooling, system administration, and secure development environments.' },
      // { slug: 'agile', icon: 'mdi-sync', name: 'Agile', level: 82, note: 'Iterative planning and delivery practices for collaborative product development.' },
      { slug: 'project-management', icon: 'mdi-clipboard-check-outline', name: 'Project Management', level: 80, note: 'Organizing scope, delivery, and team coordination around clear outcomes.' },
      {slug:'electronics', icon:'mdi-chip', name:'Electronics', level: 50, note:'Microcontrollers, embedded systems, and circuit design.' },

    ],
  },
]

const PROJECT_TECHNOLOGY_SKILL_MAP: Record<string, SkillSlug[]> = {
  Asyncio: ['python'],
  Docker: ['software-architecture'],
  FastAPI: ['fastapi', 'python'],
  Httpx: ['python'],
  JavaScript: ['javascript', 'programming'],
  MkDocs: ['python'],
  MongoDB: ['mongodb'],
  'Node.js': ['javascript'],
  Nuitka: ['python'],
  OOP: ['software-architecture'],
  OpenTelemetry: ['distributed-systems', 'networking'],
  Pinia: ['vue'],
  Poetry: ['python'],
  Pydantic: ['python'],
  Python: ['python', 'programming'],
  pytest: ['python'],
  R: ['r'],
  Redis: ['redis'],
  Rust: ['rust', 'programming'],
  Scala: ['scala', 'programming'],
  SledDB: ['rust'],
  SQL: ['sql'],
  Swagger: ['fastapi'],
  Tauri: ['tauri', 'typescript'],
  TinyDB: ['python'],
  TypeScript: ['typescript', 'programming'],
  Vite: ['vue'],
  Vue: ['vue', 'javascript', 'ui-design'],
  Vuetify: ['vue', 'ui-design'],
  YAML: ['programming'],
  ZeroMQ: ['networking', 'python'],
  Zensical: ['software-architecture'],
}

interface ProjectEntrySource {
  slug: string
  title: string
  type: string
  technologies: string[]
  description: string
  developmentYear: string
  links: ProjectLink[]
  relatedProjects?: string[]
  additionalSkills?: SkillSlug[]
  logo?: ProjectLogo
  gallery?: ProjectGalleryImage[]
}

function resolveProjectSkills (technologies: string[], additionalSkills: SkillSlug[] = []) {
  return [...new Set([...technologies.flatMap(technology => PROJECT_TECHNOLOGY_SKILL_MAP[technology] ?? []), ...additionalSkills])]
}

function createProjectEntry (
  group: Pick<ProjectGroup, 'slug' | 'title'>,
  source: ProjectEntrySource,
): ProjectEntry {
  return {
    categorySlug: group.slug,
    categoryTitle: group.title,
    description: source.description,
    developmentYear: source.developmentYear,
    gallery: source.gallery ?? [],
    links: source.links,
    logo: source.logo,
    path: `/projects/${source.slug}`,
    relatedProjects: source.relatedProjects ?? [],
    skills: resolveProjectSkills(source.technologies, source.additionalSkills),
    slug: source.slug,
    summary: source.description,
    technologies: source.technologies,
    title: source.title,
    type: source.type,
  }
}

export const PROJECT_GROUPS: ProjectGroup[] = [
    {
    slug: 'jub-ecosystem',
    title: 'JUB ecosystem',
    description: 'A national data hub designed for data aggregation, distribution, and search operations using the STORI model to organize information into observatories, catalogs, and products.',
    highlightTag: 'Funded research project',
    funding: 'Supported by the Secretaría de Ciencia, Humanidades, Tecnología e Innovación (SECIHTI) of Mexico, grant number MADTEC-2025-M-478.',
    technologies: ['Python', 'FastAPI', 'MongoDB', 'Redis', 'Vue'],
    links: [{ label: 'Visit JUB', href: 'https://jub.tamps.cinvestav.mx/' }],
    projects: [
      createProjectEntry(
        {
          slug: 'jub-ecosystem',
          title: 'JUB ecosystem',
        },
        {
          slug: 'jub-api',
          title: 'JUB API',
          type: 'Backend REST API',
          technologies: ['Python', 'FastAPI', 'MongoDB', 'Redis'],
          description: 'Core backend application managing the data hub entities. It features a custom query domain-specific language (DSL) to filter and aggregate records.',
          developmentYear: '2025 to present',
          links: [
            {
              label: 'Jub Platform',
              href: 'https://jub.tamps.cinvestav.mx/',
            },
            { 
              label: 'GitHub repository', 
              href: 'https://github.com/jub-ecosystem/jub-api' 
            },
            {
              label: 'Documentation site',
              href: 'https://jub-ecosystem.github.io/jub-api/',
            }
          ],
          relatedProjects: ['JUB client', 'JUB web'],
          logo: { 
            src: '/projects/jub-api/logo.svg',
            label: 'JUB' 
          },
          additionalSkills: ['software-architecture', 'distributed-systems'],
        },
      ),
      createProjectEntry(
        {
          slug: 'jub-ecosystem',
          title: 'JUB ecosystem',
        },
        {
          slug: 'jub-client',
          title: 'JUB client',
          type: 'Developer tooling and SDK',
          technologies: ['Python'],
          description: 'Fully-typed, asynchronous Python interface to interact with the data hub, mapping entities to Pydantic models with automated authentication wrapper tools.',
          developmentYear: '2025 to present',
          links: [
            {label: 'Jub Platform', href: 'https://jub.tamps.cinvestav.mx/' },
            { label: 'GitHub repository', href: 'https://github.com/jub-ecosystem/jub-client' },
            {label: 'Documentation site', href: 'https://jub-ecosystem.github.io/jub-client/' }
          ],
          relatedProjects: ['JUB API', 'JUB web', 'Xolo API'],
          logo: { 
            src: '/projects/jub-client/logo.svg',
            label: 'JUB' 
          },
          additionalSkills: ['software-architecture'],
        },
      ),
      createProjectEntry(
        {
          slug: 'jub-ecosystem',
          title: 'JUB ecosystem',
        },
        {
          slug: 'jub-web',
          title: 'JUB web',
          type: 'Front-end UI',
          technologies: ['Vue'],
          description: 'The official web portal providing visual access to the national data hub features for end users.',
          developmentYear: '2025 to present',
          links: [
            {label: 'Jub Platform', href: 'https://jub.tamps.cinvestav.mx/' },
            { label: 'GitHub repository', href: 'https://github.com/jub-ecosystem/jub-web' },
          ],
          relatedProjects: ['JUB API', 'JUB client'],
          logo: { 
            src: '/projects/jub-web/logo.svg',
            label: 'JUB' 
          },
          additionalSkills: ['software-architecture'],
        },
      ),
    ],
  },
  {
    slug: 'muyal-and-oca-ecosystem',
    title: 'Muyal-Ilal and OCA Ecosystem',
    description: 'Portfolio work spanning observatory products, identity services, and client tooling across a shared research ecosystem.',
    projects: [
      createProjectEntry(
        {
          slug: 'muyal-and-oca-ecosystem',
          title: 'Muyal-Ilal and OCA Ecosystem',
        },
        {
          slug: 'muyal-ilal-landing-page',
          title: 'Muyal-Ilal landing page',
          type: 'Web development',
          technologies: ['Vue', 'JavaScript', 'FastAPI', 'Swagger', 'OOP', 'MongoDB', 'Redis', 'Python'],
          description: 'A landing web page that introduces the essential components and work of the research group.',
          developmentYear: '2023',
          links: [{ label: 'Live site' }, { label: 'GitHub repository' }],
          relatedProjects: ['OCA'],
          logo: { 
            src:'/projects/muyal-ilal/logo.png',
            alt: 'Muyal-Ilal project logo',
            label: 'MIL' 
          },
          additionalSkills: ['software-architecture'],
        },
      ),
      createProjectEntry(
        {
          slug: 'muyal-and-oca-ecosystem',
          title: 'Muyal-Ilal and OCA Ecosystem',
        },
        {
          slug: 'oca',
          title: 'OCA',
          type: 'Web application, SPA, and distributed system',
          technologies: ['Vue', 'JavaScript', 'FastAPI', 'Swagger', 'OOP', 'MongoDB', 'Redis', 'Python', 'Rust', 'SledDB', 'Pydantic'],
          description: 'A web application designed to organize information products like plots. It serves as a component belonging to a distributed system where all products are stored on MictlanX, utilizing Xolo to provide security features. The application connects to a FastAPI service that allows users to search for products using a catalog system that forms a unique path for interrelated items.',
          developmentYear: '2023',
          links: [{ label: 'Live site' }, { label: 'GitHub repository' }],
          relatedProjects: ['MictlanX', 'Xolo API'],
          logo: {
            src: '/projects/oca/logo.png',
            alt: 'OCA project logo',
            label: 'OCA',
          },
          gallery: [
            {
              src: '/projects/oca/gallery/catalog-overview.png',
              alt: 'OCA catalog overview',
              caption: 'Sample visual used to preview the project gallery and its catalog-oriented experience.',
            },
            {
              src: '/projects/oca/gallery/search-state.png',
              alt: 'OCA search and observatory state',
              caption: 'A second seeded image so the detail page can demonstrate gallery navigation and modal browsing.',
            },
          ],
          additionalSkills: ['distributed-systems', 'software-architecture', 'networking'],
        },
      ),
      createProjectEntry(
        {
          slug: 'muyal-and-oca-ecosystem',
          title: 'Muyal-Ilal and OCA Ecosystem',
        },
        {
          slug: 'oca-client',
          title: 'OCA client',
          type: 'Client application',
          technologies: ['Python', 'Pydantic', 'Httpx', 'Asyncio'],
          description: 'A specific HTTP client built to communicate directly with the OCA service. It provides a straightforward way to perform CRUD operations for catalogs, products, and observatories.',
          developmentYear: '2024',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['OCA'],
          logo: { 
            src: '/projects/oca-client/logo.png',
            alt: 'OCA client project logo',
            label: 'OCA' 
          },
          additionalSkills: ['software-architecture'],
        },
      ),
    
    ],
  },
  {
    slug:'xolo-identity-and-access-management',
    title: 'Xolo identity and access management',
    description: 'Identity and access management platform for the MictlanX and OCA ecosystems.',
    projects: [
        createProjectEntry(
        {
          slug: 'muyal-and-oca-ecosystem',
          title: 'Muyal-Ilal and OCA Ecosystem',
        },
        {
          slug: 'xolo-client',
          title: 'Xolo client',
          type: 'Client application',
          technologies: ['Python', 'Pydantic', 'Httpx', 'Asyncio'],
          description: 'The official Python package for Xolo. This repository ships a typed XoloClient for the live Xolo API, along with local ACL, ABAC, RBAC, NGAC, and policy evaluation helpers. It also includes shared cryptography, logging, parsing, and utility modules used by those engines.',
          developmentYear: '2025',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['Xolo API'],
          logo: {
            src: '/projects/xolo-client/logo.png',
            alt: 'Xolo client project logo',
            label: 'XO',
          },
          additionalSkills: ['software-architecture', 'networking'],
        },
      ),
      createProjectEntry(
        {
          slug: 'muyal-and-oca-ecosystem',
          title: 'Muyal-Ilal and OCA Ecosystem',
        },
        {
          slug: 'xolo-api',
          title: 'Xolo API',
          type: 'IAM API and multi-tenant SaaS service',
          technologies: ['FastAPI', 'MongoDB', 'Redis', 'Python', 'Poetry', 'Docker', 'Zensical'],
          description: 'An identity and access management service that unifies four access control models: Access Control Lists (ACL), Attribute-Based Access Control (ABAC), Role-Based Access Control (RBAC), and Next Generation Access Control (NGAC). Designed as a multi-tenant platform, it isolates users, scopes, policies, and licenses within account boundaries using account-scoped API keys. The system architecture follows a strict Domain-Driven Design (DDD) per-module pattern, utilizing functional error handling (Result and Option types) to keep controllers thin.',
          developmentYear: '2024 to 2026',
          links: [{ label: 'GitHub repository' }, { label: 'Documentation site' }],
          relatedProjects: ['OCA', 'Xolo client', 'MictlanX'],
          logo: {
            src: '/projects/xolo-api/logo.png',
            alt: 'Xolo API project logo',
            label: 'XO',
          },
          gallery: [
            {
              src: '/projects/xolo-api/gallery/access-policies.png',
              alt: 'Xolo API access policy view',
              caption: 'Seeded image for the access and policy side of the project detail gallery.',
            },
            {
              src: '/projects/xolo-api/gallery/tenant-context.png',
              alt: 'Xolo API tenant context view',
              caption: 'Seeded image for testing the richer project gallery interaction across multiple images.',
            },
            {
              src: '/projects/xolo-api/gallery/access-policies.png',
              alt: 'Xolo API access policy view',
              caption: 'Seeded image for the access and policy side of the project detail gallery.',
            },
            {
              src: '/projects/xolo-api/gallery/w.png',
              alt: 'Xolo API tenant context view',
              caption: 'Seeded image for testing the richer project gallery interaction across multiple images.',
            },

            {
              src: '/projects/xolo-api/gallery/1.png',
              alt: 'Xolo API access policy view',
              caption: 'Seeded image for the access and policy side of the project detail gallery.',
            },
          ],
          additionalSkills: ['software-architecture', 'distributed-systems', 'networking'],
        },
      ),
    ]
  },

  {
    slug: 'mictlanx-core-storage-architecture',
    title: 'MictlanX core storage architecture',
    description: 'Core storage routing, synchronization, cluster management, and SDK delivery for the MictlanX platform.',
    projects: [
      createProjectEntry(
        {
          slug: 'mictlanx-core-storage-architecture',
          title: 'MictlanX core storage architecture',
        },
        {
          slug: 'mictlanx-router',
          title: 'MictlanX router',
          type: 'Distributed system component and load balancer',
          technologies: ['Python', 'Poetry', 'Docker'],
          description: 'A central load balancing component of the MictlanX prototype storage system, developed as part of a PhD thesis titled "Reactive elastic replication strategy for ephemeral computing". Its primary role is to distribute and balance data loads across a set of Virtual Storage Systems (VSS). It handles file allocations alongside the system client and processes availability policies to update replication strategies across active peers.',
          developmentYear: '2024',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['MictlanX sync', 'MictlanX client', 'MictlanX RM', 'Xolo API'],
          logo: { 
            src: '/projects/mictlanx-router/logo.png',
            alt: 'MictlanX router project logo',
            label: 'MX' 
          },
          additionalSkills: ['distributed-systems', 'software-architecture', 'networking'],
        },
      ),
      createProjectEntry(
        {
          slug: 'mictlanx-core-storage-architecture',
          title: 'MictlanX core storage architecture',
        },
        {
          slug: 'mictlanx-sync',
          title: 'MictlanX sync',
          type: 'Data synchronization tool and desktop utility',
          technologies: ['Python', 'Nuitka', 'Docker', 'YAML'],
          description: 'A file synchronization utility designed to keep data consistent across different locations or systems using designated storage areas called buckets. The tool connects with the MictlanX storage system routers and integrates with the Xolo API for identity and user management. It processes data using configurable chunk sizes, timeouts, and idle thresholds. To streamline distribution for Windows environments, the application is compiled into a standalone executable using Nuitka.',
          developmentYear: '2024',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['MictlanX router', 'MictlanX client', 'MictlanX RM', 'Xolo API'],
          logo: { 
            src: '/projects/mictlanx-sync/logo.png',
            alt: 'MictlanX sync project logo',
            label: 'MX' 
          },
          additionalSkills: ['distributed-systems', 'software-architecture', 'networking'],
        },
      ),
      createProjectEntry(
        {
          slug: 'mictlanx-core-storage-architecture',
          title: 'MictlanX core storage architecture',
        },
        {
          slug: 'mictlanx-client',
          title: 'MictlanX client',
          type: 'Python SDK and client utility',
          technologies: ['Python', 'Poetry', 'Docker', 'MkDocs'],
          description: 'A client tool and Python SDK designed to interact with the decentralized, router-backed MictlanX object storage system. It handles data allocation and location operations, providing chunked transfers for large files with bounded memory use, concurrent I/O, router failover, and end-to-end SHA-256 integrity verification. The SDK exposes three distinct layers of abstraction: direct peer interaction, router load balancing, and a high-level client with built-in retries, exponential backoff, and client-side caching.',
          developmentYear: '2024 to 2026',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['MictlanX router', 'MictlanX sync', 'MictlanX RM', 'Xolo API'],
          logo: { 
            src: '/projects/mictlanx-client/logo.png',
            alt: 'MictlanX client project logo',
            label: 'MX' 
          },
          additionalSkills: ['distributed-systems', 'software-architecture', 'networking'],
        },
      ),
      createProjectEntry(
        {
          slug: 'mictlanx-core-storage-architecture',
          title: 'MictlanX core storage architecture',
        },
        {
          slug: 'mictlanx-rm-storage-peer-manager',
          title: 'MictlanX RM (Storage Peer Manager)',
          type: 'Cluster control plane and state orchestration service',
          technologies: ['Python', 'ZeroMQ', 'Docker', 'Poetry', 'TinyDB'],
          description: 'The control plane component for the MictlanX storage system that maintains cluster state. It handles the discovery and healing of storage peers, tracks distribution placement maps for objects, records operational metrics for balancing, and coordinates active, passive, or hybrid replication strategies. Running alongside the MictlanX router to form a Virtual Storage Space (VSS), the service utilizes ZeroMQ for its control plane transport layer and incorporates an orchestration backend named Summoner to manage elastic peer allocations inside containerized environments.',
          developmentYear: '2025 to 2026',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['MictlanX router', 'MictlanX client', 'MictlanX sync', 'Xolo API'],
          logo: { 
            src: '/projects/mictlanx-rm/logo.png',
            alt: 'MictlanX RM project logo',
            label: 'MX' 
          },
          additionalSkills: ['distributed-systems', 'software-architecture', 'networking'],
        },
      ),
    ],
  },
  {
    slug: 'distributed-execution-frameworks',
    title: 'Distributed execution frameworks',
    description: 'Execution engines, runtimes, interfaces, and service backends centered on the Axo platform.',
    projects: [
      createProjectEntry(
        {
          slug: 'distributed-execution-frameworks',
          title: 'Distributed execution frameworks',
        },
        {
          slug: 'axo',
          title: 'Axo',
          type: 'Execution engine and active object system',
          technologies: ['Python', 'Docker', 'Poetry', 'OpenTelemetry'],
          description: 'An execution engine responsible for managing, executing, and orchestrating active objects that encapsulate both data and behavior. The system allows developers to build execution-agnostic applications by using method decorators to abstract the underlying infrastructure. Methods decorated with this framework can run locally for deployment testing or be remotely dispatched to distributed endpoints like serverless functions. The architecture blends storage and processing seamlessly, utilizing dedicated runtime context managers to handle routing metadata, dynamic endpoint binding, and object state management.',
          developmentYear: '2024 to 2025',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['Axo UI', 'Axo endpoint', 'Axo backend', 'MictlanX'],
          logo: { 
            src: '/projects/axo/logo.png',
            alt: 'Axo project logo',
            label: 'AXO' 
          },
          additionalSkills: ['distributed-systems', 'software-architecture', 'networking'],
        },
      ),
      createProjectEntry(
        {
          slug: 'distributed-execution-frameworks',
          title: 'Distributed execution frameworks',
        },
        {
          slug: 'axo-ui',
          title: 'Axo UI',
          type: 'User interface and frontend application',
          technologies: ['Vue', 'Vuetify', 'Vite', 'Pinia', 'Node.js'],
          description: 'A graphical interface designed to interact with the Axo backend execution engine. It provides an environment for users to create, manage, and monitor active objects. The application uses Vite for project bundling, Pinia with a persisted state plugin for state management, and a standardized set of Vuetify components for forms and asset navigation.',
          developmentYear: '2024 to 2025',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['Axo', 'Axo backend'],
          logo: { 
            src: '/projects/axo/logo.png',
            alt: 'Axo project logo',
            label: 'AXO' 
          },
          additionalSkills: ['software-architecture'],
        },
      ),
      createProjectEntry(
        {
          slug: 'distributed-execution-frameworks',
          title: 'Distributed execution frameworks',
        },
        {
          slug: 'axo-endpoint',
          title: 'Axo endpoint',
          type: 'Distributed system component and execution runtime',
          technologies: ['Python', 'Docker'],
          description: 'A dedicated runtime component of the Axo platform responsible for enabling the execution of active objects. It operates as a distributed execution node or endpoint that receives, manages, and executes remote method invocations dispatched by the core framework, separating the processing layer from the underlying client application.',
          developmentYear: '2024',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['Axo', 'Axo UI', 'Axo backend'],
          logo: { 
            src: '/projects/axo/logo.png',
            alt: 'Axo project logo',
            label: 'AXO' 
          },
          additionalSkills: ['distributed-systems', 'software-architecture', 'networking'],
        },
      ),
      createProjectEntry(
        {
          slug: 'distributed-execution-frameworks',
          title: 'Distributed execution frameworks',
        },
        {
          slug: 'axo-backend',
          title: 'Axo backend',
          type: 'Core service and REST API backend',
          technologies: ['Python', 'FastAPI', 'Poetry', 'Docker', 'MongoDB'],
          description: 'The core backend system for the Axo platform designed to manage active objects dynamically. This backend service provides a comprehensive REST API to handle all application business logic, database interactions, and active object operations. The architecture implements a strict separation of concerns split into access, controllers, services, repositories, and database models layers. This service delivers data directly for the Axo UI to consume and runs on a MongoDB cluster configured with replica sets.',
          developmentYear: '2024 to 2025',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['Axo', 'Axo UI', 'Axo endpoint'],
          logo: { 
            src: '/projects/axo/logo.png',
            alt: 'Axo project logo',
            label: 'AXO' 
          },
          additionalSkills: ['software-architecture', 'distributed-systems'],
        },
      ),
    ],
  },
  {
    slug: 'mentored-student-projects-using-axo',
    title: 'Mentored student projects using axo',
    description: 'Student-led algorithmic and machine-learning work developed under academic guidance within the Axo ecosystem.',
    projects: [
      createProjectEntry(
        {
          slug: 'mentored-student-projects-using-axo',
          title: 'Mentored student projects using axo',
        },
        {
          slug: 'optikit',
          title: 'OptiKit',
          type: 'Algorithmic toolkit and research framework',
          technologies: ['Python'],
          description: 'A modular and extensible toolkit designed for experimenting with and applying graph search and metaheuristic algorithms. It includes support for combinatorial, continuous, and multi-objective computational problems, making it suitable for research, prototyping, and educational tasks. The framework includes classical graph implementations like Dijkstra and Bellman-Ford, local search metaheuristics like Simulated Annealing and Tabu Search, nature-inspired methods like the Bees Algorithm, and evolutionary algorithms like NSGA-II. It was developed by students under academic guidance to leverage the ecosystem resources.',
          developmentYear: '2024 to 2025',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['Axo'],
          logo: { label: 'OK' },
          additionalSkills: ['algorithms', 'data-structures', 'software-architecture'],
        },
      ),
      createProjectEntry(
        {
          slug: 'mentored-student-projects-using-axo',
          title: 'Mentored student projects using axo',
        },
        {
          slug: 'axo-classification-algorithms',
          title: 'Axo classification algorithms',
          type: 'Machine learning toolkit integration',
          technologies: ['Python', 'Poetry', 'pytest'],
          description: 'A collection of classification algorithms implemented with a unified structure and integrated directly with the Axo framework to leverage its execution capabilities. The codebase standardizes training, prediction, metrics, and visualization across multiple models, including decision trees, linear regression, logistic regression, naive Bayes, perceptron systems, and support vector machines. The architecture enforces consistent method signatures, utilizes strict type hinting, and includes an automated testing suite with code coverage analysis tools. It was developed by students under academic guidance.',
          developmentYear: '2024 to 2025',
          links: [{ label: 'GitHub repository' }],
          relatedProjects: ['Axo'],
          logo: { label: 'AXO' },
          additionalSkills: ['algorithms', 'data-structures', 'software-architecture'],
        },
      ),
    ],
  },

  // {
  //   slug: 'javascript-and-frontend-content',
  //   title: 'JavaScript and frontend content',
  //   description: 'Early frontend and legacy JavaScript work that established product delivery foundations and interface thinking.',
  //   projects: [
  //     createProjectEntry(
  //       {
  //         slug: 'javascript-and-frontend-content',
  //         title: 'JavaScript and frontend content',
  //       },
  //       {
  //         slug: 'lottery-game',
  //         title: 'Lottery game',
  //         type: 'Legacy application',
  //         technologies: ['JavaScript'],
  //         description: 'A lottery game application built as a legacy project.',
  //         developmentYear: '7 years ago',
  //         links: [{ label: 'GitHub repository' }],
  //         logo: { label: 'LG' },
  //         additionalSkills: ['ui-design'],
  //       },
  //     ),
  //     createProjectEntry(
  //       {
  //         slug: 'javascript-and-frontend-content',
  //         title: 'JavaScript and frontend content',
  //       },
  //       {
  //         slug: 'describapp',
  //         title: 'DescribApp',
  //         type: 'Legacy application',
  //         technologies: ['JavaScript'],
  //         description: 'A car insurance application designed for a specific project requirement.',
  //         developmentYear: 'Legacy',
  //         links: [{ label: 'GitHub repository' }],
  //         logo: { label: 'DA' },
  //         additionalSkills: ['ui-design'],
  //       },
  //     ),
  //   ],
  // },

]

export const PROJECTS: ProjectEntry[] = PROJECT_GROUPS.flatMap(group => group.projects)

export const CERTIFICATES: CertificateEntry[] = [
  {
    slug: 'google-cybersecurity-professional-certificate',
    title: 'Google cybersecurity professional certificate',
    issuer: 'Google',
    issued: 'August 2024',
    credentialId: 'ACKX48P3NP0W',
    category: 'Cybersecurity professional programs',
    tags: ['Cybersecurity', 'Python'],
    skills: ['cybersecurity', 'python'],
    pdfUrl: '/certificates/google-cybersecurity-professional-certificate.pdf',
  },
  {
    slug: 'cybersecurity-fundamentals',
    title: 'Cybersecurity fundamentals',
    issuer: 'Google',
    issued: 'June 2024',
    credentialId: 'AK2Z3JPPN7F2',
    category: 'Cybersecurity professional programs',
    tags: ['Cybersecurity', 'Network security'],
    skills: ['cybersecurity', 'networking'],
    pdfUrl: '/certificates/cybersecurity-fundamentals.pdf',
  },
  {
    slug: 'assets-threats-and-vulnerabilities',
    title: 'Assets, threats, and vulnerabilities',
    issuer: 'Google',
    issued: 'June 2024',
    credentialId: 'HD4Q2R954QN5',
    category: 'Cybersecurity professional programs',
    tags: ['Cybersecurity', 'Risk assessment'],
    skills: ['cybersecurity'],
    pdfUrl: '/certificates/assets-threats-and-vulnerabilities.pdf',
  },
  {
    slug: 'play-it-safe-manage-security-risks',
    title: 'Play it safe: Manage security risks',
    issuer: 'Google',
    issued: 'June 2024',
    credentialId: 'CTFBFUY2ARB9',
    category: 'Cybersecurity professional programs',
    tags: ['Cybersecurity', 'Risk management'],
    skills: ['cybersecurity'],
    pdfUrl: '/certificates/play-it-safe-manage-security-risks.pdf',
  },
  {
    slug: 'connect-and-protect-networks-and-network-security',
    title: 'Connect and protect: Networks and network security',
    issuer: 'Google',
    issued: 'June 2024',
    credentialId: 'T4AVSTSKBYM3',
    category: 'Cybersecurity professional programs',
    tags: ['Network security', 'Cybersecurity'],
    skills: ['networking', 'cybersecurity'],
    pdfUrl: '/certificates/connect-and-protect-networks-and-network-security.pdf',
  },
  {
    slug: 'tools-of-the-trade-linux-and-sql',
    title: 'Tools of the trade: Linux and SQL',
    issuer: 'Google',
    issued: 'June 2024',
    credentialId: 'LANZAT7JXHFV',
    category: 'Cybersecurity professional programs',
    tags: ['Linux', 'SQL', 'Cybersecurity'],
    skills: ['linux', 'sql', 'cybersecurity'],
    pdfUrl: '/certificates/tools-of-the-trade-linux-and-sql.pdf',
  },
  {
    slug: 'sound-the-alarm-detection-and-response',
    title: 'Sound the alarm: Detection and response',
    issuer: 'Google',
    issued: 'July 2024',
    credentialId: 'NV6SV43HY9NG',
    category: 'Cybersecurity professional programs',
    tags: ['Incident response', 'Cybersecurity'],
    skills: ['cybersecurity'],
    pdfUrl: '/certificates/sound-the-alarm-detection-and-response.pdf',
  },
  {
    slug: 'automate-cybersecurity-tasks-with-python',
    title: 'Automate cybersecurity tasks with Python',
    issuer: 'Google',
    issued: 'August 2024',
    credentialId: 'TKS7ROUWCJZL',
    category: 'Cybersecurity professional programs',
    tags: ['Python', 'Automation', 'Cybersecurity'],
    skills: ['python', 'programming', 'cybersecurity'],
    pdfUrl: '/certificates/automate-cybersecurity-tasks-with-python.pdf',
  },
  {
    slug: 'put-it-into-practice-prepare-for-cybersecurity-jobs',
    title: 'Put it into practice: Prepare for cybersecurity jobs',
    issuer: 'Google',
    issued: 'August 2024',
    credentialId: 'WZ1K210UJ0SN',
    category: 'Cybersecurity professional programs',
    tags: ['Cybersecurity', 'Career readiness'],
    skills: ['cybersecurity'],
    pdfUrl: '/certificates/put-it-into-practice-prepare-for-cybersecurity-jobs.pdf',
  },
  {
    slug: 'advanced-git',
    title: 'Advanced git',
    issuer: 'DataCamp',
    issued: 'June 2026',
    credentialId: '2fc52052ed6118b9f1ba54fbf6d33cecee78a95e',
    category: 'Git and GitHub development workflows',
    tags: ['Git', 'GitHub', 'Version control'],
    skills: ['git', 'programming'],
    pdfUrl: '/certificates/advanced-git.pdf',
  },
  {
    slug: 'intermediate-github-concepts',
    title: 'Intermediate GitHub concepts',
    issuer: 'DataCamp',
    issued: 'June 2026',
    credentialId: 'faf4278017042a0b483944f3ebff635235fe1bdc',
    category: 'Git and GitHub development workflows',
    tags: ['GitHub', 'Collaboration'],
    skills: ['git'],
    pdfUrl: '/certificates/intermediate-github-concepts.pdf',
  },
  {
    slug: 'intermediate-git',
    title: 'Intermediate git',
    issuer: 'DataCamp',
    issued: 'June 2026',
    credentialId: '2451e24c9df451ad80a91e57e918ff73d7a2f751',
    category: 'Git and GitHub development workflows',
    tags: ['Git', 'Version control'],
    skills: ['git'],
    pdfUrl: '/certificates/intermediate-git.pdf',
  },
  {
    slug: 'introduction-to-github-concepts',
    title: 'Introduction to GitHub concepts',
    issuer: 'DataCamp',
    issued: 'June 2026',
    credentialId: '5559bec76648cb42faf900c291f02d4dc01d951b',
    category: 'Git and GitHub development workflows',
    tags: ['GitHub', 'Version control'],
    skills: ['git'],
    pdfUrl: '/certificates/introduction-to-github-concepts.pdf',
  },
  {
    slug: 'introduction-to-git',
    title: 'Introduction to git',
    issuer: 'DataCamp',
    issued: 'June 2026',
    credentialId: '76e40f31fc82e27ec31afca61dea0244afcd5c3b',
    category: 'Git and GitHub development workflows',
    tags: ['Git', 'Version control'],
    skills: ['git'],
    pdfUrl: '/certificates/introduction-to-git.pdf',
  },
  {
    slug: 'intermediate-python',
    title: 'Intermediate Python',
    issuer: 'DataCamp',
    issued: 'July 2026',
    credentialId: 'a5f9cf025792e5ab5d0a8cf414dcd85adb5773c9',
    category: 'Python programming',
    tags: ['Python', 'Programming'],
    skills: ['python', 'programming'],
    pdfUrl: '/certificates/intermediate-python.pdf',
  },
  {
    slug: 'introduction-to-python',
    title: 'Introduction to Python',
    issuer: 'DataCamp',
    issued: 'June 2026',
    credentialId: 'fe9b121ed0924809f24988e082204e5f9392a58f',
    category: 'Python programming',
    tags: ['Python', 'Programming'],
    skills: ['python', 'programming'],
    pdfUrl: '/certificates/introduction-to-python.pdf',
  },
  {
    slug: 'introduction-to-programming-using-python',
    title: 'Introduction to programming using Python',
    issuer: 'Santander Open Academy',
    issued: 'July 2025',
    credentialId: 'OA-2025-0715001382444',
    category: 'Python programming',
    tags: ['Python', 'Programming'],
    skills: ['python', 'programming'],
    pdfUrl: '/certificates/introduction-to-programming-using-python.pdf',
  },
  {
    slug: 'project-management-and-agile-fundamentals',
    title: 'Project management and agile fundamentals',
    issuer: 'Santander Open Academy',
    issued: 'July 2025',
    credentialId: 'OA-2025-0701001309304',
    category: 'Project management and methodology',
    tags: ['Project management', 'Agile'],
    skills: ['project-management', 'agile'],
    pdfUrl: '/certificates/project-management-and-agile-fundamentals.pdf',
  },
]

export const PAPERS: PaperEntry[] = [
  {
    title: 'APaC: A context-aware and availability policy as code framework for elastic object storage',
    authors: 'Ignacio Castillo-Barrios, J. L. Gonzalez-Compean, Ivan Lopez-Arevalo, Jose Juan Garcia-Hernandez',
    venue: 'IEEE Transactions on Cloud Computing',
    year: '2026',
    summary: 'APaC introduces a context-reactive replication framework and Availability Policy-as-Code model that adapts object storage policies to workload fluctuations, outperforming static strategies by 16.6% to more than 70%.',
    doi: '10.1109/TCC.2026.3693716',
    skills: ['distributed-systems', 'software-architecture', 'algorithms', 'networking'],
  },
  {
    title: 'Turning data into insights in Jub, an extensible generic big data platform for life science and healthcare applications',
    authors: 'Ignacio Castillo-Barrios, Melesio Crespo-Sanchez, Hugo G. Reyes-Anastacio, Jose L. Gonzalez-Compean, Ivan Lopez-Arevalo, J. Carlos Morin-Garcia, Yelda A. Leal, Jaqueline Calderon-Hernandez, Heriberto Aguirre-Meneses, Marco Antonio Núñez-Gaona',
    venue: 'Scientific Reports',
    year: '2025',
    summary: 'Jub converts large-scale life science and healthcare datasets into cloud-based FAIR observatories, producing more than 85 million information products from over 114 million spatio-temporal profiles.',
    doi: '10.1038/s41598-025-32196-3',
    skills: ['distributed-systems', 'python', 'r', 'data-structures', 'programming'],
  },
  {
    title: 'CIATfunc: A frame-based serverless framework for composing secure End-to-End applications',
    authors: 'Ignacio Castillo-Barrios, Ricardo A. Ibarra-Garcia, Jose Luis Gonzalez-Compean, Arturo Diaz-Perez, Ivan Lopez-Arevalo, Miguel Morales-Sandoval, Jose Juan Garcia-Hernandez, Heriberto Aguirre Meneses, Marco Antonio Núñez Gaona',
    venue: 'IEEE Transactions on Services Computing',
    year: '2024',
    summary: 'CIATfunc combines Policy-as-Code and Infrastructure-as-Code to compose secure end-to-end applications, improving traceability and accelerating protected workflows through parallel security execution.',
    doi: '10.1109/TSC.2024.3168616',
    skills: ['software-architecture', 'distributed-systems', 'networking', 'programming'],
  },
  {
    title: 'MictlanX: Elastic code-defined object storage system',
    authors: 'Ignacio Castillo-Barrios, Jose Luis Gonzalez Compean, Ivan Lopez-Arevalo',
    venue: 'Proceedings of the 18th ACM International Systems and Storage Conference',
    year: '2025',
    summary: 'MictlanX upgrades object storage with elastic deployment and adaptive data placement models, sustaining burst workloads while outperforming fixed-replica modes and mainstream storage services in throughput and latency.',
    doi: '10.1145/3757347.3759148',
    skills: ['distributed-systems', 'software-architecture', 'networking', 'python'],
  },
  {
    title: 'Towards the Implementation of ONCA: A Generic, Scalable, and Massive Data Processing Platform for Information Discovery and Analytics',
    authors: 'Melesio Crespo-Sanchez, Hugo G. Reyes-Anastacio, J. L. Gonzalez-Compean, Jaqueline Calderon-Hernadez, Ignacio Castillo-Barrios',
    venue: 'Euro-Par 2024 Workshops / Lecture Notes in Computer Science',
    year: '2025',
    summary: 'ONCA presents a microservices-based platform that unifies large-scale data processing, observatory creation, information product publication, and query automation for health and environment analytics.',
    doi: '10.1007/978-3-031-90203-1_16',
    skills: ['distributed-systems', 'software-architecture', 'python', 'r', 'data-structures'],
  },
]

export const SKILL_ASSETS: SkillAssetEntry[] = [
  {
    title: 'Service topology blueprint',
    format: 'Architecture diagram',
    summary: 'A compact system map used to explain boundaries, telemetry paths, and failure surfaces in distributed service environments.',
    skills: ['software-architecture', 'distributed-systems', 'networking'],
  },
  {
    title: 'Replication policy flow',
    format: 'Research diagram',
    summary: 'A visual walkthrough of how context-aware replication decisions react to concurrency changes and storage demand shifts.',
    skills: ['distributed-systems', 'algorithms', 'networking'],
  },
  {
    title: 'Desktop delivery checklist',
    format: 'Implementation asset',
    summary: 'A lightweight release checklist covering interface polish, packaging, and system integration for cross-platform desktop apps.',
    skills: ['tauri', 'typescript', 'ui-design'],
  },
]

export const ABOUT_SUMMARY = 'I design and build reliable software systems with a strong focus on architecture, security, and long-term maintainability. My work bridges industry delivery, research practice, and teaching, including experience as a professor guiding students through software engineering and computer science projects.'

export const PORTFOLIO_SKILLS = SKILL_CATEGORIES.flatMap(category => category.items)

export const SKILL_ROUTE_PATHS = PORTFOLIO_SKILLS.map(skill => `/skills/${skill.slug}`)

export const PROJECT_ROUTE_PATHS = PROJECTS.map(project => project.path)

export function isSkillSlug (value: string): value is SkillSlug {
  return PORTFOLIO_SKILL_SLUGS.includes(value as SkillSlug)
}

export function getSkillBySlug (slug: string) {
  return PORTFOLIO_SKILLS.find(skill => skill.slug === slug) ?? null
}

export function getProjectBySlug (slug: string) {
  return PROJECTS.find(project => project.slug === slug) ?? null
}

export function getProjectsByTitles (titles: string[]) {
  return titles
    .map(title => PROJECTS.find(project => project.title === title) ?? null)
    .filter((project): project is ProjectEntry => project !== null)
}

export function getSkillCategoryBySlug (slug: string) {
  return SKILL_CATEGORIES.find(category => category.items.some(skill => skill.slug === slug)) ?? null
}

export function getEntriesForSkill<T extends { skills: SkillSlug[] }> (entries: T[], slug: SkillSlug) {
  return entries.filter(entry => entry.skills.includes(slug))
}
