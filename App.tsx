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
      if (localStorage.getItem('cd_admin_session') === 'active') {
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
    // UI Update
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
      localStorage.setItem('cd_admin_session', 'active');
      setView('admin');
      return true;
    }
    return false;
  };

  if (view === 'login') return <LoginView onLogin={handleLogin} onBack={() => setView('home')} />;
  if (view === 'admin' && isAdmin) return (
    <AdminPanelView 
      resources={resources} 
      onAdd={handleAddResource} 
      onUpdate={handleUpdateResource} 
      onDelete={handleDeleteResource} 
      onBack={() => setView('home')} 
    />
  );
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
            <section className="px-6 py-20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-[#5865F2]/10 blur-[120px] -z-10"></div>
              <h1 className="reveal active text-7xl md:text-[10rem] font-black tracking-tighter mb-8 leading-none">
                CORE <span className="text-[#5865F2]">DEVS</span>
              </h1>
              <p className="reveal active stagger-1 max-w-2xl mx-auto text-xl text-slate-400 mb-12 font-medium">
                The ultimate Discord infrastructure and developer resource hub.
              </p>
              <div className="reveal active stagger-2 flex flex-wrap justify-center gap-6">
                <button onClick={() => setView('resources')} className="bg-[#5865F2] hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-sm tracking-widest transition-all glow shadow-xl active:scale-95">
                  ENTER THE VAULT
                </button>
                <a href="#bots" className="px-10 py-5 rounded-2xl font-black text-sm tracking-widest border border-white/10 glass hover:bg-white/5 transition-all">
                  BROWSE BOTS
                </a>
              </div>
            </section>
            
            <section id="bots" className="px-6 py-24 max-w-7xl mx-auto space-y-12">
              <h2 className="reveal text-3xl font-black text-center mb-16 uppercase tracking-widest text-slate-500">Live Services</h2>
              {BOTS.map(bot => (
                <BotCard key={bot.id} bot={bot} onViewDetails={(b) => { setSelectedBot(b); setView('bot-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
              ))}
            </section>
          </>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="reveal active text-6xl font-black mb-20 text-center tracking-tighter uppercase">The Repository</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {(['API_KEY', 'CODE_SNIPPET', 'TOOL'] as ResourceType[]).map((type, idx) => (
                <div 
                  key={type}
                  onClick={() => { setSelectedCategory(type); setView('category-detail'); window.scrollTo({top: 0}); }}
                  className={`reveal active stagger-${(idx % 3) + 1} glass p-12 rounded-[3rem] text-center cursor-pointer hover:border-[#5865F2]/50 transition-all hover:-translate-y-2 group`}
                >
                  <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">
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
            <button onClick={() => setView('resources')} className="mb-10 text-slate-400 font-bold hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Return to Vault
            </button>
            <h2 className="reveal active text-5xl font-black mb-16 uppercase tracking-tighter">{selectedCategory?.replace('_', ' ')} Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map(res => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          </div>
        )}
      </main>

      <NexusAssistant />
      <Footer onNavigate={setView} />
    </div>
  );
};

export default App;