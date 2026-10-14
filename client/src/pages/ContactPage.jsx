import React, { useState } from 'react';
import { ArrowUpRight, Check, Clock3, Mail, MapPin } from 'lucide-react';
import { API } from '../lib/supabaseClient.js';

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

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'Website design & development',
    budget: '',
    message: '',
    website: ''
  });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState('loading');
    setError('');
    try {
      const r = await fetch(`${API}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not submit your enquiry. Please try again.');
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
    } catch (err) {
      setState('error');
      setError(err.message || 'Network error. Check your connection and try again.');
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
          <div className="contact-aside">
            <span className="eyebrow">A REAL CONVERSATION, FIRST</span>
            <h2>What's on<br />your <em>mind?</em></h2>
            <p>Share the opportunity, the challenge or the idea you're trying to make real. A little context helps us make the first conversation useful.</p>
            <div className="contact-detail">
              <Mail />
              <div>
                <span>EMAIL</span>
                <a href="mailto:hello@ethixweb.com">hello@ethixweb.com</a>
              </div>
            </div>
            <div className="contact-detail">
              <MapPin />
              <div>
                <span>WHERE WE WORK</span>
                <p>India · Collaborating worldwide</p>
              </div>
            </div>
            <div className="response-note">
              <Clock3 size={17} /> We aim to respond within two working days.
            </div>
          </div>
          <form className="enquiry-form" onSubmit={submit}>
            <div className="form-heading">
              <span className="eyebrow">PROJECT ENQUIRY</span>
              <span>ALL FIELDS MARKED * ARE REQUIRED</span>
            </div>
            {state === 'success' && (
              <div className="form-alert success">
                <Check size={18} /> Thank you. Your enquiry has been received.
              </div>
            )}
            {state === 'error' && <div className="form-alert error">{error}</div>}
            <div className="form-row">
              <label>
                Your name *
                <input
                  required
                  name="name"
                  autoComplete="name"
                  minLength="2"
                  maxLength="100"
                  value={form.name}
                  onChange={update}
                  placeholder="How should we address you?"
                />
              </label>
              <label>
                Work email *
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength="254"
                  value={form.email}
                  onChange={update}
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Company
                <input
                  name="company"
                  maxLength="120"
                  value={form.company}
                  onChange={update}
                  placeholder="Your organisation"
                />
              </label>
              <label>
                Phone (optional)
                <input
                  name="phone"
                  autoComplete="tel"
                  maxLength="20"
                  value={form.phone}
                  onChange={update}
                  placeholder="+91 ..."
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                What can we help with? *
                <select name="service" required value={form.service} onChange={update}>
                  {[
                    'Website design & development',
                    'Web application / product',
                    'AI & workflow automation',
                    'SEO & performance marketing',
                    'CRM & integrations',
                    'Ongoing support',
                    'Not sure yet'
                  ].map(x => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Indicative budget
                <select name="budget" value={form.budget} onChange={update}>
                  <option value="">Choose a range</option>
                  <option>Under ₹50,000</option>
                  <option>₹50,000–₹2 lakh</option>
                  <option>₹2–5 lakh</option>
                  <option>₹5 lakh+</option>
                  <option>Still figuring it out</option>
                </select>
              </label>
            </div>
            <label>
              Tell us about the project *
              <textarea
                required
                name="message"
                minLength="10"
                maxLength="3000"
                rows="5"
                value={form.message}
                onChange={update}
                placeholder="What are you trying to achieve? What would success look like?"
              />
            </label>
            <label className="honeypot" aria-hidden="true">
              Leave this field empty
              <input
                tabIndex="-1"
                autoComplete="off"
                name="website"
                value={form.website}
                onChange={update}
              />
            </label>
            <div className="form-foot">
              <p>By submitting, you agree we may contact you about this enquiry. Your details won't be sold.</p>
              <button className="button" disabled={state === 'loading'}>
                {state === 'loading' ? 'Sending…' : 'Send your enquiry'} <ArrowUpRight size={17} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
