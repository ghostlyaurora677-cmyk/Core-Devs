
import React, { useState, useEffect } from 'react';
import { Resource, ResourceType, Feedback, StaffAccount, User, StaffPermission } from '../types';
import { databaseService } from '../services/databaseService';

interface AdminPanelViewProps {
  user: User | null;
  resources: Resource[];
  feedbacks: Feedback[];
  onAdd: (r: Resource) => void;
  onUpdate: (r: Resource) => void;
  onDelete: (id: string) => void;
  onDeleteFeedback: (id: string) => void;
  onClearAllFeedback: () => void;
  onBack: () => void;
}

type SortOption = 'username' | 'role' | 'permissionsCount';
type FilterOption = 'ALL' | StaffPermission;

const AdminPanelView: React.FC<AdminPanelViewProps> = ({ 
  user, resources, feedbacks, onAdd, onUpdate, onDelete, onDeleteFeedback, onClearAllFeedback, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'assets' | 'feedback' | 'staff'>('assets');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [clearFeedbackConfirm, setClearFeedbackConfirm] = useState(false);

  // Staff management state (Strictly Master Only)
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffPermissions, setNewStaffPermissions] = useState<StaffPermission[]>(['VAULT_VIEW']);
  const [creationStatus, setCreationStatus] = useState<'idle' | 'success'>('idle');

  // Sorting and Filtering state
  const [sortBy, setSortBy] = useState<SortOption>('username');
  const [filterBy, setFilterBy] = useState<FilterOption>('ALL');

  const [formData, setFormData] = useState<Partial<Resource>>({
    title: '', description: '', type: 'API_KEY', content: '', tags: []
  });

  // Permission verification helper
  const hasPermission = (perm: StaffPermission) => {
    if (user?.isMaster) return true;
    return user?.permissions?.includes(perm);
  };

  useEffect(() => {
    if (user?.isMaster) {
      databaseService.getStaffAccounts().then(setStaffAccounts);
    }
    
    // Unauthorized tab redirection
    if (activeTab === 'assets' && !hasPermission('VAULT_VIEW')) {
      setActiveTab('feedback');
    }
    if (activeTab === 'staff' && !user?.isMaster) {
      setActiveTab('assets');
    }
  }, [user]);

  const handleSave = () => {
    if (!hasPermission('VAULT_EDIT')) return alert('Security Error: Unauthorized Modification Attempt');
    if (!formData.title || !formData.content) return alert('Title and Content are mandatory for vault storage.');
    
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

  const togglePermission = (perm: StaffPermission) => {
    setNewStaffPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleAddStaff = async () => {
    if (!user?.isMaster) return alert('Protocol Violation: Only System Owner can authorize personnel');
    if (!newStaffUsername || !newStaffPassword) return alert('All credentials fields must be populated');
    
    const newAcc: StaffAccount = {
      id: Math.random().toString(36).substr(2, 9),
      username: newStaffUsername,
      password: newStaffPassword,
      role: 'Staff Personnel',
      permissions: newStaffPermissions
    };
    
    await databaseService.addStaffAccount(newAcc);
    setStaffAccounts([...staffAccounts, newAcc]);
    setNewStaffUsername('');
    setNewStaffPassword('');
    setNewStaffPermissions(['VAULT_VIEW']);
    setCreationStatus('success');
    setTimeout(() => setCreationStatus('idle'), 3000);
  };

  const handleDeleteStaff = async (id: string) => {
    if (!user?.isMaster) return;
    await databaseService.deleteStaffAccount(id);
    setStaffAccounts(staffAccounts.filter(s => s.id !== id));
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', type: 'API_KEY', content: '', tags: [] });
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (res: Resource) => {
    if (!hasPermission('VAULT_EDIT')) return;
    setFormData(res);
    setEditingId(res.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Process staff roster
  const processedStaff = [...staffAccounts]
    .filter(s => filterBy === 'ALL' || s.permissions.includes(filterBy as StaffPermission))
    .sort((a, b) => {
      if (sortBy === 'username') return a.username.localeCompare(b.username);
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      if (sortBy === 'permissionsCount') return (b.permissions?.length || 0) - (a.permissions?.length || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20 fade-in relative overflow-x-hidden">
      {/* Universal Confirmation Modal */}
      {(deleteConfirmId || clearFeedbackConfirm) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => { setDeleteConfirmId(null); setClearFeedbackConfirm(false); }}></div>
          <div className="relative glass p-12 rounded-[3.5rem] border-red-500/30 max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter">Authorize Purge?</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10 leading-relaxed">System override detected. Purging data will permanently remove the entry from our encrypted buffers.</p>
            <div className="flex gap-4">
              <button onClick={() => { setDeleteConfirmId(null); setClearFeedbackConfirm(false); }} className="flex-1 py-5 glass rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Abort</button>
              <button onClick={() => {
                if (deleteConfirmId) {
                  if (activeTab === 'assets') onDelete(deleteConfirmId);
                  else if (activeTab === 'feedback') onDeleteFeedback(deleteConfirmId);
                  else if (activeTab === 'staff') handleDeleteStaff(deleteConfirmId);
                  setDeleteConfirmId(null);
                } else if (clearFeedbackConfirm) {
                  onClearAllFeedback();
                  setClearFeedbackConfirm(false);
                }
              }} className="flex-1 py-5 bg-red-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 shadow-2xl shadow-red-600/30 transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Terminal Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-16 gap-10">
          <div>
            <div className="flex items-center gap-5 mb-4">
              <div className="w-3 h-10 bg-indigo-500 rounded-full glow"></div>
              <h1 className="text-6xl font-black uppercase tracking-tighter">Command Center</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                Active Terminal: <span className="text-white">{user?.username}</span>
              </span>
              {user?.isMaster && <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full">Primary Owner</span>}
            </div>
          </div>
          <div className="flex gap-5">
            <button onClick={onBack} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-600/10 hover:text-red-400 hover:border-red-500/20 transition-all">Disconnect</button>
            {activeTab === 'assets' && hasPermission('VAULT_EDIT') && (
              <button onClick={() => setIsAdding(true)} className="px-10 py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">New Infrastructure Asset</button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-4 mb-16 border-b border-white/5 pb-5 overflow-x-auto no-scrollbar">
          {hasPermission('VAULT_VIEW') && (
            <button 
              onClick={() => setActiveTab('assets')} 
              className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Vault Assets
            </button>
          )}
          <button 
            onClick={() => setActiveTab('feedback')} 
            className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'feedback' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            Incoming Intelligence
            {feedbacks.length > 0 && <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-[11px] font-black border-4 border-black">{feedbacks.length}</span>}
          </button>
          {user?.isMaster && (
            <button 
              onClick={() => setActiveTab('staff')} 
              className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-purple-600 text-white shadow-2xl shadow-purple-600/20 border border-purple-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Personnel Hub
            </button>
          )}
        </div>

        {/* Vault Management */}
        {activeTab === 'assets' && hasPermission('VAULT_VIEW') && (
          <div className="space-y-6">
            {isAdding && hasPermission('VAULT_EDIT') && (
              <div className="glass rounded-[4rem] p-12 mb-16 border-indigo-500/20 animate-in zoom-in-95 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                <h2 className="text-3xl font-black mb-12 uppercase tracking-tighter">{editingId ? 'Patching Active Asset' : 'Initializing New Protocol'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Alias</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-indigo-500 transition-all font-medium" placeholder="Target Identifier" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Infrastructure Class</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ResourceType})}>
                        <option value="API_KEY">Security Token / Key</option>
                        <option value="CODE_SNIPPET">Developer Protocol</option>
                        <option value="TOOL">Infrastructure Gateway</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Loadout</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm h-full min-h-[180px] font-mono outline-none focus:border-indigo-500 transition-all" placeholder="Enter payload details..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                  </div>
                </div>
                <div className="flex justify-end gap-6 mt-12">
                  <button onClick={resetForm} className="text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Discard Draft</button>
                  <button onClick={handleSave} className="bg-indigo-600 px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">Deploy to Vault</button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              {resources.map(res => (
                <div key={res.id} className="glass p-10 rounded-[3rem] flex items-center justify-between group border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-10">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl ${res.type === 'API_KEY' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : res.type === 'CODE_SNIPPET' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'}`}>
                      {res.type.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-3xl mb-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tighter">{res.title}</h3>
                      <div className="flex gap-5 items-center">
                         <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{res.type.replace('_', ' ')}</span>
                         <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
                         <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{res.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  {hasPermission('VAULT_EDIT') && (
                    <div className="flex gap-4">
                      <button onClick={() => startEdit(res)} className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl text-slate-500 hover:text-white hover:bg-white/10 transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                      <button onClick={() => setDeleteConfirmId(res.id)} className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  )}
                </div>
              ))}
              {resources.length === 0 && <div className="text-center py-40 opacity-20 text-[11px] font-black uppercase tracking-[0.5em] border-2 border-dashed border-white/5 rounded-[4rem]">No active infrastructure segments</div>}
            </div>
          </div>
        )}

        {/* Feedback Monitoring */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            {feedbacks.length === 0 ? (
              <div className="text-center py-40 opacity-20 text-[11px] font-black uppercase tracking-[0.5em] border-2 border-dashed border-white/5 rounded-[4rem]">No intelligence reports collected</div>
            ) : (
              feedbacks.map(f => (
                <div key={f.id} className="glass p-12 rounded-[3.5rem] border-white/5 relative group hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-5">
                      <span className={`px-6 py-2.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${f.type === 'BUG' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>{f.type}</span>
                      <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{new Date(f.timestamp).toLocaleString()}</span>
                    </div>
                    {hasPermission('FEEDBACK_MANAGE') && (
                      <button onClick={() => setDeleteConfirmId(f.id)} className="opacity-0 group-hover:opacity-100 transition-all text-slate-600 hover:text-red-500 p-3"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    )}
                  </div>
                  <p className="text-slate-300 font-medium text-xl leading-relaxed">{f.message}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Personnel Hub (Master Access Only) */}
        {activeTab === 'staff' && user?.isMaster && (
          <div className="space-y-16 animate-in slide-in-from-right-10 duration-700">
            {/* Staff Onboarding Card */}
            <div className="glass rounded-[4rem] p-12 border-white/5 relative overflow-hidden group/card shadow-[0_50px_100px_rgba(0,0,0,0.6)]">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover/card:opacity-[0.1] transition-all duration-1000 scale-150">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              </div>
              
              <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter">Onboard Infrastructure Staff</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Assigned Username</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 focus:border-indigo-500 transition-all outline-none font-bold text-lg" placeholder="e.g. aditya_staff" value={newStaffUsername} onChange={e => setNewStaffUsername(e.target.value)} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Access Passphrase</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 focus:border-indigo-500 transition-all outline-none font-bold text-lg" type="password" placeholder="••••••••" value={newStaffPassword} onChange={e => setNewStaffPassword(e.target.value)} />
                </div>
              </div>

              <div className="mb-16 space-y-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">Clearance Tier Configuration</h3>
                 <div className="flex flex-wrap gap-5">
                    {(['VAULT_VIEW', 'VAULT_EDIT', 'FEEDBACK_MANAGE'] as StaffPermission[]).map(perm => (
                      <button 
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`px-10 py-5 rounded-2xl text-[11px] font-black border transition-all uppercase tracking-widest ${newStaffPermissions.includes(perm) ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-600/40' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}
                      >
                        {perm.replace('_', ' ')}
                      </button>
                    ))}
                 </div>
              </div>

              <button onClick={handleAddStaff} className="w-full py-7 bg-indigo-600 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-indigo-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-5 hover:bg-indigo-500 hover:shadow-indigo-600/60">
                {creationStatus === 'success' ? (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                    Personnel Authorized
                  </>
                ) : 'Confirm New Authorization'}
              </button>
            </div>

            {/* Live Personnel Roster with Sorting and Filtering */}
            <div className="space-y-10">
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-6">
                  <div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2">Active Personnel Roster</h3>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{processedStaff.length} ENCRYPTED ENTITIES</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Filter Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Filter by Permission</label>
                      <select 
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="ALL">All Personnel</option>
                        <option value="VAULT_VIEW">Vault Viewers</option>
                        <option value="VAULT_EDIT">Vault Editors</option>
                        <option value="FEEDBACK_MANAGE">Feedback Ops</option>
                      </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Sort Roster By</label>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="username">Identifier (A-Z)</option>
                        <option value="role">Clearance Level</option>
                        <option value="permissionsCount">Clearance Density</option>
                      </select>
                    </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {processedStaff.map(s => (
                   <div key={s.id} className="glass p-10 rounded-[3rem] border-white/5 flex items-center justify-between group hover:border-white/10 transition-all hover:-translate-y-2">
                     <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-black text-3xl text-indigo-400 shadow-inner">
                          {s.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-2xl mb-2 tracking-tighter">{s.username}</p>
                          <div className="flex gap-3 flex-wrap">
                            {s.permissions?.map(p => (
                              <span key={p} className="text-[8px] font-black bg-indigo-600/10 px-3 py-1.5 rounded-xl text-indigo-400 border border-indigo-500/10 uppercase tracking-widest">
                                {p.split('_')[0]}
                              </span>
                            ))}
                          </div>
                          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-3">Level: {s.role}</p>
                        </div>
                     </div>
                     <button onClick={() => setDeleteConfirmId(s.id)} className="w-14 h-14 flex items-center justify-center rounded-3xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90" title="Purge Account">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </div>
                 ))}
               </div>
               
               {processedStaff.length === 0 && (
                 <div className="text-center py-32 opacity-20 text-[11px] font-black uppercase tracking-[0.5em] border-2 border-dashed border-white/5 rounded-[4rem]">
                    Personnel buffer is currently empty for this configuration
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelView;
