import { ArrowUpRight, FileText, Mail, Phone } from "lucide-react";
import { contact, socials } from "@/data/portfolio";
import { CopyEmailButton, EmailLink } from "@/components/ui/ContactActions";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="section relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[60rem] max-w-[160%] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
        <div className="hairline-grid absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_0%,#000,transparent_80%)]" />
      </div>

      <div className="container-x">
        <p className="section-label reveal">
          <span className="num">07</span>
          <span>Contact</span>
        </p>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
          <div className="reveal">
            <h2 id="contact-heading" className="display-xl max-w-[16ch]">
              {contact.headline}
            </h2>
            <p className="lede mt-6">{contact.body}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <EmailLink className="btn btn-primary">
                <Mail size={16} aria-hidden="true" />
                Email me
              </EmailLink>
              <CopyEmailButton />
            </div>
            <p className="mt-4 text-sm text-fg-2">
              <span className="font-mono">{socials.emailAddress}</span>
            </p>
          </div>

          <ul className="reveal divide-y divide-line border-y border-line">
            {[
              { label: "LinkedIn", href: socials.linkedin, icon: <LinkedinIcon size={16} />, external: true },
              { label: "GitHub", href: socials.github, icon: <GithubIcon size={16} />, external: true },
              { label: "Resume (PDF)", href: socials.resumeFile, icon: <FileText size={16} aria-hidden="true" />, external: true },
              { label: socials.phoneDisplay, href: socials.phoneHref, icon: <Phone size={16} aria-hidden="true" />, external: false },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex min-h-14 items-center justify-between gap-4 py-3 text-fg transition-colors duration-200 hover:text-accent"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-fg-2 transition-colors duration-200 group-hover:text-accent">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {item.external && <span className="sr-only">(opens in a new tab)</span>}
                    {!item.external && <span className="sr-only">(call)</span>}
                  </span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="text-fg-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
