// Single source of truth for all portfolio content.
// Every fact here is taken from Amar Kumar's resume (SWE_Amar_26102026.pdf).
// Nothing is invented: no metrics, user counts, testimonials, repositories,
// live links or availability claims. Client work is kept separate from
// anything Amar did independently.

export const profile = {
  name: "Amar Kumar",
  firstName: "Amar",
  title: "Java Full Stack Developer",
  focus: "Enterprise Applications & AI Integrations",
  location: "New Delhi, India",
  experienceYears: "2+",
  summary:
    "Java Full Stack Developer with 2+ years of experience building enterprise applications using Java, Spring Boot, React.js, SQL and REST APIs. Professional work includes healthcare dashboards, backend services, complex reporting queries, authentication and AI-assisted application workflows.",
  current: {
    role: "Java Developer",
    company: "Calance Software Pvt. Ltd.",
    companyShort: "Calance",
    client: "UTIITSL",
    projects: "ESIC & ESIS",
    since: "Sep 2026",
  },
} as const;

export const hero = {
  eyebrow: "Java • Full Stack • AI Integrations",
  headline: "Engineering enterprise applications with clarity and purpose.",
  supporting:
    "I build Java and Spring Boot services, React interfaces and SQL-heavy reporting for healthcare workflows — and integrate AI where it helps people review, verify and decide.",
  context: ["Currently at Calance", "Client: UTIITSL", "New Delhi"],
} as const;

export const socials = {
  github: "https://github.com/Amarkr1998",
  linkedin: "https://www.linkedin.com/in/amar-kumar-a676b318b/",
  emailAddress: "amarkr2018@gmail.com",
  email: "mailto:amarkr2018@gmail.com",
  // mailto: depends on a registered mail client, which is frequently
  // unconfigured on desktop — clicking it then does nothing. Gmail's compose
  // URL works everywhere on desktop; hooks/useEmailHref picks per platform.
  emailCompose: "https://mail.google.com/mail/?view=cm&fs=1&to=amarkr2018@gmail.com",
  phoneDisplay: "+91 70793 86260",
  phoneHref: "tel:+917079386260",
  resumeFile: "/resume/Amar_Kumar_Resume.pdf",
} as const;

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  context?: string;
  period: string;
  start: string; // short label for the timeline rail
  location: string;
  summary: string;
  groups: { label?: string; caseStudy?: string; points: string[] }[];
  stack: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "calance",
    company: "Calance Software Pvt. Ltd.",
    role: "Java Developer",
    context: "Client: UTIITSL · Projects: ESIC & ESIS",
    period: "Sep 2026 – Present",
    start: "2026",
    location: "Delhi, India",
    summary: "Healthcare dashboard services and reporting APIs for the ESIC and ESIS projects.",
    groups: [
      {
        caseStudy: "esic-esis",
        points: [
          "Develop healthcare dashboard services using Java, Spring Boot and MySQL, covering beneficiaries, referrals, claims, payments and hospital analytics.",
          "Design and integrate REST APIs that deliver healthcare KPIs, financial summaries and hospital-level reports to React.js dashboards.",
          "Develop and optimise complex SQL for admissions, claim submissions, settlements, approved amounts and deductions, supporting operational and financial reporting.",
          "Implement dynamic KPI dashboards with multi-level filtering across date ranges, financial years, Regional Centres, states, hospitals and Top-N rankings.",
          "Investigate data discrepancies and API integration issues, refining query logic and backend responses to improve reporting accuracy.",
        ],
      },
    ],
    stack: ["Java", "Spring Boot", "MySQL", "SQL", "REST APIs", "React.js"],
  },
  {
    id: "migun",
    company: "Migun India Pvt. Ltd.",
    role: "Software Engineer",
    period: "May 2024 – Aug 2026",
    start: "2024",
    location: "New Delhi, India",
    summary: "Healthcare and customer-management applications, then the CredAssist360 credentialing platform.",
    groups: [
      {
        label: "Healthcare & customer-management applications",
        points: [
          "Developed applications using Java, Spring Boot, React.js and MySQL supporting customer inquiries, consultant appointments, therapy bookings and service workflows.",
          "Built REST APIs with Spring Data JPA and Hibernate, with authentication and role-based access control through Spring Security, OAuth2/JWT and Keycloak.",
          "Wrote unit tests with JUnit 5 and Mockito to validate backend business logic, and containerised applications with Docker.",
        ],
      },
      {
        label: "CredAssist360",
        caseStudy: "credassist360",
        points: [
          "Developed an AI-powered healthcare provider credentialing platform using Java, Spring Boot, Spring AI and Azure OpenAI, supporting provider onboarding, document processing and Primary Source Verification (PSV).",
          "Implemented AI-assisted verification workflows integrating external credentialing services, with Human-in-the-Loop review for document validation and compliance decisions.",
          "Built persistence workflows with PostgreSQL and Spring Data JPA, integrated Azure Blob Storage for document management, and automated deployments with GitHub Actions and Azure Container Apps.",
        ],
      },
    ],
    stack: [
      "Java",
      "Spring Boot",
      "React.js",
      "MySQL",
      "Spring Data JPA",
      "Hibernate",
      "Spring Security",
      "OAuth2/JWT",
      "Keycloak",
      "JUnit 5",
      "Mockito",
      "Docker",
      "Spring AI",
      "Azure OpenAI",
      "PostgreSQL",
      "Azure Blob Storage",
      "GitHub Actions",
      "Azure Container Apps",
    ],
  },
];

// ---------------------------------------------------------------------------
// Case studies (professional client / employer work only)
// ---------------------------------------------------------------------------

export type FlowNode = { label: string; detail?: string };

export type CaseStudy = {
  slug: string;
  title: string;
  kind: string; // one-line descriptor
  employer: string;
  client?: string;
  role: string;
  period: string;
  overview: {
    problem: string;
    contribution: string;
  };
  stack: string[];
  context: string[];
  myRole: string[];
  problem: string[];
  workflows: { title: string; body: string }[];
  contribution: { area: string; points: string[] }[];
  flow: { caption: string; nodes: FlowNode[]; note?: string };
  constraints: string[];
  outcomes: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "esic-esis",
    title: "ESIC & ESIS Healthcare Dashboard",
    kind: "Healthcare analytics & reporting services",
    employer: "Calance Software Pvt. Ltd.",
    client: "UTIITSL",
    role: "Java Developer",
    period: "Sep 2026 – Present",
    overview: {
      problem:
        "Healthcare operations need one consistent view of beneficiaries, referrals, claims, payments and hospital activity — sliceable by period, region and hospital without the numbers drifting apart.",
      contribution:
        "Backend dashboard services, reporting REST APIs and the complex SQL behind admissions, claims, settlements and deductions — plus multi-level dashboard filtering.",
    },
    stack: ["Java", "Spring Boot", "MySQL", "SQL", "REST APIs", "React.js"],
    context: [
      "Client engagement delivered through Calance Software for UTIITSL on the ESIC and ESIS projects.",
      "The work centres on healthcare dashboards: the services and queries that turn operational and financial records into KPIs, summaries and hospital-level reports.",
    ],
    myRole: [
      "Java Developer on the dashboard services — designing and integrating the REST APIs that feed React.js dashboards, and writing the SQL that produces their figures.",
      "Investigating data discrepancies and API integration issues when reported values or responses don't line up.",
    ],
    problem: [
      "Dashboard consumers need healthcare KPIs, financial summaries and hospital-level reports that stay consistent across modules.",
      "The same figures must be filterable across date ranges, financial years, Regional Centres, states and hospitals, and rankable as Top-N lists.",
      "Reporting covers money as well as activity — admissions, claim submissions, settlements, approved amounts and deductions — so query logic has to be precise.",
    ],
    workflows: [
      { title: "Beneficiaries", body: "Beneficiary-level dashboard services." },
      { title: "Referrals", body: "Referral analytics within the dashboard." },
      { title: "Claims", body: "Claim submissions, settlements, approved amounts and deductions." },
      { title: "Payments", body: "Payment and financial summary reporting." },
      { title: "Hospital analytics", body: "Hospital-level reports, admissions and Top-N rankings." },
    ],
    contribution: [
      {
        area: "Dashboard services",
        points: [
          "Healthcare dashboard services in Java, Spring Boot and MySQL across beneficiaries, referrals, claims, payments and hospital analytics.",
        ],
      },
      {
        area: "Reporting APIs",
        points: [
          "REST APIs delivering healthcare KPIs, financial summaries and hospital-level reports to React.js dashboards.",
        ],
      },
      {
        area: "SQL",
        points: [
          "Complex queries for admissions, claim submissions, settlements, approved amounts and deductions, supporting operational and financial reporting.",
          "Query optimisation as part of developing those reports.",
        ],
      },
      {
        area: "Filtering",
        points: [
          "Dynamic KPI dashboards with multi-level filters: date ranges, financial years, Regional Centres (RC), states, hospitals and Top-N rankings.",
        ],
      },
      {
        area: "Accuracy",
        points: [
          "Investigation of data discrepancies and API integration issues, refining query logic and backend responses to improve reporting accuracy.",
        ],
      },
    ],
    flow: {
      caption: "Conceptual reporting flow",
      nodes: [
        { label: "MySQL", detail: "Admissions, claims, settlements, payments" },
        { label: "SQL", detail: "Aggregations, deductions, Top-N" },
        { label: "Spring Boot services", detail: "Dashboard modules" },
        { label: "REST APIs", detail: "KPIs, financial summaries, reports" },
        { label: "React.js dashboards", detail: "Date · FY · RC · State · Hospital" },
      ],
      note: "Simplified to the layers described in this case study. It is not the client's actual system architecture.",
    },
    constraints: [
      "Client confidentiality: no screenshots, data, endpoints or code from the client system are shown here. Previews on this site are conceptual.",
      "Figures must reconcile across filters — the same claim or admission should report consistently by period, region and hospital.",
      "Financial reporting (approved amounts, settlements, deductions) leaves little room for approximate query logic.",
    ],
    outcomes: [
      "Dashboard services covering five healthcare modules: beneficiaries, referrals, claims, payments and hospital analytics.",
      "REST APIs serving KPIs, financial summaries and hospital-level reports to React.js dashboards.",
      "Multi-level filtering across date ranges, financial years, Regional Centres, states, hospitals and Top-N rankings.",
      "Refined query logic and backend responses following discrepancy investigations, improving reporting accuracy.",
    ],
  },
  {
    slug: "credassist360",
    title: "CredAssist360",
    kind: "AI-powered healthcare provider credentialing",
    employer: "Migun India Pvt. Ltd.",
    role: "Software Engineer",
    period: "Within May 2024 – Aug 2026",
    overview: {
      problem:
        "Credentialing a healthcare provider means collecting documents, checking them against primary sources and making compliance calls — work that is slow by hand but too consequential to fully automate.",
      contribution:
        "Built the platform in Java, Spring Boot and Spring AI with Azure OpenAI: onboarding, document processing, AI-assisted verification against external services, and human review.",
    },
    stack: [
      "Java",
      "Spring Boot",
      "Spring AI",
      "Azure OpenAI",
      "PostgreSQL",
      "Spring Data JPA",
      "Azure Blob Storage",
      "GitHub Actions",
      "Azure Container Apps",
    ],
    context: [
      "Developed at Migun India Pvt. Ltd. as an AI-powered healthcare provider credentialing platform.",
      "Credentialing combines document handling, Primary Source Verification (PSV) and compliance decisions about whether a provider's credentials hold up.",
    ],
    myRole: [
      "Developed the platform using Java, Spring Boot, Spring AI and Azure OpenAI.",
      "Implemented the AI-assisted verification workflows, the persistence layer, document storage integration and deployment automation.",
    ],
    problem: [
      "Provider onboarding produces documents that must be processed and validated before a provider can be credentialed.",
      "Verification depends on external credentialing services — Primary Source Verification rather than self-reported data.",
      "Document validation and compliance decisions carry real consequences, so AI output needs a human checkpoint rather than the final word.",
    ],
    workflows: [
      { title: "Provider onboarding", body: "Capturing provider information and supporting documents." },
      { title: "Document processing", body: "AI-assisted processing of submitted documents with Spring AI and Azure OpenAI." },
      { title: "Primary Source Verification", body: "Verification workflows integrating external credentialing services." },
      { title: "Human-in-the-Loop review", body: "Reviewers validate documents and make compliance decisions." },
    ],
    contribution: [
      {
        area: "AI integration",
        points: [
          "Spring AI with Azure OpenAI for document processing inside a Java / Spring Boot application.",
          "AI-assisted verification workflows integrating external credentialing services.",
        ],
      },
      {
        area: "Review workflow",
        points: ["Human-in-the-Loop (HITL) review for document validation and compliance decisions."],
      },
      {
        area: "Persistence & documents",
        points: [
          "Persistence workflows with PostgreSQL and Spring Data JPA.",
          "Azure Blob Storage integration for document management.",
        ],
      },
      {
        area: "Delivery",
        points: ["Automated deployments with GitHub Actions to Azure Container Apps."],
      },
    ],
    flow: {
      caption: "Conceptual credentialing flow",
      nodes: [
        { label: "Provider onboarding", detail: "Details and documents" },
        { label: "Azure Blob Storage", detail: "Document management" },
        { label: "Spring Boot + Spring AI", detail: "Document processing" },
        { label: "Azure OpenAI", detail: "AI assistance" },
        { label: "External credentialing services", detail: "Primary Source Verification" },
        { label: "Human-in-the-Loop review", detail: "Validation and compliance decisions" },
        { label: "PostgreSQL", detail: "Spring Data JPA persistence" },
      ],
      note: "A conceptual sequence of the workflows described here, not a deployment diagram. Delivery: GitHub Actions → Azure Container Apps.",
    },
    constraints: [
      "Compliance-relevant decisions stay with people: AI assists verification, while HITL review validates documents and makes compliance calls.",
      "Verification depends on external credentialing services, so the workflow has to integrate sources it doesn't control.",
      "Provider documents need managed storage outside the database — handled through Azure Blob Storage.",
    ],
    outcomes: [
      "Provider onboarding, document processing and Primary Source Verification supported in one platform.",
      "AI-assisted verification workflows with a Human-in-the-Loop review step.",
      "Persistence on PostgreSQL with Spring Data JPA, and document management on Azure Blob Storage.",
      "Automated deployments through GitHub Actions to Azure Container Apps.",
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------------------
// Independent projects (self-directed, public on GitHub — not employer work).
// Summaries are condensed from each repository's README; caveats the README
// states (demo data, phase status) are kept.
// ---------------------------------------------------------------------------

export type IndependentProject = {
  repo: string; // GitHub repository name
  title: string;
  domain: string;
  // Colour-standard category for the project's primary domain (lib/tones.ts).
  tone: "backend" | "frontend" | "data" | "security" | "ai" | "cloud" | "testing";
  summary: string;
  stack: string[];
  note?: string;
  featured?: boolean;
};

export const githubProfile = "https://github.com/Amarkr1998";
export const repoUrl = (repo: string) => `${githubProfile}/${repo}`;

export const independentProjects: IndependentProject[] = [
  {
    repo: "Meridian-Bank",
    title: "Meridian Bank",
    domain: "Fintech · Microservices",
    tone: "security",
    summary:
      "Digital banking and payments platform: Spring Boot microservices with a double-entry ledger, idempotent payment APIs, fraud/AML and maker-checker controls, a full audit trail, and React customer and operations portals.",
    stack: ["Java 21", "Spring Boot", "Kafka", "PostgreSQL", "Redis", "React", "TypeScript", "Kubernetes"],
    note: "Fictional demo bank — no real customer or payment data.",
    featured: true,
  },
  {
    repo: "DeployForge",
    title: "DeployForge",
    domain: "Platform engineering",
    tone: "cloud",
    summary:
      "AI-assisted internal developer platform for secure delivery: deployment orchestration, release approval, health-based automatic rollback, incident automation and release-risk assessment, with a React engineering dashboard.",
    stack: ["Java 21", "Spring Boot", "Kafka", "PostgreSQL", "Keycloak", "React", "Kubernetes", "Terraform"],
    featured: true,
  },
  {
    repo: "Agentguard",
    title: "AgentGuard",
    domain: "AI security",
    tone: "ai",
    summary:
      "Security and governance control plane for autonomous AI agents: identity-aware authorization, policy enforcement, runtime risk evaluation, human approval and quarantine, a security graph, and Azure AI-assisted incident investigation.",
    stack: ["Java 21", "Spring Boot", "Keycloak", "Kafka", "PostgreSQL", "Neo4j", "Azure OpenAI", "React"],
    featured: true,
  },
  {
    repo: "Agastyai",
    title: "Agastya AI",
    domain: "AI · RAG",
    tone: "ai",
    summary:
      "Multi-tenant document Q&A over policies and SOPs with page-level citations. If retrieval finds nothing relevant, the model is never called — it answers “not found” instead of guessing.",
    stack: ["Spring Boot", "Spring AI", "PostgreSQL", "pgvector", "Ollama / OpenAI"],
  },
  {
    repo: "IntelliMail",
    title: "IntelliMail",
    domain: "AI · Productivity",
    tone: "ai",
    summary:
      "Writes, rewrites, summarises and translates email with Azure OpenAI via Spring AI — delivered as a REST API, a React app and a Chrome extension inside Gmail.",
    stack: ["Spring Boot", "Spring AI", "Azure OpenAI", "PostgreSQL", "React", "Chrome Extension"],
  },
  {
    repo: "HealthSync360",
    title: "HealthSync360",
    domain: "Full stack · Wellness",
    tone: "frontend",
    summary:
      "Wellness-technology platform: a Spring Boot REST API with JWT and Redis-backed refresh tokens, plus a React storefront, customer portal and admin console.",
    stack: ["Spring Boot", "Spring Security", "MySQL", "Redis", "React", "TypeScript"],
  },
  {
    repo: "FitTrack",
    title: "FitTrack",
    domain: "Microservices · AI",
    tone: "backend",
    summary:
      "Fitness platform on Spring Cloud microservices — Eureka, API gateway and config server — with RabbitMQ workout events and an Azure OpenAI coaching service.",
    stack: ["Spring Cloud", "Keycloak", "RabbitMQ", "PostgreSQL", "MySQL", "React"],
  },
  {
    repo: "FoodLoop",
    title: "FoodLoop",
    domain: "AI · Geospatial",
    tone: "data",
    summary:
      "Hyperlocal surplus-food redistribution platform designed around AI-assisted donor–receiver matching on an event-driven, geospatial, multi-tenant architecture.",
    stack: ["Spring Boot", "Next.js", "PostGIS", "Kafka", "RabbitMQ", "Keycloak"],
    note: "In development — Phase 1, platform foundation.",
  },
  {
    repo: "AI-COMPANION",
    title: "AI Companion",
    domain: "AI · Desktop",
    tone: "frontend",
    summary:
      "Desktop AI assistant that lives on screen as an animated floating cat: chat, coding help, opt-in screen understanding, voice, memory and reminders.",
    stack: ["Spring Boot", "React", "Electron", "PostgreSQL", "Redis"],
  },
  {
    repo: "Customer-churn-ai",
    title: "Customer Churn AI",
    domain: "Machine learning",
    tone: "data",
    summary:
      "End-to-end ML platform for churn and lifetime-value prediction, segmentation and anomaly detection, with SHAP explanations, a FastAPI service and a Streamlit dashboard.",
    stack: ["Python", "XGBoost", "LightGBM", "SHAP", "FastAPI", "MLflow"],
    note: "Trained on a synthetic demo dataset.",
  },
  {
    repo: "Merger-Agent-",
    title: "Excel Merge Agent",
    domain: "AI agent",
    tone: "ai",
    summary:
      "AutoGen agent on Azure OpenAI that inspects two Excel files, finds the join key, scores its confidence and writes a merge report — with a manual override.",
    stack: ["Python", "AutoGen", "Azure OpenAI", "Streamlit"],
  },
];

// Which independent repos use a skill, as stated in each repo's README.
// Keyed by the skill names in `skillGroups`. Kept apart from `evidence`,
// which is professional work only.
export const skillRepos: Record<string, string[]> = {
  "Java 17/21": ["Meridian-Bank", "DeployForge", "Agentguard", "Agastyai", "IntelliMail", "HealthSync360", "FitTrack", "FoodLoop", "AI-COMPANION"],
  "Spring Boot": ["Meridian-Bank", "DeployForge", "Agentguard", "Agastyai", "IntelliMail", "HealthSync360", "FitTrack", "FoodLoop", "AI-COMPANION"],
  "REST APIs": ["HealthSync360", "IntelliMail"],
  "Spring Data JPA": ["Meridian-Bank", "HealthSync360", "IntelliMail"],
  Hibernate: ["Meridian-Bank", "HealthSync360"],
  "Spring Cloud": ["FitTrack"],
  Python: ["Customer-churn-ai", "Merger-Agent-"],
  Microservices: ["Meridian-Bank", "FitTrack"],
  "API Gateway": ["Meridian-Bank", "FitTrack"],
  "Service Discovery": ["FitTrack"],
  "Event-Driven Architecture": ["Meridian-Bank", "FoodLoop"],
  "React.js": ["Meridian-Bank", "DeployForge", "Agentguard", "IntelliMail", "HealthSync360", "FitTrack", "AI-COMPANION"],
  MySQL: ["HealthSync360", "FitTrack"],
  PostgreSQL: ["Meridian-Bank", "DeployForge", "Agentguard", "Agastyai", "IntelliMail", "FitTrack", "FoodLoop", "AI-COMPANION"],
  Redis: ["Meridian-Bank", "DeployForge", "HealthSync360", "AI-COMPANION"],
  "Spring Security": ["Meridian-Bank", "HealthSync360", "IntelliMail"],
  "OAuth2 / JWT": ["Agentguard", "HealthSync360", "IntelliMail"],
  Keycloak: ["DeployForge", "Agentguard", "FitTrack", "FoodLoop"],
  RBAC: ["Meridian-Bank", "Agentguard"],
  Kafka: ["Meridian-Bank", "DeployForge", "Agentguard", "FoodLoop"],
  RabbitMQ: ["FitTrack", "FoodLoop"],
  "Spring AI": ["IntelliMail", "Agastyai"],
  "Azure OpenAI": ["IntelliMail", "FitTrack", "Agentguard", "AI-COMPANION", "Merger-Agent-"],
  "Human-in-the-Loop workflows": ["Agentguard"],
  RAG: ["Agastyai", "AI-COMPANION"],
  "AI Agents": ["Merger-Agent-"],
  Docker: ["Meridian-Bank", "DeployForge", "Agastyai", "IntelliMail", "HealthSync360", "FoodLoop", "AI-COMPANION"],
  "GitHub Actions": ["HealthSync360", "AI-COMPANION"],
  Kubernetes: ["Meridian-Bank", "DeployForge"],
  "JUnit 5": ["Meridian-Bank"],
  Mockito: ["Meridian-Bank"],
};

export const projectTitle = (repo: string) => independentProjects.find((p) => p.repo === repo)?.title ?? repo;

// ---------------------------------------------------------------------------
// Expertise
// ---------------------------------------------------------------------------

// Where a skill appears in the resume's professional experience. Skills with
// no evidence key are listed in the resume's skills section only.
export type Evidence = "esic" | "migun" | "credassist";

export const evidenceLabels: Record<Evidence, string> = {
  esic: "ESIC & ESIS",
  migun: "Migun apps",
  credassist: "CredAssist360",
};

// Context for each body of work, used by the stack map's hubs and panel.
export const evidenceDetails: Record<Evidence, { title: string; context: string; href: string }> = {
  esic: { title: "ESIC & ESIS", context: "Calance Software · Client UTIITSL · 2026 – present", href: "/work/esic-esis" },
  migun: { title: "Migun applications", context: "Migun India · healthcare & customer management · 2024 – 2026", href: "/#experience" },
  credassist: { title: "CredAssist360", context: "Migun India · AI-powered provider credentialing", href: "/work/credassist360" },
};

export type Skill = { name: string; evidence?: Evidence[] };
export type SkillGroup = { id: string; title: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    title: "Java & backend",
    skills: [
      { name: "Java 17/21", evidence: ["esic", "migun", "credassist"] },
      { name: "Spring Boot", evidence: ["esic", "migun", "credassist"] },
      { name: "REST APIs", evidence: ["esic", "migun"] },
      { name: "Spring Data JPA", evidence: ["migun", "credassist"] },
      { name: "Hibernate", evidence: ["migun"] },
      { name: "Spring MVC" },
      { name: "Spring Cloud" },
      { name: "Python" },
      { name: "Microservices" },
      { name: "API Gateway" },
      { name: "Service Discovery" },
      { name: "Event-Driven Architecture" },
      { name: "Distributed Systems" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { name: "React.js", evidence: ["esic", "migun"] },
      { name: "JavaScript" },
      { name: "HTML5" },
      { name: "CSS3" },
    ],
  },
  {
    id: "data",
    title: "Databases & caching",
    skills: [
      { name: "SQL", evidence: ["esic"] },
      { name: "MySQL", evidence: ["esic", "migun"] },
      { name: "PostgreSQL", evidence: ["credassist"] },
      { name: "Redis" },
    ],
  },
  {
    id: "security",
    title: "Security & messaging",
    skills: [
      { name: "Spring Security", evidence: ["migun"] },
      { name: "OAuth2 / JWT", evidence: ["migun"] },
      { name: "Keycloak", evidence: ["migun"] },
      { name: "RBAC", evidence: ["migun"] },
      { name: "Kafka" },
      { name: "RabbitMQ" },
    ],
  },
  {
    id: "ai",
    title: "AI integrations",
    skills: [
      { name: "Spring AI", evidence: ["credassist"] },
      { name: "Azure OpenAI", evidence: ["credassist"] },
      { name: "Human-in-the-Loop workflows", evidence: ["credassist"] },
      { name: "LangGraph" },
      { name: "RAG" },
      { name: "LLM Orchestration" },
      { name: "AI Agents" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & delivery",
    skills: [
      { name: "Docker", evidence: ["migun"] },
      { name: "GitHub Actions", evidence: ["credassist"] },
      { name: "Azure Container Apps", evidence: ["credassist"] },
      { name: "Azure Blob Storage", evidence: ["credassist"] },
      { name: "Kubernetes" },
      { name: "CI/CD" },
      { name: "AWS" },
      { name: "Azure" },
    ],
  },
  {
    id: "testing",
    title: "Testing & observability",
    skills: [
      { name: "JUnit 5", evidence: ["migun"] },
      { name: "Mockito", evidence: ["migun"] },
      { name: "Integration Testing" },
      { name: "Azure Monitor" },
      { name: "AWS CloudWatch" },
    ],
  },
];

export const tools = [
  "Git",
  "GitHub",
  "Maven",
  "Postman",
  "IntelliJ IDEA",
  "VS Code",
  "GitHub Copilot",
  "Claude Code",
  "Cursor",
] as const;

// ---------------------------------------------------------------------------
// About, education, certification
// ---------------------------------------------------------------------------

export const about = {
  lead: "I work where enterprise software gets specific: the API contract a dashboard depends on, the SQL that decides whether a settlement figure is right, the access rule that keeps a booking workflow safe.",
  paragraphs: [
    "Most of my professional work has been in healthcare. At Calance, for the ESIC and ESIS projects, I build dashboard services and reporting APIs over beneficiaries, referrals, claims, payments and hospital activity. At Migun India I built customer-management and healthcare applications — inquiries, consultant appointments, therapy bookings — with Spring Security, OAuth2/JWT and Keycloak handling access.",
    "My AI work is practical rather than speculative. On CredAssist360 I used Spring AI and Azure OpenAI inside a Java application to support provider onboarding, document processing and Primary Source Verification, and kept people in the loop for validation and compliance decisions.",
  ],
  focus: [
    { title: "Enterprise applications", body: "Java and Spring Boot services with React.js front ends." },
    { title: "Healthcare domain", body: "Claims, referrals, hospital analytics, bookings and credentialing." },
    { title: "APIs & data workflows", body: "REST APIs, JPA/Hibernate and reporting SQL on MySQL and PostgreSQL." },
    { title: "Practical AI integration", body: "Spring AI and Azure OpenAI with human review built in." },
  ],
} as const;

export const education = {
  institution: "RCC Institute of Information Technology",
  degree: "B.Tech in Information Technology",
  period: "2019 – 2023",
  cgpa: "9.02",
} as const;

export const certification = {
  name: "Microsoft Certified: Azure AI Apps and Agents Developer Associate",
  issuer: "Microsoft",
  issued: "Aug 2026",
  url: "https://learn.microsoft.com/en-us/users/amarkumar-7087/credentials/1900adc283b321b5",
} as const;

export const contact = {
  headline: "Let’s discuss your next engineering challenge.",
  body: "Whether it's a Java backend, a reporting-heavy dashboard or an AI-assisted workflow, email is the quickest way to reach me.",
} as const;

// ---------------------------------------------------------------------------
// Navigation & assistant
// ---------------------------------------------------------------------------

export const navSections = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "expertise", label: "Expertise" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const suggestedQuestions = [
  "What is Amar’s Java experience?",
  "What did Amar contribute to ESIC and ESIS?",
  "Explain CredAssist360.",
  "Which technologies does Amar use?",
] as const;
