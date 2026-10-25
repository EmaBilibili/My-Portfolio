import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Github,
  Globe2,
  Lock,
  Mail,
  Menu,
  Play,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
import {
  certificateUrl,
  experienceData,
  githubProfileUrl,
  portfolioCopy,
  projectsData,
} from './features/terminal/content';
import DefenseRadarScene from './components/DefenseRadarScene';

function App() {
  const [language, setLanguage] = useState('es');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [command, setCommand] = useState('');
  const [lines, setLines] = useState(portfolioCopy.es.terminalIntro);
  const [activeSection, setActiveSection] = useState('');
  const [radarPulse, setRadarPulse] = useState(0);
  const [copied, setCopied] = useState(false);
  const clearPulseRef = useRef(null);
  const logContainerRef = useRef(null);

  const t = portfolioCopy[language];
  const experiences = experienceData[language];

  const filteredProjects =
    activeFilter === 'all'
      ? projectsData
      : projectsData.filter((project) => project.domain === activeFilter);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => () => window.clearTimeout(clearPulseRef.current), []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [lines]);

  const emitCyberPulse = (color = 0x10b981) => {
    window.dispatchEvent(new CustomEvent('cyber-pulse', { detail: { color } }));
  };

  const focusSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.clearTimeout(clearPulseRef.current);
    clearPulseRef.current = window.setTimeout(() => setActiveSection(''), 1800);
  };

  const copyEmailAddress = async () => {
    emitCyberPulse(0x34d399);
    try {
      await navigator.clipboard.writeText('bilibilisfactorydev@gmail.com');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = 'mailto:bilibilisfactorydev@gmail.com';
    }
  };

  const executeCommand = (rawCommand) => {
    const input = rawCommand.trim().toLowerCase();
    const commands = {
      help: {
        output: [
          'Comandos disponibles / Available commands:',
          '  whoami             -> Resumen de perfil / Profile summary',
          '  ls projects        -> Listar 11 proyectos reales / List 11 shipped projects',
          '  stack              -> Matriz tecnológica / Technical stack matrix',
          '  nmap portfolio     -> Escanear áreas técnicas / Scan technical domains',
          '  cat training.log   -> Ruta SOC & Certificado TryHackMe',
          '  cat experience.log -> Experiencia laboral y título universitario',
          '  contact            -> Datos de contacto directo / Direct contact',
          '  clear              -> Limpiar terminal / Clear output',
        ],
      },
      whoami: {
        output: [
          language === 'es'
            ? 'Emanuel Binimelis (Mendoza, AR) — Software & Systems Developer (Rust, C#, TS, Linux) en transición a SOC / Blue Team.'
            : 'Emanuel Binimelis (Mendoza, AR) — Software & Systems Developer (Rust, C#, TS, Linux) transitioning to SOC / Blue Team.',
          language === 'es'
            ? 'Graduado Técnico en Desarrollo de Videojuegos (Univ. de Mendoza, 2025) · +11 proyectos desplegados.'
            : 'Video Game Development Graduate (Univ. de Mendoza, 2025) · 11+ shipped projects.',
        ],
        target: 'profile',
      },
      'ls projects': {
        output: [
          ...projectsData.map(
            (p) => `[${p.year}] ${p.name.padEnd(28, ' ')} :: ${p.tech.slice(0, 3).join(', ')}`
          ),
        ],
        target: 'projects',
      },
      stack: {
        output: [
          '[SECURITY & OS]  Linux (Arch/Omarchy), TryHackMe SEC1, TCP/IP, Log Triage, Bash',
          '[SYSTEMS/NATIVE] Rust, Tauri v2, C# / .NET, Unity 3D/2D, FFmpeg Pipelines',
          '[FULL-STACK WEB] TypeScript, React 19, Next.js, Svelte 5, Supabase (PostgreSQL)',
        ],
        target: 'facets',
      },
      'nmap portfolio': {
        output: [
          'PORT     STATE  SERVICE             EVIDENCE',
          '22/tcp   OPEN   linux-systems-rust  SnapStream, QuickCompress, Omarchy Terra',
          '80/tcp   OPEN   fullstack-web-saas  Mi-Rancho PWA, Vestta, CoachOS, EasyVet',
          '443/tcp  OPEN   defensive-sec-soc   TryHackMe SEC1 (THM-KRRNP9WDN7), HTB SOC L1',
          '8080/tcp OPEN   csharp-ai-engines   Kenopsia Thesis, Skuishy Souls (1st Place)',
        ],
        target: 'facets',
      },
      'cat training.log': {
        output: [
          `[ACTIVE]   ${t.route[0][0]} — ${t.route[0][1]}`,
          `[NEXT]     ${t.route[1][0]} — ${t.route[1][1]}`,
          `[VERIFIED] TryHackMe Certificate ID: THM-KRRNP9WDN7 (${certificateUrl})`,
        ],
        target: 'training',
      },
      'cat experience.log': {
        output: experiences.map((exp) => `${exp.period} | ${exp.role} @ ${exp.org}`),
        target: 'training',
      },
      contact: {
        output: [
          'Email  :: bilibilisfactorydev@gmail.com',
          'GitHub :: https://github.com/EmaBilibili',
          'Loc    :: Mendoza, Argentina',
        ],
        target: 'contact',
      },
    };

    if (!input) return;
    if (input === 'clear') {
      setLines([]);
      setCommand('');
      setRadarPulse((prev) => prev + 1);
      return;
    }

    const result = commands[input] || {
      output: [
        language === 'es'
          ? `Comando no reconocido: "${input}". Escribe "help" para ver la lista de comandos.`
          : `Unrecognized command: "${input}". Type "help" for available commands.`,
      ],
    };

    setLines((current) => [...current, `$ ${rawCommand.trim()}`, ...result.output].slice(-18));
    setCommand('');
    setRadarPulse((prev) => prev + 1);
    if (result.target) focusSection(result.target);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    executeCommand(command);
  };

  const switchLanguage = () => {
    const nextLanguage = language === 'es' ? 'en' : 'es';
    setLanguage(nextLanguage);
    setLines(portfolioCopy[nextLanguage].terminalIntro);
    emitCyberPulse(0x34d399);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    emitCyberPulse(0x10b981);
  };

  const navTargets = ['profile', 'terminal', 'projects', 'facets', 'training', 'contact'];

  return (
    <main className="portfolio-shell">
      {/* FULL-SCREEN INTERACTIVE THREE.JS CYBER NETWORK & TERMINAL TOPOLOGY */}
      <DefenseRadarScene pulseTrigger={radarPulse} />

      <div className="portfolio-content-layer">
        <header className="site-nav">
          <a className="identity" href="#profile" aria-label={t.homeAria}>
            <b>EB</b>
            <span>EMANUEL_BINIMELIS // SYS_PORTFOLIO</span>
          </a>
          <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label={t.navAria}>
            {navTargets.map((id, index) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {t.nav[index]}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <a
              className="nav-icon-link"
              href={githubProfileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub EmaBilibili"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <button onClick={switchLanguage} aria-label="Change language">
              {language === 'es' ? 'EN' : 'ES'} <Globe2 size={15} />
            </button>
            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t.menuAria}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section
          className={`hero-section ${activeSection === 'profile' ? 'section-pulse' : ''}`}
          id="profile"
        >
          <div className="hero-top-row">
            <div className="availability">
              <i />
              {t.status}
            </div>
            <span className="hero-badge">{t.heroBadge}</span>
          </div>

          <div className="hero-main-grid">
            <div className="hero-title-block">
              <p className="hero-prompt">root@emanuel-soc:~# ./init_profile.sh --verbose</p>
              <h1>
                <span>Emanuel</span>
                <span>Binimelis</span>
              </h1>
              <p className="hero-lead">{t.heroLine}</p>
              <p className="hero-sublead">{t.intro}</p>
              <div className="hero-cta-group">
                <a className="btn-primary-cyber" href="#projects" onClick={() => emitCyberPulse()}>
                  {t.primaryCta} <ArrowDown size={17} />
                </a>
                <a
                  className="btn-secondary-cyber"
                  href="#terminal"
                  onClick={() => emitCyberPulse()}
                >
                  <Terminal size={16} /> {t.secondaryCta}
                </a>
                <a
                  className="btn-secondary-cyber"
                  href={githubProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={16} /> GitHub
                </a>
              </div>
            </div>

            <aside className="hero-dossier-card">
              <div className="dossier-header">
                <span>
                  <Activity size={14} /> SYS_DOSSIER // LIVE_TELEMETRY
                </span>
                <span className="dossier-online">ONLINE</span>
              </div>
              <div className="dossier-body">
                <div className="dossier-row">
                  <span>ROLE_TARGET</span>
                  <strong>SOC / Blue Team & Systems Dev</strong>
                </div>
                <div className="dossier-row">
                  <span>PRIMARY_OS</span>
                  <strong>Arch / Omarchy Linux</strong>
                </div>
                <div className="dossier-row">
                  <span>CORE_LANGS</span>
                  <strong>Rust · C# · TypeScript · Bash</strong>
                </div>
                <div className="dossier-row">
                  <span>ACTIVE_LABS</span>
                  <strong>TryHackMe SEC1 → HTB SOC L1</strong>
                </div>
                <div className="dossier-row">
                  <span>VERIFIED_CERT</span>
                  <a href={certificateUrl} target="_blank" rel="noreferrer">
                    THM-KRRNP9WDN7 <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
              <div className="dossier-footer">
                <button
                  type="button"
                  className="dossier-ping-btn"
                  onClick={() => executeCommand('nmap portfolio')}
                >
                  $ nmap portfolio --scan-nodes
                </button>
              </div>
            </aside>
          </div>

          <div className="hero-metrics-bar">
            {t.metrics.map((metric) => (
              <div className="metric-card" key={metric.value}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE TERMINAL SECTION */}
        <section className="terminal-section" id="terminal">
          <div className="terminal-caption">
            <span>{t.terminalLabel}</span>
            <span>LOCAL SHELL // INTERACTIVE</span>
          </div>
          <div className="terminal-window">
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span />
                <span />
                <span />
              </div>
              <span>emanuel@soc-workstation:~/portfolio</span>
              <span>BASH / SAFE</span>
            </div>
            <div className="terminal-log" ref={logContainerRef} aria-live="polite">
              {lines.map((line, index) => (
                <div
                  className={line.startsWith('$') ? 'command-line' : ''}
                  key={`${line}-${index}`}
                >
                  {line}
                </div>
              ))}
            </div>
            <form className="terminal-input" onSubmit={handleSubmit}>
              <span>$</span>
              <input
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                placeholder={t.placeholder}
                aria-label="Terminal command"
                autoComplete="off"
              />
              <button type="submit">
                {t.run} <Play size={14} />
              </button>
            </form>
          </div>
          <div className="quick-commands">
            {[
              'help',
              'ls projects',
              'stack',
              'nmap portfolio',
              'cat training.log',
              'cat experience.log',
              'whoami',
              'clear',
            ].map((item) => (
              <button key={item} onClick={() => executeCommand(item)}>
                $ {item}
              </button>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION (11 CURATED GITHUB PROJECTS) */}
        <section
          className={`projects-section ${activeSection === 'projects' ? 'section-pulse' : ''}`}
          id="projects"
        >
          <header className="projects-header">
            <div>
              <p className="section-kicker">{t.projectsKicker}</p>
              <h2>{t.projectsTitle}</h2>
            </div>
            <p className="projects-intro">{t.projectsSubtitle}</p>
          </header>

          <div className="project-filters" role="tablist" aria-label="Project categories">
            {t.filters.map((filter) => (
              <button
                key={filter.id}
                role="tab"
                aria-selected={activeFilter === filter.id}
                className={activeFilter === filter.id ? 'filter-btn active' : 'filter-btn'}
                onClick={() => handleFilterChange(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="project-gallery">
            {filteredProjects.map((project, index) => (
              <article
                className={`project-card ${
                  project.featured && activeFilter === 'all' ? 'featured-card' : ''
                }`}
                key={project.id}
                onMouseEnter={() => emitCyberPulse(0x10b981)}
              >
                <div className="project-image-wrap">
                  <img
                    src={project.image}
                    alt={project.name}
                    loading={index > 2 ? 'lazy' : 'eager'}
                  />
                  <span className="project-year-badge">{project.year}</span>
                </div>

                <div className="project-body">
                  <div className="project-meta">
                    <span>{project.type[language]}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p className="project-desc">{project.description[language]}</p>

                  <ul className="project-tech-list">
                    {project.tech.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>

                  <div className="project-links">
                    {project.demoUrl && (
                      <a
                        className="project-link primary-link"
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.demoLabel ? project.demoLabel[language] : t.viewDemo}{' '}
                        <ExternalLink size={15} />
                      </a>
                    )}
                    {project.repoUrl ? (
                      <a
                        className="project-link secondary-link"
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Github size={15} /> {t.viewRepo} <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <span className="project-private-tag">
                        <Lock size={13} /> {t.privateRepoNote}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* TECHNICAL PILLARS / ARCHITECTURE SECTION */}
        <section
          className={`facets-section ${activeSection === 'facets' ? 'section-pulse' : ''}`}
          id="facets"
        >
          <header className="facets-header">
            <div>
              <p className="section-kicker">{t.facetsKicker}</p>
              <h2>{t.facetsTitle}</h2>
            </div>
            <p className="facets-subtitle">{t.facetsSubtitle}</p>
          </header>

          <div className="facet-grid-three">
            {t.pillars.map((pillar, idx) => (
              <article
                key={pillar.tag}
                className={idx === 0 ? 'facet-card facet-highlight' : 'facet-card'}
                onMouseEnter={() => emitCyberPulse(0x10b981)}
              >
                <span className="facet-tag">{pillar.tag}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
                <ul>
                  {pillar.items.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* TIMELINE, EXPERIENCE & SECURITY CREDENTIALS SECTION */}
        <section
          className={`training-section ${activeSection === 'training' ? 'section-pulse' : ''}`}
          id="training"
        >
          <div className="training-left">
            <p className="section-kicker">{t.trainingKicker}</p>
            <h2>{t.trainingTitle}</h2>
            <p className="training-lead">{t.trainingText}</p>

            <div className="credential-box">
              <div className="credential-header">
                <ShieldCheck size={22} />
                <div>
                  <strong>{t.credentialTitle}</strong>
                  <span>{t.credentialId}</span>
                </div>
              </div>
              <div className="route-cards">
                {t.route.map(([title, status, detail]) => (
                  <div className="route-row" key={title}>
                    <div>
                      <strong>{title}</strong>
                      <p>{detail}</p>
                    </div>
                    <span className="route-badge">{status}</span>
                  </div>
                ))}
              </div>
              <a
                className="credential-cta"
                href={certificateUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t.viewCredential} <ArrowUpRight size={17} />
              </a>
            </div>
          </div>

          <div className="training-right">
            <div className="timeline-list">
              {experiences.map((item) => (
                <article className="timeline-item" key={`${item.period}-${item.role}`}>
                  <div className="timeline-top">
                    <span className="timeline-period">{item.period}</span>
                    <span className="timeline-tag">{item.tag}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <strong className="timeline-org">{item.org}</strong>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section
          className={`contact-section ${activeSection === 'contact' ? 'section-pulse' : ''}`}
          id="contact"
        >
          <p className="section-kicker">{t.contactKicker}</p>
          <h2>{t.contactTitle}</h2>
          <span className="contact-subtext">{t.contactText}</span>
          <div className="contact-actions">
            <a className="contact-btn primary" href="mailto:bilibilisfactorydev@gmail.com">
              <Mail size={18} /> {t.email}
            </a>
            <button className="contact-btn" type="button" onClick={copyEmailAddress}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? t.copied : t.copyEmail}
            </button>
            <a
              className="contact-btn"
              href={githubProfileUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={18} /> GitHub (@EmaBilibili)
            </a>
            <a
              className="contact-btn"
              href={certificateUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ShieldCheck size={18} /> TryHackMe Certificate
            </a>
          </div>
        </section>

        <footer>
          <span>© {new Date().getFullYear()} Emanuel Binimelis</span>
          <span>{t.location}</span>
          <span>{t.footer}</span>
        </footer>
      </div>
    </main>
  );
}

export default App;
