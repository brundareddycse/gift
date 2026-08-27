import React, { useState, useMemo, useCallback } from 'react';

// ─── Reference Sky Chart Star & Constellation Blueprint ──────────────────────
// Based directly on the photograph:
// Radius of celestial disc: 400 (center at 500, 500 in a 1000x1000 coordinate system)
const CX = 500;
const CY = 500;
const R = 390;

// Constellation definitions matching the reference chart
const CONSTELLATIONS = [
  // Summer Triangle & Cygnus the Swan (prominent in mid-upper right)
  {
    name: 'Cygnus (The Swan)',
    lines: [
      [580, 320, 620, 360],
      [620, 360, 660, 410],
      [620, 360, 560, 390],
      [620, 360, 680, 340],
      [660, 410, 710, 470],
    ],
  },
  // Lyra (Vega)
  {
    name: 'Lyra',
    lines: [
      [580, 320, 550, 300],
      [550, 300, 520, 330],
      [520, 330, 545, 360],
      [545, 360, 580, 320],
    ],
  },
  // Aquila (The Eagle - Altair)
  {
    name: 'Aquila',
    lines: [
      [640, 490, 600, 520],
      [600, 520, 560, 540],
      [600, 520, 630, 570],
      [600, 520, 580, 470],
    ],
  },
  // Pegasus (The Great Square in right sky)
  {
    name: 'Pegasus',
    lines: [
      [710, 470, 780, 430],
      [780, 430, 810, 510],
      [810, 510, 740, 550],
      [740, 550, 710, 470],
      [780, 430, 830, 380],
    ],
  },
  // Andromeda
  {
    name: 'Andromeda',
    lines: [
      [710, 470, 680, 390],
      [680, 390, 640, 330],
    ],
  },
  // Ursa Major (Big Dipper - upper left quadrant)
  {
    name: 'Ursa Major (Great Bear)',
    lines: [
      [320, 300, 360, 330],
      [360, 330, 410, 350],
      [410, 350, 440, 410],
      [440, 410, 380, 430],
      [380, 430, 350, 380],
      [350, 380, 410, 350],
      [320, 300, 270, 290],
      [270, 290, 230, 320],
    ],
  },
  // Ursa Minor & Polaris (near top celestial pole)
  {
    name: 'Ursa Minor & North Star',
    lines: [
      [500, 180, 470, 220],
      [470, 220, 450, 250],
      [450, 250, 480, 280],
      [480, 280, 520, 285],
      [520, 285, 510, 255],
      [510, 255, 450, 250],
    ],
  },
  // Cassiopeia (Distinct 'W' in upper central-right)
  {
    name: 'Cassiopeia',
    lines: [
      [570, 210, 600, 240],
      [600, 240, 630, 220],
      [630, 220, 670, 250],
      [670, 250, 710, 230],
    ],
  },
  // Cepheus (House shape near pole)
  {
    name: 'Cepheus',
    lines: [
      [540, 220, 560, 260],
      [560, 260, 520, 290],
      [520, 290, 490, 260],
      [490, 260, 510, 220],
      [510, 220, 540, 220],
    ],
  },
  // Bootes & Arcturus (mid-left)
  {
    name: 'Bootes (Arcturus)',
    lines: [
      [280, 440, 320, 490],
      [320, 490, 360, 520],
      [360, 520, 330, 580],
      [330, 580, 270, 550],
      [270, 550, 280, 440],
      [330, 580, 350, 640],
    ],
  },
  // Hercules (central Keystone)
  {
    name: 'Hercules',
    lines: [
      [440, 440, 480, 430],
      [480, 430, 500, 480],
      [500, 480, 450, 490],
      [450, 490, 440, 440],
      [440, 440, 410, 410],
      [480, 430, 510, 390],
      [450, 490, 430, 540],
      [500, 480, 530, 530],
    ],
  },
  // Corona Borealis (Northern Crown)
  {
    name: 'Corona Borealis',
    lines: [
      [380, 470, 395, 485],
      [395, 485, 415, 490],
      [415, 490, 430, 480],
      [430, 480, 438, 465],
    ],
  },
  // Libra (Star Sign in lower region / chart highlight)
  {
    name: 'Libra (Star Sign)',
    lines: [
      [320, 680, 370, 640],
      [370, 640, 430, 670],
      [430, 670, 390, 720],
      [390, 720, 320, 680],
      [370, 640, 390, 720],
    ],
  },
  // Scorpius (Antares - lower-mid left)
  {
    name: 'Scorpius',
    lines: [
      [430, 670, 470, 710],
      [470, 710, 490, 750],
      [490, 750, 470, 780],
      [470, 780, 440, 770],
      [430, 670, 410, 630],
    ],
  },
  // Sagittarius (The Teapot - lower right/center)
  {
    name: 'Sagittarius',
    lines: [
      [540, 660, 590, 650],
      [590, 650, 610, 690],
      [610, 690, 550, 700],
      [550, 700, 540, 660],
      [540, 660, 510, 680],
      [590, 650, 630, 640],
      [610, 690, 640, 720],
    ],
  },
  // Ophiuchus (Serpent Bearer - central)
  {
    name: 'Ophiuchus',
    lines: [
      [450, 490, 430, 570],
      [430, 570, 480, 620],
      [480, 620, 530, 580],
      [530, 580, 500, 480],
    ],
  },
  // Capricornus & Pisces Australis (bottom right)
  {
    name: 'Capricornus',
    lines: [
      [680, 640, 730, 620],
      [730, 620, 760, 660],
      [760, 660, 700, 690],
      [700, 690, 680, 640],
    ],
  },
];

// Major bright named stars positioned accurately as seen in the planisphere
const MAJOR_STARS = [
  { name: 'Polaris (North Star)', x: 500, y: 180, mag: 1, size: 5.5, glow: 18, color: '#f0f6ff' },
  { name: 'Vega',                 x: 580, y: 320, mag: 0, size: 6.5, glow: 24, color: '#d8ecff' },
  { name: 'Deneb',                x: 620, y: 360, mag: 1, size: 5.8, glow: 20, color: '#e2f0ff' },
  { name: 'Altair',               x: 600, y: 520, mag: 1, size: 5.8, glow: 20, color: '#fff5e8' },
  { name: 'Arcturus',             x: 330, y: 580, mag: 0, size: 6.2, glow: 22, color: '#ffe0b2' },
  { name: 'Antares',              x: 470, y: 710, mag: 1, size: 5.6, glow: 20, color: '#ffccbc' },
  { name: 'Spica',                x: 270, y: 650, mag: 1, size: 5.5, glow: 19, color: '#dbeafe' },
  { name: 'Alpheratz',            x: 710, y: 470, mag: 2, size: 4.8, glow: 16, color: '#ffffff' },
  { name: 'Scheat',               x: 780, y: 430, mag: 2, size: 4.6, glow: 15, color: '#ffe4c4' },
  { name: 'Markab',               x: 740, y: 550, mag: 2, size: 4.7, glow: 15, color: '#e0f2fe' },
  { name: 'Algenib',              x: 810, y: 510, mag: 2, size: 4.5, glow: 14, color: '#ffffff' },
  { name: 'Dubhe',                x: 410, y: 350, mag: 2, size: 4.8, glow: 16, color: '#fed7aa' },
  { name: 'Merak',                x: 440, y: 410, mag: 2, size: 4.6, glow: 15, color: '#ffffff' },
  { name: 'Phecda',               x: 380, y: 430, mag: 2, size: 4.5, glow: 14, color: '#ffffff' },
  { name: 'Megrez',               x: 350, y: 380, mag: 3, size: 4.2, glow: 13, color: '#ffffff' },
  { name: 'Alioth',               x: 360, y: 330, mag: 2, size: 4.9, glow: 16, color: '#ffffff' },
  { name: 'Mizar',                x: 320, y: 300, mag: 2, size: 4.7, glow: 15, color: '#ffffff' },
  { name: 'Alkaid',               x: 270, y: 290, mag: 2, size: 4.8, glow: 16, color: '#dbeafe' },
  { name: 'Schedar',              x: 630, y: 220, mag: 2, size: 4.8, glow: 16, color: '#fed7aa' },
  { name: 'Caph',                 x: 570, y: 210, mag: 2, size: 4.6, glow: 15, color: '#ffffff' },
  { name: 'Gamma Cas',            x: 600, y: 240, mag: 2, size: 4.7, glow: 15, color: '#e0f2fe' },
  { name: 'Ruchbah',              x: 670, y: 250, mag: 2, size: 4.5, glow: 14, color: '#ffffff' },
  { name: 'Segin',                x: 710, y: 230, mag: 3, size: 4.2, glow: 13, color: '#ffffff' },
  { name: 'Kornephoros',          x: 440, y: 440, mag: 2, size: 4.6, glow: 15, color: '#fffbeb' },
  { name: 'Rasalhague',           x: 500, y: 480, mag: 2, size: 4.8, glow: 16, color: '#ffffff' },
  { name: 'Alphecca',             x: 415, y: 490, mag: 2, size: 4.8, glow: 16, color: '#ffffff' },
  { name: 'Zubeneschamali (Libra)',x: 370, y: 640, mag: 2, size: 5.0, glow: 17, color: '#d1fae5' },
  { name: 'Zubenelgenubi (Libra)', x: 320, y: 680, mag: 2, size: 4.8, glow: 16, color: '#ffffff' },
  { name: 'Brachium (Libra)',     x: 390, y: 720, mag: 3, size: 4.4, glow: 14, color: '#fed7aa' },
  { name: 'Kaus Australis',       x: 610, y: 690, mag: 2, size: 4.8, glow: 16, color: '#e0f2fe' },
  { name: 'Nunki',                x: 630, y: 640, mag: 2, size: 4.7, glow: 15, color: '#dbeafe' },
  { name: 'Fomalhaut',            x: 780, y: 720, mag: 1, size: 5.4, glow: 19, color: '#f0f9ff' },
];

// Degree marks on the outer circular ring (360° chart)
const DEGREE_MARKS = [
  { deg: 0,   label: 'NORTH 0°',  isCardinal: true },
  { deg: 10,  label: '10°' },
  { deg: 20,  label: '20°' },
  { deg: 30,  label: '30°' },
  { deg: 40,  label: '40°' },
  { deg: 50,  label: '50°' },
  { deg: 60,  label: '60°' },
  { deg: 70,  label: '70°' },
  { deg: 80,  label: '80°' },
  { deg: 90,  label: 'WEST 90°',   isCardinal: true },
  { deg: 100, label: '100°' },
  { deg: 110, label: '110°' },
  { deg: 120, label: '120°' },
  { deg: 130, label: '130°' },
  { deg: 140, label: '140°' },
  { deg: 150, label: '150°' },
  { deg: 160, label: '160°' },
  { deg: 170, label: '170°' },
  { deg: 180, label: 'SOUTH 180°', isCardinal: true },
  { deg: 190, label: '190°' },
  { deg: 200, label: '200°' },
  { deg: 210, label: '210°' },
  { deg: 220, label: '220°' },
  { deg: 230, label: '230°' },
  { deg: 240, label: '240°' },
  { deg: 250, label: '250°' },
  { deg: 260, label: '260°' },
  { deg: 270, label: 'EAST 270°',  isCardinal: true },
  { deg: 280, label: '280°' },
  { deg: 290, label: '290°' },
  { deg: 300, label: '300°' },
  { deg: 310, label: '310°' },
  { deg: 320, label: '320°' },
  { deg: 330, label: '330°' },
  { deg: 340, label: '340°' },
  { deg: 350, label: '350°' },
];

export default function SpecialPage() {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [hoveredConstellation, setHoveredConstellation] = useState(null);

  // Generate a realistic field of ~320 background stars within the disc
  const backgroundStars = useMemo(() => {
    const stars = [];
    let seed = 42;
    function pseudoRandom() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < 340; i++) {
      const angle = pseudoRandom() * Math.PI * 2;
      const radius = Math.sqrt(pseudoRandom()) * (R - 15);
      const x = CX + radius * Math.cos(angle);
      const y = CY + radius * Math.sin(angle);

      // Milky Way concentration band (diagonal from upper right to lower left)
      const distToMilkyWay = Math.abs((x - 500) + (y - 500) * 0.7);
      const isMilkyWay = distToMilkyWay < 180 && pseudoRandom() > 0.4;

      const size = isMilkyWay ? 0.9 + pseudoRandom() * 1.5 : 0.7 + pseudoRandom() * 1.8;
      const opacity = isMilkyWay ? 0.35 + pseudoRandom() * 0.55 : 0.25 + pseudoRandom() * 0.65;
      const twinkleDelay = pseudoRandom() * 5;
      const twinkleDuration = 2.5 + pseudoRandom() * 3.5;

      stars.push({
        id: `bg-star-${i}`,
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
        size: Number(size.toFixed(2)),
        opacity: Number(opacity.toFixed(2)),
        twinkleDelay: Number(twinkleDelay.toFixed(2)),
        twinkleDuration: Number(twinkleDuration.toFixed(2)),
      });
    }
    return stars;
  }, []);

  // Polar coordinate grid rays radiating from Polaris
  const polarRays = useMemo(() => {
    const rays = [];
    const poleX = 500;
    const poleY = 180;
    for (let a = 0; a < 360; a += 15) {
      const rad = (a * Math.PI) / 180;
      // Ray from polar center out to chart boundary
      const x2 = poleX + 450 * Math.cos(rad);
      const y2 = poleY + 450 * Math.sin(rad);
      rays.push({ x1: poleX, y1: poleY, x2, y2, angle: a });
    }
    return rays;
  }, []);

  const handleStarMouseEnter = useCallback((star) => {
    setHoveredStar(star);
  }, []);

  const handleStarMouseLeave = useCallback(() => {
    setHoveredStar(null);
  }, []);

  return (
    <section className="special-page" aria-labelledby="special-page-title">
      {/* ── Section Title & Header ────────────────────────────────────────── */}
      <header className="special-page-header">
        <h1 id="special-page-title" className="special-page-title">
          the sky when you were born
        </h1>
        <p className="special-page-subtitle">
          a celestial map of the stars and constellations from that night
        </p>
      </header>

      {/* ── Main Celestial Star Map Canvas Container ───────────────────────── */}
      <div className="special-chart-container">
        {/* Top legend badges recreating the chart header */}
        <div className="special-chart-top-badges">
          <div className="special-badge special-badge-left">
            <span className="special-badge-icon">✦</span>
            <span className="special-badge-text">CONSTELLATIONS & ECLIPTIC</span>
          </div>

          <div className="special-badge special-badge-right">
            <span className="special-badge-icon">♎</span>
            <span className="special-badge-text">STAR SIGN · LIBRA</span>
          </div>
        </div>

        {/* The SVG Planisphere Chart */}
        <div className="special-sky-wrapper">
          <svg
            viewBox="0 0 1000 1000"
            className="special-sky-svg"
            role="img"
            aria-label="Night sky star chart recreating the constellations on the day brother was born"
          >
            <defs>
              {/* Deep midnight space gradient */}
              <radialGradient id="skyVoidGrad" cx="50%" cy="46%" r="54%">
                <stop offset="0%" stopColor="#0c1122" />
                <stop offset="45%" stopColor="#070a16" />
                <stop offset="78%" stopColor="#04060d" />
                <stop offset="100%" stopColor="#020308" />
              </radialGradient>

              {/* Milky Way luminous dust cloud overlay */}
              <radialGradient id="milkyWayGlow" cx="62%" cy="42%" r="48%">
                <stop offset="0%" stopColor="rgba(147, 197, 253, 0.09)" />
                <stop offset="40%" stopColor="rgba(192, 132, 252, 0.05)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Outer rim metallic brass/slate gradient */}
              <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              {/* Star glow filter */}
              <filter id="starGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ── Background Celestial Disc ── */}
            <clipPath id="celestialDiscClip">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>

            {/* Outer coordinate rim disc */}
            <circle cx={CX} cy={CY} r={R + 18} fill="#050711" stroke="#334155" strokeWidth="1.5" />
            <circle cx={CX} cy={CY} r={R + 3} fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2,3" />

            {/* Inner sky void */}
            <circle cx={CX} cy={CY} r={R} fill="url(#skyVoidGrad)" stroke="#64748b" strokeWidth="1.8" />

            {/* Masked Sky Area */}
            <g clipPath="url(#celestialDiscClip)">
              {/* Milky Way diffuse glow */}
              <ellipse cx="560" cy="460" rx="340" ry="180" transform="rotate(-35, 560, 460)" fill="url(#milkyWayGlow)" />
              <ellipse cx="440" cy="540" rx="260" ry="120" transform="rotate(-40, 440, 540)" fill="url(#milkyWayGlow)" opacity="0.6" />

              {/* Coordinate Grid: Concentric Declination Circles */}
              <circle cx={CX} cy={CY} r={120} fill="none" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.8" />
              <circle cx={CX} cy={CY} r={220} fill="none" stroke="rgba(148, 163, 184, 0.14)" strokeWidth="0.8" />
              <circle cx={CX} cy={CY} r={310} fill="none" stroke="rgba(148, 163, 184, 0.14)" strokeWidth="0.8" />

              {/* Ecliptic Path (dashed sinusoidal/tilted ellipse) */}
              <ellipse
                cx="500"
                cy="510"
                rx="350"
                ry="210"
                transform="rotate(22, 500, 510)"
                fill="none"
                stroke="rgba(253, 224, 71, 0.22)"
                strokeWidth="1.2"
                strokeDasharray="4,5"
              />

              {/* Polar convergent rays (at top near North Celestial Pole) */}
              <g opacity="0.16">
                {polarRays.map((ray, i) => (
                  <line
                    key={`ray-${i}`}
                    x1={ray.x1}
                    y1={ray.y1}
                    x2={ray.x2}
                    y2={ray.y2}
                    stroke="#94a3b8"
                    strokeWidth="0.6"
                  />
                ))}
              </g>

              {/* ── Background Field Stars ── */}
              <g className="bg-stars-group">
                {backgroundStars.map((s) => (
                  <circle
                    key={s.id}
                    cx={s.x}
                    cy={s.y}
                    r={s.size}
                    fill="#e2e8f0"
                    opacity={s.opacity}
                    style={{
                      animation: `starTwinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite alternate`,
                    }}
                  />
                ))}
              </g>

              {/* ── Constellation Connecting Lines ── */}
              <g className="constellation-lines-group">
                {CONSTELLATIONS.map((c, ci) => {
                  const isHovered = hoveredConstellation === c.name;
                  return (
                    <g
                      key={`const-${ci}`}
                      onMouseEnter={() => setHoveredConstellation(c.name)}
                      onMouseLeave={() => setHoveredConstellation(null)}
                    >
                      {c.lines.map(([x1, y1, x2, y2], li) => (
                        <line
                          key={`l-${ci}-${li}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isHovered ? 'rgba(192, 132, 252, 0.75)' : 'rgba(203, 213, 225, 0.22)'}
                          strokeWidth={isHovered ? 1.6 : 0.9}
                          strokeLinecap="round"
                          className="constellation-line"
                        />
                      ))}
                    </g>
                  );
                })}
              </g>

              {/* ── Major Interactive Stars ── */}
              <g className="major-stars-group">
                {MAJOR_STARS.map((star, idx) => {
                  const isHovered = hoveredStar?.name === star.name;
                  return (
                    <g
                      key={`major-${idx}`}
                      className="interactive-star-group"
                      onMouseEnter={() => handleStarMouseEnter(star)}
                      onMouseLeave={handleStarMouseLeave}
                      tabIndex={0}
                      role="button"
                      aria-label={`${star.name}, Magnitude ${star.mag}`}
                    >
                      {/* Ambient breathing halo */}
                      <circle
                        cx={star.x}
                        cy={star.y}
                        r={isHovered ? star.glow * 1.6 : star.glow * 0.7}
                        fill={star.color}
                        opacity={isHovered ? 0.35 : 0.12}
                        className="star-ambient-halo"
                      />

                      {/* Diffraction Spikes on brighter stars */}
                      {star.mag <= 1 && (
                        <g opacity={isHovered ? 0.9 : 0.45} className="star-diffraction-spikes">
                          <line
                            x1={star.x - (isHovered ? 16 : 10)}
                            y1={star.y}
                            x2={star.x + (isHovered ? 16 : 10)}
                            y2={star.y}
                            stroke={star.color}
                            strokeWidth={isHovered ? 1.4 : 0.8}
                          />
                          <line
                            x1={star.x}
                            y1={star.y - (isHovered ? 16 : 10)}
                            x2={star.x}
                            y2={star.y + (isHovered ? 16 : 10)}
                            stroke={star.color}
                            strokeWidth={isHovered ? 1.4 : 0.8}
                          />
                        </g>
                      )}

                      {/* Solid central star core */}
                      <circle
                        cx={star.x}
                        cy={star.y}
                        r={isHovered ? star.size * 1.35 : star.size}
                        fill={star.color}
                        filter="url(#starGlowFilter)"
                        className="star-core"
                      />
                    </g>
                  );
                })}
              </g>
            </g>

            {/* ── Outer Degree Ticks & Coordinate Markings ── */}
            <g className="outer-rim-markings" aria-hidden="true">
              {DEGREE_MARKS.map((m) => {
                const angleRad = ((m.deg - 90) * Math.PI) / 180;
                const rInner = m.isCardinal ? R : R + 2;
                const rOuter = m.isCardinal ? R + 14 : R + 7;
                const rText = R + 12;

                const x1 = CX + rInner * Math.cos(angleRad);
                const y1 = CY + rInner * Math.sin(angleRad);
                const x2 = CX + rOuter * Math.cos(angleRad);
                const y2 = CY + rOuter * Math.sin(angleRad);

                const tx = CX + rText * Math.cos(angleRad);
                const ty = CY + rText * Math.sin(angleRad);

                return (
                  <g key={`deg-${m.deg}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={m.isCardinal ? '#e2e8f0' : '#64748b'}
                      strokeWidth={m.isCardinal ? 1.5 : 0.8}
                    />
                    {m.isCardinal ? (
                      <text
                        x={tx}
                        y={ty}
                        fill="#cbd5e1"
                        fontSize="10"
                        fontWeight="700"
                        letterSpacing="1"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${m.deg}, ${tx}, ${ty})`}
                      >
                        {m.label.split(' ')[0]}
                      </text>
                    ) : (
                      m.deg % 30 === 0 && (
                        <text
                          x={tx}
                          y={ty}
                          fill="#94a3b8"
                          fontSize="7"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${m.deg}, ${tx}, ${ty})`}
                        >
                          {m.label}
                        </text>
                      )
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Interactive Star Floating Badge Tooltip */}
          {hoveredStar && (
            <div
              className="star-floating-tooltip"
              style={{
                left: `${(hoveredStar.x / 1000) * 100}%`,
                top: `${(hoveredStar.y / 1000) * 100}%`,
              }}
              role="tooltip"
            >
              <div className="tooltip-inner">
                <span className="tooltip-name">{hoveredStar.name}</span>
                <span className="tooltip-sub">Magnitude {hoveredStar.mag}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Birthday Message Card ────────────────────────────────────────── */}
        <div className="special-message-card">
          <div className="special-quote-sparkle" aria-hidden="true">✦</div>
          <p className="special-quote-text">
            “Every star shines a little brighter today because this was the day my brother came into the world.”
          </p>
          <div className="special-quote-sparkle" aria-hidden="true">✦</div>
        </div>
      </div>
    </section>
  );
}
