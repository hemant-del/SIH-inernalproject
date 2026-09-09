import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';
import { contactService } from '../services/contactService';
import { Send, CheckCircle2, Mail, User, Phone, MessageSquare } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError(t('contact.allFieldsRequired'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      await contactService.submit({ ...form, userId: currentUser?.uid });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || t('contact.submitFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#0D6E4F] mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-[#171717] mb-2">{t('contact.successTitle')}</h1>
        <p className="text-sm text-[#6B7280] mb-6">{t('contact.successDesc')}</p>
        <button onClick={() => setSuccess(false)} className="px-5 py-2 bg-[#171717] text-white rounded-md text-sm font-medium hover:bg-[#2D2D2D] transition-colors">
          {t('contact.sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#171717] mb-2">{t('contact.title')}</h1>
        <p className="text-sm text-[#6B7280]">{t('contact.subtitle')}</p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#171717] mb-1">{t('contact.name')} *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder={t('contact.namePlaceholder')}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#171717]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#171717] mb-1">{t('contact.email')} *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={t('contact.emailPlaceholder')}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#171717]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#171717] mb-1">{t('contact.phone')}</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder={t('contact.phonePlaceholder')}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#171717]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#171717] mb-1">{t('contact.subject')} *</label>
          <select name="subject" value={form.subject} onChange={handleChange}
            className="w-full px-3 py-2.5 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#171717]">
            <option value="">{t('contact.selectSubject')}</option>
            <option value="general">{t('contact.subjectGeneral')}</option>
            <option value="scheme">{t('contact.subjectScheme')}</option>
            <option value="technical">{t('contact.subjectTechnical')}</option>
            <option value="feedback">{t('contact.subjectFeedback')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#171717] mb-1">{t('contact.message')} *</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#9CA3AF]" />
            <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder={t('contact.messagePlaceholder')}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#171717] resize-none" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-[#171717] text-white rounded-md text-sm font-medium hover:bg-[#2D2D2D] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
          {loading ? t('common.loading') : <><Send className="w-4 h-4" /> {t('contact.submitButton')}</>}
        </button>
      </form>
    </div>
  );
}
