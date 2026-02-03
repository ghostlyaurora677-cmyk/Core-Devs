
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
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-[8%] left-[3%] drifting opacity-[0.05] blur-[6px] scale-110" style={{ animationDuration: '18s' }}>
      <svg className="w-28 h-28 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
    </div>
    <div className="absolute top-[6%] right-[5%] drifting opacity-[0.07] blur-[2px]" style={{ animationDuration: '22s', animationDelay: '-2s' }}>
      <svg className="w-24 h-24 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 6.5L17.5 5L19 3.5L20.5 5L19 6.5ZM19 21L17.5 19.5L19 18L20.5 19.5L19 21ZM6.5 19L5 17.5L6.5 16L8 17.5L6.5 19ZM12 18L9 12L3 9L9 6L12 0L15 6L21 9L15 12L12 18Z"/>
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
    setView('home');
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
            <section className="px-6 py-32 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[700px] hero-gradient blur-[140px] -z-10 opacity-60 animate-pulse"></div>
              <h1 className="reveal active reveal-down text-7xl md:text-[12rem] font-black tracking-tighter mb-6 leading-[0.8]">CORE <span className="text-[var(--brand-color)] drop-shadow-[0_0_50px_var(--brand-glow)]">DEVS</span></h1>
              <p className="reveal active reveal-up stagger-1 max-w-3xl mx-auto text-lg md:text-2xl mb-14 font-medium leading-relaxed">Building the future of <span className="border-b-2 border-[var(--brand-color)]/30">Discord utilities</span> and providing exclusive free assets for the dev community.</p>
              <div className="reveal active reveal-scale stagger-2 flex flex-wrap justify-center gap-6">
                <button onClick={() => setView('resources')} className="group bg-[var(--brand-color)] hover:bg-white hover:text-black px-12 py-6 rounded-2xl font-black text-xs tracking-widest transition-all glow shadow-2xl active:scale-95 flex items-center gap-3">ACCESS VAULT</button>
              </div>
            </section>
            
            <section id="projects" className="relative py-24 max-w-[100vw]">
              <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="reveal active reveal-left">
                  <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>Our <span className="text-[var(--brand-color)]">Projects</span></h2>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-3">Innovative Discord Solutions</p>
                </div>
              </div>

              <div className="relative group/scroll">
                <button 
                  onClick={() => scrollProjects('back')} 
                  className={`absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full glass border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100 active:scale-90 hover:bg-[var(--brand-color)] hover:border-[var(--brand-color)] group/btn shadow-2xl ${theme === 'light' ? 'bg-white border-slate-200' : ''}`}
                >
                  <svg className={`w-8 h-8 transition-colors ${theme !== 'light' ? 'text-slate-400 group-hover/btn:text-white' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <button 
                  onClick={() => scrollProjects('next')} 
                  className={`absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full glass border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100 active:scale-90 hover:bg-[var(--brand-color)] hover:border-[var(--brand-color)] group/btn shadow-2xl ${theme === 'light' ? 'bg-white border-slate-200' : ''}`}
                >
                  <svg className={`w-8 h-8 transition-colors ${theme !== 'light' ? 'text-slate-400 group-hover/btn:text-white' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>

                <div 
                  ref={scrollContainerRef}
                  className="flex gap-10 overflow-x-auto pb-20 px-6 md:px-[calc(50vw-600px)] no-scrollbar snap-x snap-mandatory scroll-smooth"
                >
                  {BOTS.map((bot) => (
                    <div key={bot.id} className="min-w-[90vw] md:min-w-[1200px] snap-center">
                      <BotCard bot={bot} theme={theme} onViewDetails={(b) => { setSelectedBot(b); setView('bot-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="support" className="px-6 py-32 max-w-7xl mx-auto relative overflow-hidden reveal active reveal-up">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-color)]/5 blur-[150px] rounded-full -z-10 animate-pulse"></div>
              <div className={`glass p-12 md:p-24 rounded-[4rem] text-center border relative overflow-hidden group transition-all duration-700 hover:shadow-[0_0_80px_var(--brand-glow)] ${theme !== 'light' ? 'border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--brand-color)] to-transparent opacity-60"></div>
                <h2 className={`text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>Need <span className="text-[var(--brand-color)]">Support?</span></h2>
                <p className="text-slate-500 max-w-3xl mx-auto text-lg md:text-2xl font-medium mb-16 leading-relaxed">Our elite engineering team is on standby 24/7 to ensure your community's systems remain unbreakable.</p>
                <div className="flex flex-wrap justify-center gap-8">
                  <a href={SUPPORT_SERVER_URL} target="_blank" rel="noreferrer" className="group px-14 py-7 rounded-3xl bg-[var(--brand-color)] text-white font-black text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center gap-4">
                    Join Support HQ
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </a>
                  <button onClick={() => setIsFeedbackOpen(true)} className={`px-14 py-7 rounded-3xl border font-black text-sm tracking-widest uppercase transition-all active:scale-95 ${theme !== 'light' ? 'border-white/10 hover:bg-white hover:text-black' : 'border-slate-200 hover:bg-slate-900 hover:text-white shadow-xl'}`}>Open Feedback Hub</button>
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
