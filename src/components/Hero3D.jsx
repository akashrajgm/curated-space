import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, PresentationControls, Center } from '@react-three/drei';
import { EffectComposer, Vignette, Bloom } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSystem } from '../context/SystemContext';

gsap.registerPlugin(ScrollTrigger);

function MinimalKnot() {
  const mesh = useRef();
  
  useGSAP(() => {
    if(!mesh.current) return;
    
    // Core GSAP Scroll-Telling Integration forcing 3D scale drops bounding to viewport Y 
    gsap.to(mesh.current.rotation, {
      y: Math.PI * 1.5,
      x: Math.PI / 6,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "800px top",
        scrub: 1.2
      }
    });

    gsap.to(mesh.current.scale, {
      x: 0.6, y: 0.6, z: 0.6,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "1000px top",
        scrub: true
      }
    });
  });

  return (
    <Float floatIntensity={1.5} speed={1.2} rotationIntensity={0.4}>
      <Center>
        <mesh ref={mesh} position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
           <torusKnotGeometry args={[1, 0.35, 128, 32]} />
           <meshStandardMaterial color="#b1b4c6" roughness={0.15} metalness={0.8} />
        </mesh>
      </Center>
    </Float>
  );
}

export default function Hero3D() {
  const { performanceMode } = useSystem();
  const headline = "Form. Function.";
  const subhead = "Curated for the Modern Space.";
  const containerRef = useRef();
  
  useGSAP(() => {
     if (performanceMode) return;
     gsap.to(containerRef.current, {
        y: 120, opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
     });
  });

  if (performanceMode) return <div style={{ height: '5vh' }}></div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', marginBottom: '4rem' }} ref={containerRef}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
           <ambientLight intensity={0.6} />
           <directionalLight position={[10, 10, 5]} intensity={1.5} />
           <PresentationControls global rotation={[0, 0.3, 0]} polar={[-0.4, 0.2]} azimuth={[-1, 0.75]} config={{ mass: 2, tension: 400 }} snap={{ mass: 4, tension: 400 }}>
             <MinimalKnot />
           </PresentationControls>
           <Environment preset="city" />
           <EffectComposer>
             <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.2} />
             <Vignette eskil={false} offset={0.15} darkness={1.1} />
           </EffectComposer>
        </Canvas>
      </div>
      
      <div style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', zIndex: 10, pointerEvents: 'none', paddingLeft: '5vw' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', color: 'var(--color-on-surface)', letterSpacing: '-3px', lineHeight: 1, margin: 0 }}>
          {headline.split(' ').map((word, i) => (
             <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '1.5rem' }}>
                <motion.span 
                   style={{ display: 'inline-block' }}
                   initial={{ y: '105%' }} animate={{ y: 0 }} 
                   transition={{ duration: 1, delay: i * 0.15 + 0.2, ease: [0.76, 0, 0.24, 1] }}
                >
                  {word}
                </motion.span>
             </span>
          ))}
        </h1>
        <div style={{ overflow: 'hidden', marginTop: '1.5rem' }}>
           <motion.p 
              initial={{ y: '105%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
              style={{ fontFamily: 'var(--font-body)', fontSize: '1.5rem', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}
           >
              {subhead}
           </motion.p>
        </div>
      </div>
    </div>
  );
}
