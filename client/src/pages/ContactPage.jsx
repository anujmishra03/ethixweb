import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Check, Clock3, Mail, MapPin, AlertCircle } from 'lucide-react';
import { API } from '../lib/supabaseClient.js';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';

function PageHero({ eyebrow, title, copy }) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="eyebrow eyebrow-line"><span />{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}

const SERVICE_OPTIONS = [
  'Website design & development',
  'Web application / product',
  'AI & workflow automation',
  'SEO & performance marketing',
  'CRM & integrations',
  'Ongoing support',
  'Not sure yet'
];

const BUDGET_OPTIONS = [
  'Under ₹50,000',
  '₹50,000–₹2 lakh',
  '₹2–5 lakh',
  '₹5 lakh+',
  'Still figuring it out'
];

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service');

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: SERVICE_OPTIONS.includes(initialService) ? initialService : 'Website design & development',
    budget: '',
    message: '',
    website: '' // honeypot
  });

  const [touched, setTouched] = useState({});
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize query param if navigated with different query
  useEffect(() => {
    const s = searchParams.get('service');
    if (s && SERVICE_OPTIONS.includes(s)) {
      setForm(prev => ({ ...prev, service: s }));
    }
  }, [searchParams]);

  const update = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = field => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Basic client-side validation
  const errors = {};
  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = 'Please provide your name (at least 2 characters).';
  }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please provide a valid work email address.';
  }
  if (!form.message.trim() || form.message.trim().length < 10) {
    errors.message = 'Please share a brief note about the project (at least 10 characters).';
  }

  async function submit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(errors).length > 0) {
      setErrorMessage('Please correct the highlighted fields before submitting.');
      setState('error');
      return;
    }

    setState('loading');
    setErrorMessage('');

    try {
      const r = await fetch(`${API}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data.error || 'We could not save your enquiry. Please check your details and try again.');
      }

      setState('success');
      setForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: 'Website design & development',
        budget: '',
        message: '',
        website: ''
      });
      setTouched({});
    } catch (err) {
      setState('error');
      setErrorMessage(err.message || 'Network error. Please check your internet connection or email hello@ethixweb.com directly.');
    }
  }

  return (
    <>
      <PageHero
        eyebrow="CONTACT / START A CONVERSATION"
        title={<>Every good project<br />starts with <em>a question.</em></>}
        copy="Tell us a little about what you're working on. We'll get back to you with a thoughtful next step—no hard sell."
      />

      <section className="section contact-section">
        <div className="container contact-grid">
          {/* Aside Information */}
          <div className="contact-aside">
            <span className="eyebrow">A REAL CONVERSATION, FIRST</span>
            <h2>What's on<br />your <em>mind?</em></h2>
            <p>
              Share the opportunity, the challenge or the idea you're trying to make real. A little context helps us make the first conversation useful.
            </p>

            <div className="contact-detail">
              <Mail aria-hidden="true" />
              <div>
                <span>EMAIL DIRECTLY</span>
                <a href="mailto:hello@ethixweb.com">hello@ethixweb.com</a>
              </div>
            </div>

            <div className="contact-detail">
              <MapPin aria-hidden="true" />
              <div>
                <span>WHERE WE WORK</span>
                <p>India · Collaborating worldwide</p>
              </div>
            </div>

            <div className="response-note">
              <Clock3 size={17} aria-hidden="true" />
              <span>We aim to respond within two working days.</span>
            </div>
          </div>

          {/* Enquiry Form */}
          <form className="enquiry-form" onSubmit={submit} noValidate aria-label="Project enquiry form">
            <div className="form-heading">
              <span className="eyebrow">PROJECT ENQUIRY</span>
              <span>ALL FIELDS MARKED * ARE REQUIRED</span>
            </div>

            {state === 'success' && (
              <div className="form-alert success" role="alert">
                <Check size={18} />
                <span>Thank you. Your enquiry has been received and our engineering team will get back to you shortly.</span>
              </div>
            )}

            {state === 'error' && errorMessage && (
              <div className="form-alert error" role="alert">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-row">
              <label>
                Your name *
                <input
                  required
                  name="name"
                  type="text"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={update}
                  onBlur={() => handleBlur('name')}
                  aria-invalid={Boolean(touched.name && errors.name)}
                  aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                  placeholder="How should we address you?"
                />
                {touched.name && errors.name && (
                  <span id="name-error" className="field-error" style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>
                    {errors.name}
                  </span>
                )}
              </label>

              <label>
                Work email *
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={254}
                  value={form.email}
                  onChange={update}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                  placeholder="you@company.com"
                />
                {touched.email && errors.email && (
                  <span id="email-error" className="field-error" style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>
                    {errors.email}
                  </span>
                )}
              </label>
            </div>

            <div className="form-row">
              <label>
                Company (optional)
                <input
                  name="company"
                  type="text"
                  autoComplete="organization"
                  maxLength={120}
                  value={form.company}
                  onChange={update}
                  placeholder="Your organisation or startup"
                />
              </label>

              <label>
                Phone (optional)
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  value={form.phone}
                  onChange={update}
                  placeholder="+91 98765 43210"
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                What can we help with? *
                <select
                  name="service"
                  required
                  value={form.service}
                  onChange={update}
                >
                  {SERVICE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Indicative budget (optional)
                <select
                  name="budget"
                  value={form.budget}
                  onChange={update}
                >
                  <option value="">Choose a budget range</option>
                  {BUDGET_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Tell us about the project *
              <textarea
                required
                name="message"
                minLength={10}
                maxLength={3000}
                rows={5}
                value={form.message}
                onChange={update}
                onBlur={() => handleBlur('message')}
                aria-invalid={Boolean(touched.message && errors.message)}
                aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
                placeholder="What challenge are you solving? What does success look like, and what timeline are you aiming for?"
              />
              {touched.message && errors.message && (
                <span id="message-error" className="field-error" style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>
                  {errors.message}
                </span>
              )}
            </label>

            {/* Honeypot field hidden from users for spam protection */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="website-hp">Leave this empty</label>
              <input
                id="website-hp"
                tabIndex={-1}
                autoComplete="off"
                name="website"
                value={form.website}
                onChange={update}
              />
            </div>

            <div className="form-foot">
              <p>
                By submitting, you agree that Ethixweb may contact you regarding this enquiry. We respect your privacy and never sell or share client data.
              </p>
              <button
                type="submit"
                className="button"
                disabled={state === 'loading'}
              >
                {state === 'loading' ? 'Submitting enquiry…' : 'Send your enquiry'}
                <ArrowUpRight size={17} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
