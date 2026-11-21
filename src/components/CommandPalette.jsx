import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Copy,
  CornerDownLeft,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Layers,
  Linkedin,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { siteConfig } from '../data/portfolio';
import { useNativeDialog } from '../hooks/useNativeDialog';

export default function CommandPalette({
  isOpen,
  t,
  featuredProjects,
  onClose,
  onNavigate,
  onSelectProject,
  onCopyEmail,
  onToggleLanguage,
}) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const dialogRef = useNativeDialog({
    isOpen,
    onAfterOpen: () => inputRef.current?.focus(),
  });

  const handleDialogClose = () => {
    setQuery('');
    setActiveIndex(0);
    onClose();
  };

  const allItems = useMemo(() => {
    const navItems = t.nav.map((nav) => ({
      id: `nav-${nav.id}`,
      group: t.palette.groups.navigation,
      label: nav.label,
      hint: `#${nav.id}`,
      icon: ArrowRight,
      run: () => onNavigate(nav.id),
    }));

    const projectItems = featuredProjects.map((project) => ({
      id: `project-${project.id}`,
      group: t.palette.groups.projects,
      label: project.name,
      hint: project.tech.slice(0, 2).join(' · '),
      icon: Layers,
      run: () => onSelectProject(project),
    }));

    const actionItems = [
      {
        id: 'action-copy-email',
        group: t.palette.groups.actions,
        label: t.palette.actions.copyEmail,
        hint: siteConfig.email,
        icon: Copy,
        run: onCopyEmail,
      },
      {
        id: 'action-toggle-lang',
        group: t.palette.groups.actions,
        label: t.palette.actions.toggleLang,
        hint: 'ES / EN',
        icon: Globe,
        run: onToggleLanguage,
      },
    ];

    if (siteConfig.resumeUrl) {
      actionItems.push({
        id: 'action-resume',
        group: t.palette.groups.actions,
        label: t.palette.actions.openResume,
        hint: 'PDF',
        icon: FileText,
        run: () => window.open(siteConfig.resumeUrl, '_blank', 'noreferrer'),
      });
    }

    const linkItems = [
      {
        id: 'link-github',
        group: t.palette.groups.links,
        label: t.palette.actions.openGithub,
        hint: 'github.com',
        icon: Github,
        run: () => window.open(siteConfig.githubUrl, '_blank', 'noreferrer'),
      },
      {
        id: 'link-linkedin',
        group: t.palette.groups.links,
        label: t.palette.actions.openLinkedin,
        hint: 'linkedin.com',
        icon: Linkedin,
        run: () => window.open(siteConfig.linkedinUrl, '_blank', 'noreferrer'),
      },
      {
        id: 'link-thm',
        group: t.palette.groups.links,
        label: t.palette.actions.verifyThm,
        hint: siteConfig.certificateId,
        icon: ShieldCheck,
        run: () => window.open(siteConfig.certificateUrl, '_blank', 'noreferrer'),
      },
    ];

    return [...navItems, ...projectItems, ...actionItems, ...linkItems];
  }, [featuredProjects, onCopyEmail, onNavigate, onSelectProject, onToggleLanguage, t]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  const safeIndex = Math.min(activeIndex, Math.max(filteredItems.length - 1, 0));

  const executeItem = (item) => {
    if (!item) return;
    onClose();
    window.setTimeout(() => item.run(), 20);
  };

  const handleKeyDown = (event) => {
    if (!filteredItems.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      executeItem(filteredItems[safeIndex]);
    }
  };

  const grouped = filteredItems.reduce((acc, item, flatIndex) => {
    const existing = acc.find((g) => g.group === item.group);
    const entry = { ...item, flatIndex };
    if (existing) {
      existing.items.push(entry);
    } else {
      acc.push({ group: item.group, items: [entry] });
    }
    return acc;
  }, []);

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-label="Command Palette"
      onClose={handleDialogClose}
      onKeyDown={handleKeyDown}
      className="mwg-dialog mx-auto mt-[12vh] mb-auto w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-white/[0.14] bg-[#111114] p-0 text-zinc-100 shadow-2xl open:block"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5">
        <Search size={16} className="shrink-0 text-emerald-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          placeholder={t.palette.placeholder}
          className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
        />
        <form method="dialog">
          <button
            type="submit"
            aria-label={t.palette.hintClose}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/[0.08] text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <X size={14} />
          </button>
        </form>
      </div>

      <div className="max-h-[55vh] overflow-y-auto p-2">
        {filteredItems.length === 0 ? (
          <p className="px-4 py-8 text-center font-mono text-xs text-zinc-400">
            {t.palette.empty}
          </p>
        ) : (
          grouped.map((section) => (
            <div key={section.group} className="mb-2 last:mb-0">
              <div className="px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {section.group}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.flatIndex === safeIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(item.flatIndex)}
                    onClick={() => executeItem(item)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-emerald-500/12 text-zinc-50'
                        : 'text-zinc-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        size={15}
                        className={isActive ? 'text-emerald-400' : 'text-zinc-400'}
                      />
                      <span>{item.label}</span>
                    </span>

                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                      <span>{item.hint}</span>
                      {item.group === t.palette.groups.links && <ExternalLink size={11} />}
                    </span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#09090B]/70 px-4 py-2.5 font-mono text-[10px] text-zinc-400">
        <div className="flex items-center gap-4">
          <span>↑↓ {t.palette.hintNavigate}</span>
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft size={10} /> {t.palette.hintSelect}
          </span>
        </div>
        <span>ESC {t.palette.hintClose}</span>
      </div>
    </dialog>
  );
}
