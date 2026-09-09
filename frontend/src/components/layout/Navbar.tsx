import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LanguageSelector from '../ui/LanguageSelector';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { currentUser, isAdmin, logout, firebaseConfigured } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/about', label: t('nav.about') },
    { to: '/schemes', label: t('nav.schemes') },
    { to: '/ai-talk', label: t('nav.aitalk') },
    { to: '/calculator', label: t('nav.calculator') },
    { to: '/partners', label: t('nav.partners') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-150 ${
      isActive ? 'bg-[#F5F5F3] text-[#171717]' : 'text-[#6B7280] hover:text-[#171717] hover:bg-[#F5F5F3]'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive ? 'bg-[#F5F5F3] text-[#171717]' : 'text-[#6B7280] hover:text-[#171717] hover:bg-[#F5F5F3]'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E8E6]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#171717] rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <span className="font-semibold text-[15px] text-[#171717] tracking-[-0.01em]">CreditGPS</span>
            </Link>
          </div>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>{link.label}</NavLink>
            ))}
            <div className="ml-3 pl-3 border-l border-[#E8E8E6] flex items-center gap-2">
              <LanguageSelector />
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) =>
                  `px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-150 ${isActive ? 'bg-[#171717] text-white' : 'text-[#6B7280] hover:text-[#171717] hover:bg-[#F5F5F3]'}`
                }>Admin</NavLink>
              )}
              {firebaseConfigured && currentUser ? (
                <button onClick={handleLogout} className="px-3 py-1.5 text-[13px] font-medium text-[#6B7280] hover:text-[#171717] hover:bg-[#F5F5F3] rounded-md transition-colors flex items-center gap-1">
                  <LogOut className="w-3.5 h-3.5" /> {t('nav.logout')}
                </button>
              ) : firebaseConfigured ? (
                <NavLink to="/login" className={linkClass}>{t('nav.login')}</NavLink>
              ) : null}
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center lg:hidden gap-3">
            <LanguageSelector />
            <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 text-[#6B7280] hover:text-[#171717] transition-colors">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
            className="lg:hidden border-t border-[#E8E8E6] bg-white overflow-hidden">
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className={mobileLinkClass}>{link.label}</NavLink>
              ))}
              {isAdmin && (
                <NavLink to="/admin" onClick={() => setIsOpen(false)} className={mobileLinkClass}>Admin</NavLink>
              )}
              {firebaseConfigured && currentUser ? (
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-[#6B7280] hover:text-[#171717] hover:bg-[#F5F5F3]">
                  {t('nav.logout')}
                </button>
              ) : firebaseConfigured ? (
                <NavLink to="/login" onClick={() => setIsOpen(false)} className={mobileLinkClass}>{t('nav.login')}</NavLink>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
