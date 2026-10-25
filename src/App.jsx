import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Github, Globe2, Mail, Menu, Play, X } from 'lucide-react';
import { portfolioCopy } from './features/terminal/content';
import DefenseRadarScene from './components/DefenseRadarScene';

const certificateUrl = 'https://tryhackme.com/certificate/THM-KRRNP9WDN7';

const interfaceCopy = {
  es: {
    nav: ['Perfil', 'Terminal', 'Evidencia', 'Contacto'],
    status: 'Disponible para oportunidades junior',
    heroLine: 'Software developer → SOC / Blue Team',
    heroAction: 'Explorar la terminal',
    terminalLabel: 'Terminal interactiva · simulación local',
    terminalIntro: ['EmanuelOS / portfolio interface', 'Escribe help o usa un comando rápido.'],
    placeholder: 'escribe un comando…',
    run: 'Ejecutar',
    facetsTitle: 'Dos facetas. Un mismo criterio técnico.',
    security: 'Seguridad defensiva',
    software: 'Desarrollo de software',
    training: 'Formación activa',
    next: 'Siguiente objetivo',
    verified: 'Verificación externa',
    archive: 'Archivo de desarrollo',
    archiveText: 'Una selección visual de proyectos construidos antes y durante mi transición hacia ciberseguridad.',
    contactTitle: 'Construyamos una conversación útil.',
    contactText: 'Estoy abierto a oportunidades junior, mentoría y conversaciones técnicas sobre seguridad defensiva y desarrollo.',
  },
  en: {
    nav: ['Profile', 'Terminal', 'Evidence', 'Contact'],
    status: 'Open to junior opportunities',
    heroLine: 'Software developer → SOC / Blue Team',
    heroAction: 'Explore the terminal',
    terminalLabel: 'Interactive terminal · local simulation',
    terminalIntro: ['EmanuelOS / portfolio interface', 'Type help or use a quick command.'],
    placeholder: 'type a command…',
    run: 'Run',
    facetsTitle: 'Two disciplines. One technical mindset.',
    security: 'Defensive security',
    software: 'Software development',
    training: 'Active training',
    next: 'Next objective',
    verified: 'External verification',
    archive: 'Development archive',
    archiveText: 'A visual selection of work built before and during my transition into cybersecurity.',
    contactTitle: 'Let’s start a useful conversation.',
    contactText: 'I am open to junior opportunities, mentorship, and technical conversations about defensive security and development.',
  },
};

const projects = [
  { name: 'Kenopsia', image: '/assets/kenopsia.webp', type: 'C# / Unity', href: 'https://github.com/EmaBilibili/TesisKenopsia' },
  { name: 'CoachOS', image: '/assets/projects/coachos.webp', type: 'Software' },
  { name: 'Computoya', image: '/assets/projects/computoya.webp', type: 'Web' },
  { name: 'EasyVet', image: '/assets/projects/easyvet.webp', type: 'Product' },
  { name: 'Skuishi Souls', image: '/assets/projects/skuishi_souls.webp', type: 'Game' },
];

function App() {
  const [language, setLanguage] = useState('es');
  const [menuOpen, setMenuOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [lines, setLines] = useState(interfaceCopy.es.terminalIntro);
  const [activeSection, setActiveSection] = useState('');
  const [radarPulse, setRadarPulse] = useState(0);
  const clearPulseRef = useRef(null);
  const t = portfolioCopy[language];
  const ui = interfaceCopy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => () => window.clearTimeout(clearPulseRef.current), []);

  const focusSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.clearTimeout(clearPulseRef.current);
    clearPulseRef.current = window.setTimeout(() => setActiveSection(''), 1800);
  };

  const executeCommand = (rawCommand) => {
    const input = rawCommand.trim().toLowerCase();
    const commands = {
      help: { output: ['whoami · nmap portfolio · cat training.log · ls projects · open certificate · contact · clear'] },
      whoami: { output: [language === 'es' ? 'Emanuel Binimelis — desarrollador orientándose a SOC / Blue Team.' : 'Emanuel Binimelis — developer moving toward SOC / Blue Team.'], target: 'profile' },
      'nmap portfolio': { output: ['PORT 80/tcp   OPEN  software', 'PORT 443/tcp  OPEN  defensive-security', 'Result: local visual simulation — no network request executed.'], target: 'facets' },
      'cat training.log': { output: [`TryHackMe SEC1 — ${t.route[0][1]}`, `Hack The Box SOC Level 1 — ${t.route[1][1]}`], target: 'training' },
      'ls projects': { output: projects.map((project) => `./${project.name.toLowerCase().replaceAll(' ', '-')}`), target: 'projects' },
      'open certificate': { output: [`TryHackMe / THM-KRRNP9WDN7`, language === 'es' ? 'Enlace verificable disponible en la sección de formación.' : 'Verifiable link available in the training section.'], target: 'training' },
      contact: { output: ['bilibilisfactorydev@gmail.com'], target: 'contact' },
    };

    if (!input) return;
    if (input === 'clear') {
      setLines([]);
      setCommand('');
      return;
    }

    const result = commands[input] || { output: [language === 'es' ? `Comando desconocido: ${input}. Escribe help.` : `Unknown command: ${input}. Type help.`] };
    setLines((current) => [...current, `$ ${rawCommand.trim()}`, ...result.output].slice(-14));
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
    setLines(interfaceCopy[nextLanguage].terminalIntro);
  };

  return (
    <main className="portfolio-shell">
      <header className="site-nav">
        <a className="identity" href="#profile" aria-label={t.homeAria}><b>EB</b><span>Emanuel Binimelis</span></a>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label={t.navAria}>
          {['profile', 'terminal', 'facets', 'contact'].map((id, index) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{ui.nav[index]}</a>)}
        </nav>
        <div className="nav-actions"><button onClick={switchLanguage} aria-label="Change language">{language === 'es' ? 'EN' : 'ES'} <Globe2 size={15} /></button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t.menuAria} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button></div>
      </header>

      <section className={`hero-section ${activeSection === 'profile' ? 'section-pulse' : ''}`} id="profile">
        <div className="availability"><i />{ui.status}</div>
        <div className="defense-radar-container">
          <DefenseRadarScene pulseTrigger={radarPulse} />
        </div>
        <h1><span>Emanuel</span><span>Binimelis</span></h1>
        <div className="hero-bottom"><p>{ui.heroLine}</p><p>{t.intro}</p><a href="#terminal">{ui.heroAction}<ArrowDown size={18} /></a></div>
      </section>

      <section className="terminal-section" id="terminal">
        <div className="terminal-caption"><span>{ui.terminalLabel}</span><span>NO EXTERNAL COMMANDS</span></div>
        <div className="terminal-window">
          <div className="terminal-bar"><span>emanuel@portfolio:~</span><span>LOCAL / SAFE</span></div>
          <div className="terminal-log" aria-live="polite">{lines.map((line, index) => <div className={line.startsWith('$') ? 'command-line' : ''} key={`${line}-${index}`}>{line}</div>)}</div>
          <form className="terminal-input" onSubmit={handleSubmit}><span>$</span><input value={command} onChange={(event) => setCommand(event.target.value)} placeholder={ui.placeholder} aria-label="Terminal command" autoComplete="off" /><button type="submit">{ui.run}<Play size={14} /></button></form>
        </div>
        <div className="quick-commands">{['whoami', 'nmap portfolio', 'cat training.log', 'ls projects'].map((item) => <button key={item} onClick={() => executeCommand(item)}>{item}</button>)}</div>
      </section>

      <section className={`facets-section ${activeSection === 'facets' ? 'section-pulse' : ''}`} id="facets">
        <header><p>SECURITY × SOFTWARE</p><h2>{ui.facetsTitle}</h2></header>
        <div className="facet-grid">
          <article><span>DEFENSIVE</span><h3>{ui.security}</h3><p>{t.focus}</p><ul><li>TryHackMe SEC1</li><li>SOC / Blue Team</li><li>{t.principles[0][0]}</li></ul></article>
          <article className="facet-inverse"><span>BUILD</span><h3>{ui.software}</h3><p>{t.csharpText}</p><ul><li>C#</li><li>Unity</li><li>Debugging</li></ul></article>
        </div>
      </section>

      <section className={`training-section ${activeSection === 'training' ? 'section-pulse' : ''}`} id="training">
        <div className="training-copy"><p>TRAINING / CREDENTIAL</p><h2>{t.credentialTitle}</h2><p>{t.credentialText}</p><a href={certificateUrl} target="_blank" rel="noreferrer">{t.viewCredential}<ArrowUpRight size={17} /></a></div>
        <div className="training-list"><article><span>{ui.training}</span><strong>TryHackMe · SEC1</strong><small>{t.route[0][1]}</small></article><article><span>{ui.next}</span><strong>Hack The Box · SOC Level 1</strong><small>{t.route[1][1]}</small></article><article><span>{ui.verified}</span><strong>THM-KRRNP9WDN7</strong><small>TryHackMe</small></article></div>
      </section>

      <section className={`projects-section ${activeSection === 'projects' ? 'section-pulse' : ''}`} id="projects">
        <header><p>SELECTED WORK</p><h2>{ui.archive}</h2><span>{ui.archiveText}</span></header>
        <div className="project-gallery">{projects.map((project, index) => {
          const content = <><img src={project.image} alt={`Vista de ${project.name}`} loading={index > 1 ? 'lazy' : 'eager'} /><div><span>{project.type}</span><h3>{project.name}</h3>{project.href && <ArrowUpRight size={19} />}</div></>;
          return project.href ? <a className="project-tile" href={project.href} target="_blank" rel="noreferrer" key={project.name}>{content}</a> : <article className="project-tile" key={project.name}>{content}</article>;
        })}</div>
      </section>

      <section className={`contact-section ${activeSection === 'contact' ? 'section-pulse' : ''}`} id="contact"><p>CONTACT</p><h2>{ui.contactTitle}</h2><span>{ui.contactText}</span><div><a href="mailto:bilibilisfactorydev@gmail.com"><Mail size={18} />{t.email}</a><a href="https://github.com/EmaBilibili" target="_blank" rel="noreferrer"><Github size={18} />GitHub</a></div></section>
      <footer><span>© {new Date().getFullYear()} Emanuel Binimelis</span><span>{t.location}</span><span>SECURITY × SOFTWARE</span></footer>
    </main>
  );
}

export default App;
