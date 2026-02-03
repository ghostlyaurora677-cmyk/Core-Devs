
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
    
    setTimeout(async () => {
      let matchedUser: User | null = null;

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
            Abort
          </button>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Secure Handshake</span>
          </div>
        </div>

        <div className={`glass rounded-[4.5rem] p-12 md:p-24 border-white/5 shadow-[0_60px_120px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-700 
          ${status === 'success' ? 'border-emerald-500/40 shadow-[0_0_100px_rgba(16,185,129,0.2)]' : ''}
          ${error ? 'shake border-red-500/30' : 'border-white/5'}`}>
          
          <div className="relative z-20">
            {status !== 'success' ? (
              <>
                <div className="flex flex-col items-center mb-16">
                  <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl mb-10 transition-all duration-700 ${status === 'verifying' ? 'bg-indigo-600 shadow-[0_0_60px_rgba(79,70,229,0.6)] scale-110 rotate-[360deg]' : 'bg-white/5 border border-white/10 group-hover:border-white/20'}`}>CD</div>
                  <h2 className="text-6xl font-black text-white tracking-tighter uppercase mb-4 text-center leading-[0.85]">STAFF<br/><span className="text-indigo-500">ACCESS</span></h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] text-center max-w-[280px] leading-relaxed">
                    Verify operator signature to access cloud infrastructure.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="space-y-5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Operator ID</label>
                    <input 
                      type="text"
                      disabled={status === 'verifying'}
                      value={emailOrId}
                      onChange={(e) => setEmailOrId(e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-7 text-white text-xl focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all font-bold tracking-tight disabled:opacity-50 ${error ? 'border-red-500/30 bg-red-500/5' : ''}`}
                      placeholder="Username"
                    />
                  </div>

                  <div className="space-y-5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Passphrase</label>
                    <input 
                      type="password"
                      disabled={status === 'verifying'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-7 text-white text-xl focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all tracking-[0.4em] font-bold disabled:opacity-50 ${error ? 'border-red-500/30 bg-red-500/5' : ''}`}
                      placeholder="••••••••"
                    />
                  </div>

                  {error && (
                    <div className="px-8 py-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] animate-in zoom-in-95">
                      {getErrorMessage()}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === 'verifying'}
                    className={`w-full py-9 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] transition-all active:scale-[0.98] shadow-2xl relative overflow-hidden group/btn flex items-center justify-center ${status === 'verifying' ? 'bg-indigo-600 text-white cursor-wait' : 'bg-white text-black hover:bg-indigo-600 hover:text-white'}`}
                  >
                    <span className="relative z-20 flex items-center gap-4">
                      {status === 'verifying' ? verifyingText : 'Confirm Identity'}
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <div className="py-20 flex flex-col items-center animate-in zoom-in-95 fade-in duration-700">
                <div className="w-40 h-40 rounded-[3.5rem] bg-emerald-500 flex items-center justify-center text-white mb-12 shadow-[0_0_80px_rgba(16,185,129,0.5)] scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase mb-6 text-center leading-none">SIGNATURE<br/><span className="text-emerald-500">VALIDATED</span></h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
