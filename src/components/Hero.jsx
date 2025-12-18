import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-start justify-center relative overflow-hidden bg-background pt-32">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
            <div className="absolute top-0 left-0 w-full h-full bg-hero-pattern opacity-10" />

            {/* Matrix rain-like or tech overlay could go here, for now a simple grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none" />


            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="grid grid-cols-2 gap-4 md:gap-12 items-center">
                        {/* LEFT COLUMN (Gamer) - Aligned Right to center */}
                        <div className="text-right flex flex-col items-end">
                            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm shadow-[0_0_15px_var(--color-primary)]">
                                <span className="text-primary font-mono tracking-widest text-sm uppercase flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    System Online
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight text-white mb-2">
                                EMANUEL
                            </h1>

                            <h3 className="text-2xl md:text-3xl text-primary font-heading font-light">
                                Game Developer
                            </h3>

                            <div className="mt-8 flex justify-end">
                                <a
                                    href="#contact"
                                    className="bg-primary text-black px-8 py-3.5 rounded-none font-bold font-mono tracking-wide flex items-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,159,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] tech-border border-0"
                                >
                                    CONTACTAR
                                </a>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (Hacker) - Aligned Left to center */}
                        <div className="text-left flex flex-col items-start">
                            <h2
                                className="text-gray-400 font-mono mb-4 animate-glitch glitch-text text-xl md:text-xl pt-2"
                                data-text="Hello World, I'm"
                            >
                                Hello World, I'm
                            </h2>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent mb-2">
                                BINIMELIS
                            </h1>

                            <h3 className="text-2xl md:text-3xl text-accent font-heading font-light flex items-center gap-2">
                                <span className="text-white text-lg">&</span> Cybersecurity
                            </h3>

                            <div className="mt-8 flex justify-start">
                                <a
                                    href="#projects"
                                    className="px-8 py-3.5 rounded-none border border-white/20 text-white font-mono hover:bg-white/5 transition-all flex items-center gap-2"
                                >
                                    VER PROYECTOS <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <p className="max-w-2xl mx-auto text-gray-400 mt-16 text-center text-lg leading-relaxed font-light">
                        Fusionando la creatividad del <span className="text-white">desarrollo de videojuegos</span> con la disciplina de la <span className="text-white">ciberseguridad</span>. Construyendo mundos, protegiendo sistemas.
                    </p>

                </motion.div>
            </div>

            {/* Decorative Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] animate-pulse delay-1000" />

            {/* Tech Decoration */}
            <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-primary/20 opacity-50 hidden md:block" />
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-primary/20 opacity-50 hidden md:block" />

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="flex flex-col items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase opacity-70">
                    Scroll
                    <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
