import React, { useState, useRef, useEffect, useCallback } from 'react';
import CoverflowGallery from './CoverflowGallery';

// ─── Coverflow Gallery slot is now filled by CoverflowGallery ────────────────

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function MusicNoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="music-section-icon" aria-hidden="true">
      <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 5.14v14l11-7-11-7z"/>
    </svg>
  );
}

// Animated equalizer bars — shown when a song is currently playing (not paused)
function EqualizerBars() {
  return (
    <span className="equalizer-bars" aria-label="Playing">
      <span className="eq-bar" style={{ '--delay': '0s',   '--height': '60%' }} />
      <span className="eq-bar" style={{ '--delay': '0.2s', '--height': '100%' }} />
      <span className="eq-bar" style={{ '--delay': '0.1s', '--height': '75%' }} />
      <span className="eq-bar" style={{ '--delay': '0.3s', '--height': '50%' }} />
    </span>
  );
}

// ─── Song Data ────────────────────────────────────────────────────────────────
// Real files in public/music/: song 1.mp3 → song 6.mp3
const SONGS = [
  {
    id: 1,
    title: 'Tenu Sang Rakhna',
    artist: 'Arijit Singh, Shreya Ghoshal & A.R. Rahman',
    audio: '/music/song 1.mp3',
    startTime: 0,
    albumColor: '#e8d5f0',
  },
  {
    id: 2,
    title: 'Her (I Found Her)',
    artist: 'JVKE',
    audio: '/music/song 2.mp3',
    startTime: 19,
    albumColor: '#f0dde8',
  },
  {
    id: 3,
    title: 'If We Have Each Other',
    artist: 'Alec Benjamin',
    audio: '/music/song 3.mp3',
    startTime: 28,
    albumColor: '#ddeaf0',
  },
  {
    id: 4,
    title: 'Brother',
    artist: 'Kodaline',
    audio: '/music/song 4.mp3',
    startTime: 34,
    albumColor: '#f0ead5',
  },
  {
    id: 5,
    title: 'Phoolon Ka Taron Ka',
    artist: 'Vedang Raina',
    audio: '/music/song 5.mp3',
    startTime: 26,
    albumColor: '#d5f0e8',
  },
  {
    id: 6,
    title: 'Madhura Madhuratara',
    artist: 'P. Unnikrishnan & Harini',
    audio: '/music/song 6.mp3',
    startTime: 26,
    albumColor: '#f0e8d5',
  },
];


// ─── Album Cover ──────────────────────────────────────────────────────────────
function AlbumCover({ song }) {
  return (
    <div
      className="album-cover"
      style={{ background: song.albumColor }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" className="album-cover-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="10" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="20" r="3"  fill="rgba(0,0,0,0.12)"/>
        <path d="M20 5 A15 15 0 0 1 35 20" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    </div>
  );
}

// ─── Song Row ─────────────────────────────────────────────────────────────────
function SongRow({ song, isActive, isPlaying, onSelect }) {
  return (
    <div
      className={`song-row${isActive ? ' song-row--active' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${isActive && isPlaying ? 'Pause' : 'Play'} ${song.title} by ${song.artist}`}
      onClick={() => onSelect(song.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(song.id);
        }
      }}
    >
      <AlbumCover song={song} />

      <div className="song-info">
        <span className="song-title">{song.title}</span>
        <span className="song-artist">{song.artist}</span>
      </div>

      <div className="song-control">
        {isActive && isPlaying ? (
          <EqualizerBars />
        ) : (
          <button
            className="play-btn"
            aria-label={isActive ? 'Resume' : `Play ${song.title}`}
            tabIndex={-1}
          >
            <PlayIcon />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Format Time Helper ───────────────────────────────────────────────────────
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null || seconds === undefined || seconds < 0) {
    return '0:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ─── Music Player ─────────────────────────────────────────────────────────────
function MusicPlayer() {
  const [activeSongId, setActiveSongId] = useState(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [isDragging,   setIsDragging]   = useState(false);
  const [dragTime,     setDragTime]     = useState(0);

  // Single persistent Audio instance — never recreated
  const audioRef            = useRef(null);
  const activeSongRef       = useRef(null);
  const pendingStartTimeRef = useRef(null);
  const isDraggingRef       = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const applyPendingSeek = () => {
      if (pendingStartTimeRef.current !== null && pendingStartTimeRef.current !== undefined) {
        const target = pendingStartTimeRef.current;
        pendingStartTimeRef.current = null;
        try {
          audio.currentTime = target;
        } catch (_) {}
        setCurrentTime(target);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      applyPendingSeek();
    };

    const handleCanPlay = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      applyPendingSeek();
    };

    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (!isDraggingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      // Song finished — reset to its configured startTime so next play begins there
      if (activeSongRef.current != null) {
        audio.currentTime = activeSongRef.current.startTime;
        setCurrentTime(activeSongRef.current.startTime);
      }
      setIsPlaying(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e) => {
      console.warn('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Cleanup on unmount — release the audio resource entirely
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audio.load();
    };
  }, []);

  const handleSelect = useCallback((id) => {
    const audio = audioRef.current;
    if (!audio) return;

    const song = SONGS.find(s => s.id === id);
    if (!song) return;

    if (activeSongId === id) {
      // ── Same song: toggle pause / resume ──────────────────────────────────
      // Do NOT touch currentTime — preserve the user's playback position.
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((err) => {
          console.warn('Playback prevented:', err);
        });
      }
    } else {
      // ── Different song: stop current, load new, seek to startTime ─────────
      audio.pause();
      audio.src = song.audio;
      activeSongRef.current = song;
      pendingStartTimeRef.current = song.startTime;
      setCurrentTime(song.startTime);
      setDuration(0);
      setActiveSongId(id);

      try {
        audio.currentTime = song.startTime;
      } catch (_) {}

      audio.play().catch((err) => {
        console.warn('Playback prevented:', err);
      });
    }
  }, [activeSongId, isPlaying]);

  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setDragTime(newTime);
    if (!isDraggingRef.current) {
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = newTime;
        } catch (_) {}
      }
      setCurrentTime(newTime);
    }
  };

  const handleSeekStart = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
    setDragTime(currentTime);
  };

  const handleSeekEnd = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = newTime;
      } catch (_) {}
    }
    setCurrentTime(newTime);
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const activeSong = SONGS.find(s => s.id === activeSongId);
  const displayCurrentTime = isDragging ? dragTime : currentTime;
  const maxDuration = duration > 0 ? duration : (activeSong ? Math.max(activeSong.startTime + 1, 100) : 100);
  const progressPercent = maxDuration > 0 ? Math.min(100, Math.max(0, (displayCurrentTime / maxDuration) * 100)) : 0;

  return (
    <div className="music-player-card" role="region" aria-label="Music player">

      <div className="music-player-header">
        <MusicNoteIcon />
        <span className="music-player-label">Currently Playing</span>
      </div>

      <div className="now-playing-display" aria-live="polite" aria-atomic="true">
        {activeSong ? (
          <>
            <span className="now-playing-title">{activeSong.title}</span>
            <span className="now-playing-artist">{activeSong.artist}</span>
          </>
        ) : (
          <span className="now-playing-idle">Select a song to play</span>
        )}
      </div>

      {/* Progress / Seek Bar — ONLY in Currently Playing */}
      {activeSong && (
        <div className="music-progress-container" aria-label="Playback progress">
          <span className="music-time-label music-time-current">
            {formatTime(displayCurrentTime)}
          </span>

          <div className="music-slider-wrapper">
            <input
              type="range"
              className="music-progress-slider"
              min={0}
              max={maxDuration}
              step="0.1"
              value={displayCurrentTime}
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              style={{ '--progress-percent': `${progressPercent}%` }}
              aria-label="Seek track position"
              aria-valuemin={0}
              aria-valuemax={maxDuration}
              aria-valuenow={displayCurrentTime}
            />
          </div>

          <span className="music-time-label music-time-duration">
            {formatTime(duration)}
          </span>
        </div>
      )}

      <div className="music-player-divider" aria-hidden="true" />

      <ol className="song-list" aria-label="Song list">
        {SONGS.map(song => (
          <li key={song.id} className="song-list-item">
            <SongRow
              song={song}
              isActive={activeSongId === song.id}
              isPlaying={activeSongId === song.id && isPlaying}
              onSelect={handleSelect}
            />
          </li>
        ))}
      </ol>

    </div>
  );
}

// ─── Music Page ───────────────────────────────────────────────────────────────
export default function MusicPage() {
  return (
    <section className="music-page" aria-label="Music section">

      <header className="music-page-header">
        <h1 className="music-page-title">Our Soundtrack</h1>
        <p className="music-page-subtitle">songs that remind me of you</p>
      </header>

      {/* Photo-Scrolling Coverflow Gallery */}
      <div className="music-gallery-area">
        <CoverflowGallery />
      </div>

      <div className="music-player-area">
        <MusicPlayer />
      </div>

    </section>
  );
}
