
import React from 'react';

interface PreSessionPageProps {
  photoCount: number;
  onPhotoCountChange: (count: number) => void;
  onContinue: () => void;
}

const PreSessionPage: React.FC<PreSessionPageProps> = ({ photoCount, onPhotoCountChange, onContinue }) => {
  return (
    <div className="flex flex-col items-center animate-fadeIn max-w-2xl mx-auto glass-panel p-16 rounded-lg shadow-medium border-4 border-[color-mix(in_srgb,var(--color-border)_70%,transparent)]">
      <h2 className="text-4xl font-display text-[var(--color-text)] mb-2">Configure Session</h2>
      <p className="text-[var(--color-text)]/80 font-accent uppercase tracking-widest text-xs mb-12">Choose your masterpiece size</p>
      
      <div className="flex flex-col items-center mb-16 gap-6 w-full">
        <label className="text-[var(--color-accent)] font-bold text-sm tracking-[0.2em] uppercase">How many photos?</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 w-full">
          {[2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => onPhotoCountChange(num)}
              className={`w-full aspect-square rounded-lg font-bold transition-all duration-500 text-2xl border-4 ${
                photoCount === num 
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-secondary)] shadow-medium scale-110 -translate-y-2' 
                  : 'bg-white/80 text-[var(--color-accent)] border-transparent hover:border-[var(--color-secondary)] hover:bg-[var(--color-primary)]'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={onContinue}
        className="w-full h-20 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white rounded-full font-bold text-xl shadow-medium hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-[0.2em]"
      >
        Prepare to Pose
      </button>
    </div>
  );
};

export default PreSessionPage;
