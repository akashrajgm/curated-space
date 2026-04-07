import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';

function VoidGeometry() {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.x -= delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <dodecahedronGeometry args={[1.75, 0]} />
      <meshStandardMaterial color="#888c99" wireframe={true} transparent opacity={0.6} />
    </mesh>
  );
}

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '6rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100vw', height: '350px', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
         <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
           <ambientLight intensity={0.5} />
           <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
           <VoidGeometry />
           <Environment preset="city" />
           <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.2} far={10} color="#000" />
         </Canvas>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', marginTop: '-2rem', position: 'relative', zIndex: 10 }}>404</h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', color: 'var(--color-on-surface-variant)', marginTop: '0.5rem', marginBottom: '3rem' }}>The requested spatial construct does not explicitly render into existence.</p>
      <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" className="primary-cta" onClick={() => navigate('/')}>
         Return to Base Grid
      </motion.button>
    </motion.div>
  );
}
