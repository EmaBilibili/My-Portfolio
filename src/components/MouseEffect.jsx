import { useEffect, useRef } from 'react';

const MouseEffect = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const lastScrollY = useRef(0);
    const particlesRef = useRef([]);
    const trailRef = useRef([]);
    const ripplesRef = useRef([]);
    const ambientParticlesRef = useRef([]);

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

        // Particle class
        class Particle {
            constructor(x, y, color = null) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.life = 1;
                this.decay = Math.random() * 0.01 + 0.005;
                this.color = color || (Math.random() > 0.5 ? '#ffffff' : '#a0a0a0');
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                this.size *= 0.98;
            }

            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life * 0.8; // Increased opacity
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 25; // More glow
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2); // Larger particles
                ctx.fill();
                ctx.restore();
            }
        }

        // Ripple class for click effects
        class Ripple {
            constructor(x, y, type = 'gaming') {
                this.x = x;
                this.y = y;
                this.radius = 0;
                this.maxRadius = 300; // Larger ripples
                this.life = 1;
                this.type = type;

                // Grayscale for all interactions
                this.color1 = '#ffffff'; // White
                this.color2 = '#808080'; // Gray
            }

            update() {
                this.radius += 8; // Faster expansion
                this.life = 1 - (this.radius / this.maxRadius);
            }

            draw(ctx) {
                if (this.life <= 0) return;

                ctx.save();
                ctx.globalAlpha = this.life; // Full opacity start

                // Outer ring
                ctx.strokeStyle = this.color1;
                ctx.lineWidth = 4;
                ctx.shadowBlur = 30; // Stronger glow
                ctx.shadowColor = this.color1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.stroke();

                // Inner ring
                ctx.strokeStyle = this.color2;
                ctx.lineWidth = 2;
                ctx.shadowColor = this.color2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }
        }

        // Ambient particle class (constant background)
        class AmbientParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; // Smaller size for depth (0.5px - 2.5px)
                this.speedX = (Math.random() - 0.5) * 0.2; // Slower speed
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.color = Math.random() > 0.5 ? '#ffffff' : '#a0a0a0';
                this.baseOpacity = Math.random() * 0.05 + 0.02; // Very transparent (0.02 - 0.07)
            }

            update(scrollSpeed = 0) {
                this.x += this.speedX;
                this.y += this.speedY + scrollSpeed * 0.5; // Less scroll influence for background feel

                // Wrap around screen
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                // Very subtle pulse
                this.opacity = this.baseOpacity + Math.sin(Date.now() * 0.002 + this.x) * 0.02;
            }

            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                // Removed shadowBlur to make them look further away (less focus)
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize ambient particles - Much fewer
        for (let i = 0; i < 20; i++) {
            ambientParticlesRef.current.push(new AmbientParticle());
        }

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            // Update custom cursor
            const cursor = document.getElementById('tech-cursor');
            if (cursor) {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }

            // Add trail point
            trailRef.current.push({
                x: e.clientX,
                y: e.clientY,
                life: 1
            });

            // Create particles on mouse move (more frequently)
            // Reduced trail frequency
            if (Math.random() > 0.5) {
                trailRef.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    life: 0.8
                });
            }

            // Reduced interaction particles
            if (Math.random() > 0.8) {
                particlesRef.current.push(new Particle(e.clientX, e.clientY));
            }
        };

        // Click handler with context detection
        const handleClick = (e) => {
            const target = e.target;
            let rippleType = 'gaming'; // default - logic preserved but color unified

            // Create ripple
            ripplesRef.current.push(new Ripple(e.clientX, e.clientY, rippleType));

            // Create particle burst
            const burstColor = '#ffffff';
            for (let i = 0; i < 15; i++) {
                particlesRef.current.push(new Particle(e.clientX, e.clientY, burstColor));
            }
        };

        const handleScroll = () => {
            // Just tracking last scroll for delta calculation in loop
            // The actual update happens in the animate loop using the ref
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll); // Mostly used for reading scrollY in loop

        // Animation loop
        const animate = () => {
            // Update scroll tracking
            const currentScrollY = window.scrollY;
            const scrollSpeed = (currentScrollY - lastScrollY.current) * 0.5; // Factor de velocidad

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw and update ambient particles with scroll influence
            ambientParticlesRef.current.forEach(particle => {
                particle.update(scrollSpeed);
                particle.draw(ctx);
            });

            // Update last scroll after processing particles
            lastScrollY.current = currentScrollY;

            // Draw and update trail
            trailRef.current = trailRef.current.filter(point => {
                point.life -= 0.05; // Fade faster
                if (point.life <= 0) return false;

                ctx.save();
                ctx.globalAlpha = point.life * 0.3; // Lower opacity
                const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 25); // Smaller trail
                gradient.addColorStop(0, '#ffffff'); // White trail
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                return true;
            });

            // Subtler Cursor Glow
            const { x, y } = mouseRef.current;
            if (x && y) {
                ctx.save();
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, 100); // Smaller radius
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)'); // White glow
                gradient.addColorStop(0.5, 'rgba(128, 128, 128, 0.05)'); // Gray fade
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, 100, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Update ripples (Complex Multi-Ring)
            ripplesRef.current = ripplesRef.current.filter(ripple => {
                ripple.update();

                if (ripple.life <= 0) return false; // Check life here to avoid drawing dead ripples

                // Draw multiple rings
                ctx.save();
                ctx.globalAlpha = ripple.life;

                // Main Ring
                ctx.strokeStyle = ripple.color1;
                ctx.lineWidth = 4;
                ctx.shadowBlur = 30;
                ctx.shadowColor = ripple.color1;
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.stroke();

                // Secondary Ring (Lagging)
                if (ripple.radius > 20) {
                    ctx.strokeStyle = ripple.color2;
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, ripple.radius * 0.8, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Third Ring (Fast expanding)
                if (ripple.radius > 10) {
                    ctx.strokeStyle = ripple.color1;
                    ctx.lineWidth = 1;
                    ctx.globalAlpha = ripple.life * 0.5;
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, ripple.radius * 1.2, 0, Math.PI * 2);
                    ctx.stroke();
                }

                ctx.restore();

                return ripple.life > 0;
            });

            // Update and draw particles
            particlesRef.current = particlesRef.current.filter(particle => {
                particle.update();
                particle.draw(ctx);
                return particle.life > 0 && particle.size > 0.1;
            });

            // Limit particles
            if (particlesRef.current.length > 200) {
                particlesRef.current = particlesRef.current.slice(-200);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <div id="tech-cursor" className="tech-cursor hidden md:block"></div>
            <div className="scanlines"></div>
            <canvas
                ref={canvasRef}
                // Z-index higher than background, overlay blend mode for visibility over dark bg
                className="fixed inset-0 pointer-events-none z-[50]"
                style={{ mixBlendMode: 'plus-lighter' }} // Makes lights add up and glow
            />
        </>
    );
};

export default MouseEffect;
