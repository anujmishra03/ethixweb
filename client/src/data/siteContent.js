import {
  Code2,
  Layers3,
  Sparkles,
  TrendingUp,
  GitFork,
  LifeBuoy
} from 'lucide-react';

export const services = [
  {
    id: 'web-design-dev',
    n: '01',
    icon: Code2,
    serviceSelect: 'Website design & development',
    title: 'Website Design & Development',
    kicker: 'DIGITAL PRESENCE & CONVERSION',
    desc: 'High-performance, editorial websites engineered for Indian businesses to communicate credibility, withstand high-traffic events, and convert high-intent visitors.',
    problem: 'Many company websites suffer from bloated templates, generic stock layouts, slow load times on mobile 4G/5G, and high bounce rates that fail to convert enterprise or consumer intent.',
    delivers: [
      'Custom art-directed design matching your brand positioning',
      'Ultra-fast frontend engineering (Core Web Vitals 90+)',
      'Responsive, mobile-optimized layouts for Indian viewport diversity',
      'Structured CMS integration for seamless team publishing',
      'Comprehensive on-page SEO semantics and schema markup'
    ],
    businessValue: 'A distinctive, trustworthy digital flagship that loads instantly across tier-1 to tier-3 networks and turns qualified traffic into genuine commercial inquiries.',
    tags: ['Brand Strategy', 'React / Next.js', 'Core Web Vitals', 'Headless CMS']
  },
  {
    id: 'web-apps-products',
    n: '02',
    icon: Layers3,
    serviceSelect: 'Web application / product',
    title: 'Web Applications & Digital Products',
    kicker: 'CUSTOM SOFTWARE & PORTALS',
    desc: 'Robust full-stack web applications, customer portals, and internal platforms engineered to solve complex operational workflows and scale smoothly.',
    problem: 'Off-the-shelf SaaS products often leave gaps in Indian business workflows—causing fragmented spreadsheets, manual handoffs, and fragile workarounds as operations expand.',
    delivers: [
      'Full-stack architecture with React, Node.js, and SQL backends',
      'Role-based access control (RBAC) and row-level security',
      'Custom customer and vendor self-service portals',
      'Secure payment gateway integrations (Razorpay, Cashfree, Stripe)',
      'Automated testing, continuous deployment, and scalable cloud hosting'
    ],
    businessValue: 'Proprietary software assets that fit your exact business logic, eliminate operational friction, and support business growth without exponential headcount increases.',
    tags: ['Web Applications', 'APIs & Backend', 'RBAC & Auth', 'Cloud Architecture']
  },
  {
    id: 'ai-automation',
    n: '03',
    icon: Sparkles,
    serviceSelect: 'AI & workflow automation',
    title: 'AI & Workflow Automation',
    kicker: 'INTELLIGENT OPERATIONS',
    desc: 'Practical AI pipelines, document processing, and automated system workflows that remove repetitive bottlenecks without unnecessary complexity.',
    problem: 'Teams lose hundreds of hours every month manually copying data across disconnected tools, parsing customer communications, and triaging routine queries.',
    delivers: [
      'Intelligent document parsing (invoices, KYC documents, contracts)',
      'Context-aware LLM agents for customer triage and support routing',
      'Automated multi-step workflows connecting email, WhatsApp, and CRM',
      'Custom internal knowledge-base retrieval (RAG systems)',
      'Security-first data handling with zero retention guarantees'
    ],
    businessValue: 'Faster turnaround times, drastically reduced manual error rates, and senior team members freed to focus on high-value business development.',
    tags: ['LLM Workflows', 'Document Parsing', 'Zapier / n8n', 'Automated Triage']
  },
  {
    id: 'seo-marketing',
    n: '04',
    icon: TrendingUp,
    serviceSelect: 'SEO & performance marketing',
    title: 'SEO & Performance Marketing',
    kicker: 'MEASURABLE ACQUISITION',
    desc: 'Technical search optimization, commercial intent content architecture, and disciplined performance campaigns tied directly to qualified pipeline generation.',
    problem: 'Marketing spend is frequently wasted on vanity traffic, unfocused keywords, or high-cost ad campaigns that bring clicks without commercial intent or lead qualification.',
    delivers: [
      'Technical SEO audits: site speed, crawl budget, and schema architecture',
      'Commercial-intent keyword research targeted to Indian decision makers',
      'High-converting landing page design with disciplined A/B testing',
      'Conversion tracking setup across Google Tag Manager, GA4, and Meta CAPI',
      'Full-funnel reporting connecting ad spend directly to qualified pipeline'
    ],
    businessValue: 'Consistent, predictable inbound discovery from customers actively seeking your services, backed by transparent ROI tracking and no inflated vanity metrics.',
    tags: ['Technical SEO', 'Conversion Rate Optimization', 'GA4 & Tracking', 'Paid Search']
  },
  {
    id: 'crm-integrations',
    n: '05',
    icon: GitFork,
    serviceSelect: 'CRM & integrations',
    title: 'CRM & Systems Integration',
    kicker: 'CONNECTED ECOSYSTEMS',
    desc: 'Unified customer records, bidirectional data synchronization, and automated lead management across your sales, marketing, and accounting stacks.',
    problem: 'Customer inquiries fall through the cracks when leads from web forms, WhatsApp, and email are manually entered into disconnected CRMs or spreadsheets.',
    delivers: [
      'Custom API webhooks between web properties and CRM systems',
      'Bi-directional sync between CRM (HubSpot, Zoho, Salesforce) and ERP',
      'WhatsApp Business API integration for instant lead acknowledgment',
      'Automated sales notifications, deal staging, and SLA escalation alerts',
      'Data sanitization, deduplication, and pipeline reporting dashboards'
    ],
    businessValue: 'Zero lead leakage, sub-minute initial response times to customer inquiries, and complete operational transparency from initial touchpoint to closed deal.',
    tags: ['Zoho & HubSpot', 'WhatsApp API', 'Webhooks & REST', 'Data Pipelines']
  },
  {
    id: 'ongoing-support',
    n: '06',
    icon: LifeBuoy,
    serviceSelect: 'Ongoing support',
    title: 'Ongoing Support & Evolution',
    kicker: 'LONG-TERM PARTNERSHIP',
    desc: 'Continuous performance optimization, security monitoring, proactive feature iteration, and responsive SLA support for mission-critical web platforms.',
    problem: 'Software and websites frequently degrade after launch due to unmonitored dependencies, creeping technical debt, security patches, and shifting business needs.',
    delivers: [
      'Guaranteed SLA response times for critical incident resolution',
      'Monthly performance, accessibility, and Core Web Vitals checks',
      'Security patching, dependency updates, and database maintenance',
      'Continuous feature iterations, conversion tweaks, and copy refinements',
      'Direct communication channel with dedicated engineering leads'
    ],
    businessValue: 'Peace of mind knowing your digital infrastructure remains secure, high-performing, and continuously aligned with evolving commercial goals.',
    tags: ['SLA Support', 'Performance Audits', 'Security Patches', 'Continuous Delivery']
  }
];

export const projects = [
  {
    id: 'tara-commerce',
    type: 'DIGITAL COMMERCE',
    title: 'A considered commerce experience for modern lifestyle retail.',
    kicker: 'CONCEPT CASE STUDY',
    desc: 'An editorial e-commerce platform built to solve slow mobile checkouts and improve buyer discovery for modern consumer retail brands in India.',
    problem: 'Traditional theme-based storefronts felt bloated, suffered 4.8s mobile load times, and had significant drop-offs during Indian payment gateway transitions.',
    solution: 'Designed a lightweight, headless storefront with sub-second page transitions, streamlined Razorpay UPI checkout, and an editorial product catalog.',
    techStack: ['React', 'Vite', 'PostgreSQL', 'Tailwind', 'Edge CDN'],
    stat: 'Sub-second transitions',
    cls: 'project-art-one',
    label: 'Commerce / 01',
    demoUrl: '/#work'
  },
  {
    id: 'flow-automation',
    type: 'BUSINESS AUTOMATION',
    title: 'Connecting inquiry capture to instant sales routing.',
    kicker: 'CONCEPT CASE STUDY',
    desc: 'An automated lead orchestration system that ingests multi-channel inbound inquiries, deduplicates records, and assigns priority leads in real time.',
    problem: 'Inbound customer requests from web forms and WhatsApp took an average of 14 hours to reach the right account executive, losing warm commercial intent.',
    solution: 'Engineered an event-driven webhook pipeline that validates lead data, runs automated spam scoring, notifies the on-duty sales rep via WhatsApp/Slack, and logs to CRM.',
    techStack: ['Node.js', 'Express', 'Supabase', 'WhatsApp API', 'Zod'],
    stat: 'Instant routing',
    cls: 'project-art-two',
    label: 'Systems / 02',
    demoUrl: '/#work'
  },
  {
    id: 'north-studio',
    type: 'B2B WEB EXPERIENCE',
    title: 'Clarity and conviction for high-value consultancy services.',
    kicker: 'CONCEPT CASE STUDY',
    desc: 'A minimal, typography-driven digital presence built to articulate complex enterprise engineering capabilities with authority and restraint.',
    problem: 'The client’s previous website was overwhelmed with generic tech buzzwords, masking their real depth of expertise and confusing prospective enterprise buyers.',
    solution: 'Created an editorial digital identity with structured case breakdowns, clear architectural diagrams, and zero-distraction layout hierarchy.',
    techStack: ['React', 'CSS Custom Props', 'Performance-First Architecture'],
    stat: '100% Core Web Vitals',
    cls: 'project-art-three',
    label: 'Web / 03',
    demoUrl: '/#work'
  }
];
