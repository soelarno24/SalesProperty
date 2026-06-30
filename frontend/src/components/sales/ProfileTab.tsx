import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; onLogout:()=>void; }

const generatePw = () => { const c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*'; let p=''; for(let i=0;i<12;i++) p+=c[Math.floor(Math.random()*c.length)]; return p; };
const pwStr = (pw:string) => { if(!pw) return {l:'',c:'',p:0}; let s=0; if(pw.length>=8)s++; if(pw.length>=12)s++; if(/[a-z]/.test(pw)&&/[A-Z]/.test(pw))s++; if(/\d/.test(pw))s++; if(/[^a-zA-Z\d]/.test(pw))s++; if(s<=2) return {l:'Lemah',c:'bg-error',p:40}; if(s===3) return {l:'Cukup',c:'bg-tertiary',p:60}; if(s===4) return {l:'Kuat',c:'bg-primary',p:80}; return {l:'Sangat Kuat',c:'bg-tertiary',p:100}; };

export default function ProfileTab({ notify, onLogout }: Props) {
  const [profile, setProfile] = useState({name:'Julian Vance',email:'julian@agentproperti.id',phone:'+62 812 9999 0000',team:'Vanguard Curators',role:'Senior Sales Agent',password:'Julian#V24',lastPwChange:'2024-02-12',joinDate:'2024-02-12',totalSales:6,revenue:1450000});
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({name:'',email:'',phone:''});
  const [showPwChange, setShowPwChange] = useState(false);
  const [pwForm, setPwForm] = useState({current:'',newPw:'',confirm:''});
  const [showPw, setShowPw] = useState(false);
  const [pwErrors, setPwErrors] = useState<Record<string,string>>({});

  const startEdit = () => { setEditForm({name:profile.name,email:profile.email,phone:profile.phone}); setEditing(true); };
  const saveEdit = () => { setProfile({...profile,...editForm}); setEditing(false); notify('Profil berhasil diperbarui!','success'); };
  const changePw = () => {
    const e:Record<string,string>={}; if(pwForm.current!==profile.password) e.current='Password salah'; if(!pwForm.newPw||pwForm.newPw.length<8) e.newPw='Min 8 karakter'; if(pwForm.confirm!==pwForm.newPw) e.confirm='Tidak cocok';
    setPwErrors(e); if(Object.keys(e).length>0) return;
    setProfile({...profile,password:pwForm.newPw,lastPwChange:new Date().toISOString().split('T')[0]});
    setShowPwChange(false); setPwForm({current:'',newPw:'',confirm:''}); notify('Password berhasil diubah!','success');
  };

  const fp = (n:number) => '$'+n.toLocaleString();
  const ps = pwStr(pwForm.newPw);

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-primary px-5 pb-8 pt-2 rounded-b-3xl text-center text-white">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 text-3xl font-headline font-bold">{profile.name.split(' ').map(n=>n[0]).join('')}</div>
        <h2 className="font-headline text-xl font-bold">{profile.name}</h2>
        <p className="text-sm opacity-70">{profile.role}</p>
        <p className="text-xs opacity-50 mt-1">{profile.team}</p>
      </div>

      <div className="px-4 py-4 space-y-4 -mt-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-outline-variant/10"><p className="text-2xl font-headline font-bold text-primary">{profile.totalSales}</p><p className="text-[10px] text-on-surface-variant uppercase">Closing</p></div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-outline-variant/10"><p className="text-2xl font-headline font-bold text-tertiary">{fp(profile.revenue)}</p><p className="text-[10px] text-on-surface-variant uppercase">Revenue</p></div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/10 space-y-3">
          <div className="flex justify-between items-center"><h3 className="text-sm font-bold flex items-center gap-2"><Icon name="person" className="text-primary text-base"/>Informasi Akun</h3><button onClick={startEdit} className="text-primary text-xs font-bold cursor-pointer flex items-center gap-1"><Icon name="edit" className="text-sm"/>Edit</button></div>
          <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Email</span><span className="font-medium">{profile.email}</span></div>
          <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Telepon</span><span className="font-medium">{profile.phone}</span></div>
          <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Bergabung</span><span className="font-medium">{profile.joinDate}</span></div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/10 space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-2"><Icon name="lock" className="text-primary text-base"/>Keamanan</h3>
          <div className="flex justify-between items-center text-sm"><span className="text-on-surface-variant">Password</span><span className="font-mono">{'•'.repeat(10)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Terakhir diubah</span><span className="font-medium">{profile.lastPwChange}</span></div>
          <button onClick={()=>setShowPwChange(true)} className="w-full py-2.5 bg-primary/5 text-primary font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-1"><Icon name="lock_reset" className="text-base"/>Ganti Password</button>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
          <button onClick={()=>notify('Pengaturan notifikasi','info')} className="w-full px-5 py-4 flex items-center gap-3 border-b border-outline-variant/10 cursor-pointer hover:bg-surface-container-low transition-colors text-left"><Icon name="notifications" className="text-on-surface-variant"/><span className="text-sm flex-1">Notifikasi</span><Icon name="chevron_right" className="text-on-surface-variant"/></button>
          <button onClick={()=>notify('Bantuan & FAQ','info')} className="w-full px-5 py-4 flex items-center gap-3 border-b border-outline-variant/10 cursor-pointer hover:bg-surface-container-low transition-colors text-left"><Icon name="help_outline" className="text-on-surface-variant"/><span className="text-sm flex-1">Bantuan</span><Icon name="chevron_right" className="text-on-surface-variant"/></button>
          <button onClick={onLogout} className="w-full px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-error-container/10 transition-colors text-left"><Icon name="logout" className="text-error"/><span className="text-sm text-error flex-1">Sign Out</span></button>
        </div>

        <p className="text-center text-[10px] text-on-surface-variant opacity-40 font-label uppercase tracking-widest pt-4">Agent Properti • Sales App v1.0</p>
      </div>

      {/* Edit Profile Sheet */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={()=>setEditing(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up p-6" style={{maxWidth:'430px'}} onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 -mt-1"/>
            <h3 className="font-headline text-lg font-bold mb-4">Edit Profil</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-1 block">Nama</label><input value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/></div>
              <div><label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-1 block">Email</label><input value={editForm.email} onChange={e=>setEditForm({...editForm,email:e.target.value})} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/></div>
              <div><label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-1 block">Telepon</label><input value={editForm.phone} onChange={e=>setEditForm({...editForm,phone:e.target.value})} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/></div>
            </div>
            <button onClick={saveEdit} className="w-full mt-4 py-3.5 bg-primary text-white font-bold rounded-xl cursor-pointer">Simpan</button>
          </div>
        </div>
      )}

      {/* Change Password Sheet */}
      {showPwChange && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={()=>setShowPwChange(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up p-6 max-h-[85vh] overflow-y-auto" style={{maxWidth:'430px'}} onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 -mt-1"/>
            <h3 className="font-headline text-lg font-bold mb-4 flex items-center gap-2"><Icon name="lock_reset" className="text-primary"/>Ganti Password</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-1 block">Password Saat Ini</label><input type="password" value={pwForm.current} onChange={e=>setPwForm({...pwForm,current:e.target.value})} placeholder="Masukkan password lama" className={`w-full px-4 py-3 bg-surface-container-low border rounded-xl text-sm outline-none ${pwErrors.current?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{pwErrors.current&&<p className="text-xs text-error mt-1">{pwErrors.current}</p>}</div>
              <div>
                <div className="flex justify-between mb-1"><label className="text-xs font-label font-bold uppercase text-on-surface-variant">Password Baru</label><button type="button" onClick={()=>{const pw=generatePw();setPwForm({...pwForm,newPw:pw,confirm:pw});setShowPw(true);}} className="text-[10px] text-primary font-bold cursor-pointer">Generate</button></div>
                <div className="relative"><input type={showPw?'text':'password'} value={pwForm.newPw} onChange={e=>setPwForm({...pwForm,newPw:e.target.value})} placeholder="Min 8 karakter" className={`w-full px-4 py-3 pr-10 bg-surface-container-low border rounded-xl text-sm outline-none ${pwErrors.newPw?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/><button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer"><Icon name={showPw?'visibility_off':'visibility'} className="text-base"/></button></div>
                {pwErrors.newPw&&<p className="text-xs text-error mt-1">{pwErrors.newPw}</p>}
              </div>
              {pwForm.newPw&&<div><div className="flex justify-between text-[10px]"><span className="text-on-surface-variant">Kekuatan</span><span className={`font-bold ${ps.p>=80?'text-primary':'text-error'}`}>{ps.l}</span></div><div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-1"><div className={`h-full rounded-full ${ps.c}`} style={{width:`${ps.p}%`}}/></div></div>}
              <div><label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-1 block">Konfirmasi</label><input type="password" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})} placeholder="Ketik ulang" className={`w-full px-4 py-3 bg-surface-container-low border rounded-xl text-sm outline-none ${pwErrors.confirm?'border-error':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{pwErrors.confirm&&<p className="text-xs text-error mt-1">{pwErrors.confirm}</p>}{pwForm.confirm&&pwForm.confirm===pwForm.newPw&&!pwErrors.confirm&&<p className="text-xs text-primary mt-1 flex items-center gap-1"><Icon name="check_circle" className="text-sm"/>Cocok</p>}</div>
            </div>
            <button onClick={changePw} className="w-full mt-4 py-3.5 bg-primary text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2"><Icon name="lock_reset"/>Ubah Password</button>
          </div>
        </div>
      )}
    </div>
  );
}
