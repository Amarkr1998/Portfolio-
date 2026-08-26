import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UIStateProvider } from "@/components/providers/UIStateProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ClientWidgets from "@/components/providers/ClientWidgets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { profile, socials } from "@/data/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://amarkumar.dev";
const TITLE = "Amar Kumar | Java Full Stack Engineer & AI Engineer";
const DESCRIPTION =
  "Java Full Stack Developer with 2+ years of experience building scalable, secure applications using Java, Spring Boot, React, microservices, distributed systems and AI/LLM integrations.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Amar Kumar",
  },
  description: DESCRIPTION,
  keywords: [
    "Amar Kumar",
    "Java Full Stack Developer",
    "Spring Boot",
    "React",
    "Microservices",
    "AI Engineer",
    "LangGraph",
    "Azure OpenAI",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: `${profile.name} — Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.identity,
  description: profile.positioning,
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Delhi",
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Organization",
    name: profile.currentCompany,
  },
  sameAs: [socials.github, socials.linkedin],
  url: SITE_URL,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${profile.name} — Portfolio`,
  url: SITE_URL,
  description: DESCRIPTION,
  author: { "@type": "Person", name: profile.name },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <UIStateProvider>
          <SmoothScrollProvider>
            <Navbar />
            {children}
            <Footer />
            <ClientWidgets />
          </SmoothScrollProvider>
        </UIStateProvider>
      </body>
    </html>
  );
}
