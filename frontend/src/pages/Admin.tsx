import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { adminService } from '../services/adminService';
import { UserProfile, ContactRequest, AIConversation } from '../services/firestoreService';
import { Users, MessageSquare, Mail, BarChart3 } from 'lucide-react';

type Tab = 'overview' | 'users' | 'contacts' | 'ai';

export default function Admin() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('overview');
  const [overview, setOverview] = useState({ totalUsers: 0, totalContacts: 0, totalAIConversations: 0 });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ov, u, c, ai] = await Promise.all([
        adminService.getOverview(),
        adminService.getUsers(),
        adminService.getContactRequests(),
        adminService.getAIConversations(),
      ]);
      setOverview(ov);
      setUsers(u);
      setContacts(c);
      setConversations(ai);
    } catch (e: any) {
      setError(e.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleContactStatus = async (id: string, status: string) => {
    try {
      await adminService.updateContactStatus(id, status);
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: status as any } : c)));
    } catch { /* ignore */ }
  };

  const formatDate = (ts: any) => {
    if (!ts) return '-';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString();
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: t('admin.overview'), icon: BarChart3 },
    { key: 'users', label: t('admin.users'), icon: Users },
    { key: 'contacts', label: t('admin.contacts'), icon: Mail },
    { key: 'ai', label: t('admin.aiUsage'), icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#171717]">{t('admin.title')}</h1>
        <p className="text-sm text-[#6B7280] mt-1">{t('admin.subtitle')}</p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>}

      <div className="flex gap-1 mb-6 border-b border-[#E8E8E6]">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${tab === key ? 'border-[#171717] text-[#171717]' : 'border-transparent text-[#6B7280] hover:text-[#171717]'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E8E8E6] rounded-lg p-5">
            <p className="text-sm text-[#6B7280]">{t('admin.totalUsers')}</p>
            <p className="text-3xl font-semibold text-[#171717] mt-1">{overview.totalUsers}</p>
          </div>
          <div className="bg-white border border-[#E8E8E6] rounded-lg p-5">
            <p className="text-sm text-[#6B7280]">{t('admin.totalContacts')}</p>
            <p className="text-3xl font-semibold text-[#171717] mt-1">{overview.totalContacts}</p>
          </div>
          <div className="bg-white border border-[#E8E8E6] rounded-lg p-5">
            <p className="text-sm text-[#6B7280]">{t('admin.totalAIChats')}</p>
            <p className="text-3xl font-semibold text-[#171717] mt-1">{overview.totalAIConversations}</p>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white border border-[#E8E8E6] rounded-lg overflow-hidden">
          {users.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#6B7280]">{t('admin.noUsers')}</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-[#F5F5F3] text-[#6B7280]">
                <th className="text-left p-3 font-medium">{t('admin.userName')}</th>
                <th className="text-left p-3 font-medium">{t('admin.userEmail')}</th>
                <th className="text-left p-3 font-medium">{t('admin.userRole')}</th>
                <th className="text-left p-3 font-medium">{t('admin.userDate')}</th>
              </tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid} className="border-t border-[#E8E8E6]">
                    <td className="p-3 font-medium text-[#171717]">{u.name || '-'}</td>
                    <td className="p-3 text-[#6B7280]">{u.email}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-[#171717] text-white' : 'bg-[#F5F5F3] text-[#6B7280]'}`}>{u.role}</span></td>
                    <td className="p-3 text-[#6B7280]">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'contacts' && (
        <div className="bg-white border border-[#E8E8E6] rounded-lg overflow-hidden">
          {contacts.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#6B7280]">{t('admin.noContacts')}</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-[#F5F5F3] text-[#6B7280]">
                <th className="text-left p-3 font-medium">{t('admin.userName')}</th>
                <th className="text-left p-3 font-medium">{t('admin.userEmail')}</th>
                <th className="text-left p-3 font-medium">{t('admin.contactSubject')}</th>
                <th className="text-left p-3 font-medium">{t('admin.contactStatus')}</th>
                <th className="text-left p-3 font-medium">{t('admin.contactDate')}</th>
                <th className="text-left p-3 font-medium"></th>
              </tr></thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-t border-[#E8E8E6]">
                    <td className="p-3 font-medium text-[#171717]">{c.name}</td>
                    <td className="p-3 text-[#6B7280]">{c.email}</td>
                    <td className="p-3 text-[#6B7280]">{c.subject}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${c.status === 'new' ? 'bg-yellow-100 text-yellow-800' : c.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{c.status}</span></td>
                    <td className="p-3 text-[#6B7280]">{formatDate(c.createdAt)}</td>
                    <td className="p-3 space-x-2">
                      {c.status === 'new' && <button onClick={() => handleContactStatus(c.id!, 'read')} className="text-xs text-[#0D6E4F] hover:underline">{t('admin.markRead')}</button>}
                      {c.status !== 'resolved' && <button onClick={() => handleContactStatus(c.id!, 'resolved')} className="text-xs text-[#0D6E4F] hover:underline">{t('admin.markResolved')}</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'ai' && (
        <div className="bg-white border border-[#E8E8E6] rounded-lg">
          {conversations.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#6B7280]">{t('admin.noConversations')}</p>
          ) : (
            <div className="divide-y divide-[#E8E8E6]">
              {conversations.slice(0, 20).map((conv) => (
                <div key={conv.id} className="p-4">
                  <div className="flex justify-between text-xs text-[#6B7280] mb-2">
                    <span>User: {conv.userId}</span>
                    <span>{formatDate(conv.createdAt)}</span>
                  </div>
                  <p className="text-sm text-[#171717]">{conv.messages?.length || 0} messages</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
