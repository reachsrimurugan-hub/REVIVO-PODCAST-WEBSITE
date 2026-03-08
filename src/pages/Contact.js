import React, { useState } from 'react';
import { postContactForm } from '../services/api';

const Contact = () => {
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', subject: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, subject: false, message: false });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        return validateEmail(value);
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.trim().length < 5) return 'Subject must be at least 5 characters';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, form[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleChange = (fieldName, value) => {
    setForm(prev => ({ ...prev, [fieldName]: value }));
    // Clear error when user starts typing
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach(field => {
      newErrors[field] = validateField(field, form[field]);
    });
    setErrors(newErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    return !Object.values(newErrors).some(error => error);
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setStatus('loading');
      await postContactForm({ ...form });
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setErrors({ name: '', email: '', subject: '', message: '' });
      setTouched({ name: false, email: false, subject: false, message: false });
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="container py-4">
      <h2>Feedback</h2>
      <p className="text-muted">Let's grow together. Fill the form and we'll get back.</p>
      <div className="row g-4">
        <div className="col-md-6">
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input 
                className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                value={form.name} 
                onChange={e => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Enter your full name"
              />
              {touched.name && errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                value={form.email} 
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email address"
              />
              {touched.email && errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input 
                className={`form-control ${touched.subject && errors.subject ? 'is-invalid' : ''}`}
                value={form.subject} 
                onChange={e => handleChange('subject', e.target.value)}
                onBlur={() => handleBlur('subject')}
                placeholder="Enter message subject"
              />
              {touched.subject && errors.subject && (
                <div className="invalid-feedback">{errors.subject}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea 
                className={`form-control ${touched.message && errors.message ? 'is-invalid' : ''}`}
                rows="3" 
                value={form.message} 
                onChange={e => handleChange('message', e.target.value)}
                onBlur={() => handleBlur('message')}
                placeholder="Enter your message"
              />
              {touched.message && errors.message && (
                <div className="invalid-feedback">{errors.message}</div>
              )}
            </div>
            
            <button className="btn btn-podcast" disabled={status==='loading'}>
              {status==='loading' ? 'Sending...' : 'Send Message'}
            </button>
            {status==='success' && <span className="text-success ms-3">Sent!</span>}
            {status==='error' && <span className="text-danger ms-3">Failed. Try again.</span>}
          </form>
        </div>
        <div className="col-md-6">
          <div className="p-3 revivo-card rounded">
            <h5>Chat with us</h5>
            <p className="text-muted">Our team is online during business hours.</p>
            <button className="btn btn-podcast-outline"><i className="fa-regular fa-comment-dots me-2"></i>Open chat</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;