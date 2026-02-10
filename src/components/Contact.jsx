import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Linkedin, Github, Gamepad2, CheckCircle2, AlertCircle } from 'lucide-react';

import contactData from '../data/contact.json';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!contactData.formspreeId) {
            alert("Por favor configura tu Formspree ID en src/data/contact.json");
            return;
        }

        setStatus('submitting');

        try {
            const response = await fetch(`https://formspree.io/f/${contactData.formspreeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="py-20 bg-transparent relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6 heading-readable">
                            ¿Tienes un proyecto <br />
                            <span className="text-gradient">en mente?</span>
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg bg-black/60 backdrop-blur-sm p-4 rounded-xl">
                            Estoy siempre abierto a discutir nuevos proyectos, ideas creativas o oportunidades para ser parte de tus visiones.
                        </p>

                        <div className="space-y-6 bg-black/60 backdrop-blur-sm p-4 rounded-xl">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{contactData.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-secondary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ubicación</p>
                                    <p className="font-medium">{contactData.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <a href="https://www.linkedin.com/in/emanuelbinimelis" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="https://github.com/EmaBilibili" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://emabilibili.itch.io/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                                <Gamepad2 className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass p-8 rounded-2xl relative overflow-hidden"
                    >
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-4">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-bold text-white">¡Mensaje Enviado!</h3>
                                <p className="text-gray-400">
                                    Gracias por contactarme. Te responderé lo antes posible.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-primary hover:text-white font-medium transition-colors"
                                >
                                    Enviar otro mensaje
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Cuéntame sobre tu proyecto..."
                                    ></textarea>
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Hubo un error al enviar. Por favor intenta nuevamente.</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'submitting' ? 'Enviando...' : 'Enviar Mensaje'}
                                    {status !== 'submitting' && <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
