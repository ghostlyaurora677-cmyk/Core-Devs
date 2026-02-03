
import React, { useState } from 'react';
import { ThemeType, User } from '../types';

interface NavbarProps {
  onNavigate: (view: any) => void;
  currentView: string;
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  isAdmin: boolean;
  user: User | null;
  onLogout: () => void;
  onOpenFeedback: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, theme, setTheme, isAdmin, user, onLogout, onOpenFeedback }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home', action: () => onNavigate('home'), active: currentView === 'home' },
    { label: 'Vault', action: () => onNavigate('resources'), active: currentView === 'resources' },
    { label: 'Team', action: () => onNavigate('team'), active: currentView === 'team' },
    { label: 'Support', action: () => scrollToSection('support'), active: false },
  ];

  const themeOptions: { value: ThemeType; color: string }[] = [
    { value: 'dark', color: '#5865F2' },
    { value: 'black', color: '#000000' },
    { value: 'light', color: '#ffffff' },
    { value: 'magenta', color: '#ff00ff' },
    { value: 'lime', color: '#a3e635' },
    { value: 'red', color: '#f43f5e' },
  ];

  const getActiveThemeColor = () => themeOptions.find(o => o.value === theme)?.color || '#5865F2';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] h-20 glass flex items-center justify-between px-6 md:px-12 border-b border-white/5">
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className={`w-10 h-10 rounded-xl bg-[var(--brand-color)] flex items-center justify-center font-black text-xl shadow-[0_0_20px_var(--brand-glow)] group-hover:scale-110 transition-all duration-300 ${theme === 'black' ? 'text-black' : 'text-white'}`}>
              CD
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-black tracking-tighter ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>
                CORE DEVS
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-bold text-slate-500 tracking-[0.2em] uppercase">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={link.action}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group h-full py-4 ${link.active ? 'text-[var(--brand-color)]' : 'text-slate-400 hover:text-white'}`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[var(--brand-color)] transition-all duration-300 ${link.active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <button 
            onClick={onOpenFeedback}
            className={`hidden sm:flex w-10 h-10 rounded-xl items-center justify-center transition-all active:scale-90 border ${
              theme !== 'light' ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all active:scale-90 shadow-xl"
            >
              <div 
                className={`w-4 h-4 rounded-full ring-2 transition-all duration-500 ${theme === 'black' ? 'ring-white/40' : 'ring-black/10'}`} 
                style={{ backgroundColor: getActiveThemeColor() }}
              ></div>
            </button>
            {isThemeMenuOpen && (
              <div className="absolute top-14 right-0 glass rounded-3xl p-3 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 origin-top-right z-[100]">
                <div className="flex flex-col gap-3">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setTheme(opt.value); setIsThemeMenuOpen(false); }}
                      className={`w-8 h-8 rounded-full transition-all flex items-center justify-center border-2 ${theme === opt.value ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-white/20 hover:scale-110 hover:border-white/40'}`}
                      style={{ backgroundColor: opt.color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block mx-1"></div>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-1 pr-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-color)] overflow-hidden">
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=5865F2&color=fff`} className="w-full h-full object-cover" alt="User" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white hidden lg:block">{user.username}</span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute top-14 right-0 w-48 glass rounded-2xl p-2 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 origin-top-right">
                  <button 
                    onClick={onLogout}
                    className="w-full p-3 rounded-xl text-left text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="px-4 py-2.5 rounded-xl bg-[var(--brand-color)] font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-[var(--brand-glow)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Login / Register
            </button>
          )}

          <button 
            onClick={() => onNavigate('admin')}
            className={`px-4 py-2.5 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95 ${currentView === 'admin' ? 'bg-[var(--brand-color)] border-[var(--brand-color)] text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
          >
            {isAdmin ? 'ADMIN' : 'STAFF'}
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/95 backdrop-blur-xl md:hidden pt-24 px-6 animate-in slide-in-from-top-10 duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <button 
                key={link.label}
                onClick={link.action}
                className="text-left py-6 border-b border-white/5 text-2xl font-black uppercase tracking-widest text-slate-400 hover:text-white active:text-[var(--brand-color)] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
