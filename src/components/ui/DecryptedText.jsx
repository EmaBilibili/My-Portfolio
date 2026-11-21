import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_-';

/**
 * Subtle single-pass technical scramble reveal on mount.
 * Automatically bypassed when prefers-reduced-motion is enabled.
 */
export default function DecryptedText({ text, className = '' }) {
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (shouldReduceMotion) return undefined;

    let frame = 0;
    const totalFrames = 14;

    const intervalId = window.setInterval(() => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * text.length);

      if (frame >= totalFrames) {
        setDisplayText(text);
        window.clearInterval(intervalId);
        return;
      }

      const scrambled = text
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '/' || char === '&' || index < revealCount) {
            return char;
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      setDisplayText(scrambled);
    }, 30);

    return () => window.clearInterval(intervalId);
  }, [text, shouldReduceMotion]);

  return <span className={className}>{shouldReduceMotion ? text : displayText}</span>;
}
