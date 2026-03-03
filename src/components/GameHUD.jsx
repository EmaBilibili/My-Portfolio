import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

const GameHUD = () => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [stars, setStars] = useState([]);
    const animRef = useRef(null);
    const scoreRef = useRef(0);
    const lastScoreTime = useRef(Date.now());
    const lastLevelTime = useRef(Date.now());

    useEffect(() => {
        // Spawn floating stars periodically
        const spawnStar = () => {
            setStars(prev => [
                ...prev.slice(-8), // keep max 8 stars
                {
                    id: Date.now(),
                    x: Math.random() * 120 - 20,
                    y: Math.random() * 60,
                    size: Math.random() * 8 + 6,
                    color: ['#10b981', '#34d399', '#6366f1'][Math.floor(Math.random() * 3)],
                    captured: false,
                }
            ]);
        };

        const starInterval = setInterval(spawnStar, 1800);

        // Score ticker
        const tick = () => {
            const now = Date.now();

            // Increment score every 500ms
            if (now - lastScoreTime.current > 500) {
                scoreRef.current += Math.floor(Math.random() * 3) + 1;
                setScore(scoreRef.current);
                lastScoreTime.current = now;
            }

            // Level up every 30s
            if (now - lastLevelTime.current > 30000) {
                setLevel(prev => Math.min(prev + 1, 99));
                lastLevelTime.current = now;
            }

            animRef.current = requestAnimationFrame(tick);
        };

        animRef.current = requestAnimationFrame(tick);

        return () => {
            clearInterval(starInterval);
            cancelAnimationFrame(animRef.current);
        };
    }, []);

    // Capture a star when clicked
    const capturestar = (id) => {
        setStars(prev => prev.filter(s => s.id !== id));
        scoreRef.current += 10;
        setScore(scoreRef.current);
    };

    return (
        <div className="fixed top-20 right-4 z-[60] select-none pointer-events-none">
            {/* HUD Panel */}
            <div className="bg-black/70 backdrop-blur-md border border-primary/30 rounded-none px-4 py-3 w-36 font-mono pointer-events-auto"
                style={{
                    boxShadow: '2px 0 0 0 #10b981, -2px 0 0 0 #10b981, 0 2px 0 0 #10b981, 0 -2px 0 0 #10b981, 0 0 15px rgba(16,185,129,0.2), inset 0 0 15px rgba(16,185,129,0.05)',
                }}>

                {/* Score */}
                <div className="mb-2">
                    <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }} className="text-primary/60 uppercase mb-1">Score</p>
                    <p style={{ fontFamily: "'Press Start 2P', monospace" }} className="text-sm text-primary leading-none tabular-nums">
                        {String(score).padStart(6, '0')}
                    </p>
                </div>

                {/* Level */}
                <div className="mb-2 border-t border-white/5 pt-2">
                    <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }} className="text-secondary/60 uppercase mb-1">LVL</p>
                    <p style={{ fontFamily: "'Press Start 2P', monospace" }} className="text-sm text-secondary leading-none">
                        {String(level).padStart(2, '0')}
                    </p>
                </div>

                {/* Stars indicator */}
                <div className="border-t border-white/5 pt-2 flex gap-1 flex-wrap">
                    {[...Array(Math.min(stars.length, 5))].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-accent fill-accent" />
                    ))}
                </div>
            </div>

            {/* Floating stars (pointer-events-auto so they can be clicked) */}
            <div className="relative mt-2 h-20 w-36 pointer-events-auto">
                {stars.map(star => (
                    <button
                        key={star.id}
                        onClick={() => capturestar(star.id)}
                        className="absolute animate-bounce cursor-pointer hover:scale-150 transition-transform duration-150"
                        style={{
                            left: `${star.x}px`,
                            top: `${star.y}px`,
                            color: star.color,
                            filter: `drop-shadow(0 0 4px ${star.color})`,
                            animationDuration: `${Math.random() * 1 + 1.5}s`,
                        }}
                    >
                        <Star style={{ width: star.size, height: star.size }} fill={star.color} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameHUD;
