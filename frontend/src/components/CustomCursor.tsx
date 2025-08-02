import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    // The cleanup function removes the event listener when the component unmounts.
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []); // The empty array ensures this effect runs only once on mount.


  return (
    <>
      <div
        className="custom-cursor-glow"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className="custom-cursor-dot"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
}; 
export default CustomCursor;