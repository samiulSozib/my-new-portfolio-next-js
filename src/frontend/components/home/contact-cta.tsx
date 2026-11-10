import { NeuralCanvas } from "@frontend/components/ai/neural-canvas";
import { SocialLinks } from "@frontend/components/layout/social-links";
import { CvButton } from "@frontend/components/ui/cv-button";
import { MailIcon } from "@frontend/components/ui/icons";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import type { Lang } from "@frontend/lib/i18n/config";
import type { Site } from "@frontend/lib/site";
import type { Cv } from "@frontend/lib/types";

// The closing call to action: download the CV or send an email.
export function ContactCta({ lang, site, cv }: { lang: Lang; site: Site; cv: Cv | null }) {
  const t = getDictionary(lang).home;

  return (
    <section className="reveal relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0b24] px-6 py-14 text-white sm:px-14 sm:py-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="aurora absolute -inset-20 opacity-80" />
        <NeuralCanvas className="absolute inset-0 opacity-60" />
      </div>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">{t.ctaEyebrow}</p>
      <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">{t.ctaTitle}</h2>
      <p className="mt-4 max-w-xl leading-7 text-slate-300">{t.ctaBody}</p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <CvButton cv={cv} lang={lang} variant="inverse" />
        {site.email && (
          <a
            href={`mailto:${site.email}`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <MailIcon size={16} />
            {t.email}
          </a>
        )}
        <SocialLinks site={site} className="ms-1 [&_a]:border-white/25 [&_a]:text-slate-300 [&_a:hover]:text-white" />
      </div>
    </section>
  );
}
