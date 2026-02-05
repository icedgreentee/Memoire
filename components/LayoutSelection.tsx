import React, { useState } from 'react';
import { Template } from '../types';

interface LayoutSelectionProps {
  templates: Template[];
  onComplete: (template: Template) => void;
  onBack: () => void;
}

const LayoutSelection: React.FC<LayoutSelectionProps> = ({
  templates,
  onComplete,
  onBack,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-sm font-accent text-[var(--color-text)]/70 hover:text-[var(--color-accent)]"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-4xl font-display text-[var(--color-text)] mb-2">
        Select Template
      </h1>
      <p className="text-[var(--color-text)]/80 font-accent mb-12">
        Choose how your photos will be arranged.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 w-full max-w-4xl">
        {templates.map((tpl, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`group cursor-pointer p-6 rounded-lg transition-all duration-300 flex flex-col items-center border-4 ${
              selectedIndex === index
                ? 'bg-white shadow-medium border-[var(--color-secondary)]'
                : 'hover:bg-white/50 border-transparent'
            }`}
          >
            <div className="w-full max-w-[220px]">
              <img
                src={tpl.previewImageUrl}
                alt="layout preview"
                className="w-full rounded-lg shadow-soft bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onComplete(templates[selectedIndex])}
        className="w-[280px] h-14 rounded-full font-bold text-lg shadow-medium transition-all duration-300 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white hover:scale-105"
      >
        Continue
      </button>
    </div>
  );
};

export default LayoutSelection;
