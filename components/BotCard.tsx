
import React, { useState } from 'react';
import { BotInfo, ThemeType } from '../types';

interface BotCardProps {
  bot: BotInfo;
  theme?: ThemeType;
  onViewDetails: (bot: BotInfo) => void;
}

const BotCard: React.FC<BotCardProps> = ({ bot, theme = 'dark', onViewDetails }) => {
  const [imgSrc, setImgSrc] = useState(bot.imageUrl);

  const handleError = () => {
    if (imgSrc !== `https://ui-avatars.com/api/?name=${bot.name}&background=5865f2&color=fff&size=512&bold=true`) {
      setImgSrc(`https://ui-avatars.com/api/?name=${bot.name}&background=5865f2&color=fff&size=512&bold=true`);
    }
  };

  return (
    <div 
      className={`reveal group relative overflow-hidden rounded-[3.5rem] p-10 md:p-16 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] touch-manipulation
        ${theme === 'black' ? 'bg-[#080808] border border-white/10' : theme !== 'light' ? 'bg-[#161a23] border border-white/5 shadow-2xl' : 'bg-white border border-slate-200 shadow-md'}
        hover:-translate-y-5 hover:border-[var(--brand-color)]/50 hover:shadow-[0_60px_120px_var(--brand-glow)] active:scale-[0.98] active:shadow-[0_20px_40px_var(--brand-glow)]`}
      onClick={() => onViewDetails(bot)}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700 bg-gradient-to-br from-[var(--brand-color)] via-transparent to-transparent"></div>
      
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.15] transition-all duration-700 select-none group-hover:rotate-[15deg] group-hover:scale-[1.5]">
        <span className="text-[18rem] font-black leading-none pointer-events-none" style={{ color: bot.color }}>{bot.name.charAt(0)}</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-center gap-14 relative z-10">
        <div className="relative transition-all duration-700 group-hover:scale-105 group-hover:rotate-[-1deg]">
          <div className={`w-44 h-44 md:w-64 md:h-64 rounded-[3rem] overflow-hidden ring-8 transition-all duration-700 shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${theme === 'black' ? 'ring-white/5 bg-black' : theme !== 'light' ? 'ring-white/5 group-hover:ring-[var(--brand-color)]/30 bg-slate-900' : 'ring-slate-100 group-hover:ring-[var(--brand-color)]/10 bg-slate-50'}`}>
            <img 
              src={imgSrc} 
              alt={bot.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              onError={handleError}
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 border-[8px] border-current rounded-full flex items-center justify-center shadow-2xl" style={{ borderColor: theme === 'black' ? '#080808' : theme !== 'light' ? '#161a23' : '#fff' }}>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_15px_white]"></div>
          </div>
        </div>
        
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8 justify-center lg:justify-start">
            <h3 className={`text-6xl md:text-7xl font-black group-hover:text-[var(--brand-color)] transition-all tracking-tighter duration-300 ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>
              {bot.name}
            </h3>
            <span className={`px-6 py-2 rounded-2xl border text-[10px] font-black tracking-[0.4em] uppercase inline-block group-hover:bg-[var(--brand-color)] group-hover:text-white group-hover:border-[var(--brand-color)] transition-all duration-500 ${theme === 'black' ? 'bg-white/10 border-white/20 text-slate-300' : theme !== 'light' ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              {bot.tagline}
            </span>
          </div>
          
          <p className={`text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0 font-medium transition-all duration-500 ${theme === 'black' ? 'text-slate-400 group-hover:text-slate-200' : theme !== 'light' ? 'text-slate-400 group-hover:text-white' : 'text-slate-600'}`}>
            {bot.description}
          </p>
          
          <div className="grid grid-cols-2 gap-12 mb-12 max-w-md mx-auto lg:mx-0">
            <div className="group/stat">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 group-hover/stat:text-[var(--brand-color)] transition-colors">Server Clusters</p>
              <p className={`text-3xl font-black transition-all ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{bot.stats.servers}</p>
            </div>
            <div className="group/stat">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 group-hover/stat:text-[var(--brand-color)] transition-colors">Endpoint Nodes</p>
              <p className={`text-3xl font-black transition-all ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{bot.stats.users}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5">
             <button 
               className={`px-12 py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all bg-[var(--brand-color)] hover:bg-white hover:text-black active:scale-95 shadow-[0_25px_50px_var(--brand-glow)] flex items-center justify-center gap-4 ${theme === 'black' ? 'text-black' : 'text-white'}`}
               onClick={(e) => {
                 e.stopPropagation();
                 onViewDetails(bot);
               }}
             >
               Interface Details
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotCard;
