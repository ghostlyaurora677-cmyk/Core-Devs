
import React, { useState } from 'react';

interface NavbarProps {
  onNavigate: (view: any) => void;
  currentView: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, theme, toggleTheme, isAdmin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] h-20 glass flex items-center justify-between px-6 md:px-12 border-b border-white/5">
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(88,101,242,0.4)] group-hover:scale-110 transition-all duration-300">
              CD
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                CORE DEVS
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-bold text-slate-500 tracking-[0.2em] uppercase">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Navigation - Visible from MD up */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={link.action}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group h-full py-4 ${link.active ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-500 transition-all duration-300 ${link.active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-indigo-400 transition-all active:scale-90"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Auth Button */}
          <button 
            onClick={() => onNavigate('admin')}
            className={`px-4 py-2.5 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95 ${currentView === 'admin' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
          >
            {isAdmin ? 'ADMIN' : 'AUTH'}
          </button>

          {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/95 backdrop-blur-xl md:hidden pt-24 px-6 animate-in slide-in-from-top-10 duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <button 
                key={link.label}
                onClick={link.action}
                className="text-left py-6 border-b border-white/5 text-2xl font-black uppercase tracking-widest text-slate-400 hover:text-white active:text-indigo-500 transition-colors"
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
