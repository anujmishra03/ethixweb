import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(x => x.trim());
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    // Allow local development and LAN testing origins
    if (/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error('Origin not allowed'));
  },
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '20kb' }));
const enquiryRateLimit = process.env.NODE_ENV === 'production' ? 10 : 100;
app.use('/api/enquiries', rateLimit({ windowMs: 15 * 60 * 1000, limit: enquiryRateLimit, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many enquiries from this network. Please try again later.' } }));
const envSchema = z.object({ SUPABASE_URL: z.string().url(), SUPABASE_SERVICE_ROLE_KEY: z.string().min(20) });
const env = envSchema.safeParse(process.env);
const db = env.success ? createClient(env.data.SUPABASE_URL, env.data.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
const enquirySchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), company: z.string().trim().max(120).optional().default(''), phone: z.string().trim().max(20).optional().default(''), service: z.string().trim().min(2).max(100), budget: z.string().trim().max(80).optional().default(''), message: z.string().trim().min(10).max(3000), website: z.string().max(0).optional().default('') });
app.get('/api/health', (_req, res) => res.json({ status: 'ok', databaseConfigured: Boolean(db) }));
app.post('/api/enquiries', async (req, res, next) => {
  try {
    if (req.body?.website) return res.status(200).json({ ok: true }); // Honeypot: silently drop bot submissions.
    if (!db) return res.status(503).json({ error: 'Enquiry service is not configured yet. Please email hello@ethixweb.com.' });
    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Please check the form fields.', fields: parsed.error.issues.map(i => ({ field: i.path[0], message: i.message })) });
    const { name, email, company, phone, service, budget, message } = parsed.data;
    const { error } = await db.from('enquiries').insert({ name, email, company, phone, service, budget, message, status: 'new' });
    if (error) { console.error('Supabase insert failed:', error.code); return res.status(500).json({ error: 'We could not save your enquiry. Please try again shortly.' }); }
    return res.status(201).json({ ok: true, message: 'Enquiry received.' });
  } catch (error) { next(error); }
});
app.use((err, _req, res, _next) => { console.error('Request failed:', err.message); res.status(500).json({ error: 'Unexpected server error. Please try again.' }); });
app.listen(port, () => console.log(`Ethixweb API listening on ${port}`));
