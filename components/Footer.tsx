import React from 'react';

interface FooterProps {
  onNavigate: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center font-black text-white glow">CD</div>
            <span className="text-2xl font-black tracking-tighter">CoreDevs</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            The ultimate Discord ecosystem for developers and community owners. Powering the next generation of social interaction.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'GitHub', 'Discord'].map(social => (
              <a key={social} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[#5865F2] transition-all hover:-translate-y-1">
                <span className="sr-only">{social}</span>
                <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[#5865F2] font-black text-xs uppercase tracking-[0.2em] mb-8">Service</h4>
          <ul className="space-y-4">
            <li><button onClick={() => window.open('https://discord.com')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Add to Discord</button></li>
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Development Team</button></li>
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Premium Shards</button></li>
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Server Vote</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#5865F2] font-black text-xs uppercase tracking-[0.2em] mb-8">Support</h4>
          <ul className="space-y-4">
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Support Guild</button></li>
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Documentation</button></li>
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">API Status</button></li>
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Report Issue</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#5865F2] font-black text-xs uppercase tracking-[0.2em] mb-8">Legal</h4>
          <ul className="space-y-4">
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Terms of Service</button></li>
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Privacy Policy</button></li>
            <li><button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Cookie Compliance</button></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
          Made with <span className="text-red-500">❤️</span> by mandeep.ly
        </p>
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
          © 2024 CoreDevs Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;