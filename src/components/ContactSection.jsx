import { Check, Command, Copy, FileText, Github, Linkedin, Mail, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../data/portfolio';

export default function ContactSection({ t, copiedEmail, onCopyEmail, onOpenPalette }) {
  return (
    <>
      <section id="contact" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-7 sm:p-12">
            <div className="max-w-2xl">
              <p className="mb-2 font-mono text-xs font-medium tracking-widest text-emerald-400 uppercase">
                {t.contact.kicker}
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
                {t.contact.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                {t.contact.subtitle}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-50 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
              >
                <Mail size={16} />
                <span>{t.contact.sendEmail}</span>
              </a>

              <button
                type="button"
                onClick={onCopyEmail}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.12] bg-zinc-900 px-4 text-sm font-medium text-zinc-100 transition-colors hover:border-emerald-400/50"
              >
                {copiedEmail ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} className="text-zinc-400" />
                )}
                <span>{copiedEmail ? t.contact.copied : t.contact.copyEmail}</span>
              </button>

              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#09090B]/70 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-white/[0.2] hover:text-white"
              >
                <Linkedin size={16} className="text-zinc-400" />
                <span>LinkedIn</span>
              </a>

              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#09090B]/70 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-white/[0.2] hover:text-white"
              >
                <Github size={16} className="text-zinc-400" />
                <span>GitHub ({siteConfig.githubHandle})</span>
              </a>

              <a
                href={siteConfig.certificateUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#09090B]/70 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-emerald-400/40 hover:text-white"
              >
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>TryHackMe</span>
              </a>

              {siteConfig.resumeUrl && (
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#09090B]/70 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-white/[0.2] hover:text-white"
                >
                  <FileText size={16} className="text-zinc-400" />
                  <span>{t.contact.resume}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] bg-[#09090B] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 font-mono text-xs text-zinc-400 sm:flex-row sm:items-center sm:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-zinc-300">
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
            <span>{siteConfig.location}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span>{t.footer.role}</span>
            <button
              type="button"
              onClick={onOpenPalette}
              className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] bg-[#111114] px-2 py-1 text-[11px] text-zinc-300 transition-colors hover:border-emerald-400/40 hover:text-white"
            >
              <Command size={11} />
              <span>Ctrl+K · {t.footer.shortcut}</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
