import React, { useState } from 'react';
import { Resource, ResourceType } from '../types';

interface AdminPanelViewProps {
  resources: Resource[];
  onAdd: (r: Resource) => void;
  onUpdate: (r: Resource) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const AdminPanelView: React.FC<AdminPanelViewProps> = ({ resources, onAdd, onUpdate, onDelete, onBack }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Resource>>({
    title: '',
    description: '',
    type: 'API_KEY',
    content: '',
    tags: []
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

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20 fade-in relative">
      {/* Custom Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}></div>
          <div className="relative glass p-10 rounded-[2.5rem] border-red-500/20 max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
               </svg>
            </div>
            <h3 className="text-2xl font-black mb-3">Wipe Asset?</h3>
            <p className="text-slate-500 text-sm font-bold mb-8 uppercase tracking-widest">This action cannot be undone. Confirm deletion?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="reveal active flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Vault Control Center</h1>
            <p className="text-slate-500 text-sm mt-1">Manage global developer assets and infrastructure</p>
          </div>
          <div className="flex gap-4">
            <button onClick={onBack} className="px-6 py-3 rounded-xl glass text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              Exit Panel
            </button>
            <button onClick={() => setIsAdding(true)} className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all glow">
              Add New Asset
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="reveal active glass rounded-[2rem] p-10 mb-12 border-indigo-500/20">
            <h2 className="text-2xl font-black mb-8">{editingId ? 'Edit Resource' : 'Register New Asset'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Title</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Resource Type</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500 appearance-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as ResourceType})}
                  >
                    <option value="API_KEY">API Key</option>
                    <option value="CODE_SNIPPET">Code Snippet</option>
                    <option value="TOOL">External Tool</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tags (comma separated)</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500"
                    placeholder="AI, NodeJS, Discord"
                    value={formData.tags?.join(', ')}
                    onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(s => s.trim())})}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500 h-[115px]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Content / Payload</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500 font-mono text-xs h-[115px]"
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-10 pt-10 border-t border-white/5">
              <button onClick={resetForm} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
              <button onClick={handleSave} className="px-8 py-4 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {editingId ? 'Push Update' : 'Finalize Asset'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {resources.map((res, index) => (
            <div 
              key={res.id} 
              className={`reveal active glass rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-all border-white/5 group stagger-${(index % 3) + 1}`}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-2xl">
                  {res.type === 'API_KEY' ? '🔑' : res.type === 'CODE_SNIPPET' ? '💻' : '🛠️'}
                </div>
                <div>
                  <h3 className="font-black text-xl group-hover:text-indigo-400 transition-colors">{res.title}</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">{res.type} • {res.createdAt}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6 md:mt-0">
                <button 
                  onClick={() => startEdit(res)} 
                  className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                  title="Edit Asset"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setDeleteConfirmId(res.id)} 
                  className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90 border border-transparent hover:border-red-500/20"
                  title="Delete Asset"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {resources.length === 0 && (
            <div className="text-center py-24 opacity-30 font-black uppercase tracking-widest text-xs">
               <div className="text-4xl mb-4">📭</div>
               No assets found in the cluster
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelView;