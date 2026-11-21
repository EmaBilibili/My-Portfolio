export const siteConfig = {
  name: 'Emanuel Binimelis',
  initials: 'EB',
  email: 'bilibilisfactorydev@gmail.com',
  location: 'Mendoza, Argentina',
  githubUrl: 'https://github.com/EmaBilibili',
  githubHandle: '@EmaBilibili',
  linkedinUrl: 'https://www.linkedin.com/in/emanuelbinimelis',
  certificateUrl: 'https://tryhackme.com/certificate/THM-KRRNP9WDN7',
  certificateId: 'THM-KRRNP9WDN7',
  resumeUrl: '',
};

export const projects = [
  {
    id: 'snapstream',
    name: 'SnapStream',
    year: '2026',
    domain: 'systems',
    featured: true,
    type: {
      es: 'Desktop App · Rust & Tauri v2',
      en: 'Desktop App · Rust & Tauri v2',
    },
    description: {
      es: 'Aplicación nativa de escritorio ultraligera (~38 MB RAM) para extraer video 4K y audio sin pérdida (FLAC/MP3), con servidor de streaming LAN integrado y actualizaciones automáticas para Linux y Windows.',
      en: 'Ultra-lightweight native desktop application (~38 MB RAM) for 4K video and lossless audio extraction, featuring a built-in LAN streaming server and auto-updates for Linux and Windows.',
    },
    breakdown: {
      es: {
        problem:
          'Las herramientas web o basadas en Electron consumen demasiada memoria para descargar medios o compartir archivos en red local, exponiendo al usuario a sitios con publicidad o límites de formato.',
        architecture:
          'Backend nativo en Rust sobre Tauri v2 que orquesta procesos de yt-dlp y sirve streams directamente en la red local (LAN), desacoplado de una interfaz reactiva ligera en Svelte 5 y Tailwind CSS.',
        highlights: [
          'Huella de memoria en reposo cercana a ~38 MB de RAM frente a wrappers Electron.',
          'Extracción en video 4K y audio sin pérdida (FLAC / MP3) con gestión de procesos hijos.',
          'Servidor de streaming LAN integrado y pipeline de releases/auto-updates para Linux y Windows.',
        ],
      },
      en: {
        problem:
          'Web downloaders and Electron wrappers consume excessive RAM for local media extraction and LAN sharing, often forcing users through ad-heavy sites or format restrictions.',
        architecture:
          'Native Rust backend powered by Tauri v2 orchestrating yt-dlp child processes and a built-in LAN streaming server, paired with a minimal Svelte 5 + Tailwind CSS interface.',
        highlights: [
          'Low ~38 MB idle RAM footprint compared to standard Electron-based desktop apps.',
          '4K video and lossless audio (FLAC / MP3) extraction with controlled child-process execution.',
          'Built-in LAN streaming server and automated release updates for Linux and Windows.',
        ],
      },
    },
    tech: ['Rust', 'Tauri v2', 'Svelte 5', 'Tailwind CSS', 'yt-dlp'],
    image: '/assets/projects/snapstream.webp',
    imageWidth: 1280,
    imageHeight: 800,
    repoUrl: 'https://github.com/EmaBilibili/snapstream',
    demoUrl: 'https://github.com/EmaBilibili/snapstream/releases',
    demoLabel: { es: 'Releases', en: 'Releases' },
  },
  {
    id: 'quick-compress',
    name: 'QuickCompress',
    year: '2026',
    domain: 'systems',
    featured: true,
    type: {
      es: 'Utilidad Nativa · Rust & FFmpeg',
      en: 'Native Utility · Rust & FFmpeg',
    },
    description: {
      es: 'Herramienta nativa de escritorio de alto rendimiento para Linux y Windows que comprime, recorta y convierte video, audio e imágenes al instante mediante pipelines de FFmpeg sin usar la consola.',
      en: 'High-performance native desktop utility for Linux and Windows that compresses, trims, and converts video, audio, and images instantly via FFmpeg pipelines without touching the CLI.',
    },
    breakdown: {
      es: {
        problem:
          'Comprimir o recortar medios con FFmpeg exige recordar flags complejos de códecs, bitrates y filtros, mientras que los servicios en línea imponen subidas lentas y límites de privacidad.',
        architecture:
          'Interfaz nativa compilada en Rust que construye y ejecuta pipelines parametrizados de FFmpeg de forma local, empaquetada mediante CI/CD en binarios listos para Linux y Windows.',
        highlights: [
          'Procesamiento 100% local de video, audio e imágenes sin subir archivos a terceros.',
          'Construcción determinista de pipelines FFmpeg para compresión, recorte y transcodificación.',
          'Distribución continua con binarios multiplataforma generados por CI/CD.',
        ],
      },
      en: {
        problem:
          'Media compression and trimming with raw FFmpeg requires memorizing codec and filter flags, while online converters introduce upload latency and file privacy concerns.',
        architecture:
          'Native Rust GUI translating visual presets into parameterized local FFmpeg pipelines, built and distributed via CI/CD release workflows for Linux and Windows.',
        highlights: [
          '100% local execution for video, audio, and image processing without cloud uploads.',
          'Deterministic FFmpeg pipeline builder for rapid compression, trimming, and format conversion.',
          'Automated CI/CD binary builds targeting Linux and Windows.',
        ],
      },
    },
    tech: ['Rust', 'Native GUI', 'FFmpeg', 'Linux / Windows', 'CI/CD Binaries'],
    image: '/assets/projects/quickcompress.webp',
    imageWidth: 1280,
    imageHeight: 800,
    repoUrl: 'https://github.com/EmaBilibili/quick-compress',
    demoUrl: 'https://github.com/EmaBilibili/quick-compress/releases/latest',
    demoLabel: { es: 'Descargar Binario', en: 'Download Binary' },
  },
  {
    id: 'mi-rancho',
    name: 'Mi-Rancho PWA',
    year: '2026',
    domain: 'web',
    featured: true,
    type: {
      es: 'SaaS / PWA · React & Supabase',
      en: 'SaaS / PWA · React & Supabase',
    },
    description: {
      es: 'Aplicación web progresiva offline-first para administración de reservas exclusivas, cálculo automático de señas del 50%, control financiero en tiempo real y emisión de boletos digitales en PNG.',
      en: 'Offline-first progressive web app for exclusive booking management, automatic 50% deposit calculation, real-time revenue tracking, and PNG digital pass generation.',
    },
    breakdown: {
      es: {
        problem:
          'La gestión manual de reservas y señas generaba errores de cobro, pérdida de trazabilidad financiera y demoras en entornos con conectividad móvil inestable.',
        architecture:
          'PWA en TypeScript y React respaldada por Supabase (PostgreSQL), diseñada con estrategia offline-first, cálculo automático de señas del 50% y renderizado local de pases digitales en PNG.',
        highlights: [
          'Operación offline-first para registrar y consultar reservas en campo sin perder estado.',
          'Cálculo automático de señas (50%) y balance financiero consolidado en tiempo real.',
          'Generación instantánea de comprobantes y boletos digitales descargables en formato PNG.',
        ],
      },
      en: {
        problem:
          'Manual reservation and deposit tracking led to accounting discrepancies and operational friction when managing bookings in low-connectivity environments.',
        architecture:
          'TypeScript and React progressive web app backed by Supabase (PostgreSQL), featuring offline-first resilience, automated 50% deposit logic, and client-side PNG pass generation.',
        highlights: [
          'Offline-first PWA architecture preserving booking workflows under unstable connectivity.',
          'Automated 50% deposit calculation paired with real-time financial tracking.',
          'Instant generation of downloadable PNG digital passes for guests.',
        ],
      },
    },
    tech: ['TypeScript', 'React', 'Supabase', 'PostgreSQL', 'PWA Offline-First'],
    image: '/assets/projects/mirancho.webp',
    imageWidth: 1280,
    imageHeight: 800,
    demoUrl: 'https://mi-rancho-eight.vercel.app',
    repoUrl: '',
  },
  {
    id: 'kenopsia',
    name: 'Kenopsia (Tesis)',
    year: '2024–2025',
    domain: 'csharp',
    featured: true,
    type: {
      es: 'Ingeniería C# / Unity · IA & Sistemas',
      en: 'C# / Unity Engineering · AI & Systems',
    },
    description: {
      es: 'Proyecto de tesis universitaria. Desarrollo en C# de sistemas de IA para NPCs basados en máquinas de estados, detección sensorial, mecánicas de sigilo y herramientas de depuración.',
      en: 'University thesis project. C# development of state-machine NPC AI systems, sensory detection, stealth mechanics, and behavior debugging tools.',
    },
    breakdown: {
      es: {
        problem:
          'Diseñar enemigos reactivos y predecibles para un entorno de sigilo requiere desacoplar la percepción sensorial, las transiciones de estado y la inspección visual en tiempo real.',
        architecture:
          'Arquitectura modular en C# sobre Unity 3D basada en Máquinas de Estados Finitos (FSM), sensores de visión/audición desacoplados y herramientas de debugging de estado en editor.',
        highlights: [
          'Máquinas de estados finitos en C# con transiciones limpias entre patrulla, alerta y persecución.',
          'Sistema de detección sensorial y sigilo calibrado para pruebas iterativas.',
          'Herramientas propias de depuración visual para auditar el comportamiento de los NPCs.',
        ],
      },
      en: {
        problem:
          'Building believable stealth AI requires cleanly decoupling sensory perception, state transitions, and real-time runtime inspection for tuning and debugging.',
        architecture:
          'Modular C# architecture in Unity 3D built around Finite State Machines (FSM), decoupled vision/audio sensors, and in-editor behavior debugging utilities.',
        highlights: [
          'Finite State Machine architecture in C# governing patrol, alert, and pursuit states.',
          'Configurable sensory detection and stealth mechanics built for deterministic tuning.',
          'Custom visual debugging tools to inspect AI state transitions during development.',
        ],
      },
    },
    tech: ['C#', 'Unity 3D', 'NPC AI / FSM', 'ShaderLab', 'Debugging'],
    image: '/assets/kenopsia.webp',
    imageWidth: 1024,
    imageHeight: 576,
    repoUrl: 'https://github.com/EmaBilibili/TesisKenopsia',
    demoUrl: 'https://emabilibili.itch.io/kenopsia',
    demoLabel: { es: 'Itch.io', en: 'Itch.io' },
  },
  {
    id: 'omarchy-terra',
    name: 'Omarchy Terra Islands',
    year: '2026',
    domain: 'systems',
    featured: false,
    type: {
      es: 'Entorno Linux · Waybar & Shell',
      en: 'Linux Environment · Waybar & Shell',
    },
    description: {
      es: 'Tema de escritorio open-source y configuración automatizada en Shell para Omarchy Linux (Hyprland / Waybar / Walker) con arquitectura visual de islas flotantes.',
      en: 'Open-source desktop theme and automated Shell configuration for Omarchy Linux (Hyprland / Waybar / Walker) featuring a floating-islands visual architecture.',
    },
    tech: ['Linux', 'Shell / Bash', 'Waybar', 'Walker', 'CSS3'],
    image: '/assets/projects/omarchy.webp',
    imageWidth: 1280,
    imageHeight: 800,
    repoUrl: 'https://github.com/EmaBilibili/omarchy-terra-islands',
    demoUrl: '',
  },
  {
    id: 'coachos',
    name: 'CoachOS',
    year: '2026',
    domain: 'web',
    featured: false,
    type: {
      es: 'Plataforma SaaS · Next.js & TS',
      en: 'SaaS Platform · Next.js & TS',
    },
    description: {
      es: 'Plataforma SaaS integral para entrenadores personales: planificación de rutinas, seguimiento de progreso de atletas, control de rachas y métricas de rendimiento.',
      en: 'All-in-one SaaS platform for personal trainers: workout planning, athlete progress tracking, streak monitoring, and performance analytics.',
    },
    tech: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS', 'Auth'],
    image: '/assets/projects/coachos.webp',
    imageWidth: 1024,
    imageHeight: 629,
    demoUrl: 'https://coach-os-five.vercel.app',
    repoUrl: '',
  },
  {
    id: 'computoya',
    name: 'CómputoYa',
    year: '2026',
    domain: 'web',
    featured: false,
    type: {
      es: 'Herramienta Financiera · Next.js',
      en: 'Financial SaaS · Next.js',
    },
    description: {
      es: 'Sistema de presupuestos y cómputo de materiales en tiempo real para profesionales de la construcción y oficios, con ajuste dinámico por índice de inflación.',
      en: 'Real-time budgeting and material estimation system for construction and trade professionals, featuring dynamic inflation-index adjustments.',
    },
    tech: ['TypeScript', 'Next.js', 'React', 'Finance Logic', 'SaaS'],
    image: '/assets/projects/computoya.webp',
    imageWidth: 1017,
    imageHeight: 632,
    demoUrl: 'https://computoya.pages.dev',
    repoUrl: '',
  },
  {
    id: 'easyvet',
    name: 'EasyVet',
    year: '2026',
    domain: 'web',
    featured: false,
    type: {
      es: 'Sistema Clínico · React & Appwrite',
      en: 'Clinical System · React & Appwrite',
    },
    description: {
      es: 'Sistema de gestión clínica veterinaria para administración centralizada de historias médicas, pacientes, vacunación y agenda de turnos.',
      en: 'Veterinary clinical management system for centralized administration of medical records, patients, vaccinations, and appointment scheduling.',
    },
    tech: ['React', 'Appwrite', 'Cloud DB', 'System Design'],
    image: '/assets/projects/easyvet.webp',
    imageWidth: 1024,
    imageHeight: 628,
    demoUrl: 'https://easy-vet.vercel.app',
    repoUrl: '',
  },
  {
    id: 'parrilla',
    name: 'Parrilla Las Hermanas',
    year: '2026',
    domain: 'web',
    featured: false,
    type: {
      es: 'Web App Gastronómica · TS & React',
      en: 'Gastronomic Web App · TS & React',
    },
    description: {
      es: 'Carta digital interactiva y experiencia web mobile-first enfocada en velocidad de carga, filtrado instantáneo de platos y conversión directa.',
      en: 'Interactive digital menu and mobile-first web experience focused on instant load times, dish filtering, and direct conversion.',
    },
    tech: ['TypeScript', 'React', 'Vite', 'Tailwind CSS'],
    image: '/assets/projects/parrilla.webp',
    imageWidth: 1024,
    imageHeight: 634,
    demoUrl: 'https://parrilla-las-hermanas.vercel.app',
    repoUrl: '',
  },
  {
    id: 'skuishy-souls',
    name: 'Skuishy Souls',
    year: '2024',
    domain: 'csharp',
    featured: false,
    type: {
      es: '1º Puesto GameJam · C# & Unity',
      en: '1st Place GameJam · C# & Unity',
    },
    description: {
      es: 'Ganador del 1er Puesto ("Mejor Juego") en VideoGamesClub Mendoza GameJam. Implementación rápida de físicas de combate, arquitectura de eventos y pulido bajo presión.',
      en: '1st Place Winner ("Best Game") at VideoGamesClub Mendoza GameJam. Rapid implementation of combat physics, event architecture, and polish under tight deadlines.',
    },
    tech: ['C#', 'Unity 2D', 'Game Jam Winner', 'Event Architecture'],
    image: '/assets/projects/skuishi_souls.webp',
    imageWidth: 1024,
    imageHeight: 543,
    demoUrl: 'https://jcanovas97.itch.io/skuishy',
    demoLabel: { es: 'Jugar en Itch.io', en: 'Play on Itch.io' },
    repoUrl: '',
  },
];

export const experience = {
  es: [
    {
      period: '2025 — PRESENTE',
      role: 'Formación Especializada SOC / Blue Team',
      org: 'TryHackMe · Hack The Box · Linux Home Lab',
      tag: 'CIBERSEGURIDAD',
      active: true,
      desc: 'Construcción de criterio defensivo práctico: análisis de eventos, fundamentos de SOC, redes TCP/IP, administración diaria de entornos Linux (Arch/Omarchy) y resolución de laboratorios técnicos verificables.',
    },
    {
      period: 'AGO 2023 — PRESENTE',
      role: 'Software Developer',
      org: 'Full Salud — RSTArgentina',
      tag: 'INGENIERÍA DE SOFTWARE',
      active: true,
      desc: 'Desarrollo de software para el sector médico, construcción de interfaces web internas con React y gestión técnica de inventario e infraestructura tecnológica.',
    },
    {
      period: '2022 — PRESENTE',
      role: 'Full-Stack & Systems Developer',
      org: 'Proyectos Independientes / BilibilisFactory',
      tag: 'RUST · TS · C#',
      active: true,
      desc: 'Diseño y despliegue de aplicaciones en producción: utilidades de escritorio nativas en Rust y Tauri (SnapStream, QuickCompress), PWAs offline-first con Supabase y plataformas SaaS.',
    },
    {
      period: '2023 — 2025',
      role: 'Técnico en Desarrollo de Videojuegos (Tesis Kenopsia)',
      org: 'Universidad de Mendoza',
      tag: 'EDUCACIÓN UNIVERSITARIA',
      active: false,
      desc: 'Graduado en Febrero 2025. Especialización en programación con C#, arquitectura de sistemas interactivos, máquinas de estados de IA, estructuras de datos y liderazgo técnico de equipos.',
    },
  ],
  en: [
    {
      period: '2025 — PRESENT',
      role: 'Specialized SOC / Blue Team Training',
      org: 'TryHackMe · Hack The Box · Linux Home Lab',
      tag: 'CYBERSECURITY',
      active: true,
      desc: 'Building practical defensive judgment: event analysis, SOC fundamentals, TCP/IP networking, daily Linux environment administration (Arch/Omarchy), and verifiable hands-on labs.',
    },
    {
      period: 'AUG 2023 — PRESENT',
      role: 'Software Developer',
      org: 'Full Salud — RSTArgentina',
      tag: 'SOFTWARE ENGINEERING',
      active: true,
      desc: 'Developing healthcare software, building internal React web interfaces, and managing technical inventory and IT infrastructure.',
    },
    {
      period: '2022 — PRESENT',
      role: 'Full-Stack & Systems Developer',
      org: 'Independent Projects / BilibilisFactory',
      tag: 'RUST · TS · C#',
      active: true,
      desc: 'Designing and shipping production software: native desktop utilities in Rust and Tauri (SnapStream, QuickCompress), offline-first PWAs with Supabase, and SaaS platforms.',
    },
    {
      period: '2023 — 2025',
      role: 'Video Game Development Degree (Kenopsia Thesis)',
      org: 'Universidad de Mendoza',
      tag: 'UNIVERSITY EDUCATION',
      active: false,
      desc: 'Graduated Feb 2025. Focused on C# software engineering, interactive systems architecture, AI state machines, data structures, and technical team leadership.',
    },
  ],
};

export const copy = {
  es: {
    pageTitle: 'Emanuel Binimelis | Software & Systems Engineer · SOC / Blue Team',
    nav: [
      { id: 'projects', label: 'Proyectos' },
      { id: 'architecture', label: 'Arquitectura' },
      { id: 'trajectory', label: 'Trayectoria' },
      { id: 'contact', label: 'Contacto' },
    ],
    navAria: 'Navegación principal',
    homeAria: 'Emanuel Binimelis, volver al inicio',
    menuAria: 'Abrir o cerrar menú',
    searchTrigger: 'Buscar...',
    paletteShortcutHint: 'Comandos rápidos',
    hero: {
      status: 'Disponible · Junior Software / Systems & SOC Blue Team',
      kicker: 'SOFTWARE & SYSTEMS ENGINEER // SOC & BLUE TEAM PATH',
      headline: 'Emanuel Binimelis',
      subheadline:
        'Construyo software nativo de bajo consumo (Rust, C#) y plataformas web full-stack en producción, mientras consolido mi transición práctica hacia seguridad defensiva y operaciones SOC sobre Linux.',
      primaryCta: 'Ver proyectos',
      secondaryCta: 'Contactar',
      resumeCta: 'Ver CV',
      metrics: [
        {
          value: String(projects.length),
          label: 'Proyectos desplegados & OSS',
        },
        {
          value: 'Rust · TS · C#',
          label: 'Stack principal sobre Linux',
        },
        {
          value: siteConfig.certificateId,
          label: 'Certificado completación TryHackMe',
          href: siteConfig.certificateUrl,
        },
        {
          value: '2025',
          label: 'Graduado Univ. de Mendoza',
        },
      ],
    },
    projects: {
      kicker: 'PROYECTOS INSIGNIA',
      title: 'Sistemas y aplicaciones en producción.',
      subtitle:
        'Cuatro proyectos centrales con desglose de arquitectura y decisiones técnicas, seguidos por el archivo completo filtrable.',
      viewBreakdown: 'Detalle técnico',
      viewRepo: 'GitHub',
      viewDemo: 'Live Demo',
      privateRepo: 'Repo privado',
      archiveTitle: 'Archivo de ingeniería',
      archiveSubtitle: 'Otros proyectos reales construidos entre sistemas Linux, web SaaS y C#.',
      filterAll: 'Todos',
      filterLabels: {
        systems: 'Sistemas & Linux',
        web: 'Full-Stack & SaaS',
        csharp: 'C# & IA',
      },
      modal: {
        close: 'Cerrar detalle',
        problem: 'Contexto & Problema',
        architecture: 'Arquitectura & Implementación',
        highlights: 'Puntos Clave',
        stack: 'Stack utilizado',
      },
    },
    pillars: {
      kicker: 'ARQUITECTURA TÉCNICA',
      title: 'Tres dominios que se potencian entre sí.',
      subtitle:
        'Entender cómo se compilan, despliegan y depuran los sistemas desde dentro aporta criterio directo tanto para construir software robusto como para analizar alertas de seguridad.',
      items: [
        {
          tag: '01 // SYSTEMS & NATIVE',
          title: 'Rust, C# & Software Nativo',
          desc: 'Desarrollo de binarios multiplataforma de bajo consumo de memoria, pipelines sobre procesos de sistema (FFmpeg, yt-dlp), máquinas de estados y depuración profunda.',
          skills: [
            'Rust',
            'Tauri v2',
            'C# / .NET',
            'Unity Engine',
            'FFmpeg Pipelines',
            'CI/CD Releases',
          ],
        },
        {
          tag: '02 // FULL-STACK WEB & CLOUD',
          title: 'Aplicaciones Web & PWAs',
          desc: 'Diseño e implementación de plataformas SaaS y PWAs offline-first con bases de datos relacionales, autenticación y despliegues continuos.',
          skills: [
            'TypeScript',
            'React 19 / Next.js',
            'Svelte 5',
            'Supabase (PostgreSQL)',
            'Appwrite',
            'Tailwind CSS',
          ],
        },
        {
          tag: '03 // DEFENSIVE SECURITY & LINUX',
          title: 'SOC / Blue Team & Entornos Linux',
          desc: 'Formación práctica enfocada en análisis de logs, redes TCP/IP, triaje defensivo y operación diaria sobre Linux (Arch / Omarchy y automatización Bash).',
          skills: [
            'TryHackMe SEC1 (En curso)',
            'HTB SOC L1 (Próximo)',
            'Linux Arch / Omarchy',
            'Bash Scripting',
            'TCP/IP & Log Triage',
            'SIEM Fundamentals',
          ],
        },
      ],
    },
    trajectory: {
      kicker: 'TRAYECTORIA & EVIDENCIA VERIFICABLE',
      title: 'Experiencia real y ruta transparente en seguridad.',
      subtitle:
        'Distingo con claridad mi experiencia laboral en desarrollo y mi certificado de completación en TryHackMe de futuras certificaciones oficiales por examen.',
      credentialBadge: 'Certificado de completación · Verificable',
      credentialTitle: 'TryHackMe · Security Path',
      credentialDetail:
        'Evidencia práctica verificable de laboratorios en fundamentos de seguridad defensiva, redes y análisis (no equivale a una certificación profesional de examen).',
      verifyCredential: 'Verificar en TryHackMe',
      roadmapTitle: 'Hoja de ruta operativa',
      roadmap: [
        {
          title: 'TryHackMe · SEC1 Path',
          status: 'En curso',
          active: true,
          detail: 'Certificado inicial de completación obtenido; práctica continua en red y análisis.',
        },
        {
          title: 'Linux Home Lab (Arch / Omarchy)',
          status: 'Activo',
          active: true,
          detail: 'Entorno diario de escritorio, scripting Bash y configuración de servicios.',
        },
        {
          title: 'Hack The Box · SOC Analyst Level 1',
          status: 'Próximo',
          active: false,
          detail: 'Siguiente paso enfocado en triaje de alertas, SIEM y respuesta a incidentes.',
        },
      ],
    },
    contact: {
      kicker: 'CONTACTO DIRECTO',
      title: 'Hablemos de ingeniería o seguridad.',
      subtitle:
        'Disponible para roles Junior en Software / Systems Engineering o posiciones iniciales en SOC / Blue Team (remoto o Mendoza, Argentina).',
      sendEmail: 'Enviar email',
      copyEmail: 'Copiar email',
      copied: 'Email copiado',
      resume: 'Descargar CV',
    },
    palette: {
      placeholder: 'Buscar secciones, proyectos, enlaces o acciones...',
      empty: 'Sin coincidencias para tu búsqueda.',
      hintNavigate: 'Navegar',
      hintSelect: 'Ejecutar',
      hintClose: 'Cerrar',
      groups: {
        navigation: 'Navegación',
        projects: 'Proyectos Insignia',
        actions: 'Acciones',
        links: 'Enlaces Externos',
      },
      actions: {
        copyEmail: 'Copiar dirección de email',
        toggleLang: 'Cambiar idioma a English (EN)',
        openResume: 'Abrir CV',
        openGithub: 'Abrir GitHub (@EmaBilibili)',
        openLinkedin: 'Abrir LinkedIn',
        verifyThm: 'Verificar certificado TryHackMe',
      },
    },
    footer: {
      role: 'Software & Systems Engineer · SOC / Blue Team Path',
      shortcut: 'Abrir paleta',
    },
  },
  en: {
    pageTitle: 'Emanuel Binimelis | Software & Systems Engineer · SOC / Blue Team',
    nav: [
      { id: 'projects', label: 'Projects' },
      { id: 'architecture', label: 'Architecture' },
      { id: 'trajectory', label: 'Trajectory' },
      { id: 'contact', label: 'Contact' },
    ],
    navAria: 'Main navigation',
    homeAria: 'Emanuel Binimelis, back to top',
    menuAria: 'Open or close menu',
    searchTrigger: 'Search...',
    paletteShortcutHint: 'Quick commands',
    hero: {
      status: 'Available · Junior Software / Systems & SOC Blue Team',
      kicker: 'SOFTWARE & SYSTEMS ENGINEER // SOC & BLUE TEAM PATH',
      headline: 'Emanuel Binimelis',
      subheadline:
        'I build low-footprint native software (Rust, C#) and production full-stack web platforms while actively advancing my hands-on transition into defensive cybersecurity and SOC operations on Linux.',
      primaryCta: 'Explore projects',
      secondaryCta: 'Get in touch',
      resumeCta: 'View Resume',
      metrics: [
        {
          value: String(projects.length),
          label: 'Production & OSS projects',
        },
        {
          value: 'Rust · TS · C#',
          label: 'Core technical stack on Linux',
        },
        {
          value: siteConfig.certificateId,
          label: 'TryHackMe completion certificate',
          href: siteConfig.certificateUrl,
        },
        {
          value: '2025',
          label: 'Graduated Univ. de Mendoza',
        },
      ],
    },
    projects: {
      kicker: 'FEATURED WORK',
      title: 'Production systems and shipped software.',
      subtitle:
        'Four flagship projects with architecture breakdowns and technical highlights, followed by a filterable engineering archive.',
      viewBreakdown: 'Technical breakdown',
      viewRepo: 'GitHub',
      viewDemo: 'Live Demo',
      privateRepo: 'Private repo',
      archiveTitle: 'Engineering archive',
      archiveSubtitle: 'Additional real-world builds across Linux tooling, SaaS web apps, and C#.',
      filterAll: 'All',
      filterLabels: {
        systems: 'Systems & Linux',
        web: 'Full-Stack & SaaS',
        csharp: 'C# & AI',
      },
      modal: {
        close: 'Close breakdown',
        problem: 'Context & Problem',
        architecture: 'Architecture & Implementation',
        highlights: 'Key Highlights',
        stack: 'Tech Stack',
      },
    },
    pillars: {
      kicker: 'TECHNICAL ARCHITECTURE',
      title: 'Three domains reinforcing each other.',
      subtitle:
        'Understanding how software is compiled, shipped, and debugged from the inside provides immediate leverage for both building resilient systems and triaging security events.',
      items: [
        {
          tag: '01 // SYSTEMS & NATIVE',
          title: 'Rust, C# & Native Software',
          desc: 'Cross-platform low-memory binaries, system process orchestration (FFmpeg, yt-dlp), finite state machines, and deep runtime debugging.',
          skills: [
            'Rust',
            'Tauri v2',
            'C# / .NET',
            'Unity Engine',
            'FFmpeg Pipelines',
            'CI/CD Releases',
          ],
        },
        {
          tag: '02 // FULL-STACK WEB & CLOUD',
          title: 'Web Applications & PWAs',
          desc: 'Designing and shipping SaaS platforms and offline-first PWAs backed by relational databases, authentication, and continuous delivery.',
          skills: [
            'TypeScript',
            'React 19 / Next.js',
            'Svelte 5',
            'Supabase (PostgreSQL)',
            'Appwrite',
            'Tailwind CSS',
          ],
        },
        {
          tag: '03 // DEFENSIVE SECURITY & LINUX',
          title: 'SOC / Blue Team & Linux Environments',
          desc: 'Practical training focused on log analysis, TCP/IP networking, defensive triage, and daily Linux operations (Arch / Omarchy and Bash automation).',
          skills: [
            'TryHackMe SEC1 (In Progress)',
            'HTB SOC L1 (Next)',
            'Linux Arch / Omarchy',
            'Bash Scripting',
            'TCP/IP & Log Triage',
            'SIEM Fundamentals',
          ],
        },
      ],
    },
    trajectory: {
      kicker: 'TRAJECTORY & VERIFIABLE EVIDENCE',
      title: 'Real engineering background and transparent security path.',
      subtitle:
        'I clearly separate production software engineering experience and TryHackMe completion records from future exam-based security certifications.',
      credentialBadge: 'Completion certificate · Verifiable',
      credentialTitle: 'TryHackMe · Security Path',
      credentialDetail:
        'Verifiable practical labs covering defensive security fundamentals, networking, and analysis (distinct from an exam-proctored professional certification).',
      verifyCredential: 'Verify on TryHackMe',
      roadmapTitle: 'Operational roadmap',
      roadmap: [
        {
          title: 'TryHackMe · SEC1 Path',
          status: 'In progress',
          active: true,
          detail: 'Initial completion certificate earned; continuing hands-on networking and analysis labs.',
        },
        {
          title: 'Linux Home Lab (Arch / Omarchy)',
          status: 'Active',
          active: true,
          detail: 'Daily desktop environment, Bash scripting, and local service configuration.',
        },
        {
          title: 'Hack The Box · SOC Analyst Level 1',
          status: 'Next',
          active: false,
          detail: 'Planned next specialization in alert triage, SIEM workflows, and incident response.',
        },
      ],
    },
    contact: {
      kicker: 'DIRECT CONTACT',
      title: 'Let’s talk engineering or security.',
      subtitle:
        'Open to Junior Software / Systems Engineering roles or entry-level SOC / Blue Team opportunities (remote or Mendoza, Argentina).',
      sendEmail: 'Send email',
      copyEmail: 'Copy email',
      copied: 'Email copied',
      resume: 'Download Resume',
    },
    palette: {
      placeholder: 'Search sections, projects, links, or actions...',
      empty: 'No matching commands found.',
      hintNavigate: 'Navigate',
      hintSelect: 'Run',
      hintClose: 'Close',
      groups: {
        navigation: 'Navigation',
        projects: 'Featured Projects',
        actions: 'Actions',
        links: 'External Links',
      },
      actions: {
        copyEmail: 'Copy email address',
        toggleLang: 'Switch language to Español (ES)',
        openResume: 'Open Resume',
        openGithub: 'Open GitHub (@EmaBilibili)',
        openLinkedin: 'Open LinkedIn',
        verifyThm: 'Verify TryHackMe certificate',
      },
    },
    footer: {
      role: 'Software & Systems Engineer · SOC / Blue Team Path',
      shortcut: 'Open palette',
    },
  },
};
