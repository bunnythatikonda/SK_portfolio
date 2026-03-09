import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Save, Trash2, Plus, ArrowLeft, 
  User, GraduationCap, Briefcase, FolderOpen, Wrench,
  Eye, EyeOff, Loader2
} from 'lucide-react';
import {
  adminLogin,
  verifyAdmin,
  getAllContent,
  updateAbout,
  saveEducation,
  deleteEducation,
  saveExperience,
  deleteExperience,
  saveProject,
  deleteProject,
  saveSkill,
  deleteSkill
} from '../services/api';

// Login Component
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        localStorage.setItem('adminToken', result.token);
        onLogin(result.token);
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <h1 className="text-2xl font-heading font-bold text-white mb-2 text-center">Admin Login</h1>
          <p className="text-[#aaa] text-sm text-center mb-6">Sign in to manage portfolio content</p>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#aaa] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-4 py-2 text-white focus:border-[#12d640] focus:outline-none transition-colors"
                placeholder="admin@example.com"
                required
                data-testid="admin-email-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-mono text-[#aaa] mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded px-4 py-2 pr-10 text-white focus:border-[#12d640] focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  data-testid="admin-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-mono text-sm uppercase tracking-wider font-medium text-black disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #12d640 0%, #00d4ff 100%)' }}
              data-testid="admin-login-btn"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-[#12d640] text-sm hover:underline flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> Back to Portfolio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
        active 
          ? 'bg-[#12d640] text-black' 
          : 'text-[#aaa] hover:text-white hover:bg-[#1a1a1a]'
      }`}
      data-testid={`tab-${label.toLowerCase()}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

// About Editor
function AboutEditor({ data, token, onSave }) {
  const [text, setText] = useState(data?.text || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAbout(token, { text });
      onSave();
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading text-white">Edit About Section</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 bg-[#1a1a1a] border border-[#333] rounded p-4 text-white focus:border-[#12d640] focus:outline-none resize-none"
        placeholder="Enter your about text here..."
        data-testid="about-textarea"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2 rounded font-mono text-sm text-black"
        style={{ background: 'linear-gradient(135deg, #12d640 0%, #00d4ff 100%)' }}
        data-testid="save-about-btn"
      >
        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
        Save Changes
      </button>
    </div>
  );
}

// Education Editor
function EducationEditor({ data, token, onSave }) {
  const [items, setItems] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    institution: '', degree: '', period: '', location: '', courses: ''
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingId('new');
    setForm({ institution: '', degree: '', period: '', location: '', courses: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      institution: item.institution,
      degree: item.degree,
      period: item.period,
      location: item.location,
      courses: item.courses
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        id: editingId === 'new' ? undefined : editingId
      };
      await saveEducation(token, payload);
      setEditingId(null);
      onSave();
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await deleteEducation(token, id);
      onSave();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading text-white">Education</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded border border-[#12d640] text-[#12d640] hover:bg-[#12d640]/10 font-mono text-sm"
          data-testid="add-education-btn"
        >
          <Plus size={16} /> Add Education
        </button>
      </div>

      {editingId && (
        <div className="glass-card p-4 space-y-3">
          <input
            placeholder="Institution"
            value={form.institution}
            onChange={(e) => setForm({...form, institution: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
            data-testid="edu-institution-input"
          />
          <input
            placeholder="Degree"
            value={form.degree}
            onChange={(e) => setForm({...form, degree: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
            data-testid="edu-degree-input"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Period (e.g., Jan 2022 - Dec 2023)"
              value={form.period}
              onChange={(e) => setForm({...form, period: e.target.value})}
              className="bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
              data-testid="edu-period-input"
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({...form, location: e.target.value})}
              className="bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
              data-testid="edu-location-input"
            />
          </div>
          <input
            placeholder="Courses (comma separated)"
            value={form.courses}
            onChange={(e) => setForm({...form, courses: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
            data-testid="edu-courses-input"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded text-black text-sm"
              style={{ background: 'linear-gradient(135deg, #12d640 0%, #00d4ff 100%)' }}
              data-testid="save-education-btn"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-4 py-2 rounded border border-[#333] text-[#aaa] text-sm hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex justify-between items-start">
            <div>
              <h3 className="text-white font-medium">{item.institution}</h3>
              <p className="text-[#aaa] text-sm">{item.degree}</p>
              <p className="text-[#666] text-xs">{item.period} • {item.location}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-[#aaa] hover:text-[#12d640]"
                data-testid={`edit-edu-${item.id}`}
              >
                <Save size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-[#aaa] hover:text-red-500"
                data-testid={`delete-edu-${item.id}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Experience Editor
function ExperienceEditor({ data, token, onSave }) {
  const [items, setItems] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    company: '', title: '', period: '', location: '', description: ''
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingId('new');
    setForm({ company: '', title: '', period: '', location: '', description: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      company: item.company,
      title: item.title,
      period: item.period,
      location: item.location,
      description: item.description
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        id: editingId === 'new' ? undefined : editingId
      };
      await saveExperience(token, payload);
      setEditingId(null);
      onSave();
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await deleteExperience(token, id);
      onSave();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading text-white">Experience</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded border border-[#12d640] text-[#12d640] hover:bg-[#12d640]/10 font-mono text-sm"
          data-testid="add-experience-btn"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {editingId && (
        <div className="glass-card p-4 space-y-3">
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({...form, company: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
            data-testid="exp-company-input"
          />
          <input
            placeholder="Job Title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
            data-testid="exp-title-input"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Period"
              value={form.period}
              onChange={(e) => setForm({...form, period: e.target.value})}
              className="bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
              data-testid="exp-period-input"
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({...form, location: e.target.value})}
              className="bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
              data-testid="exp-location-input"
            />
          </div>
          <textarea
            placeholder="Description (one bullet point per line)"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full h-32 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white resize-none"
            data-testid="exp-description-input"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded text-black text-sm"
              style={{ background: 'linear-gradient(135deg, #12d640 0%, #00d4ff 100%)' }}
              data-testid="save-experience-btn"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-4 py-2 rounded border border-[#333] text-[#aaa] text-sm hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex justify-between items-start">
            <div>
              <h3 className="text-white font-medium">{item.company}</h3>
              <p className="text-[#aaa] text-sm">{item.title}</p>
              <p className="text-[#666] text-xs">{item.period} • {item.location}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-[#aaa] hover:text-[#12d640]"
              >
                <Save size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-[#aaa] hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Projects Editor
function ProjectsEditor({ data, token, onSave }) {
  const [items, setItems] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', link: '', tags: ''
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingId('new');
    setForm({ title: '', description: '', link: '', tags: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      link: item.link,
      tags: item.tags || ''
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        id: editingId === 'new' ? undefined : editingId
      };
      await saveProject(token, payload);
      setEditingId(null);
      onSave();
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(token, id);
      onSave();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading text-white">Projects</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded border border-[#12d640] text-[#12d640] hover:bg-[#12d640]/10 font-mono text-sm"
          data-testid="add-project-btn"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {editingId && (
        <div className="glass-card p-4 space-y-3">
          <input
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
            data-testid="proj-title-input"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full h-24 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white resize-none"
            data-testid="proj-description-input"
          />
          <input
            placeholder="Link URL"
            value={form.link}
            onChange={(e) => setForm({...form, link: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
            data-testid="proj-link-input"
          />
          <input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({...form, tags: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
            data-testid="proj-tags-input"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded text-black text-sm"
              style={{ background: 'linear-gradient(135deg, #12d640 0%, #00d4ff 100%)' }}
              data-testid="save-project-btn"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-4 py-2 rounded border border-[#333] text-[#aaa] text-sm hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex justify-between items-start">
            <div>
              <h3 className="text-white font-medium">{item.title}</h3>
              <p className="text-[#aaa] text-sm line-clamp-2">{item.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-[#aaa] hover:text-[#12d640]"
              >
                <Save size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-[#aaa] hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skills Editor
function SkillsEditor({ data, token, onSave }) {
  const [items, setItems] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ category: '', skills: '' });
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingId('new');
    setForm({ category: '', skills: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      category: item.category,
      skills: item.skills
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        id: editingId === 'new' ? undefined : editingId
      };
      await saveSkill(token, payload);
      setEditingId(null);
      onSave();
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill category?')) return;
    try {
      await deleteSkill(token, id);
      onSave();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading text-white">Skills</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded border border-[#12d640] text-[#12d640] hover:bg-[#12d640]/10 font-mono text-sm"
          data-testid="add-skill-btn"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {editingId && (
        <div className="glass-card p-4 space-y-3">
          <input
            placeholder="Category (e.g., Languages, Design & Simulation)"
            value={form.category}
            onChange={(e) => setForm({...form, category: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white"
            data-testid="skill-category-input"
          />
          <textarea
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={(e) => setForm({...form, skills: e.target.value})}
            className="w-full h-24 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white resize-none"
            data-testid="skill-list-input"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded text-black text-sm"
              style={{ background: 'linear-gradient(135deg, #12d640 0%, #00d4ff 100%)' }}
              data-testid="save-skill-btn"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-4 py-2 rounded border border-[#333] text-[#aaa] text-sm hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">{item.category}</h3>
              <div className="flex flex-wrap gap-1">
                {item.skills?.split(',').map((skill, i) => (
                  <span key={i} className="skill-pill text-xs">{skill.trim()}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-[#aaa] hover:text-[#12d640]"
              >
                <Save size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-[#aaa] hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Admin Panel Component
export default function AdminPanel() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      verifyAdmin(savedToken)
        .then((result) => {
          if (result.valid) {
            setToken(savedToken);
          } else {
            localStorage.removeItem('adminToken');
          }
        })
        .catch(() => {
          localStorage.removeItem('adminToken');
        });
    }
  }, []);

  // Load content when authenticated
  useEffect(() => {
    if (token) {
      loadContent();
    }
  }, [token]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await getAllContent();
      setContent(data);
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    navigate('/');
  };

  if (!token) {
    return <LoginForm onLogin={setToken} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#12d640]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="font-heading text-2xl font-semibold gradient-text">SK</a>
            <span className="text-[#666]">/</span>
            <span className="font-mono text-sm text-white">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded border border-red-500/50 text-red-400 hover:bg-red-500/10 font-mono text-sm"
            data-testid="logout-btn"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={User} label="About" />
          <TabButton active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={GraduationCap} label="Education" />
          <TabButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={Briefcase} label="Experience" />
          <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={FolderOpen} label="Projects" />
          <TabButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={Wrench} label="Skills" />
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#12d640]" size={40} />
          </div>
        ) : (
          <div>
            {activeTab === 'about' && (
              <AboutEditor data={content?.about} token={token} onSave={loadContent} />
            )}
            {activeTab === 'education' && (
              <EducationEditor data={content?.education} token={token} onSave={loadContent} />
            )}
            {activeTab === 'experience' && (
              <ExperienceEditor data={content?.experience} token={token} onSave={loadContent} />
            )}
            {activeTab === 'projects' && (
              <ProjectsEditor data={content?.projects} token={token} onSave={loadContent} />
            )}
            {activeTab === 'skills' && (
              <SkillsEditor data={content?.skills} token={token} onSave={loadContent} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
