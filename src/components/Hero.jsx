import { motion } from 'framer-motion';
import { ArrowRight, Gamepad2, Code2, Sparkles, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24">
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(16,185,129,0.10)_0%,transparent_70%)] pointer-events-none" />


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
                        <span className="text-primary tracking-widest uppercase" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(10px, 1.2vw, 11px)' }}>
                            {t('hero.available')}
                        </span>
                    </div>

                    {/* Name */}
                    <div className="space-y-1 mt-4 sm:mt-0">
                        <div className="text-3xl sm:text-6xl lg:text-8xl font-heading font-bold tracking-tight leading-none">
                            <span className="text-gradient">EMANUEL</span>
                        </div>
                        <div className="text-3xl sm:text-6xl lg:text-8xl font-heading font-bold tracking-tight leading-none text-white mt-3 sm:mt-1">
                            BINIMELIS
                        </div>
                    </div>

                    {/* Subtitle */}
                    <h2 className="text-xs sm:text-sm md:text-base text-gray-300 tracking-wide mt-2" style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: 2 }}>
                        <span className="text-primary block sm:inline">{t('hero.role1')}</span>
                        <span className="text-white/40 mx-3 hidden sm:inline">&</span>
                        <span className="text-secondary block sm:inline mt-2 sm:mt-0">{t('hero.role2')}</span>
                    </h2>

                    {/* Tag */}
                    <p className="font-mono text-xs sm:text-sm text-gray-500 tracking-wider">
                        {t('hero.skills')}
                    </p>

                    {/* Description */}
                    <p className="text-gray-400 text-xs sm:text-sm md:text-lg leading-relaxed max-w-xl px-2">
                        {t('hero.desc1')}<span className="text-white font-medium">{t('hero.desc2')}</span>{t('hero.desc3')}
                        <span className="text-white font-medium">{t('hero.desc4')}</span>{t('hero.desc5')}
                        <span className="text-accent font-medium">{t('hero.desc6')}</span>{t('hero.desc7')}
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:justify-center mt-2">
                        <a
                            href="#projects"
                            className="flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold font-mono tracking-wide text-white transition-all duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #10b981, #6366f1)',
                                boxShadow: '2px 0 0 0 #10b981, -2px 0 0 0 #10b981, 0 2px 0 0 #10b981, 0 -2px 0 0 #10b981, 0 0 25px rgba(16,185,129,0.4)',
                            }}
                        >
                            {t('hero.btnProjects')} <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#contact"
                            className="flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold font-mono tracking-wide border border-primary/40 text-primary hover:bg-primary/10 transition-all duration-300"
                        >
                            {t('hero.btnContact')}
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator (hidden on very small screens to avoid overlaps) */}
            <motion.div
                className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="flex flex-col items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-primary/40">
                    {t('hero.scroll')}
                    <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent" />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
