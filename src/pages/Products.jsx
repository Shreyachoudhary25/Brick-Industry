import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Products.css';

const categories = ["All", "Clay Bricks", "Eco Bricks", "Industrial", "Paving"];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="products-page">
      
      <section className="products-banner">
        <div className="products-banner-inner">
          <span className="section-eyebrow" style={{ color: 'var(--color-warm-beige)' }}>
            DIRECT PRODUCT CATALOGUE
          </span>
          <h1 className="banner-title">Engineered Masonry Units</h1>
          <p className="banner-desc">
            Explore kiln-fired structural bricks, eco-cured fly ash blocks, and refractory 
            materials manufactured under strict IS and ASTM industrial testing.
          </p>
        </div>
      </section>

      
      <div className="products-container">
        {/* Search & Filter Toolbar */}
        <div className="filter-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by brick type, spec or use..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-chips">
            {categories.map((category) => (
              <button
                key={category}
                className={`chip-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        
        <div className="results-count">
          Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length === 1 ? '' : 's'}
        </div>

        
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <SlidersHorizontal size={40} />
            <h3>No products found</h3>
            <p>Try resetting your search query or picking another category filter.</p>
            <button 
              className="btn-secondary" 
              style={{ color: 'var(--color-dark)', borderColor: 'var(--color-deep-brown)' }}
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}