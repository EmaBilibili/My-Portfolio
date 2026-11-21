import { ArrowDown, Command, ExternalLink, FileText, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import DecryptedText from './ui/DecryptedText';
import { siteConfig } from '../data/portfolio';

export default function Hero({ t, onOpenPalette }) {
  return (
    <section id="top" className="relative overflow-hidden border-b border-white/[0.08]">
      <div className="hero-top-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-tech-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              {t.hero.status}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
              <MapPin size={12} className="text-zinc-400" />
              {siteConfig.location}
            </span>
          </div>

          <p className="mb-3 font-mono text-xs font-medium tracking-widest text-emerald-400 uppercase">
            <DecryptedText key={t.hero.kicker} text={t.hero.kicker} />
          </p>

          <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl lg:leading-[1.03]">
            {t.hero.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {t.hero.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-50 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
            >
              <span>{t.hero.primaryCta}</span>
              <ArrowDown size={15} />
            </a>

            <a
              href="#contact"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.12] bg-[#111114] px-5 text-sm font-medium text-zinc-100 transition-colors hover:border-emerald-400/50 hover:text-white"
            >
              <Mail size={15} className="text-emerald-400" />
              <span>{t.hero.secondaryCta}</span>
            </a>

            {siteConfig.resumeUrl && (
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.12] bg-[#111114] px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-white/[0.24]"
              >
                <FileText size={15} />
                <span>{t.hero.resumeCta}</span>
              </a>
            )}

            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden h-11 items-center gap-2 rounded-lg px-3 font-mono text-xs text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 sm:inline-flex"
            >
              <Command size={13} />
              <span>Ctrl+K · {t.paletteShortcutHint}</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
          className="mt-14 grid grid-cols-1 divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] bg-[#111114] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4"
        >
          {t.hero.metrics.map((metric, idx) => (
            <div
              key={metric.label}
              className={`flex flex-col justify-between gap-1.5 p-5 ${
                idx >= 2 ? 'sm:border-t sm:border-white/[0.08] lg:border-t-0' : ''
              }`}
            >
              {metric.href ? (
                <a
                  href={metric.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-display text-lg font-semibold tracking-tight text-zinc-50 transition-colors hover:text-emerald-400 sm:text-xl"
                >
                  <span className="font-mono text-base sm:text-lg">{metric.value}</span>
                  <ExternalLink size={14} className="shrink-0 text-emerald-400" />
                </a>
              ) : (
                <strong className="font-display text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                  {metric.value}
                </strong>
              )}
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                {metric.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
