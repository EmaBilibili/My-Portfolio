import { useEffect, useRef, useState } from 'react';
import { Bug } from 'lucide-react';
import { entitiesRef, particlesRef } from './gameState';

const TurretDefense = () => {
    const canvasRef = useRef(null);
    const [killCount, setKillCount] = useState(0);
    const turretRef = useRef({
        x: 0,
        y: 100, // Below navbar, more visible
        angle: Math.PI / 2, // Pointing down initially
        targetAngle: Math.PI / 2,
        lastShot: 0,
        cooldown: 2000, // 2 seconds between shots
        currentTarget: null,
        lockOnStart: 0, // NEW: Timestamp when current target was acquired
        laserActive: false,
        laserEndTime: 0
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            turretRef.current.x = canvas.width / 2;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const turret = turretRef.current;
            const now = Date.now();

            // Find closest bug
            let closestBug = null;
            let closestDistance = Infinity;

            for (const entity of entitiesRef.current) {
                if (entity.isBug && !entity.isDead) {
                    const dx = entity.x - turret.x;
                    const dy = entity.y - turret.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestBug = entity;
                    }
                }
            }

            // Target Switching & Lock-on Logic
            if (closestBug !== turret.currentTarget) {
                turret.currentTarget = closestBug;
                turret.lockOnStart = now; // Reset lock-on timer for new target
            }

            // Calculate target angle
            if (closestBug) {
                const dx = closestBug.x - turret.x;
                const dy = closestBug.y - turret.y;
                turret.targetAngle = Math.atan2(dy, dx);
            }

            // Smooth rotation toward target
            let angleDiff = turret.targetAngle - turret.angle;
            // Normalize angle difference
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            turret.angle += angleDiff * 0.08; // Smooth tracking

            // Shooting logic
            // MUST be locked on for > 2000ms AND cooldown ready
            if (closestBug &&
                (now - turret.lockOnStart > 2000) &&
                (now - turret.lastShot > turret.cooldown)) {
                // Fire!
                turret.laserActive = true;
                turret.laserEndTime = now + 200; // Laser visible for 200ms
                turret.lastShot = now;

                // Kill the bug
                closestBug.isDead = true;

                // Create explosion particles
                for (let i = 0; i < 15; i++) {
                    particlesRef.current.push({
                        x: closestBug.x,
                        y: closestBug.y,
                        color: '#ff0000',
                        size: Math.random() * 4 + 2,
                        speedX: (Math.random() - 0.5) * 10,
                        speedY: (Math.random() - 0.5) * 10,
                        life: 1.0,
                        decay: Math.random() * 0.05 + 0.03,
                        update() {
                            this.x += this.speedX;
                            this.y += this.speedY;
                            this.life -= this.decay;
                            this.size *= 0.95;
                        },
                        draw(ctx) {
                            ctx.save();
                            ctx.globalAlpha = this.life;
                            ctx.fillStyle = this.color;
                            ctx.beginPath();
                            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.restore();
                        }
                    });
                }

                // Increment kill count
                setKillCount(prev => prev + 1);
            }

            // Check if laser should still be visible
            if (now > turret.laserEndTime) {
                turret.laserActive = false;
            }

            // Draw laser if active
            if (turret.laserActive && closestBug) {
                ctx.save();
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 3;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ff0000';
                ctx.globalAlpha = 0.8;

                ctx.beginPath();
                ctx.moveTo(turret.x, turret.y);
                ctx.lineTo(closestBug.x, closestBug.y);
                ctx.stroke();

                // Inner bright line
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(turret.x, turret.y);
                ctx.lineTo(closestBug.x, closestBug.y);
                ctx.stroke();

                ctx.restore();
            }

            // Draw turret
            ctx.save();
            ctx.translate(turret.x, turret.y);

            // Outer glow ring
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00f0ff';
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
            ctx.stroke();

            // Base circle
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#0a0a1a';
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Barrel (rotates)
            ctx.rotate(turret.angle);
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f0ff';
            ctx.fillRect(0, -5, 35, 10);

            // Barrel tip glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(35, 0, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            {/* Kill Counter UI - positioned top-left to not block content */}
            <div className="fixed top-20 left-4 z-[60] flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-500/30">
                <Bug className="w-4 h-4 text-red-500" />
                <span className="text-red-500 font-mono font-bold">{killCount}</span>
            </div>

            {/* Turret Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-[9]"
            />
        </>
    );
};

export default TurretDefense;
