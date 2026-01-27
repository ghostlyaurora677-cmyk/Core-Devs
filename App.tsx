import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BotCard from './components/BotCard';
import BotDetailView from './components/BotDetailView';
import ResourceCard from './components/ResourceCard';
import LoginView from './components/LoginView';
import NexusAssistant from './components/NexusAssistant';
import { BOTS, INITIAL_RESOURCES } from './constants';
import { Resource, ResourceType, BotInfo } from './types';
import { databaseService } from './services/databaseService';

const ADMIN_PASSWORD = 'coredevs@2025';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'resources' | 'admin' | 'bot-detail' | 'login' | 'category-detail'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ResourceType | null>(null);
  const [selectedBot, setSelectedBot] = useState<BotInfo | null>(null);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load resources from DB or local storage on mount
  useEffect(() => {
    async function init() {
      try {
        const cloudData = await databaseService.getResources();
        if (cloudData && cloudData.length > 0) {
          setResources(cloudData);
        }
      } catch (err) {
        console.warn("Background data fetch failed, using defaults.");
      }
      
      try {
        if (localStorage.getItem('cd_admin_session') === 'active') {
          setIsAdmin(true);
        }
      } catch (e) {}
    }
    init();
  }, []);

  const handleBotClick = (bot: BotInfo) => {
    setSelectedBot(bot);
    setView('bot-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('cd_admin_session', 'active');
      setView('admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('cd_admin_session');
    setView('home');
  };

  if (view === 'login') return <LoginView onLogin={handleLogin} onBack={() => setView('home')} />;
  if (view === 'bot-detail' && selectedBot) return <BotDetailView bot={selectedBot} onBack={() => setView('home')} />;

  const filteredResources = resources.filter(r => r.type === selectedCategory);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-slate-50'} text-white`}>
      <Navbar 
        onNavigate={(v) => (v === 'admin' && !isAdmin) ? setView('login') : setView(v)} 
        currentView={view} 
        theme={theme} 
        toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
        isAdmin={isAdmin}
      />

      <main className="flex-grow pt-24 fade-in">
        {view === 'home' && (
          <>
            <section className="px-6 py-20 text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-indigo-600/10 blur-[120px] -z-10"></div>
              <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-8 leading-none">
                CORE <span className="text-[#5865F2]">DEVS</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12 font-medium">
                Home of Fynex & Ryzer. High-performance Discord bots and developer assets.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button onClick={() => setView('resources')} className="bg-[#5865F2] hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-sm tracking-widest transition-all">
                  ENTER THE VAULT
                </button>
                <a href="#bots" className="px-10 py-5 rounded-2xl font-black text-sm tracking-widest border border-white/10 glass">
                  BROWSE BOTS
                </a>
              </div>
            </section>
            
            <section id="bots" className="px-6 py-24 max-w-7xl mx-auto space-y-12">
              <h2 className="text-3xl font-black text-center mb-16 uppercase tracking-widest text-slate-500">Infrastructure Status</h2>
              {BOTS.map(bot => (
                <BotCard key={bot.id} bot={bot} onViewDetails={handleBotClick} />
              ))}
            </section>
          </>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-6xl font-black mb-20 text-center">The Repository</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {(['API_KEY', 'CODE_SNIPPET', 'TOOL'] as ResourceType[]).map((type) => (
                <div 
                  key={type}
                  onClick={() => { setSelectedCategory(type); setView('category-detail'); }}
                  className="glass p-12 rounded-[3rem] text-center cursor-pointer hover:border-indigo-500/50 transition-all hover:-translate-y-2"
                >
                  <div className="text-7xl mb-6">
                    {type === 'API_KEY' ? '🔑' : type === 'CODE_SNIPPET' ? '💻' : '🛠️'}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-widest">{type.replace('_', ' ')}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'category-detail' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <button onClick={() => setView('resources')} className="mb-10 text-slate-400 font-bold hover:text-white transition-colors">← RETURN TO VAULT</button>
            <h2 className="text-5xl font-black mb-16">{selectedCategory?.replace('_', ' ')} Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map(res => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          </div>
        )}
      </main>

      <NexusAssistant />
      
      <footer className="py-20 border-t border-white/5 text-center mt-20">
        <p className="text-slate-600 text-xs font-black tracking-widest uppercase">© 2025 Core Devs Hub • Optimized for Discord Developers</p>
      </footer>
    </div>
  );
};

export default App;