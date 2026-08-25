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
  headline: "JAVA FULL STACK ENGINEER",
  secondaryIdentity: "AI • MICROSERVICES • CLOUD",
  statement: "Building scalable, secure and AI-powered applications.",
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
  { category: "Database & Caching", items: ["MySQL", "PostgreSQL", "Redis"] },
  { category: "Generative AI", items: ["LangGraph", "RAG", "LLM Orchestration", "AI Agents"] },
  { category: "Frontend", items: ["React.js", "JavaScript", "HTML5", "CSS3"] },
  { category: "Security & Messaging", items: ["OAuth2", "JWT", "Keycloak", "RBAC", "Kafka", "RabbitMQ"] },
  { category: "DevOps & Cloud", items: ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure"] },
  { category: "Testing & Monitoring", items: ["JUnit 5", "Mockito", "Integration Testing", "Azure Monitor", "AWS CloudWatch"] },
  { category: "Architecture", items: ["Microservices", "API Gateway", "Service Discovery", "Event-Driven Architecture", "Distributed Systems"] },
  { category: "Tools", items: ["Git", "GitHub", "Maven", "Postman", "IntelliJ IDEA", "VS Code"] },
];

export type ExperienceEntry = {
  role: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Software Engineer",
    company: "Migun India Pvt. Ltd.",
    period: "May 2024 – Present",
    location: "New Delhi, India",
    responsibilities: [
      "Designed and developed scalable end-to-end web applications using Java, Spring Boot, React.js, MySQL and REST APIs.",
      "Built secure backend services using Spring Security, OAuth2/JWT, Keycloak and JPA/Hibernate.",
      "Used Docker, CI/CD pipelines and JUnit 5/Mockito for testing and deployment.",
      "Developed CredAssist360, an AI-powered healthcare provider credentialing platform.",
      "Worked with Python, LangGraph, Azure AI Foundry and Claude to build AI-driven workflows.",
      "Built multi-agent AI workflows for automated document processing and verification.",
      "Integrated healthcare verification APIs (NPI, OIG, DEA, State Medical Board).",
      "Implemented Human-in-the-Loop review workflows for AI-assisted decisions.",
      "Designed REST APIs for internal services and platform integrations.",
      "Optimized PostgreSQL databases for performance and reliability.",
      "Used Azure Blob Storage for secure document management.",
      "Automated deployments using Docker, GitHub Actions and Azure Container Apps.",
      "Implemented exception handling, structured logging and performance optimizations.",
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  date?: string;
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
  { step: "01", label: "UNDERSTAND" },
  { step: "02", label: "DESIGN" },
  { step: "03", label: "BUILD" },
  { step: "04", label: "SECURE" },
  { step: "05", label: "TEST" },
  { step: "06", label: "MONITOR" },
  { step: "07", label: "DEPLOY" },
] as const;

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

export const suggestedQuestions = [
  "What is Amar's Java experience?",
  "Explain FitTrack.",
  "Explain CredAssist360.",
  "What AI technologies does Amar use?",
  "What is Amar's experience with microservices?",
  "Tell me about IntelliMail.",
  "What security technologies has Amar worked with?",
  "Summarize Amar's technical profile.",
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
