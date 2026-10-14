import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  LogOut,
  Inbox,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient.js';

function Brand({ light = false }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Ethixweb India home">
      <span className="brand-mark">e<span>.</span></span>
      <span>ethixweb<small>INDIA</small></span>
    </Link>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [configError, setConfigError] = useState(false);
  const [authDenied, setAuthDenied] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setConfigError(true);
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();
    setError('');
    setAuthDenied(false);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSession(data.session);
    }
  }

  async function loadLeads() {
    setLoading(true);
    setError('');
    setAuthDenied(false);

    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42501' || error.message.toLowerCase().includes('permission denied')) {
          setAuthDenied(true);
        } else {
          setError(error.message);
        }
      } else {
        setLeads(data || []);
      }
    } catch (err) {
      setError(err.message || 'Could not fetch enquiry records.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session) {
      loadLeads();
    }
  }, [session]);

  async function updateStatus(id, newStatus) {
    setStatusUpdating(id);
    setError('');
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        setError(`Failed to update status: ${error.message}`);
      } else {
        setLeads(old => old.map(l => (l.id === id ? { ...l, status: newStatus } : l)));
      }
    } catch (err) {
      setError(err.message || 'Error updating status.');
    } finally {
      setStatusUpdating(null);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setLeads([]);
    setError('');
    setAuthDenied(false);
  }

  if (checking) {
    return (
      <main className="admin-shell" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Verifying secure session…</p>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="admin-shell">
        <div className="admin-login">
          <Brand />
          <h1>Admin configuration needed</h1>
          <p>
            Add the Supabase client URL and anon key to <code>client/.env</code>, then apply the SQL policies from <code>supabase/schema.sql</code>.
          </p>
          <Link to="/" className="text-link">← Return to website</Link>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <form className="admin-login" onSubmit={login}>
          <Brand />
          <span className="eyebrow">AUTHENTICATED ADMIN WORKSPACE</span>
          <h1>Welcome back.</h1>
          <p>Sign in with your verified administrator credentials to view and manage inbound client inquiries.</p>
          {error && (
            <div className="form-alert error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          <label>
            Admin Email
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@ethixweb.com"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </label>
          <button className="button" type="submit">
            Sign in to Workspace <ArrowUpRight size={17} />
          </button>
          <Link to="/" className="text-link">← Return to public website</Link>
        </form>
      </main>
    );
  }

  if (authDenied) {
    return (
      <main className="admin-shell">
        <div className="admin-login">
          <Brand />
          <ShieldAlert size={36} color="var(--red)" style={{ margin: '16px 0 8px' }} />
          <h1>Access Unauthorized</h1>
          <p>
            You are signed in as <strong>{session.user.email}</strong>, but this account is not registered as an authorized administrator in Supabase Row Level Security.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
            To grant access, add your email address to the RLS policy in <code>supabase/schema.sql</code> and execute in the Supabase SQL Editor.
          </p>
          <button className="button" onClick={logout} style={{ marginTop: '16px' }}>
            <LogOut size={16} /> Sign out and switch account
          </button>
        </div>
      </main>
    );
  }

  // Filter leads by status and search query
  const filteredLeads = leads.filter(l => {
    const matchesStatus = filter === 'all' || l.status === filter;
    const query = searchTerm.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesSearch =
      (l.name && l.name.toLowerCase().includes(query)) ||
      (l.email && l.email.toLowerCase().includes(query)) ||
      (l.company && l.company.toLowerCase().includes(query)) ||
      (l.service && l.service.toLowerCase().includes(query)) ||
      (l.message && l.message.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  return (
    <main className="admin-shell admin-dashboard">
      <div className="admin-top">
        <Brand />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            Signed in as <strong>{session.user.email}</strong>
          </span>
          <button className="button button-outline" onClick={logout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>

      <div className="admin-title">
        <div>
          <span className="eyebrow">ETHIXWEB INDIA / SECURE OPERATIONS</span>
          <h1>Inbound Inquiries <em>in focus.</em></h1>
          <p>Review real-time project submissions, triage requirements, and track follow-up progress.</p>
        </div>
        <button className="button" onClick={loadLeads} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          {loading ? 'Refreshing…' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="form-alert error" role="alert" style={{ marginBottom: '24px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Counters */}
      <div className="admin-stats">
        <div>
          <span>TOTAL LEADS</span>
          <strong>{leads.length}</strong>
        </div>
        <div>
          <span>NEW</span>
          <strong style={{ color: 'var(--red)' }}>{leads.filter(l => l.status === 'new').length}</strong>
        </div>
        <div>
          <span>IN PROGRESS</span>
          <strong>{leads.filter(l => l.status === 'in_progress').length}</strong>
        </div>
        <div>
          <span>COMPLETED</span>
          <strong>{leads.filter(l => l.status === 'completed').length}</strong>
        </div>
      </div>

      {/* Search and Status Toolbar */}
      <div className="admin-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--muted)" />
          <input
            type="search"
            className="admin-search-input"
            placeholder="Search by client name, email, company, service or message…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '1px', fontWeight: 600 }}>STATUS:</span>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--line)', background: '#faf8f5', fontSize: '12px' }}
          >
            <option value="all">All statuses ({leads.length})</option>
            <option value="new">New ({leads.filter(l => l.status === 'new').length})</option>
            <option value="in_progress">In progress ({leads.filter(l => l.status === 'in_progress').length})</option>
            <option value="completed">Completed ({leads.filter(l => l.status === 'completed').length})</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="lead-list">
        {filteredLeads.length === 0 ? (
          <div className="admin-empty">
            <Inbox size={32} />
            <h3>No enquiries match your criteria</h3>
            <p>
              {searchTerm
                ? `No submissions matched "${searchTerm}". Try resetting your search filter.`
                : 'New inquiries submitted via the contact form will appear here in real-time.'}
            </p>
            {searchTerm && (
              <button
                className="button button-outline"
                style={{ marginTop: '12px' }}
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredLeads.map(l => (
            <article className="lead-card" key={l.id}>
              <div className="lead-card-head">
                <div>
                  <div className="lead-badges">
                    <span className="badge-tag">{l.service || 'General enquiry'}</span>
                    {l.budget && <span className="badge-tag budget">{l.budget}</span>}
                  </div>
                  <h3 style={{ marginTop: '8px' }}>{l.name}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '6px', fontSize: '12px' }}>
                    <a href={`mailto:${l.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--red)' }}>
                      <Mail size={13} /> {l.email}
                    </a>
                    {l.phone && (
                      <a href={`tel:${l.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#555' }}>
                        <Phone size={13} /> {l.phone}
                      </a>
                    )}
                    {l.company && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#666' }}>
                        <Building size={13} /> {l.company}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <label htmlFor={`status-${l.id}`} style={{ fontSize: '10px', letterSpacing: '1px', color: 'var(--muted)' }}>
                    TRIAGE STATUS
                  </label>
                  <select
                    id={`status-${l.id}`}
                    aria-label={`Update status for ${l.name}`}
                    value={l.status || 'new'}
                    disabled={statusUpdating === l.id}
                    onChange={e => updateStatus(l.id, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderColor: l.status === 'new' ? 'var(--red)' : 'var(--line)'
                    }}
                  >
                    <option value="new">New Lead</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed / Handled</option>
                  </select>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="lead-message-box">
                {l.message}
              </div>

              <div className="lead-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} /> Received: {new Date(l.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.5px' }}>
                  ID: {l.id.slice(0, 8)}…
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
