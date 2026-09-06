import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Gamepad2, Link2, Trophy, Heart, Archive, BarChart3, Settings,
  LogOut, Plus, Trash2, Save, Check, Eye, EyeOff, Upload, ChevronRight,
  Moon, Sun, Monitor
} from 'lucide-react';
import { logoutAdmin } from '@/firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useProfile, useGames, useSocialLinks, useEsportsRecords, useArchive, useSettings, useSupportRequests, useAnalytics } from '@/hooks/useData';
import toast from 'react-hot-toast';
import type { Game, SocialLink, ArchiveItem, EsportsRecord } from '@/types';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'social', label: 'Social', icon: Link2 },
  { id: 'esports', label: 'Esports', icon: Trophy },
  { id: 'support', label: 'Support', icon: Heart },
  { id: 'archive', label: 'Archive', icon: Archive },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/');
    toast.success('Logged out');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Admin Header */}
      <header className="sticky top-0 z-50 glass border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg gradient-text">JustJayDev Admin</h1>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="btn-secondary text-sm py-2 px-3">
              View Site
            </button>
            <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-3">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: activeTab === tab.id ? 'white' : 'var(--color-text-muted)',
                  border: `1px solid ${activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'gaming' && <GamingTab />}
          {activeTab === 'social' && <SocialTab />}
          {activeTab === 'esports' && <EsportsTab />}
          {activeTab === 'support' && <SupportTab />}
          {activeTab === 'archive' && <ArchiveTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </motion.div>
      </div>
    </div>
  );
};

// --- Profile Tab ---
const ProfileTab: React.FC = () => {
  const { profile, saveProfile } = useProfile();
  const [form, setForm] = useState({
    displayName: profile?.displayName || '',
    brandName: profile?.brandName || '',
    tagline: profile?.tagline || '',
    bio: profile?.bio || '',
    digitalId: profile?.digitalId || '',
    roles: profile?.roles?.join(', ') || '',
    interests: profile?.interests?.join(', ') || '',
    goals: profile?.goals?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName || '',
        brandName: profile.brandName || '',
        tagline: profile.tagline || '',
        bio: profile.bio || '',
        digitalId: profile.digitalId || '',
        roles: profile.roles?.join(', ') || '',
        interests: profile.interests?.join(', ') || '',
        goals: profile.goals?.join(', ') || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile({
        ...form,
        roles: form.roles.split(',').map(s => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
        goals: form.goals.split(',').map(s => s.trim()).filter(Boolean),
      });
      toast.success('Profile saved!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="input-field resize-none" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} className="input-field" />
      )}
    </div>
  );

  return (
    <div className="card p-6 space-y-4">
      <h2 className="font-bold text-lg flex items-center gap-2"><User size={20} /> Profile</h2>
      <Field label="Display Name" value={form.displayName} onChange={v => setForm(f => ({ ...f, displayName: v }))} />
      <Field label="Brand Name" value={form.brandName} onChange={v => setForm(f => ({ ...f, brandName: v }))} />
      <Field label="Tagline" value={form.tagline} onChange={v => setForm(f => ({ ...f, tagline: v }))} />
      <Field label="Bio" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} multiline />
      <Field label="Digital ID" value={form.digitalId} onChange={v => setForm(f => ({ ...f, digitalId: v }))} />
      <Field label="Roles (comma-separated)" value={form.roles} onChange={v => setForm(f => ({ ...f, roles: v }))} />
      <Field label="Interests (comma-separated)" value={form.interests} onChange={v => setForm(f => ({ ...f, interests: v }))} />
      <Field label="Goals (comma-separated)" value={form.goals} onChange={v => setForm(f => ({ ...f, goals: v }))} />
      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? 'Saving...' : <><Save size={18} /> Save Profile</>}
      </button>
    </div>
  );
};

// --- Gaming Tab ---
const GamingTab: React.FC = () => {
  const { games, saveGame, deleteGame } = useGames();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Game>>({});

  const handleNew = () => {
    setEditingId('new');
    setForm({ name: '', username: '', uid: '', server: '', currentRank: '', highestRank: '', kd: '', winRate: '', playstyle: '', visibility: 'public', order: games.length });
  };

  const handleEdit = (game: Game) => {
    setEditingId(game.id);
    setForm({ ...game });
  };

  const handleSave = async () => {
    try {
      await saveGame(form as Game);
      toast.success('Game saved!');
      setEditingId(null);
    } catch {
      toast.error('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this game?')) return;
    try {
      await deleteGame(id);
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const GField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="block text-xs font-medium mb-1">{label}</label>
      <input value={value || ''} onChange={e => onChange(e.target.value)} className="input-field text-sm" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2"><Gamepad2 size={20} /> Gaming</h2>
        <button onClick={handleNew} className="btn-primary text-sm"><Plus size={16} /> Add Game</button>
      </div>

      {games.map(game => (
        <div key={game.id} className="card p-4">
          {editingId === game.id ? (
            <div className="space-y-3">
              <GField label="Game Name" value={form.name || ''} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <GField label="Username" value={form.username || ''} onChange={v => setForm(f => ({ ...f, username: v }))} />
              <GField label="UID" value={form.uid || ''} onChange={v => setForm(f => ({ ...f, uid: v }))} />
              <GField label="Server" value={form.server || ''} onChange={v => setForm(f => ({ ...f, server: v }))} />
              <GField label="Current Rank" value={form.currentRank || ''} onChange={v => setForm(f => ({ ...f, currentRank: v }))} />
              <GField label="Highest Rank" value={form.highestRank || ''} onChange={v => setForm(f => ({ ...f, highestRank: v }))} />
              <GField label="K/D" value={form.kd || ''} onChange={v => setForm(f => ({ ...f, kd: v }))} />
              <GField label="Win Rate" value={form.winRate || ''} onChange={v => setForm(f => ({ ...f, winRate: v }))} />
              <GField label="Playstyle" value={form.playstyle || ''} onChange={v => setForm(f => ({ ...f, playstyle: v }))} />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.visibility === 'public'} onChange={e => setForm(f => ({ ...f, visibility: e.target.checked ? 'public' : 'hidden' }))} />
                  Public
                </label>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="btn-primary text-sm flex-1"><Save size={16} /> Save</button>
                <button onClick={() => setEditingId(null)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{game.icon || '🎮'}</span>
                <div>
                  <p className="font-semibold">{game.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{game.username} • {game.uid}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(game)} className="p-2 rounded-xl" style={{ background: 'var(--color-surface-2)' }}><Settings size={16} /></button>
                <button onClick={() => handleDelete(game.id)} className="p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)' }}><Trash2 size={16} style={{ color: '#ef4444' }} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- Social Tab ---
const SocialTab: React.FC = () => {
  const { links, saveLink, deleteLink } = useSocialLinks();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<SocialLink>>({ platform: 'discord', username: '', url: '' });

  const platforms = ['discord', 'youtube', 'instagram', 'x', 'reddit', 'github', 'twitter'] as const;

  const handleSave = async () => {
    try {
      await saveLink(form as SocialLink);
      toast.success('Link saved!');
      setShowForm(false);
      setForm({ platform: 'discord', username: '', url: '' });
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2"><Link2 size={20} /> Social Links</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus size={16} /> Add</button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Platform</label>
            <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as any }))} className="input-field text-sm">
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Username</label>
            <input value={form.username || ''} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">URL</label>
            <input value={form.url || ''} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className="input-field text-sm" placeholder="https://" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary text-sm flex-1"><Save size={16} /> Save</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {links.map(link => (
        <div key={link.id} className="card p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold capitalize">{link.platform}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>@{link.username}</p>
          </div>
          <button onClick={() => deleteLink(link.id)} className="p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)' }}><Trash2 size={16} style={{ color: '#ef4444' }} /></button>
        </div>
      ))}
    </div>
  );
};

// --- Esports Tab ---
const EsportsTab: React.FC = () => {
  const { records, saveRecord, deleteRecord } = useEsportsRecords();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<EsportsRecord>>({});

  const handleSave = async () => {
    try {
      await saveRecord(form as EsportsRecord);
      toast.success('Record saved!');
      setShowForm(false);
      setForm({});
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2"><Trophy size={20} /> Esports Records</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus size={16} /> Add</button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          {['title', 'game', 'placement', 'date', 'prize', 'team', 'description'].map(field => (
            <div key={field}>
              <label className="block text-xs font-medium mb-1 capitalize">{field}</label>
              <input value={(form as any)[field] || ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="input-field text-sm" />
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary text-sm flex-1"><Save size={16} /> Save</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {records.map(record => (
        <div key={record.id} className="card p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">{record.title}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{record.game} • {record.date}</p>
          </div>
          <button onClick={() => deleteRecord(record.id)} className="p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)' }}><Trash2 size={16} style={{ color: '#ef4444' }} /></button>
        </div>
      ))}
      {records.length === 0 && !showForm && (
        <div className="card p-8 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No esports records yet.</p>
        </div>
      )}
    </div>
  );
};

// --- Support Tab ---
const SupportTab: React.FC = () => {
  const { requests, updateStatus, refresh } = useSupportRequests();

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg flex items-center gap-2"><Heart size={20} /> Support Requests</h2>
      {requests.map(req => (
        <div key={req.id} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{req.amount}</span>
            <span className={`badge ${req.status === 'pending' ? 'badge-accent' : req.status === 'approved' ? '' : ''}`}
              style={{ color: req.status === 'approved' ? '#10b981' : req.status === 'rejected' ? '#ef4444' : undefined }}>
              {req.status}
            </span>
          </div>
          {req.message && <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{req.message}</p>}
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Sent {new Date(req.createdAt).toLocaleDateString()}</p>
          {req.status === 'pending' && (
            <div className="flex gap-2 mt-3">
              <button onClick={async () => { await updateStatus(req.id, 'approved'); refresh(); toast.success('Approved'); }} className="btn-primary text-xs py-1.5 flex-1" style={{ background: '#10b981' }}>Approve</button>
              <button onClick={async () => { await updateStatus(req.id, 'rejected'); refresh(); toast.success('Rejected'); }} className="btn-secondary text-xs py-1.5 flex-1" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Reject</button>
            </div>
          )}
        </div>
      ))}
      {requests.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No support requests yet.</p>
        </div>
      )}
    </div>
  );
};

// --- Archive Tab ---
const ArchiveTab: React.FC = () => {
  const { items, saveItem, deleteItem } = useArchive();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<ArchiveItem>>({});

  const handleSave = async () => {
    try {
      await saveItem(form as ArchiveItem);
      toast.success('Item saved!');
      setShowForm(false);
      setForm({});
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2"><Archive size={20} /> Archive</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus size={16} /> Add</button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          {['title', 'content', 'type'].map(field => (
            <div key={field}>
              <label className="block text-xs font-medium mb-1 capitalize">{field}</label>
              {field === 'type' ? (
                <select value={form.type || 'lore'} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="input-field text-sm">
                  <option value="achievement">Achievement</option>
                  <option value="message">Message</option>
                  <option value="experiment">Experiment</option>
                  <option value="lore">Lore</option>
                  <option value="easter_egg">Easter Egg</option>
                </select>
              ) : (
                <input value={(form as any)[field] || ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="input-field text-sm" />
              )}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.visibility === 'public'} onChange={e => setForm(f => ({ ...f, visibility: e.target.checked ? 'public' : 'hidden' }))} />
            <span className="text-sm">Public</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary text-sm flex-1"><Save size={16} /> Save</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {items.map(item => (
        <div key={item.id} className="card p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-xs capitalize" style={{ color: 'var(--color-text-muted)' }}>{item.type}</p>
          </div>
          <button onClick={() => deleteItem(item.id)} className="p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)' }}><Trash2 size={16} style={{ color: '#ef4444' }} /></button>
        </div>
      ))}
    </div>
  );
};

// --- Analytics Tab ---
const AnalyticsTab: React.FC = () => {
  const { analytics, loading } = useAnalytics();

  if (loading) {
    return <div className="card p-8 text-center"><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} /></div>;
  }

  if (!analytics) {
    return (
      <div className="card p-8 text-center">
        <p style={{ color: 'var(--color-text-muted)' }}>Analytics data not available. Configure Firebase to enable.</p>
      </div>
    );
  }

  const topSections = Object.entries(analytics.sectionViews || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg flex items-center gap-2"><BarChart3 size={20} /> Analytics</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">{analytics.totalVisitors || 0}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total Visitors</p>
        </div>
        {topSections.map(([section, views]) => (
          <div key={section} className="card p-4 text-center">
            <p className="text-xl font-bold">{views}</p>
            <p className="text-xs capitalize" style={{ color: 'var(--color-text-muted)' }}>{section}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Settings Tab ---
const SettingsTab: React.FC = () => {
  const { settings, saveSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const [canonicalUrl, setCanonicalUrl] = useState(settings?.canonicalUrl || '');

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg flex items-center gap-2"><Settings size={20} /> Settings</h2>

      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Canonical URL</label>
          <input value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} className="input-field" />
          <button onClick={async () => { await saveSettings({ canonicalUrl }); toast.success('URL saved!'); }} className="btn-primary text-sm mt-2"><Save size={16} /> Save URL</button>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="font-semibold">Theme</h3>
        {(['dark', 'light', 'system'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
            style={{
              background: theme === t ? 'rgba(99,102,241,0.1)' : 'var(--color-surface-2)',
              border: `1px solid ${theme === t ? 'var(--color-accent)' : 'var(--color-border)'}`,
            }}
          >
            {t === 'dark' ? <Moon size={18} /> : t === 'light' ? <Sun size={18} /> : <Monitor size={18} />}
            <span className="capitalize text-sm">{t}</span>
            {theme === t && <Check size={16} className="ml-auto" style={{ color: 'var(--color-accent-light)' }} />}
          </button>
        ))}
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Firebase Setup</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Configure your Firebase project in <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--color-surface-2)' }}>src/firebase/config.ts</code> to enable real data persistence and authentication.
        </p>
      </div>
    </div>
  );
};

export default Admin;