import { useEffect, useRef } from 'react';

const DualWorldOverlay = () => {
    const canvasRef = useRef(null);
    const entitiesRef = useRef([]);
    const particlesRef = useRef([]); // For explosions

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
                this.y = Math.random() * (canvas.height - 50) + 25; // Random height, keep away from very edges
                this.x = -50; // Start off-screen left
                this.speed = Math.random() * 1.5 + 0.5; // Random speed
                this.size = 20;
                this.wobbleOffset = Math.random() * Math.PI * 2;
                // Random vibrant colors for Gamer side: Red, Pink, Cyan, Orange
                this.color = ['#ff0000', '#ffb8ae', '#00f0ff', '#ffb847'][Math.floor(Math.random() * 4)];
            }

            update() {
                this.x += this.speed;
                // Add slight wobble to ghosts
                this.y += Math.sin(this.x * 0.05 + this.wobbleOffset) * 0.5;
            }

            draw(ctx) {
                const centerX = canvas.width / 2;
                const transitionZone = 100; // Width of transition area (pixels)
                const distanceFromCenter = this.x - centerX;

                // Calculate transition progress (0 = pure ghost, 1 = pure bug)
                const transitionProgress = Math.max(0, Math.min(1, (distanceFromCenter + transitionZone / 2) / transitionZone));

                ctx.save();
                ctx.translate(this.x, this.y);

                // Draw Ghost (fades out as we approach/cross center)
                ctx.save();
                ctx.globalAlpha = 1 - transitionProgress;
                this.drawGhost(ctx);
                ctx.restore();

                // Draw Bug (fades in as we cross center)
                ctx.save();
                ctx.globalAlpha = transitionProgress;
                // Add slight scale effect during transition for visual interest
                const scaleFactor = 0.95 + transitionProgress * 0.05;
                ctx.scale(scaleFactor, scaleFactor);
                this.drawBug(ctx);
                ctx.restore();

                ctx.restore();
            }

            drawGhost(ctx) {
                // Pac-Man Ghost Style
                ctx.fillStyle = this.color; // Use random color
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
                // Left Eye
                ctx.beginPath();
                ctx.arc(-this.size / 2.5, -this.size / 4, this.size / 3, 0, Math.PI * 2);
                ctx.fill();
                // Right Eye
                ctx.beginPath();
                ctx.arc(this.size / 2.5, -this.size / 4, this.size / 3, 0, Math.PI * 2);
                ctx.fill();

                // Pupils (looking right)
                ctx.fillStyle = '#000000'; // Blue pupils
                ctx.beginPath();
                ctx.arc(-this.size / 2.5 + 2, -this.size / 4, this.size / 6, 0, Math.PI * 2);
                ctx.arc(this.size / 2.5 + 2, -this.size / 4, this.size / 6, 0, Math.PI * 2);
                ctx.fill();
            }

            drawBug(ctx) {
                // Glitchy Bug/Virus Style
                ctx.strokeStyle = '#ffffff'; // White/Gray wireframe (will be filtered)
                ctx.lineWidth = 2;
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#00ff9f'; // Green glow before filter (will turn gray/greenish)

                // Glitch effect: Randomly shift drawing slightly
                const glitchX = (Math.random() - 0.5) * 4;
                const glitchY = (Math.random() - 0.5) * 4;

                ctx.beginPath();
                // Central irregualar body
                ctx.moveTo(-10 + glitchX, -10 + glitchY);
                ctx.lineTo(10 - glitchX, -8 + glitchY);
                ctx.lineTo(12 + glitchX, 5 - glitchY);
                ctx.lineTo(0 + glitchX, 12 + glitchY);
                ctx.lineTo(-12 - glitchX, 5 - glitchY);
                ctx.closePath();
                ctx.stroke();

                // Legs (Jagged)
                const drawLeg = (sx, sy, ex, ey) => {
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo((sx + ex) / 2 + (Math.random() - 0.5) * 10, (sy + ey) / 2 + (Math.random() - 0.5) * 10); // Knee
                    ctx.lineTo(ex, ey);
                    ctx.stroke();
                };

                // 3 Legs per side
                drawLeg(-10, -5, -25, -15);
                drawLeg(-12, 0, -28, 0);
                drawLeg(-10, 5, -25, 15);

                drawLeg(10, -5, 25, -15);
                drawLeg(12, 0, 28, 0);
                drawLeg(10, 5, 25, 15);

                // Code/Binary floaters (Particles around bug)
                ctx.fillStyle = '#00ff9f'; // Green text
                ctx.font = '8px monospace';
                if (Math.random() > 0.7) ctx.fillText('1', 15, -15);
                if (Math.random() > 0.7) ctx.fillText('0', -20, 10);
                if (Math.random() > 0.7) ctx.fillText('ERR', -10, -20);
            }
        }

        // Handle Click for Explosions
        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check if any entity was clicked
            for (let i = entitiesRef.current.length - 1; i >= 0; i--) {
                const entity = entitiesRef.current[i];
                const dx = mouseX - entity.x;
                const dy = mouseY - entity.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Hitbox radius (slightly larger than size for easier clicking)
                if (distance < entity.size * 2) {
                    // Create Explosion
                    const isGhost = entity.x < canvas.width / 2;
                    const burstColor = isGhost ? entity.color : '#00ff9f'; // Ghost color or Hacker Green

                    for (let j = 0; j < 20; j++) {
                        particlesRef.current.push(new Particle(entity.x, entity.y, burstColor));
                    }

                    // Remove entity
                    entitiesRef.current.splice(i, 1);
                    break; // Only explode one per click
                }
            }
        };

        window.addEventListener('click', handleClick);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Divider Line (Subtle)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 15]); // Dashed line
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]); // Reset

            // Spawn entities (Reduced density as requested)
            if (Math.random() < 0.006) { // Reduced from 0.02
                entitiesRef.current.push(new Entity());
            }

            // Update and draw entities
            entitiesRef.current = entitiesRef.current.filter(entity => {
                entity.update();
                entity.draw(ctx);
                return entity.x < canvas.width + 50; // Keep until fully off screen
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
            window.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[15]" // Higher z-index to float ABOVE content
        />
    );
};

export default DualWorldOverlay;
