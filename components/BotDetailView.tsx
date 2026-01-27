import React from 'react';
import { BotInfo } from '../types';

interface BotDetailViewProps {
  bot: BotInfo;
  onBack: () => void;
}

const BotDetailView: React.FC<BotDetailViewProps> = ({ bot, onBack }) => {
  return (
    <div className="min-h-screen bg-[#000000] animate-in text-white">
      {/* Bot Header / Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img 
          src={bot.bannerUrl} 
          className="w-full h-full object-cover opacity-20 blur-xl scale-110"
          alt="Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-10 left-10 p-4 rounded-3xl bg-white/5 hover:bg-white/10 text-white transition-all z-20 backdrop-blur-xl border border-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-10 mb-20">
          <img 
            src={bot.imageUrl} 
            alt={bot.name} 
            className="w-48 h-48 md:w-64 md:h-64 rounded-[3.5rem] border-[12px] border-[#000000] shadow-[0_0_60px_rgba(0,0,0,0.8)]" 
          />
          <div className="flex-1 pb-6 text-center md:text-left">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none">{bot.name}</h1>
            <p className="text-2xl text-indigo-400 font-bold tracking-widest uppercase">{bot.tagline}</p>
          </div>
          <div className="flex gap-4 pb-6">
             <button className="px-10 py-5 rounded-[2rem] font-black bg-indigo-600 text-white shadow-2xl hover:bg-indigo-500 hover:scale-105 transition-all">
                ADD TO DISCORD
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-32">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="glass rounded-[3rem] p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <svg className="w-32 h-32 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
               </div>
              <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                <span className="w-3 h-10 rounded-full" style={{ backgroundColor: bot.color }}></span>
                System Description
              </h2>
              <p className="text-slate-300 text-xl leading-relaxed font-medium">
                {bot.description}
              </p>
            </section>

            <section className="glass rounded-[3rem] p-12">
              <h2 className="text-3xl font-black mb-10">Advanced Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {bot.features.map((feature, idx) => (
                  <div key={idx} className="bg-white/5 rounded-[2rem] p-8 border border-white/5 hover:border-indigo-500/30 transition-all group">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <section className="glass rounded-[3rem] p-10 border border-indigo-500/10">
              <h3 className="text-2xl font-black mb-8">Performance</h3>
              <div className="space-y-8">
                <div className="flex justify-between items-center group">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total Guilds</span>
                  <span className="text-white font-black text-xl">{bot.stats.servers}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Users Reached</span>
                  <span className="text-white font-black text-xl">{bot.stats.users}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">API Commands</span>
                  <span className="text-white font-black text-xl">{bot.stats.commands}</span>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex items-center gap-4 text-emerald-400 font-black text-sm">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  LIVE STATUS: OPTIMAL
                </div>
              </div>
            </section>

            <section className="glass rounded-[3rem] p-10 text-center bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20">
              <h3 className="text-2xl font-black mb-6">Need Assistance?</h3>
              <p className="text-slate-400 font-medium mb-10 leading-relaxed">Our developer community is ready to help 24/7.</p>
              <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 font-black text-sm hover:bg-white/10 transition-all uppercase tracking-widest">
                ENTER SUPPORT HUB
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotDetailView;