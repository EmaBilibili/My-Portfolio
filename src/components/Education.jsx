import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';

const Education = () => {
    return (
        <section className="py-20 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        Educación y <span className="text-gradient">Certificaciones</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass p-8 rounded-2xl border-l-4 border-l-primary"
                        >
                            <GraduationCap className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Video Game Development Technician</h3>
                            <p className="text-gray-400 mb-4">Mendoza University</p>
                            <p className="text-sm text-gray-500">Graduated Feb 2025</p>
                            <p className="mt-4 text-gray-300 text-sm">
                                Formación técnica integral en desarrollo de videojuegos, diseño y programación.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass p-8 rounded-2xl border-l-4 border-l-secondary"
                        >
                            <Award className="w-10 h-10 text-secondary mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Master Builder</h3>
                            <p className="text-gray-400 mb-4">High school Sagrada Familia</p>
                            <p className="text-sm text-gray-500">Graduated Feb 2021</p>
                            <p className="mt-4 text-gray-300 text-sm">
                                Título técnico en construcción (Technical School).
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Education;
