
import React, { useMemo, useState } from 'react';
import { ThemeKey } from '../types.ts';

interface ExportPageProps {
  imageUrl: string;
  theme: ThemeKey;
  onBack: () => void;
  onReset: () => void;
}

const ExportPage: React.FC<ExportPageProps> = ({ imageUrl, theme, onBack, onReset }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const themeSlug = useMemo(() => {
    switch (theme) {
      case ThemeKey.VALENTINES:
        return 'valentines';
      case ThemeKey.COQUETTE:
        return 'coquette';
      case ThemeKey.CHERRY_GIRL:
        return 'cherrygirl';
      case ThemeKey.SUMMER_FRUITS:
        return 'summerfruits';
      case ThemeKey.BOSS_BABE:
        return 'bossbabe';
      default:
        return 'memoire';
    }
  }, [theme]);

  const downloadFileName = useMemo(() => `memoire-${themeSlug}-${Date.now()}.jpg`, [themeSlug]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = downloadFileName;
    link.href = imageUrl;
    link.click();
  };

  const getJpgFile = async () => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], downloadFileName, { type: 'image/jpeg' });
  };

  const shareViaWebShare = async () => {
    if (!navigator.share) return false;
    try {
      const file = await getJpgFile();
      await navigator.share({
        files: [file],
        title: 'Mémoire',
        text: 'Captured with Mémoire',
      });
      return true;
    } catch (err) {
      console.error('Sharing failed', err);
      return false;
    }
  };

  const shareWhatsApp = async () => {
    const didWebShare = await shareViaWebShare();
    if (didWebShare) return;
    window.open('https://web.whatsapp.com/', '_blank', 'noopener,noreferrer');
    alert('Download your photo and upload it manually.');
  };

  const shareInstagram = async () => {
    const didWebShare = await shareViaWebShare();
    if (didWebShare) return;
    alert('Download your photo and upload manually to Instagram.');
  };

  const shareGmail = async () => {
    const didWebShare = await shareViaWebShare();
    if (didWebShare) return;
    const subject = encodeURIComponent('Memories from Mémoire');
    const body = encodeURIComponent('Your photo is ready! Attach the JPG you downloaded.');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

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
      <h1 className="text-4xl font-display text-[var(--color-text)] mb-2">Beautiful!</h1>
      <p className="text-[var(--color-text)]/80 font-accent mb-12">Your memory is ready to be shared with the world.</p>

      <div className="relative group mb-12 max-w-[500px]">
        <img 
          src={imageUrl} 
          className="rounded-lg shadow-medium border-8 border-white max-h-[600px] object-contain" 
          alt="Final Result" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
          <span className="text-white text-xl font-display">Slay! ✨</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleDownload}
          className="w-[200px] h-14 bg-white text-[var(--color-accent)] border-2 border-[var(--color-accent)] rounded-full font-bold hover:bg-[var(--color-primary)] transition-all shadow-soft"
        >
          Download JPG
        </button>
        <button 
          onClick={() => setIsShareOpen(true)}
          className="w-[200px] h-14 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white rounded-full font-bold hover:scale-105 transition-all shadow-medium"
        >
          Share
        </button>
      </div>

      <div className="mt-10 flex gap-4">
        <button
          onClick={onReset}
          className="w-[200px] h-12 bg-white text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-full font-bold hover:bg-[var(--color-primary)] transition-all shadow-soft"
        >
          Restart
        </button>
      </div>

      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40">
          <div className="glass-panel w-full max-w-md rounded-lg p-6 shadow-medium border-4 border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] bg-[var(--color-bg)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display text-[var(--color-text)]">Share</h2>
              <button
                onClick={() => setIsShareOpen(false)}
                className="text-sm font-accent text-[var(--color-text)]/70 hover:text-[var(--color-accent)]"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={shareWhatsApp}
                className="w-full h-12 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white rounded-full font-bold shadow-medium"
              >
                Share to WhatsApp
              </button>
              <button
                onClick={shareInstagram}
                className="w-full h-12 bg-white text-[var(--color-accent)] border-2 border-[var(--color-secondary)] rounded-full font-bold shadow-soft"
              >
                Share to Instagram
              </button>
              <button
                onClick={shareGmail}
                className="w-full h-12 bg-white text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-full font-bold shadow-soft"
              >
                Share via Gmail
              </button>
            </div>

            <p className="mt-4 text-xs text-[var(--color-text)]/60 font-accent">
              If your browser supports the Web Share API, Mémoire will share the JPG directly. Otherwise, you’ll be prompted to download and upload manually.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPage;
