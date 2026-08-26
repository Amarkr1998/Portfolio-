// Single source of truth for all portfolio content.
// Every fact here is verified against Amar Kumar's resume — nothing invented.

export const profile = {
  name: "Amar Kumar",
  location: "New Delhi, India",
  identity: "Java Full Stack Developer",
  experienceYears: "2+",
  currentRole: "Software Engineer",
  currentCompany: "Migun India Pvt. Ltd.",
  employmentPeriod: "May 2024 – Present",
  positioning:
    "Java Full Stack Developer specializing in scalable applications, secure REST APIs, microservices, distributed systems and AI/LLM integrations.",
  summary:
    "Java Full Stack Developer with 2+ years of experience designing and building scalable, secure, end-to-end applications. Works across the stack with Java, Spring Boot and React, and builds distributed systems using microservices, event-driven messaging and optimized relational databases. Extends traditional backend engineering into applied AI — building multi-agent LLM workflows, integrating LLM orchestration frameworks, and shipping production features on Docker and cloud infrastructure (AWS/Azure) with CI/CD automation.",
} as const;

export const hero = {
  headline: "Java Full Stack Engineer",
  heroTags: ["AI", "Microservices", "Cloud"],
  statement: "Building scalable, secure and AI-powered applications that create real impact.",
  status: "OPEN TO SOFTWARE ENGINEERING OPPORTUNITIES",
  ctaPrimary: "View My Work",
  ctaSecondary: "Download Resume",
} as const;

// Public contact channels only — phone number is intentionally omitted from
// client-side data per the resume's privacy handling requirement.
export const socials = {
  github: "https://github.com/Amarkr1998",
  linkedin: "https://www.linkedin.com/in/amar-kumar-a676b318b/",
  email: "mailto:amarkr2018@gmail.com",
  resumeFile: "/resume/Amar_Kumar_Resume.pdf",
} as const;

export type ConstellationNode = {
  id: string;
  label: string;
  category: "language" | "backend" | "frontend" | "ai" | "cloud" | "data" | "messaging" | "security" | "architecture";
  description: string;
};

// Only technologies verified in the resume. Edges are derived, not fabricated.
export const constellationNodes: ConstellationNode[] = [
  { id: "java", label: "Java", category: "language", description: "Core language for backend services (Java 17/21)." },
  { id: "spring-boot", label: "Spring Boot", category: "backend", description: "Primary framework for building REST services and microservices." },
  { id: "react", label: "React", category: "frontend", description: "Frontend library used across CredAssist360, FitTrack and IntelliMail." },
  { id: "spring-ai", label: "Spring AI", category: "ai", description: "Used in IntelliMail to orchestrate LLM calls from Spring Boot." },
  { id: "langgraph", label: "LangGraph", category: "ai", description: "Multi-agent workflow orchestration used in CredAssist360." },
  { id: "azure", label: "Azure", category: "cloud", description: "Azure AI Foundry, Azure OpenAI, Blob Storage and Container Apps." },
  { id: "postgresql", label: "PostgreSQL", category: "data", description: "Primary relational store, optimized for CredAssist360 and IntelliMail." },
  { id: "rabbitmq", label: "RabbitMQ", category: "messaging", description: "Asynchronous event messaging between FitTrack microservices." },
  { id: "docker", label: "Docker", category: "cloud", description: "Containerization for CI/CD and automated deployments." },
  { id: "microservices", label: "Microservices", category: "architecture", description: "Distributed service architecture used in FitTrack." },
  { id: "keycloak", label: "Keycloak", category: "security", description: "Identity and access management with OAuth2/JWT and RBAC." },
];

export const constellationEdges: [string, string][] = [
  ["java", "spring-boot"],
  ["spring-boot", "react"],
  ["spring-boot", "microservices"],
  ["spring-boot", "keycloak"],
  ["spring-boot", "postgresql"],
  ["microservices", "rabbitmq"],
  ["microservices", "docker"],
  ["microservices", "azure"],
  ["spring-ai", "spring-boot"],
  ["spring-ai", "azure"],
  ["langgraph", "azure"],
  ["langgraph", "postgresql"],
  ["docker", "azure"],
  ["keycloak", "react"],
];

export const engineeringStats = [
  { value: "2+", label: "Years Experience" },
  { value: "17 / 21", label: "Java" },
  { value: "Microservices", label: "Architecture" },
  { value: "LLM + Agents", label: "AI" },
  { value: "AWS + Azure", label: "Cloud" },
] as const;

export const aboutHighlights = [
  "Scalable applications",
  "Secure REST APIs",
  "Java & Spring Boot",
  "React",
  "Microservices",
  "Distributed systems",
  "Kafka / RabbitMQ",
  "Database optimization",
  "Docker",
  "CI/CD",
  "Cloud (AWS / Azure)",
  "AI / LLM integrations",
] as const;

export type TechCategory = {
  category: string;
  items: string[];
};

export const techStack: TechCategory[] = [
  { category: "Languages", items: ["Java 17/21", "Python", "SQL"] },
  { category: "Backend", items: ["Spring Boot", "Spring Cloud", "Spring AI", "Spring MVC", "Spring Security", "JPA/Hibernate", "REST APIs"] },
  { category: "Database & Caching", items: ["MySQL", "PostgreSQL", "PostGIS", "pgvector", "Redis"] },
  { category: "Generative AI", items: ["LangGraph", "RAG", "LLM Orchestration", "AI Agents"] },
  { category: "Frontend", items: ["React.js", "Next.js", "React Native", "JavaScript", "HTML5", "CSS3"] },
  { category: "Security & Messaging", items: ["OAuth2", "JWT", "Keycloak", "RBAC", "Kafka", "RabbitMQ"] },
  { category: "DevOps & Cloud", items: ["Docker", "Kubernetes", "Helm", "Terraform", "CI/CD", "AWS", "Azure"] },
  { category: "Testing & Monitoring", items: ["JUnit 5", "Mockito", "Integration Testing", "OpenTelemetry", "Prometheus", "Grafana", "Azure Monitor", "AWS CloudWatch"] },
  { category: "Architecture", items: ["Microservices", "API Gateway", "Service Discovery", "Event-Driven Architecture", "Distributed Systems"] },
  { category: "Tools", items: ["Git", "GitHub", "Maven", "Postman", "IntelliJ IDEA", "VS Code"] },
];

export type ExperienceEntry = {
  role: string;
  company: string;
  period: string;
  location: string;
  headline: string;
  summary: string;
  // Amar's primary full-stack product work at Migun — kept separate from
  // the CredAssist360 AI initiative below so the role doesn't read as if
  // CredAssist360 were the entirety of the job.
  platform: {
    label: string;
    positioning: string;
    responsibilities: string[];
    technology: string[];
    architecture: string[];
  };
  // References a slug in `projects` rather than duplicating CredAssist360's
  // technology/capabilities/architecture here — one source of truth, and
  // the Experience section's initiative card reuses the same ProjectDetails
  // modal the Projects section already opens for it.
  initiativeSlug: string;
};

export const experience: ExperienceEntry[] = [
  {
    role: "Software Engineer",
    company: "Migun India Pvt. Ltd.",
    period: "May 2024 – Present",
    location: "New Delhi, India",
    headline: "Building healthcare technology and customer-engagement solutions.",
    summary:
      "Developing scalable full-stack applications for customer inquiries, consultant/therapy bookings, service workflows and healthcare operations, alongside AI-powered healthcare credentialing solutions.",
    platform: {
      label: "Healthcare & Customer Management Platform",
      positioning:
        "Building scalable full-stack healthcare and customer-management applications that support customer inquiry management, consultant/therapy booking workflows, customer interactions and business operations.",
      responsibilities: [
        "Designed and developed end-to-end web application features using Java, Spring Boot, React.js and REST APIs.",
        "Developed customer inquiry management workflows.",
        "Built consultant/therapist booking and scheduling workflows.",
        "Developed backend APIs and business logic for healthcare and customer-management operations.",
        "Built responsive React interfaces for operational and customer-facing workflows.",
        "Implemented secure backend services using Spring Security, OAuth2/JWT, Keycloak and JPA/Hibernate.",
        "Worked with MySQL for application data management.",
        "Improved application reliability through exception handling, structured logging, testing and performance optimization.",
        "Used Docker and CI/CD practices for application delivery.",
        "Collaborated with business stakeholders to convert healthcare and marketing requirements into maintainable software features.",
      ],
      technology: [
        "Java",
        "Spring Boot",
        "React.js",
        "REST APIs",
        "MySQL",
        "Spring Security",
        "OAuth2/JWT",
        "Keycloak",
        "JPA/Hibernate",
        "Docker",
        "CI/CD",
        "JUnit 5",
        "Mockito",
      ],
      architecture: [
        "Customer",
        "Customer Inquiry",
        "Application",
        "Consultant / Therapy Booking",
        "Healthcare Service Workflow",
        "Business Operations",
      ],
    },
    initiativeSlug: "credassist360",
  },
];

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  date?: string;
  // "professional" = built as part of Amar's role at Migun India Pvt. Ltd.
  // "personal" = self-directed project for learning and skill development.
  type: "professional" | "personal";
  context: string;
  // Only set for projects still under active development — omitted (i.e.
  // treated as shipped/complete) otherwise.
  status?: string;
  repoUrl?: string;
  positioning: string;
  technology: string[];
  capabilities: string[];
  architecture: string[];
  detail: {
    problem: string;
    solution: string;
    ai?: string;
    security?: string;
    database?: string;
    messaging?: string;
    deployment?: string;
    engineeringDecisions?: string[];
  };
};

export const projects: Project[] = [
  {
    slug: "credassist360",
    title: "CredAssist360",
    subtitle: "AI-Powered Healthcare Provider Credentialing Platform",
    type: "professional",
    context: "Built at Migun India Pvt. Ltd.",
    positioning: "An AI-powered healthcare provider credentialing platform.",
    technology: [
      "Python",
      "LangGraph",
      "Azure AI Foundry",
      "Claude",
      "PostgreSQL",
      "Azure Blob Storage",
      "Docker",
      "GitHub Actions",
      "Azure Container Apps",
    ],
    capabilities: [
      "Provider onboarding",
      "Document processing",
      "Primary Source Verification (PSV)",
      "Multi-agent AI workflows",
      "Healthcare verification APIs",
      "Human-in-the-Loop review",
      "Document validation",
      "REST APIs",
      "PostgreSQL optimization",
      "Secure document management",
      "Automated deployments",
    ],
    architecture: [
      "DOCUMENT",
      "AI PROCESSING",
      "LANGGRAPH",
      "MULTI-AGENT WORKFLOW",
      "NPI / OIG / DEA / STATE MEDICAL BOARD APIs",
      "VALIDATION",
      "HUMAN-IN-THE-LOOP",
      "VERIFIED RESULT",
    ],
    detail: {
      problem:
        "Healthcare provider credentialing requires verifying practitioner documents and identities against multiple regulatory sources — a slow, manual, error-prone process.",
      solution:
        "CredAssist360 automates provider onboarding and document processing with a multi-agent LangGraph workflow that verifies submissions against NPI, OIG, DEA and State Medical Board APIs, routing uncertain cases into a Human-in-the-Loop review step.",
      ai: "Multi-agent workflows orchestrated with LangGraph, running on Azure AI Foundry with Claude as the underlying model.",
      database: "PostgreSQL, optimized for the credentialing workload.",
      deployment: "Docker containers deployed to Azure Container Apps, automated via GitHub Actions.",
      engineeringDecisions: [
        "Separated automated verification from human judgment via an explicit Human-in-the-Loop review stage rather than fully autonomous decisions.",
        "Used Azure Blob Storage for secure, auditable document management.",
      ],
    },
  },
  {
    slug: "fittrack",
    title: "FitTrack",
    subtitle: "AI-Enabled Fitness Management Platform",
    date: "December 2025",
    type: "personal",
    context: "Personal project — built for learning and skill development.",
    positioning: "An AI-enabled fitness management platform built on a Spring Cloud microservices architecture.",
    technology: [
      "Java 17",
      "Spring Boot",
      "Spring Cloud",
      "Microservices",
      "React",
      "TypeScript",
      "Azure OpenAI",
      "Keycloak",
      "JWT",
      "RabbitMQ",
      "PostgreSQL",
      "MySQL",
      "Docker",
      "Eureka",
      "API Gateway",
      "REST APIs",
      "Maven",
    ],
    capabilities: [
      "Asynchronous workout notifications",
      "Personalized AI coaching",
      "Workout-plan generation",
    ],
    architecture: [
      "REACT",
      "API GATEWAY",
      "SPRING MICROSERVICES",
      "RABBITMQ",
      "AI WORKFLOW",
      "AZURE OPENAI",
      "PERSONALIZED EXPERIENCE",
    ],
    detail: {
      problem:
        "Fitness tracking needs to combine reliable service architecture with responsive, personalized coaching — without coupling the user-facing app to slow AI generation calls.",
      solution:
        "FitTrack is built on Spring Boot/Spring Cloud microservices behind an API Gateway with Eureka service discovery and centralized configuration. RabbitMQ decouples workout events from AI processing, enabling asynchronous notifications and personalized AI coaching powered by Azure OpenAI.",
      ai: "Azure OpenAI generates personalized coaching content and workout plans, invoked asynchronously via RabbitMQ events.",
      security: "Keycloak/JWT authentication with RBAC across services.",
      database: "PostgreSQL and MySQL.",
      messaging: "RabbitMQ for asynchronous workout notifications and AI workflow triggers.",
      deployment: "Dockerized Spring microservices with Maven builds.",
      engineeringDecisions: [
        "Used Eureka for service discovery and an API Gateway as the single entry point for the React frontend.",
        "Decoupled AI-plan generation from the request path using RabbitMQ so coaching generation doesn't block user-facing responses.",
      ],
    },
  },
  {
    slug: "intellimail",
    title: "IntelliMail",
    subtitle: "AI-Driven Email Automation Platform",
    date: "January 2026",
    type: "personal",
    context: "Personal project — built for learning and skill development.",
    positioning: "An AI-driven email automation platform for generation, rewriting, summarization and translation.",
    technology: [
      "Java 21",
      "Spring Boot",
      "Spring AI",
      "React.js",
      "Azure OpenAI",
      "Chrome Extension",
      "PostgreSQL",
      "Docker",
      "JUnit 5",
      "Mockito",
    ],
    capabilities: [
      "Intelligent email generation",
      "Rewriting",
      "Summarization",
      "Translation",
      "Contextual responses",
    ],
    architecture: [
      "REACT",
      "REST API",
      "SPRING BOOT",
      "SPRING AI",
      "AZURE OPENAI",
      "GENERATE / REWRITE / SUMMARIZE / TRANSLATE",
    ],
    detail: {
      problem:
        "Composing effective email responses is repetitive and time-consuming, and context (tone, intent, thread history) is easy to lose across a busy inbox.",
      solution:
        "IntelliMail integrates a Chrome Extension and React UI with a Spring Boot backend that uses Spring AI to call Azure OpenAI for contextual generation, rewriting, summarization and translation of email content, delivered through a REST API.",
      ai: "Spring AI orchestrates calls to Azure OpenAI for generation, rewriting, summarization, translation and contextual responses.",
      security: "JWT authentication.",
      database: "PostgreSQL.",
      deployment: "Dockerized services with automated testing (JUnit 5, Mockito) and GitHub Actions CI/CD.",
      engineeringDecisions: [
        "Kept AI orchestration in the backend via Spring AI rather than calling the model directly from the client, keeping API keys and prompt logic server-side.",
      ],
    },
  },
  {
    slug: "foodloop",
    title: "FoodLoop",
    subtitle: "AI-Powered Hyperlocal Surplus-Food Redistribution Platform",
    type: "personal",
    context: "Personal project — built for learning and skill development.",
    status: "In active development — Phase 1: Platform Foundation.",
    repoUrl: "https://github.com/Amarkr1998/FoodLoop",
    positioning:
      "An enterprise-grade, AI-powered, hyperlocal surplus-food redistribution platform coordinating donor–receiver matching, expiry rescue and NGO pickup.",
    technology: [
      "Java 21",
      "Spring Boot",
      "Maven",
      "Next.js",
      "React Native",
      "Expo",
      "PostgreSQL",
      "PostGIS",
      "pgvector",
      "Redis",
      "Kafka",
      "RabbitMQ",
      "Keycloak",
      "Docker",
      "Kubernetes",
      "Helm",
      "Terraform",
      "Azure OpenAI",
      "OpenTelemetry",
      "Prometheus",
      "Grafana",
    ],
    capabilities: [
      "Surplus-food discovery",
      "AI-driven donor–receiver matching",
      "Expiry-window rescue coordination",
      "NGO pickup coordination",
      "Geospatial matching (PostGIS)",
      "Multi-tenant architecture",
      "Deterministic fallback mode (works without live AI calls)",
    ],
    architecture: [
      "WEB / MOBILE APPS",
      "API GATEWAY",
      "SPRING BOOT MICROSERVICES (BOUNDED CONTEXTS)",
      "AI AGENTS (DONOR-RECEIVER MATCHING)",
      "EVENT BUS (KAFKA / RABBITMQ)",
      "POSTGIS + PGVECTOR",
      "NGO PICKUP COORDINATION",
    ],
    detail: {
      problem:
        "Surplus food goes to waste because donors, receivers and NGOs lack a coordinated, real-time way to match, verify expiry windows, and arrange pickup within a local area.",
      solution:
        "FoodLoop coordinates surplus-food discovery, AI-driven donor–receiver matching, expiry-window rescue and NGO pickup logistics through an event-driven, geospatial, multi-tenant microservices architecture, organized into bounded-context Spring Boot modules with shared OpenAPI contracts and event schemas.",
      ai: "AI agent modules handle donor–receiver matching via Azure OpenAI/Azure AI Foundry, with a deterministic-only fallback mode so core flows (listing, claiming, pickup) work without live AI calls.",
      security: "Keycloak-based identity across a secure, multi-tenant architecture.",
      database: "PostgreSQL with PostGIS for geospatial queries and pgvector for similarity search, plus Redis.",
      messaging: "Kafka and RabbitMQ coordinate events across bounded-context microservices.",
      deployment: "Docker, Kubernetes and Helm for containerized deployment, Terraform for infrastructure, with OpenTelemetry, Prometheus and Grafana for observability.",
      engineeringDecisions: [
        "Organized the domain into bounded-context Spring Boot microservices with OpenAPI contracts and shared event schemas as the source of truth.",
        "Built a deterministic-only fallback mode so core flows work without live AI calls, decoupling the platform from AI provider availability.",
      ],
    },
  },
];

export const systemArchitecture = [
  "REACT",
  "REST APIs",
  "API GATEWAY",
  "MICROSERVICES",
  "SERVICE DISCOVERY",
  "DATABASE",
  "EVENT-DRIVEN MESSAGING",
  "AI SERVICES",
  "CLOUD",
] as const;

export const architectureTech = [
  "API Gateway",
  "Service Discovery",
  "Microservices",
  "Kafka",
  "RabbitMQ",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Azure",
  "AWS",
  "Docker",
] as const;

export const aiWorkflow = [
  "LLM",
  "PROMPT / CONTEXT",
  "RAG",
  "LLM ORCHESTRATION",
  "AI AGENTS",
  "TOOLS / APIs",
  "VALIDATION",
  "HUMAN-IN-THE-LOOP",
  "PRODUCTION WORKFLOW",
] as const;

export const aiTechnologies = [
  "LangGraph",
  "RAG",
  "LLM Orchestration",
  "AI Agents",
  "Spring AI",
  "Azure AI Foundry",
  "Azure OpenAI",
  "Claude",
] as const;

export const engineeringProcess = [
  { step: "01", label: "UNDERSTAND", description: "Clarify the problem, constraints and users before writing code." },
  { step: "02", label: "DESIGN", description: "Shape services, data models and API contracts up front." },
  { step: "03", label: "BUILD", description: "Implement in Java/Spring Boot and React with clean, focused commits." },
  { step: "04", label: "SECURE", description: "Bake in OAuth2/JWT, Keycloak and RBAC rather than bolting it on later." },
  { step: "05", label: "TEST", description: "Cover behavior with JUnit 5 and Mockito before it ships." },
  { step: "06", label: "OPTIMIZE", description: "Tune database queries and service boundaries under real load." },
  { step: "07", label: "DEPLOY", description: "Automate releases with Docker, GitHub Actions and Azure Container Apps." },
  { step: "08", label: "MONITOR", description: "Track health with Azure Monitor and AWS CloudWatch, then iterate." },
] as const;

export type ImpactPillar = { title: string; description: string; tags: string[] };

// Qualitative engineering strengths grounded in verified experience/skills —
// no invented metrics, since none exist in the source resume.
export const engineeringImpact: ImpactPillar[] = [
  {
    title: "Scalable Backend Systems",
    description:
      "Designs and ships Spring Boot microservices behind an API Gateway with service discovery and event-driven messaging.",
    tags: ["Spring Boot", "Microservices", "API Gateway", "Eureka", "RabbitMQ"],
  },
  {
    title: "Secure by Design",
    description:
      "Builds authentication and authorization into services from the start with OAuth2, JWT and Keycloak-backed RBAC.",
    tags: ["Spring Security", "OAuth2", "JWT", "Keycloak", "RBAC"],
  },
  {
    title: "Applied AI Engineering",
    description:
      "Ships production AI features — multi-agent LangGraph workflows, Spring AI orchestration and Human-in-the-Loop review — on Azure AI.",
    tags: ["LangGraph", "Spring AI", "Azure AI Foundry", "Azure OpenAI", "RAG"],
  },
  {
    title: "Cloud-Native Delivery",
    description:
      "Automates the path from commit to production with Docker, GitHub Actions and Azure Container Apps, backed by Azure Monitor and AWS CloudWatch.",
    tags: ["Docker", "CI/CD", "GitHub Actions", "Azure", "AWS"],
  },
];

export const certification = {
  name: "Microsoft Certified: Azure AI Apps and Agents Developer Associate",
  issuer: "Microsoft",
} as const;

export const education = {
  institution: "RCC Institute of Information Technology",
  degree: "B.Tech – Information Technology",
  period: "2019 – 2023",
  cgpa: "9.02",
} as const;

export const contact = {
  headline: "Have a system worth building?",
  subheadline: "Let's build something scalable.",
} as const;

export type RoleMatch = { role: string; keywords: string[] };

// For Recruiter View's "Match My Profile" section — each list is a reorganized
// view of technologies already verified above (techStack / experience /
// projects), grouped by the roles they're most relevant to. No new tech.
export const roleKeywordMatches: RoleMatch[] = [
  {
    role: "Software Engineer",
    keywords: ["Java 17/21", "Spring Boot", "REST APIs", "MySQL", "PostgreSQL", "Docker", "CI/CD", "Git", "JUnit 5", "Mockito"],
  },
  {
    role: "Java Backend Engineer",
    keywords: ["Java 17/21", "Spring Boot", "Spring Security", "JPA/Hibernate", "REST APIs", "MySQL", "PostgreSQL", "OAuth2/JWT", "Kafka/RabbitMQ"],
  },
  {
    role: "Java Full Stack Engineer",
    keywords: ["Java 17/21", "Spring Boot", "React.js", "REST APIs", "MySQL", "PostgreSQL", "OAuth2/JWT", "Docker", "CI/CD"],
  },
  {
    role: "Microservices Engineer",
    keywords: ["Microservices", "Spring Cloud", "API Gateway", "Service Discovery", "Event-Driven Architecture", "Kafka/RabbitMQ", "Docker", "Kubernetes", "Distributed Systems"],
  },
  {
    role: "AI Engineer",
    keywords: ["Python", "LangGraph", "RAG", "LLM Orchestration", "AI Agents", "Azure AI Foundry", "Azure OpenAI", "Claude", "PostgreSQL"],
  },
];

export const suggestedQuestions = [
  "What technologies does Amar specialize in?",
  "Tell me about Amar's projects.",
  "What is Amar's backend experience?",
  "Tell me about Amar's AI experience.",
  "What kind of roles is Amar looking for?",
  "Explain CredAssist360.",
  "What is Amar's experience with microservices?",
  "What security technologies has Amar worked with?",
] as const;

export const navSections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "architecture", label: "Architecture" },
  { id: "ai-engineering", label: "AI Engineering" },
  { id: "tech-stack", label: "Skills" },
  { id: "certification", label: "Certification" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
