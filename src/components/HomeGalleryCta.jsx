import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import './HomeGalleryCta.css';

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
    title: "Kiln Curing Chambers"
  },
  {
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80",
    title: "Commercial Site Delivery"
  },
  {
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    title: "Wire-Cut Extrusion"
  },
  {
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
    title: "High-Density Stacking"
  }
];

export default function HomeGalleryCta() {
  return (
    <>
      {/* Visual Gallery Preview */}
      <section className="home-gallery-section">
        <div className="home-gallery-inner">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">FACILITY IN ACTION</span>
              <h2 className="section-title">Factory & Site Impressions</h2>
            </div>
            <Link to="/gallery" className="link-view-all">
              Full Gallery <ArrowRight size={16} />
            </Link>
          </div>

          <div className="home-gallery-grid">
            {galleryImages.map((img, index) => (
              <div key={index} className="gallery-thumbnail">
                <img src={img.url} alt={img.title} loading="lazy" />
                <div className="gallery-caption">
                  <ImageIcon size={16} />
                  <span>{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer CTA Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-inner">
          <span className="cta-tag">DIRECT-FROM-KILN SUPPLY</span>
          <h2 className="cta-title">
            Looking for Certified Bricks for Your Next Project?
          </h2>
          <p className="cta-sub">
            From single truckloads to multi-phase commercial construction contracts, 
            we guarantee unyielding quality, scheduled deliveries, and wholesale pricing.
          </p>
          <div className="cta-buttons">
            <Link to="/quote" className="btn-primary">
              Request a Bulk Quote <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Sales Desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}