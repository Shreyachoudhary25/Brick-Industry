import React from 'react';
import { Flame, ShieldCheck, Cog, Award, CheckCircle2 } from 'lucide-react';
import './About.css';

export default function About() {
  const infraStats = [
    { label: "Daily Production Capacity", value: "120,000 Units" },
    { label: "Tunnel Kiln Firing Temp", value: "Up to 1050°C" },
    { label: "Automated Extrusion Lines", value: "2 High-Pressure Lines" },
    { label: "Testing Compliance", value: "IS 1077 & ASTM C62" }
  ];

  const standards = [
    {
      title: "Hydraulic Compressive Testing",
      desc: "Every production batch undergoes destructive testing to ensure load capacity exceeds IS Class 35 parameters."
    },
    {
      title: "Water Absorption & Porosity Control",
      desc: "Systematic chamber curing keeps absorption strictly below 15%, preventing moisture ingress and frost spalling."
    },
    {
      title: "Efflorescence & Salt Testing",
      desc: "Distilled water evaporation tests guarantee negligible soluble alkali salts, eliminating unsightly surface staining."
    },
    {
      title: "Laser-Guided Dimensional Uniformity",
      desc: "Precision wire cutters maintain structural tolerances within ±2mm, saving significant on-site mortar."
    }
  ];

  return (
    <div className="about-page">
      
      <section className="about-banner">
        <div className="about-banner-inner">
          <span className="section-eyebrow" style={{ color: 'var(--color-warm-beige)' }}>
            HEAVY INDUSTRIAL MANUFACTURING
          </span>
          <h1 className="banner-title">Our Plant, Heritage & Standards</h1>
          <p className="banner-desc">
            Bridging geotechnical clay science with advanced tunnel kiln automation to produce 
            certified masonry units for high-load structural applications.
          </p>
        </div>
      </section>

      
      <section className="about-content-section">
        <div className="about-content-inner">
          <div className="about-narrative">
            <span className="section-eyebrow">ESTABLISHED HERITAGE</span>
            <h2>Decades of Fired Clay Engineering</h2>
            <p>
              Founded to supply durable masonry for regional urban infrastructure, our plant has evolved 
              from traditional clamp kilns to high-throughput, continuous-fired tunnel kiln facilities.
            </p>
            <p>
              We source purified silt and secondary clays directly from licensed quarries, blending them 
              with eco-conscious fly ash and silica additives. Our fully enclosed chamber drying eliminates 
              dependence on weather, delivering year-round dispatch consistency to major developers.
            </p>

            <div className="infra-grid">
              {infraStats.map((stat, idx) => (
                <div key={idx} className="infra-card">
                  <span className="infra-val">{stat.value}</span>
                  <span className="infra-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-visual">
            <img 
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" 
              alt="Industrial Manufacturing Machinery" 
              className="about-plant-img"
            />
            <div className="about-visual-overlay">
              <Flame size={24} color="#FAF9F6" />
              <div>
                <strong>Continuous Firing Line</strong>
                <p>Consistent temperature vitrification throughout 80-meter tunnel kiln.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="standards-section">
        <div className="standards-inner">
          <div className="standards-header">
            <span className="section-eyebrow" style={{ color: 'var(--color-brick-red)' }}>
              LABORATORY ASSURANCE
            </span>
            <h2 className="section-title">Strict Compliance & Structural Testing</h2>
            <p className="section-subtitle">
              We certify our products so structural engineers, contractors, and architects can build with certainty.
            </p>
          </div>

          <div className="standards-grid">
            {standards.map((std, idx) => (
              <div key={idx} className="standard-card">
                <div className="standard-header">
                  <ShieldCheck size={22} color="#A63D2F" />
                  <h3>{std.title}</h3>
                </div>
                <p>{std.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}