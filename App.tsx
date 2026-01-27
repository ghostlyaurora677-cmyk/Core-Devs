
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import BotCard from './components/BotCard';
import BotDetailView from './components/BotDetailView';
import ResourceCard from './components/ResourceCard';
import LoadingScreen from './components/LoadingScreen';
import LoginView from './components/LoginView';
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
    return localStorage.getItem('cd_admin_session') === 'active';
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'API_KEY' as ResourceType,
    content: '',
    tags: ''
  });

  const fetchResources = async (showSync = false) => {
    if (showSync) setIsSyncing(true);
    try {
      const data = await databaseService.getResources();
      setResources(data);
    } catch (err) {
      console.error("Failed to fetch initial resources:", err);
    } finally {
      if (showSync) setIsSyncing(false);
      setIsLoading(false);
    }
  };

  // Scroll Reveal Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, [view, isLoading]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    fetchResources();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
    } catch (err) {
      alert("Database error: Could not sync changes.");
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
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    setIsSyncing(true);
    try {
      await databaseService.deleteResource(id);
      await fetchResources();
    } catch (err) {
      alert("Database error: Resource could not be deleted.");
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

  const dbStatus = databaseService.getStatus();
  const filteredResources = resources.filter(r => r.type === selectedCategory);

  return (
    <div className={`min-h-screen pt-20 flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#000000]' : 'bg-white'}`}>
      <Navbar 
        onNavigate={(v) => {
          if (v === 'admin' && !isAdmin) setView('login');
          else setView(v);
        }} 
        currentView={view} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        isAdmin={isAdmin}
      />

      <main className="flex-grow">
        {view === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="relative px-6 py-32 md:py-48 flex flex-col items-center text-center overflow-hidden">
              {theme === 'dark' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-600/10 blur-[180px] -z-10 rounded-full animate-pulse"></div>
              )}
              <div className="reveal">
                <h1 className="text-6xl md:text-9xl font-black tracking-tight mb-8 leading-[0.85]">
                  CORE <span className="text-indigo-500">DEVS</span>
                </h1>
                <p className={`max-w-2xl mx-auto text-xl mb-12 leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Advanced Discord solutions and shared developer assets. 
                  Explore our official bots and the free resource vault.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button onClick={() => setView('resources')} className="bg-indigo-600 text-white px-12 py-5 rounded-3xl text-lg font-black hover:bg-indigo-500 hover:scale-105 transition-all shadow-2xl glow-trigger">
                    ENTER THE VAULT
                  </button>
                  <a href="#bots" className={`px-12 py-5 rounded-3xl text-lg font-black border transition-all backdrop-blur-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-900'}`}>
                    DISCORD BOTS
                  </a>
                </div>
              </div>
            </section>
            
            {/* Bots Section */}
            <section id="bots" className="px-6 py-24 max-w-7xl mx-auto w-full">
              <div className="text-center mb-24 reveal">
                 <h2 className="text-5xl font-black mb-4">Official Infrastructure</h2>
                 <p className="text-slate-500 text-lg uppercase tracking-widest font-bold">Cloud-enabled server management</p>
              </div>
              <div className="grid grid-cols-1 gap-16">
                {BOTS.map((bot, index) => (
                  <div key={bot.id} className="reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                    <BotCard bot={bot} onViewDetails={handleBotClick} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <header className="mb-20 text-center reveal">
              <h2 className="text-7xl font-black mb-6">The Vault</h2>
              <p className={`max-w-2xl mx-auto text-xl leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Select a category to browse our curated developer assets.
              </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Category: API Keys */}
              <div 
                onClick={() => openCategory('API_KEY')}
                className="group relative h-96 rounded-[4rem] glass flex flex-col items-center justify-center cursor-pointer reveal card-highlight overflow-hidden"
              >
                <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-500">🔑</div>
                <h3 className="text-4xl font-black group-hover:text-amber-500 transition-colors">Free API Keys</h3>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Tokens, Secrets & Auth Keys</p>
                <div className="mt-8 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black group-hover:bg-amber-500 group-hover:text-black transition-all">
                  VIEW ALL ASSETS
                </div>
              </div>

              {/* Category: Source Code */}
              <div 
                onClick={() => openCategory('CODE_SNIPPET')}
                className="group relative h-96 rounded-[4rem] glass flex flex-col items-center justify-center cursor-pointer reveal card-highlight overflow-hidden"
                style={{ transitionDelay: '200ms' }}
              >
                <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
                <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-500">💻</div>
                <h3 className="text-4xl font-black group-hover:text-indigo-500 transition-colors">Free Source Codes</h3>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Bot Templates & Logics</p>
                <div className="mt-8 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  BROWSE REPOSITORY
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'category-detail' && (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <button 
              onClick={() => setView('resources')} 
              className="mb-12 flex items-center gap-2 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors reveal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Categories
            </button>
            <header className="mb-20 reveal">
              <h2 className="text-6xl font-black mb-4">
                {selectedCategory === 'API_KEY' ? 'API Key Library' : 'Source Code Repository'}
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                Found {filteredResources.length} items in this category
              </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredResources.length > 0 ? (
                filteredResources.map((res, index) => (
                  <div key={res.id} className="reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                    <ResourceCard resource={res} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center glass rounded-[3rem] reveal">
                   <p className="text-slate-500 font-black uppercase tracking-widest">No assets found in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'admin' && (
          isAdmin ? (
            <div className="max-w-6xl mx-auto px-6 py-32 reveal">
              <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                  <button onClick={() => setView('home')} className={`p-5 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <div>
                    <h2 className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Admin Hub</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">{dbStatus.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={handleLogout} className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Logout Session
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Admin Form: Left Side */}
                <div className="lg:col-span-5">
                  <form onSubmit={handleAddOrUpdateResource} className="glass rounded-[3.5rem] p-10 space-y-8 sticky top-24 border-indigo-500/10 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black">{editingResource ? 'Modify Asset' : 'Create Asset'}</h3>
                      {editingResource && (
                        <div className="px-3 py-1 bg-indigo-500 text-black text-[10px] font-black rounded-full uppercase tracking-widest">Editing Mode</div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Display Title</label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        required 
                        placeholder="e.g., GPT-4 Access Key" 
                        className={`w-full bg-black/40 border border-white/10 rounded-[1.2rem] px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : ''}`} 
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category Type</label>
                      <select 
                        value={formData.type} 
                        onChange={e => setFormData({...formData, type: e.target.value as ResourceType})} 
                        className={`w-full bg-black/40 border border-white/10 rounded-[1.2rem] px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : ''}`}
                      >
                        <option value="API_KEY">Free API Keys</option>
                        <option value="CODE_SNIPPET">Free Source Codes</option>
                        <option value="TOOL">Development Tool</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                      <input 
                        type="text" 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        required 
                        placeholder="Short summary of the asset" 
                        className={`w-full bg-black/40 border border-white/10 rounded-[1.2rem] px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : ''}`} 
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secret Content / Source</label>
                      <textarea 
                        value={formData.content} 
                        onChange={e => setFormData({...formData, content: e.target.value})} 
                        rows={6} 
                        required 
                        placeholder="Paste keys or code block here..." 
                        className={`w-full bg-black/40 border border-white/10 rounded-[1.5rem] px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : ''}`}
                      ></textarea>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Search Tags (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.tags} 
                        onChange={e => setFormData({...formData, tags: e.target.value})} 
                        placeholder="e.g., nodejs, discord, free" 
                        className={`w-full bg-black/40 border border-white/10 rounded-[1.2rem] px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : ''}`} 
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <button type="submit" disabled={isSyncing} className="w-full bg-indigo-600 py-5 rounded-[1.5rem] font-black text-lg hover:bg-indigo-500 transition-all shadow-xl text-white disabled:opacity-50">
                        {isSyncing ? "SYNCING..." : (editingResource ? "UPDATE ASSET" : "PUBLISH TO CLOUD")}
                      </button>
                      {editingResource && (
                        <button 
                          onClick={() => {
                            setEditingResource(null);
                            setFormData({title: '', description: '', type: 'API_KEY', content: '', tags: ''});
                          }} 
                          className="w-full bg-white/5 py-4 rounded-[1.5rem] font-black text-xs text-slate-400 uppercase tracking-widest border border-white/5 hover:bg-white/10"
                        >
                          Discard Changes
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Asset Management List: Right Side */}
                <div className="lg:col-span-7">
                  <div className="glass rounded-[3.5rem] p-10 border-white/5">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-2xl font-black">Active Assets</h3>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{resources.length} Total</span>
                    </div>
                    
                    <div className="space-y-4">
                      {resources.length === 0 ? (
                        <div className="text-center py-20 opacity-30">
                           <p className="text-4xl mb-4">☁️</p>
                           <p className="text-sm font-black uppercase tracking-widest italic">Vault is empty.</p>
                        </div>
                      ) : resources.map(res => (
                        <div key={res.id} className="flex items-center justify-between p-6 bg-white/5 rounded-[1.5rem] border border-white/5 hover:border-indigo-500/20 transition-all group">
                            <div className="flex-1 overflow-hidden mr-4">
                              <div className="flex items-center gap-3 mb-1">
                                <span className={`w-2 h-2 rounded-full ${res.type === 'API_KEY' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'}`}></span>
                                <p className="font-black text-white group-hover:text-indigo-400 transition-colors truncate">{res.title}</p>
                              </div>
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                {res.type.replace('_', ' ')} • {res.createdAt}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleEditClick(res)} 
                                className="p-3 text-indigo-400 bg-indigo-400/5 hover:bg-indigo-400 hover:text-white rounded-xl transition-all"
                                title="Edit Asset"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteResource(res.id)} 
                                className="p-3 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                title="Delete Asset"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto px-6 py-48 text-center animate-in">
              <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-4xl font-black mb-4">Unauthorized Hub</h2>
              <p className="text-slate-500 mb-10 font-bold uppercase tracking-widest text-xs leading-relaxed">Please authenticate via admin access key</p>
              <button onClick={() => setView('login')} className="bg-white text-black px-12 py-5 rounded-3xl text-lg font-black hover:bg-slate-200 transition-all">
                ADMIN LOGIN
              </button>
            </div>
          )
        )}
      </main>

      <footer className={`relative overflow-hidden border-t py-24 px-6 reveal ${theme === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        {/* Floating Background Icons */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-10 left-[15%] text-2xl rotate-12">🎵</div>
          <div className="absolute top-40 right-[25%] text-xl -rotate-12">♪</div>
          <div className="absolute bottom-20 left-[40%] text-3xl rotate-45">♫</div>
          <div className="absolute top-20 right-[10%] text-2xl">🎧</div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20">
                  CD
                </div>
                <span className={`text-3xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Core Devs
                </span>
              </div>
              <p className="text-slate-500 font-medium mb-8 max-w-xs leading-relaxed">
                The ultimate Discord solution and developer asset hub for your server.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.862-1.297 1.197-1.99a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.863-.886.077.077 0 0 1-.008-.128c.125-.094.248-.19.369-.288a.077.077 0 0 1 .081-.01c3.927 1.797 8.18 1.797 12.061 0a.077.077 0 0 1 .081.01c.122.098.245.195.37.288a.077.077 0 0 1-.006.128 12.978 12.978 0 0 1-1.863.886.076.076 0 0 0-.041.106c.335.693.735 1.36 1.197 1.99a.077.077 0 0 0 .084.028 19.83 19.83 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/></svg>
                </a>
              </div>
            </div>

            {/* Bot Column */}
            <div>
              <h4 className="text-indigo-500 font-black uppercase text-sm tracking-widest mb-8">Bot</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Add to Discord</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Vote</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-indigo-500 font-black uppercase text-sm tracking-widest mb-8">Support</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Discord Server</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Report Bug</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-indigo-500 font-black uppercase text-sm tracking-widest mb-8">Legal</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
            <p className="text-slate-600 text-sm font-medium">
              Made with <span className="text-red-500">❤️</span> by mandeep.ly
            </p>
            <div className="flex items-center gap-8">
              {!isAdmin && (
                <button onClick={() => setView('login')} className="text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-500 transition-colors">
                  Admin Portal
                </button>
              )}
              <p className="text-slate-600 text-sm font-medium">
                © 2024 Core Devs. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
