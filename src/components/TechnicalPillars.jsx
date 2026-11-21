import SpotlightCard from './ui/SpotlightCard';

export default function TechnicalPillars({ t }) {
  return (
    <section id="architecture" className="border-b border-white/[0.08] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 font-mono text-xs font-medium tracking-widest text-emerald-400 uppercase">
              {t.pillars.kicker}
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              {t.pillars.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">{t.pillars.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {t.pillars.items.map((pillar, index) => (
            <SpotlightCard as="article" key={pillar.tag} className="p-6 sm:p-7">
              <div className="flex h-full flex-col">
                <span
                  className={`font-mono text-[11px] font-medium uppercase tracking-wider ${
                    index === 2 ? 'text-emerald-400' : 'text-zinc-400'
                  }`}
                >
                  {pillar.tag}
                </span>

                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-zinc-50">
                  {pillar.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{pillar.desc}</p>

                <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-white/[0.08] pt-5">
                  {pillar.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded border border-white/[0.08] bg-zinc-900/90 px-2.5 py-1 font-mono text-[11px] text-zinc-300"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
