
import React, { useState, useEffect } from 'react';
import { Resource, ResourceType, Feedback, StaffAccount, User, StaffPermission, ThemeType } from '../types';
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
  theme?: ThemeType;
}

type StaffRole = 'Owner' | 'Manager' | 'Admin' | 'Staff';

const PERMISSION_OPTS: { id: StaffPermission; label: string; desc: string }[] = [
  { id: 'VAULT_VIEW', label: 'Vault Access', desc: 'Can view cloud infrastructure keys and assets.' },
  { id: 'VAULT_EDIT', label: 'Archive Management', desc: 'Can add, update, or delete entries in the Vault.' },
  { id: 'FEEDBACK_MANAGE', label: 'Signal Control', desc: 'Can manage user feedback logs and signals.' }
];

const AdminPanelView: React.FC<AdminPanelViewProps> = ({ 
  user, resources, feedbacks, onAdd, onUpdate, onDelete, onDeleteFeedback, onClearAllFeedback, onBack, theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState<'assets' | 'feedback' | 'staff'>('assets');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('Staff');
  const [newStaffPermissions, setNewStaffPermissions] = useState<StaffPermission[]>(['VAULT_VIEW']);
  const [creationStatus, setCreationStatus] = useState<'idle' | 'success' | 'updated'>('idle');

  const [formData, setFormData] = useState<Partial<Resource>>({
    title: '', description: '', type: 'API_KEY', content: '', tags: []
  });

  const staffRoles: StaffRole[] = ['Owner', 'Manager', 'Admin', 'Staff'];

  const hasPermission = (perm: StaffPermission) => {
    if (user?.isMaster) return true;
    return user?.permissions?.includes(perm);
  };

  useEffect(() => {
    if (user?.isMaster) {
      databaseService.getStaffAccounts().then(setStaffAccounts);
    }
  }, [user]);

  const handleSaveResource = () => {
    if (!hasPermission('VAULT_EDIT')) return alert('Security Error: Unauthorized Modification Attempt');
    if (!formData.title || !formData.content) return alert('Title and Content are mandatory.');
    
    if (editingId) {
      onUpdate({ ...formData, id: editingId } as Resource);
    } else {
      onAdd({ 
        ...formData, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0]
      } as Resource);
    }
    resetResourceForm();
  };

  const handleTogglePermission = (perm: StaffPermission) => {
    setNewStaffPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleAddOrUpdateStaff = async () => {
    if (!user?.isMaster) return alert('Protocol Violation: System Owner authorization required.');
    if (!newStaffUsername || !newStaffPassword) return alert('All fields required.');
    
    if (editingStaffId) {
      const updatedAcc: StaffAccount = {
        id: editingStaffId,
        username: newStaffUsername,
        password: newStaffPassword,
        role: newStaffRole,
        permissions: newStaffPermissions
      };
      await databaseService.updateStaffAccount(updatedAcc);
      setStaffAccounts(prev => prev.map(s => s.id === editingStaffId ? updatedAcc : s));
      setCreationStatus('updated');
    } else {
      const newAcc: StaffAccount = {
        id: Math.random().toString(36).substr(2, 9),
        username: newStaffUsername,
        password: newStaffPassword,
        role: newStaffRole,
        permissions: newStaffPermissions
      };
      await databaseService.addStaffAccount(newAcc);
      setStaffAccounts([...staffAccounts, newAcc]);
      setCreationStatus('success');
    }

    resetStaffForm();
    setTimeout(() => setCreationStatus('idle'), 3000);
  };

  const startEditStaff = (staff: StaffAccount) => {
    setEditingStaffId(staff.id);
    setNewStaffUsername(staff.username);
    setNewStaffPassword(staff.password);
    setNewStaffRole(staff.role as StaffRole);
    setNewStaffPermissions(staff.permissions);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteStaff = async (id: string) => {
    if (confirm('Delete this operator permanently?')) {
      await databaseService.deleteStaffAccount(id);
      setStaffAccounts(prev => prev.filter(s => s.id !== id));
    }
  };

  const resetResourceForm = () => {
    setFormData({ title: '', description: '', type: 'API_KEY', content: '', tags: [] });
    setEditingId(null);
    setIsAdding(false);
  };

  const resetStaffForm = () => {
    setEditingStaffId(null);
    setNewStaffUsername('');
    setNewStaffPassword('');
    setNewStaffRole('Staff');
    setNewStaffPermissions(['VAULT_VIEW']);
  };

  const startEditResource = (res: Resource) => {
    setFormData(res);
    setEditingId(res.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = [
    { label: 'Vault Items', value: resources.length, icon: '📦' },
    { label: 'Unresolved Logs', value: feedbacks.length, icon: '📝' },
    { label: 'Authorized Staff', value: staffAccounts.length + 1, icon: '🛡️' },
    { label: 'System Uptime', value: '100%', icon: '🟢' }
  ];

  const inputClasses = `w-full border rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all font-bold ${
    theme === 'light' 
      ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-500' 
      : 'bg-white/5 border-white/10 text-white placeholder:text-slate-600'
  }`;

  const labelClasses = `text-[10px] font-black uppercase tracking-widest ml-2 ${
    theme === 'light' ? 'text-slate-600' : 'text-slate-500'
  }`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32 reveal active reveal-up">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {stats.map((s, idx) => (
          <div key={idx} className={`glass p-8 rounded-[2.5rem] border shadow-2xl group hover:-translate-y-2 transition-all ${theme === 'light' ? 'bg-white border-slate-200' : 'border-white/5'}`}>
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-64 space-y-4 shrink-0">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-6 px-4 text-center lg:text-left">Navigation HQ</p>
          {[
            { id: 'assets', label: 'Asset Vault', icon: '💎' },
            { id: 'feedback', label: 'User Feedback', icon: '📬' },
            { id: 'staff', label: 'Staff Management', icon: '👤', hidden: !user?.isMaster }
          ].map((tab) => !tab.hidden && (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)]' 
                : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-[600px]">
          {activeTab === 'assets' && (
            <div className="space-y-8 reveal active reveal-right">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8">
                <div>
                  <h2 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Asset <span className="text-indigo-500">Vault</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manage sensitive cloud infrastructure and keys</p>
                </div>
                {hasPermission('VAULT_EDIT') && (
                  <button onClick={() => setIsAdding(!isAdding)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${isAdding ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500'}`}>
                    {isAdding ? 'Close Editor' : 'Register New Key'}
                  </button>
                )}
              </div>

              {isAdding && (
                <div className={`glass p-10 rounded-[3rem] border mb-12 animate-in slide-in-from-top-4 duration-500 ${theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'border-white/10'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                      <label className={labelClasses}>Display Name</label>
                      <input 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        className={inputClasses}
                        placeholder="Internal Identifier"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClasses}>Type Category</label>
                      <div className="relative group">
                        <select 
                          value={formData.type} 
                          onChange={e => setFormData({...formData, type: e.target.value as ResourceType})} 
                          className={`${inputClasses} appearance-none cursor-pointer pr-12`}
                        >
                          {/* Aligned with Vault categories */}
                          <option value="API_KEY" className="text-slate-900 bg-white">API KEY</option>
                          <option value="CODE_SNIPPET" className="text-slate-900 bg-white">CODE SNIPPET</option>
                          <option value="TOOL" className="text-slate-900 bg-white">TOOL</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-indigo-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                    <label className={labelClasses}>Data Payload</label>
                    <textarea 
                      value={formData.content} 
                      onChange={e => setFormData({...formData, content: e.target.value})} 
                      className={`${inputClasses} font-mono text-sm h-32 resize-none`}
                      placeholder="Paste sensitive data here..."
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={handleSaveResource} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Commit to Database</button>
                    <button onClick={resetResourceForm} className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'glass hover:bg-white/10'}`}>Abort</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map(res => (
                  <div key={res.id} className={`glass p-8 rounded-3xl border transition-all group ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'border-white/5 hover:border-[var(--brand-color)]/30'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform ${theme === 'light' ? 'bg-slate-100' : 'bg-white/5'}`}>
                        {res.type === 'API_KEY' ? '🔑' : res.type === 'CODE_SNIPPET' ? '📜' : '🛠️'}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => startEditResource(res)} className="p-2 hover:text-indigo-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        <button onClick={() => onDelete(res.id)} className="p-2 hover:text-red-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                    <h4 className={`text-xl font-black mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{res.title}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Created: {res.createdAt}</p>
                    <div className={`rounded-xl p-4 border font-mono text-[10px] text-slate-400 truncate ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/5'}`}>
                      {res.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-8 reveal active reveal-right">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8">
                <div>
                  <h2 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>User <span className="text-indigo-500">Feedback</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Public logs and community signals</p>
                </div>
                {feedbacks.length > 0 && (
                  <button onClick={onClearAllFeedback} className="px-8 py-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Clear All History</button>
                )}
              </div>

              <div className="space-y-4">
                {feedbacks.length === 0 ? (
                  <div className={`glass p-20 rounded-[3rem] text-center border opacity-40 ${theme === 'light' ? 'bg-white border-slate-200' : 'border-white/5'}`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">No signals received from community nodes.</p>
                  </div>
                ) : (
                  feedbacks.map(f => (
                    <div key={f.id} className={`glass p-8 rounded-3xl border flex flex-col sm:flex-row justify-between items-start group hover:border-indigo-500/30 transition-all gap-4 ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'border-white/5'}`}>
                      <div className="flex gap-6">
                        <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-xl ${f.type === 'BUG' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {f.type === 'BUG' ? '🐞' : '💡'}
                        </div>
                        <div>
                          <p className={`font-bold mb-3 ${theme === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>{f.message}</p>
                          <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                            <span>Type: <span className={f.type === 'BUG' ? 'text-red-400' : 'text-emerald-400'}>{f.type}</span></span>
                            <span>•</span>
                            <span>{new Date(f.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => onDeleteFeedback(f.id)} className="p-3 sm:opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all self-end sm:self-auto"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'staff' && user?.isMaster && (
            <div className="space-y-8 reveal active reveal-right">
              <div className="mb-12">
                <h2 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Staff <span className="text-indigo-500">Roster</span></h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Owner only access for personnel authorization</p>
              </div>

              <div className={`glass p-10 rounded-[3rem] border mb-12 relative overflow-hidden ${theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'border-white/10'}`}>
                {creationStatus === 'success' && <div className="absolute top-0 left-0 w-full p-2 bg-emerald-500 text-black text-center font-black text-[10px] uppercase tracking-widest">New Operator Provisioned Successfully</div>}
                {creationStatus === 'updated' && <div className="absolute top-0 left-0 w-full p-2 bg-indigo-500 text-white text-center font-black text-[10px] uppercase tracking-widest">Operator Signature Updated</div>}
                
                <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-indigo-400">{editingStaffId ? 'Update Operator Record' : 'Authorize New Operator'}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-3">
                    <label className={labelClasses}>Operator ID (Username)</label>
                    <input 
                      value={newStaffUsername} 
                      onChange={e => setNewStaffUsername(e.target.value)} 
                      className={inputClasses} 
                      placeholder="e.g., Nexus_01"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className={labelClasses}>Digital Signature (Password)</label>
                    <input 
                      type="text"
                      value={newStaffPassword} 
                      onChange={e => setNewStaffPassword(e.target.value)} 
                      className={inputClasses} 
                      placeholder="Access Key"
                    />
                  </div>
                </div>

                <div className="mb-8 space-y-3">
                  <label className={labelClasses}>Assigned Personnel Role</label>
                  <div className="flex flex-wrap gap-2">
                    {staffRoles.map(role => (
                      <button
                        key={role}
                        onClick={() => setNewStaffRole(role)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${newStaffRole === role ? 'bg-indigo-600 text-white border-indigo-500' : theme === 'light' ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 shadow-sm' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-10 space-y-4">
                  <label className={labelClasses}>Security Clearance Matrix (Permissions)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PERMISSION_OPTS.map(opt => (
                      <div 
                        key={opt.id}
                        onClick={() => handleTogglePermission(opt.id)}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all ${newStaffPermissions.includes(opt.id) ? 'bg-indigo-600/10 border-indigo-500/40 text-white' : theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-white/5 border-white/5 text-slate-500'}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${newStaffPermissions.includes(opt.id) ? 'bg-indigo-50 border-indigo-500' : 'border-slate-400'}`}>
                            {newStaffPermissions.includes(opt.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className={`text-[11px] font-black uppercase tracking-widest ${newStaffPermissions.includes(opt.id) ? (theme === 'light' ? 'text-indigo-600' : 'text-white') : 'text-slate-500'}`}>{opt.label}</span>
                        </div>
                        <p className={`text-[9px] leading-relaxed opacity-70 ${theme === 'light' ? 'text-slate-700' : ''}`}>{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleAddOrUpdateStaff} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                    {editingStaffId ? 'Confirm Record Update' : 'Provision Operator'}
                  </button>
                  {editingStaffId && <button onClick={resetStaffForm} className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'glass hover:bg-white/10'}`}>Abort Edit</button>}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 ml-2">Active Personnel Records</h3>
                {staffAccounts.length === 0 ? (
                  <div className={`glass p-16 rounded-[2.5rem] text-center border-dashed border opacity-30 ${theme === 'light' ? 'bg-white border-slate-200' : 'border-white/10'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest">No remote operators registered.</p>
                  </div>
                ) : (
                  staffAccounts.map(staff => (
                    <div key={staff.id} className={`glass p-8 rounded-3xl border flex flex-col md:flex-row justify-between items-center group transition-all gap-6 ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'border-white/5 hover:border-indigo-500/30'}`}>
                      <div className="flex items-center gap-6 w-full">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black transition-all shrink-0 ${theme === 'light' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>{staff.username.charAt(0)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className={`text-xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{staff.username}</h4>
                             <span className={`px-3 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-white/5 border-white/10 text-slate-400'}`}>{staff.role}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {staff.permissions.map(p => (
                              <span key={p} className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${theme === 'light' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10'}`}>
                                {PERMISSION_OPTS.find(o => o.id === p)?.label || p}
                              </span>
                            ))}
                            {staff.permissions.length === 0 && <span className="text-[8px] font-black text-red-500">NO PERMISSIONS</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => startEditStaff(staff)} className={`p-4 rounded-xl transition-all ${theme === 'light' ? 'hover:bg-slate-100 text-slate-600 hover:text-indigo-600' : 'hover:bg-white/5 text-slate-500 hover:text-indigo-400'}`} title="Rename/Edit">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M18.364 5.364l-1.06 1.06m0 0l-1.061-1.06m1.06 1.06l1.06 1.06m-1.06-1.06l1.061 1.06M15 7l3 3" /></svg>
                        </button>
                        <button onClick={() => deleteStaff(staff.id)} className={`p-4 rounded-xl transition-all ${theme === 'light' ? 'hover:bg-slate-100 text-slate-600 hover:text-red-600' : 'hover:bg-white/5 text-slate-500 hover:text-red-500'}`} title="Delete Operator">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelView;
