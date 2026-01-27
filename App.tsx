import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BotCard from './components/BotCard';
import BotDetailView from './components/BotDetailView';
import ResourceCard from './components/ResourceCard';
import LoginView from './components/LoginView';
import AdminPanelView from './components/AdminPanelView';
import NexusAssistant from './components/NexusAssistant';
import Footer from './components/Footer';
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

  useEffect(() => {
    async function init() {
      const cloudData = await databaseService.getResources();
      if (cloudData && cloudData.length > 0) {
        setResources(cloudData);
      }
      if (sessionStorage.getItem('cd_admin_session') === 'active') {
        setIsAdmin(true);
      }
    }
    init();
  }, []);

  const handleAddResource = async (res: Resource) => {
    const updated = [res, ...resources];
    setResources(updated);
    await databaseService.addResource(res);
  };

  const handleUpdateResource = async (res: Resource) => {
    const updated = resources.map(r => r.id === res.id ? res : r);
    setResources(updated);
    await databaseService.updateResource(res);
  };

  const handleDeleteResource = async (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    try {
      await databaseService.deleteResource(id);
    } catch (err) {
      console.error("Cloud wipe failed, resource might still exist in DB:", err);
    }
  };

  const handleLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('cd_admin_session', 'active');
      setView('admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('cd_admin_session');
    localStorage.removeItem('cd_admin_session');
    setView('home');
  };

  const handleNavigate = (v: any) => {
    if (isAdmin && view === 'admin' && v !== 'admin') {
      handleLogout();
    } else if (v === 'admin' && !isAdmin) {
      setView('login');
    } else {
      setView(v);
    }
  };

  if (view === 'login') return <LoginView onLogin={handleLogin} onBack={() => setView('home')} />;
  if (view === 'admin' && isAdmin) return (
    <AdminPanelView 
      resources={resources} 
      onAdd={handleAddResource} 
      onUpdate={handleUpdateResource} 
      onDelete={handleDeleteResource} 
      onBack={handleLogout} 
    />
  );
  if (view === 'bot-detail' && selectedBot) return <BotDetailView bot={selectedBot} onBack={() => setView('home')} />;

  const filteredResources = resources.filter(r => r.type === selectedCategory);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-slate-50'} text-white`}>
      <Navbar 
        onNavigate={handleNavigate} 
        currentView={view} 
        theme={theme} 
        toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
        isAdmin={isAdmin}
      />

      <main className="flex-grow pt-24 fade-in">
        {view === 'home' && (
          <>
            <section className="px-6 py-32 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] hero-gradient blur-[120px] -z-10 opacity-50"></div>
              
              <h1 className="reveal active reveal-down text-7xl md:text-[11rem] font-black tracking-tighter mb-6 leading-[0.85] text-white">
                CORE <span className="text-[#5865F2] drop-shadow-[0_0_30px_rgba(88,101,242,0.4)]">DEVS</span>
              </h1>
              
              <p className="reveal active reveal-up stagger-1 max-w-2xl mx-auto text-lg md:text-2xl text-slate-400 mb-14 font-medium leading-relaxed">
                Architecting the next generation of <span className="text-white">Discord infrastructure</span> and open-source developer assets.
              </p>
              
              <div className="reveal active reveal-scale stagger-2 flex flex-wrap justify-center gap-6">
                <button onClick={() => setView('resources')} className="group bg-[#5865F2] hover:bg-indigo-500 text-white px-12 py-6 rounded-2xl font-black text-sm tracking-widest transition-all glow shadow-xl active:scale-95 flex items-center gap-3">
                  ENTER THE VAULT
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <a href="#bots" className="px-12 py-6 rounded-2xl font-black text-sm tracking-widest border border-white/10 glass hover:bg-white/5 transition-all text-slate-300 hover:text-white">
                  BROWSE BOTS
                </a>
              </div>
            </section>
            
            <section id="bots" className="px-6 py-24 max-w-7xl mx-auto space-y-20">
              <div className="reveal reveal-up text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Live Ecosystem</h2>
                <div className="w-20 h-1.5 bg-[#5865F2] mx-auto rounded-full"></div>
              </div>
              
              {BOTS.map((bot, index) => (
                <div key={bot.id} className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                  <BotCard bot={bot} onViewDetails={(b) => { setSelectedBot(b); setView('bot-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                </div>
              ))}
            </section>
          </>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="reveal reveal-down text-center mb-24">
              <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase text-white">The Repository</h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Decentralized Asset Management</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {(['API_KEY', 'CODE_SNIPPET', 'TOOL'] as ResourceType[]).map((type, idx) => (
                <div 
                  key={type}
                  onClick={() => { setSelectedCategory(type); setView('category-detail'); window.scrollTo({top: 0}); }}
                  className={`reveal reveal-scale stagger-${idx + 1} glass p-14 rounded-[4rem] text-center cursor-pointer hover:border-[#5865F2]/50 transition-all hover:-translate-y-4 group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-8xl mb-8 group-hover:scale-110 transition-transform duration-500">
                    {type === 'API_KEY' ? '🔑' : type === 'CODE_SNIPPET' ? '💻' : '🛠️'}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-widest text-white group-hover:text-indigo-400 transition-colors">{type.replace('_', ' ')}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'category-detail' && (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <button onClick={() => setView('resources')} className="reveal reveal-left mb-12 text-slate-400 font-bold hover:text-white transition-colors flex items-center gap-3 text-xs uppercase tracking-widest group">
              <div className="w-8 h-8 rounded-full glass flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
              Return to Vault
            </button>
            <h2 className="reveal reveal-up text-5xl md:text-7xl font-black mb-20 uppercase tracking-tighter text-white">{selectedCategory?.replace('_', ' ')} Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((res, idx) => (
                <div key={res.id} className={`reveal reveal-scale stagger-${(idx % 3) + 1}`}>
                  <ResourceCard resource={res} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <NexusAssistant />
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;