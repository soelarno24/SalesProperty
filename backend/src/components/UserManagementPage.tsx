import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  lastPasswordChange: string;
  role: 'Leader Sales' | 'Sales Agent' | 'Admin';
  status: 'Active' | 'Pending' | 'Blocked';
  registrationDate: string;
  avatar: string;
  teamName: string;
  totalSales: number;
  activeDeals: number;
  notes: string;
}

const avatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDtlG2dzi_BEU4teoBV_y0kia368wbIl1iIpq3vkVh-gEED17yWtYrX2obSAR-LYjIeW8Ql8YBx5Ah3Rl-KCh3novcopfmK0alh136jWie2AWQISH9RFId3t1lGQAggF7Tf_O4LRWOfF3sJ0oe2oj7-r4BPB4SiJhjNAatnLP123Jow-zn-48uoimtquU-COmB8q9pVls3t8TrPUDVfttGc3dYKYTDpvgAdaHYddFw3Ghb_tRiYELSF-wkBqzy0ggztMAj2rZDTSRda',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCHPAZxQZRQRrF-1bN4lf7CtgXNC2F_s2R3fC0HnGFhv6PNRzed6E75sv3ZgPLe9HB-q9c8F4A-MhdTvKLZTCLzTjVCAqSMHijl3ADrk1kiOamDnDOM2W1VsqBD92MukvnCoIeuQnvl2H0GBVGwK0kUXTQIfU4ZjZojSaoPHqKDEKH3Ka2gZ19CjDJybHrNR0XeR6rXpCPtlZlnrZhuglQqutvYPtv-RWvy4Pkm3MvfteQ5-plUXNxk5iWvvdahwymQb3IXF85Rf28n',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCNsyQPb_AbDy2qc9p4SK3lgCYaVd9hqsup0aJ1-fwgmVVVzSXcrSeJP8RkUv7fmDOuWHtM03GHKtKLeeoxVzCb1qRWY5KfiJ8wPddsLZ_3ITMSWeV7vMDXCzt9LLOwof8obYKACosFeTmRsp03yqzbRWIEdPZb1bMRf87qEzvvWjIZ3CjFXnA7qFynFT0oYQVKtAL5IHpDdhiuCnMjO0-rolQ89FkKzfHpBF4nCjErzlStZaH-nT-OV_vu6tVbA8Yku3St-UKmqbKJ',
];

const initialUsers: User[] = [
  { id:'1', name:'Eleanor Thorne', email:'ethorne@agentproperti.id', phone:'+62 812 3456 7890', password:'Elean0r!2023', lastPasswordChange:'2024-01-10', role:'Leader Sales', status:'Active', registrationDate:'2023-10-12', avatar:avatars[0], teamName:'Vanguard Curators', totalSales:42, activeDeals:8, notes:'Top performer Q4 2023' },
  { id:'2', name:'Julian Sterling', email:'j.sterling@agentproperti.id', phone:'+62 813 9876 5432', password:'Julian$trl24', lastPasswordChange:'2024-01-04', role:'Sales Agent', status:'Pending', registrationDate:'2024-01-04', avatar:avatars[1], teamName:'Vanguard Curators', totalSales:0, activeDeals:2, notes:'Waiting document verification' },
  { id:'3', name:'Marcus Aurel', email:'m.aurel@agentproperti.id', phone:'+62 856 1234 5678', password:'Marc#Aur99', lastPasswordChange:'2023-11-05', role:'Sales Agent', status:'Blocked', registrationDate:'2023-09-28', avatar:'', teamName:'Metropolis Collective', totalSales:15, activeDeals:0, notes:'Violated compliance policy on 2024-01-20' },
  { id:'4', name:'Helena Vance', email:'hvance@agentproperti.id', phone:'+62 878 2345 6789', password:'H3lena!Vnc', lastPasswordChange:'2024-02-15', role:'Leader Sales', status:'Active', registrationDate:'2023-11-15', avatar:avatars[2], teamName:'Zenith Heritage', totalSales:67, activeDeals:12, notes:'Regional leader for West District' },
  { id:'5', name:'Rina Sari', email:'rina.sari@agentproperti.id', phone:'+62 812 8765 4321', password:'RinaS@ri2024', lastPasswordChange:'2024-01-20', role:'Sales Agent', status:'Active', registrationDate:'2023-12-01', avatar:'', teamName:'Zenith Heritage', totalSales:23, activeDeals:5, notes:'' },
  { id:'6', name:'Budi Pratama', email:'budi.p@agentproperti.id', phone:'+62 857 3456 7891', password:'Budi#Prtm01', lastPasswordChange:'2024-02-10', role:'Sales Agent', status:'Pending', registrationDate:'2024-02-10', avatar:'', teamName:'Vanguard Curators', totalSales:0, activeDeals:0, notes:'New recruit from competitor firm' },
];

const tabs = ['All Users', 'Leaders Only', 'Agents Only', 'Active', 'Pending', 'Blocked'] as const;

const emptyForm = {
  name:'', email:'', phone:'', password:'', role:'Sales Agent' as User['role'], status:'Pending' as User['status'], teamName:'', notes:'',
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All Users');
  const [showToast, setShowToast] = useState<{message:string;type:'success'|'error'|'info'}|null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showResetPwModal, setShowResetPwModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User|null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPwValue, setResetPwValue] = useState('');
  const [showResetPw, setShowResetPw] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const notify = (message:string, type:'success'|'error'|'info'='info') => { setShowToast({message,type}); setTimeout(()=>setShowToast(null),3000); };

  const filteredUsers = users.filter(u => {
    const matchSearch = searchQuery ? u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.teamName.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    if (activeTab === 'Leaders Only') return matchSearch && u.role === 'Leader Sales';
    if (activeTab === 'Agents Only') return matchSearch && u.role === 'Sales Agent';
    if (activeTab === 'Active') return matchSearch && u.status === 'Active';
    if (activeTab === 'Pending') return matchSearch && u.status === 'Pending';
    if (activeTab === 'Blocked') return matchSearch && u.status === 'Blocked';
    return matchSearch;
  });

  const totalUsers = users.length;
  const leaders = users.filter(u => u.role === 'Leader Sales').length;
  const pending = users.filter(u => u.status === 'Pending').length;
  const blocked = users.filter(u => u.status === 'Blocked').length;

  useEffect(() => {
    const h = (e:KeyboardEvent) => { if(e.key==='Escape'){ setShowAddModal(false); setShowEditModal(false); setShowDeleteModal(false); setShowDetailModal(false); setShowBlockModal(false); setShowResetPwModal(false); }};
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[]);

  useEffect(()=>{ if(showAddModal){ setFormData(emptyForm); setFormErrors({}); }},[showAddModal]);
  useEffect(()=>{
    if(showEditModal && selectedUser){
      setFormData({ name:selectedUser.name, email:selectedUser.email, phone:selectedUser.phone, password:'', role:selectedUser.role, status:selectedUser.status, teamName:selectedUser.teamName, notes:selectedUser.notes });
      setFormErrors({});
    }
  },[showEditModal, selectedUser]);

  const validateForm = (isAdd = false) => {
    const e:Record<string,string> = {};
    if(!formData.name.trim()) e.name = 'Nama wajib diisi';
    if(!formData.email.trim()) e.email = 'Email wajib diisi';
    if(formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Format email tidak valid';
    if(!formData.phone.trim()) e.phone = 'No. telepon wajib diisi';
    if(!formData.teamName.trim()) e.teamName = 'Nama tim wajib diisi';
    if(isAdd && !formData.password.trim()) e.password = 'Password wajib diisi untuk user baru';
    if(formData.password && formData.password.length < 8) e.password = 'Password minimal 8 karakter';
    if(formData.password && formData.password.length >= 8 && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) e.password = 'Password harus mengandung huruf besar, kecil, dan angka';
    setFormErrors(e); return Object.keys(e).length === 0;
  };

  const handleAdd = () => { if(!validateForm(true)) return; setIsSubmitting(true); setTimeout(()=>{
    const today = new Date().toISOString().split('T')[0];
    const newUser: User = { id:String(Date.now()), ...formData, lastPasswordChange:today, registrationDate:today, avatar:'', totalSales:0, activeDeals:0 };
    setUsers([newUser, ...users]); setShowAddModal(false); setIsSubmitting(false);
    notify(`User "${formData.name}" berhasil ditambahkan!`,'success');
  },800);};

  const handleEdit = () => { if(!validateForm()||!selectedUser) return; setIsSubmitting(true); setTimeout(()=>{
    const updatedData = { ...formData };
    const passwordUpdate = updatedData.password
      ? { password: updatedData.password, lastPasswordChange: new Date().toISOString().split('T')[0] }
      : { password: selectedUser.password };
    const { password: _pw, ...restForm } = updatedData;
    void _pw;
    setUsers(users.map(u=>u.id===selectedUser.id?{...u,...restForm,...passwordUpdate}:u));
    setShowEditModal(false); setIsSubmitting(false);
    notify(`User "${formData.name}" berhasil diperbarui!`,'success');
  },800);};

  const handleDelete = () => { if(!selectedUser) return; setIsSubmitting(true); setTimeout(()=>{
    setUsers(users.filter(u=>u.id!==selectedUser.id));
    setShowDeleteModal(false); setIsSubmitting(false);
    notify(`User "${selectedUser.name}" berhasil dihapus!`,'success'); setSelectedUser(null);
  },600);};

  const handleBlock = (action:'block'|'unblock') => { if(!selectedUser) return; setIsSubmitting(true); setTimeout(()=>{
    setUsers(users.map(u=>u.id===selectedUser.id?{...u, status: action==='block'?'Blocked':'Active'}:u));
    setShowBlockModal(false); setIsSubmitting(false);
    notify(`User "${selectedUser.name}" berhasil ${action==='block'?'diblokir':'dibuka blokirnya'}!`,'success');
  },600);};

  const handleVerify = (user:User) => { setIsSubmitting(true); setTimeout(()=>{
    setUsers(users.map(u=>u.id===user.id?{...u,status:'Active'}:u));
    setIsSubmitting(false); notify(`User "${user.name}" berhasil diverifikasi!`,'success');
  },500);};

  const getInitials = (name:string) => name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);

  const generatePassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const digits = '23456789';
    const specials = '!@#$%&*';
    const all = upper + lower + digits + specials;
    let pw = upper[Math.floor(Math.random()*upper.length)]
           + lower[Math.floor(Math.random()*lower.length)]
           + digits[Math.floor(Math.random()*digits.length)]
           + specials[Math.floor(Math.random()*specials.length)];
    for(let i=0;i<8;i++) pw += all[Math.floor(Math.random()*all.length)];
    return pw.split('').sort(()=>Math.random()-0.5).join('');
  };

  const getPasswordStrength = (pw:string): {label:string; color:string; percent:number} => {
    if(!pw) return {label:'',color:'',percent:0};
    let score = 0;
    if(pw.length >= 8) score++;
    if(pw.length >= 12) score++;
    if(/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if(/\d/.test(pw)) score++;
    if(/[^a-zA-Z\d]/.test(pw)) score++;
    if(score <= 1) return {label:'Sangat Lemah', color:'bg-error', percent:20};
    if(score === 2) return {label:'Lemah', color:'bg-error', percent:40};
    if(score === 3) return {label:'Cukup', color:'bg-tertiary', percent:60};
    if(score === 4) return {label:'Kuat', color:'bg-primary', percent:80};
    return {label:'Sangat Kuat', color:'bg-tertiary', percent:100};
  };

  const handleResetPassword = () => {
    if(!selectedUser || !resetPwValue) return;
    if(resetPwValue.length < 8) { notify('Password minimal 8 karakter!','error'); return; }
    setIsSubmitting(true);
    setTimeout(()=>{
      setUsers(users.map(u=>u.id===selectedUser.id?{...u, password:resetPwValue, lastPasswordChange:new Date().toISOString().split('T')[0]}:u));
      setShowResetPwModal(false); setIsSubmitting(false); setResetPwValue('');
      notify(`Password untuk "${selectedUser.name}" berhasil direset!`,'success');
    },600);
  };

  const maskPassword = (pw:string) => '•'.repeat(Math.min(pw.length, 12));

  const daysSinceChange = (date:string) => {
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000*60*60*24));
  };

  const StatusDot = ({status}:{status:User['status']}) => {
    const color = status==='Active'?'bg-primary animate-pulse':status==='Pending'?'bg-tertiary':'bg-error';
    return <span className={`w-2 h-2 rounded-full ${color}`}/>;
  };

  const RoleBadge = ({role}:{role:User['role']}) => {
    const s = role==='Leader Sales'?'bg-tertiary/10 text-tertiary':role==='Admin'?'bg-primary/10 text-primary':'bg-secondary-container text-on-secondary-container';
    return <span className={`px-3 py-1 text-[10px] font-bold font-label uppercase tracking-widest rounded-full ${s}`}>{role}</span>;
  };

  const ModalBackdrop = ({children,onClose,wide=false}:{children:React.ReactNode;onClose:()=>void;wide?:boolean}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={e=>{if(e.target===e.currentTarget) onClose();}}>
      <div ref={modalRef} className={`bg-white rounded-2xl shadow-2xl ${wide?'w-full max-w-4xl':'w-full max-w-lg'} max-h-[90vh] overflow-y-auto animate-fade-in-up my-8`} onClick={e=>e.stopPropagation()}>{children}</div>
    </div>
  );

  const FI = ({label,name,type='text',placeholder,value,onChange,error}:{label:string;name:string;type?:string;placeholder?:string;value:string|number;onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;error?:string}) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-4 py-3 bg-surface-container-low border rounded-lg text-sm outline-none transition-all ${error?'border-error focus:ring-2 focus:ring-error/20':'border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-primary'}`}/>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );

  const FS = ({label,value,onChange,options}:{label:string;value:string;onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void;options:{value:string;label:string}[]}) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <select value={value} onChange={onChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer">
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  const Spinner = () => <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;

  const UserFormFields = ({isAdd = false}:{isAdd?:boolean}) => {
    const pwStrength = getPasswordStrength(formData.password);
    return (
    <>
      <div className="grid grid-cols-2 gap-5">
        <FI label="Nama Lengkap *" name="name" placeholder="Ahmad Wijaya" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} error={formErrors.name}/>
        <FI label="Email *" name="email" type="email" placeholder="nama@agentproperti.id" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} error={formErrors.email}/>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <FI label="No. Telepon *" name="phone" placeholder="+62 812 3456 7890" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} error={formErrors.phone}/>
        <FI label="Nama Tim *" name="teamName" placeholder="Vanguard Curators" value={formData.teamName} onChange={e=>setFormData({...formData,teamName:e.target.value})} error={formErrors.teamName}/>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <FS label="Role" value={formData.role} onChange={e=>setFormData({...formData,role:e.target.value as User['role']})} options={[{value:'Sales Agent',label:'Sales Agent'},{value:'Leader Sales',label:'Leader Sales'},{value:'Admin',label:'Admin'}]}/>
        <FS label="Status" value={formData.status} onChange={e=>setFormData({...formData,status:e.target.value as User['status']})} options={[{value:'Pending',label:'Pending'},{value:'Active',label:'Active'},{value:'Blocked',label:'Blocked'}]}/>
      </div>

      {/* Password Section */}
      <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
            <Icon name="lock" className="text-base text-primary"/> Kredensial Login {isAdd ? '*' : '(Opsional)'}
          </p>
          <button type="button" onClick={()=>{const pw=generatePassword();setFormData({...formData,password:pw});setShowPassword(true);}} className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1">
            <Icon name="casino" className="text-sm"/> Generate Password
          </button>
        </div>
        <div className="space-y-1.5">
          <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password {isAdd ? '*' : '(kosongkan jika tidak diubah)'}</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={e=>setFormData({...formData,password:e.target.value})}
              placeholder={isAdd ? 'Minimal 8 karakter' : 'Kosongkan jika tidak ingin mengubah'}
              className={`w-full px-4 py-3 pr-24 bg-white border rounded-lg text-sm outline-none transition-all ${formErrors.password ? 'border-error focus:ring-2 focus:ring-error/20' : 'border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-primary'}`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button type="button" onClick={()=>setShowPassword(!showPassword)} className="p-1.5 text-on-surface-variant hover:text-primary rounded transition-colors cursor-pointer" title={showPassword?'Sembunyikan':'Tampilkan'}>
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-lg"/>
              </button>
              {formData.password && (
                <button type="button" onClick={()=>{navigator.clipboard.writeText(formData.password);notify('Password disalin ke clipboard!','success');}} className="p-1.5 text-on-surface-variant hover:text-primary rounded transition-colors cursor-pointer" title="Salin">
                  <Icon name="content_copy" className="text-lg"/>
                </button>
              )}
            </div>
          </div>
          {formErrors.password && <p className="text-xs text-error font-medium">{formErrors.password}</p>}
        </div>
        {/* Strength Indicator */}
        {formData.password && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Kekuatan Password</span>
              <span className={`text-[10px] font-bold font-label uppercase tracking-widest ${pwStrength.percent>=80?'text-primary':pwStrength.percent>=60?'text-tertiary':'text-error'}`}>{pwStrength.label}</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${pwStrength.color}`} style={{width:`${pwStrength.percent}%`}}/>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
              {[
                {check: formData.password.length >= 8, text: 'Minimal 8 karakter'},
                {check: /[A-Z]/.test(formData.password), text: 'Huruf besar (A-Z)'},
                {check: /[a-z]/.test(formData.password), text: 'Huruf kecil (a-z)'},
                {check: /\d/.test(formData.password), text: 'Angka (0-9)'},
                {check: /[^a-zA-Z\d]/.test(formData.password), text: 'Karakter khusus (!@#)'},
                {check: formData.password.length >= 12, text: '12+ karakter (bonus)'},
              ].map((rule,i)=>(
                <li key={i} className={`text-[11px] flex items-center gap-1.5 ${rule.check?'text-primary':'text-on-surface-variant/50'}`}>
                  <Icon name={rule.check?'check_circle':'radio_button_unchecked'} className="text-sm"/>
                  {rule.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Catatan Internal</label>
        <textarea value={formData.notes} onChange={e=>setFormData({...formData,notes:e.target.value})} placeholder="Catatan tambahan..." rows={2} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/>
      </div>
    </>
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 text-xs font-label text-on-surface-variant mb-2 uppercase tracking-widest">
            <span className="text-primary">Admin</span>
            <Icon name="chevron_right" className="text-[14px]"/>
            <span className="text-on-surface font-bold">User Directory</span>
          </nav>
          <h2 className="font-headline text-4xl font-bold text-on-surface leading-tight">User Management</h2>
          <p className="text-on-surface-variant mt-2 max-w-2xl font-body">Kelola direktori Leader Sales dan Sales Agent. Verifikasi pendaftaran baru, pantau status performa, atau terapkan pemblokiran untuk menjaga integritas katalog.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>notify('Export CSV dimulai...','info')} className="px-6 py-2.5 bg-surface-container-high text-primary font-semibold font-label rounded-lg flex items-center gap-2 hover:bg-surface-dim transition-all cursor-pointer">
            <Icon name="file_download"/> Export Records
          </button>
          <button onClick={()=>setShowAddModal(true)} className="px-6 py-2.5 bg-primary text-white font-semibold font-label rounded-lg flex items-center gap-2 shadow-sm hover:opacity-90 transition-all cursor-pointer">
            <Icon name="person_add"/> Onboard Agent
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-surface-container-lowest rounded-xl flex items-center gap-4 border border-outline-variant/10">
          <div className="w-12 h-12 bg-primary-fixed text-on-primary-fixed-variant rounded-full flex items-center justify-center"><Icon name="group"/></div>
          <div><p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Total Users</p><p className="text-2xl font-headline font-bold text-on-surface">{totalUsers}</p></div>
        </div>
        <div className="p-6 bg-surface-container-lowest rounded-xl flex items-center gap-4 border border-outline-variant/10">
          <div className="w-12 h-12 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full flex items-center justify-center"><Icon name="verified_user"/></div>
          <div><p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Leaders</p><p className="text-2xl font-headline font-bold text-on-surface">{leaders}</p></div>
        </div>
        <div className="p-6 bg-surface-container-lowest rounded-xl flex items-center gap-4 border border-outline-variant/10">
          <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center"><Icon name="pending_actions"/></div>
          <div><p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Pending</p><p className="text-2xl font-headline font-bold text-on-surface">{pending}</p></div>
        </div>
        <div className="p-6 bg-error-container/20 rounded-xl flex items-center gap-4 border border-error/5">
          <div className="w-12 h-12 bg-error-container text-on-error-container rounded-full flex items-center justify-center"><Icon name="block"/></div>
          <div><p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Blocked</p><p className="text-2xl font-headline font-bold text-error">{blocked}</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant ml-2">Quick Filters:</span>
          {tabs.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`px-4 py-1.5 text-xs font-semibold rounded-full font-label transition-colors cursor-pointer ${activeTab===tab?'bg-primary text-white':'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}>{tab}</button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg"/>
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Cari user, email, tim..." className="w-full bg-surface-container-low rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary border-none"/>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">User Information</th>
              <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Role</th>
              <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Tim</th>
              <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Status</th>
              <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Tanggal Daftar</th>
              <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {filteredUsers.map(user=>(
              <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-lg object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all"/>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center text-on-surface-variant font-headline font-bold text-lg">{getInitials(user.name)}</div>
                    )}
                    <div>
                      <p className="font-headline font-bold text-on-surface">{user.name}</p>
                      <p className="text-xs text-on-surface-variant font-body">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5"><RoleBadge role={user.role}/></td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">{user.teamName}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <StatusDot status={user.status}/>
                    <span className={`text-sm font-medium ${user.status==='Blocked'?'text-error':'text-on-surface'}`}>{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant font-body italic">{new Date(user.registrationDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>{setSelectedUser(user);setShowDetailModal(true);}} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-fixed text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="Detail">
                      <Icon name="visibility" className="text-[18px]"/>
                    </button>
                    {user.status==='Pending' && (
                      <button onClick={()=>handleVerify(user)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-fixed text-on-primary-fixed-variant hover:bg-primary hover:text-white transition-all cursor-pointer" title="Verifikasi">
                        <Icon name="verified" className="text-[18px]"/>
                      </button>
                    )}
                    <button onClick={()=>{setSelectedUser(user);setShowEditModal(true);}} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-fixed text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="Edit">
                      <Icon name="edit" className="text-[18px]"/>
                    </button>
                    {user.status!=='Blocked' ? (
                      <button onClick={()=>{setSelectedUser(user);setShowBlockModal(true);}} className="w-8 h-8 flex items-center justify-center rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-white transition-all cursor-pointer" title="Block">
                        <Icon name="block" className="text-[18px]"/>
                      </button>
                    ) : (
                      <button onClick={()=>{setSelectedUser(user);setShowBlockModal(true);}} className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-fixed text-on-primary-fixed-variant hover:bg-primary hover:text-white transition-all cursor-pointer" title="Unblock">
                        <Icon name="lock_open" className="text-[18px]"/>
                      </button>
                    )}
                    <button onClick={()=>{setSelectedUser(user);setShowDeleteModal(true);}} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-all cursor-pointer" title="Hapus">
                      <Icon name="delete" className="text-[18px]"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length===0 && <tr><td colSpan={6} className="px-6 py-16 text-center text-on-surface-variant">Tidak ada user yang cocok.</td></tr>}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-surface-container-low/50 flex items-center justify-between">
          <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Showing 1-{filteredUsers.length} of {users.length} entries</p>
        </div>
      </div>

      <footer className="pt-10 pb-4 text-center"><p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant opacity-35">© Agent Properti • Manajemen Sales Properti v2.4.0</p></footer>

      {/* ========== MODALS ========== */}

      {/* Add User */}
      {showAddModal && (
        <ModalBackdrop onClose={()=>setShowAddModal(false)}>
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <div><h2 className="font-headline text-2xl font-bold">Onboard Agent Baru</h2><p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">User Management</p></div>
            <button onClick={()=>setShowAddModal(false)} className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer"><Icon name="close"/></button>
          </div>
          <form className="p-8 space-y-5" onSubmit={e=>{e.preventDefault();handleAdd();}}>
            <UserFormFields isAdd={true}/>
            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
              <button type="button" onClick={()=>setShowAddModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface transition-colors cursor-pointer">Batal</button>
              <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><Spinner/>Menyimpan...</>:<><Icon name="person_add"/>Tambah User</>}
              </button>
            </div>
          </form>
        </ModalBackdrop>
      )}

      {/* Edit User */}
      {showEditModal && selectedUser && (
        <ModalBackdrop onClose={()=>setShowEditModal(false)}>
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <div><h2 className="font-headline text-2xl font-bold">Edit User</h2><p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">{selectedUser.name}</p></div>
            <button onClick={()=>setShowEditModal(false)} className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer"><Icon name="close"/></button>
          </div>
          <form className="p-8 space-y-5" onSubmit={e=>{e.preventDefault();handleEdit();}}>
            <UserFormFields/>
            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
              <button type="button" onClick={()=>setShowEditModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface transition-colors cursor-pointer">Batal</button>
              <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><Spinner/>Menyimpan...</>:<><Icon name="save"/>Simpan Perubahan</>}
              </button>
            </div>
          </form>
        </ModalBackdrop>
      )}

      {/* Delete User */}
      {showDeleteModal && selectedUser && (
        <ModalBackdrop onClose={()=>setShowDeleteModal(false)}>
          <div className="p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-error-container flex items-center justify-center mb-6"><Icon name="delete_forever" className="text-3xl text-error"/></div>
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Hapus User?</h3>
              <p className="text-on-surface-variant">Anda akan menghapus <span className="font-semibold text-on-surface">"{selectedUser.name}"</span> secara permanen.</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex items-center gap-4">
              {selectedUser.avatar ? <img src={selectedUser.avatar} alt="" className="w-12 h-12 rounded-lg object-cover"/> : <div className="w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center font-headline font-bold text-lg text-on-surface-variant">{getInitials(selectedUser.name)}</div>}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-on-surface truncate">{selectedUser.name}</p>
                <p className="text-xs text-on-surface-variant">{selectedUser.email}</p>
              </div>
              <div className="text-right"><RoleBadge role={selectedUser.role}/></div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={()=>setShowDeleteModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer">Batal</button>
              <button onClick={handleDelete} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-error text-on-error text-sm font-semibold hover:bg-error/90 cursor-pointer disabled:opacity-70 flex items-center gap-2">
                {isSubmitting?<><Spinner/>Menghapus...</>:<><Icon name="delete"/>Ya, Hapus User</>}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Block/Unblock User */}
      {showBlockModal && selectedUser && (
        <ModalBackdrop onClose={()=>setShowBlockModal(false)}>
          <div className="p-8">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${selectedUser.status==='Blocked'?'bg-primary-fixed':'bg-error-container'}`}>
              <Icon name={selectedUser.status==='Blocked'?'lock_open':'block'} className={`text-3xl ${selectedUser.status==='Blocked'?'text-primary':'text-error'}`}/>
            </div>
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">{selectedUser.status==='Blocked'?'Buka Blokir':'Blokir'} User?</h3>
              <p className="text-on-surface-variant">
                {selectedUser.status==='Blocked' ? (
                  <>User <span className="font-semibold text-on-surface">"{selectedUser.name}"</span> akan diaktifkan kembali dan dapat mengakses sistem.</>
                ) : (
                  <>User <span className="font-semibold text-on-surface">"{selectedUser.name}"</span> akan diblokir dan tidak dapat mengakses sistem.</>
                )}
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex items-center gap-4">
              {selectedUser.avatar ? <img src={selectedUser.avatar} alt="" className="w-12 h-12 rounded-lg object-cover"/> : <div className="w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center font-headline font-bold text-lg text-on-surface-variant">{getInitials(selectedUser.name)}</div>}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-on-surface truncate">{selectedUser.name}</p>
                <p className="text-xs text-on-surface-variant">{selectedUser.teamName} • {selectedUser.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={()=>setShowBlockModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer">Batal</button>
              <button onClick={()=>handleBlock(selectedUser.status==='Blocked'?'unblock':'block')} disabled={isSubmitting} className={`px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-70 flex items-center gap-2 ${selectedUser.status==='Blocked'?'bg-primary text-on-primary hover:bg-primary/90':'bg-error text-on-error hover:bg-error/90'}`}>
                {isSubmitting?<><Spinner/>{selectedUser.status==='Blocked'?'Membuka...':'Memblokir...'}</> : <><Icon name={selectedUser.status==='Blocked'?'lock_open':'block'}/>{selectedUser.status==='Blocked'?'Ya, Buka Blokir':'Ya, Blokir User'}</>}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Detail User */}
      {showDetailModal && selectedUser && (
        <ModalBackdrop onClose={()=>setShowDetailModal(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {selectedUser.avatar ? <img src={selectedUser.avatar} alt="" className="w-20 h-20 rounded-xl object-cover"/> : <div className="w-20 h-20 rounded-xl bg-surface-dim flex items-center justify-center font-headline font-bold text-3xl text-on-surface-variant">{getInitials(selectedUser.name)}</div>}
                <div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">{selectedUser.name}</h3>
                  <p className="text-sm text-on-surface-variant">{selectedUser.email}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <RoleBadge role={selectedUser.role}/>
                    <div className="flex items-center gap-1.5"><StatusDot status={selectedUser.status}/><span className={`text-sm font-medium ${selectedUser.status==='Blocked'?'text-error':'text-on-surface'}`}>{selectedUser.status}</span></div>
                  </div>
                </div>
              </div>
              <button onClick={()=>setShowDetailModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2"><Icon name="person" className="text-primary"/>Informasi Personal</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Telepon</span><span className="text-sm font-medium text-on-surface">{selectedUser.phone}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Tim</span><span className="text-sm font-medium text-on-surface">{selectedUser.teamName}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Terdaftar</span><span className="text-sm font-medium text-on-surface">{new Date(selectedUser.registrationDate).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</span></div>
                  </div>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Catatan Internal</h4>
                  <p className="text-sm text-on-surface">{selectedUser.notes || 'Tidak ada catatan.'}</p>
                </div>
                {/* Credential Section */}
                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2"><Icon name="lock" className="text-primary"/>Kredensial Login</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">Password</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-medium text-on-surface">{showResetPw ? selectedUser.password : maskPassword(selectedUser.password)}</span>
                        <button onClick={()=>setShowResetPw(!showResetPw)} className="p-1 text-on-surface-variant hover:text-primary rounded cursor-pointer" title={showResetPw?'Sembunyikan':'Tampilkan'}>
                          <Icon name={showResetPw?'visibility_off':'visibility'} className="text-sm"/>
                        </button>
                        <button onClick={()=>{navigator.clipboard.writeText(selectedUser.password);notify('Password disalin!','success');}} className="p-1 text-on-surface-variant hover:text-primary rounded cursor-pointer" title="Salin">
                          <Icon name="content_copy" className="text-sm"/>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">Password Terakhir Diubah</span>
                      <span className={`text-sm font-medium ${daysSinceChange(selectedUser.lastPasswordChange) > 90 ? 'text-error' : 'text-on-surface'}`}>
                        {new Date(selectedUser.lastPasswordChange).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}
                        {daysSinceChange(selectedUser.lastPasswordChange) > 90 && <span className="text-[10px] ml-2 text-error font-label uppercase">(expired)</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">Kekuatan</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${getPasswordStrength(selectedUser.password).color}`} style={{width:`${getPasswordStrength(selectedUser.password).percent}%`}}/>
                        </div>
                        <span className="text-xs font-medium text-on-surface">{getPasswordStrength(selectedUser.password).label}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={()=>{setShowDetailModal(false);setResetPwValue('');setShowResetPwModal(true);}} className="mt-4 w-full py-2.5 bg-primary/5 text-primary font-semibold text-sm rounded-lg hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <Icon name="lock_reset" className="text-lg"/> Reset Password
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2"><Icon name="insights" className="text-primary"/>Performa Penjualan</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-3xl font-headline font-bold text-primary">{selectedUser.totalSales}</p>
                      <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Total Sales</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-3xl font-headline font-bold text-tertiary">{selectedUser.activeDeals}</p>
                      <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Active Deals</p>
                    </div>
                  </div>
                </div>
                {selectedUser.status==='Pending' && (
                  <div className="bg-tertiary-fixed/30 rounded-xl p-6 text-center">
                    <Icon name="pending_actions" className="text-3xl text-tertiary mb-2"/>
                    <p className="font-bold text-on-surface mb-1">Menunggu Verifikasi</p>
                    <p className="text-xs text-on-surface-variant mb-4">User ini belum diverifikasi oleh admin.</p>
                    <button onClick={()=>{handleVerify(selectedUser);setShowDetailModal(false);}} className="px-6 py-2.5 bg-tertiary text-on-tertiary rounded-lg font-semibold text-sm cursor-pointer hover:opacity-90 flex items-center gap-2 mx-auto">
                      <Icon name="verified"/> Verifikasi Sekarang
                    </button>
                  </div>
                )}
                {selectedUser.status==='Blocked' && (
                  <div className="bg-error-container/30 rounded-xl p-6 text-center">
                    <Icon name="block" className="text-3xl text-error mb-2"/>
                    <p className="font-bold text-error mb-1">User Diblokir</p>
                    <p className="text-xs text-on-surface-variant mb-4">User ini tidak dapat mengakses sistem.</p>
                    <button onClick={()=>{setShowDetailModal(false);setSelectedUser(selectedUser);setShowBlockModal(true);}} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm cursor-pointer hover:opacity-90 flex items-center gap-2 mx-auto">
                      <Icon name="lock_open"/> Buka Blokir
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button onClick={()=>{setShowDetailModal(false);setShowEditModal(true);}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2"><Icon name="edit"/>Edit User</button>
              <button onClick={()=>setShowDetailModal(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer">Tutup</button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Reset Password Modal */}
      {showResetPwModal && selectedUser && (
        <ModalBackdrop onClose={()=>setShowResetPwModal(false)}>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-fixed text-primary rounded-xl flex items-center justify-center"><Icon name="lock_reset"/></div>
                  Reset Password
                </h3>
                <p className="text-sm text-on-surface-variant mt-2">Atur password baru untuk <span className="font-semibold text-on-surface">{selectedUser.name}</span></p>
              </div>
              <button onClick={()=>setShowResetPwModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex items-center gap-4">
              {selectedUser.avatar ? <img src={selectedUser.avatar} alt="" className="w-12 h-12 rounded-lg object-cover"/> : <div className="w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center font-headline font-bold text-lg text-on-surface-variant">{getInitials(selectedUser.name)}</div>}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-on-surface truncate">{selectedUser.name}</p>
                <p className="text-xs text-on-surface-variant">{selectedUser.email}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-on-surface-variant font-label uppercase">Password terakhir</p>
                <p className={`text-xs font-medium ${daysSinceChange(selectedUser.lastPasswordChange)>90?'text-error':'text-on-surface'}`}>
                  {daysSinceChange(selectedUser.lastPasswordChange)} hari lalu
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password Baru *</label>
                <button type="button" onClick={()=>{const pw=generatePassword();setResetPwValue(pw);setShowResetPw(true);}} className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1">
                  <Icon name="casino" className="text-sm"/> Generate
                </button>
              </div>
              <div className="relative">
                <input
                  type={showResetPw?'text':'password'}
                  value={resetPwValue}
                  onChange={e=>setResetPwValue(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-4 py-3 pr-24 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button type="button" onClick={()=>setShowResetPw(!showResetPw)} className="p-1.5 text-on-surface-variant hover:text-primary rounded cursor-pointer">
                    <Icon name={showResetPw?'visibility_off':'visibility'} className="text-lg"/>
                  </button>
                  {resetPwValue && (
                    <button type="button" onClick={()=>{navigator.clipboard.writeText(resetPwValue);notify('Password disalin!','success');}} className="p-1.5 text-on-surface-variant hover:text-primary rounded cursor-pointer">
                      <Icon name="content_copy" className="text-lg"/>
                    </button>
                  )}
                </div>
              </div>
              {resetPwValue && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Kekuatan</span>
                    <span className={`text-[10px] font-bold font-label uppercase ${getPasswordStrength(resetPwValue).percent>=80?'text-primary':getPasswordStrength(resetPwValue).percent>=60?'text-tertiary':'text-error'}`}>{getPasswordStrength(resetPwValue).label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${getPasswordStrength(resetPwValue).color}`} style={{width:`${getPasswordStrength(resetPwValue).percent}%`}}/>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button onClick={()=>setShowResetPwModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer">Batal</button>
              <button onClick={handleResetPassword} disabled={isSubmitting || !resetPwValue} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer disabled:opacity-70 flex items-center gap-2">
                {isSubmitting?<><Spinner/>Menyimpan...</>:<><Icon name="lock_reset"/>Reset Password</>}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-fade-in-up">
          <div className={`px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${showToast.type==='success'?'bg-tertiary text-on-tertiary':showToast.type==='error'?'bg-error text-on-error':'bg-inverse-surface text-inverse-on-surface'}`}>
            <Icon name={showToast.type==='success'?'check_circle':showToast.type==='error'?'error':'info'} className="text-[18px]"/>
            {showToast.message}
          </div>
        </div>
      )}
    </div>
  );
}
