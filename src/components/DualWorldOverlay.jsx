import { useEffect, useRef } from 'react';
import { entitiesRef, particlesRef } from './gameState';

const DualWorldOverlay = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 8;
                this.speedY = (Math.random() - 0.5) * 8;
                this.life = 1.0;
                this.decay = Math.random() * 0.03 + 0.02;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                this.size *= 0.95;
            }

            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Code snippets that float around the screen
        const codeSnippets = ['<div>', '</div>', 'const', 'async', 'return', '=>', '{}', '[]', 'React', '.map()', 'useState', 'fetch()', '</>'];

        class Entity {
            constructor() {
                // Spawn from random edge
                const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left

                switch (edge) {
                    case 0: // Top
                        this.x = Math.random() * canvas.width;
                        this.y = -50;
                        this.vx = (Math.random() - 0.5) * 2;
                        this.vy = Math.random() * 1.5 + 0.5;
                        break;
                    case 1: // Right
                        this.x = canvas.width + 50;
                        this.y = Math.random() * canvas.height;
                        this.vx = -(Math.random() * 1.5 + 0.5);
                        this.vy = (Math.random() - 0.5) * 2;
                        break;
                    case 2: // Bottom
                        this.x = Math.random() * canvas.width;
                        this.y = canvas.height + 50;
                        this.vx = (Math.random() - 0.5) * 2;
                        this.vy = -(Math.random() * 1.5 + 0.5);
                        break;
                    case 3: // Left
                    default:
                        this.x = -50;
                        this.y = Math.random() * canvas.height;
                        this.vx = Math.random() * 1.5 + 0.5;
                        this.vy = (Math.random() - 0.5) * 2;
                        break;
                }

                this.wobbleOffset = Math.random() * Math.PI * 2;
                this.wobbleTimer = 0;

                // Random vibrant colors (web-dev palette: cyan, purple, green)
                this.color = ['#00f0ff', '#7000ff', '#00ff9f', '#ffffff', '#a78bfa'][Math.floor(Math.random() * 5)];

                // Code snippet to display
                this.snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
                this.opacity = Math.random() * 0.4 + 0.2;

                // Entity state
                this.isCodeSnippet = true;
                this.isBug = false;
                this.isDead = false;

                // Random transformation timer (5-15 seconds)
                this.transformTimer = Math.random() * 10000 + 5000;
                this.spawnTime = Date.now();
            }

            update() {
                // Add slight wobble
                this.wobbleTimer += 0.05;
                this.x += this.vx + Math.sin(this.wobbleTimer + this.wobbleOffset) * 0.3;
                this.y += this.vy + Math.cos(this.wobbleTimer + this.wobbleOffset) * 0.3;

                // Check for random transformation (code -> bug)
                if (this.isCodeSnippet && !this.isBug) {
                    if (Date.now() - this.spawnTime > this.transformTimer) {
                        this.isCodeSnippet = false;
                        this.isBug = true;
                    }
                }
            }

            isOffScreen() {
                return this.x < -100 || this.x > canvas.width + 100 ||
                    this.y < -100 || this.y > canvas.height + 100;
            }

            draw(ctx) {
                ctx.save();
                ctx.translate(this.x, this.y);

                if (this.isCodeSnippet && !this.isBug) {
                    this.drawCodeTag(ctx);
                } else {
                    this.drawBug(ctx);
                }

                ctx.restore();
            }

            drawCodeTag(ctx) {
                // Floating code snippet style
                ctx.globalAlpha = this.opacity;
                ctx.font = 'bold 12px "JetBrains Mono", monospace';
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fillText(this.snippet, 0, 0);
            }

            drawBug(ctx) {
                // Code error / bug style - red squiggly warning
                ctx.strokeStyle = '#ff3333';
                ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ff0000';

                // Warning triangle shape
                const glitchX = (Math.random() - 0.5) * 3;
                const glitchY = (Math.random() - 0.5) * 3;

                ctx.beginPath();
                ctx.moveTo(0 + glitchX, -14 + glitchY);
                ctx.lineTo(14 - glitchX, 10 + glitchY);
                ctx.lineTo(-14 - glitchX, 10 + glitchY);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Exclamation mark
                ctx.fillStyle = '#ff6666';
                ctx.font = 'bold 10px monospace';
                ctx.shadowBlur = 5;
                ctx.fillText('!', -3, 8);

                // Error text floaters
                ctx.fillStyle = '#ff4444';
                ctx.font = 'bold 9px monospace';
                ctx.shadowBlur = 8;
                if (Math.random() > 0.5) ctx.fillText('ERR', 16, -16);
                if (Math.random() > 0.5) ctx.fillText('null', -22, 14);
                if (Math.random() > 0.5) ctx.fillText('undefined', -20, -22);
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spawn entities randomly
            if (Math.random() < 0.008) {
                entitiesRef.current.push(new Entity());
            }

            // Update and draw entities
            entitiesRef.current = entitiesRef.current.filter(entity => {
                if (entity.isDead) return false;
                entity.update();
                entity.draw(ctx);
                return !entity.isOffScreen();
            });

            // Update particles
            particlesRef.current = particlesRef.current.filter(particle => {
                particle.update();
                particle.draw(ctx);
                return particle.life > 0;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[8]"
        />
    );
};

export default DualWorldOverlay;
