import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UIStateProvider } from "@/components/providers/UIStateProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/ui/CustomCursor";
import CommandPalette from "@/components/ui/CommandPalette";
import AIAssistant from "@/components/AIAssistant";
import { profile } from "@/data/portfolio";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Amar Kumar",
  jobTitle: "Java Full Stack Developer",
  description:
    "Java Full Stack Developer specializing in scalable applications, secure REST APIs, microservices, distributed systems and AI/LLM integrations.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Delhi",
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Organization",
    name: "Migun India Pvt. Ltd.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <UIStateProvider>
          <SmoothScrollProvider>
            <CustomCursor />
            <Navbar />
            <CommandPalette />
            {children}
            <AIAssistant />
          </SmoothScrollProvider>
        </UIStateProvider>
      </body>
    </html>
  );
}
