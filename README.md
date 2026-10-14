# Ethixweb India — Full Stack Developer Assessment

A responsive India-specific redesign concept built with React, Vite, Express and Supabase. The visual direction is editorial and restrained: warm paper tones, confident typography, a red accent, architectural shapes and bespoke CSS portfolio illustrations. It aims to feel like a considered digital studio rather than a generic agency template.

> Assessment concept. Portfolio tiles are explicitly labelled as concept directions, not commissioned client work. Do not claim fictional client results, ratings or testimonials.

## Features

- Home page: value proposition, services, process, concept work, differentiators and CTA.
- Inner pages: Services, About / India story and Contact.
- Responsive mobile navigation, accessible focus states, reduced-motion support and semantic forms.
- Enquiry API: Zod server validation, JSON body limit, rate limiting, honeypot spam trap, Helmet headers, origin allowlist and Supabase database insert.
- Admin page: Supabase Auth sign-in, RLS-protected lead list, status updates (`new`, `in_progress`, `completed`), summary counts and refresh.
- No service-role key is shipped to the browser.

## Tech stack

- React 18 + Vite + React Router
- CSS design system (custom CSS; no runtime UI framework)
- Node.js + Express
- Supabase Postgres + Supabase Auth + Row Level Security
- Zod, Helmet, express-rate-limit, CORS, Lucide React

## Run locally

Requirements: Node.js 20+ and an internet connection for package installation.

1. Copy `.env.example` to `server/.env` and copy the client variables to `client/.env` (instructions below). Keep all `.env` files out of Git.
2. In Supabase, create a project. Run `supabase/schema.sql` in the SQL Editor after replacing `admin@example.com` with the exact admin email you will use.
3. In Supabase Authentication, create an admin user with that email and a strong password. Disable public sign-ups if this project will be used beyond the assessment.
4. Configure environment variables:

   `server/.env`
   ```env
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
   ```

   `client/.env`
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

   The Supabase anon/publishable key is intended for browser use with RLS enabled. The service-role key is server-only. Never use a service-role key in a `VITE_` variable.

5. From the repository root:

   ```bash
   npm install
   npm run dev
   ```

   Frontend: `http://localhost:5173` · API health: `http://localhost:5000/api/health` · Admin: `http://localhost:5173/admin`

## Deploy quickly

### Supabase
- Create the project and run `supabase/schema.sql`.
- Replace the policy email in SQL with the real demo admin email before running it.
- Create the admin account in Authentication > Users. Do not put credentials in source control or the README.
- Copy Project URL, anon/publishable key, and service-role key from Project Settings > API.

### API (Render / Railway / any Node host)
- Root directory: `server` (or repository root if the host supports workspaces).
- Build/install command: `npm install` from repository root if using workspace deployment; start command `npm start` from server directory or `node src/index.js`.
- Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CLIENT_ORIGIN` (your exact deployed frontend origin), `PORT` if required.
- Health check: `/api/health`.

### Frontend (Vercel / Netlify)
- Root directory: `client` (if deploying the client independently).
- Build command: `npm run build`; output directory: `dist`.
- Set `VITE_API_URL=https://YOUR_API_HOST/api`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`.
- Update the API's `CLIENT_ORIGIN` to the deployed frontend URL. Redeploy both after changing environment variables.
- Add SPA fallback/rewrites so `/services`, `/about`, `/contact`, and `/admin` resolve to `index.html`.

## Security notes

- The public form never talks directly to the database; Express validates and inserts via the server-only service role.
- Rate limiting is in-memory, suitable for a single-instance assessment demo. Use a shared store (e.g. Redis) if scaling to multiple instances.
- The form has a honeypot, origin allowlist, field limits, and rate limit. For production, add Turnstile/reCAPTCHA and stronger abuse monitoring.
- Admin reads and status updates are enforced by Supabase RLS using the admin email claim. Change the example email in SQL before creating the policy. Do not expose service-role credentials to the admin UI.
- The public `GET /api/health` endpoint reveals only whether the database configuration exists, not secrets.

## Design rationale: India-specific decisions

1. **India is treated as context, not decoration.** The site uses contemporary editorial design, warm mineral colours and an architectural arch motif rather than flag colours or stock imagery of landmarks.
2. **Local business realities are visible.** The narrative acknowledges different business sizes, language and trust contexts, mobile-first usage, bandwidth, and practical operations. The enquiry form includes Indian rupee budget bands and optional +91-friendly phone input without forcing a phone number.
3. **Trust through clarity.** Plain-language services, visible process, realistic contact expectations, privacy reassurance, and no invented client testimonials or performance statistics make the experience feel accountable.
4. **What changed from the current site.** The original Ethixweb site positions itself around digital operations, AI receptionists, websites, CRM, SEO and marketing, with a strong US/home-services focus and a broad service catalogue. This version retains the integrated capability and outcome-first positioning but simplifies the navigation, reduces the amount of repeated service/review content, gives the visitor a clearer journey, uses concept work rather than unverified client claims, and makes the India story explicit. Original references: https://www.ethixweb.com/ and https://www.ethixweb.com/about.
5. **Performance and usability.** CSS-only visual artwork avoids large hero video/animation assets; responsive layout, system-friendly font fallbacks, semantic controls, visible focus states and `prefers-reduced-motion` support reduce unnecessary complexity.

## PageSpeed checklist

Run PageSpeed Insights against the deployed URL on mobile and desktop, then save screenshots for submission. Do not claim a 90+ score until measured. This implementation avoids large image payloads and JS-heavy animation; Google Fonts are the main external visual dependency and can be self-hosted if performance needs improvement. Test the production build, fix any issues reported by PSI, and check all routes and the browser console.

## Assessment hand-in checklist

- [ ] Configure Supabase and verify a submitted enquiry appears in the database.
- [ ] Verify unauthorised visitors cannot read/update leads; sign in as the admin and test status updates.
- [ ] Deploy API and frontend, set production environment variables, and test from the live domain.
- [ ] Run PageSpeed Insights mobile and desktop and attach real screenshots.
- [ ] Add the public repository URL and live URL to the submission form.
- [ ] Share demo admin credentials securely in the submission form only (not in this repository).
- [ ] Record a 1–2 minute walkthrough if time allows.
