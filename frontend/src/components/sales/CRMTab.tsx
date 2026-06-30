import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface Lead { id:string; name:string; phone:string; project:string; potential:'Hot'|'Warm'|'Cold'; status:string; lastContact:string; nextFollowUp:string; notes:string; timeline:{date:string;action:string;proof?:string}[]; }

const initialLeads: Lead[] = [
  {id:'1',name:'Richard Montgomery',phone:'+62 812 1111 0001',project:'The Obsidian Groves',potential:'Hot',status:'Negotiation',lastContact:'Hari ini',nextFollowUp:'Besok, 10:00',notes:'Minta diskon 5%',timeline:[{date:'14 Mar',action:'Site Visit — Unit 402',proof:'📸'},{date:'12 Mar',action:'WhatsApp Follow-up',proof:'💬'},{date:'10 Mar',action:'Cold Calling — Interested'}]},
  {id:'2',name:'Elise Valerius',phone:'+62 813 2222 0002',project:'Marine Wharf',potential:'Hot',status:'Site Visit',lastContact:'Kemarin',nextFollowUp:'Hari ini, 14:00',notes:'Butuh 500sqm+ komersial',timeline:[{date:'13 Mar',action:'Meeting di kantor',proof:'📸'},{date:'11 Mar',action:'Kirim brochure via WA',proof:'💬'}]},
  {id:'3',name:'Sarah Johnson',phone:'+62 856 3333 0003',project:'Alabaster Heights',potential:'Warm',status:'Follow-up',lastContact:'2 hari lalu',nextFollowUp:'Besok, 09:00',notes:'Budget terbatas',timeline:[{date:'12 Mar',action:'Chat Follow-up',proof:'💬'}]},
  {id:'4',name:'Maria Santos',phone:'+62 812 5555 0005',project:'-',potential:'Cold',status:'New Lead',lastContact:'3 hari lalu',nextFollowUp:'Hari ini, 16:00',notes:'Walk-in open house',timeline:[{date:'10 Mar',action:'Walk-in registrasi'}]},
  {id:'5',name:'David Kim',phone:'+62 878 4444 0004',project:'The Obsidian Groves',potential:'Hot',status:'Booked',lastContact:'Hari ini',nextFollowUp:'-',notes:'DP sudah dibayar',timeline:[{date:'14 Mar',action:'Booking Unit 1205',proof:'📸'},{date:'13 Mar',action:'Negotiation — Deal',proof:'💬'},{date:'10 Mar',action:'Site Visit',proof:'📸'},{date:'8 Mar',action:'Cold Call — Interested'}]},
];

const potColor = (p:string) => p==='Hot'?'bg-error text-white':p==='Warm'?'bg-tertiary-fixed text-on-tertiary-fixed-variant':'bg-surface-container-high text-on-surface-variant';

export default function CRMTab({ notify }: Props) {
  const [leads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Lead|null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = leads.filter(l => filter==='All' || l.potential===filter);

  return (
    <div>
      {/* Header */}
      <div className="bg-primary px-5 pb-5 pt-2 rounded-b-3xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-headline text-xl font-bold">CRM — Leads</h2>
          <button onClick={()=>setShowAdd(true)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer"><Icon name="add"/></button>
        </div>
        <div className="flex gap-2">
          {['All','Hot','Warm','Cold'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase cursor-pointer ${filter===f?'bg-white text-primary':'bg-white/15 text-white/70'}`}>{f} {f!=='All'&&`(${leads.filter(l=>l.potential===f).length})`}</button>
          ))}
        </div>
      </div>

      {/* Reminders */}
      {leads.filter(l=>l.nextFollowUp.includes('Hari ini')).length > 0 && (
        <div className="mx-4 mt-4 bg-tertiary-fixed/30 rounded-xl p-3 flex items-start gap-3 border border-tertiary/20">
          <Icon name="alarm" className="text-tertiary text-xl mt-0.5"/>
          <div><p className="text-xs font-bold text-tertiary">Follow-up Hari Ini</p><p className="text-[10px] text-on-surface-variant">{leads.filter(l=>l.nextFollowUp.includes('Hari ini')).map(l=>l.name).join(', ')}</p></div>
        </div>
      )}

      {/* Lead Cards */}
      <div className="px-4 py-4 space-y-3">
        {filtered.map(l=>(
          <div key={l.id} className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10 active:scale-[0.98] transition-transform" onClick={()=>setSelected(l)}>
            <div className="flex justify-between items-start mb-2">
              <div><h3 className="text-sm font-bold">{l.name}</h3><p className="text-[10px] text-on-surface-variant">{l.project} • {l.phone}</p></div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${potColor(l.potential)}`}>{l.potential}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded font-medium">{l.status}</span>
              <div className="flex items-center gap-3 text-[10px] text-on-surface-variant">
                <span>{l.lastContact}</span>
                {l.nextFollowUp!=='-'&&<span className="text-primary font-bold">📅 {l.nextFollowUp}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lead Detail / Timeline */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={()=>setSelected(null)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[88vh] overflow-y-auto" style={{maxWidth:'430px'}} onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mt-3 mb-4"/>
            <div className="px-5 pb-6 space-y-4">
              <div className="flex justify-between items-start">
                <div><h3 className="font-headline text-xl font-bold">{selected.name}</h3><p className="text-sm text-on-surface-variant">{selected.phone}</p></div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${potColor(selected.potential)}`}>{selected.potential}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low rounded-xl p-3"><p className="text-[10px] text-on-surface-variant">Project</p><p className="text-sm font-bold">{selected.project}</p></div>
                <div className="bg-surface-container-low rounded-xl p-3"><p className="text-[10px] text-on-surface-variant">Status</p><p className="text-sm font-bold">{selected.status}</p></div>
              </div>

              {selected.notes && <div className="bg-tertiary-fixed/20 rounded-xl p-3 border-l-4 border-tertiary"><p className="text-xs">{selected.notes}</p></div>}

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-2">
                <button onClick={()=>notify('Menelepon...','info')} className="py-3 bg-surface-container-low rounded-xl flex flex-col items-center gap-1 cursor-pointer text-[10px] font-bold"><Icon name="call" className="text-primary text-lg"/>Call</button>
                <button onClick={()=>notify('Buka WhatsApp...','info')} className="py-3 bg-surface-container-low rounded-xl flex flex-col items-center gap-1 cursor-pointer text-[10px] font-bold"><Icon name="chat" className="text-tertiary text-lg"/>WA</button>
                <button onClick={()=>notify('Kirim brochure...','success')} className="py-3 bg-surface-container-low rounded-xl flex flex-col items-center gap-1 cursor-pointer text-[10px] font-bold"><Icon name="share" className="text-primary text-lg"/>Share</button>
                <button onClick={()=>notify('Atur jadwal...','info')} className="py-3 bg-surface-container-low rounded-xl flex flex-col items-center gap-1 cursor-pointer text-[10px] font-bold"><Icon name="event" className="text-tertiary text-lg"/>Jadwal</button>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-3">Riwayat Interaksi</h4>
                <div className="space-y-3 relative">
                  <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-outline-variant/30"/>
                  {selected.timeline.map((t,i)=>(
                    <div key={i} className="relative pl-8">
                      <div className={`absolute left-2 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${i===0?'bg-primary':'bg-outline-variant'}`}/>
                      <div className="flex justify-between items-start"><p className="text-sm">{t.action}</p>{t.proof&&<span className="text-sm">{t.proof}</span>}</div>
                      <p className="text-[10px] text-on-surface-variant">{t.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Sheet */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={()=>setShowAdd(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[85vh] overflow-y-auto p-6" style={{maxWidth:'430px'}} onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 -mt-1"/>
            <h3 className="font-headline text-lg font-bold mb-4">Tambah Lead Baru</h3>
            <div className="space-y-3">
              <input placeholder="Nama Lengkap" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/>
              <input placeholder="No. Telepon" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/>
              <input placeholder="Project yang diminati" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/>
              <select className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"><option>Hot</option><option>Warm</option><option>Cold</option></select>
              <textarea placeholder="Catatan..." rows={2} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/>
            </div>
            <button onClick={()=>{notify('Lead berhasil ditambahkan!','success');setShowAdd(false);}} className="w-full mt-4 py-3.5 bg-primary text-white font-bold rounded-xl cursor-pointer">Simpan Lead</button>
          </div>
        </div>
      )}
    </div>
  );
}
