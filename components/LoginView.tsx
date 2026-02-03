
import React, { useState, useEffect } from 'react';
import { User, StaffAccount, StaffPermission } from '../types';
import { databaseService } from '../services/databaseService';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onBack: () => void;
}

const MASTER_ID = 'CorDev';
const MASTER_PW = 'Mandeep&Aditya08';

const ALL_PERMISSIONS: StaffPermission[] = ['VAULT_VIEW', 'VAULT_EDIT', 'FEEDBACK_MANAGE'];

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBack }) => {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);

  useEffect(() => {
    databaseService.getStaffAccounts().then(setStaffList);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (emailOrId.length < 3) {
      setError('IDENTIFIER_TOO_SHORT');
      return;
    }

    if (password.length < 6) {
      setError('SECURITY_KEY_INVALID');
      return;
    }

    setStatus('verifying');
    
    setTimeout(() => {
      let matchedUser: User | null = null;

      // 1. Check Master Account
      if (emailOrId === MASTER_ID && password === MASTER_PW) {
        matchedUser = {
          username: 'CorDev',
          email: 'master@coredevs.gg',
          isAdmin: true,
          isMaster: true,
          provider: 'staff',
          permissions: ALL_PERMISSIONS
        };
      } else {
        // 2. Check Junior Staff
        const foundStaff = staffList.find(s => s.username === emailOrId && s.password === password);
        if (foundStaff) {
          matchedUser = {
            username: foundStaff.username,
            email: `${foundStaff.username.toLowerCase()}@coredevs.gg`,
            isAdmin: true,
            provider: 'staff',
            permissions: foundStaff.permissions || ['VAULT_VIEW']
          };
        }
      }

      if (matchedUser) {
        setStatus('success');
        setTimeout(() => {
          if (matchedUser) onLoginSuccess(matchedUser);
        }, 1500);
      } else {
        setError('UNAUTHORIZED_CREDENTIALS');
        setStatus('idle');
      }
    }, 2000);
  };

  const getErrorMessage = () => {
    switch(error) {
      case 'IDENTIFIER_TOO_SHORT': return 'Personnel identifier is too short.';
      case 'SECURITY_KEY_INVALID': return 'Passphrase fails security complexity requirements.';
      case 'UNAUTHORIZED_CREDENTIALS': return 'Access Denied: Invalid staff signature.';
      default: return 'Encryption error. Try again.';
    }
  };

  return (
    <div className="min-h-screen bg-[#06080a] flex items-center justify-center px-6 selection:bg-indigo-500 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[180px] rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="group flex items-center gap-4 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.3em]"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:-translate-x-1 group-hover:bg-white/10 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Terminal Exit
          </button>
        </div>

        <div className={`glass rounded-[4rem] p-12 md:p-20 border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.7)] relative overflow-hidden transition-all duration-700 ${status === 'success' ? 'border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.15)]' : ''}`}>
          
          {/* Scanner Line Animation */}
          {status === 'verifying' && (
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          )}

          <div className="relative z-10">
            {status !== 'success' ? (
              <>
                <div className="flex flex-col items-center mb-14">
                  <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-white font-black text-4xl mb-8 transition-all duration-500 ${status === 'verifying' ? 'bg-indigo-600 shadow-[0_0_50px_rgba(79,70,229,0.5)] scale-110' : 'bg-white/5 border border-white/10'}`}>CD</div>
                  <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-4 text-center leading-none">Infrastructure<br/><span className="text-indigo-500">Access</span></h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] text-center max-w-xs leading-relaxed">
                    Personnel Verification Protocol Active. Identify yourself.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex justify-between">
                      <span>Identification Identifier</span>
                      {status === 'verifying' && <span className="text-indigo-500 animate-pulse">Scanning...</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input 
                        type="text"
                        disabled={status === 'verifying'}
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl pl-16 pr-8 py-6 text-white text-lg focus:outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all font-bold tracking-tight disabled:opacity-50"
                        placeholder="Personnel ID"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Secure Passphrase</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input 
                        type="password"
                        disabled={status === 'verifying'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl pl-16 pr-8 py-6 text-white text-lg focus:outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all tracking-[0.3em] font-bold disabled:opacity-50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-black uppercase tracking-widest animate-[shake_0.5s_ease-in-out]">
                      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {getErrorMessage()}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === 'verifying'}
                    className={`w-full py-8 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] transition-all active:scale-[0.98] shadow-2xl relative overflow-hidden group/btn ${status === 'verifying' ? 'bg-indigo-600 text-white cursor-wait' : 'bg-white text-black hover:bg-indigo-600 hover:text-white'}`}
                  >
                    <span className="relative z-10">
                      {status === 'verifying' ? 'Establishing Tunnel...' : 'Identify Staff'}
                    </span>
                    {status === 'idle' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center animate-in zoom-in-95 fade-in duration-500">
                <div className="w-32 h-32 rounded-[3rem] bg-emerald-500 flex items-center justify-center text-white mb-10 shadow-[0_0_60px_rgba(16,185,129,0.4)] animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-4 text-center">Clearance Granted</h2>
                <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  Syncing Infrastructure Buffers
                </div>
              </div>
            )}
          </div>

          <div className="mt-16 pt-12 border-t border-white/5 text-center">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
              Security Override Protected. All biometric signatures are logged for system integrity.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
};

export default LoginView;
