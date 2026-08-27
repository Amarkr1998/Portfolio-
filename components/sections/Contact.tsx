"use client";

import { motion } from "framer-motion";
import { Mail, FileDown } from "lucide-react";
import { contact, socials } from "@/data/portfolio";
import Magnetic from "@/components/ui/Magnetic";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

const links = [
  { label: "Email Me", href: socials.email, icon: Mail, primary: true, download: false },
  { label: "LinkedIn", href: socials.linkedin, icon: LinkedinIcon, primary: false, download: false },
  { label: "GitHub", href: socials.github, icon: GithubIcon, primary: false, download: false },
  { label: "Download Resume", href: socials.resumeFile, icon: FileDown, primary: false, download: true },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 px-5 sm:px-8">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.14), transparent 70%)",
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-semibold tracking-tight mb-4"
        >
          {contact.headline}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted mb-12"
        >
          {contact.subheadline}
        </motion.p>

        <div className="flex flex-wrap justify-center gap-3">
          {links.map((link, i) => (
            <Magnetic key={link.label}>
              <motion.a
                href={link.href}
                download={link.download ? "Amar_Kumar_Resume.pdf" : undefined}
                target={link.download || link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                whileTap={{ scale: 0.96 }}
                data-cursor="interactive"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-colors ${
                  link.primary
                    ? "bg-foreground text-background hover:opacity-90 glow-accent"
                    : "border border-border-strong text-foreground hover:bg-[var(--fill-subtle)]"
                }`}
              >
                <link.icon size={15} />
                {link.label}
              </motion.a>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
}
