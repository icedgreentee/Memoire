import { Template } from '../types';

export const VERTICAL_2: Template = {
  canvasWidth: 1080,
  canvasHeight: 1920,
  frameImageUrl: '/assets/frames/vertical2.png',
  previewImageUrl: 'assets/layouts/vertical2.png',

  slotDefinitions: [
    // Tuned so that:
    // - gap between slots is larger (more breathing room)
    // - slots are slightly wider
    // - used together with rounded clipping in the canvas
    { x: 123, y: 212, width: 834, height: 728 },
    { x: 123, y: 1020, width: 834, height: 728 },
  ],
};
