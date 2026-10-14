import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, AlertCircle, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { services } from '../data/siteContent.js';
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

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="CAPABILITIES & DELIVERABLES"
        title={<>Digital capability built for<br /><em>practical business impact.</em></>}
        copy="A connected suite of strategic design, custom engineering, and workflow automation crafted for Indian startups, growing brands, and established enterprises."
      />

      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="container">
          {/* Quick jump navigation for all 6 services */}
          <nav className="service-nav-bar" aria-label="Quick jump to service">
            {services.map(s => (
              <a key={s.id} href={`#${s.id}`} className="service-nav-link">
                <span>{s.n}</span> {s.title}
              </a>
            ))}
          </nav>

          {/* 6 Editorial Alternating Sections */}
          <div className="services-editorial-container">
            {services.map((s, index) => {
              const isEven = index % 2 === 1;
              const Icon = s.icon;
              return (
                <ScrollReveal
                  as="article"
                  id={s.id}
                  className="service-editorial-block"
                  key={s.id}
                >
                  <div className={`service-editorial-grid ${isEven ? 'is-flipped' : ''}`}>
                    {/* Left/Content Column */}
                    <div>
                      <div className="service-block-badge">
                        <Icon size={18} strokeWidth={1.8} />
                        <span>{s.n} / 06 — {s.kicker}</span>
                      </div>
                      <h2>{s.title}</h2>
                      <p className="lead-p">{s.desc}</p>

                      {/* Problem Block */}
                      <div className="problem-card">
                        <h4>THE BUSINESS FRICTION</h4>
                        <p>{s.problem}</p>
                      </div>

                      {/* Business Value Block */}
                      <div className="value-card">
                        <h4>EXPECTED BUSINESS VALUE</h4>
                        <p>{s.businessValue}</p>
                      </div>

                      <Link
                        to={`/contact?service=${encodeURIComponent(s.serviceSelect)}`}
                        className="button"
                        style={{ marginTop: '10px' }}
                      >
                        Discuss {s.title} <ArrowUpRight size={17} />
                      </Link>
                    </div>

                    {/* Right/Deliverables Card Column */}
                    <div>
                      <div className="deliverables-box">
                        <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
                          SCOPE OF WORK
                        </span>
                        <h3>What Ethixweb Delivers</h3>
                        <ul className="deliverables-list">
                          {s.delivers.map((item, i) => (
                            <li key={i}>
                              <Check size={16} strokeWidth={2.5} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="tech-tags-wrap">
                          {s.tags.map(tag => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shared CTA Section */}
      <ScrollReveal as="section" className="cta-section">
        <div className="container cta-inner">
          <span className="eyebrow">HAVE A SPECIFIC SCOPE IN MIND?</span>
          <h2>Every project starts with<br /><em>a clear conversation.</em></h2>
          <p>Tell us where you want to go. We will help map the most direct, cost-efficient path to get there.</p>
          <Link to="/contact" className="button button-light">
            Start a project inquiry <ArrowUpRight size={17} />
          </Link>
          <span className="cta-decoration">e.</span>
        </div>
      </ScrollReveal>
    </>
  );
}
