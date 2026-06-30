import { useState } from 'react';
import Icon from '../Icon';

interface Agent {
  id: string; name: string; initials: string; email: string; phone: string;
  password: string; lastPasswordChange: string; role: string;
  status: 'Active' | 'Pending' | 'Inactive'; leads: number; target: number;
  achieved: number; joinDate: string; tier: 'Tier 1' | 'Tier 2' | 'Trainee';
  bio: string; certified: boolean; teamName: string;
  avatar: string;
}

interface OpenLead {
  id: string; property: string; location: string; value: string; checked: boolean;
}

interface Props { notify: (m: string, t: 'success' | 'error' | 'info') => void; }

const fp = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const initialAgents: Agent[] = [
  { id:'1', name:'Marcus Thorne', initials:'MT', email:'marcus@agentproperti.id', phone:'+62 812 1111 2222', password:'Marc#Thr2023', lastPasswordChange:'2024-01-15', role:'Senior Curator', status:'Active', leads:24, target:2000000, achieved:1200000, joinDate:'2023-06-15', tier:'Tier 1', bio:'', certified:true, teamName:'Vanguard Curators', avatar:'https://lh3.googleusercontent.com/aida-public/AB6AXuC9NJYohLqnNSVQRcNdS32aM9RxfGFJEQ9xYIjBxZrq0wcgmnf0PWpN4Zsn3LaMTR8E2Aj_pAPAPMDeDBZVMNJVQCg_SbZdg4Yl1r8jWfEfsQRiwffr9LNbJRIzjF1JFc7bTbavQQNAdK405ah_OJn0L7VarI1bLjdl6MZG2XmDqBzkWl28OejNLVEkf85jlFd_5I_sBW-LClA1_WAZsxcgIQb08U2n4icWNgAxkuS7soFGYeIGGiSmMjonUmexKMTkoMlQCWhY8JMw' },
  { id:'2', name:'Sarah Jenkins', initials:'SJ', email:'sarah@agentproperti.id', phone:'+62 813 3333 4444', password:'Sarah!Jnk24', lastPasswordChange:'2024-02-01', role:'Lead Associate', status:'Active', leads:12, target:1500000, achieved:840000, joinDate:'2023-08-20', tier:'Tier 2', bio:'', certified:true, teamName:'Vanguard Curators', avatar:'https://lh3.googleusercontent.com/aida-public/AB6AXuDl_ZI91Kw3I0VgWnNRMkHMzuf4OYgwMNwKeuKdy0qdncXBqqFLnbLyE28EpbuqhrtaAOvjoQY5WWZj4J1pT5xg_H5tFADKXBDnBNT8NmtepVGcFFI25DkjySrbF4sCsXF0gwSpbsCyk7kuamp-STC9qboUNo0n0rwj4GtJBx80xEAqw-YKWzG3EwqCwzPjCLCp_kOfBWgPAyLm7JeVx5VMtZMUWCKoBRhDT-bmaRxZll5shH34z4SrOJXoTxDoooKgsw9-tV6VAEEA' },
  { id:'3', name:'Leon Patel', initials:'LP', email:'leon@agentproperti.id', phone:'+62 856 5555 6666', password:'Leon$Ptl01', lastPasswordChange:'2024-01-10', role:'Market Specialist', status:'Active', leads:0, target:500000, achieved:0, joinDate:'2024-01-10', tier:'Trainee', bio:'', certified:false, teamName:'Vanguard Curators', avatar:'https://lh3.googleusercontent.com/aida-public/AB6AXuAbjIbwcQ7M4Z8RlT-dvptsh-EB6q2OKfCF25swFWfo4Zu6E3RWRZw_1YTR06YAZ1Z0ohne1zPYafL_kaVdNxk11EiALnnggVSYsGz1etPUd-FVTeIJTs-LnMHrQxUz9RuDqL7YnDMzGKneQP_4lffHLyr9hNk5phGzi6tvN2fsYb831hXSfpPEgbmRprdZTDDihnoQ9auBd3r_Vc8f1ldlLIrGuxRjk9EjjQ1E1xbNetq89nFZBtVFI0MLLg8YwmjMbcsle5AMd_gQ' },
  { id:'4', name:'Diana Mercer', initials:'DM', email:'diana@agentproperti.id', phone:'+62 878 7777 8888', password:'Diana@Mrc95', lastPasswordChange:'2024-02-10', role:'Regional Director', status:'Active', leads:45, target:3000000, achieved:2100000, joinDate:'2023-03-01', tier:'Tier 1', bio:'', certified:true, teamName:'Vanguard Curators', avatar:'https://lh3.googleusercontent.com/aida-public/AB6AXuD9IZ7oVn3DVOtN7KdmVAGb1_p3EwhTRAGvxn7Qv_TtQU-6-QEOtbSxE__ymKqVSbaMqkeLbp5RG4eVHUghaDHwG3O5ED_N7Lx3sA4kXGChjArYOlh7kyRsFGEESPwCar7LIjNglhUN0NBR0Izp9E7dAW4-a8MD4GiSfOwIMt0M24SHjcDXGUE0vJhoGTdjwZY5pgH1Z_kKYr6GBv0tTriAuudOO9oJ8VieXr-9fq011X4pOM2M-f4Ayrg4KIIW7iU6yLmEEQCr_qHK' },
];

const initialPending: Agent[] = [
  { id:'10', name:'Julian Vane', initials:'JV', email:'julian@agentproperti.id', phone:'+62 812 9999 0000', password:'Julian#V24', lastPasswordChange:'2024-02-12', role:'Commercial Listings Specialist', status:'Pending', leads:0, target:500000, achieved:0, joinDate:'2024-02-12', tier:'Trainee', bio:'8+ tahun di editorial real estate. Ingin memanfaatkan tools kurasi untuk properti mewah.', certified:true, teamName:'Vanguard Curators', avatar:'https://lh3.googleusercontent.com/aida-public/AB6AXuDw-E1RMrKx5s68Ffgyvq2i_GGshK7NnuJ3gNSzUyC_W4mr6gCOHViji9ZNsxLcNdNt1OuhvaEle-ISW0h27lcgLRiB0-jAVMZb8eiPRcMRBP6O1eNXTXtD4J5dx8NekApHdE6a-Mz0yWb_V7YTcG2SwQ5yY6wDGXw-N69jmhVYt5XSriBbxbKh71URL_-7fq_BLMcch1idwH36SoziA6GnGhLRiI7pifEflO499rFgJEnsJAzVlMSbFKLjjbJJbgYQmt1VIvv4Rr5T' },
  { id:'11', name:'Elena Rossi', initials:'ER', email:'elena@agentproperti.id', phone:'+62 813 1234 5678', password:'Elena!Rs24', lastPasswordChange:'2024-02-14', role:'Digital Asset Manager', status:'Pending', leads:0, target:500000, achieved:0, joinDate:'2024-02-14', tier:'Trainee', bio:'Latar belakang di penjualan editorial volume tinggi. Ahli dalam digital storytelling.', certified:false, teamName:'Vanguard Curators', avatar:'https://lh3.googleusercontent.com/aida-public/AB6AXuDjhHHEGD9CSMPcni2obJi5bNU1YBwD6cSjFcC6JI07eI0DcBZmdanZeJd5WcknHhXhT9LfW2gkygOPGGe8MJ1Dcrsv66ZTxARm6ALgIeGCC0U0ZvdsG69YdmBlxKq5md4yeVmmvO5OxvAilRv7S1-ET1Sva8-e1RSO_lau07VQoygCi5CbFM6CZ8jlcPz2Jm0d4bm6MS03MMKjCE7rZngv2HCOw-fogOqcVYRblsnD9gXxdc3kkbtMl7vtT5u-zCarQDqj3zv9jfXI' },
];

const initialOpenLeads: OpenLead[] = [
  { id: '1', property: 'The Obsidian Suite', location: 'Editorial Dist.', value: '$2.4M', checked: false },
  { id: '2', property: 'Azure Lofts B', location: 'Coastal Quarter', value: '$1.8M', checked: false },
  { id: '3', property: 'Marble Garden', location: 'North Archive', value: '$3.2M', checked: false },
  { id: '4', property: 'Heritage Villa C', location: 'West Highlands', value: '$4.1M', checked: false },
];

const emptyForm = { name:'', email:'', phone:'', password:'', role:'Sales Agent', teamName:'Vanguard Curators', bio:'' };

const generatePassword = () => {
  const u='ABCDEFGHJKLMNPQRSTUVWXYZ',l='abcdefghjkmnpqrstuvwxyz',d='23456789',s='!@#$%&*',a=u+l+d+s;
  let pw=u[Math.floor(Math.random()*u.length)]+l[Math.floor(Math.random()*l.length)]+d[Math.floor(Math.random()*d.length)]+s[Math.floor(Math.random()*s.length)];
  for(let i=0;i<8;i++) pw+=a[Math.floor(Math.random()*a.length)];
  return pw.split('').sort(()=>Math.random()-0.5).join('');
};

const getPasswordStrength = (pw:string) => {
  if(!pw) return {label:'',color:'',percent:0};
  let sc=0; if(pw.length>=8)sc++; if(pw.length>=12)sc++; if(/[a-z]/.test(pw)&&/[A-Z]/.test(pw))sc++; if(/\d/.test(pw))sc++; if(/[^a-zA-Z\d]/.test(pw))sc++;
  if(sc<=1) return {label:'Sangat Lemah',color:'bg-error',percent:20};
  if(sc===2) return {label:'Lemah',color:'bg-error',percent:40};
  if(sc===3) return {label:'Cukup',color:'bg-tertiary',percent:60};
  if(sc===4) return {label:'Kuat',color:'bg-primary',percent:80};
  return {label:'Sangat Kuat',color:'bg-tertiary',percent:100};
};

export default function TeamManagement({ notify }: Props) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [pendingAgents, setPendingAgents] = useState<Agent[]>(initialPending);
  const [openLeads, setOpenLeads] = useState<OpenLead[]>(initialOpenLeads);
  const [assignTarget, setAssignTarget] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string,string>>({});
  const [showPw, setShowPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailAgent, setDetailAgent] = useState<Agent | null>(null);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [deleteAgent, setDeleteAgent] = useState<Agent | null>(null);
  const [showDetailPw, setShowDetailPw] = useState(false);
  const [tab, setTab] = useState<'directory' | 'kpi'>('directory');

  // Validation
  const validateForm = () => {
    const e:Record<string,string>={};
    if(!formData.name.trim()) e.name='Nama wajib diisi';
    if(!formData.email.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email='Format email tidak valid';
    if(!formData.phone.trim()) e.phone='No. telepon wajib diisi';
    if(!formData.password.trim()) e.password='Password wajib diisi';
    if(formData.password&&formData.password.length<8) e.password='Password minimal 8 karakter';
    if(formData.password&&formData.password.length>=8&&!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) e.password='Harus mengandung huruf besar, kecil, dan angka';
    setFormErrors(e); return Object.keys(e).length===0;
  };

  const validateEditForm = () => {
    const e:Record<string,string>={};
    if(!formData.name.trim()) e.name='Nama wajib diisi';
    if(!formData.email.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email='Format email tidak valid';
    if(!formData.phone.trim()) e.phone='No. telepon wajib diisi';
    if(formData.password&&formData.password.length>0&&formData.password.length<8) e.password='Password minimal 8 karakter';
    setFormErrors(e); return Object.keys(e).length===0;
  };

  // Approve/Reject pending
  const handleApprove = (agent: Agent) => {
    setPendingAgents(pendingAgents.filter(a => a.id !== agent.id));
    setAgents([{ ...agent, status: 'Active' }, ...agents]);
    notify(`${agent.name} berhasil disetujui dan bergabung ke tim!`, 'success');
  };
  const handleReject = (agent: Agent) => {
    setPendingAgents(pendingAgents.filter(a => a.id !== agent.id));
    notify(`Pendaftaran ${agent.name} ditolak.`, 'error');
  };

  // Add new recruit
  const handleAddRecruit = () => {
    if(!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(()=>{
      const initials = formData.name.split(' ').map((n:string) => n[0]).join('').toUpperCase().slice(0,2);
      const today = new Date().toISOString().split('T')[0];
      const newAgent: Agent = {
        id:String(Date.now()), name:formData.name, initials, email:formData.email,
        phone:formData.phone, password:formData.password, lastPasswordChange:today,
        role:formData.role||'Sales Agent', status:'Pending', leads:0, target:500000,
        achieved:0, joinDate:today, tier:'Trainee', bio:formData.bio, certified:false,
        teamName:formData.teamName, avatar:'',
      };
      setPendingAgents([...pendingAgents, newAgent]);
      setShowAddModal(false); setIsSubmitting(false);
      setFormData(emptyForm);
      notify(`${formData.name} berhasil didaftarkan dengan akses login Sales Agent!`,'success');
    },800);
  };

  // Edit agent
  const openEdit = (agent: Agent) => {
    setEditAgent(agent);
    setFormData({ name:agent.name, email:agent.email, phone:agent.phone, password:'', role:agent.role, teamName:agent.teamName, bio:agent.bio });
    setFormErrors({}); setShowPw(false);
    setShowEditModal(true);
  };
  const handleEdit = () => {
    if(!editAgent||!validateEditForm()) return;
    setIsSubmitting(true);
    setTimeout(()=>{
      const pwUpdate = formData.password ? { password:formData.password, lastPasswordChange:new Date().toISOString().split('T')[0] } : {};
      setAgents(agents.map(a=>a.id===editAgent.id?{...a, name:formData.name, initials:formData.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2), email:formData.email, phone:formData.phone, role:formData.role, teamName:formData.teamName, bio:formData.bio, ...pwUpdate}:a));
      setShowEditModal(false); setIsSubmitting(false);
      notify(`Data ${formData.name} berhasil diperbarui!`,'success');
    },800);
  };

  // Delete agent
  const openDelete = (agent: Agent) => { setDeleteAgent(agent); setShowDeleteModal(true); };
  const handleDelete = () => {
    if(!deleteAgent) return;
    setIsSubmitting(true);
    setTimeout(()=>{
      setAgents(agents.filter(a=>a.id!==deleteAgent.id));
      setShowDeleteModal(false); setIsSubmitting(false);
      notify(`${deleteAgent.name} berhasil dihapus dari tim.`,'success');
      setDeleteAgent(null);
    },600);
  };

  // Toggle lead checkbox
  const toggleLead = (id: string) => setOpenLeads(openLeads.map(l => l.id === id ? { ...l, checked: !l.checked } : l));
  const checkedLeads = openLeads.filter(l => l.checked);

  // Assign leads
  const handleAssignLeads = () => {
    if (!assignTarget || checkedLeads.length === 0) { notify('Pilih anggota tim dan minimal 1 lead.', 'error'); return; }
    setOpenLeads(openLeads.filter(l => !l.checked));
    notify(`${checkedLeads.length} lead berhasil ditugaskan ke ${assignTarget}!`, 'success');
    setAssignTarget('');
  };

  const tierStyle = (t: string) => t === 'Tier 1' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : t === 'Tier 2' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-highest text-on-surface-variant';
  const approvalRate = agents.length > 0 ? Math.round((agents.length / (agents.length + pendingAgents.length)) * 100) : 0;

  return (
    <div className="p-4 lg:p-10 space-y-12 max-w-[1600px] mx-auto">

      {/* ==================== PENDING APPROVALS ==================== */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-tertiary mb-2">Pendaftaran Baru</p>
            <h3 className="text-3xl font-headline font-bold">Pending Approvals</h3>
          </div>
          <button onClick={() => setShowAddModal(true)} className="text-primary font-body text-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer">
            <Icon name="person_add" className="text-base" /> Rekrut Agent Baru
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Cards */}
          {pendingAgents.map(agent => (
            <div key={agent.id} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col justify-between border-l-4 border-primary group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-dim shrink-0">
                    {agent.avatar ? <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-lg text-on-surface-variant">{agent.initials}</div>}
                  </div>
                  <div>
                    <h4 className="font-headline text-lg font-bold">{agent.name}</h4>
                    <p className="font-body text-xs text-on-surface-variant mb-1">{agent.role}</p>
                    <div className="flex items-center gap-1 text-[10px] font-label font-bold">
                      {agent.certified ? (
                        <span className="text-tertiary flex items-center gap-1"><Icon name="verified_user" className="text-xs" /> CERTIFIED LEAD</span>
                      ) : (
                        <span className="text-secondary-fixed-dim flex items-center gap-1"><Icon name="hourglass_empty" className="text-xs" /> VERIFICATION PENDING</span>
                      )}
                    </div>
                  </div>
                </div>
                {agent.bio && <p className="mt-4 text-sm font-body text-on-surface-variant line-clamp-2">"{agent.bio}"</p>}
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => handleReject(agent)} className="flex-1 bg-surface-container-high text-on-surface text-sm font-semibold py-2.5 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer">Reject</button>
                <button onClick={() => handleApprove(agent)} className="flex-1 bg-primary text-on-primary text-sm font-semibold py-2.5 rounded-lg hover:bg-primary-container transition-colors cursor-pointer">Approve</button>
              </div>
            </div>
          ))}

          {pendingAgents.length === 0 && (
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border-l-4 border-tertiary flex items-center gap-4 col-span-2">
              <Icon name="check_circle" className="text-3xl text-tertiary" />
              <div>
                <p className="font-headline text-lg font-bold">Semua Terkonfirmasi</p>
                <p className="text-sm text-on-surface-variant">Tidak ada pendaftaran yang menunggu persetujuan.</p>
              </div>
            </div>
          )}

          {/* Team Health Stats Card */}
          <div className="bg-primary-container/10 rounded-xl p-8 relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <p className="font-label text-xs uppercase tracking-widest text-primary font-bold mb-1">Team Health</p>
              <div className="text-5xl font-headline font-bold text-primary mb-2">{approvalRate}%</div>
              <p className="text-sm font-body text-on-surface-variant max-w-[220px]">Approval rating untuk rekrut baru kuartal ini. Tim berkembang secara optimal.</p>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-primary/5 select-none">analytics</span>
          </div>
        </div>
      </section>

      {/* ==================== DIRECTORY + LEAD ALLOCATION ==================== */}
      <section className="grid grid-cols-1 xl:grid-cols-4 gap-10">

        {/* Directory Table (3/4) */}
        <div className="xl:col-span-3">
          {/* Tab Switcher */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex gap-1 bg-surface-container-low rounded-lg p-1">
              <button onClick={() => setTab('directory')} className={`px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-all flex items-center gap-2 ${tab === 'directory' ? 'bg-white shadow-sm text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}>
                <Icon name="group" className="text-base" /> Active Directory
              </button>
              <button onClick={() => setTab('kpi')} className={`px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-all flex items-center gap-2 ${tab === 'kpi' ? 'bg-white shadow-sm text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}>
                <Icon name="track_changes" className="text-base" /> Target KPI
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => notify('Filter diterapkan', 'info')} className="bg-surface-container px-4 py-2 rounded-lg text-xs font-label font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors cursor-pointer">
                <Icon name="filter_list" className="text-sm" /> FILTER
              </button>
              <button onClick={() => notify('Export data...', 'info')} className="bg-surface-container px-4 py-2 rounded-lg text-xs font-label font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors cursor-pointer">
                <Icon name="download" className="text-sm" /> EXPORT
              </button>
            </div>
          </div>

          {/* Directory Tab */}
          {tab === 'directory' && (
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label text-[10px] uppercase tracking-widest border-b border-outline-variant/10">
                    <th className="px-8 py-5">Member Name</th>
                    <th className="px-6 py-5">Role</th>
                    <th className="px-6 py-5">Active Leads</th>
                    <th className="px-6 py-5">Performance</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm divide-y divide-outline-variant/10">
                  {agents.map(agent => (
                    <tr key={agent.id} className="group hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-dim overflow-hidden shrink-0">
                            {agent.avatar ? <img src={agent.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-on-surface-variant">{agent.initials}</div>}
                          </div>
                          <span className="font-semibold text-on-surface">{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{agent.role}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${agent.leads > 0 ? (agent.leads > 20 ? 'bg-primary' : 'bg-tertiary') : 'bg-error'}`} />
                          {agent.leads} Active
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-label font-bold rounded uppercase ${tierStyle(agent.tier)}`}>{agent.tier}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setDetailAgent(agent); setShowDetailPw(false); setShowDetailModal(true); }} className="text-primary hover:bg-primary-fixed p-1.5 rounded-lg transition-colors cursor-pointer" title="Detail">
                            <Icon name="visibility" className="text-lg" />
                          </button>
                          <button onClick={() => openEdit(agent)} className="text-primary hover:bg-primary-fixed p-1.5 rounded-lg transition-colors cursor-pointer" title="Edit">
                            <Icon name="edit" className="text-lg" />
                          </button>
                          <button onClick={() => openDelete(agent)} className="text-on-surface-variant hover:bg-error-container hover:text-error p-1.5 rounded-lg transition-colors cursor-pointer" title="Hapus">
                            <Icon name="delete" className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-surface-container-low/30 flex justify-center">
                <button onClick={() => notify('Load more...', 'info')} className="text-primary font-label text-[10px] font-bold tracking-widest uppercase hover:text-primary-container transition-colors cursor-pointer">Load more members</button>
              </div>
            </div>
          )}

          {/* KPI Tab */}
          {tab === 'kpi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map(a => {
                const pct = Math.round((a.achieved / a.target) * 100);
                return (
                  <div key={a.id} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-dim shrink-0">
                        {a.avatar ? <img src={a.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-sm text-on-surface-variant">{a.initials}</div>}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-xs text-on-surface-variant">{a.role} • {a.leads} leads aktif</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${pct >= 80 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : pct >= 50 ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-error-container text-on-error-container'}`}>{pct}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant mb-2">
                      <span>Achieved: {fp(a.achieved)}</span><span>Target: {fp(a.target)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? 'bg-gradient-to-r from-tertiary to-tertiary-container' : pct >= 50 ? 'bg-gradient-to-r from-primary to-primary-container' : 'bg-error'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lead Allocation Sidebar (1/4) */}
        <aside className="space-y-6 xl:sticky xl:top-28 xl:h-[calc(100vh-140px)] flex flex-col">
          {/* Lead Allocation Panel */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
            <h4 className="font-headline text-lg font-bold mb-4">Lead Allocation</h4>
            <p className="text-xs font-body text-on-surface-variant mb-6 leading-relaxed">Pilih anggota tim untuk menugaskan lead properti baru secara manual.</p>

            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <label className="text-[10px] font-label font-bold text-on-surface-variant/70 uppercase">Target Member</label>
                <select value={assignTarget} onChange={e => setAssignTarget(e.target.value)} className="w-full bg-surface-container border-none rounded-lg text-sm font-body py-3 focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none">
                  <option value="">Cari dan pilih...</option>
                  {agents.map(a => <option key={a.id} value={a.name}>{a.name} ({a.leads} leads)</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-label font-bold text-on-surface-variant/70 uppercase">Open Leads</label>
                <div className="bg-surface-container rounded-lg p-3 max-h-52 overflow-y-auto space-y-2 no-scrollbar">
                  {openLeads.map(lead => (
                    <div key={lead.id} onClick={() => toggleLead(lead.id)} className={`flex items-center gap-3 p-2.5 bg-surface-container-lowest rounded border cursor-pointer transition-colors ${lead.checked ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/10 hover:border-primary/50'}`}>
                      <input type="checkbox" checked={lead.checked} onChange={() => {}} className="rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" />
                      <div className="flex-1">
                        <div className="text-[11px] font-bold">{lead.property}</div>
                        <div className="text-[9px] text-on-surface-variant">{lead.location} · {lead.value}</div>
                      </div>
                    </div>
                  ))}
                  {openLeads.length === 0 && <p className="text-xs text-on-surface-variant text-center py-4">Semua lead sudah ditugaskan.</p>}
                </div>
              </div>
            </div>

            <button onClick={handleAssignLeads} disabled={checkedLeads.length === 0} className={`mt-6 w-full py-3 font-body text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/10 cursor-pointer ${checkedLeads.length > 0 ? 'bg-primary text-on-primary hover:bg-primary-container' : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'}`}>
              {checkedLeads.length > 0 ? `Assign ${checkedLeads.length} Lead${checkedLeads.length > 1 ? 's' : ''}` : 'Pilih Lead untuk Assign'}
            </button>
          </div>

          {/* Audit Quick Jump */}
          <div className="bg-surface-container-high rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="history_edu" className="text-tertiary" />
              <h4 className="font-headline text-lg font-bold">Audit Portal</h4>
            </div>
            <p className="text-xs font-body text-on-surface-variant mb-4 leading-relaxed">Review log aktivitas lengkap untuk setiap anggota tim guna memastikan kepatuhan dan kualitas.</p>
            <button onClick={() => notify('Membuka audit logs...', 'info')} className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all cursor-pointer">
              Access Audit Logs <Icon name="arrow_forward" className="text-base" />
            </button>
          </div>
        </aside>
      </section>

      {/* ==================== MODALS ==================== */}

      {/* Add / Edit Shared Form Content */}
      {(showAddModal || (showEditModal && editAgent)) && (() => {
        const isAdd = showAddModal;
        const pwStr = getPasswordStrength(formData.password);
        const close = () => { if(isAdd) setShowAddModal(false); else setShowEditModal(false); setFormData(emptyForm); setFormErrors({}); };
        const submit = isAdd ? handleAddRecruit : handleEdit;
        const title = isAdd ? 'Rekrut Sales Agent Baru' : `Edit Data — ${editAgent?.name}`;
        const subtitle = isAdd ? 'Daftarkan sales agent baru dengan kredensial login.' : 'Perbarui data agent. Kosongkan password jika tidak ingin mengubah.';
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) close(); }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up my-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
                <div><h3 className="font-headline text-xl font-bold">{title}</h3><p className="text-xs text-on-surface-variant mt-1">{subtitle}</p></div>
                <button onClick={close} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" /></button>
              </div>
              <form className="p-6 space-y-4" onSubmit={e=>{e.preventDefault();submit();}}>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Nama Lengkap *</label><input value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="Nama lengkap" className={`w-full px-4 py-3 bg-surface-container-low border rounded-lg text-sm outline-none ${formErrors.name?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{formErrors.name&&<p className="text-xs text-error mt-1">{formErrors.name}</p>}</div>
                  <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Email *</label><input type="email" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} placeholder="email@agentproperti.id" className={`w-full px-4 py-3 bg-surface-container-low border rounded-lg text-sm outline-none ${formErrors.email?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{formErrors.email&&<p className="text-xs text-error mt-1">{formErrors.email}</p>}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">No. Telepon *</label><input value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} placeholder="+62 812 3456 7890" className={`w-full px-4 py-3 bg-surface-container-low border rounded-lg text-sm outline-none ${formErrors.phone?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{formErrors.phone&&<p className="text-xs text-error mt-1">{formErrors.phone}</p>}</div>
                  <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Nama Tim</label><input value={formData.teamName} onChange={e=>setFormData({...formData,teamName:e.target.value})} placeholder="Vanguard Curators" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"/></div>
                </div>
                <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Role / Spesialisasi</label><input value={formData.role} onChange={e=>setFormData({...formData,role:e.target.value})} placeholder="Sales Agent" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"/></div>

                {/* Password Section */}
                <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="lock" className="text-base text-primary"/> Kredensial Login {isAdd?'*':'(Opsional)'}</p>
                    <button type="button" onClick={()=>{const pw=generatePassword();setFormData({...formData,password:pw});setShowPw(true);}} className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1"><Icon name="casino" className="text-sm"/>Generate</button>
                  </div>
                  <div className="relative">
                    <input type={showPw?'text':'password'} value={formData.password} onChange={e=>setFormData({...formData,password:e.target.value})} placeholder={isAdd?'Minimal 8 karakter':'Kosongkan jika tidak diubah'} className={`w-full px-4 py-3 pr-20 bg-white border rounded-lg text-sm outline-none ${formErrors.password?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button type="button" onClick={()=>setShowPw(!showPw)} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name={showPw?'visibility_off':'visibility'} className="text-base"/></button>
                      {formData.password&&<button type="button" onClick={()=>{navigator.clipboard.writeText(formData.password);notify('Password disalin!','success');}} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name="content_copy" className="text-base"/></button>}
                    </div>
                  </div>
                  {formErrors.password&&<p className="text-xs text-error">{formErrors.password}</p>}
                  {formData.password&&(
                    <div className="space-y-1">
                      <div className="flex justify-between"><span className="text-[10px] font-label uppercase text-on-surface-variant">Kekuatan</span><span className={`text-[10px] font-bold font-label uppercase ${pwStr.percent>=80?'text-primary':pwStr.percent>=60?'text-tertiary':'text-error'}`}>{pwStr.label}</span></div>
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-300 ${pwStr.color}`} style={{width:`${pwStr.percent}%`}}/></div>
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        {[{c:formData.password.length>=8,t:'Min. 8 karakter'},{c:/[A-Z]/.test(formData.password),t:'Huruf besar'},{c:/[a-z]/.test(formData.password),t:'Huruf kecil'},{c:/\d/.test(formData.password),t:'Angka'},{c:/[^a-zA-Z\d]/.test(formData.password),t:'Karakter khusus'},{c:formData.password.length>=12,t:'12+ karakter'}].map((r,i)=>(
                          <span key={i} className={`text-[10px] flex items-center gap-1 ${r.c?'text-primary':'text-on-surface-variant/40'}`}><Icon name={r.c?'check_circle':'radio_button_unchecked'} className="text-xs"/>{r.t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Bio / Catatan</label><textarea value={formData.bio} onChange={e=>setFormData({...formData,bio:e.target.value})} placeholder="Latar belakang pengalaman..." rows={2} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/></div>

                <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
                  <button type="button" onClick={close} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface cursor-pointer">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                    {isSubmitting?<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Menyimpan...</>:isAdd?<><Icon name="person_add"/>Daftarkan Agent</>:<><Icon name="save"/>Simpan Perubahan</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation */}
      {showDeleteModal && deleteAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in" onClick={e=>{if(e.target===e.currentTarget)setShowDeleteModal(false);}}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up p-8" onClick={e=>e.stopPropagation()}>
            <div className="w-16 h-16 mx-auto rounded-full bg-error-container flex items-center justify-center mb-6"><Icon name="delete_forever" className="text-3xl text-error"/></div>
            <div className="text-center mb-6"><h3 className="font-headline text-xl font-bold mb-2">Hapus Agent?</h3><p className="text-on-surface-variant">Agent <span className="font-semibold text-on-surface">"{deleteAgent.name}"</span> akan dihapus dari tim dan kehilangan akses login.</p></div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-dim shrink-0">{deleteAgent.avatar?<img src={deleteAgent.avatar} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center font-bold text-on-surface-variant">{deleteAgent.initials}</div>}</div>
              <div className="flex-1 min-w-0"><p className="font-bold truncate">{deleteAgent.name}</p><p className="text-xs text-on-surface-variant">{deleteAgent.email} • {deleteAgent.role}</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowDeleteModal(false)} className="flex-1 py-3 border border-outline font-semibold rounded-xl hover:bg-surface cursor-pointer">Batal</button>
              <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 py-3 bg-error text-white font-semibold rounded-xl hover:opacity-90 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Menghapus...</>:<><Icon name="delete"/>Ya, Hapus</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Detail Modal */}
      {showDetailModal && detailAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) setShowDetailModal(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up my-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-dim shrink-0">
                    {detailAgent.avatar ? <img src={detailAgent.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-xl text-on-surface-variant">{detailAgent.initials}</div>}
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold">{detailAgent.name}</h3>
                    <p className="text-sm text-on-surface-variant">{detailAgent.role} • {detailAgent.teamName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-[10px] font-label font-bold rounded uppercase ${tierStyle(detailAgent.tier)}`}>{detailAgent.tier}</span>
                      <span className={`w-2 h-2 rounded-full ${detailAgent.status === 'Active' ? 'bg-primary' : 'bg-tertiary'}`} />
                      <span className="text-xs">{detailAgent.status}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-low rounded-xl p-5 space-y-3">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="person" className="text-primary text-sm"/>Informasi Kontak</h4>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Email</span><span className="font-medium text-primary">{detailAgent.email}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Telepon</span><span className="font-medium">{detailAgent.phone}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Bergabung</span><span className="font-medium">{new Date(detailAgent.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                </div>
                <div className="bg-surface-container-low rounded-xl p-5 space-y-3">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="lock" className="text-primary text-sm"/>Kredensial Login</h4>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Password</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-sm">{showDetailPw?detailAgent.password:'•'.repeat(Math.min(detailAgent.password.length,10))}</span>
                      <button onClick={()=>setShowDetailPw(!showDetailPw)} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name={showDetailPw?'visibility_off':'visibility'} className="text-xs"/></button>
                      <button onClick={()=>{navigator.clipboard.writeText(detailAgent.password);notify('Password disalin!','success');}} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name="content_copy" className="text-xs"/></button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Terakhir diubah</span><span className="font-medium">{detailAgent.lastPasswordChange}</span></div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Kekuatan</span>
                    <div className="flex items-center gap-2"><div className="w-12 h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className={`h-full rounded-full ${getPasswordStrength(detailAgent.password).color}`} style={{width:`${getPasswordStrength(detailAgent.password).percent}%`}}/></div><span className="text-xs">{getPasswordStrength(detailAgent.password).label}</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-5 space-y-3 mt-4">
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="insights" className="text-primary text-sm"/>Performa</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center"><p className="text-2xl font-headline font-bold text-primary">{detailAgent.leads}</p><p className="text-xs text-on-surface-variant">Active Leads</p></div>
                  <div className="bg-white rounded-lg p-4 text-center"><p className="text-2xl font-headline font-bold text-tertiary">{Math.round((detailAgent.achieved / detailAgent.target) * 100)}%</p><p className="text-xs text-on-surface-variant">KPI Progress</p></div>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant"><span>Achieved: {fp(detailAgent.achieved)}</span><span>Target: {fp(detailAgent.target)}</span></div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{width:`${Math.min(Math.round((detailAgent.achieved/detailAgent.target)*100),100)}%`}}/></div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-outline-variant/10">
                <button onClick={()=>{setShowDetailModal(false);openDelete(detailAgent);}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error-container transition-colors cursor-pointer flex items-center gap-2"><Icon name="delete"/>Hapus</button>
                <button onClick={()=>{setShowDetailModal(false);openEdit(detailAgent);}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2"><Icon name="edit"/>Edit Agent</button>
                <button onClick={() => setShowDetailModal(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
