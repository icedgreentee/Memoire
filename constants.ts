import { ThemeKey, ThemeConfig } from './types.ts';

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  [ThemeKey.COQUETTE]: {
    key: ThemeKey.COQUETTE,
    name: 'Coquette',
    uiCardUrl: '/assets/themes/coquette/ui/theme-card-1080x1080.png',
    backgroundMainUrl: '/assets/themes/coquette/backgrounds/main-1080x1920.png',
    backgroundAltUrl: '/assets/themes/coquette/backgrounds/alt-1080x1920.png',
    stickers: [
      '/assets/themes/coquette/stickers/bow.png',
      '/assets/themes/coquette/stickers/bow2.png',
      '/assets/themes/coquette/stickers/bunny.png',
      '/assets/themes/coquette/stickers/cuteflower.png',
    ],
    themeClassName: 'theme-coquette',
  },

  [ThemeKey.VALENTINES]: {
    key: ThemeKey.VALENTINES,
    name: 'Valentines',
    uiCardUrl: '/assets/themes/valentines/ui/theme-card-1080x1080.png',
    backgroundMainUrl: '/assets/themes/valentines/backgrounds/main-1080x1920.png',
    backgroundAltUrl: '/assets/themes/valentines/backgrounds/alt-1080x1920.png',
    stickers: [
      '/assets/themes/valentines/stickers/cupid.png',
      '/assets/themes/valentines/stickers/flower.png',
      '/assets/themes/valentines/stickers/heart.png',
      '/assets/themes/valentines/stickers/valday.png',
    ],
    themeClassName: 'theme-valentines',
  },

  [ThemeKey.SUMMER_FRUITS]: {
    key: ThemeKey.SUMMER_FRUITS,
    name: 'Summer Fruits',
    uiCardUrl: '/assets/themes/summerfruits/ui/theme-card-1080x1080.png',
    backgroundMainUrl: '/assets/themes/summerfruits/backgrounds/main-1080x1920.png',
    backgroundAltUrl: '/assets/themes/summerfruits/backgrounds/alt-1080x1920.png',
    stickers: [
      '/assets/themes/summerfruits/stickers/flowerblue.png',
      '/assets/themes/summerfruits/stickers/lemon.png',
      '/assets/themes/summerfruits/stickers/lemonsunnies.png',
      '/assets/themes/summerfruits/stickers/seashell.png',
    ],
    themeClassName: 'theme-summer',
  },

  [ThemeKey.CHERRY_GIRL]: {
    key: ThemeKey.CHERRY_GIRL,
    name: 'Cherry Girl',
    uiCardUrl: '/assets/themes/cherrygirl/ui/theme-card-1080x1080.png',
    backgroundMainUrl: '/assets/themes/cherrygirl/backgrounds/main-1080x1920.png',
    backgroundAltUrl: '/assets/themes/cherrygirl/backgrounds/alt-1080x1920.png',
    stickers: [
      '/assets/themes/cherrygirl/stickers/cherry.png',
      '/assets/themes/cherrygirl/stickers/cherrysunnies.png',
      '/assets/themes/cherrygirl/stickers/pixelcherry.png',
    ],
    themeClassName: 'theme-cherry',
  },

  [ThemeKey.BOSS_BABE]: {
    key: ThemeKey.BOSS_BABE,
    name: 'Boss Babe',
    uiCardUrl: '/assets/themes/bossbabe/ui/theme-card-1080x1080.png',
    backgroundMainUrl: '/assets/themes/bossbabe/backgrounds/main-1080x1920.png',
    backgroundAltUrl: '/assets/themes/bossbabe/backgrounds/alt-1080x1920.png',
    stickers: [
      '/assets/themes/bossbabe/stickers/advise.png',
      '/assets/themes/bossbabe/stickers/butterfly.png',
      '/assets/themes/bossbabe/stickers/disco.png',
      '/assets/themes/bossbabe/stickers/star.png',
    ],
    themeClassName: 'theme-boss',
  },
};
