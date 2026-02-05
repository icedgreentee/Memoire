
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface CapturePageProps {
  targetCount: number;
  existingPhotos: string[];
  onCaptureComplete: (photos: string[]) => void;
  onBack: () => void;
}

const CapturePage: React.FC<CapturePageProps> = ({ targetCount, existingPhotos, onCaptureComplete, onBack }) => {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      // Reuse existing active stream if possible
      if (streamRef.current && streamRef.current.active) {
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = streamRef.current;
        }
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const v = videoRef.current;
        const playPromise = v.play?.();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => {
            // Autoplay might require interaction; ignore here.
          });
        }
      }
    } catch (err) {
      console.error('Camera fail', err);
    }
  }, []);

  useEffect(() => {
    startCamera();
    setPhotos(existingPhotos);

    return () => {
      // Clean up camera stream when leaving the capture screen
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [startCamera]);

  useEffect(() => {
    setPhotos(existingPhotos);
  }, [existingPhotos]);

  const performCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // If metadata isn't ready yet, skip to avoid capturing a 0x0 frame
    if (!video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    // Reset transform before drawing, then mirror for selfie-style capture
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCurrentPreview(dataUrl);
  };

  const handleTakePhoto = () => {
    // Make sure camera stream is live before capturing
    startCamera().finally(() => {
      setCurrentPreview(null);
      performCapture();
    });
  };

  const handleRetake = () => {
    setCurrentPreview(null);
  };

  const handleKeep = () => {
    if (currentPreview) {
      const updatedPhotos = [...photos, currentPreview];
      setPhotos(updatedPhotos);
      setCurrentPreview(null);

      if (updatedPhotos.length >= targetCount) {
        onCaptureComplete(updatedPhotos);
      }
    }
  };

  const handleRetakeLast = () => {
    if (photos.length === 0) return;
    setPhotos((prev) => prev.slice(0, -1));
    setCurrentPreview(null);
  };

  const progress = (photos.length / targetCount) * 100;

  return (
    <div className="flex flex-col items-center animate-fadeIn max-w-4xl mx-auto w-full">
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-sm font-accent text-[var(--color-text)]/70 hover:text-[var(--color-accent)]"
        >
          ← Back
        </button>
      </div>
      <div className="mb-10 w-full glass-panel p-8 rounded-lg border-b-8 border-[var(--color-secondary)]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-3xl font-display text-[var(--color-text)]">Session in Progress</h2>
            <p className="text-[var(--color-text)]/70 font-accent uppercase tracking-widest text-xs">Shot {Math.min(photos.length + 1, targetCount)} of {targetCount}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-display text-[var(--color-accent)]">{photos.length} / {targetCount}</span>
          </div>
        </div>
        <div className="w-full h-4 bg-[var(--color-primary)] rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative w-full max-w-[800px] aspect-[4/3] bg-black rounded-[48px] border-[16px] border-white overflow-hidden shadow-2xl">
        {!currentPreview ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover" 
            style={{ transform: 'scaleX(-1)' }}
          />
        ) : (
          <div className="w-full h-full relative">
            <img src={currentPreview} className="w-full h-full object-cover animate-fadeIn" alt="Capture Preview" />
            <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-secondary)_10%,transparent)] pointer-events-none"></div>
          </div>
        )}

        {isFlashActive && (
          <div className="absolute inset-0 bg-white z-50"></div>
        )}

        <div className="absolute inset-0 border-[2px] border-white/10 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20"></div>
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/20"></div>
          <div className="absolute inset-12 border border-white/10 rounded-[20px]"></div>
        </div>
      </div>
      
      <div className="mt-12 flex flex-wrap gap-6 h-24 items-center justify-center w-full">
        {!currentPreview && photos.length < targetCount && (
          <button 
            onClick={handleTakePhoto}
            className="group px-16 h-20 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white rounded-full font-bold text-2xl shadow-medium hover:scale-105 active:scale-95 transition-all duration-500 flex items-center gap-6"
          >
            <div className="w-6 h-6 bg-white rounded-full relative">
               <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
            </div>
            TAKE PHOTO {photos.length + 1}
          </button>
        )}

        {!currentPreview && photos.length >= targetCount && (
          <div className="flex gap-4 animate-fadeIn">
            <button
              onClick={handleRetakeLast}
              className="px-12 h-18 bg-white border-4 border-[var(--color-secondary)] text-[var(--color-accent)] rounded-full font-bold text-xl hover:bg-[var(--color-primary)] transition-all duration-300"
            >
              RETAKE LAST
            </button>
            <button
              onClick={() => onCaptureComplete(photos)}
              className="px-16 h-18 bg-[var(--color-accent)] text-white rounded-full font-bold text-2xl shadow-medium hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
            >
              CONTINUE
            </button>
          </div>
        )}

        {currentPreview && (
          <div className="flex gap-4 animate-fadeIn">
            <button 
              onClick={handleRetake}
              className="px-12 h-18 bg-white border-4 border-[var(--color-secondary)] text-[var(--color-accent)] rounded-full font-bold text-xl hover:bg-[var(--color-primary)] transition-all duration-300"
            >
              RETAKE
            </button>
            <button 
              onClick={handleKeep}
              className="px-16 h-18 bg-[var(--color-accent)] text-white rounded-full font-bold text-2xl shadow-medium hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
            >
              {photos.length + 1 === targetCount ? 'FINISH & VIEW' : 'KEEP PHOTO'}
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CapturePage;
