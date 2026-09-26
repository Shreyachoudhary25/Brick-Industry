import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, BrickWall } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="logo-icon">
            <BrickWall size={20} color="#FAF9F6" />
          </div>
          <span className="brand-name">JBBT<span>BI</span></span>
        </Link>

        <NavLink to="/calculator" className="nav-link">
  Calculator
</NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            About
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Products
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Gallery
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Contact
          </NavLink>
        </nav>

        <div className="nav-cta">
          <Link to="/quote" className="btn-quote">
            Get a Quote
          </Link>
        </div>

        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="mobile-menu">
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/products" onClick={closeMenu}>Products</NavLink>
          <NavLink to="/gallery" onClick={closeMenu}>Gallery</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <Link to="/quote" className="btn-quote mobile-btn" onClick={closeMenu}>
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  );
}