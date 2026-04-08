import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Magnetic from './Magnetic';
import '../styles/layout.css';

export default function Navigation() {
  const { user } = useAuth();

  return (
    <nav className="site-navigation">
      <Magnetic><NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></Magnetic>
      <Magnetic><NavLink to="/collections" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Categories</NavLink></Magnetic>
      <Magnetic><NavLink to="/interior-design" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Design Services</NavLink></Magnetic>
      <Magnetic><NavLink to="/spaces" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Inspiration</NavLink></Magnetic>
      <Magnetic><NavLink to="/journal" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Blog</NavLink></Magnetic>

      {user && String(user?.role).toLowerCase() === 'vendor' && (
        <Magnetic><NavLink to="/vendor/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Seller Dashboard</NavLink></Magnetic>
      )}
    </nav>
  );
}
