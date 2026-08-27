import React, { useState, useRef, useCallback, useEffect } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────
const CORRECT = [1, 9, 0, 8];

// ─── Single rotating drum wheel ──────────────────────────────────────────────
function Wheel({ value, onChange, wheelIndex, locked }) {
  const dragging   = useRef(false);
  const startY     = useRef(0);
  const startVal   = useRef(0);

  // Mouse drag
  const onMouseDown = useCallback((e) => {
    if (locked) return;
    dragging.current   = true;
    startY.current     = e.clientY;
    startVal.current   = value;
    e.preventDefault();
  }, [value, locked]);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const delta = startY.current - e.clientY;
    const steps = Math.round(delta / 38);
    const next  = ((startVal.current + steps) % 10 + 10) % 10;
    if (next !== value) onChange(next);
  }, [value, onChange]);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Touch drag
  const onTouchStart = useCallback((e) => {
    if (locked) return;
    dragging.current = true;
    startY.current   = e.touches[0].clientY;
    startVal.current = value;
  }, [value, locked]);

  const onTouchMove = useCallback((e) => {
    if (!dragging.current) return;
    const delta = startY.current - e.touches[0].clientY;
    const steps = Math.round(delta / 38);
    const next  = ((startVal.current + steps) % 10 + 10) % 10;
    if (next !== value) onChange(next);
    e.preventDefault();
  }, [value, onChange]);

  const onTouchEnd = useCallback(() => {
    dragging.current = false;
  }, []);

  // Global mouse events
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // Keyboard accessibility
  const onKeyDown = useCallback((e) => {
    if (locked) return;
    if (e.key === 'ArrowUp') {
      onChange(((value + 1) % 10 + 10) % 10);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      onChange(((value - 1) % 10 + 10) % 10);
      e.preventDefault();
    }
  }, [value, onChange, locked]);

  // Build the visible digit strip: prev, current, next
  const digits = [
    ((value - 1) % 10 + 10) % 10,
    value,
    ((value + 1) % 10 + 10) % 10,
  ];

  return (
    <div className="cl-wheel-col">
      {/* Up arrow */}
      <button
        type="button"
        className="cl-arrow cl-arrow-up"
        onClick={() => !locked && onChange(((value + 1) % 10 + 10) % 10)}
        aria-label={`Wheel ${wheelIndex + 1} up`}
        tabIndex={locked ? -1 : 0}
      >
        <svg viewBox="0 0 24 14" fill="none" aria-hidden="true">
          <path d="M2 12L12 2L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* The drum window */}
      <div
        className={`cl-drum-window${locked ? ' cl-drum-window--locked' : ''}`}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKeyDown}
        tabIndex={locked ? -1 : 0}
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={9}
        aria-label={`Digit ${wheelIndex + 1}, current value ${value}`}
      >
        {/* Drum inner — 3D perspective strip */}
        <div className="cl-drum-inner">
          {digits.map((d, i) => (
            <div
              key={`${wheelIndex}-${i}`}
              className={`cl-drum-digit${i === 1 ? ' cl-drum-digit--center' : ' cl-drum-digit--side'}`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Metallic sheen overlays */}
        <div className="cl-drum-sheen-top"    aria-hidden="true" />
        <div className="cl-drum-sheen-bottom" aria-hidden="true" />
        {/* Center highlight line */}
        <div className="cl-drum-center-line"  aria-hidden="true" />
      </div>

      {/* Down arrow */}
      <button
        type="button"
        className="cl-arrow cl-arrow-down"
        onClick={() => !locked && onChange(((value - 1) % 10 + 10) % 10)}
        aria-label={`Wheel ${wheelIndex + 1} down`}
        tabIndex={locked ? -1 : 0}
      >
        <svg viewBox="0 0 24 14" fill="none" aria-hidden="true">
          <path d="M2 2L12 12L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Main Combination Lock ────────────────────────────────────────────────────
export default function CombinationLock({ onUnlock }) {
  const [digits, setDigits] = useState([0, 0, 0, 0]);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const setDigit = useCallback((i, v) => {
    if (isUnlocking) return;
    setDigits(prev => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }, [isUnlocking]);

  // Check combination when digits change
  useEffect(() => {
    if (isUnlocking) return;
    const correct = digits.every((d, i) => d === CORRECT[i]);
    if (correct) {
      // Small pause for the 4th digit to snap into place
      const settleTimer = setTimeout(() => {
        setIsUnlocking(true);
        // Extended satisfying mechanical unlock & rattle animation duration
        const unlockTimer = setTimeout(() => {
          onUnlock();
        }, 1600);
        return () => clearTimeout(unlockTimer);
      }, 180);
      return () => clearTimeout(settleTimer);
    }
  }, [digits, isUnlocking, onUnlock]);

  return (
    <div className={`cl-root${isUnlocking ? ' cl-root--unlocking' : ''}`}>
      {/* Lock body */}
      <div
        className="cl-lock-body"
        aria-label="Combination lock"
        role="group"
      >
        {/* Shackle (the U-shaped bar at top) */}
        <div className={`cl-shackle${isUnlocking ? ' cl-shackle--open' : ''}`} aria-hidden="true">
          <div className="cl-shackle-left"  />
          <div className="cl-shackle-right" />
          <div className="cl-shackle-bar"   />
        </div>

        {/* Lock face plate */}
        <div className="cl-face">
          {/* Brand area at top */}
          <div className="cl-brand" aria-hidden="true">
            <div className="cl-brand-line" />
          </div>

          {/* Four digit wheels */}
          <div className="cl-wheels-row" role="group" aria-label="Enter combination">
            {digits.map((d, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="cl-wheel-sep" aria-hidden="true" />}
                <Wheel
                  value={d}
                  onChange={(v) => setDigit(i, v)}
                  wheelIndex={i}
                  locked={isUnlocking}
                />
              </React.Fragment>
            ))}
          </div>

          {/* Bottom detail bar */}
          <div className="cl-face-bottom" aria-hidden="true">
            <div className="cl-face-bottom-bar" />
          </div>
        </div>

        {/* Rivet details */}
        <div className="cl-rivet cl-rivet--tl" aria-hidden="true" />
        <div className="cl-rivet cl-rivet--tr" aria-hidden="true" />
        <div className="cl-rivet cl-rivet--bl" aria-hidden="true" />
        <div className="cl-rivet cl-rivet--br" aria-hidden="true" />
      </div>
    </div>
  );
}
