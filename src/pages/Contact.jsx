import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL as CONFIG_API_URL } from '../config';
import './Contact.css';

// Fall back directly to your live Render backend if config is local or empty
const BACKEND_URL =
  CONFIG_API_URL && !CONFIG_API_URL.includes('localhost')
    ? CONFIG_API_URL
    : 'https://jbbtbi.onrender.com';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refId, setRefId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const targetUrl = `${BACKEND_URL}/api/contact`;
    console.log('📡 Submitting inquiry to:', targetUrl);

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.messageId) {
          setRefId(data.messageId.slice(-6));
        }
        setSent(true);
      } else {
        alert(data.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Unable to reach server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-banner">
        <div className="contact-banner-inner">
          <span className="section-eyebrow" style={{ color: 'var(--color-warm-beige)' }}>
            DIRECT COMMUNICATION
          </span>
          <h1 className="banner-title">Contact Plant & Sales Desk</h1>
          <p className="banner-desc">
            Connect directly with plant managers and dispatch coordinators for site deliveries,
            technical test sheets, and proforma inquiries.
          </p>
        </div>
      </section>

      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-info-col">
            <h2>Plant & Office Locations</h2>
            <p className="contact-subtext">
              We welcome structural engineers, architects, and contractors for on-site kiln and
              quality lab inspections during operating hours.
            </p>

            <div className="contact-detail-list">
              <div className="detail-item">
                <MapPin size={22} className="detail-icon" />
                <div>
                  <strong>Kiln & Manufacturing Plant</strong>
                  <p>Plot 48–52, Heavy Industrial Corridor, Phase-II, Brickfield Zone</p>
                </div>
              </div>

              <div className="detail-item">
                <Phone size={22} className="detail-icon" />
                <div>
                  <strong>Direct Plant Dispatch Desk</strong>
                  <p>+91 98765 43210 / +91 98765 43211</p>
                </div>
              </div>

              <div className="detail-item">
                <Mail size={22} className="detail-icon" />
                <div>
                  <strong>Official Enquiries</strong>
                  <p>sales@brickworks.com / dispatch@brickworks.com</p>
                </div>
              </div>

              <div className="detail-item">
                <Clock size={22} className="detail-icon" />
                <div>
                  <strong>Operational Timings</strong>
                  <p>Kiln Dispatch: 24/7 Fleet Scheduling</p>
                  <p>Office Desk: Mon – Sat, 08:00 AM – 07:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            {sent ? (
              <div className="contact-success">
                <CheckCircle2 size={44} color="#A63D2F" />
                <h3>Message Received</h3>
                {refId && (
                  <p style={{ fontWeight: 'bold', color: 'var(--color-rust, #A63D2F)' }}>
                    Inquiry Reference: #{refId}
                  </p>
                )}
                <p>
                  Thank you for reaching out. A logistics coordinator from our sales desk will
                  contact you directly via phone or email shortly.
                </p>
                <button
                  className="btn-secondary"
                  style={{ color: 'var(--color-dark)', borderColor: 'var(--color-deep-brown)' }}
                  onClick={() => {
                    setSent(false);
                    setRefId('');
                    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3>Send Us an Inquiry</h3>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikas Sengupta"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Inquiry Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lab test certificate request, site inspection"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Message / Order Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your query or project delivery requirements here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ justifyContent: 'center' }}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Inquiry'} <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}