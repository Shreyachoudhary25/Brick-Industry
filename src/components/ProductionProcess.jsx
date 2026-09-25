import React from 'react';
import './ProductionProcess.css';

const steps = [
  {
    step: "01",
    title: "Raw Material Sourcing",
    detail: "High-grade silt and silica clay excavated and filtered to remove organic residues."
  },
  {
    step: "02",
    title: "De-Airing & Extrusion",
    detail: "Vacuum de-airing chambers compress raw clay into high-density columns, cut to millimetric precision."
  },
  {
    step: "03",
    title: "Controlled Chamber Drying",
    detail: "Moisture levels systematically brought down to below 2% to eliminate shrinkage cracks."
  },
  {
    step: "04",
    title: "Tunnel Kiln Firing",
    detail: "Fired at temperatures up to 1050°C for uniform vitrification and optimal structural strength."
  },
  {
    step: "05",
    title: "Stress Testing & Logistics",
    detail: "Compression, efflorescence, and water absorption tested before palletizing for dispatch."
  }
];

export default function ProductionProcess() {
  return (
    <section className="process-section">
      <div className="process-inner">
        <div className="process-header">
          <span className="section-eyebrow" style={{ color: '#ff8c7a' }}>HOW IT'S MADE</span>
          <h2 className="process-title">Precision Manufacturing Flow</h2>
          <p className="process-subtitle">
            From raw quarry earth to cured masonry units ready for structural load.
          </p>
        </div>

        <div className="process-steps">
          {steps.map((item, idx) => (
            <div key={idx} className="step-card">
              <span className="step-badge">{item.step}</span>
              <h3 className="step-heading">{item.title}</h3>
              <p className="step-detail">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
