import React, { useState, useCallback, useRef } from 'react';

// ─── Particle Factory ─────────────────────────────────────────────────────────
// Generates mixed heart + sparkle particles — pure CSS/SVG, zero emoji.
function createParticles(count) {
  const particles = [];
  const now = Date.now();

  // Romantic palette: purple, deep pink, soft red, warm cream/gold
  const heartColors  = ['#6B21A8', '#9333EA', '#C026D3', '#E11D48', '#BE185D', '#F9A8D4'];
  const sparkleColors = ['#DDD6FE', '#F0ABFC', '#FBCFE8', '#FDE68A', '#C4B5FD'];

  for (let i = 0; i < count; i++) {
    // Distribute evenly around 360°, with slight jitter so it looks organic
    const baseAngle = (i / count) * 360;
    const angle     = baseAngle + (Math.random() * 28 - 14);
    const rad       = (angle * Math.PI) / 180;
    const distance  = 80 + Math.random() * 170;

    const dx = Math.cos(rad) * distance;
    // Bias slightly upward to give the classic "float away" feel
    const dy = Math.sin(rad) * distance - (24 + Math.random() * 64);

    // Alternate: every 3rd particle is a sparkle, rest are hearts
    const type = i % 3 === 0 ? 'sparkle' : 'heart';
    const size = type === 'heart'
      ? 14 + Math.random() * 14   // hearts: 14–28 px
      : 8  + Math.random() * 10;  // sparkles: 8–18 px

    particles.push({
      id:       `${now}-${i}`,
      type,
      size,
      color: type === 'heart'
        ? heartColors  [Math.floor(Math.random() * heartColors.length)]
        : sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
      dx:       `${dx}px`,
      dy:       `${dy}px`,
      rotation: `${Math.random() * 70 - 35}deg`,
      delay:    `${(Math.random() * 0.12).toFixed(3)}s`,
      duration: `${(1.4 + Math.random() * 0.8).toFixed(3)}s`,
    });
  }
  return particles;
}

// ─── SVG Heart ────────────────────────────────────────────────────────────────
function HeartSVG({ size, color }) {
  return (
    <svg
      viewBox="0 0 32 29"
      width={size}
      height={size}
      fill={color}
      style={{ display: 'block', filter: `drop-shadow(0 1px 3px ${color}88)` }}
    >
      <path d="M16 28.5C16 28.5 1 18 1 9.5C1 5.36 4.36 2 8.5 2C11.24 2 13.64 3.49 15 5.67C16.36 3.49 18.76 2 21.5 2C25.64 2 29 5.36 29 9.5C29 18 16 28.5 16 28.5Z" />
    </svg>
  );
}

// ─── SVG 4-Point Sparkle ──────────────────────────────────────────────────────
function SparkleSVG({ size, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      style={{ display: 'block', filter: `drop-shadow(0 0 4px ${color})` }}
    >
      <path d="M12 2C12 2 12.9 7.8 14.5 9.5C16.2 11.2 22 12 22 12C22 12 16.2 12.8 14.5 14.5C12.9 16.2 12 22 12 22C12 22 11.1 16.2 9.5 14.5C7.8 12.8 2 12 2 12C2 12 7.8 11.2 9.5 9.5C11.1 7.8 12 2 12 2Z" />
    </svg>
  );
}

// ─── Single Particle ──────────────────────────────────────────────────────────
function Particle({ p }) {
  return (
    <div
      className="af-particle"
      style={{
        '--dx':  p.dx,
        '--dy':  p.dy,
        '--rot': p.rotation,
        animationDelay:    p.delay,
        animationDuration: p.duration,
      }}
    >
      {p.type === 'heart'
        ? <HeartSVG    size={p.size} color={p.color} />
        : <SparkleSVG  size={p.size} color={p.color} />
      }
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CenterText() {
  const [particles,   setParticles]   = useState([]);
  const [isSparkling, setIsSparkling] = useState(false);
  const cleanupRef = useRef(null);

  const handleClick = useCallback(() => {
    // Screen shimmer
    setIsSparkling(true);
    setTimeout(() => setIsSparkling(false), 800);

    // 30 particles: 20 hearts + 10 sparkles
    const batch = createParticles(30);
    setParticles(prev => [...prev, ...batch]);

    // Clean up this batch after the longest animation finishes
    if (cleanupRef.current) clearTimeout(cleanupRef.current);
    cleanupRef.current = setTimeout(() => {
      setParticles(prev => prev.filter(p => !batch.find(b => b.id === p.id)));
    }, 2600);
  }, []);

  return (
    <>
      {/* Soft romantic screen shimmer */}
      {isSparkling && <div className="af-shimmer" aria-hidden="true" />}

      {/* Particle burst — anchored to viewport center */}
      <div className="af-particle-anchor" aria-hidden="true">
        {particles.map(p => <Particle key={p.id} p={p} />)}
      </div>

      {/* Center text */}
      <div className="af-text-container">
        <button
          className="af-text-button"
          onClick={handleClick}
          aria-label="Always & Forever — click for a magical heart burst"
        >
          Always &amp; Forever
        </button>
      </div>
    </>
  );
}
