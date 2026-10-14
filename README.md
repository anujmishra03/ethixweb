# Ethixweb India — Full-Stack Developer Assessment

[![Live Production Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://ethixweb-india-snowy.vercel.app/)
[![Lighthouse Desktop](https://img.shields.io/badge/Lighthouse%20Desktop-93%2F100-brightgreen?style=flat)](https://ethixweb-india-snowy.vercel.app/)
[![Lighthouse Mobile](https://img.shields.io/badge/Lighthouse%20Mobile-92%2F100-brightgreen?style=flat)](https://ethixweb-india-snowy.vercel.app/)

A production-grade, full-stack digital agency web application tailored for the Indian business and startup ecosystem. Built with **React 18**, **Three.js**, **Express**, **Zod**, and **Supabase (PostgreSQL with Row Level Security)**.

The design language embodies a high-end editorial studio: warm ivory tones (`#f7f5f0`), confident typography, brand-red accents (`#d94332`), generous whitespace, restrained micro-interactions, an interactive 3D India-connected network globe, and zero clichéd stock imagery.

---

## 1. Project Overview & Architecture

### System Architecture
```
                                 [ Client Browser ]
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
           Static Pages & 3D Hero                         Authenticated Admin
        (Code-split React & Three.js)                   (Supabase Auth + RLS)
                 │                                               │
                 │ POST /api/enquiries                           │ Direct Query / Update
                 ▼                                               │ with JWT Bearer Token
        [ Express API Gateway ]                                  │
      (Helmet, Rate-limit, CORS, Zod)                            │
                 │                                               │
                 │ Service Role Key (Server-only)                ▼
                 └───────────────────────────────► [ Supabase PostgreSQL ]
                                                   - public.enquiries table
                                                   - Strict Row Level Security
```

*   **Live Deployed URL:** [https://ethixweb-india-snowy.vercel.app/](https://ethixweb-india-snowy.vercel.app/)
*   **API Health Endpoint:** [https://ethixweb-india-snowy.vercel.app/api/health](https://ethixweb-india-snowy.vercel.app/api/health)

---

## 2. Key Features

### 1. Signature 3D India Network Globe Hero
*   Interactive Three.js sphere featuring an authentic 402-point geographic boundary outline of India and 45 continental landmass polygons.
*   5 Indian technology hubs (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai) connected via Great Circle Bezier arcs with traveling photon pulses.
*   Inertial drag rotation, subtle desktop mouse-follow parallax, hub hover inspection, and orbital rings.
*   **Performance-first:** DPR capped at 1.5, Three.js isolated into a dedicated bundle chunk (529 kB), automatic render loop freezing via `IntersectionObserver` when off-screen or tab is backgrounded.
*   **Instant LCP & Mobile Fallback:** Instantaneous architectural SVG fallback card on mobile devices (`< 768px`) with zero layout shift (CLS: 0.001) and a 1-tap "Launch 3D Scene" button.

### 2. Comprehensive 6-Service Architecture (`/services`)
Each service communicates the **business friction/problem**, **what Ethixweb delivers**, and **expected business value** with relevant contextual CTAs:
1.  **Website Design & Development:** Conversion-focused, sub-second editorial digital flagships.
2.  **Web Applications & Digital Products:** Custom portals, internal tools, and RBAC-governed web apps.
3.  **AI & Workflow Automation:** LLM document parsing, automated triage, and intelligent operations.
4.  **SEO & Performance Marketing:** Technical SEO semantics, high-intent landing pages, and commercial pipeline growth.
5.  **CRM & Systems Integration:** Lead deduplication, WhatsApp Business API integration, and CRM sync.
6.  **Ongoing Support & Evolution:** SLA response guarantees, continuous Core Web Vitals checks, and security maintenance.

### 3. Indian-Market Positioning (`/about`)
*   Context-first narrative articulating the realities of Indian commerce: 4G/5G mobile latency, tier-1 to tier-3 device diversity, UPI payment flows, and transparent pricing.
*   Audience-tailored collaboration models: Startups & Founders, Growing Businesses & SMEs, and Global Collaborators.
*   The Ethixweb delivery standard: Direct communication with senior engineers (no sales middleman), transparent sprint milestones, and 100% IP handover.

### 4. Selected Work Case Studies (`/#work`)
*   Interactive portfolio breakdown featuring problem statements, engineering solutions, and technology architecture chips for:
    *   *Digital Commerce (Tara Lifestyle)*
    *   *Business Automation (Inquiry Flow)*
    *   *B2B Web Experience (North Studio)*
*   Clear disclosure: *Concept directions developed for this assessment to demonstrate full-stack engineering and UI craft.*

### 5. Robust Project Enquiry Workflow (`/contact`)
*   Two-column desktop layout collapsing cleanly to single-column on mobile.
*   Fields: Name, Work Email, Company (optional), Phone (optional), Service Category, Indicative Budget, and Project Brief.
*   Honeypot field (`website`) silently trapping automated spam bots.
*   Input normalization and dual-tier validation (client-side interactive feedback + server-side Zod parsing).
*   Double-submission prevention and resilient error handling.

### 6. Protected Admin Dashboard (`/admin`)
*   Real authenticated admin login via Supabase Auth (`supabase.auth.signInWithPassword`).
*   Authorization enforced at the database level by PostgreSQL Row Level Security (RLS).
*   Unauthorized session detection: Displays a clear access denied warning and sign-out prompt if a non-admin account signs in.
*   Live KPI summary counters (Total, New, In Progress, Completed).
*   Real-time search filter (searches across name, email, company, service, and message body).
*   Status filter pill selector and status updating (`new` → `in_progress` → `completed`) with immediate database persistence.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, React Router v6, Vite 6 |
| **3D Graphics** | Three.js (r182), Custom Great Circle Arc math |
| **Icons & UI** | Lucide React, Custom CSS Design System |
| **Micro-Interactions** | Hardware-accelerated Custom Cursor, Accessible Magnetic Buttons, Shared Viewport Observer |
| **Backend API** | Node.js, Express, Helmet, CORS, Express-Rate-Limit, Zod |
| **Database & Auth** | Supabase (PostgreSQL 15), Supabase Auth, Row Level Security (RLS) |
| **Deployment** | Vercel (Frontend SPA + Serverless Express API Gateway) |

---

## 4. Measured Performance Metrics (Google Lighthouse 13.5.0)

> Audited against production build with Moto G4 4x CPU slowdown:

| Metric | Desktop Score | Mobile Score (Throttled) | Target |
| :--- | :---: | :---: | :---: |
| **Performance** | **93 / 100** | **92 / 100** | **90+** |
| **Accessibility** | **94 / 100** | **93 / 100** | Best practice |
| **Best Practices** | **96 / 100** | **96 / 100** | Best practice |
| **SEO** | **91 / 100** | **91 / 100** | Best practice |
| **First Contentful Paint (FCP)** | `0.9 s` | `2.7 s` | Fast |
| **Largest Contentful Paint (LCP)** | `1.0 s` | `2.7 s` | Fast |
| **Total Blocking Time (TBT)** | `140 ms` | **`0 ms`** | Zero thread block |
| **Cumulative Layout Shift (CLS)** | `0.003` | `0.001` | Zero shift |

---

## 5. Repository Structure

```
ethixweb-india/
├── api/
│   └── index.js                 # Vercel serverless function entrypoint (wraps Express app)
├── client/
│   ├── index.html               # Semantic HTML entry with async font preload
│   ├── package.json
│   ├── vite.config.js           # API proxy & manualChunks code splitting
│   └── src/
│       ├── main.jsx             # App routing, Navbar, Footer, and Home section
│       ├── styles.css           # Custom CSS design system & editorial layouts
│       ├── components/
│       │   ├── globe/
│       │   │   ├── IndiaNetworkGlobe.jsx  # Interactive 3D Three.js globe
│       │   │   ├── GlobeFallback.jsx      # Architectural SVG fallback card
│       │   │   ├── constants.js           # Coordinates for Indian tech hubs & partners
│       │   │   ├── math.js                # Spherical geometry & Great Circle arcs
│       │   │   └── globe.css              # Globe scoped HUD & tooltip styles
│       │   └── ui/
│       │       ├── CustomCursor.jsx       # Non-blocking translate3d cursor
│       │       ├── MagneticButton.jsx     # Keyboard-accessible magnetic spring pull
│       │       └── ScrollReveal.jsx       # Viewport observer with auto-unobserve
│       ├── data/
│       │   ├── geoData.js                 # 402-point India boundary & world outlines
│       │   └── siteContent.js             # 6 services, project case studies, metadata
│       ├── lib/
│       │   └── supabaseClient.js          # Isolated Supabase client
│       └── pages/
│           ├── ServicesPage.jsx           # Dedicated 6-service editorial breakdowns
│           ├── AboutPage.jsx              # Indian-market positioning & delivery standards
│           ├── ContactPage.jsx            # Enquiry form with Zod validation
│           └── AdminPage.jsx              # Protected dashboard with search & status updates
├── server/
│   ├── package.json
│   └── src/
│       ├── app.js               # Express application, Helmet, CORS, Rate Limit, Zod
│       └── index.js             # Local development server entrypoint (port 5000)
├── supabase/
│   └── schema.sql               # PostgreSQL schema, constraints, indexes & RLS policies
├── vercel.json                  # Vercel monorepo build & API rewrite configuration
├── .env.example                 # Environment variables template with placeholders
├── package.json                 # Root workspace orchestrator
└── README.md
```

---

## 6. Local Setup & Execution

### Prerequisites
*   Node.js 20+
*   npm 10+

### Installation
```bash
# 1. Clone repository
git clone https://github.com/anujmishra2038/ethixweb-india.git
cd ethixweb-india

# 2. Install dependencies across root, client, and server
npm install
```

### Environment Configuration
1.  **Backend environment (`server/.env`):**
    ```env
    PORT=5000
    CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
    SUPABASE_URL=https://your-project-id.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    ADMIN_EMAIL=admin@ethixweb.com
    ```
2.  **Frontend environment (`client/.env`):**
    ```env
    VITE_API_URL=/api
    VITE_SUPABASE_URL=https://your-project-id.supabase.co
    VITE_SUPABASE_ANON_KEY=your_supabase_public_anon_key
    ```

### Running Locally
```bash
# Run both Express API (port 5000) and Vite frontend (port 5173) concurrently:
npm run dev
```

*   **Frontend:** `http://localhost:5173`
*   **Backend API Health:** `http://localhost:5000/api/health`
*   **Admin Dashboard:** `http://localhost:5173/admin`

### Building for Production
```bash
# Compile client production bundle
npm run build --prefix client

# Preview production build locally
npx vite preview --prefix client --port 4173
```

---

## 7. Supabase Database & Security Setup

1.  Create a project at [supabase.com](https://supabase.com).
2.  Open **SQL Editor** in the Supabase Dashboard and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
3.  Navigate to **Authentication > Users** and create an administrator user with the email configured in your RLS policy (`itachimishra2@gmail.com` or custom).
4.  Copy your **Project URL**, **anon key**, and **service_role key** from **Project Settings > API** into your `.env` files.

### Row Level Security (RLS) Rules:
*   **Anonymous Visitors:** 0 read access, 0 write access. Form submissions pass through the rate-limited backend using the server-side service role key.
*   **Authenticated Admin:** Full `SELECT` and `UPDATE` access restricted to verified admin JWT claims.

---

## 8. Deployment on Vercel

The project is structured for native monorepo deployment on Vercel:

1.  **Framework Preset:** Vite
2.  **Build Command:** `npm run build`
3.  **Output Directory:** `client/dist`
4.  **Root Directory:** `./`
5.  **Rewrites (`vercel.json`):**
    *   `/api/:path*` → `/api/index.js` (Serverless Express handler)
    *   `/((?!api/).*)` → `/index.html` (SPA client routing)
6.  **Environment Variables in Vercel:**
    *   `SUPABASE_URL`
    *   `SUPABASE_SERVICE_ROLE_KEY`
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
    *   `VITE_API_URL=/api`

---

## 9. Disclaimers & Known Limitations
*   **Concept Directions:** The case study directions displayed in the `#work` section are explicitly presented as design and architecture concepts demonstrating full-stack engineering capability for this assessment.
*   **Admin Demonstration Access:** Admin credentials should never be committed into source control. To review the live admin dashboard, authenticate with the configured test account or provide your email to be granted RLS read permissions in `supabase/schema.sql`.
