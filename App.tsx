
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BotCard from './components/BotCard';
import BotDetailView from './components/BotDetailView';
import ResourceCard from './components/ResourceCard';
import LoadingScreen from './components/LoadingScreen';
import LoginView from './components/LoginView';
import NexusAssistant from './components/NexusAssistant';
import { BOTS } from './constants';
import { Resource, ResourceType, BotInfo } from './types';
import { databaseService } from './services/databaseService';

const ADMIN_PASSWORD = 'coredevs@2025';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'resources' | 'admin' | 'bot-detail' | 'login' | 'category-detail'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ResourceType | null>(null);
  const [selectedBot, setSelectedBot] = useState<BotInfo | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('cd_admin_session') === 'active';
    } catch {
      return false;
    }
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'API_KEY' as ResourceType,
    content: '',
    tags: ''
  });

  const fetchResources = async () => {
    try {
      const data = await databaseService.getResources();
      setResources(data);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fail-safe to prevent stuck black loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn("Loading taking too long, forcing app start...");
        setIsLoading(false);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    fetchResources();
  }, []);

  // Improved Reveal Animation Logic
  useEffect(() => {
    if (isLoading) return;

    const initObserver = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

      const elements = document.querySelectorAll('.reveal');
      if (elements.length === 0) {
        // Retry after a short delay if elements aren't rendered yet
        setTimeout(initObserver, 100);
        return;
      }
      elements.forEach(el => observer.observe(el));
      return observer;
    };

    const obs = initObserver();
    return () => obs?.disconnect();
  }, [view, isLoading, resources]);

  useEffect(() => {
    if (theme === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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
      if (editingResource) {
        const updated: Resource = {
          ...editingResource,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          content: formData.content,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        };
        await databaseService.updateResource(updated);
        setEditingResource(null);
      } else {
        const resource: Resource = {
          id: Math.random().toString(36).substr(2, 9),
          title: formData.title,
          description: formData.description,
          type: formData.type,
          content: formData.content,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          createdAt: new Date().toISOString().split('T')[0]
        };
        await databaseService.addResource(resource);
      }
      await fetchResources();
      setFormData({ title: '', description: '', type: 'API_KEY', content: '', tags: '' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleEditClick = (res: Resource) => {
    setEditingResource(res);
    setFormData({
      title: res.title,
      description: res.description,
      type: res.type,
      content: res.content,
      tags: res.tags.join(', ')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteResource = async (id: string) => {
    if (!isAdmin || !window.confirm("Delete this resource?")) return;
    setIsSyncing(true);
    try {
      await databaseService.deleteResource(id);
      await fetchResources();
    } finally {
      setIsSyncing(false);
    }
  };

  const openCategory = (type: ResourceType) => {
    setSelectedCategory(type);
    setView('category-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <LoadingScreen />;
  if (view === 'login') return <LoginView onLogin={handleLogin} onBack={() => setView('home')} />;
  if (view === 'bot-detail' && selectedBot) return <BotDetailView bot={selectedBot} onBack={() => setView('home')} />;

  const filteredResources = resources.filter(r => r.type === selectedCategory);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#000000]' : 'bg-slate-50'}`}>
      <Navbar 
        onNavigate={(v) => (v === 'admin' && !isAdmin) ? setView('login') : setView(v)} 
        currentView={view} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        isAdmin={isAdmin}
      />

      <main className="flex-grow pt-20">
        {view === 'home' && (
          <div className="animate-in fade-in duration-700">
            {/* Hero */}
            <section className="relative px-6 py-28 md:py-40 flex flex-col items-center text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-indigo-600/10 blur-[180px] -z-10 rounded-full animate-pulse"></div>
              
              <div className="reveal">
                <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black tracking-widest text-indigo-400 mb-8 uppercase">
                  v2.0 Infrastructure Now Online
                </div>
                <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter mb-10 leading-[0.8] text-white">
                  CORE <span className="text-[#5865F2] drop-shadow-[0_0_30px_rgba(88,101,242,0.3)]">DEVS</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl mb-12 leading-relaxed text-slate-400 font-medium">
                  Next-generation Discord solutions and a shared vault for developers. 
                  Access premium tools, API keys, and source code for free.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button onClick={() => setView('resources')} className="bg-[#5865F2] text-white px-10 py-5 rounded-2xl text-sm font-black hover:bg-indigo-500 hover:scale-105 transition-all shadow-[0_10px_40px_-10px_rgba(88,101,242,0.5)]">
                    ENTER THE VAULT
                  </button>
                  <a href="#bots" className="px-10 py-5 rounded-2xl text-sm font-black border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all">
                    OUR INFRASTRUCTURE
                  </a>
                </div>
              </div>
            </section>
            
            {/* Bots */}
            <section id="bots" className="px-6 py-24 max-w-7xl mx-auto w-full">
              <div className="flex items-center justify-between mb-16 reveal">
                 <div>
                    <h2 className="text-4xl font-black text-white mb-2">Public Infrastructure</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Verified high-uptime Discord instances</p>
                 </div>
                 <div className="hidden md:flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Status: Optimal</span>
                 </div>
              </div>
              <div className="grid grid-cols-1 gap-12">
                {BOTS.map((bot, index) => (
                  <div key={bot.id} className="reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                    <BotCard bot={bot} onViewDetails={handleBotClick} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-24 animate-in slide-in-from-bottom-10 duration-700">
            <header className="mb-20 text-center reveal">
              <h2 className="text-6xl font-black text-white mb-6">The Shared Vault</h2>
              <p className="max-w-xl mx-auto text-slate-400 text-sm leading-relaxed font-bold uppercase tracking-widest">
                Our library of developer assets, donated keys, and proprietary bot templates.
              </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {[
                { type: 'API_KEY', name: 'API Keys', desc: 'Auth & Tokens', icon: '🔑' },
                { type: 'CODE_SNIPPET', name: 'Source Code', desc: 'Pro Templates', icon: '💻' },
                { type: 'TOOL', name: 'Dev Tools', desc: 'Web Utilities', icon: '🛠️' }
              ].map((cat, idx) => (
                <div 
                  key={cat.type}
                  onClick={() => openCategory(cat.type as ResourceType)}
                  className="group relative h-96 rounded-[3rem] glass flex flex-col items-center justify-center cursor-pointer reveal card-highlight overflow-hidden border-white/5"
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className={`absolute inset-0 bg-white/5 group-hover:bg-indigo-500/5 transition-colors`}></div>
                  <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-4 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                    {cat.desc}
                  </p>
                  <div className="mt-8 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase tracking-widest">
                    Access Assets
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'category-detail' && (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <button 
              onClick={() => setView('resources')} 
              className="mb-12 flex items-center gap-2 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Vault
            </button>
            <header className="mb-20">
              <h2 className="text-5xl font-black text-white mb-4">
                {selectedCategory === 'API_KEY' ? 'API Token Library' : selectedCategory === 'CODE_SNIPPET' ? 'Code Repository' : 'Developer Utilities'}
              </h2>
              <div className="h-1 w-20 bg-indigo-600 rounded-full mb-4"></div>
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
                {filteredResources.length} Assets Available
              </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredResources.length > 0 ? (
                filteredResources.map((res, index) => (
                  <div key={res.id} className="reveal" style={{ transitionDelay: `${index * 50}ms` }}>
                    <ResourceCard resource={res} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center glass rounded-[3rem]">
                   <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Queueing resources... Check back soon.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'admin' && isAdmin && (
          <div className="max-w-7xl mx-auto px-6 py-24 animate-in fade-in duration-500">
            <header className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black text-white">Vault Control</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Cloud Synced Admin Instance</p>
              </div>
              <button onClick={handleLogout} className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                Terminate Session
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <form onSubmit={handleAddOrUpdateResource} className="glass rounded-[2.5rem] p-10 space-y-8 sticky top-24 border-white/5">
                  <h3 className="text-xl font-black text-white">{editingResource ? 'Edit Asset' : 'New Vault Entry'}</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-2 block">Display Title</label>
                      <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full bg-black border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-2 block">Category</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ResourceType})} className="w-full bg-black border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none text-sm appearance-none">
                        <option value="API_KEY">API Key / Token</option>
                        <option value="CODE_SNIPPET">Source Code</option>
                        <option value="TOOL">Developer Tool</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-2 block">Description</label>
                      <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="w-full bg-black border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-2 block">Secret Content</label>
                      <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={5} required className="w-full bg-black border border-white/10 rounded-xl px-5 py-3.5 text-white font-mono text-xs focus:border-indigo-500 transition-all outline-none"></textarea>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-2 block">Tags (comma separated)</label>
                      <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none text-sm" />
                    </div>
                    <button type="submit" disabled={isSyncing} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg disabled:opacity-50">
                      {isSyncing ? 'SYNCING...' : (editingResource ? 'SAVE CHANGES' : 'PUBLISH TO VAULT')}
                    </button>
                    {editingResource && (
                      <button type="button" onClick={() => { setEditingResource(null); setFormData({title:'', description:'', type:'API_KEY', content:'', tags:''}); }} className="w-full bg-white/5 text-slate-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-7">
                <div className="glass rounded-[2.5rem] p-10 border-white/5 min-h-[500px]">
                  <h3 className="text-xl font-black text-white mb-10">Active Infrastructure Assets</h3>
                  <div className="space-y-4">
                    {resources.map(res => (
                      <div key={res.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${res.type === 'API_KEY' ? 'bg-amber-500' : res.type === 'CODE_SNIPPET' ? 'bg-indigo-500' : 'bg-purple-500'}`}></span>
                            <p className="font-bold text-white truncate text-sm">{res.title}</p>
                          </div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{res.type} • {res.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditClick(res)} className="p-2.5 text-indigo-400 bg-indigo-400/10 rounded-lg hover:bg-indigo-400 hover:text-white transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                          </button>
                          <button onClick={() => handleDeleteResource(res.id)} className="p-2.5 text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global AI Assistant */}
      <NexusAssistant />

      <footer className="mt-24 border-t border-white/5 py-16 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div>
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-sm">CD</div>
               <span className="text-xl font-black text-white tracking-tighter">Core Devs Hub</span>
            </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Crafting Digital Excellence Since 2024</p>
          </div>
          <div className="flex gap-10">
             <a href="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy</a>
             <a href="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Terms</a>
             <a href="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Discord</a>
          </div>
          <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest">© 2024 Core Devs. Proudly Hosted on Vercel.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
