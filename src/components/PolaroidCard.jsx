import React, { useState } from 'react';

export default function PolaroidCard({ polaroid, style }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleFlip();
    }
  };

  const { image, backMessage, rotation, size } = polaroid;

  // Flexible image path resolver (supports "img1" or "/images/img1.jpeg")
  const imageSrc = image?.startsWith('/') || image?.startsWith('http')
    ? image
    : `/images/${image}.jpeg`;

  const cardStyle = {
    ...style,
    width: size?.width || '230px',
    height: size?.height || '270px',
    '--card-rotation': rotation || '0deg'
  };

  return (
    <div
      className="polaroid-wrapper"
      style={cardStyle}
    >
      <div
        className={`polaroid-card ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleToggleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Polaroid memory photograph. Click to flip and read handwritten message."
        aria-expanded={isFlipped}
      >
        {/* Card Inner containing 3D Front and Back */}
        <div className="polaroid-card-inner">
          
          {/* FRONT SIDE - ONLY PHOTO & WHITE FRAME */}
          <div className="polaroid-face polaroid-front">
            <div className="polaroid-photo-container">
              <img
                src={imageSrc}
                alt="Memory photo"
                className="polaroid-img"
                loading="lazy"
              />
              <div className="photo-grain-overlay" />
            </div>
          </div>

          {/* BACK SIDE - HANDWRITTEN PERSONAL MESSAGE */}
          <div className="polaroid-face polaroid-back">
            <div className="polaroid-back-content">
              <div className="back-paper-texture" />
              
              <div className="polaroid-back-message-container">
                <p className="polaroid-message-text">"{backMessage}"</p>
              </div>

              <div className="polaroid-back-footer">
                <span className="heart-sig">❤️</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
