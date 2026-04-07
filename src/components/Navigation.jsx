import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Magnetic from './Magnetic';
import '../styles/layout.css';

export default function Navigation() {
  const { user } = useAuth();
  
  return (
    <nav className="site-navigation">
      <Magnetic><NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Storefront</NavLink></Magnetic>
      <Magnetic><NavLink to="/collections" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Collections</NavLink></Magnetic>
      <Magnetic><NavLink to="/interior-design" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Interior Design</NavLink></Magnetic>
      <Magnetic><NavLink to="/spaces" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Spaces</NavLink></Magnetic>
      <Magnetic><NavLink to="/journal" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Journal</NavLink></Magnetic>
      
      {user && String(user.role).toLowerCase() === 'vendor' && (
         <Magnetic><NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Vendor Edge</NavLink></Magnetic>
      )}
    </nav>
  );
}
