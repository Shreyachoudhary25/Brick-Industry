import React from 'react';
import { Link } from 'react-router-dom';
import { Ruler, ShieldCheck, ArrowUpRight } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="card-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="card-badge">{product.category}</span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">{product.description}</p>

        <div className="card-specs">
          <div className="spec-item">
            <Ruler size={14} />
            <span>{product.size}</span>
          </div>
          <div className="spec-item">
            <ShieldCheck size={14} />
            <span>{product.strength}</span>
          </div>
        </div>

        <div className="card-footer">
          <Link to={`/quote?product=${encodeURIComponent(product.name)}`} className="btn-card-quote">
            Request Quote <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}