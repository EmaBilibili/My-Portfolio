import { useEffect, useRef } from 'react';

const SCALE = 3;
const SPAWN_INTERVAL = 2800;
const FIRE_INTERVAL = 900;
const BULLET_SPEED = 7;
const BUG_SPEED_MIN = 0.4;
const BUG_SPEED_MAX = 1.2;
const HIT_RADIUS = 16;
const MAX_BUGS = 10;

// We will track the turret position dynamically inside the hook

// Space Invader sprite — 11×8, 2 animation frames
const INVADER_FRAMES = [
    [
        [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    ],
    [
        [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    ],
];

// Ghost sprite — 8×8
const GHOST_SPRITE = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

// Turret base — 10×6
const TURRET_BASE = [
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Pixel digits for "404" — 3×5 each
const DIGIT_4 = [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
];
const DIGIT_0 = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
];

function drawSprite(ctx, sprite, cx, cy, color, scale = SCALE) {
    const rows = sprite.length;
    const cols = sprite[0].length;
    const ox = cx - (cols * scale) / 2;
    const oy = cy - (rows * scale) / 2;
    ctx.fillStyle = color;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (sprite[r][c]) {
                ctx.fillRect(ox + c * scale, oy + r * scale, scale, scale);
            }
        }
    }
}

function draw404(ctx, cx, cy, color) {
    const scale = 2;
    const digitW = 3 * scale;
    const gap = 2;
    const totalW = digitW * 3 + gap * 2;
    const startX = Math.round(cx - totalW / 2);
    const startY = Math.round(cy - (5 * scale) / 2);
    ctx.fillStyle = color;
    [DIGIT_4, DIGIT_0, DIGIT_4].forEach((digit, di) => {
        const ox = startX + di * (digitW + gap);
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 3; c++) {
                if (digit[r][c]) {
                    ctx.fillRect(ox + c * scale, startY + r * scale, scale, scale);
                }
            }
        }
    });
}

const BUG_TYPES = ['INVADER', 'GHOST', 'ERROR'];

const TurretDefense = () => {
    const canvasRef = useRef(null);
    const bugsRef = useRef([]);
    const bulletsRef = useRef([]);
    const explosionsRef = useRef([]);
    const turretAngleRef = useRef(Math.PI / 4); // start pointing down-right
    const lastFireRef = useRef(0);
    const lastSpawnRef = useRef(0);
    const bugIdRef = useRef(0);
    const frameRef = useRef(0);

    const turretPosRef = useRef({ x: 210, y: 40 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animId;

        const updatePosition = () => {
            const anchor = document.getElementById('turret-anchor');
            if (anchor) {
                const rect = anchor.getBoundingClientRect();
                // Draw exactly in the center of the anchor div
                turretPosRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            } else {
                // Fallback to logo position if anchor isn't found
                const logo = document.getElementById('navbar-logo');
                if (logo) {
                    const rect = logo.getBoundingClientRect();
                    turretPosRef.current = { x: rect.right + 40, y: rect.top + rect.height / 2 };
                } else {
                    turretPosRef.current = { x: 210, y: 40 };
                }
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            updatePosition();
        };
        resize();
        window.addEventListener('resize', resize);

        const spawnBug = () => {
            if (bugsRef.current.length >= MAX_BUGS) return;
            const type = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];
            const minX = canvas.width * 0.2;
            bugsRef.current.push({
                id: bugIdRef.current++,
                x: Math.random() * (canvas.width - minX - 40) + minX,
                y: -20,
                speed: Math.random() * (BUG_SPEED_MAX - BUG_SPEED_MIN) + BUG_SPEED_MIN,
                type,
                wobble: Math.random() * Math.PI * 2,
                wobbleAmp: Math.random() * 0.8 + 0.2,
                animFrame: 0,
            });
        };

        const animate = () => {
            const now = Date.now();
            frameRef.current++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (frameRef.current % 60 === 0) {
                // Update position periodically in case of layout shifts
                const anchor = document.getElementById('turret-anchor');
                if (anchor) {
                    const rect = anchor.getBoundingClientRect();
                    turretPosRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                }
            }

            // Spawn
            if (now - lastSpawnRef.current > SPAWN_INTERVAL) {
                spawnBug();
                lastSpawnRef.current = now;
            }

            // Update bugs
            bugsRef.current = bugsRef.current.filter(bug => {
                bug.y += bug.speed;
                bug.wobble += 0.02;
                bug.x += Math.sin(bug.wobble) * bug.wobbleAmp;
                if (frameRef.current % 30 === 0) bug.animFrame = 1 - bug.animFrame;
                return bug.y < canvas.height + 30;
            });

            const TX = turretPosRef.current.x;
            const TY = turretPosRef.current.y;

            // Find nearest bug to turret
            let target = null;
            let minDist = Infinity;
            bugsRef.current.forEach(bug => {
                const dx = bug.x - TX;
                const dy = bug.y - TY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    minDist = dist;
                    target = bug;
                }
            });

            // Rotate turret toward target
            if (target) {
                const targetAngle = Math.atan2(target.y - TY, target.x - TX);
                let diff = targetAngle - turretAngleRef.current;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                turretAngleRef.current += diff * 0.10;

                // Fire
                if (now - lastFireRef.current > FIRE_INTERVAL) {
                    const angle = turretAngleRef.current;
                    bulletsRef.current.push({
                        x: TX + Math.cos(angle) * 20,
                        y: TY + Math.sin(angle) * 20,
                        vx: Math.cos(angle) * BULLET_SPEED,
                        vy: Math.sin(angle) * BULLET_SPEED,
                        angle,
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
                        const particles = [];
                        for (let i = 0; i < 12; i++) {
                            const a = (i / 12) * Math.PI * 2;
                            const speed = Math.random() * 2 + 1;
                            particles.push({
                                x: bug.x,
                                y: bug.y,
                                vx: Math.cos(a) * speed,
                                vy: Math.sin(a) * speed,
                            });
                        }
                        explosionsRef.current.push({ x: bug.x, y: bug.y, particles, life: 1 });
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
                exp.life -= 0.05;
                exp.particles.forEach(p => { p.x += p.vx; p.y += p.vy; });
                return exp.life > 0;
            });

            // ── DRAW ──

            // Bugs
            bugsRef.current.forEach(bug => {
                ctx.save();
                ctx.globalAlpha = 0.85;
                if (bug.type === 'INVADER') {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#ef4444';
                    drawSprite(ctx, INVADER_FRAMES[bug.animFrame], bug.x, bug.y, '#ef4444');
                } else if (bug.type === 'GHOST') {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#6366f1';
                    drawSprite(ctx, GHOST_SPRITE, bug.x, bug.y, '#6366f1');
                } else {
                    // ERROR "404" — blink effect
                    const blink = Math.sin(now * 0.005) > 0;
                    ctx.shadowBlur = blink ? 12 : 4;
                    ctx.shadowColor = '#f59e0b';
                    draw404(ctx, bug.x, bug.y, '#f59e0b');
                }
                ctx.restore();
            });

            // Bullets — pixel rect rotated along travel direction
            bulletsRef.current.forEach(bullet => {
                ctx.save();
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = '#10b981';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#10b981';
                ctx.translate(bullet.x, bullet.y);
                ctx.rotate(bullet.angle);
                ctx.fillRect(-3, -1, 6, 2);
                ctx.restore();
            });

            // Explosions — scattered pixel art particles
            explosionsRef.current.forEach(exp => {
                ctx.save();
                exp.particles.forEach(p => {
                    ctx.globalAlpha = exp.life * 0.8;
                    ctx.fillStyle = exp.life > 0.5 ? '#10b981' : '#34d399';
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = '#10b981';
                    ctx.fillRect(Math.round(p.x), Math.round(p.y), 3, 3);
                });
                ctx.restore();
            });

            // ── TURRET ──
            ctx.save();
            ctx.globalAlpha = 0.9;

            // Turret base — shadow outline
            ctx.shadowBlur = 0;
            drawSprite(ctx, TURRET_BASE, TX + 1, TY + 1, '#064e3b');

            // Turret base — main color with glow
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#10b981';
            drawSprite(ctx, TURRET_BASE, TX, TY, '#10b981');

            // Barrel — series of 3×3 fillRect along angle (5 steps)
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#10b981';
            ctx.fillStyle = '#10b981';
            const angle = turretAngleRef.current;
            for (let i = 2; i <= 7; i++) {
                const bx = TX + Math.cos(angle) * (i * 3);
                const by = TY + Math.sin(angle) * (i * 3);
                ctx.fillRect(Math.round(bx) - 1, Math.round(by) - 1, 3, 3);
            }

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
            className="fixed inset-0 pointer-events-none z-[55]"
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

export default TurretDefense;
