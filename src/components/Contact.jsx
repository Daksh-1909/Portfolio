import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const Contact = ({ addToast }) => {
  const revealRef = useScrollReveal();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('dakshp860@gmail.com');
    addToast('Email address copied to clipboard!', 'success');
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email syntax';
    }
    if (!formData.message.trim()) tempErrors.message = 'Message is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      addToast('Thank you! Your message has been received.', 'success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    } else {
      addToast('Please fill out all fields correctly.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="contact" className="section section-alt" ref={revealRef}>
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Let's collaborate, talk tech, or discuss opportunities</p>
        </div>

        <div className="contact-grid">
          {/* Info Card */}
          <div className="contact-card glass-card">
            <div className="contact-headline">
              <h3>Let's Connect</h3>
              <p>Feel free to reach out. I am always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
            </div>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-info-content">
                  <span>Email Me</span>
                  <a href="mailto:dakshp860@gmail.com">dakshp860@gmail.com</a>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-info-content">
                  <span>Location</span>
                  <p>Gujarat, India</p>
                </div>
              </div>
            </div>

            <button onClick={handleCopyEmail} className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>
              <i className="far fa-copy"></i> Copy Email Address
            </button>

            <div className="contact-socials">
              <a 
                href="https://www.linkedin.com/in/daksh-patel-7a57b222a/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-social-link"
                title="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a 
                href="https://github.com/Daksh-1909" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-social-link"
                title="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact-form glass-card" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Daksh Patel"
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="daksh@example.com"
                />
                {errors.email && <span className="form-error-msg">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Let's build something amazing together..."
              ></textarea>
              {errors.message && <span className="form-error-msg">{errors.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              Send Message <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
