
import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    // Reload as a fallback if everything is frozen
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-[#000000] flex flex-col items-center justify-center z-[100] animate-in fade-in duration-500">
      <div className="w-20 h-20 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white font-black text-3xl animate-bounce shadow-[0_0_50px_rgba(88,101,242,0.4)] mb-8">
        CD
      </div>
      <div className="flex flex-col items-center gap-2 max-w-xs w-full px-6">
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#5865F2] animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <span className="text-[10px] font-black tracking-[0.3em] text-[#5865F2] uppercase mt-4 text-center">
          Establishing Cloud Infrastructure
        </span>
        
        {showSkip && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-2 rounded-full border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all animate-pulse"
          >
            Refresh if stuck
          </button>
        )}
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
