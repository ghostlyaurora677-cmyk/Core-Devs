
import React from 'react';
import { SUPPORT_SERVER_URL } from '../constants';
import { ThemeType } from '../types';

interface FooterProps {
  onNavigate: (view: any) => void;
  theme?: ThemeType;
  onOpenFeedback: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, theme = 'dark', onOpenFeedback }) => {
  return (
    <footer className={`transition-colors duration-500 pt-24 pb-12 px-10 border-t relative z-10 ${theme !== 'light' ? 'bg-[var(--bg-color)] border-white/5' : 'bg-white border-slate-200 shadow-inner'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className={`w-10 h-10 rounded-xl bg-[var(--brand-color)] flex items-center justify-center font-black text-white glow ${theme === 'black' ? 'text-black' : ''}`}>CD</div>
            <span className={`text-2xl font-black tracking-tighter uppercase ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>Core Devs</span>
          </div>
          <p className={`text-sm leading-relaxed mb-8 ${theme === 'black' ? 'text-slate-400' : theme !== 'light' ? 'text-slate-500' : 'text-slate-600'}`}>
            The ultimate hub for high-performance Discord systems. Powering communities with elite logic and infrastructure.
          </p>
          <div className="flex gap-4">
            <a 
              href={SUPPORT_SERVER_URL} 
              target="_blank" 
              rel="noreferrer" 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-[var(--brand-color)] transition-all duration-500 hover:-translate-y-2 hover:scale-110 hover:rotate-3 active:scale-95 group shadow-lg ${theme !== 'light' ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-200'}`}
            >
              <svg className={`w-6 h-6 transition-colors duration-300 ${theme !== 'light' ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-white'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/yourprofile" 
              target="_blank" 
              rel="noreferrer" 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 hover:-translate-y-2 hover:scale-110 hover:-rotate-3 active:scale-95 group shadow-lg ${theme !== 'light' ? 'bg-white/5 border border-white/5 hover:bg-white' : 'bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-300'}`}
            >
              <svg className={`w-6 h-6 transition-colors duration-300 ${theme !== 'light' ? 'text-slate-400 group-hover:text-black' : 'text-slate-500 group-hover:text-black'}`} fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[var(--brand-color)] font-black text-xs uppercase tracking-[0.2em] mb-8">Service</h4>
          <ul className="space-y-4">
            <li><button onClick={() => window.open(SUPPORT_SERVER_URL)} className={`transition-colors text-sm font-medium ${theme !== 'light' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-[var(--brand-color)]'}`}>Support Server</button></li>
            <li><button onClick={onOpenFeedback} className={`transition-colors text-sm font-medium ${theme !== 'light' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-[var(--brand-color)]'}`}>Submit Feedback</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[var(--brand-color)] font-black text-xs uppercase tracking-[0.2em] mb-8">Resources</h4>
          <ul className="space-y-4">
            <li><button onClick={() => onNavigate('resources')} className={`transition-colors text-sm font-medium ${theme !== 'light' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-[var(--brand-color)]'}`}>The Vault</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[var(--brand-color)] font-black text-xs uppercase tracking-[0.2em] mb-8">Legal</h4>
          <ul className="space-y-4">
            <li><button className={`transition-colors text-sm font-medium ${theme !== 'light' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-[var(--brand-color)]'}`}>Terms of Hub</button></li>
            <li><button className={`transition-colors text-sm font-medium ${theme !== 'light' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-[var(--brand-color)]'}`}>Privacy Policy</button></li>
          </ul>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto border-t pt-12 flex flex-col md:flex-row justify-between items-center gap-6 ${theme !== 'light' ? 'border-white/5' : 'border-slate-100'}`}>
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
          Made with❤️ By Mandeep
        </p>
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
          © 2024 CORE DEVS. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
