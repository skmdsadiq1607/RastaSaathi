import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, KeyRound, Lock, Phone } from 'lucide-react';
import AuthFrame from '../../components/shared/AuthFrame';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../../features/auth/auth.api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [forgot, { isLoading: isRequesting }] = useForgotPasswordMutation();
  const [reset, { isLoading: isResetting }] = useResetPasswordMutation();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      if (sent) {
        await reset({ phone, otp, password }).unwrap();
        setMessage('Password reset successful. You can return to login.');
        return;
      }
      await forgot({ phone }).unwrap();
      setSent(true);
      setMessage('OTP requested by SMS.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthFrame
      eyebrow="Account recovery"
      title={sent ? 'Enter your OTP' : 'Reset your password'}
      subtitle={sent ? 'Confirm the SMS code and set a new password.' : 'Use your registered mobile number to receive a reset OTP.'}
      footer={<Link to="/login" className="auth-link">Back to login</Link>}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label htmlFor="phone" className="auth-label">Registered phone</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="phone"
              aria-label="Registered phone"
              autoComplete="tel"
              className="auth-field pl-12"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>
        </div>

        {sent && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="otp" className="auth-label">SMS OTP</label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input
                  id="otp"
                  aria-label="SMS OTP"
                  autoComplete="one-time-code"
                  className="auth-field pl-12"
                  inputMode="numeric"
                  maxLength={6}
                  minLength={6}
                  placeholder="6 digits"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="new-password" className="auth-label">New password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input
                  id="new-password"
                  aria-label="New password"
                  autoComplete="new-password"
                  className="auth-field pl-12"
                  minLength={8}
                  placeholder="8+ chars"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-3 rounded-md border border-emerald-400/30 bg-emerald-950/40 p-3 text-sm text-emerald-100" role="status" aria-live="polite">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-md border border-red-400/30 bg-red-950/50 p-3 text-sm text-red-100" role="alert">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={isRequesting || isResetting} className="auth-primary-button" aria-label={sent ? 'Reset password' : 'Send OTP'}>
          {sent ? 'Reset password' : 'Send OTP'}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </form>
    </AuthFrame>
  );
}
