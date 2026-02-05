import React, { useState, useRef } from 'react';
import { ThemeKey, StickerInstance, Template } from '../types';
import { THEMES } from '../constants';
import StickerTransform from './StickerTransform';

interface Props {
  selectedPhotos: string[];
  template: Template;
  theme: ThemeKey;
  stickers: StickerInstance[];
  onStickersUpdate: (stickers: StickerInstance[]) => void;
  onComplete: (dataUrl: string) => void;
  onBack: () => void;
}

const EXPORT_SCALE = 2;
const SLOT_BORDER_RADIUS = 40; // px at 1x canvas size

const EditorCanvas: React.FC<Props> = ({
  selectedPhotos,
  template,
  theme,
  stickers,
  onStickersUpdate,
  onComplete,
  onBack,
}) => {
  const themeConfig = THEMES[theme];
  const [frameVariant, setFrameVariant] = useState<'main' | 'alt'>('main');
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeBackgroundUrl =
    frameVariant === 'main'
      ? themeConfig.backgroundMainUrl
      : themeConfig.backgroundAltUrl;

  const addSticker = (src: string) => {
    const newSticker: StickerInstance = {
      id: Math.random().toString(36).slice(2),
      src,
      x: 50,
      y: 50,
      rotation: 0,
      scale: 1,
    };
    onStickersUpdate([...stickers, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const updateSticker = (id: string, patch: Partial<StickerInstance>) => {
    onStickersUpdate(
      stickers.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  const removeSticker = (id: string) => {
    onStickersUpdate(stickers.filter((s) => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);

      img.onerror = () => {
        console.error("FAILED TO LOAD IMAGE:", src);
        reject(new Error("Image failed to load: " + src));
      };

      img.src = src;
    });


  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const imgRatio = img.width / img.height;
    const slotRatio = w / h;

    let drawW, drawH, offsetX, offsetY;

    if (imgRatio > slotRatio) {
      drawH = h;
      drawW = drawH * imgRatio;
      offsetX = x + (w - drawW) / 2;
      offsetY = y;
    } else {
      drawW = w;
      drawH = drawW / imgRatio;
      offsetX = x;
      offsetY = y + (h - drawH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  };

  const renderToCanvas = async () => {
    if (isProcessing) return;
    const canvas = canvasRef.current ?? document.createElement('canvas');

    setIsProcessing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const exportWidth = template.canvasWidth * EXPORT_SCALE;
    const exportHeight = template.canvasHeight * EXPORT_SCALE;

    canvas.width = exportWidth;
    canvas.height = exportHeight;

    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/c17bd7a4-3a3a-456a-b671-f518aa0f08e2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'initial',
          hypothesisId: 'H-export',
          location: 'EditorCanvas.tsx:renderToCanvas',
          message: 'export start',
          data: {
            exportWidth,
            exportHeight,
            photosCount: selectedPhotos.length,
            stickersCount: stickers.length,
            templateId: template.id,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion agent log

      const bg = await loadImage(activeBackgroundUrl);
      ctx.drawImage(bg, 0, 0, exportWidth, exportHeight);

      const photos = await Promise.all(
        selectedPhotos.map((p) => loadImage(p))
      );

      template.slotDefinitions.forEach((slot, i) => {
        if (!photos[i]) return;
        const sx = slot.x * EXPORT_SCALE;
        const sy = slot.y * EXPORT_SCALE;
        const sw = slot.width * EXPORT_SCALE;
        const sh = slot.height * EXPORT_SCALE;

        // Clip each photo strictly to its (slightly rounded)
        // slot area so it never bleeds outside the frame
        // openings in the export.
        ctx.save();
        ctx.beginPath();
        const r = Math.min(
          SLOT_BORDER_RADIUS * EXPORT_SCALE,
          sw / 2,
          sh / 2
        );

        // Rounded-rect path
        ctx.moveTo(sx + r, sy);
        ctx.lineTo(sx + sw - r, sy);
        ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + r);
        ctx.lineTo(sx + sw, sy + sh - r);
        ctx.quadraticCurveTo(
          sx + sw,
          sy + sh,
          sx + sw - r,
          sy + sh
        );
        ctx.lineTo(sx + r, sy + sh);
        ctx.quadraticCurveTo(sx, sy + sh, sx, sy + sh - r);
        ctx.lineTo(sx, sy + r);
        ctx.quadraticCurveTo(sx, sy, sx + r, sy);

        ctx.clip();

        drawImageCover(
          ctx,
          photos[i],
          sx,
          sy,
          sw,
          sh
        );

        ctx.restore();
      });

      for (const s of stickers) {
        const img = await loadImage(s.src);
        ctx.save();
        ctx.translate(
          (s.x / 100) * exportWidth,
          (s.y / 100) * exportHeight
        );
        ctx.rotate((s.rotation * Math.PI) / 180);
        const size = 80 * s.scale * EXPORT_SCALE;
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
      }

      const frame = await loadImage(template.frameImageUrl);
      ctx.drawImage(frame, 0, 0, exportWidth, exportHeight);

      onComplete(canvas.toDataURL('image/jpeg', 0.95));
    } catch (err) {
      console.error('Render error', err);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/c17bd7a4-3a3a-456a-b671-f518aa0f08e2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'initial',
          hypothesisId: 'H-export',
          location: 'EditorCanvas.tsx:renderToCanvas',
          message: 'export error',
          data: {
            error: (err as Error)?.message ?? 'unknown',
          },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion agent log
    } finally {
      setIsProcessing(false);
    }
  };

  const previewScale = 0.5;

  return (
    <div className="flex flex-col lg:flex-row gap-12 w-full animate-fadeIn items-start justify-center">
      {/* LEFT PANEL */}
      <div className="w-full lg:w-[320px] glass-panel rounded-lg p-6 flex flex-col shadow-medium">
        <button
          onClick={onBack}
          className="text-sm font-accent text-[var(--color-text)]/70 hover:text-[var(--color-accent)] mb-4"
        >
          ← Back
        </button>

        <h3 className="text-xl font-display text-[var(--color-text)] mb-4">
          Personalize
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setFrameVariant('main')}
            className={`w-12 h-12 rounded-full border-2 bg-cover bg-center ${frameVariant === 'main'
                ? 'border-[var(--color-accent)] scale-105'
                : 'border-white/60'
              }`}
            style={{ backgroundImage: `url(${themeConfig.backgroundMainUrl})` }}
          />
          <button
            onClick={() => setFrameVariant('alt')}
            className={`w-12 h-12 rounded-full border-2 bg-cover bg-center ${frameVariant === 'alt'
                ? 'border-[var(--color-accent)] scale-105'
                : 'border-white/60'
              }`}
            style={{ backgroundImage: `url(${themeConfig.backgroundAltUrl})` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-2 max-h-[350px]">
          {themeConfig.stickers.map((s, i) => (
            <button
              key={i}
              onClick={() => addSticker(s)}
              className="w-full aspect-square bg-white/60 rounded-lg hover:bg-[var(--color-primary)] hover:scale-105 transition-all shadow-soft flex items-center justify-center"
            >
              <img src={s} className="w-16 h-16 object-contain" />
            </button>
          ))}
        </div>

        <button
          onClick={renderToCanvas}
          disabled={isProcessing}
          className="mt-12 w-full h-14 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white rounded-full font-bold shadow-medium hover:scale-105 transition-all"
        >
          {isProcessing ? 'PROCESSING...' : 'FINISH & EXPORT'}
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center">
        <div
          className="relative shadow-medium overflow-hidden rounded-md bg-white border-4 border-white"
          style={{
            width: template.canvasWidth * previewScale,
            height: template.canvasHeight * previewScale,
            backgroundImage: `url(${activeBackgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            pointerEvents: 'auto',
          }}
        >
          {template.slotDefinitions.map((slot, i) => (
            <div
              key={i}
              className="absolute overflow-hidden"
              style={{
                left: slot.x * previewScale,
                top: slot.y * previewScale,
                width: slot.width * previewScale,
                height: slot.height * previewScale,
                borderRadius: SLOT_BORDER_RADIUS * previewScale,
                pointerEvents: 'none',
              }}
            >
              {selectedPhotos[i] && (
                <img
                  src={selectedPhotos[i]}
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}
            </div>
          ))}

          {stickers.map((s) => (
            <StickerTransform
              key={s.id}
              sticker={s}
              isSelected={selectedStickerId === s.id}
              onSelect={() => setSelectedStickerId(s.id)}
              onChange={(patch) => updateSticker(s.id, patch)}
              onRemove={() => removeSticker(s.id)}
            />
          ))}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default EditorCanvas;
