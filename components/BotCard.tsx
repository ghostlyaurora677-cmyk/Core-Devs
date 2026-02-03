
import React, { useState } from 'react';
import { BotInfo, ThemeType } from '../types';

interface BotCardProps {
  bot: BotInfo;
  theme?: ThemeType;
  onViewDetails: (bot: BotInfo) => void;
}

const BotCard: React.FC<BotCardProps> = ({ bot, theme = 'dark', onViewDetails }) => {
  const [imgSrc, setImgSrc] = useState(bot.imageUrl);

  return (
    <div 
      className={`reveal group relative overflow-hidden rounded-[4rem] p-12 md:p-20 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${theme === 'black' ? 'bg-[#080808] border border-white/10' : theme !== 'light' ? 'bg-[#161a23] border border-white/5 shadow-2xl' : 'bg-white border border-slate-200 shadow-md'}
        hover:-translate-y-4 hover:border-[var(--brand-color)]/40 hover:shadow-[0_0_100px_var(--brand-glow)]`}
      onClick={() => onViewDetails(bot)}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.1] transition-opacity duration-700 bg-gradient-to-br from-[var(--brand-color)] via-transparent to-transparent"></div>
      
      <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="relative group-hover:scale-105 transition-all duration-1000">
          <div className={`w-52 h-52 md:w-80 md:h-80 rounded-[3.5rem] overflow-hidden ring-8 transition-all duration-700 shadow-2xl group-hover:ring-[var(--brand-color)]/60 ${theme !== 'light' ? 'ring-white/5 bg-slate-900' : 'ring-slate-100 bg-slate-50'}`}>
            <img 
              src={imgSrc} 
              alt={bot.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${bot.name}&background=5865f2&color=fff&size=512&bold=true`)}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-emerald-500 border-[10px] border-[#161a23] rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8 justify-center lg:justify-start">
            <h3 className={`text-7xl font-black group-hover:text-[var(--brand-color)] transition-all tracking-tighter duration-300 ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>
              {bot.name}
            </h3>
            <span className={`px-6 py-2 rounded-2xl border text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 ${theme !== 'light' ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              {bot.tagline}
            </span>
          </div>
          
          <p className={`text-xl leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0 font-medium ${theme !== 'light' ? 'text-slate-400' : 'text-slate-600'}`}>
            {bot.description}
          </p>
          
          <div className="grid grid-cols-2 gap-12 mb-12 max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Live Clusters</p>
              <p className={`text-4xl font-black ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{bot.stats.servers}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Unique Commands</p>
              <p className={`text-4xl font-black ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{bot.stats.commands}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
             <button 
               className="px-14 py-7 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-[var(--brand-color)] hover:scale-105 active:scale-95 text-white flex items-center justify-center gap-4 shadow-xl"
               onClick={(e) => { e.stopPropagation(); onViewDetails(bot); }}
             >
               View Specs
             </button>
             <a 
               href={bot.inviteUrl}
               target="_blank"
               onClick={(e) => e.stopPropagation()}
               className={`px-14 py-7 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-4 ${theme !== 'light' ? 'border-white/10 text-white hover:bg-white hover:text-black' : 'border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white'}`}
             >
               Add to Server
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotCard;
