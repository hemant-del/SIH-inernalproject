import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { resetPassword, firebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError(t('auth.emailRequired')); return; }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t('auth.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseConfigured) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <KeyRound className="w-10 h-10 text-[#6B7280] mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-[#171717] mb-2">{t('auth.resetTitle')}</h1>
        <p className="text-sm text-[#6B7280]">{t('auth.firebaseNotConfigured')}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#0D6E4F] mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-[#171717] mb-2">{t('auth.resetSent')}</h1>
        <p className="text-sm text-[#6B7280] mb-6">{t('auth.resetSentDesc')}</p>
        <Link to="/login" className="text-sm text-[#0D6E4F] font-medium hover:underline">{t('auth.backToLogin')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <div className="w-10 h-10 bg-[#171717] rounded-lg mx-auto mb-4 flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-[#171717]">{t('auth.resetTitle')}</h1>
        <p className="text-sm text-[#6B7280] mt-1">{t('auth.resetSubtitle')}</p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#171717] mb-1">{t('auth.email')}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.emailPlaceholder')}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#171717]" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-[#171717] text-white rounded-md text-sm font-medium hover:bg-[#2D2D2D] disabled:opacity-50 transition-colors">
          {loading ? t('common.loading') : t('auth.resetButton')}
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        <Link to="/login" className="text-[#6B7280] hover:text-[#171717] inline-flex items-center"><ArrowLeft className="w-3 h-3 mr-1" /> {t('auth.backToLogin')}</Link>
      </p>
    </div>
  );
}
