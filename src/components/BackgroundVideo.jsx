import React, { useState } from 'react';

/**
 * Dedicated BackgroundVideo layer component.
 * 
 * To replace the background video:
 * Simply add your own video file named `background.mp4` inside the `public/` directory!
 * (e.g. public/background.mp4)
 */
export default function BackgroundVideo({
  videoSrc = "/background.mp4",
  // Sample warm ambient fallback video so the app works out-of-the-box before user adds their file
  fallbackSrc = "https://assets.mixkit.co/videos/preview/mixkit-sunbeams-shining-through-the-leaves-of-a-tree-43552-large.mp4"
}) {
  const [currentSrc, setCurrentSrc] = useState(videoSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // If custom /background.mp4 is not found yet, fallback gracefully to placeholder sample video
    if (currentSrc === videoSrc && fallbackSrc) {
      console.log("Local background.mp4 not found yet. Showing placeholder video background until custom video is placed in public/background.mp4.");
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="background-video-container">
      {!hasError && (
        <video
          className="background-video-element"
          autoPlay
          muted
          loop
          playsInline
          onError={handleError}
          key={currentSrc}
        >
          <source src={currentSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Soft warm scrapbook ambient overlay to enhance Polaroid visibility */}
      <div className="background-video-overlay" />
    </div>
  );
}
