import { motion } from 'framer-motion';
import { Briefcase, ShieldCheck } from 'lucide-react';

import experienceData from '../data/experience.json';

const Experience = () => {
    const experiences = experienceData;

    return (
        <section id="experience" className="py-20 bg-transparent relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-16 text-center font-heading"
                >
                    Experiencia <span className="text-gradient">Profesional</span>
                </motion.h2>

                <div className="max-w-3xl mx-auto relative">
                    {/* Vertical Line */}
                    <div className="absolute left-0 md:left-1/2 h-full w-px bg-gradient-to-b from-primary via-secondary to-transparent -translate-x-1/2 hidden md:block opacity-30" />

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full -translate-x-[5px] md:-translate-x-1/2 mt-1.5 shadow-[0_0_10px_var(--color-primary)] hidden md:block z-10" />

                                <div className="flex-1"></div>
                                <div className="flex-1">
                                    <div className="relative group p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                        <div className="absolute inset-0 rounded-xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                        <div className="flex items-center gap-3 mb-2">
                                            {exp.category?.includes('Security') ?
                                                <ShieldCheck className="w-5 h-5 text-accent" /> :
                                                <Briefcase className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                                            }
                                            <span className="text-sm text-gray-400 font-mono tracking-wider">{exp.period}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 font-heading">{exp.role}</h3>
                                        <h4 className="text-primary font-medium mb-3">{exp.company}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {exp.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
