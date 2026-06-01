'use client';

import { useState } from 'react';
import { sanitizePhoneInput } from '@/lib/phone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/lib/schemas/formSchema';
import { placeInquiry } from '@/lib/db';

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      inquiryType: '',
      message: '',
      feedbackConsent: false, // add this
    },
  });

  const inquiryType = watch('inquiryType');

  const submit = async (data: ContactFormData) => {
    const result = await placeInquiry({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      inquiryType: data.inquiryType as 'Concern' | 'Special Order Request' | 'Feedback' | 'Other',
      message: data.message.trim(),
    });

    if (!result.success) {
      setStatus('Unable to send your message.');
      return;
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus('Message sent successfully.');
      reset();
    } else {
      setStatus('Unable to send your message.');
    }
  };

  return (
    <section className="container page-section">
      <h1 className="page-title">Contact</h1>
      <p className="page-subtitle">We would love to hear from you. Send us your concern, feedback, or special request.</p>

      <div className="panel contact-panel">
        <h2>Send a Message</h2>
        <form className="contact-form" onSubmit={handleSubmit(submit)}>

          <div className={errors.name ? 'form-field-error' : 'form-field'}>
            <label htmlFor="contact-name">Name *</label>
            <input id="contact-name" {...register('name')} />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

          <div className={errors.email ? 'form-field-error' : 'form-field'}>
            <label htmlFor="contact-email">Email *</label>
            <input id="contact-email" type="email" {...register('email')} />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className={errors.phone ? 'form-field-error' : 'form-field'}>
            <label htmlFor="contact-phone">Phone *</label>
            <input
              id="contact-phone"
              type="tel"
              inputMode="numeric"
              maxLength={11}
              {...register('phone', {
                onChange: (e) => {
                  e.target.value = sanitizePhoneInput(e.target.value);
                },
              })}
            />
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>

          <div className={errors.inquiryType ? 'form-field-error' : 'form-field'}>
            <label htmlFor="contact-type">Inquiry type *</label>
            <select
              id="contact-type"
              style={{ color: inquiryType ? 'var(--text)' : 'gray' }}
              {...register('inquiryType')}
            >
              <option value="" hidden disabled>Select an inquiry type</option>
              <option style={{ color: 'var(--text)' }}>Feedback</option>
              <option style={{ color: 'var(--text)' }}>Concern</option>
              <option style={{ color: 'var(--text)' }}>Special Order Request</option>
              <option style={{ color: 'var(--text)' }}>Bulk Orders</option>
              <option style={{ color: 'var(--text)' }}>Other</option>
            </select>
            {errors.inquiryType && <p className="error">{errors.inquiryType.message}</p>}
          </div>

          <div className={errors.message ? 'form-field-error' : 'form-field'}>
            <label htmlFor="contact-message">Message *</label>
            <textarea
              placeholder="Enter your message here..."
              id="contact-message"
              {...register('message')}
            />
            {errors.message && <p className="error">{errors.message.message}</p>}
          </div>

          {inquiryType === 'Feedback' && (
            <label className="checkbox-field">
              <input type="checkbox" {...register('feedbackConsent')} />
              <span>I allow this submission to be shared publicly as a testimonial or review.</span>
            </label>
          )}

        <button
          type="submit"
          className="btn-action"
          disabled={isSubmitting || !inquiryType || Object.keys(errors).length > 0}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </form>

        {status && (
          <p
            className={status.includes('successfully') ? 'alert-success' : 'alert-error'}
            style={{ marginTop: '0.9rem' }}
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
}