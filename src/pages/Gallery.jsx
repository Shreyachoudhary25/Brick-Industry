import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import './Gallery.css';

const galleryItems = [
  {
    id: 1,
    title: "Continuous Tunnel Kiln Line",
    category: "Kiln & Firing",
    url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Raw Clay De-Airing & Extruder",
    category: "Machinery",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Commercial Site Direct Offloading",
    category: "Logistics",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    title: "Wire-Cut Red Bricks Curing",
    category: "Products",
    url: "https://images.unsplash.com/photo-1584463699028-5e855581b83d?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    title: "High-Density Pallet Stacking",
    category: "Logistics",
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 6,
    title: "Refractory Thermal Blocks",
    category: "Products",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
  }
];

const categories = ["All", "Kiln & Firing", "Machinery", "Products", "Logistics"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeImage, setActiveImage] = useState(null);

  const filteredItems = selectedCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="gallery-page">
      <section className="gallery-banner">
        <div className="gallery-banner-inner">
          <span className="section-eyebrow" style={{ color: 'var(--color-warm-beige)' }}>
            FACILITY & FIELD ARCHIVE
          </span>
          <h1 className="banner-title">Manufacturing Operations</h1>
          <p className="banner-desc">
            Visual documentation of raw material extraction, automated extrusion, 
            high-heat kiln firing, and multi-fleet site dispatches.
          </p>
        </div>
      </section>

      <div className="gallery-container">
    
        <div className="gallery-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-main-grid">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="gallery-card"
              onClick={() => setActiveImage(item)}
            >
              <img src={item.url} alt={item.title} loading="lazy" />
              <div className="gallery-overlay">
                <ZoomIn size={24} color="#FAF9F6" />
                <span className="gallery-item-title">{item.title}</span>
                <span className="gallery-item-cat">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeImage && (
        <div className="modal-backdrop" onClick={() => setActiveImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveImage(null)}>
              <X size={24} />
            </button>
            <img src={activeImage.url} alt={activeImage.title} />
            <div className="modal-info">
              <h3>{activeImage.title}</h3>
              <p>Category: {activeImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}