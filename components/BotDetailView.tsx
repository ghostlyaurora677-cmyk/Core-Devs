
import React from 'react';
import { BotInfo } from '../types';

interface BotDetailViewProps {
  bot: BotInfo;
  onBack: () => void;
}

const BotDetailView: React.FC<BotDetailViewProps> = ({ bot, onBack }) => {
  return (
    <div className="min-h-screen bg-[#000000] animate-in text-white overflow-x-hidden">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={bot.bannerUrl} 
          className="w-full h-full object-cover opacity-30 blur-2xl scale-125"
          alt="Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-10 left-10 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all z-20 backdrop-blur-xl border border-white/10 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-32">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 mb-20 text-center lg:text-left">
          <img 
            src={bot.imageUrl} 
            alt={bot.name} 
            className="w-56 h-56 md:w-72 md:h-72 rounded-[3.5rem] border-[16px] border-[#000000] shadow-[0_30px_100px_rgba(0,0,0,1)]" 
          />
          <div className="flex-1 pb-4">
            <h1 className="text-6xl md:text-[9rem] font-black text-white mb-6 tracking-tighter leading-none">{bot.name}</h1>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
               <span className="px-6 py-2 rounded-full bg-indigo-600/20 border border-indigo-600/30 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                  Verified Instance
               </span>
               <span className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                  24/7 Global Uptime
               </span>
            </div>
          </div>
          <div className="pb-4">
             <a 
               href={bot.inviteUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest bg-[#5865F2] text-white shadow-2xl hover:bg-indigo-500 hover:-translate-y-1 transition-all block text-center"
             >
                Add to Discord
             </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="glass rounded-[3rem] p-12 border-white/5">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                <span className="w-2 h-8 rounded-full bg-[#5865F2]"></span>
                Architecture & Logic
              </h2>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
                {bot.description}
              </p>
            </section>

            <section className="glass rounded-[3rem] p-12 border-white/5">
              <h2 className="text-3xl font-black mb-12">Core Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {bot.features.map((feature, idx) => (
                  <div key={idx} className="bg-white/5 rounded-[2rem] p-8 border border-white/5 hover:border-indigo-500/20 transition-all">
                    <div className="text-5xl mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-black text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-500 text-sm font-bold leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <section className="glass rounded-[3rem] p-10 border border-indigo-500/10">
              <h3 className="text-xl font-black mb-10 uppercase tracking-widest text-slate-500">Live Statistics</h3>
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Active Servers</span>
                  <span className="text-white font-black text-2xl">{bot.stats.servers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Total Users</span>
                  <span className="text-white font-black text-2xl">{bot.stats.users}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Unique API Commands</span>
                  <span className="text-white font-black text-2xl">{bot.stats.commands}</span>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="flex items-center gap-4 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  Service Status: 100%
                </div>
              </div>
            </section>

            <section className="glass rounded-[3rem] p-10 text-center bg-indigo-600/5 border-indigo-500/10">
              <h3 className="text-xl font-black mb-6">Support Hub</h3>
              <p className="text-slate-500 font-bold mb-10 leading-relaxed text-sm">Need a custom feature or encountered a bug? Our devs are available.</p>
              <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 font-black text-[10px] hover:bg-white/10 transition-all uppercase tracking-widest text-white">
                Contact Developers
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotDetailView;
