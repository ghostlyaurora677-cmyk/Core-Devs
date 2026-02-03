
import React, { useState } from 'react';
import { ThemeType, FeedbackCategory, Feedback } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeType;
  onSubmit: (feedback: Feedback) => void;
  feedbacks: Feedback[];
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, theme, onSubmit, feedbacks }) => {
  const [modalMode, setModalMode] = useState<'submit' | 'view'>('submit');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [type, setType] = useState<FeedbackCategory>('SUGGESTION');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    const newFeedback: Feedback = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toISOString(),
      themeAtTime: theme
    };

    setTimeout(() => {
      onSubmit(newFeedback);
      setIsSubmitting(false);
      setStep('success');
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('form');
      setMessage('');
      setType('SUGGESTION');
      setModalMode('submit');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={handleClose}
      ></div>
      
      <div className={`relative w-full max-w-xl rounded-[3rem] p-8 md:p-12 border shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden flex flex-col max-h-[90vh] ${
        theme === 'black' ? 'bg-[#0a0a0a] border-white/10 text-white' : 
        theme !== 'light' ? 'bg-[#161a23] border-white/5 text-white' : 
        'bg-white border-slate-200 text-slate-900'
      }`}>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[var(--brand-color)] blur-md opacity-50"></div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-10 bg-white/5 p-1.5 rounded-2xl w-fit mx-auto border border-white/5">
          <button 
            onClick={() => setModalMode('submit')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${modalMode === 'submit' ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Submit
          </button>
          <button 
            onClick={() => setModalMode('view')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${modalMode === 'view' ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Hub ({feedbacks.length})
          </button>
        </div>

        {modalMode === 'submit' ? (
          <div className="overflow-y-auto no-scrollbar">
            {step === 'form' ? (
              <>
                <div className="text-center mb-8">
                  <h3 className={`text-4xl font-black mb-3 uppercase tracking-tighter`}>
                    Share <span className="text-[var(--brand-color)]">Feedback</span>
                  </h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Help us improve the CORE DEVS ecosystem</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {(['SUGGESTION', 'BUG', 'OTHER'] as FeedbackCategory[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                          type === t 
                            ? 'bg-[var(--brand-color)] border-[var(--brand-color)] text-white shadow-lg' 
                            : theme !== 'light' 
                              ? 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10' 
                              : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white shadow-sm'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="relative group">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      className={`w-full h-32 rounded-2xl p-6 text-sm outline-none border transition-all resize-none font-medium ${
                        theme !== 'light' 
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[var(--brand-color)]' 
                          : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-color)]'
                      }`}
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className={`flex-1 py-4.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                        theme !== 'light' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      className={`flex-[2] py-4.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${
                        isSubmitting ? 'bg-slate-500 text-white cursor-wait' : 'bg-[var(--brand-color)] text-white hover:opacity-90'
                      }`}
                    >
                      {isSubmitting ? 'Transmitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`text-4xl font-black mb-3 tracking-tighter uppercase`}>Confirmed</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-10">Your report has been synced with our dev logs.</p>
                <button
                  onClick={handleClose}
                  className={`w-full py-4.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                    theme !== 'light' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'
                  }`}
                >
                  Return to Hub
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="text-center mb-8">
              <h3 className={`text-4xl font-black mb-3 uppercase tracking-tighter`}>
                Feedback <span className="text-[var(--brand-color)]">Hub</span>
              </h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Community Reports & Suggestions</p>
            </div>
            
            <div className="space-y-4">
              {feedbacks.length === 0 ? (
                <div className="text-center py-20 opacity-30 font-black text-[10px] uppercase tracking-widest">No public data available</div>
              ) : (
                feedbacks.map((f) => (
                  <div key={f.id} className={`p-6 rounded-2xl border transition-all ${theme !== 'light' ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-3 py-1 rounded-lg text-[8px] font-black border ${f.type === 'BUG' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>{f.type}</span>
                      <span className="text-slate-500 text-[8px] font-bold uppercase">{new Date(f.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${theme !== 'light' ? 'text-slate-300' : 'text-slate-700'}`}>{f.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--brand-color); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
