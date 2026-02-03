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
  const [verifyingText, setVerifyingText] = useState('Initiating Handshake');

  useEffect(() => {
    if (status === 'verifying') {
      const phrases = [
        'Initiating Handshake',
        'Accessing Persistence Layer',
        'Decrypting Personnel Signature',
        'Validating Clearance Level',
        'Synchronizing Security Buffers'
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % phrases.length;
        setVerifyingText(phrases[i]);
      }, 450);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = emailOrId.trim();
    const cleanPw = password.trim();

    if (cleanId.length < 3) {
      setError('ID_TOO_SHORT');
      return;
    }

    if (cleanPw.length < 6) {
      setError('SECURITY_KEY_FAIL');
      return;
    }

    setStatus('verifying');
    
    // Simulate high-security processing delay
    setTimeout(async () => {
      let matchedUser: User | null = null;

      // 1. Check Master Account
      if (cleanId === MASTER_ID && cleanPw === MASTER_PW) {
        matchedUser = {
          username: 'CorDev',
          email: 'master@coredevs.gg',
          isAdmin: true,
          isMaster: true,
          provider: 'staff',
          permissions: ALL_PERMISSIONS,
          role: 'Owner'
        };
      } else {
        // 2. Fetch latest staff from Database
        const currentStaffList = await databaseService.getStaffAccounts();
        const foundStaff = currentStaffList.find(s => s.username === cleanId && s.password === cleanPw);
        
        if (foundStaff) {
          matchedUser = {
            username: foundStaff.username,
            email: `${foundStaff.username.toLowerCase()}@coredevs.gg`,
            isAdmin: true,
            provider: 'staff',
            permissions: foundStaff.permissions || ['VAULT_VIEW'],
            role: foundStaff.role || 'Staff'
          };
        }
      }

      if (matchedUser) {
        setStatus('success');
        setTimeout(() => {
          if (matchedUser) onLoginSuccess(matchedUser);
        }, 1200);
      } else {
        setError('ACCESS_DENIED_UNAUTHORIZED');
        setStatus('idle');
      }
    }, 2400);
  };

  const getErrorMessage = () => {
    switch(error) {
      case 'ID_TOO_SHORT': return 'ERR: Identifier length insufficient.';
      case 'SECURITY_KEY_FAIL': return 'ERR: Passphrase security check failed.';
      case 'ACCESS_DENIED_UNAUTHORIZED': return 'ERR: Authentication failed. Signature mismatch.';
      default: return 'ERR: System kernel error.';
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center px-6 selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Background Animated Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[200px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[200px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className={`w-full max-w-xl relative z-10 transition-all duration-1000 ${status === 'success' ? 'scale-110 opacity-0 blur-2xl' : 'animate-in fade-in slide-in-from-bottom-8'}`}>
        <div className="flex justify-between items-center mb-10 px-4">
          <button 
            onClick={onBack}
            className="group flex items-center gap-4 text-slate-500 hover:text-white transition-all uppercase text-[9px] font-black tracking-[0.4em]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:-translate-x-2 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Abort Link
          </button>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Gateway Secure</span>
          </div>
        </div>

        <div className={`glass rounded-[4.5rem] p-12 md:p-24 border-white/5 shadow-[0_60px_120px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-700 
          ${status === 'success' ? 'border-emerald-500/40 shadow-[0_0_100px_rgba(16,185,129,0.2)]' : ''}
          ${error ? 'shake border-red-500/30' : 'border-white/5'}`}>
          
          {status === 'verifying' && (
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 animate-pulse"></div>
              <div className="w-full h-2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent blur-[2px] shadow-[0_0_30px_rgba(99,102,241,0.6)] animate-[scan_1.5s_linear_infinite] absolute z-40"></div>
            </div>
          )}

          <div className="relative z-20">
            {status !== 'success' ? (
              <>
                <div className="flex flex-col items-center mb-16">
                  <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl mb-10 transition-all duration-700 ${status === 'verifying' ? 'bg-indigo-600 shadow-[0_0_60px_rgba(79,70,229,0.6)] scale-110 rotate-[360deg]' : 'bg-white/5 border border-white/10 group-hover:border-white/20'}`}>CD</div>
                  <h2 className="text-6xl font-black text-white tracking-tighter uppercase mb-4 text-center leading-[0.85]">SYSTEM<br/><span className="text-indigo-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">OVERRIDE</span></h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] text-center max-w-[280px] leading-relaxed">
                    Accessing encrypted personnel records requires signature verification.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator Identity</label>
                      {status === 'verifying' && <span className="text-indigo-400 text-[9px] font-black animate-pulse uppercase tracking-widest">Verifying...</span>}
                    </div>
                    <div className="relative group/input">
                      <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input 
                        type="text"
                        disabled={status === 'verifying'}
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        className={`w-full bg-white/5 border border-white/10 rounded-[2rem] pl-18 pr-8 py-7 text-white text-xl focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all font-bold tracking-tight disabled:opacity-50 ${error ? 'border-red-500/30 bg-red-500/5' : ''}`}
                        placeholder="Personnel ID"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Digital Signature</label>
                    <div className="relative group/input">
                      <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input 
                        type="password"
                        disabled={status === 'verifying'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-white/5 border border-white/10 rounded-[2rem] pl-18 pr-8 py-7 text-white text-xl focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all tracking-[0.4em] font-bold disabled:opacity-50 ${error ? 'border-red-500/30 bg-red-500/5' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-5 px-8 py-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden animate-in zoom-in-95">
                       <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                       <svg className="w-6 h-6 shrink-0 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="relative z-10">{getErrorMessage()}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === 'verifying'}
                    className={`w-full py-9 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] transition-all active:scale-[0.98] shadow-2xl relative overflow-hidden group/btn flex items-center justify-center ${status === 'verifying' ? 'bg-indigo-600 text-white cursor-wait' : 'bg-white text-black hover:bg-indigo-600 hover:text-white'}`}
                  >
                    <span className="relative z-20 flex items-center gap-4">
                      {status === 'verifying' ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 2v4m0 12v4M4.22 4.22l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.22 19.78l2.83-2.83m8.48-8.48l2.83-2.83" /></svg>
                          {verifyingText}
                        </>
                      ) : 'Confirm Authorization'}
                    </span>
                    {status === 'idle' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 z-10"></div>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-20 flex flex-col items-center animate-in zoom-in-95 fade-in duration-700">
                <div className="w-40 h-40 rounded-[3.5rem] bg-emerald-500 flex items-center justify-center text-white mb-12 shadow-[0_0_80px_rgba(16,185,129,0.5)] animate-[pulse_2s_infinite] scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase mb-6 text-center leading-none">SIGNATURE<br/><span className="text-emerald-500">VALIDATED</span></h2>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-[0.5em]">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Establishing Uplink
                  </div>
                  <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-[progress_1.2s_ease-out_forwards]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-20 pt-12 border-t border-white/5 text-center">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-[320px] mx-auto opacity-60">
              Protocol v4.9.2 Active. All personnel buffers are synchronized for deployment.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .pl-18 { padding-left: 4.5rem; }
      `}</style>
    </div>
  );
};

export default LoginView;