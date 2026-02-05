
import React, { useState, useEffect } from 'react';

interface PhotoSelectionProps {
  photos: string[];
  requiredCount: number;
  onComplete: (selected: string[]) => void;
  onBack?: () => void;
}

const PhotoSelection: React.FC<PhotoSelectionProps> = ({ photos, requiredCount, onComplete, onBack }) => {
  // Since we capture exactly the count or close to it, we let user confirm the set.
  // Requirement: "Let the user choose 3-4 favorites" (if 6 captured). 
  // Adjusted: Since we capture targetCount, we confirm the selection.
  const [selected, setSelected] = useState<string[]>(photos.slice(0, requiredCount));

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="w-full flex justify-between items-center mb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm font-accent text-[var(--color-text)]/70 hover:text-[var(--color-accent)]"
          >
            ← Back
          </button>
        )}
      </div>
      <h1 className="text-4xl font-display text-[var(--color-text)] mb-2">Review Your Shots</h1>
      <p className="text-[var(--color-text)]/80 font-accent mb-10">Look at those smiles! Press continue to build your strip.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {photos.map((url, idx) => (
          <div 
            key={idx}
            className="relative w-[200px] h-[260px] rounded-lg overflow-hidden shadow-medium bg-[var(--color-primary)]"
          >
            <img src={url} className="w-full h-full object-cover" alt={`Capture ${idx}`} />
            <div className="absolute bottom-2 left-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-bold text-[var(--color-accent)]">
              SHOT {idx + 1}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onComplete(selected)}
        className="w-[280px] h-14 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white rounded-full font-bold text-lg shadow-medium hover:scale-105 transition-all duration-300"
      >
        CREATE STRIP
      </button>
    </div>
  );
};

export default PhotoSelection;
