import React from 'react';
import BackgroundImage from './BackgroundImage';
import CombinationLock from './CombinationLock';

export default function LockScreen({ onUnlock }) {
  return (
    <div className="ls-root" aria-label="Locked — enter combination to continue">
      {/* Same background component used on Home, Music, and Notes pages */}
      <BackgroundImage />

      {/* Centered lock area */}
      <div className="ls-center">
        <CombinationLock onUnlock={onUnlock} />
      </div>
    </div>
  );
}
