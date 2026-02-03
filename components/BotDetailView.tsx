
import React from 'react';
import { BotInfo, ThemeType } from '../types';
import { SUPPORT_SERVER_URL } from '../constants';

interface BotDetailViewProps {
  bot: BotInfo;
  theme?: ThemeType;
  onBack: () => void;
}

const FeatureIconMap: Record<string, React.ReactNode> = {
  AUDIO: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
  PLAYLIST: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  ZAP: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  SHIELD: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  CHART: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  LINK: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  LOCK: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  GLOBE: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  DEFAULT: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  )
};

const getFeatureIcon = (title: string, iconKey: string) => {
  const t = title.toLowerCase();
  const k = iconKey.toUpperCase();

  if (k === 'SPEAKER' || k === 'AUDIO') return FeatureIconMap.AUDIO;
  if (k === 'SHIELD' || k === 'SECURITY') return FeatureIconMap.SHIELD;
  if (k === 'LOCK' || k === 'ANTINUKE') return FeatureIconMap.LOCK;
  if (k === 'GLOBE' || k === 'NETWORK') return FeatureIconMap.GLOBE;
  if (FeatureIconMap[k]) return FeatureIconMap[k];

  if (t.includes('audio') || t.includes('music') || t.includes('sound')) return FeatureIconMap.AUDIO;
  if (t.includes('playlist') || t.includes('queue') || t.includes('list')) return FeatureIconMap.PLAYLIST;
  if (t.includes('global') || t.includes('coverage') || t.includes('zap') || t.includes('speed') || t.includes('performance')) return FeatureIconMap.ZAP;
  if (t.includes('shield') || t.includes('protection') || t.includes('security')) return FeatureIconMap.SHIELD;
  if (t.includes('antinuke') || t.includes('lock') || t.includes('raid')) return FeatureIconMap.LOCK;
  if (t.includes('automod') || t.includes('mod') || t.includes('chart') || t.includes('stat') || t.includes('analytic')) return FeatureIconMap.CHART;
  if (t.includes('utility') || t.includes('suite') || t.includes('tool') || t.includes('link') || t.includes('integration')) return FeatureIconMap.LINK;
  if (t.includes('world') || t.includes('node') || t.includes('server')) return FeatureIconMap.GLOBE;

  return FeatureIconMap.DEFAULT;
};

const BotDetailView: React.FC<BotDetailViewProps> = ({ bot, theme = 'dark', onBack }) => {
  return (
    <div className={`min-h-screen animate-in overflow-x-hidden transition-colors duration-500 ${theme !== 'light' ? 'bg-[var(--bg-color)] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={bot.bannerUrl} 
          className="w-full h-full object-cover opacity-30 blur-2xl scale-125"
          alt="Banner" 
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${theme !== 'light' ? 'from-[var(--bg-color)]' : 'from-slate-50'}`}></div>
        <button 
          onClick={onBack}
          className={`absolute top-10 left-10 p-4 rounded-2xl transition-all z-20 backdrop-blur-xl border flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${theme !== 'light' ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' : 'bg-white/80 hover:bg-white text-slate-900 border-slate-200 shadow-sm'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-32">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 mb-20 text-center lg:text-left">
          <div className={`w-56 h-56 md:w-72 md:h-72 rounded-[3.5rem] border-[16px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden relative group ${theme !== 'light' ? 'border-[var(--bg-color)] bg-slate-900' : 'border-slate-50 bg-white shadow-xl'}`}>
            <img 
              src={bot.imageUrl} 
              alt={bot.name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${bot.name}&background=5865f2&color=fff&size=512`;
              }}
            />
          </div>
          <div className="flex-1 pb-4">
            <h1 className={`text-6xl md:text-[9rem] font-black mb-6 tracking-tighter leading-none ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{bot.name}</h1>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
               <span className="px-6 py-2 rounded-full bg-[var(--brand-color)]/20 border border-[var(--brand-color)]/30 text-[var(--brand-color)] font-black text-[10px] uppercase tracking-widest">
                  Verified Instance
               </span>
               <span className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                  24/7 Global Uptime
               </span>
            </div>
          </div>
          <div className="hidden lg:block pb-4">
             <a 
               href={bot.inviteUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest bg-[var(--brand-color)] text-white shadow-2xl hover:bg-indigo-500 hover:-translate-y-1 transition-all block text-center"
             >
                Add to Discord
             </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className={`rounded-[3rem] p-12 border reveal reveal-up ${theme !== 'light' ? 'bg-[#161a23]/50 border-white/5 backdrop-blur-md' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center gap-6 mb-10">
                <div className="w-1.5 h-10 bg-[var(--brand-color)] rounded-full"></div>
                <h2 className={`text-4xl font-black tracking-tight ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>System Architecture</h2>
              </div>
              <p className={`text-lg md:text-xl leading-relaxed font-medium ${theme !== 'light' ? 'text-slate-300' : 'text-slate-600'}`}>
                {bot.description}
              </p>
            </section>

            <section className={`rounded-[3rem] p-12 border reveal reveal-up stagger-1 ${theme !== 'light' ? 'bg-[#161a23]/50 border-white/5 backdrop-blur-md' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center gap-6 mb-12">
                <div className="w-1.5 h-10 bg-emerald-500 rounded-full"></div>
                <h2 className={`text-4xl font-black tracking-tight ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>Capabilities</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {bot.features.map((feature, idx) => (
                  <div key={idx} className={`rounded-[2rem] p-8 border transition-all group/feat ${theme !== 'light' ? 'bg-white/5 border-white/5 hover:border-[var(--brand-color)]/40 hover:bg-white/[0.07]' : 'bg-slate-50 border-slate-200 hover:border-[var(--brand-color)]/20 hover:bg-white shadow-sm'}`}>
                    <div className="w-14 h-14 text-[var(--brand-color)] mb-8 p-3 rounded-2xl bg-[var(--brand-color)]/10 group-hover/feat:scale-105 group-hover/feat:rotate-[5deg] transition-all duration-300">
                      {getFeatureIcon(feature.title, feature.icon)}
                    </div>
                    <h3 className={`text-xl font-black mb-4 leading-tight ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                    <p className="text-slate-500 text-sm font-bold leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <section className={`rounded-[3rem] p-10 border reveal reveal-right ${theme !== 'light' ? 'bg-[#161a23]/50 border-[var(--brand-color)]/10 backdrop-blur-md' : 'bg-white border-slate-200 shadow-md'}`}>
              <h3 className="text-xl font-black mb-10 uppercase tracking-widest text-slate-500">Live Statistics</h3>
              <div className="space-y-8">
                <div className="flex justify-between items-center group/stat">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] group-hover/stat:text-[var(--brand-color)] transition-colors">Active Servers</span>
                  <span className={`font-black text-2xl ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{bot.stats.servers}</span>
                </div>
                <div className="flex justify-between items-center group/stat">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] group-hover/stat:text-[var(--brand-color)] transition-colors">Total Users</span>
                  <span className={`font-black text-2xl ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{bot.stats.users}</span>
                </div>
                <div className="flex justify-between items-center group/stat">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] group-hover/stat:text-[var(--brand-color)] transition-colors">Unique API Commands</span>
                  <span className={`font-black text-2xl ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{bot.stats.commands}</span>
                </div>
                <div className={`h-px ${theme !== 'light' ? 'bg-white/5' : 'bg-slate-100'}`}></div>
                <div className="flex items-center gap-4 text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  Service Status: 100%
                </div>
                
                <a 
                  href={bot.inviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[var(--brand-color)] text-white shadow-[0_15px_35px_var(--brand-glow)] hover:bg-white hover:text-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group/cta"
                >
                  <svg className="w-5 h-5 transition-transform group-hover/cta:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                  Add to Discord
                </a>
              </div>
            </section>

            <section className={`rounded-[3rem] p-10 text-center border reveal reveal-right stagger-1 ${theme !== 'light' ? 'bg-[var(--brand-color)]/5 border-[var(--brand-color)]/10 backdrop-blur-md' : 'bg-indigo-50 border-indigo-100'}`}>
              <h3 className={`text-xl font-black mb-6 ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>Support Hub</h3>
              <p className={`font-bold mb-10 leading-relaxed text-sm ${theme !== 'light' ? 'text-slate-500' : 'text-slate-600'}`}>Need a custom feature or encountered a bug? Our devs are available in the support server.</p>
              <button 
                onClick={() => window.open(SUPPORT_SERVER_URL, '_blank')}
                className={`w-full py-5 rounded-2xl border font-black text-[10px] transition-all uppercase tracking-widest active:scale-95 ${theme !== 'light' ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm'}`}
              >
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
