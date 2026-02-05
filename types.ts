export enum AppScreen {
  LANDING = 'LANDING',
  THEME = 'THEME',
  LAYOUT = 'LAYOUT',
  CAPTURE = 'CAPTURE',
  EDITING = 'EDITING',
  EXPORT = 'EXPORT',
}

export enum ThemeKey {
  COQUETTE = 'COQUETTE',
  VALENTINES = 'VALENTINES',
  SUMMER_FRUITS = 'SUMMER_FRUITS',
  CHERRY_GIRL = 'CHERRY_GIRL',
  BOSS_BABE = 'BOSS_BABE',
}

export interface ThemeConfig {
  key: ThemeKey;
  name: string;
  uiCardUrl: string;
  backgroundMainUrl: string;
  backgroundAltUrl: string;
  stickers: string[];
  themeClassName: string;
}

export interface StickerInstance {
  id: string;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface Template {
  canvasWidth: number;
  canvasHeight: number;
  frameImageUrl: string;
  previewImageUrl: string; // thumbnail for layout picker
  slotDefinitions: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}
