import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { services } from '../data/siteContent.js';

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

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="WHAT WE DO"
        title={<>Digital capability.<br /><em>Business clarity.</em></>}
        copy="A connected set of services for businesses ready to do better online, work smarter and grow with intention."
      />
      <section className="section">
        <div className="container service-detail-list">
          {services.map(s => (
            <article className="service-detail" key={s.n}>
              <div className="detail-num">{s.n}</div>
              <div>
                <s.icon size={26} />
                <h2>{s.title}</h2>
                <p>{s.desc}</p>
                <ul>
                  {s.tags.map(t => (
                    <li key={t}><Check size={15} />{t}</li>
                  ))}
                </ul>
              </div>
              <Link to="/contact" className="round-arrow" aria-label={`Enquire about ${s.title}`}>
                <ArrowUpRight />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-inner">
          <span className="eyebrow">NOT SURE WHERE TO START?</span>
          <h2>Let's find the right<br /><em>first step.</em></h2>
          <ButtonLink light>Talk through your project</ButtonLink>
        </div>
      </section>
    </>
  );
}
