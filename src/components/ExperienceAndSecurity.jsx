import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../data/portfolio';

export default function ExperienceAndSecurity({ experienceItems, t }) {
  return (
    <section id="trajectory" className="border-b border-white/[0.08] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="mb-12 max-w-2xl">
          <p className="mb-2 font-mono text-xs font-medium tracking-widest text-emerald-400 uppercase">
            {t.trajectory.kicker}
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            {t.trajectory.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.trajectory.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-xl border border-white/[0.08] bg-[#111114] p-6">
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                      {t.trajectory.credentialBadge}
                    </span>
                    <strong className="font-display text-base font-semibold text-zinc-50">
                      {t.trajectory.credentialTitle}
                    </strong>
                  </div>
                </div>

                <span className="rounded border border-white/[0.08] bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
                  {siteConfig.certificateId}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {t.trajectory.credentialDetail}
              </p>

              <a
                href={siteConfig.certificateUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-zinc-100 px-4 text-xs font-semibold text-zinc-950 transition-colors hover:bg-white"
              >
                <span>{t.trajectory.verifyCredential}</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#111114] p-6">
              <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-400">
                {t.trajectory.roadmapTitle}
              </h3>

              <div className="mt-4 space-y-3">
                {t.trajectory.roadmap.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-lg border border-white/[0.06] bg-[#09090B]/70 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-sm font-medium text-zinc-100">{step.title}</strong>
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                          step.active
                            ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                            : 'border border-white/[0.08] bg-zinc-900 text-zinc-400'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative space-y-6 border-l border-white/[0.1] pl-6 sm:pl-8">
              {experienceItems.map((item) => (
                <article
                  key={`${item.period}-${item.role}`}
                  className="relative rounded-xl border border-white/[0.08] bg-[#111114] p-5 sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[29px] top-6 h-2.5 w-2.5 rounded-full ring-4 ring-[#09090B] sm:-left-[37px] ${
                      item.active ? 'bg-emerald-400' : 'bg-zinc-600'
                    }`}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium tabular-nums text-emerald-400">
                      {item.period}
                    </span>
                    <span className="rounded border border-white/[0.08] bg-zinc-900 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-display text-lg font-semibold text-zinc-50">
                    {item.role}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-zinc-400">{item.org}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
