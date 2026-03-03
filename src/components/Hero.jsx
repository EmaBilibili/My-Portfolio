import { motion } from 'framer-motion';
import { ArrowRight, Gamepad2, Code2, Sparkles, Star } from 'lucide-react';

const floatingIcons = [
    { icon: Gamepad2, color: '#10b981', top: '15%', left: '8%', delay: 0 },
    { icon: Code2, color: '#34d399', top: '25%', right: '10%', delay: 0.4 },
    { icon: Sparkles, color: '#f59e0b', bottom: '30%', left: '6%', delay: 0.8 },
    { icon: Star, color: '#6ee7b7', bottom: '20%', right: '8%', delay: 1.2 },
];

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24">
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(16,185,129,0.10)_0%,transparent_70%)] pointer-events-none" />

            {/* Floating icons — desktop only */}
            {floatingIcons.map(({ icon: Icon, color, delay, ...pos }, i) => (
                <motion.div
                    key={i}
                    className="absolute hidden lg:flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{
                        ...pos,
                        background: `${color}18`,
                        border: `1px solid ${color}30`,
                        boxShadow: `0 0 20px ${color}20`,
                    }}
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, delay, ease: 'easeInOut' }}
                >
                    <Icon style={{ color, width: 22, height: 22 }} />
                </motion.div>
            ))}

            <div className="container mx-auto px-6 relative z-10">
                {/* SEO heading */}
                <h1 className="sr-only">Emanuel Binimelis - Game Developer & Web Developer, AI-Powered</h1>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6"
                >
                    {/* Available badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/30 bg-primary/8 backdrop-blur-sm" style={{ borderRadius: 0 }}>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-primary tracking-widest uppercase" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}>
                            ✦ Available for Projects
                        </span>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                        <div className="text-5xl sm:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-none">
                            <span className="text-gradient">EMANUEL</span>
                        </div>
                        <div className="text-5xl sm:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-none text-white">
                            BINIMELIS
                        </div>
                    </div>

                    {/* Subtitle */}
                    <h2 className="text-sm sm:text-base text-gray-300 tracking-wide" style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: 1.8 }}>
                        <span className="text-primary">Game Developer</span>
                        <span className="text-white/40 mx-3">&</span>
                        <span className="text-secondary">Web Developer</span>
                    </h2>

                    {/* Tag */}
                    <p className="font-mono text-sm text-gray-500 tracking-wider">
                        AI-Powered Development · Unity · React · Node.js
                    </p>

                    {/* Description */}
                    <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl">
                        Creando mundos interactivos con <span className="text-white font-medium">Unity y C#</span>,
                        construyendo aplicaciones web con <span className="text-white font-medium">React y Node.js</span>,
                        y potenciando todo con <span className="text-accent font-medium">herramientas de IA</span>.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none sm:justify-center">
                        <a
                            href="#projects"
                            className="flex items-center justify-center gap-2 px-8 py-3.5 font-bold font-mono tracking-wide text-white transition-all duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #10b981, #6366f1)',
                                boxShadow: '2px 0 0 0 #10b981, -2px 0 0 0 #10b981, 0 2px 0 0 #10b981, 0 -2px 0 0 #10b981, 0 0 25px rgba(16,185,129,0.4)',
                            }}
                        >
                            VER PROYECTOS <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#contact"
                            className="flex items-center justify-center gap-2 px-8 py-3.5 font-bold font-mono tracking-wide border border-primary/40 text-primary hover:bg-primary/10 transition-all duration-300"
                        >
                            CONTACTAR
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="flex flex-col items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-primary/40">
                    Scroll
                    <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent" />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
