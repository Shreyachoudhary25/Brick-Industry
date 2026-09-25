import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-badge">
          <ShieldCheck size={16} />
          <span>Industrial Grade Quality & Testing</span>
        </div>

        <h1 className="hero-title">
          BUILDING STRONGER FOUNDATIONS,<br />
          <span>ONE BRICK AT A TIME.</span>
        </h1>

        <p className="hero-description">
          Engineered for structural durability and timeless architectural appeal. 
          Supplying premium red clay, fly ash, and refractory bricks for residential, 
          commercial, and large-scale industrial projects.
        </p>

        <div className="hero-actions">
          <Link to="/products" className="btn-primary">
            Explore Products <ArrowRight size={18} />
          </Link>
          <Link to="/quote" className="btn-secondary">
            Get a Bulk Quote
          </Link>
        </div>

        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">50M+</span>
            <span className="stat-label">Bricks Delivered</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">35+ MPa</span>
            <span className="stat-label">Compressive Strength</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Kiln Fired Precision</span>
          </div>
        </div>
      </div>
    </section>
  );
}