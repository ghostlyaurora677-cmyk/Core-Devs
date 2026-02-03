
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import BotCard from './components/BotCard';
import BotDetailView from './components/BotDetailView';
import ResourceCard from './components/ResourceCard';
import LoginView from './components/LoginView';
import AdminPanelView from './components/AdminPanelView';
import TeamView from './components/TeamView';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import FeedbackModal from './components/FeedbackModal';
import { BOTS, INITIAL_RESOURCES, SUPPORT_SERVER_URL } from './constants';
import { Resource, ResourceType, BotInfo, ThemeType, Feedback, User } from './types';
import { databaseService } from './services/databaseService';

const FloatingIcons = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
    {/* Discord Logo - Top Left */}
    <div className="absolute top-[12%] left-[8%] drifting opacity-[0.05] blur-[3px] scale-125" style={{ animationDuration: '22s' }}>
      <svg className="w-24 h-24 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
    </div>

    {/* Nitro Gem - Top Right */}
    <div className="absolute top-[15%] right-[10%] drifting opacity-[0.06] blur-[2px]" style={{ animationDuration: '18s', animationDelay: '-5s' }}>
      <svg className="w-16 h-16 text-fuchsia-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4.5 11L12 22L19.5 11L12 2Z M12 6.5L16 11H8L12 6.5Z"/>
      </svg>
    </div>

    {/* Server Boost Diamond - Mid Right */}
    <div className="absolute top-[40%] right-[15%] drifting opacity-[0.04] blur-[4px]" style={{ animationDuration: '25s', animationDelay: '-2s' }}>
      <svg className="w-20 h-20 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L16.5 6.5L12 11L7.5 6.5L12 2ZM12 13L16.5 17.5L12 22L7.5 17.5L12 13Z"/>
      </svg>
    </div>

    {/* Hype Squad Icon - Mid Left */}
    <div className="absolute top-[35%] left-[15%] drifting opacity-[0.03] blur-[5px]" style={{ animationDuration: '28s', animationDelay: '-12s' }}>
      <svg className="w-14 h-14 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 12l10 10 10-10L12 2zm0 4l6 6-6 6-6-6 6-6z"/>
      </svg>
    </div>

    {/* Thinking Emoji - Bottom Center Left */}
    <div className="absolute bottom-[20%] left-[25%] drifting opacity-[0.02] blur-[6px]" style={{ animationDuration: '30s', animationDelay: '-8s' }}>
      <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-9.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm-5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm6 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
      </svg>
    </div>

    {/* Sparkle - Scattered Top Right */}
    <div className="absolute top-[25%] right-[25%] drifting opacity-[0.05] blur-[1px]" style={{ animationDuration: '12s', animationDelay: '-1s' }}>
      <svg className="w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L14 8L21 10L14 12L12 19L10 12L3 10L10 8L12 1Z"/>
      </svg>
    </div>

    {/* Heart Emoji - Bottom Right */}
    <div className="absolute bottom-[15%] right-[8%] drifting opacity-[0.03] blur-[4px]" style={{ animationDuration: '20s', animationDelay: '-15s' }}>
      <svg className="w-16 h-16 text-red-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>

    {/* Wave Emoji - Bottom Left */}
    <div className="absolute bottom-[12%] left-[10%] drifting opacity-[0.04] blur-[3px]" style={{ animationDuration: '24s', animationDelay: '-4s' }}>
      <svg className="w-12 h-12 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-15-1.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm10 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm-5 8.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
      </svg>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'resources' | 'admin' | 'bot-detail' | 'login' | 'category-detail' | 'team'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ResourceType | null>(null);
  const [selectedBot, setSelectedBot] = useState<BotInfo | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const resData = await databaseService.getResources();
      const feedData = await databaseService.getFeedbacks();
      setResources(resData || []);
      setFeedbacks(feedData || []);
      
      const sessionUser = sessionStorage.getItem('cd_user_session');
      if (sessionUser) {
        const parsedUser = JSON.parse(sessionUser) as User;
        setUser(parsedUser);
        setIsAdmin(parsedUser.isAdmin);
      }
      setIsLoaded(true);
    }
    init();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let brandColor = '#5865F2';
    let brandGlow = 'rgba(88, 101, 242, 0.4)';
    let bgColor = '#0b0e14';

    switch (theme) {
      case 'light': brandColor = '#4f46e5'; brandGlow = 'rgba(79, 70, 229, 0.2)'; bgColor = '#f8fafc'; break;
      case 'magenta': brandColor = '#ff00ff'; brandGlow = 'rgba(255, 0, 255, 0.4)'; break;
      case 'lime': brandColor = '#a3e635'; brandGlow = 'rgba(163, 230, 53, 0.4)'; break;
      case 'red': brandColor = '#f43f5e'; brandGlow = 'rgba(244, 63, 94, 0.4)'; break;
      case 'black': brandColor = '#ffffff'; brandGlow = 'rgba(255, 255, 255, 0.4)'; bgColor = '#000000'; break;
    }

    root.style.setProperty('--brand-color', brandColor);
    root.style.setProperty('--brand-glow', brandGlow);
    root.style.setProperty('--bg-color', bgColor);
  }, [theme]);

  const handleAddResource = async (res: Resource) => {
    setResources(prev => [res, ...prev]);
    await databaseService.addResource(res);
  };

  const handleUpdateResource = async (res: Resource) => {
    setResources(prev => prev.map(r => r.id === res.id ? res : r));
    await databaseService.updateResource(res);
  };

  const handleDeleteResource = async (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    await databaseService.deleteResource(id);
  };

  const handleAddFeedback = async (f: Feedback) => {
    setFeedbacks(prev => [f, ...prev]);
    await databaseService.addFeedback(f);
  };

  const handleDeleteFeedback = async (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
    await databaseService.deleteFeedback(id);
  };

  const handleClearAllFeedback = async () => {
    setFeedbacks([]);
    await databaseService.clearAllFeedback();
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAdmin(loggedInUser.isAdmin);
    sessionStorage.setItem('cd_user_session', JSON.stringify(loggedInUser));
    if (loggedInUser.isAdmin) {
      setView('admin');
    } else {
      setView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setUser(null);
    sessionStorage.removeItem('cd_user_session');
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (v: any) => {
    if (v === 'admin' && !isAdmin) {
      setView('login');
    } else {
      setView(v);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollProjects = (direction: 'next' | 'back') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth * 0.7;
      scrollContainerRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!isLoaded) return <LoadingScreen />;

  if (view === 'login') return <LoginView onLoginSuccess={handleLoginSuccess} onBack={() => setView('home')} />;
  
  if (view === 'admin' && isAdmin) return (
    <AdminPanelView 
      user={user}
      resources={resources} 
      feedbacks={feedbacks}
      onAdd={handleAddResource} 
      onUpdate={handleUpdateResource} 
      onDelete={handleDeleteResource} 
      onDeleteFeedback={handleDeleteFeedback}
      onClearAllFeedback={handleClearAllFeedback}
      onBack={() => setView('home')} 
    />
  );

  if (view === 'bot-detail' && selectedBot) return <BotDetailView bot={selectedBot} theme={theme} onBack={() => setView('home')} />;
  if (view === 'team') return <TeamView theme={theme} onBack={() => setView('home')} />;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'black' ? 'bg-[#000000] text-white' : theme !== 'light' ? 'bg-[var(--bg-color)] text-white' : 'bg-slate-50 text-slate-900'} selection:bg-[var(--brand-color)] selection:text-white`}>
      <FloatingIcons />
      <Navbar 
        onNavigate={handleNavigate} 
        currentView={view} 
        theme={theme} 
        setTheme={setTheme} 
        isAdmin={isAdmin}
        user={user}
        onLogout={handleLogout}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      <main className="flex-grow pt-24 fade-in relative z-10">
        {view === 'home' && (
          <>
            <section className="px-6 py-40 md:py-60 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[95vh]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[900px] hero-gradient blur-[180px] -z-10 opacity-70 animate-pulse"></div>
              
              <div className="relative mb-14 reveal active reveal-down">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-8 py-3 bg-[var(--brand-color)]/10 border border-[var(--brand-color)]/30 rounded-full backdrop-blur-xl shadow-2xl scale-90 md:scale-100">
                   <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[var(--brand-color)]">Next-Gen Infrastructure</span>
                </div>
                <h1 className="text-8xl md:text-[16rem] font-black tracking-tighter leading-[0.7] uppercase drop-shadow-2xl">
                  CORE <span className="text-[var(--brand-color)] drop-shadow-[0_0_80px_var(--brand-glow)]">DEVS</span>
                </h1>
              </div>

              <p className="reveal active reveal-up stagger-1 max-w-4xl mx-auto text-2xl md:text-4xl mb-20 font-medium leading-tight tracking-tighter text-slate-400">
                Architecting the future of <span className="text-white border-b-4 border-[var(--brand-color)]/30">Discord ecosystems</span> and providing exclusive free assets for developers.
              </p>
              
              <div className="reveal active reveal-scale stagger-2 flex flex-wrap justify-center gap-10">
                <button 
                  onClick={() => setView('resources')} 
                  className="group bg-[var(--brand-color)] hover:bg-white hover:text-black px-16 py-8 rounded-[2.5rem] font-black text-sm tracking-[0.2em] transition-all glow shadow-2xl active:scale-95 flex items-center gap-5 hover:shadow-[0_0_60px_var(--brand-glow)]"
                >
                  ACCESS THE VAULT
                  <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('projects');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-16 py-8 rounded-[2.5rem] border-2 font-black text-sm tracking-[0.2em] transition-all active:scale-95 ${theme !== 'light' ? 'bg-white/5 border-white/10 text-white hover:bg-white hover:text-black hover:border-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'}`}
                >
                  VIEW PROJECTS
                </button>
              </div>

              <div className="mt-32 flex items-center gap-12 opacity-50 grayscale reveal active reveal-up stagger-3">
                 <div className="flex flex-col items-center">
                    <span className="text-4xl font-black mb-1">99.9%</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Service Uptime</span>
                 </div>
                 <div className="w-px h-12 bg-white/20"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-4xl font-black mb-1">120k+</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Global Users</span>
                 </div>
                 <div className="w-px h-12 bg-white/20"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-4xl font-black mb-1">REALTIME</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Node Monitoring</span>
                 </div>
              </div>
            </section>
            
            <section id="projects" className="relative py-40 max-w-[100vw]">
              <div className="max-w-7xl mx-auto px-6 mb-20">
                <div className="reveal active reveal-left flex flex-col md:flex-row md:items-end justify-between gap-10">
                  <div>
                    <h2 className={`text-6xl md:text-[10rem] font-black uppercase tracking-tighter leading-none ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>The <span className="text-[var(--brand-color)]">Projects</span></h2>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.5em] mt-8">Engineering stable, high-performance discord gateways</p>
                  </div>
                </div>
              </div>

              <div className="relative group/scroll">
                <button 
                  onClick={() => scrollProjects('back')} 
                  className={`absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 w-24 h-24 rounded-[3rem] glass border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100 active:scale-90 hover:bg-[var(--brand-color)] hover:border-[var(--brand-color)] group/btn shadow-2xl ${theme === 'light' ? 'bg-white border-slate-200 shadow-2xl' : ''}`}
                >
                  <svg className={`w-12 h-12 transition-colors ${theme !== 'light' ? 'text-slate-400 group-hover/btn:text-white' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <button 
                  onClick={() => scrollProjects('next')} 
                  className={`absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 w-24 h-24 rounded-[3rem] glass border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100 active:scale-90 hover:bg-[var(--brand-color)] hover:border-[var(--brand-color)] group/btn shadow-2xl ${theme === 'light' ? 'bg-white border-slate-200 shadow-2xl' : ''}`}
                >
                  <svg className={`w-12 h-12 transition-colors ${theme !== 'light' ? 'text-slate-400 group-hover/btn:text-white' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>

                <div 
                  ref={scrollContainerRef}
                  className="flex gap-16 overflow-x-auto pb-32 px-6 md:px-[calc(50vw-650px)] no-scrollbar snap-x snap-mandatory scroll-smooth"
                >
                  {BOTS.map((bot) => (
                    <div key={bot.id} className="min-w-[95vw] md:min-w-[1300px] snap-center">
                      <BotCard bot={bot} theme={theme} onViewDetails={(b) => { setSelectedBot(b); setView('bot-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="support" className="px-6 py-40 max-w-7xl mx-auto relative overflow-hidden reveal active reveal-up">
              <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[var(--brand-color)]/10 blur-[200px] rounded-full -z-10 animate-pulse"></div>
              <div className={`glass p-20 md:p-40 rounded-[6rem] text-center border relative overflow-hidden group transition-all duration-1000 hover:shadow-[0_0_120px_var(--brand-glow)] ${theme !== 'light' ? 'border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--brand-color)] to-transparent opacity-80"></div>
                <h2 className={`text-7xl md:text-[12rem] font-black mb-12 tracking-tighter uppercase leading-[0.8] ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>Need <span className="text-[var(--brand-color)]">Support?</span></h2>
                <p className="text-slate-500 max-w-5xl mx-auto text-2xl md:text-4xl font-medium mb-24 leading-tight tracking-tight">Our elite engineering core is on standby 24/7 to ensure your systems remain unbreakable.</p>
                <div className="flex flex-wrap justify-center gap-12">
                  <a href={SUPPORT_SERVER_URL} target="_blank" rel="noreferrer" className="group px-20 py-10 rounded-[3rem] bg-[var(--brand-color)] text-white font-black text-sm tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-[0_30px_70px_var(--brand-glow)] active:scale-95 flex items-center gap-6">
                    JOIN SUPPORT HQ
                    <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </a>
                  <button onClick={() => setIsFeedbackOpen(true)} className={`px-20 py-10 rounded-[3rem] border-2 font-black text-sm tracking-[0.4em] uppercase transition-all active:scale-95 ${theme !== 'light' ? 'border-white/10 hover:bg-white hover:text-black hover:border-white' : 'border-slate-200 hover:bg-slate-900 hover:text-white shadow-xl'}`}>OPEN FEEDBACK HUB</button>
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {(['API_KEY', 'CODE_SNIPPET', 'TOOL'] as ResourceType[]).map((type) => (
                  <div key={type} onClick={() => { setSelectedCategory(type); setView('category-detail'); window.scrollTo({top: 0}); }} className="reveal active reveal-scale p-16 rounded-3xl text-center cursor-pointer transition-all hover:-translate-y-4 glass group">
                    <h3 className="text-3xl font-black uppercase tracking-widest group-hover:text-[var(--brand-color)] transition-colors">{type.replace('_', ' ')}</h3>
                  </div>
                ))}
            </div>
          </div>
        )}

        {view === 'category-detail' && (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.filter(r => r.type === selectedCategory).map((res) => (
                  <ResourceCard 
                    key={res.id} 
                    resource={res} 
                    theme={theme} 
                    user={user} 
                    onLoginRequest={() => setView('login')} 
                  />
                ))}
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} theme={theme} onOpenFeedback={() => setIsFeedbackOpen(true)} />
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        theme={theme} 
        onSubmit={handleAddFeedback}
        feedbacks={feedbacks}
      />
    </div>
  );
};

export default App;
