import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Layers3, TrendingUp, ShieldCheck } from 'lucide-react';

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

function ButtonLink({ to = '/contact', children, light = false }) {
  return (
    <Link className={`button ${light ? 'button-light' : ''}`} to={to}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR STORY / INDIA"
        title={<>Rooted in context.<br /><em>Ready for what's next.</em></>}
        copy="Ethixweb India brings global digital standards together with a grounded understanding of how Indian businesses build trust, serve customers and grow."
      />
      <section className="section">
        <div className="container story-grid">
          <span className="eyebrow">01 / OUR POINT OF VIEW</span>
          <div>
            <h2>India isn't one market. It's a thousand different ambitions.</h2>
            <p>From a family-run business finding its next generation of customers to a fast-moving team building a category, the context matters. Languages, buying habits, trust signals, payment preferences and bandwidth realities all shape what good digital work looks like.</p>
            <p>Our job is to listen before we prescribe—to build experiences that feel clear to the people using them, and useful to the people running the business.</p>
          </div>
        </div>
        <div className="container values-grid">
          <article>
            <span>01</span>
            <h3>Context before convention</h3>
            <p>We design for the audience and the real-world conditions, not just a moodboard.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Craft with a purpose</h3>
            <p>Every interaction, integration and line of copy should earn its place.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Progress you can see</h3>
            <p>Clear milestones and honest measures keep the work tied to outcomes.</p>
          </article>
        </div>
      </section>
      <section className="india-band">
        <div className="container india-band-grid">
          <div>
            <span className="eyebrow">MADE FOR THE WAY INDIA WORKS</span>
            <h2>Local understanding.<br /><em>World-class execution.</em></h2>
          </div>
          <div className="india-details">
            <p><MapPin size={18} /> India-based perspective, global-ready delivery</p>
            <p><Layers3 size={18} /> Mobile-first, inclusive digital experiences</p>
            <p><TrendingUp size={18} /> Business goals before vanity metrics</p>
            <p><ShieldCheck size={18} /> Secure foundations and transparent handover</p>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-inner">
          <span className="eyebrow">GOOD WORK STARTS WITH A CONVERSATION</span>
          <h2>Tell us what matters<br /><em>to your business.</em></h2>
          <ButtonLink light>Let's talk</ButtonLink>
        </div>
      </section>
    </>
  );
}
