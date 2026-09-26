import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calculator as CalcIcon,
  Download,
  RotateCcw
} from 'lucide-react';
import { products } from '../data/products';
import { generateQuotePDF } from '../utils/generateQuotePDF';
import './Quote.css';

export default function Quote() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const preselectedProduct = searchParams.get('product') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    productName: preselectedProduct,
    quantity: '10000',
    deliverySite: '',
    notes: ''
  });

  const [isCalculatedEstimate, setIsCalculatedEstimate] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdQuoteId, setCreatedQuoteId] = useState('');

  // Pre-select product via query param (?product=...)
  useEffect(() => {
    if (preselectedProduct) {
      setFormData((prev) => ({ ...prev, productName: preselectedProduct }));
    }
  }, [preselectedProduct]);

  // Read data passed from the Masonry Calculator (/calculator)
  useEffect(() => {
    if (location.state) {
      const { productName, quantity, notes } = location.state;
      setFormData((prev) => ({
        ...prev,
        productName: productName || prev.productName,
        quantity: quantity ? String(quantity) : prev.quantity,
        notes: notes || prev.notes
      }));
      if (quantity) {
        setIsCalculatedEstimate(true);
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadEstimate = () => {
    // Determine unit price based on matched product catalog rate or fallback standard
    const matchedProduct = products.find((p) => p.name === formData.productName);
    const resolvedPrice = matchedProduct?.pricePerUnit || 9.5;

    generateQuotePDF({
      quoteId: createdQuoteId || undefined,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      productName: formData.productName,
      quantity: formData.quantity,
      deliverySite: formData.deliverySite,
      notes: formData.notes,
      unitPrice: resolvedPrice
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedQuoteId(data.quoteId || '');
        setIsSubmitted(true);
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to submit quote.');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Unable to reach server. Please ensure the backend is running.');
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setIsCalculatedEstimate(false);
    setCreatedQuoteId('');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      productName: '',
      quantity: '10000',
      deliverySite: '',
      notes: ''
    });
  };

  return (
    <div className="quote-page">
      <section className="quote-banner">
        <div className="quote-banner-inner">
          <span className="section-eyebrow" style={{ color: 'var(--color-warm-beige)' }}>
            DIRECT FACTORY QUOTATION
          </span>
          <h1 className="banner-title">Request Wholesale Pricing</h1>
          <p className="banner-desc">
            Direct dispatch quotes tailored to your site requirements, estimated truckload batches, 
            and required compressive testing parameters.
          </p>
        </div>
      </section>

      <div className="quote-container">
        <div className="quote-grid">
          
          <div className="quote-form-card">
            {isCalculatedEstimate && !isSubmitted && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#F5EBDD',
                  borderLeft: '4px solid #A63D2F',
                  padding: '0.85rem 1rem',
                  borderRadius: '4px',
                  marginBottom: '1.5rem',
                  color: '#4A2C23',
                  fontSize: '0.9rem'
                }}
              >
                <CalcIcon size={20} color="#A63D2F" />
                <span>
                  <strong>Masonry Estimator Applied:</strong> Quantities and specification notes have been automatically populated below.
                </span>
              </div>
            )}

            {isSubmitted ? (
              <div className="quote-success">
                <CheckCircle2 size={48} color="#A63D2F" />
                <h2>Quotation Request Received</h2>
                <p>
                  Thank you, <strong>{formData.fullName}</strong>. Our dispatch and sales team 
                  will review your requirements for <strong>{Number(formData.quantity).toLocaleString()} units</strong> of{' '}
                  <strong>{formData.productName || 'Bricks'}</strong> and contact you within 4 business hours with an official proforma invoice.
                </p>

                {/* PDF Generation & Action Bridge */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0 1rem 0' }}>
                  <button
                    type="button"
                    onClick={handleDownloadEstimate}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#4A2C23',
                      color: '#FFF',
                      border: 'none',
                      padding: '0.85rem 1.4rem',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(74, 44, 35, 0.25)',
                      transition: 'background 0.2s'
                    }}
                  >
                    <Download size={18} /> Download Proforma PDF
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#F4EFEA',
                      color: '#4A2C23',
                      border: '1px solid #D9CFC4',
                      padding: '0.85rem 1.4rem',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <RotateCcw size={16} /> Submit Another RFQ
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rfq-form">
                <h2 className="form-heading">Project Specifications</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name / Contact Person *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Business / Dispatch Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="builder@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Select Product *</label>
                    <select
                      name="productName"
                      required
                      value={formData.productName}
                      onChange={handleChange}
                    >
                      <option value="">-- Choose Brick Type --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.strength})
                        </option>
                      ))}
                      {formData.productName && !products.some((p) => p.name === formData.productName) && (
                        <option value={formData.productName}>{formData.productName}</option>
                      )}
                      <option value="Custom Specification">Custom Specification / Multiple Products</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Estimated Quantity (Units) *</label>
                    {isCalculatedEstimate ? (
                      <input
                        type="number"
                        name="quantity"
                        required
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #A63D2F',
                          borderRadius: '4px',
                          fontWeight: 600,
                          boxSizing: 'border-box'
                        }}
                      />
                    ) : (
                      <select
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                      >
                        <option value="5000">5,000 Units (Half Truckload)</option>
                        <option value="10000">10,000 Units (Standard Truckload)</option>
                        <option value="25000">25,000 Units (Multi-Truck)</option>
                        <option value="50000+">50,000+ Units (Commercial Contract)</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Delivery Destination / Pin Code *</label>
                  <input
                    type="text"
                    name="deliverySite"
                    required
                    placeholder="Site location, City, PIN Code"
                    value={formData.deliverySite}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Special Notes / Unloading Requirements</label>
                  <textarea
                    rows={3}
                    name="notes"
                    placeholder="Specific delivery timelines, forklift unloading requirements, or IS test report requests..."
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary form-submit-btn">
                  Generate Quotation Request <Send size={16} />
                </button>
              </form>
            )}
          </div>

          <div className="quote-info-sidebar">
            <div className="sidebar-card">
              <h3>Bulk Order Guidelines</h3>
              <ul className="guideline-list">
                <li>
                  <strong>Standard Truckload:</strong> 8,000 to 12,000 units per carrier depending on road gross weight limits.
                </li>
                <li>
                  <strong>Direct Offloading:</strong> Automated tipper trucks or manual staging offloading available upon prior notice.
                </li>
                <li>
                  <strong>Test Certificates:</strong> Third-party compressive strength batch reports supplied with every dispatch.
                </li>
              </ul>
            </div>

            <div className="sidebar-card contact-card">
              <h3>Immediate Dispatch Help?</h3>
              <p>Speak directly to our factory logistics coordination desk:</p>
              <div className="direct-contact-item">
                <Phone size={18} color="#A63D2F" />
                <span>+91 98765 43210</span>
              </div>
              <div className="direct-contact-item">
                <Mail size={18} color="#A63D2F" />
                <span>dispatch@brickworks.com</span>
              </div>
              <div className="direct-contact-item">
                <MapPin size={18} color="#A63D2F" />
                <span>Mon – Sat: 08:00 AM – 07:00 PM</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}