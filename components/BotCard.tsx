
import React from 'react';
import { BotInfo } from '../types';

interface BotCardProps {
  bot: BotInfo;
  onViewDetails: (bot: BotInfo) => void;
}

const BotCard: React.FC<BotCardProps> = ({ bot, onViewDetails }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-3xl glass p-8 card-highlight cursor-pointer"
      onClick={() => onViewDetails(bot)}
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-25 transition-all duration-500">
        <span className="text-8xl font-black select-none" style={{ color: bot.color }}>{bot.name.charAt(0)}</span>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10 text-center md:text-left">
        <div className="relative">
          <img 
            src={bot.imageUrl} 
            alt={bot.name} 
            className="w-32 h-32 rounded-3xl object-cover ring-4 ring-white/10 group-hover:ring-indigo-500/50 transition-all duration-500 shadow-2xl" 
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-[#1e293b] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase group-hover:border-indigo-500/30 transition-colors">
            {bot.tagline}
          </div>
          <h3 className="text-4xl font-black text-white mb-2 group-hover:text-indigo-400 transition-colors">{bot.name}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
            {bot.description}
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
            <div className="text-xs font-bold text-slate-300">
              <span style={{ color: bot.color }} className="text-lg">{bot.stats.servers}</span> SERVERS
            </div>
            <div className="text-xs font-bold text-slate-300">
              <span style={{ color: bot.color }} className="text-lg">{bot.stats.users}</span> USERS
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             <button 
               className="px-8 py-3 rounded-2xl font-black text-sm transition-all bg-white text-black hover:bg-indigo-500 hover:text-white active:scale-95 shadow-lg"
               onClick={(e) => {
                 e.stopPropagation();
                 onViewDetails(bot);
               }}
             >
               OPEN INTERFACE
             </button>
             <a 
               href={bot.inviteUrl}
               onClick={(e) => e.stopPropagation()}
               className="px-8 py-3 rounded-2xl font-black text-sm transition-all border border-white/10 hover:bg-white/5 text-center text-slate-300 hover:text-white"
             >
               INVITE BOT
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotCard;
