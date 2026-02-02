
import React from 'react';

interface TeamViewProps {
  onBack: () => void;
}

const TeamView: React.FC<TeamViewProps> = ({ onBack }) => {
  const teamMembers = [
    { 
      name: 'Mandeep', 
      role: 'Founder', 
      discord: '@mandeep.ly', 
      avatar: './TeamIcons/mandeep.png',
      bio: 'Visionary architect of the CORE DEVS ecosystem. Leading the development of high-performance infrastructure and community tools.'
    },
    { 
      name: 'Aditya', 
      role: 'Founder', 
      discord: '@aditya', 
      avatar: './TeamIcons/aditya.png',
      bio: 'Strategic lead and co-founder. Shaping the growth and security of the RYZER™ and Fynex platforms.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white animate-in fade-in duration-500 pb-32">
      <div className="max-w-7xl mx-auto px-6 pt-32">
        <button 
          onClick={onBack}
          className="reveal active reveal-left mb-12 text-slate-400 font-bold hover:text-white transition-colors flex items-center gap-3 text-[10px] uppercase tracking-widest group"
        >
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          Back to Home
        </button>

        <div className="reveal active reveal-down text-center mb-24">
          <h1 className="text-6xl md:text-[8rem] font-black mb-6 tracking-tighter uppercase text-white leading-none">The Team</h1>
          <div className="w-24 h-2 bg-indigo-500 mx-auto rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] mb-6"></div>
          <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px]">The Architects behind CORE DEVS</p>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {teamMembers.map((member, idx) => (
            <div key={idx} className={`reveal active reveal-scale stagger-${idx + 1} glass rounded-[3rem] p-10 text-center group hover:border-indigo-500/30 transition-all duration-500 w-full md:w-[400px]`}>
              <div className="relative mb-8 inline-block">
                <div className="w-44 h-44 rounded-[2.5rem] mx-auto overflow-hidden ring-4 ring-white/5 group-hover:ring-indigo-500/20 transition-all shadow-2xl">
                  <img 
                    src={member.avatar} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    alt={member.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${member.name}&background=5865f2&color=fff&size=200`;
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-black group-hover:rotate-12 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-2">{member.name}</h3>
              <p className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6">{member.role}</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 px-4 font-medium h-20 overflow-hidden">
                {member.bio}
              </p>
              <div className="bg-black/40 rounded-2xl py-4 px-6 inline-flex items-center gap-4 border border-white/5 group-hover:border-indigo-500/20 transition-all">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-slate-300">{member.discord}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamView;
