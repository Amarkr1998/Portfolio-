"use client";

import { motion } from "framer-motion";
import { Mail, FileDown } from "lucide-react";
import { contact, socials } from "@/data/portfolio";
import { useEmailHref } from "@/hooks/useEmailHref";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export default function Contact() {
  const emailHref = useEmailHref();
  const links = [
    { label: "Email Me", ...emailHref, icon: Mail, primary: true, download: false },
    { label: "LinkedIn", href: socials.linkedin, target: "_blank" as const, rel: "noopener noreferrer" as const, icon: LinkedinIcon, primary: false, download: false },
    { label: "GitHub", href: socials.github, target: "_blank" as const, rel: "noopener noreferrer" as const, icon: GithubIcon, primary: false, download: false },
    { label: "Download Resume", href: socials.resumeFile, target: undefined, rel: undefined, icon: FileDown, primary: false, download: true },
  ];

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
            <motion.a
              key={link.label}
              href={link.href}
              download={link.download ? "Amar_Kumar_Resume.pdf" : undefined}
              target={link.target}
              rel={link.rel}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.96 }}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                link.primary
                  ? "bg-foreground text-background hover:opacity-90 glow-accent"
                  : "border border-border-strong text-foreground hover:bg-[var(--fill-subtle)]"
              }`}
            >
              <link.icon size={15} />
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
