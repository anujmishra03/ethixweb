import React, { useState, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Workflow,
  ShieldCheck,
  Gauge,
  Check,
  CircleCheck
} from 'lucide-react';
import './styles.css';
import { services, projects } from './data/siteContent.js';
import GlobeFallback from './components/globe/GlobeFallback.jsx';
import CustomCursor from './components/ui/CustomCursor.jsx';
import MagneticButton from './components/ui/MagneticButton.jsx';
import ScrollReveal from './components/ui/ScrollReveal.jsx';

// Code-split components for optimal Core Web Vitals & FCP/LCP
const IndiaNetworkGlobe = lazy(() => import('./components/globe/IndiaNetworkGlobe.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

function Brand({ light = false }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Ethixweb India home">
      <span className="brand-mark">e<span>.</span></span>
      <span>ethixweb<small>INDIA</small></span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container nav-wrap">
        <Brand />
        <nav className={open ? 'nav nav-open' : 'nav'}>
          <NavLink onClick={() => setOpen(false)} to="/services">Services</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/about">About</NavLink>
          <a onClick={() => setOpen(false)} href="/#work">Our work</a>
          <NavLink onClick={() => setOpen(false)} to="/contact">Contact</NavLink>
          <MagneticButton>
            <Link className="nav-cta" to="/contact" onClick={() => setOpen(false)}>
              Start a project <ArrowUpRight size={16} />
            </Link>
          </MagneticButton>
        </nav>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <Brand light />
          <p className="footer-tag">Thoughtful digital. Tangible progress.</p>
        </div>
        <div className="footer-links">
          <div>
            <span className="eyebrow">EXPLORE</span>
            <Link to="/services">Services</Link>
            <Link to="/about">Our story</Link>
            <a href="/#work">Selected work</a>
          </div>
          <div>
            <span className="eyebrow">LET'S TALK</span>
            <Link to="/contact">Start a project <ArrowUpRight size={14} /></Link>
            <a href="mailto:hello@ethixweb.com">hello@ethixweb.com</a>
            <span>India · Working worldwide</span>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Ethixweb India. Built with intent.</span>
        <span>Independent thinking. Accountable delivery.</span>
      </div>
    </footer>
  );
}

function ButtonLink({ to = '/contact', children, light = false }) {
  return (
    <MagneticButton>
      <Link className={`button ${light ? 'button-light' : ''}`} to={to}>
        {children}
        <ArrowUpRight size={17} />
      </Link>
    </MagneticButton>
  );
}

function SectionIntro({ kicker, title, copy }) {
  return (
    <div className="section-intro">
      <span className="eyebrow">{kicker}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

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

function HeroGlobeSlot() {
  const [load3D, setLoad3D] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768;
  });

  return (
    <div className="hero-globe-wrap">
      {load3D ? (
        <Suspense fallback={<GlobeFallback />}>
          <IndiaNetworkGlobe />
        </Suspense>
      ) : (
        <GlobeFallback onActivate3D={() => setLoad3D(true)} showActivateButton={true} />
      )}
    </div>
  );
}

function ProjectCard({ p, i }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="project-card">
      <div className={`project-art ${p.cls}`}>
        <span className="project-label">{p.label}</span>
        {i === 0 ? (
          <div className="commerce-mock">
            <div className="mock-nav">FORM / FUNCTION <span>SHOP ↗</span></div>
            <div className="mock-orb" />
            <div className="mock-type">Made for<br /><i>every day.</i></div>
            <div className="mock-pill">DISCOVER THE EDIT ↗</div>
          </div>
        ) : i === 1 ? (
          <div className="flow-mock">
            <div className="flow-node">NEW ENQUIRY <ArrowUpRight size={14} /></div>
            <div className="flow-line" />
            <div className="flow-node flow-node-dark">SMART ROUTING <Workflow size={15} /></div>
            <div className="flow-line" />
            <div className="flow-node">TEAM NOTIFIED <Check size={14} /></div>
            <span className="flow-caption">ONE CONNECTED SYSTEM</span>
          </div>
        ) : (
          <div className="web-mock">
            <div className="web-mock-nav">NORTH / STUDIO <span>MENU +</span></div>
            <div className="web-mock-head">Clarity in<br /><em>every detail.</em></div>
            <div className="web-mock-circle">N°01</div>
            <div className="web-mock-foot">BUILT FOR WHAT'S NEXT ↗</div>
          </div>
        )}
      </div>

      <div className="project-meta">
        <span className="eyebrow">{p.type}</span>
        <span className="project-stat">{p.stat}</span>
      </div>

      <h3>{p.title}</h3>
      <p>{p.desc}</p>

      <button
        type="button"
        className="work-details-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`case-details-${p.id}`}
      >
        {expanded ? 'Hide case overview' : 'View case breakdown'}
        <ArrowRight
          size={13}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {expanded && (
        <div id={`case-details-${p.id}`} className="case-study-drawer">
          <strong>THE CHALLENGE</strong>
          <p>{p.problem}</p>
          <strong>ENGINEERING SOLUTION</strong>
          <p>{p.solution}</p>
          <strong>TECHNOLOGY ARCHITECTURE</strong>
          <div className="case-tech-chips">
            {p.techStack.map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-line">
              <span /> DIGITAL PARTNER FOR AMBITIOUS INDIAN BUSINESSES
            </div>
            <h1>Make your next move <em>mean more.</em></h1>
            <p className="hero-lede">
              We bring strategy, design and technology together to help Indian businesses move forward—with clarity, craft and measurable intent.
            </p>
            <div className="hero-actions">
              <ButtonLink>Tell us what you're building</ButtonLink>
              <a className="text-link" href="#services">
                Explore what we do <ArrowRight size={16} />
              </a>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars">
                <span>A</span><span>R</span><span>M</span>
              </div>
              <p>
                <strong>Small team. Senior thinking.</strong><br />
                Built around your business, not ours.
              </p>
            </div>
          </div>

          <HeroGlobeSlot />
        </div>

        <div className="container hero-bottom">
          <span>FROM FIRST IDEA TO WHAT'S NEXT</span>
          <span className="scroll-cue"><span /> SCROLL TO EXPLORE</span>
        </div>
      </section>

      <ScrollReveal as="section" className="intro-band">
        <div className="container intro-band-grid">
          <span className="eyebrow">THE ETHIXWEB APPROACH</span>
          <p>
            Good digital work isn't decoration. It's a <span>business advantage</span>—built with care, shaped by context, and measured by what changes.
          </p>
          <span className="intro-aside">Strategy first.<br />No noise, just progress.</span>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="section services-section" id="services">
        <div className="container">
          <SectionIntro
            kicker="WHAT WE BRING TO THE TABLE"
            title={<>One partner.<br /><em>More possibilities.</em></>}
            copy="The right mix of creative thinking and technical depth, brought together around the challenge in front of you."
          />
          <div className="service-grid">
            {services.map(s => (
              <article className="service-card" key={s.n}>
                <div className="service-card-top">
                  <span>{s.n} / 06</span>
                  <s.icon size={22} strokeWidth={1.5} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="tag-list">
                  {s.tags.map(t => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <Link to={`/services#${s.id}`} className="round-arrow" aria-label={`Explore ${s.title}`}>
                  <ArrowUpRight size={18} />
                </Link>
              </article>
            ))}
          </div>
          <div className="section-link-row">
            <span>From a sharp first impression to a better operating system.</span>
            <Link className="text-link" to="/services">
              Explore all 6 services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="section work-section" id="work">
        <div className="container">
          <div className="section-head-row">
            <SectionIntro
              kicker="SELECTED DIRECTIONS"
              title={<>Work with a point<br /><em>of view.</em></>}
            />
            <p className="head-note">
              Every business has a different problem to solve. Our work starts by finding the right one.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((p, i) => (
              <ProjectCard key={p.id || p.title} p={p} i={i} />
            ))}
          </div>
          <p className="work-note">
            Concept directions shown for this assessment—not represented as commissioned client work.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="section process-section">
        <div className="container process-layout">
          <div className="process-left">
            <SectionIntro
              kicker="A BETTER WAY TO BUILD"
              title={<>Thoughtful work.<br /><em>Clear steps.</em></>}
              copy="No mystery process or hand-offs into a black box. You stay close to the decisions and know what comes next."
            />
            <ButtonLink to="/about">How we work</ButtonLink>
          </div>
          <div className="process-list">
            {[
              { n: '01', title: 'Listen & understand', text: 'We start with your goals, audience, constraints and what success should look like.' },
              { n: '02', title: 'Find the right direction', text: 'A clear plan, a shared point of view and priorities tied to business value.' },
              { n: '03', title: 'Make it real', text: 'Design and development move together, with feedback at the moments that matter.' },
              { n: '04', title: 'Learn, improve, grow', text: 'We measure what matters, refine what we ship and make the next move with evidence.' }
            ].map(x => (
              <div className="process-item" key={x.n}>
                <span>{x.n}</span>
                <div>
                  <h3>{x.title}</h3>
                  <p>{x.text}</p>
                </div>
                <ArrowUpRight size={18} />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="section why-section">
        <div className="container why-grid">
          <div className="why-art">
            <div className="why-art-note">A DIFFERENT KIND<br />OF DIGITAL PARTNER</div>
            <div className="why-circle">Less theatre.<br /><em>More thought.</em></div>
            <span className="why-coord">28°36' N / 77°13' E</span>
          </div>
          <div className="why-copy">
            <SectionIntro
              kicker="WHY ETHIXWEB"
              title={<>Built around your<br /><em>real world.</em></>}
              copy="The best solution isn't the one with the most features. It's the one that makes a meaningful difference to your people and your business."
            />
            <div className="why-points">
              <div>
                <ShieldCheck />
                <span>
                  <strong>Clarity over complexity</strong>
                  <small>Plain language, thoughtful choices and no unnecessary tech theatre.</small>
                </span>
              </div>
              <div>
                <Gauge />
                <span>
                  <strong>Performance by default</strong>
                  <small>Accessible, responsive experiences designed to feel fast and stay useful.</small>
                </span>
              </div>
              <div>
                <CircleCheck />
                <span>
                  <strong>Accountability at every step</strong>
                  <small>Clear scope, open communication and work you can confidently own.</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="cta-section">
        <div className="container cta-inner">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>Have a good challenge?<br /><em>Let's make it count.</em></h2>
          <p>Tell us where you want to go. We'll help you work out what it takes to get there.</p>
          <ButtonLink light>Start a conversation</ButtonLink>
          <span className="cta-decoration">e.</span>
        </div>
      </ScrollReveal>
    </>
  );
}

function PageLoadingFallback() {
  return (
    <div className="container" style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
      <p style={{ color: 'var(--muted)', fontSize: '13px', letterSpacing: '1px' }}>Loading content…</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Header />
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="*"
            element={
              <PageHero
                eyebrow="404 / WRONG TURN"
                title={<>This page took<br /><em>a different route.</em></>}
                copy="The page you're looking for isn't here. Let's get you back on track."
              />
            }
          />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
