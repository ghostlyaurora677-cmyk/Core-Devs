
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (password: string) => boolean;
  onBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 animate-in">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <div className="glass rounded-[2.5rem] p-12 border-white/5 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl mb-6 glow">
              CD
            </div>
            <h2 className="text-3xl font-black text-white">Admin Access</h2>
            <p className="text-slate-500 text-sm mt-2">Enter secret key to manage assets</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Access Key</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all text-center tracking-[0.5em]`}
                placeholder="••••••••"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-[10px] font-bold text-center uppercase tracking-wider mt-2 animate-pulse">
                  Invalid Access Key
                </p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl"
            >
              AUTHENTICATE
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
              Proprietary System of Core Devs<br />Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
