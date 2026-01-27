
import React from 'react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'resources' | 'admin') => void;
  currentView: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, theme, toggleTheme, isAdmin }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 glass flex items-center justify-between px-6 md:px-12 border-b border-white/5">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(88,101,242,0.4)] group-hover:scale-110 transition-transform">
            CD
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-black tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              CORE DEVS
            </span>
            <span className="text-[8px] font-bold text-indigo-500 tracking-[0.3em] uppercase">Infrastructure</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <button 
          onClick={() => onNavigate('home')}
          className={`text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'home' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => onNavigate('resources')}
          className={`text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'resources' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          The Vault
        </button>
      </div>

      <div className="flex items-center gap-4">
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

        <button 
          onClick={() => onNavigate('admin')}
          className={`px-4 py-2.5 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'admin' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
        >
          {isAdmin ? 'ADMIN PANEL' : 'AUTH'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
