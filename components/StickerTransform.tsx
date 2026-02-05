import React, { useRef, useState } from 'react';
import { StickerInstance } from '.././types';

interface Props {
  sticker: StickerInstance;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<StickerInstance>) => void;
  onRemove: () => void;
}

const HANDLE_SIZE = 10;
const ROTATE_OFFSET = 24;
const ROTATE_SIZE = 14;

type Mode = 'move' | 'scale' | 'rotate' | null;

interface InteractionState {
  mode: Mode;
  pointerId: number | null;
  startClientX: number;
  startClientY: number;
  startXPercent: number;
  startYPercent: number;
  startScale: number;
  startRotation: number;
  centerClientX: number;
  centerClientY: number;
  startRadius: number;
}

const StickerTransform: React.FC<Props> = ({
  sticker,
  isSelected,
  onSelect,
  onChange,
  onRemove,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [interaction, setInteraction] = useState<InteractionState | null>(null);

  const getPreviewRect = () => {
    const el = ref.current?.parentElement;
    return el?.getBoundingClientRect() ?? null;
  };

  const startInteraction = (
    e: React.PointerEvent,
    mode: Mode,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();

    const previewRect = getPreviewRect();
    const selfRect = ref.current?.getBoundingClientRect();
    if (!previewRect || !selfRect) return;

    const centerClientX = selfRect.left + selfRect.width / 2;
    const centerClientY = selfRect.top + selfRect.height / 2;

    const dxFromCenter = e.clientX - centerClientX;
    const dyFromCenter = e.clientY - centerClientY;
    const startRadius = Math.hypot(dxFromCenter, dyFromCenter) || 1;

    const next: InteractionState = {
      mode,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startXPercent: sticker.x,
      startYPercent: sticker.y,
      startScale: sticker.scale,
      startRotation: sticker.rotation,
      centerClientX,
      centerClientY,
      startRadius,
    };

    setInteraction(next);
    (ref.current as HTMLElement).setPointerCapture(e.pointerId);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/c17bd7a4-3a3a-456a-b671-f518aa0f08e2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H-move-scale-rotate',
        location: 'StickerTransform.tsx:pointerDown',
        message: 'pointerDown start transform',
        data: {
          id: sticker.id,
          mode,
          startX: e.clientX,
          startY: e.clientY,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interaction || interaction.pointerId !== e.pointerId) return;
    const { mode } = interaction;
    if (!mode) return;

    const previewRect = getPreviewRect();
    if (!previewRect) return;

    if (mode === 'move') {
      const dx = e.clientX - interaction.startClientX;
      const dy = e.clientY - interaction.startClientY;

      const dxPercent = (dx / previewRect.width) * 100;
      const dyPercent = (dy / previewRect.height) * 100;

      onChange({
        x: interaction.startXPercent + dxPercent,
        y: interaction.startYPercent + dyPercent,
      });
    } else if (mode === 'scale') {
      const dxFromCenter = e.clientX - interaction.centerClientX;
      const dyFromCenter = e.clientY - interaction.centerClientY;
      const radius = Math.hypot(dxFromCenter, dyFromCenter) || 1;
      const factor = radius / interaction.startRadius;
      const nextScale = Math.max(0.2, Math.min(4, interaction.startScale * factor));
      onChange({ scale: nextScale });
    } else if (mode === 'rotate') {
      const angleRad = Math.atan2(
        e.clientY - interaction.centerClientY,
        e.clientX - interaction.centerClientX,
      );
      const startAngleRad = Math.atan2(
        interaction.startClientY - interaction.centerClientY,
        interaction.startClientX - interaction.centerClientX,
      );
      const deltaDeg = ((angleRad - startAngleRad) * 180) / Math.PI;
      const nextRotation = interaction.startRotation + deltaDeg;
      onChange({ rotation: nextRotation });
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/c17bd7a4-3a3a-456a-b671-f518aa0f08e2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H-move-scale-rotate',
        location: 'StickerTransform.tsx:pointerMove',
        message: 'pointerMove applying transform',
        data: {
          id: sticker.id,
          mode,
          clientX: e.clientX,
          clientY: e.clientY,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
  };

  const endInteraction = (e: React.PointerEvent) => {
    if (interaction && interaction.pointerId === e.pointerId) {
      (ref.current as HTMLElement).releasePointerCapture(e.pointerId);
    }
    setInteraction(null);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/c17bd7a4-3a3a-456a-b671-f518aa0f08e2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H-move-scale-rotate',
        location: 'StickerTransform.tsx:pointerUp',
        message: 'pointerUp end transform',
        data: {
          id: sticker.id,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
  };

  const onWrapperPointerDown = (e: React.PointerEvent) => {
    startInteraction(e, 'move');
  };

  const onScalePointerDown = (e: React.PointerEvent) => {
    startInteraction(e, 'scale');
  };

  const onRotatePointerDown = (e: React.PointerEvent) => {
    startInteraction(e, 'rotate');
  };

  return (
    <div
      ref={ref}
      onPointerDown={onWrapperPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
      style={{
        position: 'absolute',
        left: `${sticker.x}%`,
        top: `${sticker.y}%`,
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
        transformOrigin: 'center center',
        zIndex: isSelected ? 20 : 10,
        cursor: interaction?.mode === 'move' ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        touchAction: 'none',
      }}
    >
      <img
        src={sticker.src}
        className="w-20 h-20 object-contain drop-shadow-md pointer-events-none"
      />

      {isSelected && (
        <button
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove();
          }}
          className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs pointer-events-auto"
        >
          ✕
        </button>
      )}

      {isSelected && (
        <div className="absolute inset-0 border-2 border-white pointer-events-none rounded-sm" />
      )}

      {isSelected && (
        <>
          {/* Top-left */}
          <div
            onPointerDown={onScalePointerDown}
            className="absolute bg-white border border-[var(--color-border)] rounded-sm"
            style={{
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              left: -HANDLE_SIZE / 2,
              top: -HANDLE_SIZE / 2,
              pointerEvents: 'auto',
            }}
          />
          {/* Top-right */}
          <div
            onPointerDown={onScalePointerDown}
            className="absolute bg-white border border-[var(--color-border)] rounded-sm"
            style={{
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              right: -HANDLE_SIZE / 2,
              top: -HANDLE_SIZE / 2,
              pointerEvents: 'auto',
            }}
          />
          {/* Bottom-left */}
          <div
            onPointerDown={onScalePointerDown}
            className="absolute bg-white border border-[var(--color-border)] rounded-sm"
            style={{
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              left: -HANDLE_SIZE / 2,
              bottom: -HANDLE_SIZE / 2,
              pointerEvents: 'auto',
            }}
          />
          {/* Bottom-right */}
          <div
            onPointerDown={onScalePointerDown}
            className="absolute bg-white border border-[var(--color-border)] rounded-sm"
            style={{
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              right: -HANDLE_SIZE / 2,
              bottom: -HANDLE_SIZE / 2,
              pointerEvents: 'auto',
            }}
          />
        </>
      )}

      {isSelected && (
        <div
          onPointerDown={onRotatePointerDown}
          className="absolute bg-white rounded-full shadow-md flex items-center justify-center pointer-events-auto"
          style={{
            width: ROTATE_SIZE,
            height: ROTATE_SIZE,
            left: '50%',
            top: -ROTATE_OFFSET,
            transform: 'translateX(-50%)',
          }}
        />
      )}
    </div>
  );
};

export default StickerTransform;
