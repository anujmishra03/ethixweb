import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, LogOut, Inbox } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [configError, setConfigError] = useState(false);

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setSession(data.session);
  }

  async function loadLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (session) loadLeads();
  }, [session]);

  async function updateStatus(id, status) {
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
    if (error) setError(error.message);
    else setLeads(old => old.map(l => l.id === id ? { ...l, status } : l));
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (checking) {
    return (
      <main className="admin-shell">
        <p>Checking secure session…</p>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="admin-shell">
        <div className="admin-login">
          <Brand />
          <h1>Admin setup needed</h1>
          <p>Add the Supabase client URL and anon key to <code>client/.env</code>, then configure the SQL policies in the README.</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <form className="admin-login" onSubmit={login}>
          <Brand />
          <span className="eyebrow">PRIVATE WORKSPACE</span>
          <h1>Welcome back.</h1>
          <p>Sign in with the authorised admin account to manage enquiries.</p>
          {error && <div className="form-alert error">{error}</div>}
          <label>
            Email
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <button className="button">
            Sign in securely <ArrowUpRight size={17} />
          </button>
          <Link to="/" className="text-link">← Back to website</Link>
        </form>
      </main>
    );
  }

  const visible = leads.filter(l => filter === 'all' || l.status === filter);

  return (
    <main className="admin-shell admin-dashboard">
      <div className="admin-top">
        <Brand />
        <button className="button button-outline" onClick={logout}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
      <div className="admin-title">
        <div>
          <span className="eyebrow">ETHIXWEB / PRIVATE WORKSPACE</span>
          <h1>Enquiries <em>in focus.</em></h1>
          <p>Review incoming opportunities and keep every conversation moving.</p>
        </div>
        <button className="button" onClick={loadLeads} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh leads'} <ArrowRight size={16} />
        </button>
      </div>
      {error && <div className="form-alert error">{error}</div>}
      <div className="admin-stats">
        <div>
          <span>TOTAL ENQUIRIES</span>
          <strong>{leads.length}</strong>
        </div>
        <div>
          <span>NEW</span>
          <strong>{leads.filter(l => l.status === 'new').length}</strong>
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
      <div className="lead-toolbar">
        <h2><Inbox size={20} /> All leads</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="lead-list">
        {visible.length === 0 ? (
          <div className="admin-empty">
            <Inbox size={30} />
            <h3>No enquiries here yet</h3>
            <p>New submissions will appear in this workspace.</p>
          </div>
        ) : (
          visible.map(l => (
            <article className="lead-card" key={l.id}>
              <div className="lead-card-head">
                <div>
                  <span className="eyebrow">{l.service || 'General enquiry'}</span>
                  <h3>{l.name}</h3>
                  <a href={`mailto:${l.email}`}>{l.email}</a>
                </div>
                <select
                  aria-label={`Update status for ${l.name}`}
                  value={l.status || 'new'}
                  onChange={e => updateStatus(l.id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <p>{l.message}</p>
              <div className="lead-meta">
                <span>{l.company || 'Independent'}</span>
                <span>{l.phone || 'No phone provided'}</span>
                <span>{new Date(l.created_at).toLocaleString('en-IN')}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
