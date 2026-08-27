import React, { useState, useCallback, useRef, useEffect } from 'react';
import { jarsData } from '../data/notesData';

// ─── Small SVG decorative elements ─────────────────────────────────────────
function SparkleIcon({ size = 14, color = '#f9a8d4', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
      <path
        d="M8 0 C8 0 8.5 3.5 10 5 C11.5 6.5 15 7 15 8 C15 9 11.5 9.5 10 11 C8.5 12.5 8 16 8 16 C8 16 7.5 12.5 6 11 C4.5 9.5 1 9 1 8 C1 7 4.5 6.5 6 5 C7.5 3.5 8 0 8 0Z"
        fill={color} opacity="0.85"
      />
    </svg>
  );
}

function HeartIcon({ size = 11, color = '#f9a8d4', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 18" fill={color} style={style} aria-hidden="true">
      <path d="M10 17.5C10 17.5 1 11.5 1 5.5C1 3 3 1 5.5 1C7.2 1 8.7 2 10 3.5C11.3 2 12.8 1 14.5 1C17 1 19 3 19 5.5C19 11.5 10 17.5 10 17.5Z" />
    </svg>
  );
}

// ─── Individual paper chit inside the jar ──────────────────────────────────
function Chit({ index, accentColor, isShaking }) {
  const rotations = [-18, 12, -6, 22, -14, 8, -20, 16];
  const widths    = [52, 44, 58, 38, 50, 46, 42, 56];
  const heights   = [18, 22, 16, 20, 14, 24, 19, 15];
  const lefts     = [10, 28, 42, 8, 55, 20, 36, 48];
  const tops      = [14, 30, 48, 60, 24, 44, 10, 38];

  const rot  = rotations[index % rotations.length];
  const w    = widths[index % widths.length];
  const h    = heights[index % heights.length];
  const left = lefts[index % lefts.length];
  const top  = tops[index % tops.length];

  const chitColors = ['#fff9f0', '#fff0f5', '#f0f8ff', '#fffef0', '#f5fff0', '#fff5f5'];
  const bgColor = chitColors[index % chitColors.length];

  return (
    <div
      className={`jar-chit${isShaking ? ' jar-chit--shake' : ''}`}
      style={{
        '--chit-rot': `${rot}deg`,
        '--chit-shake-x': `${(index % 2 === 0 ? 1 : -1) * (3 + (index % 3))}px`,
        '--chit-shake-y': `${-2 - (index % 3)}px`,
        '--chit-delay': `${index * 40}ms`,
        width: `${w}%`,
        height: `${h}px`,
        left: `${left}%`,
        top: `${top}%`,
        background: bgColor,
        borderLeft: `2px solid ${accentColor}44`,
      }}
      aria-hidden="true"
    />
  );
}

// ─── SVG Glass Jar ──────────────────────────────────────────────────────────
function GlassJar({ accentColor, isShaking, chitCount = 8 }) {
  const id = accentColor.slice(1);
  return (
    <div className={`jar-wrapper${isShaking ? ' jar-wrapper--shaking' : ''}`}>
      <svg viewBox="0 0 160 210" xmlns="http://www.w3.org/2000/svg" className="jar-svg" aria-hidden="true">
        <defs>
          <linearGradient id={`jarGlass-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
            <stop offset="18%"  stopColor="rgba(255,255,255,0.55)" />
            <stop offset="50%"  stopColor="rgba(255,255,255,0.08)" />
            <stop offset="82%"  stopColor="rgba(255,255,255,0.42)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
          </linearGradient>
          <linearGradient id={`jarFill-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={accentColor} stopOpacity="0.28" />
            <stop offset="60%"  stopColor={accentColor} stopOpacity="0.14" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id={`jarLid-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#6b5a4e" />
            <stop offset="40%"  stopColor="#4a3b30" />
            <stop offset="100%" stopColor="#3a2c22" />
          </linearGradient>
          <linearGradient id={`jarRim-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#5a4a3e" />
            <stop offset="100%" stopColor="#2e2218" />
          </linearGradient>
          <filter id={`jarShadow-${id}`} x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor={accentColor} floodOpacity="0.3" />
            <feDropShadow dx="0" dy="2" stdDeviation="4"  floodColor="rgba(0,0,0,0.2)" />
          </filter>
        </defs>

        <ellipse cx="80" cy="208" rx="56" ry="5" fill="rgba(0,0,0,0.15)" />

        <g filter={`url(#jarShadow-${id})`}>
          <path
            d="M 32 60 Q 22 62 20 75 L 14 170 Q 12 185 16 192 Q 20 200 28 202 L 132 202 Q 140 200 144 192 Q 148 185 146 170 L 140 75 Q 138 62 128 60 Z"
            fill={`url(#jarFill-${id})`}
          />
          <path
            d="M 32 60 Q 22 62 20 75 L 14 170 Q 12 185 16 192 Q 20 200 28 202 L 132 202 Q 140 200 144 192 Q 148 185 146 170 L 140 75 Q 138 62 128 60 Z"
            fill="none" stroke="rgba(180,160,140,0.6)" strokeWidth="2.5"
          />
        </g>

        <path d="M 38 44 Q 36 52 32 60 L 128 60 Q 124 52 122 44 Z"
          fill={`url(#jarFill-${id})`} stroke="rgba(180,160,140,0.5)" strokeWidth="1.5" />
        <rect x="34" y="36" width="92" height="10" rx="3" fill={`url(#jarRim-${id})`} />

        <g>
          <rect x="28" y="10" width="104" height="30" rx="6"
            fill={`url(#jarLid-${id})`} stroke="rgba(80,60,40,0.5)" strokeWidth="1.5" />
          {[16,22,28,34,40,46,52,58,64,70,76,82,88,94,100,106,112,118].map(x => (
            <line key={x} x1={x} y1="10" x2={x} y2="40" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
          ))}
          <rect x="30" y="11" width="100" height="6" rx="4" fill="rgba(255,255,255,0.18)" />
          <rect x="30" y="34" width="100" height="4" fill="rgba(0,0,0,0.18)" />
          <rect x="32" y="10" width="96" height="3" rx="3" fill={accentColor} opacity="0.6" />
        </g>

        <path d="M 28 68 Q 26 74 25 100 L 26 160 Q 28 155 30 130 L 32 80 Z" fill="rgba(255,255,255,0.32)" />
        <path d="M 128 70 Q 132 80 133 110 L 132 155 Q 130 150 129 120 L 128 85 Z" fill="rgba(255,255,255,0.12)" />
        <path d="M 36 62 Q 80 58 124 62 L 122 70 Q 80 66 38 70 Z" fill="rgba(255,255,255,0.35)" />
        <ellipse cx="80" cy="196" rx="52" ry="5" fill="rgba(0,0,0,0.10)" />
      </svg>

      <div className="jar-chits-container" aria-hidden="true">
        {Array.from({ length: chitCount }).map((_, i) => (
          <Chit key={i} index={i} accentColor={accentColor} isShaking={isShaking} />
        ))}
      </div>
    </div>
  );
}

// ─── Note Modal (centered, 3D flip) ─────────────────────────────────────────
function NoteModal({ message, accentColor, jarLabel, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  // ESC to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') triggerClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function triggerClose() {
    setIsClosing(true);
    setTimeout(() => onClose(), 380);
  }

  return (
    <div
      className={`note-modal-backdrop${isClosing ? ' note-modal-backdrop--closing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) triggerClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={jarLabel}
    >
      <div className={`note-modal-scene${isClosing ? ' note-modal-scene--closing' : ''}`}>
        {/* The card itself — 3D flip container */}
        <div className="note-modal-card" style={{ '--card-accent': accentColor }}>

          {/* Corner fold */}
          <div className="note-modal-fold" style={{ background: accentColor + '55' }} />

          {/* Left margin rule */}
          <div className="note-modal-rule" style={{ background: accentColor }} />

          {/* Header — small hearts + jar name */}
          <div className="note-modal-header">
            <HeartIcon size={13} color={accentColor} />
            <HeartIcon size={9}  color={accentColor} style={{ opacity: 0.55, marginLeft: '6px' }} />
            <span className="note-modal-jar-name" style={{ color: accentColor }}>
              {jarLabel}
            </span>
          </div>

          {/* The message */}
          <p className="note-modal-text">{message}</p>

          {/* Footer hearts */}
          <div className="note-modal-footer">
            <HeartIcon size={14} color={accentColor} />
          </div>

          {/* Close button */}
          <button
            className="note-modal-close"
            onClick={triggerClose}
            aria-label="Close message"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="13" y1="1" x2="1"  y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>close</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Single Jar card ─────────────────────────────────────────────────────────
function JarCard({ jarData, onReveal }) {
  const { id, label, accentColor, messages } = jarData;
  const [isShaking, setIsShaking] = useState(false);
  const lastIndexRef = useRef(-1);

  const handleClick = useCallback(() => {
    if (isShaking) return;
    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);

      let idx;
      do {
        idx = Math.floor(Math.random() * messages.length);
      } while (messages.length > 1 && idx === lastIndexRef.current);
      lastIndexRef.current = idx;

      onReveal({ message: messages[idx], accentColor, jarLabel: label });
    }, 820);
  }, [isShaking, messages, accentColor, label, onReveal]);

  return (
    <article className="jar-card" id={id}>
      {/* Decorative sparkles */}
      <div className="jar-sparkles" aria-hidden="true">
        <SparkleIcon size={13} color={accentColor} style={{ position: 'absolute', top: '-4px', left: '10%' }} />
        <SparkleIcon size={9}  color={accentColor} style={{ position: 'absolute', top: '10px', right: '8%', opacity: 0.6 }} />
        <HeartIcon   size={10} color={accentColor} style={{ position: 'absolute', top: '0', right: '18%', opacity: 0.7 }} />
      </div>

      {/* Clickable jar */}
      <button
        className="jar-button"
        onClick={handleClick}
        aria-label={`${label} — click to open`}
        aria-busy={isShaking}
      >
        <GlassJar accentColor={accentColor} isShaking={isShaking} chitCount={8} />
      </button>

      {/* Label below jar */}
      <div className="jar-label" style={{ '--label-color': accentColor }}>
        {label}
      </div>

      {/* Hint text */}
      <p className="jar-hint">click to open</p>
    </article>
  );
}

// ─── Main Notes Page ─────────────────────────────────────────────────────────
export default function NotesPage() {
  const [activeNote, setActiveNote] = useState(null); // { message, accentColor, jarLabel }

  const handleReveal = useCallback((noteData) => {
    setActiveNote(noteData);
  }, []);

  const handleClose = useCallback(() => {
    setActiveNote(null);
  }, []);

  return (
    <section className="notes-page" aria-labelledby="notes-page-title">
      {/* Page header */}
      <header className="notes-page-header">
        <div className="notes-header-sparkles" aria-hidden="true">
          <SparkleIcon size={16} color="#c084fc" style={{ position: 'absolute', left: '-28px', top: '4px' }} />
          <SparkleIcon size={11} color="#f9a8d4" style={{ position: 'absolute', right: '-24px', top: '10px', opacity: 0.7 }} />
        </div>
        <h1 id="notes-page-title" className="notes-page-title">little notes for you</h1>
        <p className="notes-page-subtitle">pick a jar, give it a shake</p>
      </header>

      {/* Three jars row */}
      <div className="notes-jars-row" role="list">
        {jarsData.map((jar) => (
          <div key={jar.id} role="listitem">
            <JarCard jarData={jar} onReveal={handleReveal} />
          </div>
        ))}
      </div>

      {/* Centered modal — only rendered when a note is selected */}
      {activeNote && (
        <NoteModal
          message={activeNote.message}
          accentColor={activeNote.accentColor}
          jarLabel={activeNote.jarLabel}
          onClose={handleClose}
        />
      )}
    </section>
  );
}
