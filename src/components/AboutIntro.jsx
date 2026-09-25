import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import './AboutIntro.css';

export default function AboutIntro() {
  const highlights = [
    "Industrial Kiln Fired at 1050°C",
    "Stringent Lab Compression Testing",
    "Continuous Fleet for Bulk Site Delivery",
    "IS / ASTM Certified Manufacturing Specs"
  ];

  return (
    <section className="about-intro-section">
      <div className="about-intro-inner">
        <div className="about-image-col">
          <div className="image-frame">
            <img 
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" 
              alt="Brick Kiln and Construction" 
            />
          </div>
          <div className="experience-badge">
            <span className="badge-years">25+</span>
            <span className="badge-text">Years of Masonry Heritage</span>
          </div>
        </div>

        <div className="about-text-col">
          <span className="section-eyebrow">OUR STORY & CRAFT</span>
          <h2 className="section-title">Reliable Construction Materials Engineered to Last Generations.</h2>
          <p className="section-paragraph">
            From automated clay preparation to precision tunnel kiln firing, our operations combine 
            proven masonry traditions with modern structural testing. We deliver reliable compressive strength, 
            sharp edges, and minimal efflorescence directly to builders, contractors, and developers.
          </p>

          <ul className="about-checklist">
            {highlights.map((item, index) => (
              <li key={index} className="check-item">
                <CheckCircle2 size={18} color="#A63D2F" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}