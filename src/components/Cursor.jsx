import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { snapSound, clickSound } from '../utils/soundscape';

export default function Cursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Directly mapping state for 0-latency tracking
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const requestRef = useRef();
  
  // High precision tracking ring for the "snappy" trailing effect
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  const smoothRingX = useSpring(ringX, { stiffness: 800, damping: 40, mass: 0.1 });
  const smoothRingY = useSpring(ringY, { stiffness: 800, damping: 40, mass: 0.1 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let hoverTarget = null;
    let targetX = -100;
    let targetY = -100;

    const animateCursor = () => {
       setCursorPos({ x: targetX, y: targetY });
       requestRef.current = requestAnimationFrame(animateCursor);
    };

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      ringX.set(e.clientX);
      ringY.set(e.clientY);

      const hit = e.target.closest('a, button, input, select, textarea, .ghost-button, .card-hover, [role="button"]');
      if (hit !== hoverTarget) {
         hoverTarget = hit;
         if (hit) {
            setIsHovered(true);
            snapSound.play();
         } else {
            setIsHovered(false);
         }
      }
    };

    const handleClick = () => {
      clickSound.play();
      setPulse(true);
      setTimeout(() => setPulse(false), 150);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleClick);
    requestRef.current = requestAnimationFrame(animateCursor);
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
      cancelAnimationFrame(requestRef.current);
      document.body.style.cursor = 'auto';
    };
  }, [ringX, ringY]);

  return (
    <>
       <style>
          {`
             * { cursor: none !important; }
          `}
       </style>
       
       {/* High Performance Primary Dot (0 Lag) */}
       <div
         style={{
           position: 'fixed',
           top: 0,
           left: 0,
           transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate3d(-50%, -50%, 0)`,
           zIndex: 999999,
           pointerEvents: 'none',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           width: '6px',
           height: '6px',
           borderRadius: '50%',
           backgroundColor: 'var(--color-primary)',
           transition: 'transform 0s'
         }}
       />

       {/* Secondary Difference Ring */}
       <motion.div
         style={{
           position: 'fixed',
           top: 0,
           left: 0,
           x: smoothRingX,
           y: smoothRingY,
           zIndex: 999998,
           pointerEvents: 'none',
           mixBlendMode: 'difference',
         }}
       >
          <motion.div
            animate={{
               width: isHovered ? 60 : 40,
               height: isHovered ? 60 : 40,
               backgroundColor: isHovered ? '#fff' : 'transparent',
               border: isHovered ? '0px solid transparent' : '1px solid rgba(255,255,255,1)',
               scale: pulse ? 0.8 : 1,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
               position: 'absolute',
               top: 0, left: 0,
               x: '-50%',
               y: '-50%',
               borderRadius: '50%',
            }}
          />
       </motion.div>
    </>
  );
}
