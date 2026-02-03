
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
    <div className="absolute top-[8%] left-[5%] pulse-soft scale-125 blur-[1px]">
      <svg className="w-16 h-16 text-fuchsia-500/20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4.5 11L12 22L19.5 11L12 2Z M12 6.5L16 11H8L12 6.5Z"/>
      </svg>
    </div>
    <div className="absolute top-[15%] right-[5%] float-alt scale-110 blur-[2px]">
      <svg className="w-14 h-14 text-pink-400/15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L16.5 6.5L12 11L7.5 6.5L12 2ZM12 13L16.5 17.5L12 22L7.5 17.5L12 13Z"/>
      </svg>
    </div>
    <div className="absolute top-[30%] left-[10%] spin-slow opacity-[0.04] blur-[3px]">
      <svg className="w-14 h-14 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.97 0c-2.38 0-2.22 1.02-2.22 1.02l.02 1.05h4.48v.63H8.05l-1.63.02C4.12 2.72 4 4.53 4 4.53L4 7.2h2.23V4.86c0-1.1 1.05-1.2 1.24-1.2h4.5c1.24 0 1.25 1.23 1.25 1.23v2.85h-3.32v.63h4.58s2.3-.08 2.3-2.22c0-2.13-1.83-2.13-1.83-2.13l-.97.02c-1.02 0-2 .01-2.01-4.01zm-5.4 3.7c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM11.97 24c2.38 0 2.22-1.02 2.22-1.02l-.02-1.05h-4.48v-.63h6.21l1.63-.02c2.3-.02 2.42-1.83 2.42-1.83L20 16.8h-2.23v2.34c0 1.1-1.05 1.2-1.24 1.2h-4.5c-1.24 0-1.25-1.23-1.25-1.23V16.3h3.32v-.63H9.52s-2.3.08-2.3 2.22c0 2.13 1.83 2.13 1.83 2.13l.97-.02c1.02 0 2-.01 2.01 4.01zm5.4-3.7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45-1 1-1z"/>
      </svg>
    </div>
    <div className="absolute top-[48%] right-[3%] float-slow opacity-[0.03] blur-[4px]">
      <svg className="w-14 h-14 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      </svg>
    </div>
  </div>
);

type AppView = 'home' | 'resources' | 'admin' | 'bot-detail' | 'login' | 'category-detail' | 'team';

const VIEW_ORDER: Record<string, number> = {
  'home': 0,
  'resources': 1,
  'category-detail': 1.5,
  'team': 2,
  'bot-detail': 3,
  'admin': 10,
  'login': 11
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [isNavigating, setIsNavigating] = useState(false);
  const [navDirection, setNavDirection] = useState<'up' | 'down'>('down');
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

  const syncLatestData = async () => {
    const resData = await databaseService.getResources();
    const feedData = await databaseService.getFeedbacks();
    setResources(resData || []);
    setFeedbacks(feedData || []);
  };

  useEffect(() => {
    async function init() {
      await syncLatestData();
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
      case 'light':
        brandColor = '#5865F2'; 
        brandGlow = 'rgba(88, 101, 242, 0.2)'; 
        bgColor = '#ffffff'; 
        break;
      case 'black':
        brandColor = '#ffffff'; 
        brandGlow = 'rgba(255, 255, 255, 0.3)'; 
        bgColor = '#000000'; 
        break;
      case 'dark':
      default:
        brandColor = '#5865F2'; 
        brandGlow = 'rgba(88, 101, 242, 0.4)'; 
        bgColor = '#0b0e14'; 
        break;
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
    handleNavigate('admin', undefined, true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setUser(null);
    sessionStorage.removeItem('cd_user_session');
    handleNavigate('home');
  };

  const handleNavigate = (targetView: AppView, scrollTarget?: string, forceAdmin: boolean = false) => {
    if (targetView === 'admin' && !isAdmin && !forceAdmin) {
      handleNavigate('login');
      return;
    }

    // Force data sync when visiting Vault or Admin
    if (targetView === 'resources' || targetView === 'admin') {
      syncLatestData();
    }

    const currentIndex = VIEW_ORDER[view] || 0;
    const targetIndex = VIEW_ORDER[targetView] || 0;
    setNavDirection(targetIndex >= currentIndex ? 'down' : 'up');

    setIsNavigating(true);
    
    setTimeout(() => {
      setView(targetView);
      if (!scrollTarget) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
      
      setTimeout(() => {
        setIsNavigating(false);
        if (scrollTarget) {
          setTimeout(() => {
            const el = document.getElementById(scrollTarget);
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }, 50);
    }, 550); 
  };

  if (!isLoaded) return <LoadingScreen />;

  if (view === 'login') return <LoginView onLoginSuccess={handleLoginSuccess} onBack={() => handleNavigate('home')} />;
  
  const transitionTransform = isNavigating 
    ? (navDirection === 'down' ? 'translateY(-20vh) scale(0.9) rotateX(2deg)' : 'translateY(20vh) scale(0.9) rotateX(-2deg)')
    : 'translateY(0) scale(1) rotateX(0deg)';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'black' ? 'bg-[#000000] text-white' : theme !== 'light' ? 'bg-[var(--bg-color)] text-white' : 'bg-white text-slate-900'} selection:bg-[var(--brand-color)] selection:text-white perspective-1000`}>
      <FloatingIcons />
      
      <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000 ease-out ${isNavigating ? 'scale-110 opacity-30 blur-md' : 'scale-100 opacity-100 blur-0'}`}>
        <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] animate-nebula"></div>
        <div className="absolute bottom-[20%] right-[30%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] animate-nebula" style={{ animationDelay: '-10s' }}></div>
      </div>

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

      <div className={`fixed inset-0 z-[65] pointer-events-none transition-all duration-700 ease-in-out ${isNavigating ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-0'}`}>
         <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-[var(--brand-color)]/10 to-black/0"></div>
      </div>

      <main 
        key={view}
        className={`flex-grow pt-24 relative z-10 will-change-[transform,opacity,filter] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${isNavigating ? 'opacity-0 filter blur-lg' : 'opacity-100 filter blur-0'}`}
        style={{ transform: transitionTransform }}
      >
        {view === 'admin' ? (
          <AdminPanelView 
            user={user}
            resources={resources} 
            feedbacks={feedbacks}
            onAdd={handleAddResource} 
            onUpdate={handleUpdateResource} 
            onDelete={handleDeleteResource} 
            onDeleteFeedback={handleDeleteFeedback}
            onClearAllFeedback={handleClearAllFeedback}
            onBack={() => handleNavigate('home')} 
            theme={theme}
          />
        ) : view === 'home' ? (
          <>
            <section className="px-6 py-32 lg:py-56 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[100vh]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1000px] hero-gradient blur-[180px] -z-10 opacity-60 animate-pulse"></div>
              <div className="reveal active reveal-down mb-12 md:mb-16">
                <div className="inline-flex items-center gap-4 px-10 py-3 bg-[var(--brand-color)]/10 border border-[var(--brand-color)]/30 rounded-full backdrop-blur-2xl shadow-2xl scale-90 md:scale-100 group transition-all hover:bg-[var(--brand-color)]/20 hover:border-[var(--brand-color)]/50">
                   <div className="w-2 h-2 rounded-full bg-[var(--brand-color)] animate-ping"></div>
                   <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.7em] text-[var(--brand-color)] pl-1">Next-Gen Infrastructure</span>
                </div>
              </div>
              <div className="relative mb-12 md:mb-16 reveal active reveal-scale stagger-1">
                <h1 className="text-[16vw] md:text-[13rem] lg:text-[16rem] font-black tracking-tighter leading-[0.8] uppercase drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]">
                  CORE <span className="text-[var(--brand-color)] drop-shadow-[0_0_120px_var(--brand-glow)]">DEVS</span>
                </h1>
              </div>
              <div className="reveal active reveal-up stagger-2 max-w-3xl lg:max-w-4xl mx-auto mb-16 md:mb-24 px-6">
                <p className={`text-xl md:text-2xl lg:text-3xl font-medium leading-[1.3] tracking-tight text-slate-400 drop-shadow-sm`}>
                  Architecting the future of <span className={`${theme === 'light' ? 'text-slate-900' : 'text-white'} relative inline-block group font-bold`}>
                    Discord ecosystems
                    <span className="absolute bottom-1 left-0 w-full h-[2px] bg-[var(--brand-color)]/60 group-hover:h-2 transition-all"></span>
                  </span> and providing exclusive free assets for the world's most <span className={`${theme === 'light' ? 'text-slate-900' : 'text-white'} italic font-bold`}>ambitious developers</span>.
                </p>
              </div>
              <div className="reveal active reveal-scale stagger-3 flex flex-col sm:flex-row justify-center gap-6 md:gap-8 w-full max-w-md md:max-w-none">
                <button 
                  onClick={() => handleNavigate('resources')} 
                  className={`group bg-[var(--brand-color)] hover:bg-white hover:text-black px-14 py-7 md:px-20 md:py-8 rounded-[2.5rem] font-black text-[11px] md:text-xs tracking-[0.25em] transition-all glow shadow-2xl active:scale-95 flex items-center justify-center gap-5 hover:shadow-[0_0_80px_var(--brand-glow)] uppercase ${theme === 'black' ? 'text-black' : 'text-white'}`}
                >
                  ACCESS THE VAULT
                  <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('projects');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-14 py-7 md:px-20 md:py-8 rounded-[2.5rem] border-2 font-black text-[11px] md:text-xs tracking-[0.25em] transition-all active:scale-95 uppercase ${theme !== 'light' ? 'bg-white/5 border-white/10 text-white hover:bg-white hover:text-black hover:border-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'}`}
                >
                  VIEW PROJECTS
                </button>
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
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-16 overflow-x-auto pb-32 px-6 md:px-[calc(50vw-650px)] no-scrollbar snap-x snap-mandatory scroll-smooth"
                >
                  {BOTS.map((bot) => (
                    <div key={bot.id} className="min-w-[95vw] md:min-w-[1300px] snap-center">
                      <BotCard bot={bot} theme={theme} onViewDetails={(b) => { setSelectedBot(b); handleNavigate('bot-detail'); }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : view === 'resources' ? (
          <div className="max-w-7xl mx-auto px-6 py-20 min-h-[70vh]">
            <div className="text-center mb-24 reveal active reveal-down">
               <h1 className={`text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>The <span className="text-[var(--brand-color)]">Vault</span></h1>
               <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Exposing the architecture of Core Devs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {(['API_KEY', 'CODE_SNIPPET', 'TOOL'] as ResourceType[]).map((type, idx) => (
                  <div 
                    key={type} 
                    onClick={() => { setSelectedCategory(type); handleNavigate('category-detail'); }} 
                    className={`reveal active reveal-scale stagger-${idx+1} p-20 rounded-[3rem] text-center cursor-pointer transition-all hover:-translate-y-4 glass group relative overflow-hidden`}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--brand-color)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className={`text-3xl font-black uppercase tracking-widest group-hover:text-[var(--brand-color)] transition-colors relative z-10 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{type.replace('_', ' ')}</h3>
                    <div className="mt-8 text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Access Archive</div>
                  </div>
                ))}
            </div>
          </div>
        ) : view === 'category-detail' ? (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <button onClick={() => handleNavigate('resources')} className={`mb-12 font-bold hover:text-[var(--brand-color)] transition-colors flex items-center gap-3 text-[10px] uppercase tracking-widest group ${theme === 'light' ? 'text-slate-600' : 'text-white'}`}>
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:-translate-x-1 transition-transform border ${theme !== 'light' ? 'glass border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               </div>
               Back to Categories
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.filter(r => r.type === selectedCategory).map((res, idx) => (
                  <div key={res.id} className={`reveal active reveal-up stagger-${(idx % 3) + 1}`}>
                    <ResourceCard 
                      resource={res} 
                      theme={theme} 
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : view === 'bot-detail' && selectedBot ? (
          <BotDetailView bot={selectedBot} theme={theme} onBack={() => handleNavigate('home')} />
        ) : view === 'team' ? (
          <TeamView theme={theme} onBack={() => handleNavigate('home')} />
        ) : null}
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
