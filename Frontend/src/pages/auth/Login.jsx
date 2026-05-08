import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AlertTriangle, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import AuthFrame from '../../components/shared/AuthFrame';
import { useLoginMutation } from '../../features/auth/auth.api';
import { setCredentials } from '../../features/auth/auth.slice';
import { getErrorMessage } from '../../utils/errorHandler';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await login(form).unwrap();
      dispatch(setCredentials(response.data));
      const role = response.data.user.role;
      navigate(role === 'admin' ? '/dashboard' : role === 'responder' ? '/responder' : '/home', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthFrame
      eyebrow="Secure access"
      title="Sign in to RoadSoS"
      subtitle="Open the right workspace for victims, responders, or the control room."
      footer={(
        <div className="flex items-center justify-between gap-3">
          <Link to="/register" className="auth-link">Create account</Link>
          <Link to="/forgot-password" className="auth-link">Forgot password</Link>
        </div>
      )}
    >
      <form onSubmit={submit} className="space-y-5">
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
              autoComplete="current-password"
              className="auth-field pl-12"
              placeholder="Enter your password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-md border border-red-400/30 bg-red-950/50 p-3 text-sm text-red-100" role="alert">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={isLoading} className="auth-primary-button" aria-label="Log in to RoadSoS">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          {isLoading ? 'Signing in' : 'Login'}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </form>
    </AuthFrame>
  );
}
