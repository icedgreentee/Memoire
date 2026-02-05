import React, { useState, useRef } from 'react';

interface UploadPageProps {
  maxPhotos: number;
  minPhotos: number;
  onComplete: (photos: string[]) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ maxPhotos, minPhotos, onComplete }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxPhotos - photos.length;
    const filesArray = (Array.from(files) as File[]).slice(0, remainingSlots);

    Promise.all(
      filesArray.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          }),
      ),
    ).then((newUrls) => {
      setPhotos((prev) => [...prev, ...newUrls]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const handleRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    setPhotos((prev) => {
      const arr = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= arr.length) return prev;
      const temp = arr[targetIndex];
      arr[targetIndex] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const canContinue = photos.length >= minPhotos;

  return (
    <div className="flex flex-col items-center animate-fadeIn max-w-4xl mx-auto w-full">
      <div className="glass-panel rounded-lg p-8 md:p-10 w-full shadow-medium border-4 border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] mb-10">
        <h2 className="text-3xl md:text-4xl font-display text-[var(--color-text)] mb-2 text-center">
          Upload Your Photos
        </h2>
        <p className="text-[var(--color-text)]/80 font-accent mb-6 text-center">
          Add up to {maxPhotos} shots, then reorder and curate your favorites.
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-16 bg-white border-2 border-dashed border-[var(--color-secondary)] rounded-lg flex items-center justify-center gap-3 text-[var(--color-accent)] font-bold hover:bg-[var(--color-primary)] transition-all"
            >
              <span className="text-2xl">📤</span>
              <span>Upload Photos</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
            />
            <p className="mt-3 text-xs text-[var(--color-text)]/70">
              JPG or PNG, up to {maxPhotos} photos. We recommend at least {minPhotos}.
            </p>
          </div>

          <div className="flex flex-col items-end text-sm text-[var(--color-text)]/70">
            <span className="font-accent">
              {photos.length} / {maxPhotos} selected
            </span>
          </div>
        </div>
      </div>

      <div className="w-full mb-10">
        {photos.length === 0 ? (
          <div className="w-full h-48 rounded-lg border-2 border-dashed border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] flex items-center justify-center text-[var(--color-text)]/70 font-accent bg-white/40">
            Your uploaded photos will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((url, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden shadow-soft bg-[var(--coquette-1)] flex flex-col"
              >
                <div className="relative aspect-[3/4] bg-white">
                  <img
                    src={url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-white/80 text-xs font-bold text-[var(--color-accent)]">
                    #{index + 1}
                  </div>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-white/80">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => movePhoto(index, -1)}
                      disabled={index === 0}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs border border-[var(--color-secondary)] text-[var(--color-accent)] disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(index, 1)}
                      disabled={index === photos.length - 1}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs border border-[var(--color-secondary)] text-[var(--color-accent)] disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-xs text-[var(--color-accent)] underline hover:text-[var(--cherry-3)]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => canContinue && onComplete(photos)}
        className={`w-[280px] h-14 rounded-full font-bold text-lg shadow-medium transition-all ${
          canContinue
            ? 'bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white hover:scale-105'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue to Layout
      </button>
    </div>
  );
};

export default UploadPage;

