
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
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl glow">
            CD
          </div>
          <span className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            CORE DEVS
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => onNavigate('home')}
          className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentView === 'home' ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}`}
        >
          Home
        </button>
        <button 
          onClick={() => onNavigate('resources')}
          className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentView === 'resources' ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}`}
        >
          Vault
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-400 transition-all active:scale-90"
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
          className={`p-3 rounded-full border transition-all ${currentView === 'admin' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'} ${!isAdmin ? 'opacity-50' : ''}`}
          title={isAdmin ? "Admin Hub" : "Admin Login"}
        >
          {isAdmin ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
