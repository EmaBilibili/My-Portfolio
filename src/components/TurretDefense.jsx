import { useEffect, useRef } from 'react';

const BUG_EMOJIS = ['🐛', '🐞', '🦗', '🦟'];
const SPAWN_INTERVAL = 2800;
const FIRE_INTERVAL = 1000;
const BULLET_SPEED = 7;
const BUG_SPEED_MIN = 0.4;
const BUG_SPEED_MAX = 1.2;
const HIT_RADIUS = 18;
const MAX_BUGS = 10;

const TurretDefense = () => {
    const canvasRef = useRef(null);
    const bugsRef = useRef([]);
    const bulletsRef = useRef([]);
    const explosionsRef = useRef([]);
    const turretAngleRef = useRef(-Math.PI / 2);
    const lastFireRef = useRef(0);
    const lastSpawnRef = useRef(0);
    const bugIdRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const spawnBug = () => {
            if (bugsRef.current.length >= MAX_BUGS) return;
            bugsRef.current.push({
                id: bugIdRef.current++,
                x: Math.random() * (canvas.width - 80) + 40,
                y: -20,
                speed: Math.random() * (BUG_SPEED_MAX - BUG_SPEED_MIN) + BUG_SPEED_MIN,
                emoji: BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)],
                fontSize: Math.floor(Math.random() * 6) + 12,
                wobble: Math.random() * Math.PI * 2,
                wobbleAmp: Math.random() * 0.8 + 0.2,
            });
        };

        const animate = () => {
            const now = Date.now();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spawn
            if (now - lastSpawnRef.current > SPAWN_INTERVAL) {
                spawnBug();
                lastSpawnRef.current = now;
            }

            const tx = canvas.width / 2;
            const ty = canvas.height - 50;

            // Update bugs
            bugsRef.current = bugsRef.current.filter(bug => {
                bug.y += bug.speed;
                bug.wobble += 0.02;
                bug.x += Math.sin(bug.wobble) * bug.wobbleAmp;
                return bug.y < canvas.height + 30;
            });

            // Find nearest bug
            let target = null;
            let minDist = Infinity;
            bugsRef.current.forEach(bug => {
                const dx = bug.x - tx;
                const dy = bug.y - ty;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    minDist = dist;
                    target = bug;
                }
            });

            // Rotate turret
            if (target) {
                const targetAngle = Math.atan2(target.y - ty, target.x - tx);
                let diff = targetAngle - turretAngleRef.current;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                turretAngleRef.current += diff * 0.12;

                // Fire
                if (now - lastFireRef.current > FIRE_INTERVAL) {
                    const angle = turretAngleRef.current;
                    bulletsRef.current.push({
                        x: tx + Math.cos(angle) * 28,
                        y: ty + Math.sin(angle) * 28,
                        vx: Math.cos(angle) * BULLET_SPEED,
                        vy: Math.sin(angle) * BULLET_SPEED,
                    });
                    lastFireRef.current = now;
                }
            }

            // Update bullets + collision
            bulletsRef.current = bulletsRef.current.filter(bullet => {
                bullet.x += bullet.vx;
                bullet.y += bullet.vy;

                let hit = false;
                bugsRef.current = bugsRef.current.filter(bug => {
                    if (hit) return true;
                    const dx = bullet.x - bug.x;
                    const dy = bullet.y - bug.y;
                    if (Math.sqrt(dx * dx + dy * dy) < HIT_RADIUS) {
                        hit = true;
                        explosionsRef.current.push({
                            x: bug.x,
                            y: bug.y,
                            radius: 0,
                            maxRadius: 35,
                            life: 1,
                        });
                        return false;
                    }
                    return true;
                });
                if (hit) return false;

                return (
                    bullet.x > -20 && bullet.x < canvas.width + 20 &&
                    bullet.y > -20 && bullet.y < canvas.height + 20
                );
            });

            // Update explosions
            explosionsRef.current = explosionsRef.current.filter(exp => {
                exp.radius += 2;
                exp.life = 1 - exp.radius / exp.maxRadius;
                return exp.life > 0;
            });

            // ── DRAW ──

            // Bugs
            bugsRef.current.forEach(bug => {
                ctx.save();
                ctx.globalAlpha = 0.75;
                ctx.font = `${bug.fontSize}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(bug.emoji, bug.x, bug.y);
                ctx.restore();
            });

            // Bullets
            bulletsRef.current.forEach(bullet => {
                ctx.save();
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = '#10b981';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#10b981';
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Explosions
            explosionsRef.current.forEach(exp => {
                ctx.save();
                ctx.globalAlpha = exp.life * 0.7;
                ctx.strokeStyle = '#34d399';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 14;
                ctx.shadowColor = '#34d399';
                ctx.beginPath();
                ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
                ctx.stroke();

                ctx.globalAlpha = exp.life * 0.4;
                ctx.strokeStyle = '#6366f1';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(exp.x, exp.y, exp.radius * 0.55, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            });

            // Turret base
            ctx.save();
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = '#111827';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#10b981';
            ctx.beginPath();
            ctx.arc(tx, ty, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Inner ring
            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(tx, ty, 9, 0, Math.PI * 2);
            ctx.stroke();

            // Barrel
            ctx.globalAlpha = 0.9;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#10b981';
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(
                tx + Math.cos(turretAngleRef.current) * 28,
                ty + Math.sin(turretAngleRef.current) * 28
            );
            ctx.stroke();
            ctx.restore();

            animId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[2]"
        />
    );
};

export default TurretDefense;
