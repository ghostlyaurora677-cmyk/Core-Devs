
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
import FeedbackModal from './components/FeedbackModal';
import { BOTS, INITIAL_RESOURCES, SUPPORT_SERVER_URL } from './constants';
import { Resource, ResourceType, BotInfo, ThemeType, Feedback } from './types';
import { databaseService } from './services/databaseService';

const ADMIN_PASSWORD = 'coredevs@2025';

const FloatingIcons = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Discord Logo - Top Left Peripheral */}
    <div className="absolute top-[8%] left-[3%] drifting opacity-[0.05] blur-[6px] scale-110" style={{ animationDuration: '18s' }}>
      <svg className="w-28 h-28 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
    </div>

    {/* Sparkles (Nitro) - Top Right Peripheral */}
    <div className="absolute top-[6%] right-[5%] drifting opacity-[0.07] blur-[2px]" style={{ animationDuration: '22s', animationDelay: '-2s' }}>
      <svg className="w-24 h-24 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 6.5L17.5 5L19 3.5L20.5 5L19 6.5ZM19 21L17.5 19.5L19 18L20.5 19.5L19 21ZM6.5 19L5 17.5L6.5 16L8 17.5L6.5 19ZM12 18L9 12L3 9L9 6L12 0L15 6L21 9L15 12L12 18Z"/>
      </svg>
    </div>

    {/* Server Boost Crystal - Mid Left (Far) */}
    <div className="absolute top-[35%] left-[1.5%] pulse-glow opacity-[0.06] scale-90" style={{ animationDuration: '9s' }}>
      <svg className="w-16 h-16 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/>
      </svg>
    </div>

    {/* Nitro Gem - Mid Right (Far) */}
    <div className="absolute top-[40%] right-[2%] drifting opacity-[0.05] blur-[1px] scale-75" style={{ animationDuration: '15s', animationDelay: '-5s' }}>
      <svg className="w-16 h-16 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.2L3.5 11l8.5 10.8L20.5 11 12 2.2zm0 2.5l6.3 6.3H5.7l6.3-6.3z"/>
      </svg>
    </div>

    {/* Musical Note (Fynex Context) - Mid Left (Inner) */}
    <div className="absolute top-[60%] left-[6%] drifting opacity-[0.04] blur-[3px]" style={{ animationDuration: '25s', animationDelay: '-8s' }}>
      <svg className="w-20 h-20 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    </div>

    {/* Shield (Ryzer Context) - Mid Right (Inner) */}
    <div className="absolute top-[55%] right-[7%] drifting opacity-[0.05] blur-[4px] scale-110" style={{ animationDuration: '14s', animationDelay: '-1s' }}>
      <svg className="w-24 h-24 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
      </svg>
    </div>

    {/* Heart Reaction - Bottom Left (Edge) */}
    <div className="absolute bottom-[25%] left-[2%] pulse-glow opacity-[0.04] scale-75" style={{ animationDuration: '12s', animationDelay: '-4s' }}>
      <svg className="w-14 h-14 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>

    {/* Smile Reaction - Bottom Right (Edge) */}
    <div className="absolute bottom-[22%] right-[3%] drifting opacity-[0.03] blur-[1px]" style={{ animationDuration: '20s', animationDelay: '-12s' }}>
      <svg className="w-16 h-16 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5s.67 1.5 1.5 1.5zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
      </svg>
    </div>

    {/* Controller - Lower Left Area */}
    <div className="absolute bottom-[10%] left-[10%] drifting opacity-[0.05] blur-[2px] scale-90" style={{ animationDuration: '28s', animationDelay: '-3s' }}>
      <svg className="w-32 h-32 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    </div>

    {/* Headphones - Lower Right Area */}
    <div className="absolute bottom-[8%] right-[12%] drifting opacity-[0.06] pulse-glow scale-110" style={{ animationDuration: '18s', animationDelay: '-6s' }}>
      <svg className="w-28 h-28 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a9 9 0 00-9 9v7c0 1.1.9 2 2 2h2v-7H5v-2a7 7 0 0114 0v2h-2v7h2c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9z"/>
      </svg>
    </div>

    {/* Message Bubble - Top Area (Center-Left) */}
    <div className="absolute top-[12%] left-[35%] drifting opacity-[0.03] blur-[5px]" style={{ animationDuration: '21s', animationDelay: '-9s' }}>
      <svg className="w-20 h-20 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
      </svg>
    </div>

    {/* Code Brackets - Top Area (Center-Right) */}
    <div className="absolute top-[15%] right-[32%] drifting opacity-[0.02] blur-[8px]" style={{ animationDuration: '30s', animationDelay: '-11s' }}>
      <svg className="w-24 h-24 text-[var(--brand-color)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const resData = await databaseService.getResources();
      const feedData = await databaseService.getFeedbacks();
      setResources(resData || []);
      setFeedbacks(feedData || []);
      if (sessionStorage.getItem('cd_admin_session') === 'active') {
        setIsAdmin(true);
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
    setView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (v: any) => {
    if (v === 'admin') {
      isAdmin ? setView('admin') : setView('login');
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
      feedbacks={feedbacks}
      onAdd={handleAddResource} 
      onUpdate={handleUpdateResource} 
      onDelete={handleDeleteResource} 
      onDeleteFeedback={handleDeleteFeedback}
      onClearAllFeedback={handleClearAllFeedback}
      onBack={handleLogout} 
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
            
            <section id="projects" className="px-6 py-24 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 gap-12">
                {BOTS.map((bot, index) => (
                  <div key={bot.id} className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                    <BotCard bot={bot} theme={theme} onViewDetails={(b) => { setSelectedBot(b); setView('bot-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {(['API_KEY', 'CODE_SNIPPET', 'TOOL'] as ResourceType[]).map((type, idx) => (
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
                {resources.filter(r => r.type === selectedCategory).map((res, idx) => (
                  <ResourceCard key={res.id} resource={res} theme={theme} />
                ))}
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} theme={theme} onOpenFeedback={() => setIsFeedbackOpen(true)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} theme={theme} onSubmit={handleAddFeedback} />
    </div>
  );
};

export default App;
