import React from 'react';
import { ShieldCheck, Truck, Factory, Award } from 'lucide-react';
import './WhyChooseUs.css';

const reasons = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Tested Compressive Strength",
    description: "Every batch undergoes rigorous hydraulic press testing to ensure load-bearing compliance above standard IS codes."
  },
  {
    icon: <Factory size={28} />,
    title: "High-Volume Capacity",
    description: "Automated extrusion lines and continuous tunnel kilns allow consistent production exceeding 100,000 units daily."
  },
  {
    icon: <Truck size={28} />,
    title: "Direct Site Logistics",
    description: "Dedicated transport fleet delivering directly to urban commercial sites and rural infrastructure hubs on schedule."
  },
  {
    icon: <Award size={28} />,
    title: "Consistent Geometry & Edges",
    description: "Precision wire-cut tooling minimizes mortar consumption and ensures plumb, aesthetically sharp masonry lines."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="why-inner">
        <div className="why-header">
          <span className="section-eyebrow">INDUSTRIAL ADVANTAGE</span>
          <h2 className="why-title">Why Construction Leaders Partner With Us</h2>
          <p className="why-subtitle">
            Reliability at scale. We eliminate site delays with uniform curing, zero brittle waste, and guaranteed delivery timelines.
          </p>
        </div>

        <div className="why-grid">
          {reasons.map((item, index) => (
            <div key={index} className="why-card">
              <div className="why-icon-box">{item.icon}</div>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}