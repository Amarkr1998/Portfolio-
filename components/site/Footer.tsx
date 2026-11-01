import Link from "next/link";
import { navSections, profile, socials } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { CurrentYear } from "@/components/ui/ContactActions";
import Logo from "@/components/site/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 rounded-md">
            <Logo size={44} />
            <span>
              <span className="block font-display font-semibold text-fg">{profile.name}</span>
              <span className="block text-sm text-fg-2">{profile.title}</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm text-fg-2">
            {profile.focus}. Based in {profile.location}.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="annot mb-3">Sections</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {navSections.map((s) => (
              <li key={s.id}>
                <a href={`/#${s.id}`} className="link-u inline-block py-1 text-fg-2 hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/recruiter" className="link-u inline-block py-1 text-fg-2 hover:text-fg">
                Recruiter view
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="annot mb-3">Elsewhere</p>
          <ul className="space-y-1 text-sm">
            <li>
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-2 py-1 text-fg-2 hover:text-fg">
                <LinkedinIcon size={14} /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-2 py-1 text-fg-2 hover:text-fg">
                <GithubIcon size={14} /> GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={socials.resumeFile} target="_blank" rel="noopener" className="link-u inline-block py-1 text-fg-2 hover:text-fg">
                Resume (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-xs text-fg-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <CurrentYear buildYear={new Date().getFullYear()} /> {profile.name}
        </p>
      </div>
    </footer>
  );
}
