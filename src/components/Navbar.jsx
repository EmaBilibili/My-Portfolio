import { useState } from 'react';
import { Github, Globe, Linkedin, Menu, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { siteConfig } from '../data/portfolio';

export default function Navbar({ language, onToggleLanguage, onOpenPalette, t }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#09090B]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#top"
          aria-label={t.homeAria}
          className="group flex items-center gap-3 text-sm font-medium text-zinc-100"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.12] bg-zinc-900 font-mono text-xs font-semibold tracking-tight text-zinc-100 transition-colors group-hover:border-emerald-400/50">
            {siteConfig.initials}
            <span
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#09090B]"
              aria-hidden="true"
            />
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">
            {siteConfig.name}
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label={t.navAria}>
          {t.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-xs font-medium tracking-wide text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label={t.paletteShortcutHint}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-white/[0.08] bg-[#111114] px-2.5 text-xs text-zinc-400 transition-colors hover:border-white/[0.18] hover:text-zinc-100 sm:px-3"
          >
            <Search size={14} className="text-zinc-400" />
            <span className="hidden sm:inline">{t.searchTrigger}</span>
            <kbd className="hidden rounded border border-white/[0.1] bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 lg:inline-block">
              Ctrl K
            </kbd>
          </button>

          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub @EmaBilibili"
            title="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] bg-[#111114] text-zinc-400 transition-colors hover:border-white/[0.18] hover:text-zinc-100"
          >
            <Github size={15} />
          </a>

          <a
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Emanuel Binimelis"
            title="LinkedIn"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] bg-[#111114] text-zinc-400 transition-colors hover:border-white/[0.18] hover:text-zinc-100"
          >
            <Linkedin size={15} />
          </a>

          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label={language === 'es' ? 'Switch language to English' : 'Cambiar idioma a Español'}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#111114] px-2.5 font-mono text-[11px] font-medium text-zinc-300 transition-colors hover:border-emerald-400/50 hover:text-zinc-100"
          >
            <Globe size={13} className="text-emerald-400" />
            <span>{language === 'es' ? 'EN' : 'ES'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={t.menuAria}
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] bg-[#111114] text-zinc-300 transition-colors hover:border-white/[0.18] md:hidden"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            aria-label={t.navAria}
            className="overflow-hidden border-t border-white/[0.08] bg-[#09090B]/95 px-5 py-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {t.nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-emerald-400"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
