import React, { useState, useCallback } from 'react';
import { AppScreen, ThemeKey, StickerInstance, Template } from './types';
import { THEMES } from './constants';

import {
  VERTICAL_2,
  VERTICAL_3,
  VERTICAL_4,
  STAGGERED_2x2,
} from './templates';

import LandingPage from './components/LandingPage';
import CapturePage from './components/CapturePage';
import LayoutSelection from './components/LayoutSelection';
import ThemeSelection from './components/ThemeSelection';
import EditorCanvas from './components/EditorCanvas';
import ExportPage from './components/ExportPage';

const AVAILABLE_TEMPLATES: Template[] = [
  VERTICAL_2,
  VERTICAL_3,
  VERTICAL_4,
  STAGGERED_2x2,
];

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.LANDING);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [template, setTemplate] = useState<Template>(AVAILABLE_TEMPLATES[0]);
  const [theme, setTheme] = useState<ThemeKey>(ThemeKey.VALENTINES);
  const [stickers, setStickers] = useState<StickerInstance[]>([]);
  const [finalResult, setFinalResult] = useState<string | null>(null);

  const resetApp = useCallback(() => {
    setScreen(AppScreen.LANDING);
    setCapturedPhotos([]);
    setTemplate(AVAILABLE_TEMPLATES[0]);
    setTheme(ThemeKey.VALENTINES);
    setStickers([]);
    setFinalResult(null);
  }, []);

  const applyThemeToBody = useCallback((t: ThemeKey) => {
    const themeClass = THEMES[t]?.themeClassName;
    document.body.classList.remove(
      'theme-valentines',
      'theme-coquette',
      'theme-cherry',
      'theme-summer',
      'theme-boss',
    );
    if (themeClass) document.body.classList.add(themeClass);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.LANDING:
        return <LandingPage onStart={() => setScreen(AppScreen.THEME)} />;

      case AppScreen.CAPTURE:
        return (
          <CapturePage
            targetCount={template.slotDefinitions.length}
            existingPhotos={capturedPhotos}
            onBack={() => setScreen(AppScreen.LAYOUT)}
            onCaptureComplete={(photos) => {
              setCapturedPhotos(photos);
              setScreen(AppScreen.EDITING);
            }}
          />
        );

      case AppScreen.LAYOUT:
        return (
          <LayoutSelection
            templates={AVAILABLE_TEMPLATES}
            onBack={() => setScreen(AppScreen.THEME)}
            onComplete={(tpl) => {
              setTemplate(tpl);
              setCapturedPhotos([]);
              setStickers([]);
              setScreen(AppScreen.CAPTURE);
            }}
          />
        );

      case AppScreen.THEME:
        return (
          <ThemeSelection
            onComplete={(t) => {
              setTheme(t);
              applyThemeToBody(t);
              setScreen(AppScreen.LAYOUT);
            }}
            onBack={() => setScreen(AppScreen.LANDING)}
          />
        );

      case AppScreen.EDITING:
        return (
          <EditorCanvas
            selectedPhotos={capturedPhotos}
            template={template}
            theme={theme}
            stickers={stickers}
            onStickersUpdate={setStickers}
            onBack={() => setScreen(AppScreen.CAPTURE)}
            onComplete={(dataUrl) => {
              setFinalResult(dataUrl);
              setScreen(AppScreen.EXPORT);
            }}
          />
        );

      case AppScreen.EXPORT:
        return (
          <ExportPage
            imageUrl={finalResult || ''}
            theme={theme}
            onBack={() => setScreen(AppScreen.EDITING)}
            onReset={resetApp}
          />
        );

      default:
        return <LandingPage onStart={() => setScreen(AppScreen.THEME)} />;
    }
  };

  return (
    <>
      {screen === AppScreen.LANDING ? (
        renderScreen()
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-bg)]">
          <div className="max-w-[1200px] w-full mx-auto">{renderScreen()}</div>
        </div>
      )}
    </>
  );
};

export default App;
