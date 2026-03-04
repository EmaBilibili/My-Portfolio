import { useState, useEffect } from 'react';
import { Menu, X, Gamepad2, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { language, toggleLanguage, t } = useLanguage();

    const navLinks = [
        { name: t('nav.home'), href: '#home' },
        { name: t('nav.about'), href: '#about' },
        { name: t('nav.experience'), href: '#experience' },
        { name: t('nav.projects'), href: '#projects' },
        { name: t('nav.education'), href: '#education' },
        { name: t('nav.contact'), href: '#contact' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <a href="#" id="navbar-logo" className="text-xl md:text-2xl font-bold font-heading text-white flex items-center gap-2 group shrink-0">
                    <Gamepad2 className="text-primary group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-gradient">EB.Dev</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 justify-end flex-1">
                    <div id="turret-anchor" className="w-16 h-10 flex items-center justify-center shrink-0" />
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider font-medium relative group whitespace-nowrap"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-sm font-bold tracking-wider bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-primary/50"
                        title="Cambiar idioma / Change language"
                    >
                        <span>{language === 'es' ? 'ES' : 'EN'}</span>
                        <Globe className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile Menu Button - Also render Language Switcher next to hamburger if possible, or just in dropdown */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors p-2"
                    >
                        <span className="font-bold text-xs">{language === 'es' ? 'ES' : 'EN'}</span>
                        <Globe className="w-4 h-4" />
                    </button>

                    <button
                        className="text-white hover:text-primary transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-lg border-t border-white/5 overflow-hidden"
                    >
                        <div className="flex flex-col items-center py-8 gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-300 hover:text-primary text-lg font-medium font-heading tracking-wide transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
