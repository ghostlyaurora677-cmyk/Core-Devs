
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
    <div className="absolute top-[8%] left-[5%] opacity-10">
      <svg className="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4.5 11L12 22L19.5 11L12 2Z M12 6.5L16 11H8L12 6.5Z"/>
      </svg>
    </div>
    <div className="absolute bottom-[15%] right-[5%] opacity-10">
      <svg className="w-24 h-24 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L16.5 6.5L12 11L7.5 6.5L12 2ZM12 13L16.5 17.5L12 22L7.5 17.5L12 13Z"/>
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
  const [selectedCategory, setSelectedCategory] = useState<ResourceType | null>(null);
  const [selectedBot, setSelectedBot] = useState<BotInfo | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

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
    let bgColor = '#0b0e14';

    if (theme === 'light') {
      brandColor = '#5865F2'; bgColor = '#ffffff'; 
    } else if (theme === 'black') {
      brandColor = '#ffffff'; bgColor = '#000000'; 
    }

    root.style.setProperty('--brand-color', brandColor);
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
    setIsNavigating(true);
    setTimeout(() => {
      setView(targetView);
      if (!scrollTarget) window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => {
        setIsNavigating(false);
        if (scrollTarget) {
          document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }, 550); 
  };

  if (!isLoaded) return <LoadingScreen />;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'black' ? 'bg-[#000000] text-white' : theme !== 'light' ? 'bg-[var(--bg-color)] text-white' : 'bg-white text-slate-900'}`}>
      <FloatingIcons />
      
      <div className={`fixed inset-0 pointer-events-none z-0 transition-all duration-1000 ${isNavigating ? 'opacity-30 blur-md' : 'opacity-100'}`}>
        <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] animate-nebula"></div>
      </div>

      <Navbar onNavigate={handleNavigate} currentView={view} theme={theme} setTheme={setTheme} isAdmin={isAdmin} user={user} onLogout={handleLogout} onOpenFeedback={() => setIsFeedbackOpen(true)} />

      <main className={`flex-grow pt-24 relative z-10 transition-all duration-[600ms] ${isNavigating ? 'opacity-0 filter blur-lg' : 'opacity-100'}`}>
        {view === 'admin' ? (
          <AdminPanelView user={user} resources={resources} feedbacks={feedbacks} onAdd={handleAddResource} onUpdate={handleUpdateResource} onDelete={handleDeleteResource} onDeleteFeedback={handleDeleteFeedback} onClearAllFeedback={handleClearAllFeedback} onBack={() => handleNavigate('home')} theme={theme} />
        ) : view === 'login' ? (
          <LoginView onLoginSuccess={handleLoginSuccess} onBack={() => handleNavigate('home')} />
        ) : view === 'home' ? (
          <>
            <section className="px-6 py-32 lg:py-56 text-center relative flex flex-col items-center justify-center min-h-[90vh]">
              <div className="reveal active reveal-down mb-12">
                <div className="inline-flex items-center gap-4 px-10 py-3 bg-[var(--brand-color)]/10 border border-[var(--brand-color)]/30 rounded-full backdrop-blur-2xl">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.7em] text-emerald-400">Global Cluster Online</span>
                </div>
              </div>
              <div className="relative mb-12 reveal active reveal-up">
                <h1 className="text-[14vw] md:text-[12rem] font-black tracking-tighter leading-[0.8] uppercase">
                  CORE <span className="text-[var(--brand-color)]">DEVS</span>
                </h1>
              </div>
              <div className="reveal active reveal-up stagger-1 max-w-4xl mx-auto mb-16 px-6">
                <p className="text-xl md:text-2xl font-medium text-slate-400">
                  Premium Discord Infrastructure. 
                  Access exclusive <span className="text-white font-black">Free Assets</span> synced globally from our core cluster.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 reveal active reveal-up stagger-2">
                <button onClick={() => handleNavigate('resources')} className="group bg-[var(--brand-color)] px-16 py-7 rounded-[2.5rem] font-black text-xs tracking-[0.3em] transition-all hover:scale-105 active:scale-95 text-white uppercase shadow-2xl">
                  The Vault (Free Stuff)
                </button>
                <button onClick={() => { document.getElementById('projects')?.scrollIntoView({behavior:'smooth'}) }} className="px-16 py-7 rounded-[2.5rem] border-2 border-white/10 font-black text-xs tracking-[0.3em] hover:bg-white/5 text-white uppercase">
                  Explore Bots
                </button>
              </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-6">
              <div className="reveal active reveal-up mb-16 text-center">
                 <h2 className="text-5xl font-black uppercase tracking-tight mb-4">Latest <span className="text-[var(--brand-color)]">Free Drops</span></h2>
                 <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Direct from the global database</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.slice(0, 3).map((res, idx) => (
                  <div key={res.id} className={`reveal active reveal-up stagger-${idx+1}`}>
                    <ResourceCard resource={res} theme={theme} />
                  </div>
                ))}
              </div>
            </section>
            
            <section id="projects" className="py-32">
              <div className="max-w-7xl mx-auto px-6 mb-20 text-center lg:text-left">
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white">Our <span className="text-[var(--brand-color)]">Infrastructure</span></h2>
              </div>
              <div className="flex gap-16 overflow-x-auto pb-20 px-6 no-scrollbar snap-x snap-mandatory">
                {BOTS.map((bot) => (
                  <div key={bot.id} className="min-w-[95vw] md:min-w-[1200px] snap-center">
                    <BotCard bot={bot} theme={theme} onViewDetails={(b) => { setSelectedBot(b); handleNavigate('bot-detail'); }} />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : view === 'resources' ? (
          <div className="max-w-7xl mx-auto px-6 py-20 min-h-[70vh]">
            <div className="text-center mb-24 reveal active reveal-down">
               <h1 className="text-7xl font-black uppercase tracking-tighter mb-6 text-white">The <span className="text-[var(--brand-color)]">Vault</span></h1>
               <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Decentralized Storage of Free Developer Assets</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {(['API_KEY', 'CODE_SNIPPET', 'TOOL'] as ResourceType[]).map((type) => (
                  <div key={type} onClick={() => { setSelectedCategory(type); handleNavigate('category-detail'); }} className="reveal active reveal-scale p-20 rounded-[3rem] text-center cursor-pointer transition-all hover:-translate-y-4 glass group">
                    <h3 className="text-3xl font-black uppercase tracking-widest group-hover:text-[var(--brand-color)] text-white">{type.replace('_', ' ')}</h3>
                    <div className="mt-8 text-[9px] font-black text-slate-500 uppercase tracking-widest">Open Cluster</div>
                  </div>
                ))}
            </div>
          </div>
        ) : view === 'category-detail' ? (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <button onClick={() => handleNavigate('resources')} className="mb-12 font-black hover:text-[var(--brand-color)] text-[10px] uppercase tracking-widest flex items-center gap-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              Back to Categories
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.filter(r => r.type === selectedCategory).map((res) => (
                  <div key={res.id} className="reveal active reveal-up">
                    <ResourceCard resource={res} theme={theme} />
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
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} theme={theme} onSubmit={handleAddFeedback} feedbacks={feedbacks} />
    </div>
  );
};

export default App;
