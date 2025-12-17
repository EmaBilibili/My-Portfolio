import { useEffect, useRef } from 'react';

const CyberGrid = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let mouseX = 0;
        let mouseY = 0;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Track mouse position
        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Grid settings
        const gridSize = 50;
        const maxDistance = 200;

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw interactive grid
            for (let x = 0; x < canvas.width; x += gridSize) {
                for (let y = 0; y < canvas.height; y += gridSize) {
                    const dx = mouseX - x;
                    const dy = mouseY - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = 1 - distance / maxDistance;
                        const offset = (1 - distance / maxDistance) * 10;

                        ctx.save();
                        ctx.globalAlpha = opacity * 0.5;
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1;

                        // Draw cross at grid point
                        ctx.beginPath();
                        ctx.moveTo(x - offset, y);
                        ctx.lineTo(x + offset, y);
                        ctx.moveTo(x, y - offset);
                        ctx.lineTo(x, y + offset);
                        ctx.stroke();

                        // Draw connecting lines to nearby points
                        if (x + gridSize < canvas.width && distance < maxDistance / 2) {
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(x + gridSize, y);
                            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                            ctx.stroke();
                        }

                        ctx.restore();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 opacity-20"
        />
    );
};

export default CyberGrid;
