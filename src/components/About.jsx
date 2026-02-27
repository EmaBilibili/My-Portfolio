import { motion } from 'framer-motion';
import { Code2, Layout, Server, Users } from 'lucide-react';

const About = () => {
    const skills = [
        { icon: <Code2 />, title: "Core Tech", desc: "React, TypeScript, Node.js, Git" },
        { icon: <Layout />, title: "Frontend", desc: "HTML/CSS, Tailwind, Next.js" },
        { icon: <Server />, title: "Backend", desc: "Node.js, Express, REST APIs" },
        { icon: <Users />, title: "Soft Skills", desc: "Liderazgo, Optimización" },
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
                    <h2 className="text-4xl font-bold mb-12 text-center heading-readable">
                        Sobre <span className="text-gradient">Mí</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="space-y-6 text-gray-400 leading-relaxed bg-black/60 backdrop-blur-sm p-6 rounded-xl">
                            <p>
                                Soy un desarrollador web con sede en Mendoza, Argentina. Me especializo en construir aplicaciones web modernas, tanto en el frontend como en el backend, con especial atención al rendimiento, la accesibilidad y el diseño.
                            </p>
                            <p>
                                Me destaco creando interfaces de usuario intuitivas y APIs robustas. Tengo experiencia liderando equipos de desarrollo y colaborando en proyectos multidisciplinarios. Mi objetivo es entregar soluciones web de alta calidad y bien estructuradas.
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                            <div className="relative bg-black border border-white/10 rounded-2xl p-6 aspect-video flex items-center justify-center overflow-hidden">
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
                                className="glass p-6 rounded-xl text-center hover:bg-white/10 transition-colors group"
                            >
                                <div className="text-primary mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                    {skill.icon}
                                </div>
                                <h3 className="text-white font-bold mb-2">{skill.title}</h3>
                                <p className="text-sm text-gray-500">{skill.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
