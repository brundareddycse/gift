import React from 'react';

export default function Navigation({ activePage, onNavigate }) {
  return (
    <nav className="scrapbook-nav-container" aria-label="Main Navigation">
      <div className="scrapbook-nav-bar">
        <button
          className={`scrapbook-nav-link${activePage === 'HOME' ? ' active' : ''}`}
          onClick={() => onNavigate('HOME')}
        >
          HOME
        </button>
        <span className="scrapbook-nav-divider">|</span>
        <button
          className={`scrapbook-nav-link${activePage === 'MUSIC' ? ' active' : ''}`}
          onClick={() => onNavigate('MUSIC')}
        >
          MUSIC
        </button>
        <span className="scrapbook-nav-divider">|</span>
        <button
          className={`scrapbook-nav-link${activePage === 'NOTES' ? ' active' : ''}`}
          onClick={() => onNavigate('NOTES')}
        >
          NOTES
        </button>
        <span className="scrapbook-nav-divider">|</span>
        <button
          className={`scrapbook-nav-link${activePage === 'SPECIAL' ? ' active' : ''}`}
          onClick={() => onNavigate('SPECIAL')}
        >
          SPECIAL
        </button>
      </div>
    </nav>
  );
}
