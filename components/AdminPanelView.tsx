
import React, { useState } from 'react';
import { Resource, ResourceType, Feedback } from '../types';

interface AdminPanelViewProps {
  resources: Resource[];
  feedbacks: Feedback[];
  onAdd: (r: Resource) => void;
  onUpdate: (r: Resource) => void;
  onDelete: (id: string) => void;
  onDeleteFeedback: (id: string) => void;
  onClearAllFeedback: () => void;
  onBack: () => void;
}

const AdminPanelView: React.FC<AdminPanelViewProps> = ({ 
  resources, feedbacks, onAdd, onUpdate, onDelete, onDeleteFeedback, onClearAllFeedback, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'assets' | 'feedback'>('assets');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [clearFeedbackConfirm, setClearFeedbackConfirm] = useState(false);

  const [formData, setFormData] = useState<Partial<Resource>>({
    title: '', description: '', type: 'API_KEY', content: '', tags: []
  });

  const handleSave = () => {
    if (!formData.title || !formData.content) return alert('Title and Content are required!');
    if (editingId) {
      onUpdate({ ...formData, id: editingId } as Resource);
    } else {
      onAdd({ 
        ...formData, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0]
      } as Resource);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', type: 'API_KEY', content: '', tags: [] });
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (res: Resource) => {
    setFormData(res);
    setEditingId(res.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20 fade-in relative overflow-x-hidden">
      {/* Universal Confirmation Modal */}
      {(deleteConfirmId || clearFeedbackConfirm) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setDeleteConfirmId(null); setClearFeedbackConfirm(false); }}></div>
          <div className="relative glass p-10 rounded-[2.5rem] border-red-500/20 max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black mb-3 text-red-500">Confirm Deletion</h3>
            <p className="text-slate-500 text-sm font-bold mb-8 uppercase tracking-widest">This action will wipe data permanently. Confirm?</p>
            <div className="flex gap-4">
              <button onClick={() => { setDeleteConfirmId(null); setClearFeedbackConfirm(false); }} className="flex-1 py-4 glass rounded-2xl text-[10px] font-black uppercase">Cancel</button>
              <button 
                onClick={() => {
                  if (deleteConfirmId) {
                    activeTab === 'assets' ? onDelete(deleteConfirmId) : onDeleteFeedback(deleteConfirmId);
                    setDeleteConfirmId(null);
                  } else {
                    onClearAllFeedback();
                    setClearFeedbackConfirm(false);
                  }
                }} 
                className="flex-1 py-4 bg-red-600 rounded-2xl text-[10px] font-black uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Staff Hub</h1>
            <p className="text-slate-500 text-sm mt-1">Infrastructure Oversight & Feedback Control</p>
          </div>
          <div className="flex gap-4">
            <button onClick={onBack} className="px-6 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Secure Logout</button>
            {activeTab === 'assets' && (
              <button onClick={() => setIsAdding(true)} className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Add Asset</button>
            )}
            {activeTab === 'feedback' && feedbacks.length > 0 && (
              <button onClick={() => setClearFeedbackConfirm(true)} className="px-6 py-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Clear All Feedback</button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-12 border-b border-white/5 pb-4">
          <button onClick={() => setActiveTab('assets')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Vault Assets</button>
          <button onClick={() => setActiveTab('feedback')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'feedback' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            Feedbacks
            {feedbacks.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[9px]">{feedbacks.length}</span>}
          </button>
        </div>

        {activeTab === 'assets' ? (
          <>
            {isAdding && (
              <div className="glass rounded-[2rem] p-10 mb-12 border-indigo-500/20 animate-in zoom-in-95">
                <h2 className="text-2xl font-black mb-8">{editingId ? 'Edit Asset' : 'Register New Asset'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ResourceType})}>
                      <option value="API_KEY">API Key</option>
                      <option value="CODE_SNIPPET">Code Snippet</option>
                      <option value="TOOL">Tool</option>
                    </select>
                  </div>
                  <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 h-full" placeholder="Content/Payload" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button onClick={resetForm} className="text-slate-400 font-black uppercase text-[10px]">Cancel</button>
                  <button onClick={handleSave} className="bg-indigo-600 px-8 py-3 rounded-xl font-black uppercase text-[10px]">Push Changes</button>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {resources.map(res => (
                <div key={res.id} className="glass p-6 rounded-2xl flex items-center justify-between group">
                  <div>
                    <h3 className="font-black text-xl group-hover:text-indigo-400 transition-colors">{res.title}</h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase">{res.type} • {res.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(res)} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => setDeleteConfirmId(res.id)} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-red-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {feedbacks.length === 0 ? (
              <div className="text-center py-20 opacity-30 uppercase font-black tracking-widest text-xs">No feedback data in cluster</div>
            ) : (
              feedbacks.map(f => (
                <div key={f.id} className="glass p-8 rounded-[2.5rem] border-white/5 relative group animate-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border ${f.type === 'BUG' ? 'bg-red-500/10 border-red-500/20 text-red-500' : f.type === 'SUGGESTION' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/10 border-white/20 text-slate-400'}`}>{f.type}</span>
                      <span className="text-slate-600 text-[9px] font-black uppercase mt-1.5 tracking-widest">{new Date(f.timestamp).toLocaleString()}</span>
                    </div>
                    <button onClick={() => setDeleteConfirmId(f.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-500 hover:text-red-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                  <p className="text-slate-300 font-medium leading-relaxed">{f.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelView;
