import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { UIStateProvider } from "@/components/providers/UIStateProvider";
import ClientWidgets from "@/components/providers/ClientWidgets";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { themeInitScript } from "@/hooks/useTheme";
import { caseStudies, certification, education, profile, skillGroups, socials } from "@/data/portfolio";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";

// next/font downloads these at build time and serves them from this origin —
// no runtime requests to Google.
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["500", "600"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s — Amar Kumar" },
  description: SITE_DESCRIPTION,
  applicationName: "Amar Kumar — Portfolio",
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "Amar Kumar",
    "Java Full Stack Developer",
    "Java Developer",
    "Spring Boot",
    "React.js",
    "REST APIs",
    "SQL",
    "Healthcare software",
    "Spring AI",
    "Azure OpenAI",
    "New Delhi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Amar Kumar",
    locale: "en_IN",
    firstName: "Amar",
    lastName: "Kumar",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080D19" },
    { media: "(prefers-color-scheme: light)", color: "#F5F7FC" },
  ],
  // Lets the chat panel shrink with the on-screen keyboard instead of
  // being covered by it.
  interactiveWidget: "resizes-content",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: profile.summary,
  url: SITE_URL,
  email: `mailto:${socials.emailAddress}`,
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: profile.current.company },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: certification.name,
    credentialCategory: "certification",
    recognizedBy: { "@type": "Organization", name: certification.issuer },
    url: certification.url,
  },
  knowsAbout: Array.from(
    new Set(skillGroups.flatMap((g) => g.skills.filter((s) => s.evidence?.length).map((s) => s.name)))
  ),
  sameAs: [socials.linkedin, socials.github],
  subjectOf: caseStudies.map((c) => ({ "@type": "CreativeWork", name: c.title, url: `${SITE_URL}/work/${c.slug}` })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${sora.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored or system theme before first paint — no flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <UIStateProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <ClientWidgets />
        </UIStateProvider>
      </body>
    </html>
  );
}
