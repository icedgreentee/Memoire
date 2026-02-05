import { Template } from '../types';

export const STAGGERED_2x2: Template = {
  canvasWidth: 1080,
  canvasHeight: 1920,

  // TEMPORARY FIX — use an existing frame until staggered2x2.png exists
  frameImageUrl: '/assets/frames/grid2x2.png',

  previewImageUrl: '/assets/layouts/grid2x2.png',

  slotDefinitions: [
    { x: 108, y: 215, width: 417, height: 650 },
    { x: 108, y: 895, width: 417, height: 650 },
    { x: 555, y: 375, width: 417, height: 650 },
    { x: 555, y: 1055, width: 417, height: 650 },
  ],
};
