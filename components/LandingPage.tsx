import React from "react";
import LiquidChrome from "../components/ui/LiquidChrome";

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* FULLSCREEN, CENTERED LIQUID BACKGROUND */}
      <LiquidChrome
        baseColor={[0.97, 0.87, 0.89]}   // ballet slipper pink
        speed={0.2}
        amplitude={0.3}
        frequencyX={5}
        frequencyY={5}
        interactive={true}
        className="absolute inset-0"
      />

      {/* CENTERED LOGO BUTTON */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={onStart}
          className="relative z-10 transition-transform hover:scale-110 active:scale-95"
        >
          {/* Soft glow */}
          <div className="absolute inset-0 blur-[120px] opacity-70 bg-pink-300 rounded-full scale-[2.2]" />

          {/* Logo */}
          <img
            src="/assets/brand/memoire-logo.png"
            alt="Mémoire"
            className="relative w-[600px] md:w-[750px] drop-shadow-2xl"
          />
        </button>
      </div>

    </div>
  );
};

export default LandingPage;
