
import React from 'react';
import { BotInfo } from '../types';

interface BotCardProps {
  bot: BotInfo;
  onViewDetails: (bot: BotInfo) => void;
}

const BotCard: React.FC<BotCardProps> = ({ bot, onViewDetails }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-[2.5rem] glass p-10 card-highlight cursor-pointer border-white/5 hover:border-indigo-500/30 transition-all duration-500"
      onClick={() => onViewDetails(bot)}
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 select-none">
        <span className="text-[12rem] font-black leading-none" style={{ color: bot.color }}>{bot.name.charAt(0)}</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 relative z-10">
        <div className="relative">
          <img 
            src={bot.imageUrl} 
            alt={bot.name} 
            className="w-40 h-40 rounded-[2.5rem] object-cover ring-8 ring-white/5 group-hover:ring-indigo-500/20 transition-all duration-700 shadow-2xl scale-100 group-hover:scale-105" 
          />
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 border-[6px] border-[#121212] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4 justify-center lg:justify-start">
            <h3 className="text-5xl font-black text-white group-hover:text-[#5865F2] transition-colors tracking-tighter">
              {bot.name}
            </h3>
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 tracking-widest uppercase inline-block">
              {bot.tagline}
            </span>
          </div>
          
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 font-medium">
            {bot.description}
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10 max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Scale</p>
              <p className="text-xl font-black text-white">{bot.stats.servers} Guilds</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Impact</p>
              <p className="text-xl font-black text-white">{bot.stats.users} Users</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
             <button 
               className="px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-white text-black hover:bg-[#5865F2] hover:text-white active:scale-95 shadow-xl"
               onClick={(e) => {
                 e.stopPropagation();
                 onViewDetails(bot);
               }}
             >
               Explore Modules
             </button>
             <a 
               href={bot.inviteUrl}
               onClick={(e) => e.stopPropagation()}
               target="_blank"
               rel="noopener noreferrer"
               className="px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 hover:bg-white/5 text-center text-slate-300 hover:text-white"
             >
               Invite Link
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotCard;
