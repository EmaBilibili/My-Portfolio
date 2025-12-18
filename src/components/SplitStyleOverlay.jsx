const SplitStyleOverlay = () => {
    return (
        <div
            className="fixed top-0 right-0 w-1/2 h-full z-[40] pointer-events-none hidden md:block"
            style={{
                backdropFilter: 'grayscale(100%) contrast(1.2) brightness(0.9)',
                WebkitBackdropFilter: 'grayscale(100%) contrast(1.2) brightness(0.9)',
                mixBlendMode: 'normal'
            }}
        >
            {/* Optional: subtle green tint overlay for "Hacker" feel */}
            <div className="absolute inset-0 bg-green-500/5 mix-blend-overlay"></div>
        </div>
    );
};

export default SplitStyleOverlay;
