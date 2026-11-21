import { useState } from 'react';
import { ArrowUpRight, ChevronRight, ExternalLink, Github, Lock } from 'lucide-react';

export default function ProjectArchive({ projects, language, t }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const domains = ['systems', 'web', 'csharp'];
  const counts = {
    all: projects.length,
    systems: projects.filter((p) => p.domain === 'systems').length,
    web: projects.filter((p) => p.domain === 'web').length,
    csharp: projects.filter((p) => p.domain === 'csharp').length,
  };

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.domain === activeFilter);

  return (
    <section id="archive" className="border-b border-white/[0.08] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-zinc-50">
              {t.projects.archiveTitle}
            </h3>
            <p className="mt-1.5 text-sm text-zinc-400">{t.projects.archiveSubtitle}</p>
          </div>

          <div
            role="tablist"
            aria-label="Filter archive projects"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                activeFilter === 'all'
                  ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                  : 'border-white/[0.08] bg-[#111114] text-zinc-400 hover:border-white/[0.18] hover:text-zinc-200'
              }`}
            >
              {t.projects.filterAll} ({counts.all})
            </button>

            {domains.map((domain) => (
              <button
                key={domain}
                type="button"
                role="tab"
                aria-selected={activeFilter === domain}
                onClick={() => setActiveFilter(domain)}
                className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                  activeFilter === domain
                    ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                    : 'border-white/[0.08] bg-[#111114] text-zinc-400 hover:border-white/[0.18] hover:text-zinc-200'
                }`}
              >
                {t.projects.filterLabels[domain]} ({counts[domain]})
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/[0.08] overflow-hidden rounded-xl border border-white/[0.08] bg-[#111114]">
          {filtered.map((project) => {
            const accessLabel = project.demoUrl
              ? 'Live'
              : project.repoUrl
                ? 'OSS'
                : t.projects.privateRepo;

            return (
              <details key={project.id} className="mwg-details group">
                <summary className="mwg-summary flex cursor-pointer items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-white/[0.02] sm:px-6">
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    <ChevronRight
                      size={15}
                      aria-hidden="true"
                      className="shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-90 group-open:text-emerald-400"
                    />

                    <span className="w-11 shrink-0 font-mono text-xs tabular-nums text-zinc-400">
                      {project.year}
                    </span>

                    <img
                      src={project.image}
                      alt=""
                      width={project.imageWidth}
                      height={project.imageHeight}
                      loading="lazy"
                      decoding="async"
                      className="hidden h-9 w-14 shrink-0 rounded border border-white/[0.08] object-cover sm:block"
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-display text-sm font-semibold text-zinc-100 sm:text-base">
                          {project.name}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-400">
                          · {project.type[language]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden items-center gap-1.5 lg:flex">
                    {project.tech.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/[0.06] bg-zinc-900/90 px-2 py-0.5 font-mono text-[10px] text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="shrink-0 rounded border border-white/[0.08] bg-zinc-900/80 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                    {accessLabel}
                  </span>
                </summary>

                <div className="border-t border-white/[0.06] bg-[#09090B]/60">
                  <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-12 sm:p-6">
                    <div className="sm:col-span-4">
                      <div className="aspect-[16/10] overflow-hidden rounded-lg border border-white/[0.08] bg-zinc-950">
                        <img
                          src={project.image}
                          alt={project.name}
                          width={project.imageWidth}
                          height={project.imageHeight}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 sm:col-span-8">
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed text-zinc-300">
                          {project.description[language]}
                        </p>
                        <ul className="flex flex-wrap gap-1.5">
                          {project.tech.map((tag) => (
                            <li
                              key={tag}
                              className="rounded border border-white/[0.08] bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-100 px-3.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-white"
                          >
                            <span>
                              {project.demoLabel ? project.demoLabel[language] : t.projects.viewDemo}
                            </span>
                            <ExternalLink size={13} />
                          </a>
                        )}

                        {project.repoUrl ? (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/[0.12] bg-zinc-900 px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-emerald-400/50 hover:text-white"
                          >
                            <Github size={13} />
                            <span>{t.projects.viewRepo}</span>
                            <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 font-mono text-xs text-zinc-400">
                            <Lock size={12} />
                            <span>{t.projects.privateRepo}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
