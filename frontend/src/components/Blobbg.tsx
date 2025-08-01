import React from 'react';

// --- Color Palette ---
const COLORS = {
  lightYellow: "#ffffe3",
  midnightGreen: "#003642",
  teaGreen: "#d0e6a5",
  cadetGray: "#83a0a0",
};

const AnimatedBlobBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <div
        className="absolute w-[40vw] h-[40vw] rounded-full filter blur-3xl opacity-20 revolve-1"
        style={{ backgroundColor: COLORS.teaGreen }}
      />
      <div
        className="absolute w-[30vw] h-[30vw] rounded-full filter blur-3xl opacity-15 revolve-2"
        style={{ backgroundColor: COLORS.cadetGray }}
      />
      <div
        className="absolute w-[25vw] h-[25vw] rounded-full filter blur-2xl opacity-10 revolve-3"
        style={{ backgroundColor: COLORS.lightYellow }}
      />
    </div>
  );
};

export default AnimatedBlobBackground;