import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { products } from '../data/products';
import './Quote.css';

export default function Quote() {
  const [searchParams] = useSearchParams();
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

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedProduct) {
      setFormData((prev) => ({ ...prev, productName: preselectedProduct }));
    }
  }, [preselectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Wholesale RFQ Submitted:", formData);
    setIsSubmitted(true);
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
            {isSubmitted ? (
              <div className="quote-success">
                <CheckCircle2 size={48} color="#A63D2F" />
                <h2>Quotation Request Received</h2>
                <p>
                  Thank you, <strong>{formData.fullName}</strong>. Our dispatch and sales team 
                  will review your requirements for <strong>{formData.quantity} units</strong> and 
                  contact you via phone/email within 4 business hours with an official proforma invoice.
                </p>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      productName: '',
                      quantity: '10000',
                      deliverySite: '',
                      notes: ''
                    });
                  }}
                >
                  Submit Another RFQ
                </button>
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
                      <option value="Custom Specification">Custom Specification / Multiple Products</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Estimated Quantity (Units) *</label>
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