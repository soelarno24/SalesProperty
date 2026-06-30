import { useState, useEffect } from 'react';
import Icon from '../Icon';
import LeaderHome from './LeaderHome';
import TeamManagement from './TeamManagement';
import LeaderProjects from './LeaderProjects';
import Approvals from './Approvals';
import FieldMonitoring from './FieldMonitoring';
import AuditLog from './AuditLog';
import ClientData from './ClientData';
import AgentPerformance from './AgentPerformance';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard' },
  { icon: 'group', label: 'Tim Saya' },
  { icon: 'apartment', label: 'Projects' },
  { icon: 'fact_check', label: 'Approvals' },
  { icon: 'location_on', label: 'Monitoring' },
  { icon: 'history_edu', label: 'Audit Log' },
  { icon: 'contacts', label: 'Data Client' },
  { icon: 'leaderboard', label: 'Performa Agent' },
];

interface Props { onLogout: () => void; }

interface LeaderProfile { name:string; email:string; phone:string; team:string; password:string; lastPwChange:string; }

const generatePw = () => { const u='ABCDEFGHJKLMNPQRSTUVWXYZ',l='abcdefghjkmnpqrstuvwxyz',d='23456789',s='!@#$%&*',a=u+l+d+s; let pw=u[Math.floor(Math.random()*u.length)]+l[Math.floor(Math.random()*l.length)]+d[Math.floor(Math.random()*d.length)]+s[Math.floor(Math.random()*s.length)]; for(let i=0;i<8;i++) pw+=a[Math.floor(Math.random()*a.length)]; return pw.split('').sort(()=>Math.random()-0.5).join(''); };
const pwStrength = (pw:string) => { if(!pw) return {l:'',c:'',p:0}; let sc=0; if(pw.length>=8)sc++; if(pw.length>=12)sc++; if(/[a-z]/.test(pw)&&/[A-Z]/.test(pw))sc++; if(/\d/.test(pw))sc++; if(/[^a-zA-Z\d]/.test(pw))sc++; if(sc<=1) return {l:'Sangat Lemah',c:'bg-error',p:20}; if(sc===2) return {l:'Lemah',c:'bg-error',p:40}; if(sc===3) return {l:'Cukup',c:'bg-tertiary',p:60}; if(sc===4) return {l:'Kuat',c:'bg-primary',p:80}; return {l:'Sangat Kuat',c:'bg-tertiary',p:100}; };

export default function LeaderDashboard({ onLogout }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{message:string;type:'success'|'error'|'info'}|null>(null);

  // Profile state
  const [profile, setProfile] = useState<LeaderProfile>({name:'Eleanor Thorne',email:'ethorne@agentproperti.id',phone:'+62 812 3456 7890',team:'Vanguard Curators',password:'Elean0r!2023',lastPwChange:'2024-01-10'});
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [profileForm, setProfileForm] = useState({name:'',email:'',phone:''});
  const [pwForm, setPwForm] = useState({current:'',newPw:'',confirm:''});
  const [pwErrors, setPwErrors] = useState<Record<string,string>>({});
  const [profileErrors, setProfileErrors] = useState<Record<string,string>>({});
  const [showPw, setShowPw] = useState(false);
  const [showConfPw, setShowConfPw] = useState(false);
  const [showCurPw, setShowCurPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const notify = (m:string,t:'success'|'error'|'info'='info') => { setToast({message:m,type:t}); setTimeout(()=>setToast(null),3000); };
  const daysSince = (d:string) => Math.floor((Date.now()-new Date(d).getTime())/(1000*60*60*24));

  useEffect(()=>{if(showProfile){setProfileForm({name:profile.name,email:profile.email,phone:profile.phone});setProfileErrors({});setShowChangePw(false);setPwForm({current:'',newPw:'',confirm:''});setPwErrors({});}},[showProfile, profile]);
  useEffect(()=>{const h=(e:KeyboardEvent)=>{if(e.key==='Escape')setShowProfile(false);};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);},[]);

  const saveProfile = () => {
    const e:Record<string,string>={}; if(!profileForm.name.trim())e.name='Wajib'; if(!profileForm.email.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email))e.email='Email tidak valid'; if(!profileForm.phone.trim())e.phone='Wajib';
    setProfileErrors(e); if(Object.keys(e).length>0) return;
    setSubmitting(true); setTimeout(()=>{setProfile({...profile,...profileForm});setSubmitting(false);notify('Profil berhasil diperbarui!','success');},600);
  };

  const changePassword = () => {
    const e:Record<string,string>={}; if(!pwForm.current)e.current='Wajib diisi'; if(pwForm.current&&pwForm.current!==profile.password)e.current='Password salah';
    if(!pwForm.newPw)e.newPw='Wajib diisi'; if(pwForm.newPw&&pwForm.newPw.length<8)e.newPw='Min 8 karakter'; if(pwForm.newPw&&!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwForm.newPw))e.newPw='Huruf besar, kecil & angka';
    if(pwForm.newPw===pwForm.current&&pwForm.current)e.newPw='Tidak boleh sama'; if(!pwForm.confirm)e.confirm='Wajib'; if(pwForm.confirm&&pwForm.confirm!==pwForm.newPw)e.confirm='Tidak cocok';
    setPwErrors(e); if(Object.keys(e).length>0) return;
    setSubmitting(true); setTimeout(()=>{setProfile({...profile,password:pwForm.newPw,lastPwChange:new Date().toISOString().split('T')[0]});setSubmitting(false);setShowChangePw(false);setPwForm({current:'',newPw:'',confirm:''});notify('Password berhasil diubah!','success');},600);
  };

  const ps = pwStrength(pwForm.newPw);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-sm lg:hidden" onClick={()=>setSidebarOpen(false)}/>}

      {/* Sidebar */}
      <nav className={`h-screen w-72 flex flex-col fixed left-0 top-0 bg-surface-container-low z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen?'translate-x-0':'-translate-x-full'}`}>
        <div className="flex flex-col gap-2 p-6 h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>auto_stories</span></div>
              <div><h1 className="font-headline text-xl text-on-surface font-bold tracking-tight">Agent Properti</h1><p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/70">Leader Panel</p></div>
            </div>
            <button onClick={()=>setSidebarOpen(false)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant cursor-pointer"><Icon name="close"/></button>
          </div>
          <div className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
            {navItems.map((item, i) => (
              <button key={item.label} onClick={()=>{setPageIndex(i);if(window.innerWidth<1024)setSidebarOpen(false);}} className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all cursor-pointer ${pageIndex===i?'text-primary font-bold bg-surface-container-highest':'text-on-surface-variant hover:bg-surface-variant/50'}`}>
                <Icon name={item.icon}/><span className="font-body text-sm tracking-wide">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-auto space-y-1 pt-6 border-t border-outline-variant/15">
            <button onClick={()=>notify('Bantuan & dukungan','info')} className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg w-full cursor-pointer"><Icon name="help_outline"/><span className="font-body text-sm">Support</span></button>
            <button onClick={onLogout} className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 rounded-lg w-full cursor-pointer"><Icon name="logout"/><span className="font-body text-sm">Sign Out</span></button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="lg:ml-72 min-h-screen flex flex-col">
        <header className="w-full sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-xl flex justify-between items-center h-16 px-4 lg:px-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high cursor-pointer"><Icon name="menu"/></button>
            <div className="hidden md:flex items-center gap-3">
              <h2 className="font-headline text-lg font-bold tracking-tight text-primary">Leader Sales Panel</h2>
              <span className="h-5 w-[1px] bg-outline-variant/30"/>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Team Oversight</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"/>
              <input className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-48 lg:w-64 outline-none" placeholder="Cari lead atau agen..." type="text"/>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high cursor-pointer text-on-surface-variant"><Icon name="notifications"/></button>
            <button onClick={()=>setShowProfile(true)} className="flex items-center gap-2 hover:bg-surface-container-low rounded-lg px-2 py-1 cursor-pointer transition-colors">
              <div className="hidden md:block text-right"><p className="text-xs font-semibold text-on-surface">{profile.name}</p><p className="text-[9px] font-label uppercase text-on-surface-variant">{profile.team}</p></div>
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-bold text-sm">{profile.name.split(' ').map(n=>n[0]).join('')}</div>
            </button>
          </div>
        </header>

        <div className="flex-1">
          {pageIndex === 0 && <LeaderHome notify={notify}/>}
          {pageIndex === 1 && <TeamManagement notify={notify}/>}
          {pageIndex === 2 && <LeaderProjects notify={notify}/>}
          {pageIndex === 3 && <Approvals notify={notify}/>}
          {pageIndex === 4 && <FieldMonitoring notify={notify}/>}
          {pageIndex === 5 && <AuditLog notify={notify}/>}
          {pageIndex === 6 && <ClientData notify={notify}/>}
          {pageIndex === 7 && <AgentPerformance notify={notify}/>}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={()=>setShowProfile(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up my-8 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-headline font-bold text-3xl">{profile.name.split(' ').map(n=>n[0]).join('')}</div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"><Icon name="verified" className="text-white text-xs"/></div>
                  </div>
                  <div>
                    <h3 className="font-headline text-2xl font-bold">{profile.name}</h3>
                    <p className="text-sm text-on-surface-variant">{profile.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold font-label uppercase tracking-widest rounded-full">Leader Sales</span>
                      <span className="text-xs text-on-surface-variant">{profile.team}</span>
                    </div>
                  </div>
                </div>
                <button onClick={()=>setShowProfile(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Edit Profile */}
                <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="person" className="text-primary text-sm"/>Edit Profil</h4>
                  <div className="space-y-3">
                    <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Nama</label><input value={profileForm.name} onChange={e=>setProfileForm({...profileForm,name:e.target.value})} className={`w-full px-4 py-3 bg-white border rounded-lg text-sm outline-none ${profileErrors.name?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{profileErrors.name&&<p className="text-xs text-error mt-1">{profileErrors.name}</p>}</div>
                    <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Email</label><input type="email" value={profileForm.email} onChange={e=>setProfileForm({...profileForm,email:e.target.value})} className={`w-full px-4 py-3 bg-white border rounded-lg text-sm outline-none ${profileErrors.email?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{profileErrors.email&&<p className="text-xs text-error mt-1">{profileErrors.email}</p>}</div>
                    <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Telepon</label><input value={profileForm.phone} onChange={e=>setProfileForm({...profileForm,phone:e.target.value})} className={`w-full px-4 py-3 bg-white border rounded-lg text-sm outline-none ${profileErrors.phone?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{profileErrors.phone&&<p className="text-xs text-error mt-1">{profileErrors.phone}</p>}</div>
                  </div>
                  <button onClick={saveProfile} disabled={submitting} className="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">{submitting?'Menyimpan...':'Simpan Profil'}</button>
                </div>

                {/* Password */}
                <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="lock" className="text-primary text-sm"/>Keamanan</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm"><span className="text-on-surface-variant">Password</span><div className="flex items-center gap-1"><span className="font-mono text-sm">{showCurPw?profile.password:'•'.repeat(10)}</span><button onClick={()=>setShowCurPw(!showCurPw)} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name={showCurPw?'visibility_off':'visibility'} className="text-sm"/></button><button onClick={()=>{navigator.clipboard.writeText(profile.password);notify('Disalin!','success');}} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name="content_copy" className="text-sm"/></button></div></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Terakhir diubah</span><span className={`font-medium ${daysSince(profile.lastPwChange)>90?'text-error':'text-on-surface'}`}>{daysSince(profile.lastPwChange)} hari lalu{daysSince(profile.lastPwChange)>90&&' ⚠️'}</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-on-surface-variant">Kekuatan</span><div className="flex items-center gap-2"><div className="w-14 h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className={`h-full rounded-full ${pwStrength(profile.password).c}`} style={{width:`${pwStrength(profile.password).p}%`}}/></div><span className="text-xs">{pwStrength(profile.password).l}</span></div></div>
                  </div>

                  {!showChangePw ? (
                    <button onClick={()=>setShowChangePw(true)} className="w-full py-3 bg-primary/5 text-primary font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:bg-primary/10"><Icon name="lock_reset"/>Ganti Password</button>
                  ) : (
                    <div className="space-y-3 pt-3 border-t border-outline-variant/10">
                      <p className="text-xs font-label font-bold uppercase tracking-wider text-primary">Ganti Password</p>
                      <div><label className="block text-xs font-label font-bold uppercase text-on-surface-variant mb-1">Password Saat Ini</label><input type="password" value={pwForm.current} onChange={e=>setPwForm({...pwForm,current:e.target.value})} placeholder="Masukkan password saat ini" className={`w-full px-4 py-3 bg-white border rounded-lg text-sm outline-none ${pwErrors.current?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{pwErrors.current&&<p className="text-xs text-error mt-1">{pwErrors.current}</p>}</div>
                      <div>
                        <div className="flex justify-between mb-1"><label className="text-xs font-label font-bold uppercase text-on-surface-variant">Password Baru</label><button type="button" onClick={()=>{const pw=generatePw();setPwForm({...pwForm,newPw:pw,confirm:pw});setShowPw(true);}} className="text-[10px] text-primary font-semibold cursor-pointer flex items-center gap-0.5"><Icon name="casino" className="text-xs"/>Generate</button></div>
                        <div className="relative"><input type={showPw?'text':'password'} value={pwForm.newPw} onChange={e=>setPwForm({...pwForm,newPw:e.target.value})} placeholder="Min 8 karakter" className={`w-full px-4 py-3 pr-16 bg-white border rounded-lg text-sm outline-none ${pwErrors.newPw?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/><div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5"><button type="button" onClick={()=>setShowPw(!showPw)} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name={showPw?'visibility_off':'visibility'} className="text-sm"/></button>{pwForm.newPw&&<button type="button" onClick={()=>{navigator.clipboard.writeText(pwForm.newPw);notify('Disalin!','success');}} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name="content_copy" className="text-sm"/></button>}</div></div>
                        {pwErrors.newPw&&<p className="text-xs text-error mt-1">{pwErrors.newPw}</p>}
                      </div>
                      {pwForm.newPw&&<div><div className="flex justify-between"><span className="text-[10px] font-label uppercase text-on-surface-variant">Kekuatan</span><span className={`text-[10px] font-bold ${ps.p>=80?'text-primary':ps.p>=60?'text-tertiary':'text-error'}`}>{ps.l}</span></div><div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-1"><div className={`h-full rounded-full transition-all ${ps.c}`} style={{width:`${ps.p}%`}}/></div></div>}
                      <div><label className="block text-xs font-label font-bold uppercase text-on-surface-variant mb-1">Konfirmasi Password</label><div className="relative"><input type={showConfPw?'text':'password'} value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})} placeholder="Ketik ulang" className={`w-full px-4 py-3 pr-10 bg-white border rounded-lg text-sm outline-none ${pwErrors.confirm?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/><button type="button" onClick={()=>setShowConfPw(!showConfPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name={showConfPw?'visibility_off':'visibility'} className="text-sm"/></button></div>{pwErrors.confirm&&<p className="text-xs text-error mt-1">{pwErrors.confirm}</p>}{pwForm.confirm&&pwForm.confirm===pwForm.newPw&&!pwErrors.confirm&&<p className="text-xs text-primary flex items-center gap-1 mt-1"><Icon name="check_circle" className="text-sm"/>Cocok</p>}</div>
                      <div className="flex gap-2 pt-1"><button onClick={()=>{setShowChangePw(false);setPwForm({current:'',newPw:'',confirm:''});setPwErrors({});}} className="flex-1 py-2.5 border border-outline rounded-lg font-semibold text-sm cursor-pointer">Batal</button><button onClick={changePassword} disabled={submitting} className="flex-1 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm cursor-pointer disabled:opacity-70">{submitting?'Mengubah...':'Ubah Password'}</button></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6 mt-6 border-t border-outline-variant/10"><button onClick={()=>setShowProfile(false)} className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold cursor-pointer">Tutup</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-fade-in-up">
          <div className={`px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${toast.type==='success'?'bg-tertiary text-on-tertiary':toast.type==='error'?'bg-error text-on-error':'bg-inverse-surface text-inverse-on-surface'}`}>
            <Icon name={toast.type==='success'?'check_circle':toast.type==='error'?'error':'info'} className="text-[18px]"/>{toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
