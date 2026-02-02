
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BotCard from './components/BotCard';
import BotDetailView from './components/BotDetailView';
import ResourceCard from './components/ResourceCard';
import LoginView from './components/LoginView';
import AdminPanelView from './components/AdminPanelView';
import TeamView from './components/TeamView';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import NexusAssistant from './components/NexusAssistant';
import { BOTS, INITIAL_RESOURCES, SUPPORT_SERVER_URL } from './constants';
import { Resource, ResourceType, BotInfo } from './types';
import { databaseService } from './services/databaseService';

const ADMIN_PASSWORD = 'coredevs@2025';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'resources' | 'admin' | 'bot-detail' | 'login' | 'category-detail' | 'team'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ResourceType | null>(null);
  const [selectedBot, setSelectedBot] = useState<BotInfo | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      const data = await databaseService.getResources();
      setResources(data || []);
      
      if (sessionStorage.getItem('cd_admin_session') === 'active') {
        setIsAdmin(true);
      }
      
      setIsLoaded(true);
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
    const updatedResources = resources.filter(r => r.id !== id);
    setResources(updatedResources);
    await databaseService.deleteResource(id);
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
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (v: any) => {
    if (v === 'admin') {
      if (isAdmin) {
        setView('admin');
      } else {
        setView('login');
      }
    } else {
      setView(v);
    }
    setSearchQuery(''); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isLoaded) return <LoadingScreen />;

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
  if (view === 'bot-detail' && selectedBot) return <BotDetailView bot={selectedBot} theme={theme} onBack={() => setView('home')} />;
  if (view === 'team') return <TeamView theme={theme} onBack={() => setView('home')} />;

  const filterFn = (res: Resource) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      res.title.toLowerCase().includes(query) ||
      res.description.toLowerCase().includes(query) ||
      res.tags.some(tag => tag.toLowerCase().includes(query))
    );
  };

  const categoryFilteredResources = resources.filter(r => r.type === selectedCategory);
  const searchResults = resources.filter(filterFn);
  const finalFilteredResources = categoryFilteredResources.filter(filterFn);

  const renderCategoryIcon = (type: ResourceType) => {
    switch(type) {
      case 'API_KEY': return <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;
      case 'CODE_SNIPPET': return <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
      case 'TOOL': return <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    }
  }

  const SearchBar = () => (
    <div className="relative max-w-2xl mx-auto mb-16 group reveal active reveal-up">
      <div className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 opacity-20 group-focus-within:opacity-40 bg-[#5865F2]`}></div>
      <div className={`relative flex items-center rounded-2xl border transition-all duration-300 ${theme === 'dark' ? 'glass border-white/10 group-focus-within:border-indigo-500/50' : 'bg-white border-slate-200 group-focus-within:border-indigo-500/50 shadow-lg'}`}>
        <div className="pl-6 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for keys, snippets, or tools..."
          className={`w-full bg-transparent px-4 py-5 text-sm outline-none font-medium ${theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="pr-6 text-slate-400 hover:text-indigo-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'} selection:bg-indigo-500 selection:text-white`}>
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
              
              <h1 className={`reveal active reveal-down text-7xl md:text-[12rem] font-black tracking-tighter mb-6 leading-[0.8] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                CORE <span className="text-[#5865F2] drop-shadow-[0_0_50px_rgba(88,101,242,0.5)]">DEVS</span>
              </h1>
              
              <p className={`reveal active reveal-up stagger-1 max-w-3xl mx-auto text-lg md:text-2xl mb-14 font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Building the future of <span className={`border-b-2 ${theme === 'dark' ? 'text-white border-indigo-500/30' : 'text-indigo-600 border-indigo-500/10'}`}>Discord utilities</span> and providing exclusive free assets for the dev community.
              </p>
              
              <div className="reveal active reveal-scale stagger-2 flex flex-wrap justify-center gap-6">
                <button onClick={() => setView('resources')} className="group bg-[#5865F2] hover:bg-white hover:text-black text-white px-12 py-6 rounded-2xl font-black text-xs tracking-widest transition-all glow shadow-2xl active:scale-95 flex items-center gap-3">
                  ACCESS VAULT
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <a href="#projects" className={`px-12 py-6 rounded-2xl font-black text-xs tracking-widest border transition-all ${theme === 'dark' ? 'border-white/10 glass text-slate-300 hover:text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                  OUR PROJECTS
                </a>
              </div>
            </section>
            
            <section id="projects" className="px-6 py-24 max-w-7xl mx-auto">
              <div className="reveal reveal-up text-center mb-24">
                <h2 className={`text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Our Projects</h2>
                <div className="w-24 h-2 bg-[#5865F2] mx-auto rounded-full shadow-[0_0_15px_rgba(88,101,242,0.5)]"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-12">
                {BOTS.map((bot, index) => (
                  <div key={bot.id} className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                    <BotCard bot={bot} theme={theme} onViewDetails={(b) => { setSelectedBot(b); setView('bot-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                  </div>
                ))}
              </div>
            </section>

            <section id="support" className={`px-6 py-40 max-w-7xl mx-auto border-t transition-colors duration-500 rounded-[4rem] mb-24 scroll-mt-24 ${theme === 'dark' ? 'border-white/5 bg-indigo-600/5' : 'border-slate-200 bg-indigo-50'}`}>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="reveal reveal-left">
                    <h2 className={`text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Support</h2>
                    <p className={`text-lg md:text-xl leading-relaxed mb-12 font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Need help integrating our bots or accessing the Vault? Our support team and community are available 24/7.
                    </p>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6 group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-600 shadow-sm'} group-hover:bg-[#5865F2] group-hover:text-white`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={`font-black uppercase tracking-widest text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Knowledge Base</h4>
                          <p className="text-slate-500 text-sm">Find answers in our documentation</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-600 shadow-sm'} group-hover:bg-[#5865F2] group-hover:text-white`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                          <h4 className={`font-black uppercase tracking-widest text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Technical Support</h4>
                          <p className="text-slate-500 text-sm">Direct assistance for developers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`reveal reveal-right rounded-[3rem] p-12 border text-center flex flex-col items-center transition-all ${theme === 'dark' ? 'glass border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
                    <div className="w-24 h-24 rounded-[2.5rem] bg-[#5865F2] flex items-center justify-center text-white mb-10 shadow-[0_0_50px_rgba(88,101,242,0.4)]">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                      </svg>
                    </div>
                    <h3 className={`text-3xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Official HQ</h3>
                    <p className="text-slate-500 font-bold mb-10 text-sm tracking-widest uppercase">Join the community guild</p>
                    <a href={SUPPORT_SERVER_URL} target="_blank" rel="noreferrer" className="w-full py-6 rounded-2xl bg-[#5865F2] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest transition-all glow">
                      Launch Support Guild
                    </a>
                  </div>
               </div>
            </section>
          </>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="reveal active reveal-down text-center mb-16">
              <h2 className={`text-6xl md:text-9xl font-black mb-6 tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>The Vault</h2>
              <p className="text-indigo-500 font-black uppercase tracking-[0.5em] text-[10px]">Free Premium Assets & Tools</p>
            </div>

            <SearchBar />
            
            {!searchQuery ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {(['API_KEY', 'CODE_SNIPPET', 'TOOL'] as ResourceType[]).map((type, idx) => (
                  <div 
                    key={type}
                    onClick={() => { setSelectedCategory(type); setView('category-detail'); window.scrollTo({top: 0}); }}
                    className={`reveal active reveal-scale stagger-${idx + 1} p-16 rounded-3xl text-center cursor-pointer transition-all hover:-translate-y-4 group relative overflow-hidden ${theme === 'dark' ? 'glass hover:border-[#5865F2]/50 hover:bg-[#5865F2]/5' : 'bg-white border border-slate-200 shadow-lg hover:shadow-2xl hover:border-indigo-500/20'}`}
                  >
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`w-20 h-20 mx-auto mb-10 group-hover:scale-110 group-hover:rotate-6 group-hover:text-indigo-400 transition-all duration-500 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-300'}`}>
                      {renderCategoryIcon(type)}
                    </div>
                    <h3 className={`text-3xl font-black uppercase tracking-widest group-hover:text-indigo-400 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{type.replace('_', ' ')}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-widest">Search Results ({searchResults.length})</h3>
                </div>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searchResults.map((res, idx) => (
                      <div key={res.id} className={`reveal active reveal-scale stagger-${(idx % 3) + 1}`}>
                        <ResourceCard resource={res} theme={theme} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 opacity-30">
                    <p className="text-2xl font-black uppercase tracking-widest">No assets match your search</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {view === 'category-detail' && (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <button onClick={() => { setView('resources'); setSearchQuery(''); }} className={`reveal active reveal-left font-bold hover:text-indigo-500 transition-colors flex items-center gap-3 text-[10px] uppercase tracking-widest group ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:-translate-x-1 transition-transform ${theme === 'dark' ? 'glass' : 'bg-white shadow-sm border border-slate-200'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </div>
                Back to Vault
              </button>
              <h2 className={`reveal active reveal-up text-5xl md:text-8xl font-black uppercase tracking-tighter text-right ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{selectedCategory?.replace('_', ' ')}</h2>
            </div>

            <SearchBar />

            {finalFilteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {finalFilteredResources.map((res, idx) => (
                  <div key={res.id} className={`reveal active reveal-scale stagger-${(idx % 3) + 1}`}>
                    <ResourceCard resource={res} theme={theme} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 opacity-30">
                <p className="text-2xl font-black uppercase tracking-widest">No matching results in this library</p>
              </div>
            )}
          </div>
        )}
      </main>

      <NexusAssistant />
      <Footer onNavigate={handleNavigate} theme={theme} />
    </div>
  );
};

export default App;
