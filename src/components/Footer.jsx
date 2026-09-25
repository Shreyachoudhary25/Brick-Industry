import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        
        <div className="footer-col brand-col">
          <Link to="/" className="brand-logo footer-logo">
            <div className="logo-icon">
              <Hammer size={18} color="#FAF9F6" />
            </div>
            <span className="brand-name">BRICK<span>WORKS</span></span>
          </Link>
          <p className="footer-desc">
            Industrial masonry manufacturer delivering precision kiln-fired clay, 
            fly ash, and refractory units for residential and commercial infrastructure.
          </p>
          <div className="footer-compliance">
            <span>IS 1077 : 1992 Compliant</span>
            <span>ASTM C62 Standard</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About the Kiln</Link></li>
            <li><Link to="/products">Product Catalogue</Link></li>
            <li><Link to="/gallery">Production Gallery</Link></li>
            <li><Link to="/quote">Request a Quote</Link></li>
          </ul>
        </div>

        {/* Product Types */}
        <div className="footer-col">
          <h4 className="footer-title">Product Lines</h4>
          <ul className="footer-links">
            <li><Link to="/products">Wire-Cut Red Bricks</Link></li>
            <li><Link to="/products">High-Density Fly Ash</Link></li>
            <li><Link to="/products">Refractory Fire Bricks</Link></li>
            <li><Link to="/products">Heavy Interlocking Pavers</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h4 className="footer-title">Plant & Sales Desk</h4>
          <ul className="footer-contact">
            <li>
              <MapPin size={18} />
              <span>Industrial Corridor, Sector 4, Brickfield Zone</span>
            </li>
            <li>
              <Phone size={18} />
              <span>+91 98765 43210 / +91 98765 43211</span>
            </li>
            <li>
              <Mail size={18} />
              <span>dispatch@brickworks.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© 2026 BRICKWORKS Heavy Industries. All rights reserved.</p>
          <p className="footer-note">Engineered for durability.</p>
        </div>
      </div>
    </footer>
  );
}