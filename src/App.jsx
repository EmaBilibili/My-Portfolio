import { useCallback, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import CommandPalette from './components/CommandPalette';
import ContactSection from './components/ContactSection';
import ExperienceAndSecurity from './components/ExperienceAndSecurity';
import FeaturedProjects from './components/FeaturedProjects';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import ProjectArchive from './components/ProjectArchive';
import ProjectDetailModal from './components/ProjectDetailModal';
import TechnicalPillars from './components/TechnicalPillars';
import { copy, experience, projects, siteConfig } from './data/portfolio';

const featuredProjects = projects.filter((project) => project.featured);
const archiveProjects = projects.filter((project) => !project.featured);

export default function App() {
  const [language, setLanguage] = useState('es');
  const [activeProject, setActiveProject] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const copyTimerRef = useRef(null);

  const t = copy[language];
  const experienceItems = experience[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.pageTitle;
  }, [language, t.pageTitle]);

  useEffect(() => () => window.clearTimeout(copyTimerRef.current), []);

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setProjectModalOpen(false);
        setPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopiedEmail(true);
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  }, []);

  const handleNavigate = useCallback((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openProjectModal = useCallback((project) => {
    setActiveProject(project);
    setProjectModalOpen(true);
  }, []);

  const closeProjectModal = useCallback(() => {
    setProjectModalOpen(false);
  }, []);

  const handleSelectProjectFromPalette = useCallback((project) => {
    setPaletteOpen(false);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveProject(project);
    setProjectModalOpen(true);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#09090B] text-zinc-100">
        <Navbar
          language={language}
          onToggleLanguage={toggleLanguage}
          onOpenPalette={() => setPaletteOpen(true)}
          t={t}
        />

        <main>
          <Hero t={t} onOpenPalette={() => setPaletteOpen(true)} />

          <FeaturedProjects
            projects={featuredProjects}
            language={language}
            t={t}
            onSelectProject={openProjectModal}
          />

          <ProjectArchive projects={archiveProjects} language={language} t={t} />

          <TechnicalPillars t={t} />

          <ExperienceAndSecurity experienceItems={experienceItems} t={t} />

          <ContactSection
            t={t}
            copiedEmail={copiedEmail}
            onCopyEmail={handleCopyEmail}
            onOpenPalette={() => setPaletteOpen(true)}
          />
        </main>

        <ProjectDetailModal
          project={activeProject}
          isOpen={projectModalOpen}
          language={language}
          t={t}
          onClose={closeProjectModal}
        />

        <CommandPalette
          isOpen={paletteOpen}
          t={t}
          featuredProjects={featuredProjects}
          onClose={() => setPaletteOpen(false)}
          onNavigate={handleNavigate}
          onSelectProject={handleSelectProjectFromPalette}
          onCopyEmail={handleCopyEmail}
          onToggleLanguage={toggleLanguage}
        />

        <AnimatePresence>
          {copiedEmail && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.16 }}
              role="status"
              aria-live="polite"
              className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-[#111114] px-4 py-2.5 font-mono text-xs text-zinc-100 shadow-lg"
            >
              <Check size={14} className="text-emerald-400" />
              <span>
                {t.contact.copied}: {siteConfig.email}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
