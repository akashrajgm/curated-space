import React, { createContext, useContext, useState, useEffect } from 'react';
import { toggleMute } from '../utils/soundscape';

const SysContext = createContext();
export const useSystem = () => useContext(SysContext);

export const SystemProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);

  useEffect(() => {
    toggleMute(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (performanceMode) {
      document.body.classList.add('performance-mode');
    } else {
      document.body.classList.remove('performance-mode');
    }
  }, [performanceMode]);

  return (
    <SysContext.Provider value={{ isMuted, setIsMuted, performanceMode, setPerformanceMode }}>
      {children}
    </SysContext.Provider>
  );
};
