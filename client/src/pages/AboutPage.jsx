import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  MapPin,
  TrendingUp,
  Cpu,
  Workflow
} from 'lucide-react';
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

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT ETHIXWEB INDIA"
        title={<>Understanding business goals first.<br /><em>Then engineering what actually works.</em></>}
        copy="Ethixweb is an independent digital agency combining senior engineering discipline with a grounded understanding of Indian commerce, operational context, and global delivery standards."
      />

      {/* Point of View Split Section */}
      <section className="section">
        <div className="container">
          <ScrollReveal as="div" className="story-grid">
            <span className="eyebrow">01 / OUR PHILOSOPHY</span>
            <div>
              <h2>India is not a single market. It is thousands of unique commercial realities.</h2>
              <p>
                From rapid-growth startups seeking product-market validation in Bengaluru and Delhi NCR, to family-owned manufacturing leaders in Ahmedabad and Coimbatore digitizing operations, the real context dictates technology choices.
              </p>
              <p>
                Bandwidth constraints, mobile-first usage patterns across tier-1 to tier-3 towns, UPI payment habits, and WhatsApp-driven communication all determine whether digital software thrives or gets abandoned. We never impose generic Western templates or bloated software frameworks onto problems that require lean, responsive execution.
              </p>
            </div>
          </ScrollReveal>

          {/* Core Values Grid */}
          <div className="values-grid" style={{ marginTop: '50px' }}>
            <ScrollReveal as="article">
              <span>01</span>
              <h3>Business Goals Before Code</h3>
              <p>
                We do not recommend a headless framework or complex AI pipelines when a clean, fast web app solves the operational problem. Every technical decision connects to real business value.
              </p>
            </ScrollReveal>
            <ScrollReveal as="article">
              <span>02</span>
              <h3>Performance by Default</h3>
              <p>
                In a country where 75% of users browse on mid-range Android devices, speed is not a vanity metric—it is the baseline for conversion, SEO ranking, and user trust.
              </p>
            </ScrollReveal>
            <ScrollReveal as="article">
              <span>03</span>
              <h3>Complete Ownership & Transparency</h3>
              <p>
                Clean code, full repository access, clear documentation, and zero vendor lock-in. When we finish a project, your team owns the intellectual property and has complete control.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Who We Collaborate With Section */}
      <section className="audience-section">
        <div className="container">
          <span className="eyebrow">02 / WHO WE WORK WITH</span>
          <div className="about-intro-split">
            <h2>Partnerships shaped around where your business stands today.</h2>
            <p>
              We collaborate with organisations at distinct stages of maturity—bringing the right level of technical depth, delivery speed, and strategic rigor to each relationship.
            </p>
          </div>

          <div className="audience-grid">
            <ScrollReveal as="div" className="audience-card">
              <span className="badge">EARLY STAGE</span>
              <h3>Startups & Founders</h3>
              <p>
                You need a rapid, credible MVP that demonstrates traction to investors and early customers without burning runway on over-engineered architectures.
              </p>
            </ScrollReveal>
            <ScrollReveal as="div" className="audience-card">
              <span className="badge">GROWTH STAGE</span>
              <h3>Growing Businesses & SMEs</h3>
              <p>
                Your existing setup has hit its ceiling. You need modern web applications, connected CRMs, and automated lead routing to replace fragile manual spreadsheets.
              </p>
            </ScrollReveal>
            <ScrollReveal as="div" className="audience-card">
              <span className="badge">WORLDWIDE COLLABORATION</span>
              <h3>Global Collaborators</h3>
              <p>
                International teams partnering with Ethixweb India to tap senior engineering depth, responsive time-zone overlap, and disciplined full-stack craft.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How We Deliver — The 4 Commitments */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">03 / THE DELIVERY STANDARD</span>
          <div className="about-intro-split">
            <h2>Clear communication.<br /><em>Accountable execution.</em></h2>
            <p>
              We have eliminated the traditional agency bloat. You do not talk through multiple layers of account managers who do not understand code. You speak directly with the senior engineers and designers building your product.
            </p>
          </div>

          <div className="delivery-pillars">
            <ScrollReveal as="div" className="pillar-item">
              <span className="num">01</span>
              <h4>Direct Access</h4>
              <p>Direct communication channels with lead engineers on Slack or WhatsApp for prompt, thoughtful collaboration.</p>
            </ScrollReveal>
            <ScrollReveal as="div" className="pillar-item">
              <span className="num">02</span>
              <h4>Transparent Sprints</h4>
              <p>Regular milestone demos and working builds deployed to staging environments so you see real progress weekly.</p>
            </ScrollReveal>
            <ScrollReveal as="div" className="pillar-item">
              <span className="num">03</span>
              <h4>Production Rigor</h4>
              <p>Rigorous automated linting, security scanning, responsive testing, and measured Core Web Vitals on every release.</p>
            </ScrollReveal>
            <ScrollReveal as="div" className="pillar-item">
              <span className="num">04</span>
              <h4>Handover & Support</h4>
              <p>Comprehensive handover documentation, environment setup guides, and structured support SLAs post-launch.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* India Grounded Details Band */}
      <section className="india-band">
        <div className="container india-band-grid">
          <div>
            <span className="eyebrow">MADE FOR HOW INDIA OPERATES</span>
            <h2>Local understanding.<br /><em>Global engineering standards.</em></h2>
          </div>
          <div className="india-details">
            <p><MapPin size={18} /> Based in India, collaborating with ambitious teams worldwide</p>
            <p><Layers size={18} /> Resilient architectures tailored for 4G/5G mobile reality</p>
            <p><TrendingUp size={18} /> Transparent commercial roadmaps without vanity metrics</p>
            <p><ShieldCheck size={18} /> Enterprise-grade security, RLS data protection, and IP ownership</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <ScrollReveal as="section" className="cta-section">
        <div className="container cta-inner">
          <span className="eyebrow">READY TO BUILD SOMETHING MEANINGFUL?</span>
          <h2>Tell us about the challenge<br /><em>in front of you.</em></h2>
          <p>We'll provide a thoughtful initial perspective and clear next steps—no high-pressure sales tactics.</p>
          <Link to="/contact" className="button button-light">
            Start a conversation <ArrowUpRight size={17} />
          </Link>
          <span className="cta-decoration">e.</span>
        </div>
      </ScrollReveal>
    </>
  );
}
