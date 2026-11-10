import { GithubIcon, LinkedinIcon, MailIcon, XIcon } from "@frontend/components/ui/icons";
import type { Site } from "@frontend/lib/site";

// Round icon links for the profiles that are filled in. Renders nothing when none are.
export function SocialLinks({ site, className = "", withEmail = false }: { site: Site; className?: string; withEmail?: boolean }) {
  const links = [
    { label: "GitHub", href: site.social.github, Icon: GithubIcon },
    { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedinIcon },
    { label: "X", href: site.social.x, Icon: XIcon },
    ...(withEmail && site.email ? [{ label: "Email", href: `mailto:${site.email}`, Icon: MailIcon }] : []),
  ].filter((link) => link.href);

  if (links.length === 0) return null;

  return (
    <ul className={`flex gap-2 ${className}`}>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            title={label}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer me"}
            className="flex size-9 items-center justify-center rounded-full border border-border-strong text-muted transition-colors hover:border-accent hover:text-accent-text"
          >
            <Icon size={16} />
          </a>
        </li>
      ))}
    </ul>
  );
}
