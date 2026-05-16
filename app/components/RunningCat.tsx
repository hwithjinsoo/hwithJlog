"use client";

import { useEffect, useRef, useState } from "react";

export default function RunningCat() {
  const [position, setPosition] = useState(-100);
  const [direction, setDirection] = useState(1);
  const directionRef = useRef(1);
  const positionRef = useRef(-100);

  useEffect(() => {
    const interval = setInterval(() => {
      const maxWidth = window.innerWidth - 100;
      positionRef.current += directionRef.current * 3;

      if (positionRef.current >= maxWidth) {
        directionRef.current = -1;
        setDirection(-1);
      } else if (positionRef.current <= -100) {
        directionRef.current = 1;
        setDirection(1);
      }

      setPosition(positionRef.current);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-24 overflow-visible">
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: `${position}px`,
          width: "100px",
          height: "100px",
          backgroundImage: "url('/runcat_sheet.png')",
          backgroundSize: "400px 100px",
          imageRendering: "pixelated",
          transform: direction === -1 ? "scaleX(-1)" : "scaleX(1)",
          animation: "catRun 0.4s steps(4) infinite",
        }}
      />
      <style>{`
        @keyframes catRun {
          from { background-position: 0px 0px; }
          to { background-position: -400px 0px; }
        }
      `}</style>
    </div>
  );
}