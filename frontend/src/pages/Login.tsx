import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const { login, googleSignIn, firebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError(t('auth.allFieldsRequired')); return; }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError(t('auth.invalidCredentials'));
      } else if (code === 'auth/too-many-requests') {
        setError(t('auth.tooManyAttempts'));
      } else {
        setError(err.message || t('auth.loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await googleSignIn();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseConfigured) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <LogIn className="w-10 h-10 text-[#6B7280] mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-[#171717] mb-2">{t('auth.loginTitle')}</h1>
        <p className="text-sm text-[#6B7280]">{t('auth.firebaseNotConfigured')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <div className="w-10 h-10 bg-[#171717] rounded-lg mx-auto mb-4 flex items-center justify-center">
          <LogIn className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-[#171717]">{t('auth.loginTitle')}</h1>
        <p className="text-sm text-[#6B7280] mt-1">{t('auth.loginSubtitle')}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#171717] mb-1">{t('auth.email')}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.emailPlaceholder')}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#171717]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#171717] mb-1">{t('auth.password')}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.passwordPlaceholder')}
              className="w-full pl-10 pr-10 py-2.5 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#171717]" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#171717]">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-[#0D6E4F] hover:underline">{t('auth.forgotPassword')}</Link>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-[#171717] text-white rounded-md text-sm font-medium hover:bg-[#2D2D2D] disabled:opacity-50 transition-colors">
          {loading ? t('common.loading') : t('auth.loginButton')}
        </button>
      </form>

      <div className="mt-4">
        <button onClick={handleGoogle} disabled={loading}
          className="w-full py-2.5 bg-white border border-[#E8E8E6] text-[#171717] rounded-md text-sm font-medium hover:bg-[#F5F5F3] disabled:opacity-50 transition-colors">
          {t('auth.googleSignIn')}
        </button>
      </div>

      <p className="text-sm text-center text-[#6B7280] mt-6">
        {t('auth.noAccount')} <Link to="/signup" className="text-[#0D6E4F] font-medium hover:underline">{t('auth.signupLink')}</Link>
      </p>
    </div>
  );
}
