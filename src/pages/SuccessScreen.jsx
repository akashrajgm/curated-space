import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Center, PresentationControls, Torus } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useSystem } from '../context/SystemContext';

export default function SuccessScreen() {
  const navigate = useNavigate();
  const { performanceMode } = useSystem();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      
      {/* 3D Cinematic Render Engine */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
           <ambientLight intensity={1} />
           <directionalLight position={[5, 10, 5]} intensity={2.5} color="#eab308" />
           <PresentationControls global rotation={[0, 0.5, 0]} polar={[-0.2, 0.2]} azimuth={[-1, 1]} config={{ mass: 2, tension: 400 }} snap={{ mass: 4, tension: 400 }}>
              <Center>
                <Torus args={[2.5, 0.4, 64, 128]} scale={1.2}>
                   <meshPhysicalMaterial color="#fef3c7" metalness={0.8} roughness={0.1} clearcoat={1} clearcoatRoughness={0} />
                </Torus>
              </Center>
           </PresentationControls>
           {!performanceMode && (
             <EffectComposer>
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={2.5} mipmapBlur />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
             </EffectComposer>
           )}
        </Canvas>
      </div>

      {/* Narrative Overlay Map */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
         <motion.h1 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            transition={{ delay: 0.5, duration: 1, ease: [0.76, 0, 0.24, 1] }} 
            style={{ fontSize: '5rem', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-3px', color: '#111827' }}
         >
            Success.
         </motion.h1>
         <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1, duration: 1 }} 
            style={{ fontSize: '1.25rem', color: '#4b5563', marginTop: '1rem', marginBottom: '3rem', fontFamily: 'var(--font-body)', fontWeight: 500 }}
         >
            Architectural space verified and deployed to your ledger.
         </motion.p>
         
         <motion.button 
            onClick={() => navigate('/')} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.5, duration: 0.5 }} 
            className="ghost-button" 
            style={{ 
               border: '1px solid rgba(17, 24, 39, 0.2)', 
               color: '#111827', 
               padding: '1.25rem 2.5rem', 
               borderRadius: '50px',
               fontSize: '1rem',
               fontWeight: 600,
               letterSpacing: '1px',
               textTransform: 'uppercase',
               background: 'rgba(255,255,255,0.5)',
               backdropFilter: 'blur(5px)'
            }}
            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,1)' }}
            whileTap={{ scale: 0.95 }}
         >
            Return to Matrix
         </motion.button>
      </div>
    </motion.div>
  );
}
