
import React, { useState } from 'react';
import { BotInfo } from '../types';

interface BotCardProps {
  bot: BotInfo;
  theme?: 'light' | 'dark';
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
      className={`reveal group relative overflow-hidden rounded-2xl p-8 md:p-12 cursor-pointer transition-all duration-500 ease-out ${theme === 'dark' ? 'glass border-white/5 hover:border-indigo-500/40' : 'bg-white border border-slate-200 hover:border-indigo-500/20 shadow-md hover:shadow-2xl'} hover:-translate-y-2`}
      onClick={() => onViewDetails(bot)}
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 select-none group-hover:rotate-6 group-hover:scale-110">
        <span className="text-[12rem] font-black leading-none" style={{ color: bot.color }}>{bot.name.charAt(0)}</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 relative z-10">
        <div className="relative group-hover:scale-105 transition-transform duration-500">
          <div className={`w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden ring-4 transition-all duration-500 shadow-2xl ${theme === 'dark' ? 'ring-white/5 group-hover:ring-indigo-500/30 bg-slate-900' : 'ring-slate-100 group-hover:ring-indigo-500/10 bg-slate-50'}`}>
            <img 
              src={imgSrc} 
              alt={bot.name} 
              className="w-full h-full object-cover" 
              onError={handleError}
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-black rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4 justify-center lg:justify-start">
            <h3 className={`text-4xl md:text-5xl font-black group-hover:text-indigo-400 transition-colors tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {bot.name}
            </h3>
            <span className={`px-3 py-1 rounded-lg border text-[8px] font-black tracking-widest uppercase inline-block ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              {bot.tagline}
            </span>
          </div>
          
          <p className={`text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 font-medium transition-opacity ${theme === 'dark' ? 'text-slate-400 opacity-80 group-hover:opacity-100' : 'text-slate-600'}`}>
            {bot.description}
          </p>
          
          <div className="grid grid-cols-2 gap-8 mb-8 max-w-xs mx-auto lg:mx-0">
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Guilds</p>
              <p className={`text-lg font-black group-hover:text-indigo-300 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{bot.stats.servers}</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Users</p>
              <p className={`text-lg font-black group-hover:text-indigo-300 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{bot.stats.users}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
             <button 
               className="px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-[#5865F2] text-white hover:bg-white hover:text-black active:scale-95 shadow-lg group/btn"
               onClick={(e) => {
                 e.stopPropagation();
                 onViewDetails(bot);
               }}
             >
               <span className="flex items-center gap-2">
                 View Info
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </span>
             </button>
             <a 
               href={bot.inviteUrl}
               onClick={(e) => e.stopPropagation()}
               target="_blank"
               rel="noopener noreferrer"
               className={`px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border text-center ${theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-slate-400 hover:text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
             >
               Add Bot
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotCard;
