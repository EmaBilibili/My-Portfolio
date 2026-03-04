import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import educationData from '../data/education.json';

const Education = () => {
    const { t, language } = useLanguage();
    const degrees = educationData.filter(e => e.type === 'degree');
    const certs = educationData.filter(e => e.type === 'certification');

    return (
        <section className="py-20 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                    {/* LEFT — Formal Education */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-white mb-4 leading-relaxed break-words">{t('education.title1')}</h2>
                        </div>

                        {degrees.map((edu, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ x: 6 }}
                                className="glass p-8 rounded-2xl border-l-4 border-l-primary"
                            >
                                <div className="flex mb-4">
                                    <GraduationCap className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{language === 'en' && edu.title_en ? edu.title_en : edu.title}</h3>
                                <p className="text-gray-400 mb-2">{edu.institution}</p>
                                <p className="text-sm text-gray-500 mb-4">{language === 'en' && edu.period_en ? edu.period_en : edu.period}</p>
                                <p className="text-gray-300 text-sm leading-relaxed">{language === 'en' && edu.desc_en ? edu.desc_en : edu.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* RIGHT — Certifications */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent mb-4 leading-relaxed break-words">
                                {t('education.title2')}
                            </h2>
                        </div>

                        {certs.map((edu, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ x: -6 }}
                                className="glass p-8 rounded-2xl border-l-4 border-l-secondary"
                            >
                                <div className="flex mb-4">
                                    <Award className="w-10 h-10 text-secondary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{language === 'en' && edu.title_en ? edu.title_en : edu.title}</h3>
                                <p className="text-gray-400 mb-2">{edu.institution}</p>
                                <p className="text-sm text-gray-500 mb-4">{language === 'en' && edu.period_en ? edu.period_en : edu.period}</p>
                                <p className="text-gray-300 text-sm leading-relaxed">{language === 'en' && edu.desc_en ? edu.desc_en : edu.desc}</p>
                            </motion.div>
                        ))}

                        {certs.length === 0 && (
                            <div className="glass p-8 rounded-2xl text-center text-gray-500 font-mono text-sm">
                                {t('education.empty')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;
