
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] animate-in">
      <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-3xl animate-bounce shadow-[0_0_50px_rgba(79,70,229,0.4)] mb-8">
        CD
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase mt-4">
          Establishing Database Connection
        </span>
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
