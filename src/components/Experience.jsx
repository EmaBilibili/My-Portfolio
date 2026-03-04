import { motion } from 'framer-motion';
import { Briefcase, Globe, Gamepad2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import experienceData from '../data/experience.json';

const categoryIcon = (category) => {
    if (category === 'Gaming') return <Gamepad2 className="w-5 h-5 text-primary" />;
    if (category === 'Development') return <Globe className="w-5 h-5 text-secondary" />;
    return <Briefcase className="w-5 h-5 text-primary" />;
};

const Experience = () => {
    const { t, language } = useLanguage();
    const experiences = experienceData;

    return (
        <section id="experience" className="py-20 bg-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-3xl font-bold mb-16 text-center font-heading heading-readable leading-relaxed"
                >
                    {t('experience.title1')} <span className="text-gradient">{t('experience.title2')}</span>
                </motion.h2>

                <div className="max-w-3xl mx-auto relative">
                    {/* Vertical line */}
                    <div className="absolute left-0 md:left-1/2 h-full w-px bg-gradient-to-b from-primary via-secondary to-transparent -translate-x-1/2 hidden md:block opacity-20" />

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Timeline dot */}
                                <div
                                    className="absolute left-0 md:left-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full -translate-x-[5px] md:-translate-x-1/2 mt-1.5 hidden md:block z-10"
                                    style={{ boxShadow: '0 0 10px rgba(16,185,129,0.6)' }}
                                />

                                <div className="flex-1" />
                                <div className="flex-1">
                                    <div className="relative group p-6 rounded-xl border border-white/5 bg-white/3 hover:bg-white/8 transition-colors backdrop-blur-sm">
                                        <div className="absolute inset-0 rounded-xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                        <div className="flex items-center gap-3 mb-2">
                                            {categoryIcon(exp.category)}
                                            <span className="text-sm text-gray-400 font-mono tracking-wider">{language === 'en' && exp.period_en ? exp.period_en : exp.period}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 font-heading">{language === 'en' && exp.role_en ? exp.role_en : exp.role}</h3>
                                        <h4 className="text-primary font-medium mb-3 text-sm">{language === 'en' && exp.company_en ? exp.company_en : exp.company}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{language === 'en' && exp.desc_en ? exp.desc_en : exp.desc}</p>
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
