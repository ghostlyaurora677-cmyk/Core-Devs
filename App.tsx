
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'API_KEY' as ResourceType,
    content: '',
    tags: ''
  });

  // Initialization
  useEffect(() => {
    // 1. Mark JS as ready for animations
    document.documentElement.classList.add('js-ready');

    // 2. Fetch data in background
    const loadData = async () => {
      try {
        const data = await databaseService.getResources();
        if (data && data.length > 0) setResources(data);
      } catch (e) {
        console.warn("Background fetch failed, using defaults", e);
      }
    };
    loadData();

    // 3. Admin session check
    try {
      if (localStorage.getItem('cd_admin_session') === 'active') setIsAdmin(true);
    } catch (e) {}
  }, []);

  // Simple Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [view, resources]);

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

  const handleAddOrUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setIsSyncing(true);
    try {
      const resource: Resource = {
        id: editingResource?.id || Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        content: formData.content,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        createdAt: editingResource?.createdAt || new Date().toISOString().split('T')[0]
      };
      
      if (editingResource) await databaseService.updateResource(resource);
      else await databaseService.addResource(resource);
      
      const data = await databaseService.getResources();
      setResources(data);
      setEditingResource(null);
      setFormData({ title: '', description: '', type: 'API_KEY', content: '', tags: '' });
    } finally {
      setIsSyncing(false);
    }
  };

  if (view === 'login') return <LoginView onLogin={handleLogin} onBack={() => setView('home')} />;
  if (view === 'bot-detail' && selectedBot) return <BotDetailView bot={selectedBot} onBack={() => setView('home')} />;

  const filteredResources = resources.filter(r => r.type === selectedCategory);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#000000]' : 'bg-slate-50'}`}>
      <Navbar 
        onNavigate={(v) => (v === 'admin' && !isAdmin) ? setView('login') : setView(v)} 
        currentView={view} 
        theme={theme} 
        toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
        isAdmin={isAdmin}
      />

      <main className="flex-grow pt-20">
        {view === 'home' && (
          <div className="fade-in">
            <section className="px-6 py-28 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[150px] -z-10 rounded-full"></div>
              <div className="reveal">
                <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter mb-10 leading-none text-white">
                  CORE <span className="text-[#5865F2]">DEVS</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-12">
                  Premium Discord infrastructure and a high-security vault for developers.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button onClick={() => setView('resources')} className="bg-[#5865F2] text-white px-10 py-5 rounded-2xl text-sm font-black hover:scale-105 transition-all">
                    ENTER THE VAULT
                  </button>
                  <a href="#bots" className="px-10 py-5 rounded-2xl text-sm font-black border border-white/10 bg-white/5 text-white">
                    OUR BOTS
                  </a>
                </div>
              </div>
            </section>
            
            <section id="bots" className="px-6 py-24 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 gap-12">
                {BOTS.map(bot => (
                  <div key={bot.id} className="reveal">
                    <BotCard bot={bot} onViewDetails={handleBotClick} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <h2 className="text-6xl font-black text-white text-center mb-20 reveal">The Vault</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {['API_KEY', 'CODE_SNIPPET', 'TOOL'].map((type) => (
                <div 
                  key={type}
                  onClick={() => { setSelectedCategory(type as ResourceType); setView('category-detail'); }}
                  className="glass h-80 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer reveal card-highlight"
                >
                  <span className="text-6xl mb-6">{type === 'API_KEY' ? '🔑' : type === 'CODE_SNIPPET' ? '💻' : '🛠️'}</span>
                  <h3 className="text-2xl font-black text-white">{type.replace('_', ' ')}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'category-detail' && (
          <div className="max-w-7xl mx-auto px-6 py-24">
             <button onClick={() => setView('resources')} className="mb-12 text-slate-500 font-black uppercase text-xs tracking-widest">← Back to Vault</button>
             <h2 className="text-5xl font-black text-white mb-12">{selectedCategory?.replace('_', ' ')}</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {filteredResources.map(res => (
                  <div key={res.id} className="reveal">
                    <ResourceCard resource={res} />
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      <NexusAssistant />
    </div>
  );
};

export default App;
