import { useEffect, useRef } from 'react';

const COLORS = ['#10b981', '#34d399', '#6366f1', '#6ee7b7', '#818cf8'];
const PIXEL_COUNT = 60;
const MOUSE_RADIUS = 150;

const FloatingPixels = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const pixelsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initPixels();
        };

        function initPixels() {
            pixelsRef.current = Array.from({ length: PIXEL_COUNT }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                baseX: 0,
                baseY: 0,
                size: Math.random() * 3 + 3,         // 3–6px
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                phase: Math.random() * Math.PI * 2,  // wobble offset
                wobble: Math.random() * 0.5 + 0.2,   // wobble amplitude
                opacity: Math.random() * 0.4 + 0.3,
            }));
            // store base position after init
            pixelsRef.current.forEach(p => { p.baseX = p.x; p.baseY = p.y; });
        }

        resize();
        window.addEventListener('resize', resize);

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Pixel grid (1px lines every 32px)
            ctx.strokeStyle = 'rgba(16,185,129,0.04)';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += 32) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += 32) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            const now = Date.now() * 0.001;
            const { x: mx, y: my } = mouseRef.current;

            pixelsRef.current.forEach(p => {
                // Slow drift
                p.x += p.speedX;
                p.y += p.speedY;

                // Sine-wave wobble
                p.x += Math.sin(now + p.phase) * p.wobble;
                p.y += Math.cos(now + p.phase * 1.3) * p.wobble;

                // Wrap around
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.y > canvas.height + 10) p.y = -10;

                // Mouse repulsion
                const dx = p.x - mx;
                const dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    p.x += (dx / dist) * force * 2.5;
                    p.y += (dy / dist) * force * 2.5;
                }

                // Draw pixel
                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

export default FloatingPixels;
