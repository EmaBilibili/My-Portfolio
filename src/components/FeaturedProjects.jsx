import { ArrowUpRight, ExternalLink, Github, Layers, Lock } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';

export default function FeaturedProjects({ projects, language, t, onSelectProject }) {
  return (
    <section id="projects" className="border-b border-white/[0.08] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 font-mono text-xs font-medium tracking-widest text-emerald-400 uppercase">
              {t.projects.kicker}
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              {t.projects.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">{t.projects.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <SpotlightCard as="article" key={project.id} className="group flex flex-col">
              <div className="flex h-full flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/[0.08] bg-zinc-950">
                  <img
                    src={project.image}
                    alt={project.name}
                    width={project.imageWidth}
                    height={project.imageHeight}
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : undefined}
                    loading={index >= 2 ? 'lazy' : undefined}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                    <span className="rounded border border-white/[0.12] bg-[#09090B]/85 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-200 backdrop-blur-sm">
                      {project.type[language]}
                    </span>
                    <span className="rounded border border-white/[0.12] bg-[#09090B]/85 px-2 py-0.5 font-mono text-[11px] tabular-nums text-emerald-400 backdrop-blur-sm">
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-50">
                    {project.name}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-zinc-400">
                    {project.description[language]}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {project.tech.map((tag) => (
                      <li
                        key={tag}
                        className="rounded border border-white/[0.08] bg-zinc-900/80 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-4">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-100 px-3.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-white"
                    >
                      <Layers size={13} />
                      <span>{t.projects.viewBreakdown}</span>
                    </button>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/[0.12] bg-zinc-900 px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-emerald-400/50 hover:text-white"
                      >
                        <span>{project.demoLabel ? project.demoLabel[language] : t.projects.viewDemo}</span>
                        <ExternalLink size={13} />
                      </a>
                    )}

                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/[0.08] px-3 text-xs font-medium text-zinc-400 transition-colors hover:border-white/[0.2] hover:text-zinc-100"
                      >
                        <Github size={13} />
                        <span>{t.projects.viewRepo}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 font-mono text-[11px] text-zinc-400">
                        <Lock size={12} />
                        <span>{t.projects.privateRepo}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
