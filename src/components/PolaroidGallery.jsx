import React from 'react';
import PolaroidCard from './PolaroidCard';
import { polaroidsData } from '../data/polaroidsData';

export default function PolaroidGallery() {
  return (
    <section className="polaroid-gallery-container" aria-label="Scrapbook Gallery">
      <div className="polaroid-gallery-canvas">
        {polaroidsData.map((polaroid) => {
          // Construct layout position styles (supporting top, left, right offsets)
          const positionStyle = {
            top: polaroid.position.top,
          };
          if (polaroid.position.left) positionStyle.left = polaroid.position.left;
          if (polaroid.position.right) positionStyle.right = polaroid.position.right;

          return (
            <PolaroidCard
              key={polaroid.id}
              polaroid={polaroid}
              style={positionStyle}
            />
          );
        })}
      </div>
    </section>
  );
}
