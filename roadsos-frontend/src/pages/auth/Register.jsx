import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AlertTriangle, ArrowRight, Languages, Lock, Mail, Phone, Plus, User, Users, X } from 'lucide-react';
import AuthFrame from '../../components/shared/AuthFrame';
import { useRegisterMutation } from '../../features/auth/auth.api';
import { setCredentials } from '../../features/auth/auth.slice';
import { getErrorMessage } from '../../utils/errorHandler';

const roles = [
  { value: 'victim', label: 'Victim' },
  { value: 'responder', label: 'Responder' },
  { value: 'admin', label: 'Control room' }
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'kn', label: 'Kannada' }
];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'victim',
    languagePreference: 'en',
    emergencyContacts: [{ name: '', phone: '', relation: 'family' }]
  });
  const [error, setError] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contact = (index, field, value) => {
    const contacts = form.emergencyContacts.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item));
    setForm({ ...form, emergencyContacts: contacts });
  };

  const removeContact = (index) => {
    setForm({ ...form, emergencyContacts: form.emergencyContacts.filter((_, itemIndex) => itemIndex !== index) });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const payload = { ...form, emergencyContacts: form.emergencyContacts.filter((item) => item.name && item.phone) };
      const response = await register(payload).unwrap();
      dispatch(setCredentials(response.data));
      const role = response.data.user.role;
      navigate(role === 'admin' ? '/dashboard' : role === 'responder' ? '/responder' : '/home', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthFrame
      eyebrow="New profile"
      title="Create your RoadSoS account"
      subtitle="Choose the workspace role and save emergency contacts for SOS alerts."
      footer={<Link to="/login" className="auth-link">Already have an account?</Link>}
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="auth-label">Full name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <input
                id="name"
                aria-label="Full name"
                autoComplete="name"
                className="auth-field pl-12"
                placeholder="Your name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="auth-label">Phone</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <input
                id="phone"
                aria-label="Phone"
                autoComplete="tel"
                className="auth-field pl-12"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="auth-label">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="email"
              aria-label="Email address"
              autoComplete="email"
              className="auth-field pl-12"
              placeholder="name@roadsos.in"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="auth-label">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="password"
              aria-label="Password"
              autoComplete="new-password"
              className="auth-field pl-12"
              minLength={8}
              placeholder="Minimum 8 characters"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <span className="auth-label">Workspace role</span>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Workspace role">
            {roles.map((role) => {
              const selected = form.role === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  aria-pressed={selected}
                  className={`min-h-12 rounded-md border px-3 py-2 text-sm font-bold transition ${selected ? 'border-red-400 bg-red-500/20 text-white' : 'border-white/10 bg-slate-950/70 text-slate-300 hover:border-slate-500'}`}
                  onClick={() => setForm({ ...form, role: role.value })}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="language" className="auth-label">Language preference</label>
          <div className="relative">
            <Languages className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <select
              id="language"
              aria-label="Language preference"
              className="auth-select pl-12"
              value={form.languagePreference}
              onChange={(event) => setForm({ ...form, languagePreference: event.target.value })}
            >
              {languages.map((language) => <option key={language.value} value={language.value}>{language.label}</option>)}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-slate-950/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-200" aria-hidden="true" />
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-200">Emergency contacts</h2>
            </div>
            {form.emergencyContacts.length < 3 && (
              <button
                type="button"
                onClick={() => setForm({ ...form, emergencyContacts: [...form.emergencyContacts, { name: '', phone: '', relation: '' }] })}
                className="auth-secondary-button min-h-10 px-3 py-2"
                aria-label="Add emergency contact"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add
              </button>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {form.emergencyContacts.map((item, index) => (
              <div key={String(index)} className="grid gap-2 rounded-md border border-white/10 bg-slate-900/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Contact {index + 1}</p>
                  {form.emergencyContacts.length > 1 && (
                    <button type="button" onClick={() => removeContact(index)} className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label={`Remove contact ${index + 1}`}>
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <input aria-label={`Contact name ${index + 1}`} className="auth-field" placeholder="Name" value={item.name} onChange={(event) => contact(index, 'name', event.target.value)} />
                <input aria-label={`Contact phone ${index + 1}`} className="auth-field" placeholder="Phone" value={item.phone} onChange={(event) => contact(index, 'phone', event.target.value)} />
                <input aria-label={`Contact relation ${index + 1}`} className="auth-field" placeholder="Relation" value={item.relation} onChange={(event) => contact(index, 'relation', event.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-md border border-red-400/30 bg-red-950/50 p-3 text-sm text-red-100" role="alert">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={isLoading} className="auth-primary-button" aria-label="Create RoadSoS account">
          {isLoading ? 'Creating account' : 'Create account'}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </form>
    </AuthFrame>
  );
}
