
import React, { useEffect, useState } from 'react';
import { ThemeConfig, ThemeKey } from '../types.ts';
import { THEMES } from '../constants.ts';

interface ThemeSelectionProps {
  onComplete: (theme: ThemeKey) => void;
  onBack: () => void;
}

const ThemeSelection: React.FC<ThemeSelectionProps> = ({ onComplete, onBack }) => {
  const [selected, setSelected] = useState<ThemeKey | null>(null);

  useEffect(() => {
    document.body.classList.remove(
      'theme-valentines',
      'theme-coquette',
      'theme-cherry',
      'theme-summer',
      'theme-boss',
    );
  }, []);

  return (
    <div className="flex flex-col items-center animate-fadeIn w-full">
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-sm font-accent text-[var(--color-text)]/70 hover:text-[var(--color-accent)]"
        >
          ← Back
        </button>
      </div>
      <h1 className="text-4xl font-display text-[var(--color-text)] mb-2">Pick Your Vibe</h1>
      <p className="text-[var(--color-text)]/80 font-accent mb-12">Choose a theme to start your photobooth.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16 w-full">
        {Object.values(THEMES).map((theme: ThemeConfig) => (
          <div 
            key={theme.key}
            onClick={() => setSelected(theme.key)}
            className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border-4 ${
              selected === theme.key ? 'border-[var(--color-secondary)] shadow-medium scale-105' : 'border-transparent opacity-80 hover:opacity-100'
            }`}
          >
            <div className="bg-white">
              <img
                src={theme.uiCardUrl}
                alt={theme.name}
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <button 
        disabled={!selected}
        onClick={() => selected && onComplete(selected)}
        className={`w-[320px] h-14 rounded-full font-bold text-lg shadow-medium transition-transform duration-200 ${
          selected
            ? 'bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white hover:scale-105'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Start Photobooth
      </button>
    </div>
  );
};

export default ThemeSelection;
