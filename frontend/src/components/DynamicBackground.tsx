import React from 'react';

// --- Color Palette ---
// We only need the dot color here
const DOT_COLOR = '#ffffe3'; // lightYellow

const DynamicBackground = ({ numDots = 50 }) => {
  const dots = Array.from({ length: numDots }).map((_, i) => {
    const size = Math.random() * 2.5 + 0.5; // Random size between 0.5px and 3px
    const style = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: DOT_COLOR,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 20 + 15}s`, // Random duration between 15s and 35s
      animationDelay: `${Math.random() * 10}s`, // Random start delay up to 10s
    };
    return <div key={i} className="dot-roamer" style={style} />;
  });

  return <div className="absolute inset-0 w-full h-full overflow-hidden">{dots}</div>;
};

export default DynamicBackground;