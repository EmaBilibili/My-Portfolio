import { ArrowUpRight, CheckCircle2, ExternalLink, Github, Lock, X } from 'lucide-react';
import { useNativeDialog } from '../hooks/useNativeDialog';

export default function ProjectDetailModal({ project, isOpen, language, t, onClose }) {
  const dialogRef = useNativeDialog({ isOpen });
  const breakdown = project?.breakdown?.[language];

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="project-modal-title"
      onClose={onClose}
      className="mwg-dialog m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111114] p-0 text-zinc-100 shadow-2xl open:flex"
    >
      {project && (
        <>
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] tabular-nums text-emerald-300">
                {project.year}
              </span>
              <span className="font-mono text-xs text-zinc-400">{project.type[language]}</span>
            </div>

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={t.projects.modal.close}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-zinc-900 text-zinc-400 transition-colors hover:border-white/[0.2] hover:text-zinc-100"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto p-5 sm:p-6">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950">
              <img
                src={project.image}
                alt={project.name}
                width={project.imageWidth}
                height={project.imageHeight}
                decoding="async"
                fetchPriority="low"
                className="h-full w-full object-cover"
              />
            </div>

            <h3
              id="project-modal-title"
              className="mt-6 font-display text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl"
            >
              {project.name}
            </h3>

            <p className="mt-2.5 text-sm leading-relaxed text-zinc-300 sm:text-base">
              {project.description[language]}
            </p>

            {breakdown && (
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.08] bg-[#09090B]/70 p-4">
                    <h4 className="font-mono text-[11px] font-medium uppercase tracking-wider text-emerald-400">
                      {t.projects.modal.problem}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      {breakdown.problem}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-[#09090B]/70 p-4">
                    <h4 className="font-mono text-[11px] font-medium uppercase tracking-wider text-emerald-400">
                      {t.projects.modal.architecture}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      {breakdown.architecture}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#09090B]/70 p-4">
                  <h4 className="font-mono text-[11px] font-medium uppercase tracking-wider text-emerald-400">
                    {t.projects.modal.highlights}
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {breakdown.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {t.projects.modal.stack}
              </h4>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {project.tech.map((tag) => (
                  <li
                    key={tag}
                    className="rounded border border-white/[0.08] bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-200"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] bg-[#09090B]/80 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2.5">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-50 px-4 text-xs font-semibold text-zinc-950 transition-colors hover:bg-white"
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
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/[0.12] bg-[#111114] px-3.5 text-xs font-medium text-zinc-200 transition-colors hover:border-emerald-400/50 hover:text-white"
                >
                  <Github size={14} />
                  <span>{t.projects.viewRepo}</span>
                  <ArrowUpRight size={13} />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                  <Lock size={13} />
                  <span>{t.projects.privateRepo}</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="h-9 rounded-md px-3 font-mono text-xs text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-100"
            >
              ESC
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
