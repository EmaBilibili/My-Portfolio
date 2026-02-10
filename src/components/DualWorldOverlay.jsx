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

                this.size = 20;
                this.wobbleOffset = Math.random() * Math.PI * 2;
                this.wobbleTimer = 0;

                // Random vibrant colors
                this.color = ['#ff0000', '#ffb8ae', '#00f0ff', '#ffb847', '#ff00ff', '#00ff9f'][Math.floor(Math.random() * 6)];

                // Entity state
                this.isGhost = true;
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

                // Check for random transformation (ghost -> bug)
                if (this.isGhost && !this.isBug) {
                    if (Date.now() - this.spawnTime > this.transformTimer) {
                        this.isGhost = false;
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

                if (this.isGhost && !this.isBug) {
                    this.drawGhost(ctx);
                } else {
                    this.drawBug(ctx);
                }

                ctx.restore();
            }

            drawGhost(ctx) {
                // Pac-Man Ghost Style
                ctx.fillStyle = this.color;
                ctx.strokeStyle = this.color;

                // Body (Semicircle top)
                ctx.beginPath();
                ctx.arc(0, 0, this.size, Math.PI, 0);
                ctx.lineTo(this.size, this.size);

                // Wavy bottom
                const waveSize = this.size / 3;
                for (let i = 1; i <= 3; i++) {
                    ctx.arc(this.size - (waveSize * (2 * i - 1)), this.size, waveSize, 0, Math.PI, false);
                }
                ctx.lineTo(-this.size, 0);
                ctx.fill();

                // Eyes
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(-this.size / 2.5, -this.size / 4, this.size / 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.size / 2.5, -this.size / 4, this.size / 3, 0, Math.PI * 2);
                ctx.fill();

                // Pupils
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(-this.size / 2.5 + 2, -this.size / 4, this.size / 6, 0, Math.PI * 2);
                ctx.arc(this.size / 2.5 + 2, -this.size / 4, this.size / 6, 0, Math.PI * 2);
                ctx.fill();
            }

            drawBug(ctx) {
                // Glitchy Bug/Virus Style - BRIGHT & VISIBLE
                ctx.strokeStyle = '#ff3333';
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                ctx.lineWidth = 3;
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ff0000';

                // Glitch effect
                const glitchX = (Math.random() - 0.5) * 4;
                const glitchY = (Math.random() - 0.5) * 4;

                ctx.beginPath();
                ctx.moveTo(-12 + glitchX, -12 + glitchY);
                ctx.lineTo(12 - glitchX, -10 + glitchY);
                ctx.lineTo(14 + glitchX, 6 - glitchY);
                ctx.lineTo(0 + glitchX, 14 + glitchY);
                ctx.lineTo(-14 - glitchX, 6 - glitchY);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Legs - brighter
                ctx.strokeStyle = '#ff6666';
                ctx.lineWidth = 2;
                const drawLeg = (sx, sy, ex, ey) => {
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo((sx + ex) / 2 + (Math.random() - 0.5) * 10, (sy + ey) / 2 + (Math.random() - 0.5) * 10);
                    ctx.lineTo(ex, ey);
                    ctx.stroke();
                };

                drawLeg(-12, -6, -30, -18);
                drawLeg(-14, 0, -32, 0);
                drawLeg(-12, 6, -30, 18);
                drawLeg(12, -6, 30, -18);
                drawLeg(14, 0, 32, 0);
                drawLeg(12, 6, 30, 18);

                // Binary floaters - brighter
                ctx.fillStyle = '#ff0000';
                ctx.font = 'bold 10px monospace';
                ctx.shadowBlur = 10;
                if (Math.random() > 0.5) ctx.fillText('1', 18, -18);
                if (Math.random() > 0.5) ctx.fillText('0', -24, 12);
                if (Math.random() > 0.5) ctx.fillText('ERR', -12, -24);
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
