import React, {useState, useEffect} from 'react';

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []); 

  return() => {
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
  };

  export default CustomCursor;
// };
