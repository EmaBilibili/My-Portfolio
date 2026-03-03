import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, Gamepad2, Code2 } from 'lucide-react';

import projectData from '../data/projects.json';

const ProjectCard = ({ project, accentColor, hoverColor }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="group relative game-border bg-surface/50 backdrop-blur-sm transition-all duration-300"
        style={{ borderLeft: `2px solid ${accentColor}50` }}
    >
        <div className="relative h-48 overflow-hidden border-b border-white/5">
            <div
                className="absolute inset-0 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `${accentColor}25` }}
            />
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-out"
            />
            <div
                className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold border"
                style={{ color: accentColor, borderColor: `${accentColor}40` }}
            >
                {project.category}
            </div>
        </div>

        <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:transition-colors" style={{ '--hover': accentColor }}>
                {project.title}
            </h3>
            <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t, i) => (
                    <span
                        key={i}
                        className="text-xs font-mono px-2 py-1 border"
                        style={{ color: accentColor, background: `${accentColor}08`, borderColor: `${accentColor}20` }}
                    >
                        {t}
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-20 flex-1 py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    style={{ background: accentColor, color: '#fff' }}
                >
                    <Play className="w-4 h-4" /> <span className="uppercase tracking-wide">Demo</span>
                </a>
                {project.repoLink && project.repoLink !== "#" && (
                    <a
                        href={project.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 flex-1 border border-white/20 text-white py-2.5 font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Github className="w-4 h-4" /> <span className="uppercase tracking-wide">Code</span>
                    </a>
                )}
            </div>
        </div>
    </motion.div>
);

const Projects = () => {
    const gameProjects = projectData.filter(p => p.domain === 'gaming');
    const webProjects = projectData.filter(p => p.domain === 'web');

    return (
        <section id="projects" className="py-20 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-50">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* LEFT — Web Projects */}
                    <div className="flex flex-col gap-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-secondary/20 text-secondary text-sm mb-4 font-mono">
                                <Code2 className="w-4 h-4" />
                                <span>WEB PROJECTS</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent leading-relaxed break-words">
                                Destacados
                            </h2>
                        </div>

                        <div className="space-y-10">
                            {webProjects.map((project, index) => (
                                <ProjectCard key={index} project={project} accentColor="#34d399" hoverColor="secondary" />
                            ))}
                        </div>

                        {webProjects.length === 0 && (
                            <div className="glass p-12 rounded-xl text-center text-gray-500 font-mono text-sm border border-secondary/10">
                                <Code2 className="w-8 h-8 mx-auto mb-4 text-secondary/30" />
                                Web projects coming soon...
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Game Projects */}
                    <div className="flex flex-col gap-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-primary/20 text-primary text-sm mb-4 font-mono">
                                <Gamepad2 className="w-4 h-4" />
                                <span>GAME PROJECTS</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-white leading-relaxed break-words">
                                Proyectos
                            </h2>
                        </div>

                        <div className="space-y-10">
                            {gameProjects.map((project, index) => (
                                <ProjectCard key={index} project={project} accentColor="#10b981" hoverColor="primary" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
