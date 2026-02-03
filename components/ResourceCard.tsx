
import React, { useState } from 'react';
import { Resource, ThemeType, User } from '../types';

interface ResourceCardProps {
  resource: Resource;
  theme?: ThemeType;
  user?: User | null;
  onLoginRequest?: () => void;
}

const IconMap = {
  API_KEY: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  CODE_SNIPPET: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  TOOL: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, theme = 'dark', user, onLoginRequest }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleAction = () => {
    if (!user) {
      if (onLoginRequest) onLoginRequest();
      return;
    }
    if (resource.type === 'TOOL') {
      window.open(resource.content, '_blank');
    } else {
      navigator.clipboard.writeText(resource.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className={`reveal rounded-[2.5rem] p-8 flex flex-col h-full card-highlight transition-all duration-500 overflow-hidden relative group/card 
      hover:scale-[1.02] 
      ${theme === 'black' 
        ? 'bg-[#080808] border-white/10 shadow-2xl hover:border-[var(--brand-color)]/30' 
        : theme !== 'light' 
        ? 'glass border-white/5 shadow-xl hover:border-[var(--brand-color)]/30 hover:shadow-[0_0_40px_var(--brand-glow)]' 
        : 'bg-white border border-slate-200 shadow-md hover:shadow-2xl hover:border-[var(--brand-color)]/20'}`}>
      
      <div className={`absolute top-0 right-0 p-8 w-32 h-32 opacity-5 pointer-events-none group-hover/card:scale-125 group-hover/card:opacity-10 transition-all duration-700 ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>
         {IconMap[resource.type]}
      </div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border transition-colors ${
          resource.type === 'API_KEY' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
          resource.type === 'CODE_SNIPPET' ? 'bg-[var(--brand-color)]/10 text-[var(--brand-color)] border-[var(--brand-color)]/20' : 
          'bg-purple-500/10 text-purple-500 border-purple-500/20'
        }`}>
          {resource.type.replace('_', ' ')}
        </span>
        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{resource.createdAt}</span>
      </div>
      
      <h4 className={`text-2xl font-black mb-3 relative z-10 group-hover/card:text-[var(--brand-color)] transition-colors duration-300 ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>{resource.title}</h4>
      <p className={`text-sm leading-relaxed mb-8 flex-grow relative z-10 font-medium ${theme === 'black' ? 'text-slate-300' : theme !== 'light' ? 'text-slate-400' : 'text-slate-600'}`}>{resource.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        {resource.tags.map(tag => (
          <span key={tag} className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-tighter hover:text-white transition-colors cursor-default ${theme === 'black' ? 'text-slate-400 bg-white/5 border-white/10' : theme !== 'light' ? 'text-slate-500 bg-white/5 border-white/5' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>#{tag}</span>
        ))}
      </div>

      <div className="space-y-4 relative z-10">
        <div className="relative group/content overflow-hidden">
          {user ? (
            <div className={`rounded-2xl p-5 font-mono text-xs overflow-hidden break-all min-h-[60px] flex items-center border transition-all ${resource.type === 'API_KEY' && !isRevealed ? 'blur-sm select-none' : ''} ${theme === 'black' ? 'bg-white/5 text-slate-300 border-white/10' : theme !== 'light' ? 'bg-black/40 text-slate-300 border-white/5 group-hover/content:border-white/20' : 'bg-slate-50 text-slate-700 border-slate-200 group-hover/content:border-[var(--brand-color)]/20'}`}>
              {resource.type === 'TOOL' ? resource.content.replace('https://', '') : resource.content}
            </div>
          ) : (
            <div 
              onClick={handleAction}
              className={`rounded-2xl p-8 flex flex-col items-center justify-center gap-3 border border-dashed cursor-pointer transition-all min-h-[100px] hover:bg-indigo-600/5 ${theme !== 'light' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-300'}`}
            >
              <svg className="w-6 h-6 text-indigo-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Login to Access Infrastructure</span>
            </div>
          )}
          
          {user && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover/content:opacity-100 transition-all duration-300">
              {resource.type === 'API_KEY' && (
                <button 
                  onClick={() => setIsRevealed(!isRevealed)}
                  className={`p-3 rounded-xl transition-all backdrop-blur-md border ${theme !== 'light' ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-white'}`}
                >
                  {isRevealed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              )}
              <button 
                onClick={handleAction}
                className={`p-3 rounded-xl transition-all shadow-lg active:scale-90 ${resource.type === 'TOOL' ? 'bg-purple-600 hover:bg-purple-500 text-white' : `bg-[var(--brand-color)] hover:opacity-90 ${theme === 'black' ? 'text-black' : 'text-white'}`}`}
              >
                {isCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : resource.type === 'TOOL' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002 2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
