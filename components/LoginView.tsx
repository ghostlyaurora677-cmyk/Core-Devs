
import React, { useState } from 'react';
import { User } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMethod, setAuthMethod] = useState<'options' | 'email'>('options');
  const [flow, setFlow] = useState<'user' | 'staff'>('user');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Security key must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      // Simulation: email login with 'coredevs@2025' is staff
      const isStaff = flow === 'staff' && password === 'coredevs@2025';
      
      if (flow === 'staff' && !isStaff) {
        setIsSubmitting(false);
        setError('Invalid staff credentials');
        return;
      }

      const user: User = {
        username: email.split('@')[0],
        email: email,
        isAdmin: isStaff,
        provider: 'email'
      };
      
      onLoginSuccess(user);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleOAuthLogin = (provider: 'discord' | 'google') => {
    setIsSubmitting(true);
    setError(null);
    
    // Simulation of OAuth flow
    setTimeout(() => {
      const simulatedUser: User = {
        username: provider === 'discord' ? 'DiscordDev' : 'GoogleUser',
        email: `${provider}@example.com`,
        avatar: provider === 'discord' ? 'https://cdn.discordapp.com/embed/avatars/0.png' : 'https://lh3.googleusercontent.com/a/default-user',
        isAdmin: false,
        provider: provider
      };
      onLoginSuccess(simulatedUser);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#06080a] flex items-center justify-center px-6 animate-in fade-in duration-700">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={authMethod === 'email' ? () => setAuthMethod('options') : onBack}
            className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            {authMethod === 'email' ? 'All Methods' : 'Return to Hub'}
          </button>

          <button 
            onClick={() => {
              setFlow(flow === 'user' ? 'staff' : 'user');
              setAuthMethod('email');
            }}
            className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/10 text-slate-500 transition-all"
          >
            {flow === 'user' ? 'Staff Override' : 'Member Hub'}
          </button>
        </div>

        <div className="glass rounded-[3.5rem] p-10 md:p-16 border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group/card">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--brand-color)] to-transparent opacity-30"></div>
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white font-black text-3xl mb-8 shadow-[0_20px_40px_rgba(79,70,229,0.3)] group-hover/card:scale-110 transition-transform duration-500">
              CD
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
              {flow === 'staff' ? 'Staff Auth' : 'Gateway'}
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              {flow === 'staff' ? 'Authorized Infrastructure Access' : 'Authenticate to unlock the Vault'}
            </p>
          </div>

          {authMethod === 'options' && flow === 'user' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <button 
                onClick={() => handleOAuthLogin('discord')}
                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#5865F2] text-white hover:opacity-90 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Sync with Discord
              </button>

              <button 
                onClick={() => handleOAuthLogin('google')}
                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-white text-black hover:bg-slate-100 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0b0e14] px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">or</span>
                </div>
              </div>

              <button 
                onClick={() => setAuthMethod('email')}
                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-4 active:scale-95"
              >
                Use Email Access
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Terminal</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </div>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-white/5 border ${error && !validateEmail(email) ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-14 pr-6 py-5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium`}
                    placeholder="you@domain.gg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-white/5 border ${error && password.length < 6 ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-14 pr-6 py-5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all tracking-[0.3em] font-medium`}
                    placeholder="••••••••"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 justify-center text-red-400 text-[10px] font-bold uppercase tracking-wider mt-4 bg-red-500/10 py-3 rounded-xl border border-red-500/20 animate-in fade-in zoom-in-95">
                    {error}
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${
                  isSubmitting 
                  ? 'bg-slate-800 text-slate-400 cursor-wait' 
                  : 'bg-white text-black hover:bg-indigo-600 hover:text-white'
                }`}
              >
                {isSubmitting ? 'Validating...' : 'Establish Secure Connection'}
              </button>
            </form>
          )}

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
              By continuing, you agree to the Core Devs Hub<br />Protocol and Security Guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
