import { Template } from '../types';

export const GRID_2x2: Template = {
  canvasWidth: 1080,
  canvasHeight: 1920,
  frameImageUrl: 'assets/frames/grid2x2.png',
  previewImageUrl: 'public/assets/layouts/grid2x2.png',

  slotDefinitions: [
    { x: 108, y: 192, width: 414, height: 414 },
    { x: 558, y: 192, width: 414, height: 414 },
    { x: 108, y: 642, width: 414, height: 414 },
    { x: 558, y: 642, width: 414, height: 414 },
  ],
};
