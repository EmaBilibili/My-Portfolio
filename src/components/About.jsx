import { motion } from 'framer-motion';
import { Gamepad2, Code2, Sparkles, Users } from 'lucide-react';

const About = () => {
    const skills = [
        {
            icon: <Gamepad2 />,
            title: "Game Dev",
            desc: "Unity, C#, Godot, Blender",
            color: 'text-primary',
            glow: 'rgba(16,185,129,0.2)',
        },
        {
            icon: <Code2 />,
            title: "Web Dev",
            desc: "React, Node.js, TypeScript, MongoDB",
            color: 'text-secondary',
            glow: 'rgba(52,211,153,0.2)',
        },
        {
            icon: <Sparkles />,
            title: "AI Tools",
            desc: "Copilot, Claude, Cursor, Prompting",
            color: 'text-accent',
            glow: 'rgba(99,102,241,0.2)',
        },
        {
            icon: <Users />,
            title: "Soft Skills",
            desc: "Liderazgo, Prototipado, Optimización",
            color: 'text-primary',
            glow: 'rgba(16,185,129,0.2)',
        },
    ];

    return (
        <section id="about" className="py-20 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-12 text-center heading-readable leading-relaxed break-words">
                        Sobre <span className="text-gradient">Mí</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="space-y-6 text-gray-400 leading-relaxed bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/5">
                            <p>
                                Desarrollador de videojuegos y aplicaciones web con sede en Mendoza, Argentina.
                                Combino la creatividad del <span className="text-white font-medium">desarrollo de juegos</span> con
                                la potencia del <span className="text-white font-medium">desarrollo web moderno</span>.
                            </p>
                            <p>
                                Utilizo <span className="text-accent font-medium">herramientas de IA</span> como GitHub Copilot y Claude
                                para acelerar el desarrollo y mejorar la calidad del código. Mi objetivo:
                                crear experiencias digitales inmersivas y de alto impacto.
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                            <div className="relative bg-black/60 border border-white/10 rounded-2xl p-6 aspect-video flex items-center justify-center overflow-hidden">
                                <div className="text-center">
                                    <span className="text-6xl font-bold text-white block mb-2">3+</span>
                                    <span className="text-gray-400 uppercase tracking-widest text-sm">Años de Experiencia</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass p-6 rounded-xl text-center hover:bg-white/5 transition-all group"
                                style={{ '--glow': skill.glow }}
                            >
                                <div className={`${skill.color} mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    {skill.icon}
                                </div>
                                <h3 className="text-white font-bold mb-2 text-sm">{skill.title}</h3>
                                <p className="text-xs text-gray-500">{skill.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
