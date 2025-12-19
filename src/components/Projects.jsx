import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, Terminal } from 'lucide-react';

import projectData from '../data/projects.json';

const Projects = () => {
    const projects = projectData;

    return (
        <section id="projects" className="py-20 bg-transparent relative overflow-hidden">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-50">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* LEFT COLUMN - GAMING */}
                    <div className="flex flex-col gap-12">
                        <div className="text-left md:text-right">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-primary/20 text-primary text-sm mb-4 font-mono">
                                <Terminal className="w-4 h-4" />
                                <span>SYSTEM.GAMING</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">
                                Proyectos
                            </h2>
                        </div>

                        <div className="space-y-12">
                            {projects.filter(p => p.domain === 'gaming').map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative tech-border bg-surface/50 backdrop-blur-sm transition-all duration-300 border-l-2 border-l-primary/50"
                                >
                                    <div className="relative h-48 overflow-hidden border-b border-white/5">
                                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-out"
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
                                                <span key={i} className="text-xs text-primary font-mono bg-primary/5 px-2 py-1 border border-primary/10">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4 mt-auto">
                                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="relative z-20 flex-1 bg-white text-black py-2.5 font-bold text-sm hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_var(--color-primary)]">
                                                <Play className="w-4 h-4" /> <span className="uppercase tracking-wide">Demo</span>
                                            </a>
                                            <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="relative z-20 flex-1 border border-white/20 text-white py-2.5 font-bold text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                                                <Github className="w-4 h-4" /> <span className="uppercase tracking-wide">Code</span>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SECURITY */}
                    <div className="flex flex-col gap-12">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent/20 text-accent text-sm mb-4 font-mono">
                                <Terminal className="w-4 h-4" />
                                <span>SYSTEM.SECURITY</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                Destacados
                            </h2>
                        </div>

                        <div className="space-y-12">
                            {projects.filter(p => p.domain === 'security').map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative tech-border bg-surface/50 backdrop-blur-sm transition-all duration-300 border-l-2 border-l-accent/50"
                                >
                                    <div className="relative h-48 overflow-hidden border-b border-white/5">
                                        <div className="absolute inset-0 bg-accent/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-out"
                                        />
                                        <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-accent border border-accent/30">
                                            {project.category}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:text-accent transition-colors">
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
                                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="relative z-20 flex-1 border border-white/20 text-white py-2.5 font-bold text-sm hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_var(--color-accent)]">
                                                <Play className="w-4 h-4" /> <span className="uppercase tracking-wide">View</span>
                                            </a>
                                            <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="relative z-20 flex-1 border border-white/20 text-white py-2.5 font-bold text-sm hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2">
                                                <Github className="w-4 h-4" /> <span className="uppercase tracking-wide">Code</span>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default Projects;
