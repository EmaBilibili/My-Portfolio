import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';

import educationData from '../data/education.json';

const Education = () => {
    return (
        <section className="py-20 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                    {/* LEFT COLUMN - GAMING */}
                    <div className="flex flex-col gap-8">
                        <div className="text-left md:text-right">
                            <h2 className="text-4xl font-bold font-heading text-white mb-2">Educación</h2>
                        </div>

                        {educationData.filter(e => e.domain === 'gaming').map((edu, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ x: 10 }}
                                className="glass p-8 rounded-2xl border-l-4 border-l-primary text-left md:text-right"
                            >
                                <div className="flex justify-start md:justify-end mb-4">
                                    <GraduationCap className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{edu.title}</h3>
                                <p className="text-gray-400 mb-4">{edu.institution}</p>
                                <p className="text-sm text-gray-500">{edu.period}</p>
                                <p className="mt-4 text-gray-300 text-sm">
                                    {edu.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* RIGHT COLUMN - SECURITY */}
                    <div className="flex flex-col gap-8">
                        <div className="text-left">
                            <h2 className="text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent mb-2">
                                Certificaciones
                            </h2>
                        </div>

                        {educationData.filter(e => e.domain === 'security').map((edu, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ x: -10 }}
                                className="glass p-8 rounded-2xl border-l-4 border-l-secondary text-left"
                            >
                                <div className="flex justify-start mb-4">
                                    <Award className="w-10 h-10 text-secondary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{edu.title}</h3>
                                <p className="text-gray-400 mb-4">{edu.institution}</p>
                                <p className="text-sm text-gray-500">{edu.period}</p>
                                <p className="mt-4 text-gray-300 text-sm">
                                    {edu.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;
