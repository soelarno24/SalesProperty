import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface SiteVisit {
  id:string; agent:string; client:string; project:string; unit:string;
  date:string; time:string; status:'Scheduled'|'Completed'|'Cancelled'|'No Show';
  notes:string; feedback:string;
}

const initialVisits: SiteVisit[] = [
  {id:'1',agent:'Michael Scott',client:'Sarah Johnson',project:'The Obsidian Groves',unit:'Unit 402',date:'2024-02-16',time:'10:00',status:'Scheduled',notes:'Client tertarik tipe penthouse',feedback:''},
  {id:'2',agent:'Angela Martin',client:'David Kim',project:'Alabaster Heights',unit:'Penthouse C',date:'2024-02-16',time:'14:00',status:'Scheduled',notes:'Follow-up dari open house minggu lalu',feedback:''},
  {id:'3',agent:'Dwight Schrute',client:'Maria Santos',project:'Marine Wharf',unit:'Suite 12',date:'2024-02-15',time:'09:30',status:'Completed',notes:'',feedback:'Client sangat tertarik, kemungkinan besar closing minggu depan. Minta diskon 5%.'},
  {id:'4',agent:'Jim Halpert',client:'James Wilson',project:'Azure Residences',unit:'Unit 25-01',date:'2024-02-15',time:'15:00',status:'No Show',notes:'Client tidak hadir tanpa konfirmasi',feedback:''},
  {id:'5',agent:'Michael Scott',client:'Emily Davis',project:'The Obsidian Groves',unit:'Unit 105',date:'2024-02-14',time:'11:00',status:'Completed',notes:'',feedback:'Client meminta waktu untuk diskusi dengan keluarga. Follow-up 3 hari.'},
  {id:'6',agent:'Dwight Schrute',client:'Tom Brown',project:'Villa Verde',unit:'Villa V-08',date:'2024-02-14',time:'16:00',status:'Cancelled',notes:'Client reschedule ke minggu depan',feedback:''},
];

export default function FieldMonitoring({ notify }: Props) {
  const [visits, setVisits] = useState<SiteVisit[]>(initialVisits);
  const [filter, setFilter] = useState<'All'|'Scheduled'|'Completed'|'No Show'|'Cancelled'>('All');
  const [selectedVisit, setSelectedVisit] = useState<SiteVisit|null>(null);

  const filtered = visits.filter(v=>filter==='All'?true:v.status===filter);
  const today = visits.filter(v=>v.date==='2024-02-16').length;
  const completed = visits.filter(v=>v.status==='Completed').length;
  const noShow = visits.filter(v=>v.status==='No Show').length;

  const statusStyle = (s:SiteVisit['status']) => {
    if(s==='Scheduled') return 'bg-primary-fixed text-on-primary-fixed-variant';
    if(s==='Completed') return 'bg-[#e7f5ed] text-[#1e4620]';
    if(s==='No Show') return 'bg-error-container text-on-error-container';
    return 'bg-surface-container-high text-on-surface-variant';
  };

  const handleUpdateStatus = (id:string, status:SiteVisit['status']) => {
    setVisits(visits.map(v=>v.id===id?{...v,status}:v));
    setSelectedVisit(null);
    notify(`Status visit berhasil diubah ke ${status}!`,'success');
  };

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-8">
      <div><h2 className="font-headline text-3xl lg:text-4xl font-bold">Monitoring Lapangan</h2><p className="text-on-surface-variant mt-1">Pantau jadwal dan laporan site visit tim sales.</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10"><p className="text-[10px] font-label uppercase text-on-surface-variant">Total Visit</p><p className="text-2xl font-headline font-bold">{visits.length}</p></div>
        <div className="bg-primary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Hari Ini</p><p className="text-2xl font-headline font-bold text-primary">{today}</p></div>
        <div className="bg-tertiary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Selesai</p><p className="text-2xl font-headline font-bold text-tertiary">{completed}</p></div>
        <div className="bg-error-container/10 p-5 rounded-xl border border-error/5"><p className="text-[10px] font-label uppercase text-on-surface-variant">No Show</p><p className="text-2xl font-headline font-bold text-error">{noShow}</p></div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['All','Scheduled','Completed','No Show','Cancelled'] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 text-xs font-semibold rounded-full font-label cursor-pointer transition-colors ${filter===f?'bg-primary text-white':'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}>{f}</button>
        ))}
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {filtered.map(v=>(
          <div key={v.id} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={()=>setSelectedVisit(v)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="text-center shrink-0 bg-surface-container-low rounded-lg p-3 min-w-[64px]">
                  <p className="text-lg font-headline font-bold">{new Date(v.date).getDate()}</p>
                  <p className="text-[10px] font-label uppercase text-on-surface-variant">{new Date(v.date).toLocaleDateString('id-ID',{month:'short'})}</p>
                  <p className="text-xs font-bold text-primary mt-1">{v.time}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold text-on-surface">{v.client}</h4>
                    <span className="text-xs text-on-surface-variant">oleh <span className="font-semibold text-primary">{v.agent}</span></span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{v.project} — {v.unit}</p>
                  {v.notes && <p className="text-xs text-on-surface-variant mt-1 italic">"{v.notes}"</p>}
                  {v.feedback && (
                    <div className="mt-2 p-3 bg-tertiary-fixed/20 rounded-lg border-l-4 border-tertiary">
                      <p className="text-xs font-label font-bold text-tertiary uppercase tracking-wider mb-1">Laporan Agent:</p>
                      <p className="text-sm text-on-surface">{v.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle(v.status)}`}>{v.status}</span>
                <Icon name="chevron_right" className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity"/>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div className="text-center py-16 text-on-surface-variant">Tidak ada site visit yang cocok.</div>}
      </div>

      {/* Detail Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in" onClick={e=>{if(e.target===e.currentTarget)setSelectedVisit(null);}}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up p-8 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6"><h3 className="font-headline text-xl font-bold">Detail Site Visit</h3><button onClick={()=>setSelectedVisit(null)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close"/></button></div>
            <div className="space-y-4 mb-6">
              <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Agent</span><span className="font-semibold">{selectedVisit.agent}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Client</span><span className="font-semibold">{selectedVisit.client}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Project</span><span className="font-semibold">{selectedVisit.project} — {selectedVisit.unit}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Jadwal</span><span className="font-semibold">{selectedVisit.date} • {selectedVisit.time}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-on-surface-variant">Status</span><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyle(selectedVisit.status)}`}>{selectedVisit.status}</span></div>
              </div>
              {selectedVisit.notes && <div className="bg-surface-container-low rounded-xl p-4"><p className="text-xs font-label font-bold uppercase text-on-surface-variant mb-1">Catatan</p><p className="text-sm">{selectedVisit.notes}</p></div>}
              {selectedVisit.feedback && <div className="bg-tertiary-fixed/20 rounded-xl p-4 border-l-4 border-tertiary"><p className="text-xs font-label font-bold uppercase text-tertiary mb-1">Laporan Agent</p><p className="text-sm">{selectedVisit.feedback}</p></div>}
            </div>
            <div>
              <p className="text-xs font-label font-bold uppercase text-on-surface-variant mb-2">Ubah Status</p>
              <div className="grid grid-cols-2 gap-2">
                {(['Scheduled','Completed','No Show','Cancelled'] as const).map(s=>(
                  <button key={s} onClick={()=>handleUpdateStatus(selectedVisit.id,s)} className={`py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedVisit.status===s?`${statusStyle(s)} ring-2 ring-primary`:' bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
