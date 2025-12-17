import express from 'express';
import { Project } from '../models/Project.js';
import { Experience } from '../models/Experience.js';
import { isConnected } from '../index.js'; // Import connection status

const router = express.Router();

// Mock Data
const MOCK_PROJECTS = [
    {
        title: "Kenopsia (Offline Mode)",
        category: "Survival Horror",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
        tech: ["Unity", "C#", "AI", "Horror"],
        description: "Juego de survival horror inspirado en Backrooms y Outlast. Datos servidos desde memoria."
    },
    {
        title: "Penetration Testing Lab",
        category: "Cybersecurity",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
        tech: ["Kali Linux", "Metasploit", "Burp Suite"],
        description: "Entorno de laboratorio para prácticas de pentesting. Datos servidos desde memoria."
    }
];

const MOCK_EXPERIENCE = [
    {
        role: "Game Developer (Offline)",
        company: "University Thesis",
        period: "2023 - 2024",
        desc: "Co-desarrollo de un juego survival horror. (Modo Offline)"
    }
];

// GET all projects
router.get('/projects', async (req, res) => {
    try {
        if (!isConnected) return res.json(MOCK_PROJECTS);

        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET all experience
router.get('/experience', async (req, res) => {
    try {
        if (!isConnected) return res.json(MOCK_EXPERIENCE);

        const experience = await Experience.find();
        res.json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed data endpoint
router.post('/seed', async (req, res) => {
    try {
        if (!isConnected) return res.status(503).json({ message: "Cannot seed in Offline Mode. Connect MongoDB first." });

        await Project.deleteMany({});
        await Experience.deleteMany({});

        // ... (rest of seeding logic is fine to keep, but let's just use the seed data defined previously in memory if we wanted, but sticking to original pattern)
        const projects = [
            {
                title: "Kenopsia",
                category: "Survival Horror Review",
                image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
                tech: ["Unity", "C#", "AI", "Horror"],
                description: "Juego de survival horror inspirado en Backrooms y Outlast. Proyecto de tesis universitaria."
            },
            {
                title: "Skuishy Souls",
                category: "Game Jam Winner",
                image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=800",
                tech: ["Unity", "2D", "Game Jam"],
                description: "Ganador del 1er puesto en VideoGamesClub Mendoza GAMEJAM. Premio al Mejor Juego."
            },
            {
                title: "Penetration Testing Lab",
                category: "Cybersecurity",
                image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
                tech: ["Kali Linux", "Metasploit", "Burp Suite"],
                description: "Entorno de laboratorio para prácticas de pentesting y análisis de vulnerabilidades en redes simuladas."
            },
            {
                title: "Secure Chat App",
                category: "Cybersecurity & Dev",
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
                tech: ["Node.js", "Encryption", "Socket.io"],
                description: "Aplicación de mensajería con encriptación de extremo a extremo implementada desde cero."
            }
        ];

        const experiences = [
            {
                role: "Game Developer - Kenopsia",
                company: "University Thesis Project",
                period: "2023 - 2024",
                desc: "Co-desarrollo de un juego survival horror inspirado en Backrooms y Outlast usando Unity & C#."
            },
            {
                role: "Security Analyst Intern",
                company: "CyberSec Firm (Simulated)",
                period: "2024 - Presente",
                desc: "Análisis de tráfico de red y detección de intrusiones en entornos controlados. Uso de herramientas SIEM."
            },
            {
                role: "Freelance Game Programmer",
                company: "Freelance",
                period: "2022 - Presente",
                desc: "Desarrollo de diversos proyectos en Unity & C# y scripting de automatización segura."
            }
        ];

        await Project.insertMany(projects);
        await Experience.insertMany(experiences);

        res.json({ message: "Database seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
