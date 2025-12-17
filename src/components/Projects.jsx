import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, Terminal } from 'lucide-react';

const Projects = () => {
    const projects = [
        {
            title: "Kenopsia",
            category: "Survival Horror",
            image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
            tech: ["Unity", "C#", "AI", "Horror"],
            description: "Juego de survival horror inspirado en Backrooms y Outlast. Proyecto de tesis universitaria."
        },
        {
            title: "Skuishy Souls",
            category: "Game Jam Winner",
            image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=800",
            tech: ["Unity", "2D", "Game Jam"],
            description: "Ganador del 1er puesto en VideoGamesClub Mendoza GAMEJAM. Premio al Mejor Juego."
        },
        {
            title: "Penetration Testing Lab",
            category: "Cybersecurity",
            image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
            tech: ["Kali Linux", "Metasploit", "Burp Suite", "Wireshark"],
            description: "Entorno de laboratorio para prácticas de pentesting y análisis de vulnerabilidades en redes simuladas."
        },
        {
            title: "Secure Chat Application",
            category: "Cybersecurity & Dev",
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            tech: ["Node.js", "Encryption", "WebSockets"],
            description: "Aplicación de mensajería con encriptación de extremo a extremo implementada desde cero."
        },
        {
            title: "Network Security Scanner",
            category: "Cybersecurity Tool",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
            tech: ["Python", "Nmap", "Security"],
            description: "Herramienta automatizada para escaneo y análisis de seguridad en redes corporativas."
        },
        {
            title: "Game Jam 2022",
            category: "Arcade Game",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
            tech: ["Unity", "C#", "Prototyping"],
            description: "2do puesto en VideoGamesClub Mendoza GAMEJAM. Mención honorífica por innovación."
        }
    ];

    return (
        <section id="projects" className="py-20 bg-background relative overflow-hidden">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent/20 text-accent text-sm mb-4 font-mono">
                        <Terminal className="w-4 h-4" />
                        <span>SYSTEM.PROJECTS</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
                        Proyectos <span className="text-gradient">Destacados</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-light">
                        Explorando la intersección entre desarrollo de videojuegos y ciberseguridad.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative tech-border bg-surface/50 backdrop-blur-sm hover:translate-y-[-5px] transition-all duration-300"
                        >
                            <div className="relative h-48 overflow-hidden border-b border-white/5">
                                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-primary border border-primary/30">
                                    {project.category}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="text-xs text-accent font-mono bg-accent/5 px-2 py-1 border border-accent/10">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 mt-auto">
                                    <button className="flex-1 bg-white text-black py-2.5 font-bold text-sm hover:bg-primary hover:text-black transition-colors flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_var(--color-primary)]">
                                        <Play className="w-4 h-4" /> <span className="uppercase tracking-wide">Demo</span>
                                    </button>
                                    <button className="p-2.5 border border-white/20 hover:border-primary hover:text-primary transition-colors text-white bg-black/50">
                                        <Github className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default Projects;
