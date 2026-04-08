const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

export const pageVariants = {
  initial: { opacity: 0, scale: isMobile ? 1 : 0.98, filter: isMobile ? 'none' : 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: isMobile ? 'none' : 'blur(0px)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: isMobile 
    ? { opacity: 0, transition: { duration: 0.3 } }
    : { opacity: 0, scale: 0.96, filter: 'blur(10px)', transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }
};
export const buttonTapVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.95 }
};

export const cardHoverVariants = {
  hover: { y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  tap: { scale: 0.98 }
};
