import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import './FeaturedProducts.css';

export default function FeaturedProducts() {
  return (
    <section className="featured-products-section">
      <div className="featured-inner">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">STRUCTURAL CATALOGUE</span>
            <h2 className="section-title">Our Flagship Bricks</h2>
          </div>
          <Link to="/products" className="link-view-all">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}