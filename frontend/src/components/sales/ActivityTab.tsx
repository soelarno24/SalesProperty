import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface Activity { id:string; type:string; client:string; project:string; time:string; date:string; hasPhoto:boolean; hasChat:boolean; gps:boolean; notes:string; }

const activities: Activity[] = [
  {id:'1',type:'Site Visit',client:'Richard Montgomery',project:'The Obsidian Groves',time:'10:45',date:'Hari ini',hasPhoto:true,hasChat:false,gps:true,notes:'Client tertarik Unit 402'},
  {id:'2',type:'Chat Follow-up',client:'Elise Valerius',project:'Marine Wharf',time:'09:12',date:'Hari ini',hasPhoto:false,hasChat:true,gps:false,notes:'Kirim pricelist terbaru'},
  {id:'3',type:'Meeting',client:'Sarah Johnson',project:'Alabaster Heights',time:'14:00',date:'Kemarin',hasPhoto:true,hasChat:true,gps:true,notes:'Meeting di kantor client'},
  {id:'4',type:'Cold Calling',client:'Maria Santos',project:'-',time:'16:30',date:'Kemarin',hasPhoto:false,hasChat:false,gps:false,notes:'Interested, minta jadwal visit'},
  {id:'5',type:'Negotiation',client:'David Kim',project:'The Obsidian Groves',time:'11:00',date:'2 hari lalu',hasPhoto:true,hasChat:true,gps:true,notes:'Deal! DP dibayar hari ini'},
];

const typeIcon = (t:string) => ({
  'Site Visit':'location_on','Chat Follow-up':'chat','Meeting':'handshake','Cold Calling':'call','Negotiation':'gavel'
}[t]||'note');
const typeColor = (t:string) => ({
  'Site Visit':'bg-primary text-white','Chat Follow-up':'bg-tertiary text-white','Meeting':'bg-primary-container text-white','Cold Calling':'bg-secondary text-white','Negotiation':'bg-tertiary-container text-on-tertiary-container'
}[t]||'bg-surface-container');

export default function ActivityTab({ notify }: Props) {
  const [showLog, setShowLog] = useState(false);
  const [logType, setLogType] = useState('Site Visit');

  return (
    <div>
      <div className="bg-primary px-5 pb-5 pt-2 rounded-b-3xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-headline text-xl font-bold">Log Aktivitas</h2>
          <button onClick={()=>setShowLog(true)} className="px-4 py-2 bg-white text-primary font-bold text-xs rounded-full cursor-pointer flex items-center gap-1"><Icon name="add" className="text-sm"/>Catat Aktivitas</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-xl p-3 text-center text-white"><p className="text-xl font-bold">{activities.filter(a=>a.date==='Hari ini').length}</p><p className="text-[9px] opacity-70 uppercase">Hari Ini</p></div>
          <div className="bg-white/15 rounded-xl p-3 text-center text-white"><p className="text-xl font-bold">{activities.filter(a=>a.hasPhoto).length}</p><p className="text-[9px] opacity-70 uppercase">Foto Bukti</p></div>
          <div className="bg-white/15 rounded-xl p-3 text-center text-white"><p className="text-xl font-bold">{activities.filter(a=>a.gps).length}</p><p className="text-[9px] opacity-70 uppercase">GPS Verified</p></div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="px-4 py-4 space-y-3">
        {activities.map(a=>(
          <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${typeColor(a.type)} flex items-center justify-center shrink-0`}><Icon name={typeIcon(a.type)} className="text-lg"/></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div><h3 className="text-sm font-bold">{a.type}</h3><p className="text-[10px] text-on-surface-variant">{a.client} • {a.project}</p></div>
                  <p className="text-[10px] text-on-surface-variant shrink-0">{a.time}</p>
                </div>
                {a.notes && <p className="text-xs text-on-surface-variant mt-1 italic">"{a.notes}"</p>}
                <div className="flex gap-2 mt-2">
                  {a.hasPhoto && <span className="flex items-center gap-0.5 text-[9px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded"><Icon name="photo_camera" className="text-[10px]"/>Foto</span>}
                  {a.hasChat && <span className="flex items-center gap-0.5 text-[9px] font-bold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded"><Icon name="chat" className="text-[10px]"/>Chat</span>}
                  {a.gps && <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#1e4620] bg-[#e7f5ed] px-2 py-0.5 rounded"><Icon name="gps_fixed" className="text-[10px]"/>GPS ✓</span>}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant text-right mt-2">{a.date}</p>
          </div>
        ))}
      </div>

      {/* Log Activity Sheet */}
      {showLog && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={()=>setShowLog(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[90vh] overflow-y-auto p-6" style={{maxWidth:'430px'}} onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 -mt-1"/>
            <h3 className="font-headline text-lg font-bold mb-4">Catat Aktivitas Baru</h3>

            <div className="space-y-4">
              <div><label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-2 block">Tipe Aktivitas</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cold Calling','Chat Follow-up','Meeting','Site Visit','Negotiation'].map(t=>(
                    <button key={t} onClick={()=>setLogType(t)} className={`py-2.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all flex flex-col items-center gap-1 ${logType===t?'bg-primary text-white ring-2 ring-primary':'bg-surface-container-high text-on-surface-variant'}`}><Icon name={typeIcon(t)} className="text-base"/>{t}</button>
                  ))}
                </div>
              </div>
              <input placeholder="Nama Klien" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/>
              <input placeholder="Project" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/>
              <textarea placeholder="Catatan aktivitas..." rows={2} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/>

              {/* Proof of Work */}
              <div className="bg-primary-fixed/20 rounded-xl p-4 border border-primary/10 space-y-3">
                <p className="text-xs font-label font-bold uppercase text-primary flex items-center gap-1"><Icon name="verified" className="text-sm"/>Bukti Kerja (Proof of Work)</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={()=>notify('📸 Kamera dibuka — Foto langsung (bukan galeri)','info')} className="py-4 bg-white rounded-xl flex flex-col items-center gap-1 cursor-pointer border border-outline-variant/10 active:scale-95 transition-transform"><Icon name="photo_camera" className="text-2xl text-primary"/><span className="text-[10px] font-bold">Ambil Foto</span><span className="text-[8px] text-on-surface-variant">Kamera langsung</span></button>
                  <button onClick={()=>notify('📱 Upload screenshot chat/call','info')} className="py-4 bg-white rounded-xl flex flex-col items-center gap-1 cursor-pointer border border-outline-variant/10 active:scale-95 transition-transform"><Icon name="chat" className="text-2xl text-tertiary"/><span className="text-[10px] font-bold">Upload Chat</span><span className="text-[8px] text-on-surface-variant">Screenshot WA</span></button>
                </div>
                <div className="bg-[#e7f5ed] rounded-lg p-2.5 flex items-center gap-2"><Icon name="gps_fixed" className="text-[#1e4620] text-sm"/><div><p className="text-[10px] font-bold text-[#1e4620]">GPS & Timestamp Otomatis</p><p className="text-[8px] text-on-surface-variant">Lokasi & waktu terkunci saat foto diambil</p></div></div>
              </div>
            </div>

            <button onClick={()=>{notify('Aktivitas berhasil dicatat dengan bukti kerja!','success');setShowLog(false);}} className="w-full mt-4 py-3.5 bg-primary text-white font-bold rounded-xl cursor-pointer text-sm flex items-center justify-center gap-2"><Icon name="check"/>Simpan Aktivitas</button>
          </div>
        </div>
      )}
    </div>
  );
}
