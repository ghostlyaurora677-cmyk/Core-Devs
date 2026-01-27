
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BotCard from './components/BotCard';
import BotDetailView from './components/BotDetailView';
import ResourceCard from './components/ResourceCard';
import LoginView from './components/LoginView';
import AdminPanelView from './components/AdminPanelView';
import NexusAssistant from './components/NexusAssistant';
import TeamView from './components/TeamView';
import Footer from './components/Footer';
import { BOTS, INITIAL_RESOURCES } from './constants';
import { Resource, ResourceType, BotInfo } from './types';
import { databaseService } from './services/databaseService';

const ADMIN_PASSWORD = 'coredevs@2025';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'resources' | 'admin' | 'bot-detail' | 'login' | 'category-detail' | 'team'>('home');
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  if (view === 'team') return <TeamView onBack={() => setView('home')} />;

  const filteredResources = resources.filter(r => r.type === selectedCategory);

  const renderCategoryIcon = (type: ResourceType) => {
    switch(type) {
      case 'API_KEY': return <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;
      case 'CODE_SNIPPET': return <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
      case 'TOOL': return <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-slate-50'} text-white selection:bg-indigo-500 selection:text-white`}>
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
            <section className="px-6 py-32 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[700px] hero-gradient blur-[140px] -z-10 opacity-60 animate-pulse"></div>
              
              <h1 className="reveal active reveal-down text-7xl md:text-[12rem] font-black tracking-tighter mb-6 leading-[0.8] text-white">
                CORE <span className="text-[#5865F2] drop-shadow-[0_0_50px_rgba(88,101,242,0.5)]">DEVS</span>
              </h1>
              
              <p className="reveal active reveal-up stagger-1 max-w-3xl mx-auto text-lg md:text-2xl text-slate-400 mb-14 font-medium leading-relaxed">
                Building the future of <span className="text-white border-b-2 border-indigo-500/30">Discord utilities</span> and providing exclusive free assets for the dev community.
              </p>
              
              <div className="reveal active reveal-scale stagger-2 flex flex-wrap justify-center gap-6">
                <button onClick={() => setView('resources')} className="group bg-[#5865F2] hover:bg-white hover:text-black text-white px-12 py-6 rounded-2xl font-black text-xs tracking-widest transition-all glow shadow-2xl active:scale-95 flex items-center gap-3">
                  ACCESS VAULT
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <a href="#projects" className="px-12 py-6 rounded-2xl font-black text-xs tracking-widest border border-white/10 glass hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 hover:text-white">
                  OUR PROJECTS
                </a>
              </div>
            </section>
            
            <section id="projects" className="px-6 py-24 max-w-7xl mx-auto">
              <div className="reveal reveal-up text-center mb-24">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Our Projects</h2>
                <div className="w-24 h-2 bg-[#5865F2] mx-auto rounded-full shadow-[0_0_15px_rgba(88,101,242,0.5)]"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-12">
                {BOTS.map((bot, index) => (
                  <div key={bot.id} className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                    <BotCard bot={bot} onViewDetails={(b) => { setSelectedBot(b); setView('bot-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                  </div>
                ))}
              </div>
            </section>

            {/* SUPPORT SECTION */}
            <section id="support" className="px-6 py-40 max-w-7xl mx-auto border-t border-white/5 bg-indigo-600/5 rounded-[4rem] mb-24 scroll-mt-24">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="reveal reveal-left">
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter">Support</h2>
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-medium">
                      Need help integrating our bots or accessing the Vault? Our support team and community are available 24/7.
                    </p>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#5865F2] group-hover:text-white transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white font-black uppercase tracking-widest text-xs">Knowledge Base</h4>
                          <p className="text-slate-500 text-sm">Find answers in our documentation</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#5865F2] group-hover:text-white transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white font-black uppercase tracking-widest text-xs">Technical Support</h4>
                          <p className="text-slate-500 text-sm">Direct assistance for developers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="reveal reveal-right glass rounded-[3rem] p-12 border-white/10 text-center flex flex-col items-center">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-[#5865F2] flex items-center justify-center text-white mb-10 shadow-[0_0_50px_rgba(88,101,242,0.4)]">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Official HQ</h3>
                    <p className="text-slate-500 font-bold mb-10 text-sm tracking-widest uppercase">Join the community guild</p>
                    <a href="https://discord.gg" target="_blank" rel="noreferrer" className="w-full py-6 rounded-2xl bg-[#5865F2] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest transition-all glow">
                      Launch Support Guild
                    </a>
                  </div>
               </div>
            </section>
          </>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="reveal reveal-down text-center mb-24">
              <h2 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter uppercase text-white">The Vault</h2>
              <p className="text-indigo-500 font-black uppercase tracking-[0.5em] text-[10px]">Free Premium Assets & Tools</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {(['API_KEY', 'CODE_SNIPPET', 'TOOL'] as ResourceType[]).map((type, idx) => (
                <div 
                  key={type}
                  onClick={() => { setSelectedCategory(type); setView('category-detail'); window.scrollTo({top: 0}); }}
                  className={`reveal reveal-scale stagger-${idx + 1} glass p-16 rounded-3xl text-center cursor-pointer hover:border-[#5865F2]/50 hover:bg-[#5865F2]/5 transition-all hover:-translate-y-4 group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-20 h-20 mx-auto mb-10 text-slate-400 group-hover:scale-110 group-hover:rotate-6 group-hover:text-indigo-400 transition-all duration-500">
                    {renderCategoryIcon(type)}
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-widest text-white group-hover:text-indigo-400 transition-colors">{type.replace('_', ' ')}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'category-detail' && (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <button onClick={() => setView('resources')} className="reveal reveal-left mb-12 text-slate-400 font-bold hover:text-white transition-colors flex items-center gap-3 text-[10px] uppercase tracking-widest group">
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
              Back to Vault
            </button>
            <h2 className="reveal reveal-up text-5xl md:text-8xl font-black mb-20 uppercase tracking-tighter text-white">{selectedCategory?.replace('_', ' ')} Library</h2>
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
