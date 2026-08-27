import React, { useState, useCallback } from 'react';
import BackgroundImage from './components/BackgroundImage';
import Navigation from './components/Navigation';
import CenterText from './components/CenterText';
import PolaroidGallery from './components/PolaroidGallery';
import MusicPage from './components/MusicPage';
import NotesPage from './components/NotesPage';
import SpecialPage from './components/SpecialPage';
import LockScreen from './components/LockScreen';

export default function App() {
  const [activePage,  setActivePage]  = useState('HOME');
  const [isUnlocked,  setIsUnlocked]  = useState(() => {
    try {
      return localStorage.getItem('gift_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [isExiting,   setIsExiting]   = useState(false); // drives the fade-out

  const handleUnlock = useCallback(() => {
    setIsExiting(true);
    try {
      localStorage.setItem('gift_unlocked', 'true');
    } catch {
      // ignore
    }
    // After CSS transition completes, show the site
    setTimeout(() => setIsUnlocked(true), 800);
  }, []);

  return (
    <>
      {/* ── Lock screen — sits on top until unlocked ── */}
      {!isUnlocked && (
        <div className={`ls-overlay${isExiting ? ' ls-overlay--exiting' : ''}`}>
          <LockScreen onUnlock={handleUnlock} />
        </div>
      )}

      {/* ── Main site — always mounted so state/music never resets ── */}
      <div className="app-layout">
        {/* CSS Pattern Background Layer */}
        <BackgroundImage />

        {/* Minimal Scrapbook Top Navigation */}
        <Navigation activePage={activePage} onNavigate={setActivePage} />

        {/* HOME PAGE */}
        <div className={`page-tab-content ${activePage === 'HOME' ? '' : 'is-hidden'}`}>
          <CenterText />
          <main>
            <PolaroidGallery />
          </main>
        </div>

        {/* MUSIC PAGE — Stays mounted so song keeps playing continuously across tabs */}
        <div className={`page-tab-content ${activePage === 'MUSIC' ? '' : 'is-hidden'}`}>
          <main>
            <MusicPage />
          </main>
        </div>

        {/* NOTES PAGE */}
        <div className={`page-tab-content ${activePage === 'NOTES' ? '' : 'is-hidden'}`}>
          <main>
            <NotesPage />
          </main>
        </div>

        {/* SPECIAL PAGE — The night sky from when brother was born */}
        <div className={`page-tab-content ${activePage === 'SPECIAL' ? '' : 'is-hidden'}`}>
          <main>
            <SpecialPage />
          </main>
        </div>
      </div>
    </>
  );
}
