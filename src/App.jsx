import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Binary,
  Check,
  ChevronRight,
  CircleDot,
  FileCode2,
  Globe2,
  Mail,
  Menu,
  Radar,
  X,
} from 'lucide-react';

const copy = {
  es: {
    nav: ['Perfil', 'Ruta', 'Base técnica', 'Contacto'],
    navAria: 'Navegación principal',
    homeAria: 'Emanuel Binimelis, inicio',
    menuAria: 'Abrir o cerrar menú',
    principleAria: 'Principios de perfil',
    role: 'SOC / BLUE TEAM — EN FORMACIÓN',
    availability: 'Disponible para oportunidades junior',
    intro: 'Desarrollador con base sólida en C# y software, enfocado actualmente en construir criterio defensivo para operaciones de seguridad.',
    primary: 'Ver ruta activa',
    secondary: 'Contactar',
    dossier: 'RUTA DE FORMACIÓN',
    caseId: 'PREPARACIÓN / 01',
    reviewed: 'ACTUALIZADO / AGO 2026',
    status: 'ESTADO: FORMACIÓN ACTIVA',
    route: [
      ['TryHackMe · SEC1', 'En curso', 'Fundamentos prácticos de seguridad.'],
      ['Hack The Box · SOC Level 1', 'Próximo', 'Siguiente objetivo de especialización.'],
    ],
    note: 'Sin certificaciones obtenidas todavía. Progreso comunicado con precisión.',
    focusTitle: 'El foco es defensa, no apariencia.',
    focus: 'Estoy orientando mi experiencia de desarrollo hacia un primer rol SOC / Blue Team: aprender a investigar, contextualizar y comunicar eventos de seguridad con rigor.',
    principles: [
      ['Aprendizaje verificable', 'La ruta muestra lo que está en curso y lo que sigue, sin promesas infladas.'],
      ['Mentalidad de ingeniería', 'C# y desarrollo de software aportan disciplina de depuración, lógica y sistemas.'],
      ['Preparación para el equipo', 'Busco convertir formación práctica en una contribución útil en un entorno defensivo.'],
    ],
    evidenceTitle: 'Base técnica transferible',
    evidence: 'Antes de enfocar mi camino en seguridad, desarrollé software y experiencias interactivas. Mantengo esta evidencia como prueba de criterio técnico, no como el centro del portfolio.',
    csharp: 'EVIDENCIA C#',
    csharpText: 'Desarrollo en Unity y C#, con sistemas de IA para NPCs, mecánicas de sigilo, herramientas de pipeline y depuración de comportamiento.',
    project: 'Proyecto de tesis · Kenopsia',
    projectText: 'Co-desarrollo de un proyecto de survival horror con IA para NPCs, iluminación y sistemas de tensión ambiental.',
    contactTitle: '¿Hablamos de seguridad?',
    contact: 'Estoy construyendo mi entrada al mundo SOC / Blue Team y abierto a oportunidades junior, mentoría y conversaciones técnicas.',
    email: 'Escribirme por email',
    copied: 'Email copiado',
    copyEmail: 'Copiar email',
    location: 'Mendoza, Argentina',
    footer: 'Portfolio de transición a ciberseguridad',
  },
  en: {
    nav: ['Profile', 'Path', 'Technical base', 'Contact'],
    navAria: 'Main navigation',
    homeAria: 'Emanuel Binimelis, home',
    menuAria: 'Open or close menu',
    principleAria: 'Profile principles',
    role: 'SOC / BLUE TEAM — IN TRAINING',
    availability: 'Open to junior opportunities',
    intro: 'Developer with a strong C# and software foundation, currently building defensive judgment for security operations.',
    primary: 'View active path',
    secondary: 'Contact',
    dossier: 'TRAINING PATH',
    caseId: 'READINESS / 01',
    reviewed: 'UPDATED / AUG 2026',
    status: 'STATUS: ACTIVE TRAINING',
    route: [
      ['TryHackMe · SEC1', 'In progress', 'Hands-on security fundamentals.'],
      ['Hack The Box · SOC Level 1', 'Next', 'Next specialization goal.'],
    ],
    note: 'No certifications earned yet. Progress is described precisely.',
    focusTitle: 'The focus is defense, not appearance.',
    focus: 'I am directing my development background toward a first SOC / Blue Team role: learning to investigate, contextualize, and communicate security events rigorously.',
    principles: [
      ['Verifiable learning', 'The path makes clear what is active and what comes next—without inflated claims.'],
      ['Engineering mindset', 'C# and software development bring debugging discipline, systems thinking, and logic.'],
      ['Team readiness', 'I want to turn practical training into useful contribution in a defensive environment.'],
    ],
    evidenceTitle: 'Transferable technical base',
    evidence: 'Before focusing my path on security, I built software and interactive experiences. This remains as proof of technical judgment, not the portfolio’s central identity.',
    csharp: 'C# EVIDENCE',
    csharpText: 'Unity and C# development, including NPC AI systems, stealth mechanics, pipeline tools, and behavior debugging.',
    project: 'Thesis project · Kenopsia',
    projectText: 'Co-development of a survival-horror project with NPC AI, lighting, and environmental tension systems.',
    contactTitle: 'Talk security?',
    contact: 'I am building my entry into SOC / Blue Team work and am open to junior opportunities, mentorship, and technical conversations.',
    email: 'Email me',
    copied: 'Email copied',
    copyEmail: 'Copy email',
    location: 'Mendoza, Argentina',
    footer: 'Cybersecurity transition portfolio',
  },
};

function App() {
  const [language, setLanguage] = useState('es');
  const [menuOpen, setMenuOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [copied, setCopied] = useState(false);
  const terminalRef = useRef(null);
  const t = copy[language];
  const navTargets = ['profile', 'path', 'evidence', 'contact'];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const handlePointerMove = (event) => {
    const bounds = terminalRef.current?.getBoundingClientRect();
    if (!bounds) return;
    terminalRef.current.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    terminalRef.current.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('bilibilisfactorydev@gmail.com');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = 'mailto:bilibilisfactorydev@gmail.com';
    }
  };

  return (
    <main ref={terminalRef} onPointerMove={handlePointerMove} className={booted ? 'terminal-ready' : ''}>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={t.homeAria}>
          <span>EB</span><i />SECURITY // TERMINAL
        </a>
        <nav id="primary-navigation" className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label={t.navAria}>
          {t.nav.map((item, index) => <a onClick={() => setMenuOpen(false)} href={`#${navTargets[index]}`} key={item}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language-toggle" onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} aria-label="Change language">{language === 'es' ? 'EN' : 'ES'} <Globe2 size={15} /></button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={t.menuAria} aria-expanded={menuOpen} aria-controls="primary-navigation">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy" id="profile">
          <p className="boot-status" aria-live="polite"><span>{booted ? 'READY' : 'INIT'}</span> // SECURITY PORTFOLIO</p>
          <h1>Emanuel<br />Binimelis</h1>
          <p className="role"><Radar size={18} /> {t.role} <span>— {t.availability}</span></p>
          <p className="intro">{t.intro}</p>
          <div className="hero-actions">
            <a className="button primary" href="#path">{t.primary} <ArrowDownRight size={19} /></a>
            <a className="button text-button" href="#contact">{t.secondary} <ChevronRight size={19} /></a>
          </div>
        </div>

        <aside className="route-panel" aria-label={t.dossier}>
          <div className="panel-top"><span>{t.dossier}</span><span className="case-id">{t.caseId}</span></div>
          <div className="status-chip"><span />{t.status}</div>
          <div className="route-list">
            {t.route.map(([name, status, description], index) => (
              <article className="route-item" key={name}>
                <div className={`route-mark ${index === 0 ? 'active' : ''}`}>{index === 0 ? <CircleDot size={18} /> : <span />}</div>
                <div><h2>{name}</h2><p>{description}</p></div>
                <strong>{status}</strong>
              </article>
            ))}
          </div>
          <p className="honesty-note"><Check size={16} /> {t.note}</p>
          <div className="panel-footer"><span>{t.reviewed}</span><span>EB-SOC</span></div>
        </aside>
      </section>

      <section className="statement" id="path">
        <div><h2>{t.focusTitle}</h2><p>{t.focus}</p></div>
      </section>

      <section className="principles" aria-label={t.principleAria}>
        {t.principles.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}
      </section>

      <section className="evidence" id="evidence">
        <div className="evidence-intro"><h2>{t.evidenceTitle}</h2><p>{t.evidence}</p></div>
        <div className="evidence-file">
          <div className="file-head"><FileCode2 size={22} /><span>{t.csharp}</span><Binary size={21} /></div>
          <p>{t.csharpText}</p>
          <div className="file-meta"><span>C#</span><span>UNITY</span><span>DEBUGGING</span></div>
        </div>
        <article className="project-note"><h3>{t.project}</h3><p>{t.projectText}</p><a href="https://github.com/EmaBilibili/TesisKenopsia" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16} /></a></article>
      </section>

      <section className="contact" id="contact">
        <div><h2>{t.contactTitle}</h2></div>
        <div className="contact-copy"><p>{t.contact}</p><div className="contact-actions"><a className="button primary" href="mailto:bilibilisfactorydev@gmail.com">{t.email} <Mail size={18} /></a><button className="button text-button" type="button" onClick={copyEmail}>{copied ? t.copied : t.copyEmail} <ChevronRight size={18} /></button></div></div>
      </section>

      <footer><span>© {new Date().getFullYear()} Emanuel Binimelis</span><span>{t.location}</span><span>{t.footer}</span></footer>
    </main>
  );
}

export default App;
