'use client';

import { useState } from 'react';
import { sanitizePhoneInput } from '@/lib/phone';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', inquiryType: 'Select Inquiry Type', message: '' });
  const [status, setStatus] = useState('');
  const [feedbackConsent, setFeedbackConsent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Sending...');
    if (form.inquiryType === 'Feedback' && !feedbackConsent) {
      setStatus('Please consent to your feedback being posted online.');
      return;
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, feedbackConsent }),
    });
    if (res.ok) {
      setStatus('Message sent successfully.');
      setForm({ name: '', email: '', phone: '', inquiryType: 'Select Inquiry Type', message: '' });
    } else {
      setStatus('Unable to send your message.');
    }
  }

  return (
    <section className="container page-section">
      <h1 className="page-title">Contact</h1>
      <p className="page-subtitle">We would love to hear from you. Send us your concern, feedback, or special request.</p>

      <div className="panel contact-panel">
        <h2>Send a Message</h2>
        <form className="contact-form" onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="contact-name">Name *</label>
            <input id="contact-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="form-field">
            <label htmlFor="contact-email">Email *</label>
            <input
              id="contact-email"
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-phone">
              Phone *
            </label>
            <input required
              id="contact-phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{11}"
              maxLength={11}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: sanitizePhoneInput(e.target.value) })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-type">Inquiry type *</label>
            <select id="contact-type" required value={form.inquiryType} onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}>
              <option value="" hidden>Select an option...</option>
              <option>Bulk Orders</option>
              <option>Special Order Request</option>
              <option>Concern</option>
              <option>Feedback</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="contact-message">Message *</label>
            <textarea placeholder="Enter your message here..." id="contact-message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          {form.inquiryType === 'Feedback' && (
            <label className="checkbox-field">
              <input type="checkbox" checked={feedbackConsent} onChange={(e) => setFeedbackConsent(e.target.checked)} />
              <span>I consent to my feedback being posted online.</span>
            </label>
          )}

        <button type="submit" className="btn-action" disabled={form.inquiryType === 'Select Inquiry Type'}>
          Submit
        </button>
        </form>

        

        {status && <p className={status.includes('successfully') ? 'alert-success' : 'alert-error'} style={{ marginTop: '0.9rem' }}>{status}</p>}
      </div>
    </section>
  );
}