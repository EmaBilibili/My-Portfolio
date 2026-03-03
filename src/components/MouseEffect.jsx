import { useEffect, useRef } from 'react';

const MouseEffect = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const lastScrollY = useRef(0);
    const particlesRef = useRef([]);
    const trailRef = useRef([]);
    const ripplesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor(x, y, color = null) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.life = 1;
                this.decay = Math.random() * 0.01 + 0.005;
                this.color = color || (Math.random() > 0.5 ? '#10b981' : '#34d399');
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                this.size *= 0.98;
            }

            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life * 0.8;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 20;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        class Ripple {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 0;
                this.maxRadius = 250;
                this.life = 1;
                this.color1 = '#10b981';
                this.color2 = '#34d399';
            }

            update() {
                this.radius += 7;
                this.life = 1 - (this.radius / this.maxRadius);
            }

            draw(ctx) {
                if (this.life <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.life;

                ctx.strokeStyle = this.color1;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 20;
                ctx.shadowColor = this.color1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.stroke();

                ctx.strokeStyle = this.color2;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = this.color2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }
        }

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            trailRef.current.push({ x: e.clientX, y: e.clientY, life: 1 });

            if (Math.random() > 0.7) {
                particlesRef.current.push(new Particle(e.clientX, e.clientY));
            }
        };

        const handleClick = (e) => {
            ripplesRef.current.push(new Ripple(e.clientX, e.clientY));
            const burstColor = Math.random() > 0.5 ? '#10b981' : '#34d399';
            for (let i = 0; i < 12; i++) {
                particlesRef.current.push(new Particle(e.clientX, e.clientY, burstColor));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        const animate = () => {
            const currentScrollY = window.scrollY;
            lastScrollY.current = currentScrollY;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Trail
            trailRef.current = trailRef.current.filter(point => {
                point.life -= 0.06;
                if (point.life <= 0) return false;

                ctx.save();
                ctx.globalAlpha = point.life * 0.25;
                const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 20);
                gradient.addColorStop(0, '#10b981');
                gradient.addColorStop(0.5, '#34d399');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                return true;
            });

            // Cursor glow
            const { x, y } = mouseRef.current;
            if (x && y) {
                ctx.save();
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, 90);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
                gradient.addColorStop(0.5, 'rgba(52, 211, 153, 0.05)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, 90, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Ripples
            ripplesRef.current = ripplesRef.current.filter(ripple => {
                ripple.update();
                if (ripple.life <= 0) return false;
                ripple.draw(ctx);
                return ripple.life > 0;
            });

            // Particles
            particlesRef.current = particlesRef.current.filter(particle => {
                particle.update();
                particle.draw(ctx);
                return particle.life > 0 && particle.size > 0.1;
            });

            if (particlesRef.current.length > 150) {
                particlesRef.current = particlesRef.current.slice(-150);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[50]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default MouseEffect;
