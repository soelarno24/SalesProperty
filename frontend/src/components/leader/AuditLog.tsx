import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface ActivityItem {
  id:string; time:string; date:string; agent:string; agentFull:string; action:string; target:string;
  type:'site_visit'|'attachment'|'commission'|'booking'|'follow_up'|'system';
  verified:boolean; details?:string; amount?:number;
  proofImages?: {url:string; label:string}[];
  notes?:string;
}

interface ValidationItem {
  id:string; title:string; agent:string; agentFull:string; amount:number; type:'commission'|'booking';
  submittedAgo:string; status:'Pending'|'Approved'|'Rejected'; icon:string; iconBg:string;
}

interface HotLead {
  id:string; name:string; category:string; budget:string; agent:string; lastActivity:string;
  status:'Stagnant'|'Needs Follow-up'|'Critical';
}

interface ProofItem {
  id:string; title:string; date:string; location:string; image:string; agent:string; agentFull:string; activityId?:string;
}

const IMG1='https://lh3.googleusercontent.com/aida-public/AB6AXuAIamjiAdsmCv_tLauhjF4-RxEN6p14ov1qugAVSivrCPa2ZuqxI4CTvM2VduJYijZJ17EJ84WZR4npWjLl-E6RKFfB_Ir5LwzqZKKc4Fuxk-YmugQo0LAPQQj6AKzzXpP-7VNK8NuXcQuYZvmi03vl0nqKwxWEjY6-oiz44E84ACOc0hoAm8JFsriqBbMa4EueicbEyTsrBjXv88q5Q2DsPbBNDYPja_0VbWGsttn6IX4eUC83xm7oCZkHZn9Z7xNDhMaWo8FkQq6w';
const IMG2='https://lh3.googleusercontent.com/aida-public/AB6AXuD9PXpKQHwP5Iol5BH775giQ54oN6kOudqDI60az7lpd6M6wFFbfgmQkYnUfqJ1Hnhlq6QeIfEP0-R0LAqG-rMYJ3A1B_jXrlXWGbx1cMSpTCTpX9Q1i9Hv9cLUFxV61DjdOnPwsgM3RlI5Z1P8PTWAWsBb0fSrh_U4Tw5uX4t3i8y9UbVYQt0L7UFti8jBADqooJ3KuiU6ad46kIxbXlFhEcldQvt7lC565cLph0k_PjscLvhPj_-hmzd2m2AoxSdyIj7xbxspqvyI';
const IMG3='https://lh3.googleusercontent.com/aida-public/AB6AXuAE-2k-BcMUvD_cTwXmKgnMYBDXmzaTHJ5l5Yar7vlZRVqV0qgXJHRbFqGy8-CWxEMla7Qe9-fv3lqLdyCeHiSCjkVC9g0p8GXvf-niE_1c21yA_rCC3sYBZ4qP34rX2Z7BaJ-4inKJMY6I3TtoT360-3tAIh2ZFD1nfi395rFSutLweoRjjzMl3XXTF-4-OqPJNNlBSy_j6FhvSCgUFztfq4BVaYb8EHaTDUOVJzCcbTcKgLpec9QslaooA8jEblRs0evnin04EPQa';

const initialActivities: ActivityItem[] = [
  {id:'1',time:'10:45 AM',date:'Hari ini',agent:'Julian V.',agentFull:'Julian Vance',action:'checked in at',target:'Emerald Towers Phase 1',type:'site_visit',verified:true,notes:'Client tertarik unit lantai 4, minta jadwal ulang minggu depan.',proofImages:[{url:IMG1,label:'Site Visit Photo'},{url:IMG3,label:'GPS Verification'}]},
  {id:'2',time:'09:12 AM',date:'Hari ini',agent:'Sophia L.',agentFull:'Sophia Liao',action:'uploaded chat history for',target:'Lead #8841',type:'attachment',verified:false,details:'WhatsApp conversation screenshot',proofImages:[{url:IMG2,label:'Chat Screenshot'}]},
  {id:'3',time:'08:30 AM',date:'Hari ini',agent:'Mark R.',agentFull:'Mark Rivera',action:'filed commission claim for',target:'Booking BK-909',type:'commission',verified:false,amount:4250,proofImages:[{url:IMG2,label:'Signed Agreement'}]},
  {id:'4',time:'08:00 AM',date:'Hari ini',agent:'Diana M.',agentFull:'Diana Mercer',action:'submitted booking request for',target:'Unit 1205 - Azure Heights',type:'booking',verified:false,amount:15000,notes:'Client sudah bayar DP via transfer BCA.',proofImages:[{url:IMG2,label:'Bukti Transfer'},{url:IMG1,label:'Form Booking'}]},
  {id:'5',time:'07:45 AM',date:'Hari ini',agent:'Sarah J.',agentFull:'Sarah Jenkins',action:'completed follow-up call with',target:'Lead #7723 (Mrs. Tanaka)',type:'follow_up',verified:true,notes:'Mrs. Tanaka minta brochure dikirim via email. Prospek tinggi.'},
  {id:'6',time:'04:30 PM',date:'Kemarin',agent:'Julian V.',agentFull:'Julian Vance',action:'site visit with client at',target:'Marine Wharf Pier 12',type:'site_visit',verified:true,proofImages:[{url:IMG1,label:'Site Photo 1'},{url:IMG3,label:'GPS Check-in'},{url:IMG2,label:'Client Signature'}]},
  {id:'7',time:'03:00 PM',date:'Kemarin',agent:'Mark R.',agentFull:'Mark Rivera',action:'uploaded progress report for',target:'The Obsidian Groves',type:'attachment',verified:false,proofImages:[{url:IMG1,label:'Construction Progress'}]},
  {id:'8',time:'EOD',date:'Kemarin',agent:'System',agentFull:'System',action:'Daily Sales Summary generated',target:'',type:'system',verified:true},
];

const initialValidations: ValidationItem[] = [
  {id:'1',title:'Premium Sky Villa - Unit 402',agent:'Julian V.',agentFull:'Julian Vance',amount:12400,type:'commission',submittedAgo:'2 jam lalu',status:'Pending',icon:'request_quote',iconBg:'bg-primary-container/10 text-primary'},
  {id:'2',title:'Riverfront Plot 12B - Reservation',agent:'Sophia L.',agentFull:'Sophia Liao',amount:8150,type:'commission',submittedAgo:'4 jam lalu',status:'Pending',icon:'inventory_2',iconBg:'bg-tertiary-container/10 text-tertiary'},
  {id:'3',title:'Emerald Towers Unit 305',agent:'Mark R.',agentFull:'Mark Rivera',amount:18500,type:'booking',submittedAgo:'5 jam lalu',status:'Pending',icon:'home',iconBg:'bg-primary-container/10 text-primary'},
  {id:'4',title:'Azure Heights Penthouse A',agent:'Diana M.',agentFull:'Diana Mercer',amount:24000,type:'commission',submittedAgo:'1 hari lalu',status:'Approved',icon:'request_quote',iconBg:'bg-tertiary-container/10 text-tertiary'},
];

const allProofItems: ProofItem[] = [
  {id:'1',title:'Site Visit Photo',date:'Mar 14, 2024',location:'Emerald Towers',image:IMG1,agent:'Julian V.',agentFull:'Julian Vance',activityId:'1'},
  {id:'2',title:'Signed Agreement',date:'Mar 14, 2024',location:'Unit 402',image:IMG2,agent:'Mark R.',agentFull:'Mark Rivera',activityId:'3'},
  {id:'3',title:'GPS Verification',date:'Mar 14, 2024',location:'Lead #9112',image:IMG3,agent:'Julian V.',agentFull:'Julian Vance',activityId:'1'},
  {id:'4',title:'Client Meeting Photo',date:'Mar 13, 2024',location:'Marine Wharf',image:IMG1,agent:'Julian V.',agentFull:'Julian Vance',activityId:'6'},
  {id:'5',title:'Chat Screenshot',date:'Mar 14, 2024',location:'Lead #8841',image:IMG2,agent:'Sophia L.',agentFull:'Sophia Liao',activityId:'2'},
  {id:'6',title:'Bukti Transfer',date:'Mar 14, 2024',location:'Azure Heights',image:IMG2,agent:'Diana M.',agentFull:'Diana Mercer',activityId:'4'},
  {id:'7',title:'Construction Progress',date:'Mar 13, 2024',location:'Obsidian Groves',image:IMG1,agent:'Mark R.',agentFull:'Mark Rivera',activityId:'7'},
];

const hotLeads: HotLead[] = [
  {id:'1',name:'Richard Montgomery',category:'Residential',budget:'$1.2M',agent:'Julian Vance',lastActivity:'3 hari lalu',status:'Stagnant'},
  {id:'2',name:'Elise Valerius',category:'Commercial',budget:'$4.5M',agent:'Sophia Liao',lastActivity:'2 hari lalu',status:'Needs Follow-up'},
  {id:'3',name:'Thomas Hartwell',category:'Luxury Villa',budget:'$2.8M',agent:'Mark Rivera',lastActivity:'4 hari lalu',status:'Critical'},
  {id:'4',name:'Nadia Kwon',category:'Residential',budget:'$980K',agent:'Sarah Jenkins',lastActivity:'2 hari lalu',status:'Needs Follow-up'},
];

const fp = (n:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(n);
const agentNames = [...new Set(initialActivities.filter(a=>a.agent!=='System').map(a=>a.agent))];
const agentFullMap: Record<string,string> = {};
initialActivities.forEach(a=>{ if(a.agent!=='System') agentFullMap[a.agent]=a.agentFull; });

export default function AuditLog({ notify }: Props) {
  const [validations, setValidations] = useState<ValidationItem[]>(initialValidations);
  const [valTab, setValTab] = useState<'all'|'commission'|'booking'>('all');
  const [selectedProof, setSelectedProof] = useState<ProofItem|null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem|null>(null);

  // Global agent filter (syncs across feed, validations, proof gallery)
  const [globalAgent, setGlobalAgent] = useState<string>('all');
  const [activityType, setActivityType] = useState<string>('all');

  // Filtered data
  const filteredActivities = initialActivities.filter(a => {
    const ma = globalAgent==='all' || a.agent===globalAgent;
    const mt = activityType==='all' || a.type===activityType;
    return ma && mt;
  });
  const filteredValidations = validations.filter(v => {
    const ma = globalAgent==='all' || v.agent===globalAgent;
    const mt = valTab==='all' ? v.status==='Pending' : valTab==='commission' ? v.type==='commission'&&v.status==='Pending' : v.type==='booking'&&v.status==='Pending';
    return ma && mt;
  });
  const filteredProofs = allProofItems.filter(p => globalAgent==='all' || p.agent===globalAgent);
  const filteredHotLeads = hotLeads.filter(l => {
    if(globalAgent==='all') return true;
    const full = agentFullMap[globalAgent];
    return full && l.agent===full;
  });

  const agentCount = (agent:string) => initialActivities.filter(a=>a.agent===agent).length;

  const handleApprove = (id:string) => { setValidations(validations.map(v=>v.id===id?{...v,status:'Approved'}:v)); notify('Berhasil disetujui!','success'); };
  const handleReject = (id:string) => { setValidations(validations.map(v=>v.id===id?{...v,status:'Rejected'}:v)); notify('Ditolak.','error'); };
  const handleNudge = (agent:string) => { notify(`Reminder terkirim ke ${agent}!`,'success'); };

  const typeIcon = (t:ActivityItem['type']) => {
    if(t==='site_visit') return {icon:'location_on',color:'bg-primary'};
    if(t==='attachment') return {icon:'attach_file',color:'bg-tertiary'};
    if(t==='commission') return {icon:'payments',color:'bg-primary'};
    if(t==='booking') return {icon:'home',color:'bg-primary'};
    if(t==='follow_up') return {icon:'call',color:'bg-tertiary'};
    return {icon:'info',color:'bg-outline'};
  };
  const statusStyle = (s:HotLead['status']) => s==='Stagnant'?'bg-error-container text-on-error-container':s==='Critical'?'bg-error text-on-error':'bg-tertiary-container text-on-tertiary-container';
  const typeLabel = (t:string) => ({site_visit:'Site Visit',attachment:'Attachment',commission:'Klaim Komisi',booking:'Booking Request',follow_up:'Follow-up Call',system:'System'}[t]||t);

  const selectAgent = (agent:string) => { setGlobalAgent(agent); setActivityType('all'); };

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline text-3xl lg:text-4xl font-bold mb-2">Audit Log & Validasi</h2>
          <p className="font-body text-on-surface-variant max-w-xl">Pemantauan aktivitas harian sales, verifikasi site visit, dan validasi permintaan booking & komisi.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>notify('Download report...','info')} className="px-5 py-2 bg-surface-container-high text-on-surface font-label text-sm font-semibold rounded-lg hover:bg-surface-dim cursor-pointer">Download Report</button>
          <button onClick={()=>notify('Syncing GPS logs...','info')} className="px-5 py-2 bg-gradient-to-r from-primary to-primary-container text-white font-label text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 cursor-pointer">Sync GPS Logs</button>
        </div>
      </div>

      {/* Global Agent Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Icon name="filter_alt" className="text-primary text-lg"/>
            <span className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Filter Agent:</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={()=>{const el=document.getElementById('agent-scroll');if(el)el.scrollBy({left:-200,behavior:'smooth'});}} className="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-dim text-on-surface-variant transition-colors cursor-pointer shrink-0"><Icon name="chevron_left" className="text-base"/></button>
            <button onClick={()=>{const el=document.getElementById('agent-scroll');if(el)el.scrollBy({left:200,behavior:'smooth'});}} className="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-dim text-on-surface-variant transition-colors cursor-pointer shrink-0"><Icon name="chevron_right" className="text-base"/></button>
          </div>
        </div>
        <div className="relative">
          {/* Fade edges to indicate scrollable */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-surface-container-lowest to-transparent z-10 pointer-events-none rounded-l-lg"/>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-surface-container-lowest to-transparent z-10 pointer-events-none rounded-r-lg"/>
          <div id="agent-scroll" className="flex gap-2 overflow-x-auto pb-2 px-1 scroll-smooth" style={{scrollbarWidth:'thin',scrollbarColor:'#c3c6d5 transparent'}}>
            <button onClick={()=>selectAgent('all')} className={`px-4 py-2.5 text-xs font-label font-bold rounded-full whitespace-nowrap cursor-pointer transition-all shrink-0 ${globalAgent==='all'?'bg-primary text-white shadow-md':'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}>
              <span className="flex items-center gap-1.5"><Icon name="groups" className="text-sm"/>Semua Agent ({initialActivities.length})</span>
            </button>
            {agentNames.map(name=>(
              <button key={name} onClick={()=>selectAgent(name)} className={`px-4 py-2.5 text-xs font-label font-bold rounded-full whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 shrink-0 ${globalAgent===name?'bg-primary text-white shadow-md':'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${globalAgent===name?'bg-white/20 text-white':'bg-primary/10 text-primary'}`}>{name.split(' ').map(n=>n[0]).join('')}</span>
                {agentFullMap[name]} ({agentCount(name)})
              </button>
            ))}
          </div>
        </div>
        {globalAgent!=='all' && (
          <div className="mt-3 flex items-center justify-between bg-primary-fixed/30 rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">{globalAgent.split(' ').map(n=>n[0]).join('')}</div>
              <div><p className="text-sm font-bold text-on-surface">{agentFullMap[globalAgent]}</p><p className="text-[10px] text-on-surface-variant">{agentCount(globalAgent)} aktivitas • {filteredProofs.length} bukti kerja • {filteredValidations.length} validasi pending</p></div>
            </div>
            <button onClick={()=>selectAgent('all')} className="px-3 py-1.5 text-xs font-label font-bold text-primary hover:bg-primary/10 rounded-lg cursor-pointer flex items-center gap-1"><Icon name="close" className="text-sm"/>Reset</button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Activity Feed */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col" style={{minHeight:'550px'}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-xl font-bold">Activity Feed</h3>
              <span className="font-label text-[10px] text-tertiary bg-tertiary-fixed px-2 py-1 rounded font-bold">LIVE</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
              {[{k:'all',l:'All',i:'list'},{k:'site_visit',l:'Visit',i:'location_on'},{k:'commission',l:'Komisi',i:'payments'},{k:'booking',l:'Booking',i:'home'},{k:'follow_up',l:'Call',i:'call'},{k:'attachment',l:'File',i:'attach_file'}].map(f=>(
                <button key={f.k} onClick={()=>setActivityType(f.k)} className={`px-2.5 py-1 text-[9px] font-label font-bold rounded flex items-center gap-1 whitespace-nowrap cursor-pointer transition-colors ${activityType===f.k?'bg-primary-fixed text-on-primary-fixed-variant':'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}><Icon name={f.i} className="text-[12px]"/>{f.l}</button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
              {filteredActivities.length>0 ? filteredActivities.map((item,i)=>{
                const ti=typeIcon(item.type); const hasProofs=(item.proofImages&&item.proofImages.length>0);
                return (
                  <div key={item.id} className={`relative pl-6 border-l-2 border-primary/20 pb-2 cursor-pointer hover:bg-surface-container-low/50 rounded-r-lg pr-2 py-1 transition-colors ${i===filteredActivities.length-1&&item.type==='system'?'opacity-50':''}`} onClick={()=>item.type!=='system'&&setSelectedActivity(item)}>
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${ti.color} border-4 border-surface-container-lowest shadow-sm`}/>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-label text-[10px] text-outline uppercase tracking-wider mb-1">{item.date} • {item.time} {item.verified&&'• ✓ GPS'}</p>
                      {hasProofs && <span className="text-[9px] font-label font-bold text-primary bg-primary-fixed px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0"><Icon name="image" className="text-[10px]"/>{item.proofImages!.length}</span>}
                    </div>
                    <p className="font-body text-sm text-on-surface mb-1"><span className="font-semibold">{item.agent}</span> {item.action} <span className="text-primary italic">{item.target}</span></p>
                    {item.amount && <p className="text-xs font-bold text-primary">{fp(item.amount)}</p>}
                    {hasProofs && <div className="flex gap-1 mt-1.5">{item.proofImages!.slice(0,3).map((p,pi)=><div key={pi} className="w-10 h-10 rounded overflow-hidden border border-outline-variant/20"><img src={p.url} alt="" className="w-full h-full object-cover"/></div>)}{item.proofImages!.length>3&&<div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+{item.proofImages!.length-3}</div>}</div>}
                  </div>
                );
              }) : <div className="flex flex-col items-center py-12 text-center"><Icon name="search_off" className="text-4xl text-on-surface-variant/30 mb-3"/><p className="text-sm text-on-surface-variant">Tidak ada aktivitas ditemukan.</p></div>}
            </div>
            <div className="mt-3 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
              <p className="text-[10px] font-label text-on-surface-variant"><span className="font-bold text-on-surface">{filteredActivities.length}</span> / {initialActivities.length} aktivitas</p>
              {activityType!=='all'&&<button onClick={()=>setActivityType('all')} className="text-[10px] font-label text-primary font-bold cursor-pointer">Reset</button>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Pending Validations */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <h3 className="font-headline text-xl font-bold">Pending Validations {globalAgent!=='all'&&<span className="text-sm font-normal text-on-surface-variant">— {agentFullMap[globalAgent]}</span>}</h3>
              <div className="flex gap-2 text-xs font-label">
                {(['all','booking','commission'] as const).map(t=><button key={t} onClick={()=>setValTab(t)} className={`cursor-pointer ${valTab===t?'text-primary font-bold':'text-on-surface-variant hover:text-primary'}`}>{t==='all'?`All (${filteredValidations.length})`:t==='booking'?'Unit Requests':'Commission Claims'}</button>).reduce((a:React.ReactNode[],b,i)=>i===0?[b]:[...a,<span key={`s${i}`} className="text-outline-variant">|</span>,b],[] as React.ReactNode[])}
              </div>
            </div>
            <div className="space-y-3">
              {filteredValidations.map(v=>(
                <div key={v.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-surface-bright rounded-lg border border-outline-variant/10 hover:shadow-md transition-all gap-4">
                  <div className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${v.iconBg}`}><Icon name={v.icon}/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-1 gap-1"><p className="font-body text-sm font-bold truncate">{v.title}</p><p className="font-headline text-sm font-bold text-primary shrink-0">{fp(v.amount)}</p></div>
                    <p className="font-label text-[10px] text-on-surface-variant">Agent: <span className="text-on-surface">{v.agentFull}</span> • {v.submittedAgo}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={()=>handleReject(v.id)} className="p-2 text-error hover:bg-error-container/20 rounded cursor-pointer"><Icon name="close"/></button>
                    <button onClick={()=>handleApprove(v.id)} className="px-4 py-1.5 bg-primary text-white text-xs font-label font-bold rounded hover:bg-primary-container cursor-pointer">APPROVE</button>
                  </div>
                </div>
              ))}
              {filteredValidations.length===0&&<p className="text-center py-8 text-on-surface-variant">Tidak ada validasi pending{globalAgent!=='all'?` untuk ${agentFullMap[globalAgent]}`:''}.</p>}
            </div>
          </div>

          {/* Proof of Work Gallery */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-xl font-bold">Proof of Work {globalAgent!=='all'&&<span className="text-sm font-normal text-on-surface-variant">— {agentFullMap[globalAgent]} ({filteredProofs.length})</span>}</h3>
            </div>
            {filteredProofs.length>0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProofs.map(p=>(
                  <div key={p.id} className="group relative aspect-square rounded-lg overflow-hidden border border-outline-variant/10 cursor-pointer" onClick={()=>setSelectedProof(p)}>
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-white font-label text-[10px] font-bold uppercase">{p.title}</p>
                      <p className="text-white/80 text-[8px]">{p.date} • {p.location}</p>
                      <p className="text-white/60 text-[8px] mt-0.5">by {p.agentFull}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-center py-8 text-on-surface-variant">Tidak ada bukti kerja{globalAgent!=='all'?` untuk ${agentFullMap[globalAgent]}`:''}.</p>}
          </div>

          {/* Hot Lead Monitoring */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <h3 className="font-headline text-xl font-bold">Hot Lead Monitoring</h3>
              <div className="flex items-center gap-1 text-[10px] font-label text-error font-bold"><span className="w-2 h-2 rounded-full bg-error animate-pulse"/>{hotLeads.filter(l=>l.status!=='Needs Follow-up').length} Overdue</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2"><thead><tr className="text-left">
                <th className="pb-3 font-label text-[10px] uppercase tracking-widest text-outline pl-2">Lead</th>
                <th className="pb-3 font-label text-[10px] uppercase tracking-widest text-outline">Agent</th>
                <th className="pb-3 font-label text-[10px] uppercase tracking-widest text-outline">Last</th>
                <th className="pb-3 font-label text-[10px] uppercase tracking-widest text-outline">Status</th>
                <th className="pb-3 font-label text-[10px] uppercase tracking-widest text-outline text-right pr-2">Action</th>
              </tr></thead><tbody>
                {filteredHotLeads.map(l=>(
                  <tr key={l.id} className="bg-surface-bright hover:bg-surface-container-high transition-colors">
                    <td className="py-3 pl-4 rounded-l-lg"><p className="font-body text-sm font-bold">{l.name}</p><p className="font-label text-[10px] text-on-surface-variant">{l.category} • {l.budget}</p></td>
                    <td className="py-3 text-sm">{l.agent}</td>
                    <td className="py-3 text-sm">{l.lastActivity}</td>
                    <td className="py-3"><span className={`px-2 py-1 text-[10px] font-label font-bold rounded uppercase ${statusStyle(l.status)}`}>{l.status}</span></td>
                    <td className="py-3 pr-4 rounded-r-lg text-right"><button onClick={()=>handleNudge(l.agent)} className="px-3 py-1.5 bg-surface-container-highest text-primary text-[10px] font-label font-bold rounded-lg hover:bg-primary hover:text-white transition-all cursor-pointer">NUDGE</button></td>
                  </tr>
                ))}
                {filteredHotLeads.length===0&&<tr><td colSpan={5} className="py-8 text-center text-on-surface-variant">Tidak ada hot lead{globalAgent!=='all'?` untuk agent ini`:''}.</td></tr>}
              </tbody></table>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}

      {/* Proof Preview */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-fade-in" onClick={()=>setSelectedProof(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="relative"><img src={selectedProof.image} alt="" className="w-full max-h-[55vh] object-contain bg-surface-container-low"/><button onClick={()=>setSelectedProof(null)} className="absolute top-4 right-4 w-10 h-10 bg-on-surface/60 text-white rounded-full flex items-center justify-center hover:bg-on-surface/80 cursor-pointer"><Icon name="close"/></button></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="font-headline text-lg font-bold">{selectedProof.title}</p><p className="text-sm text-on-surface-variant">{selectedProof.date} • {selectedProof.location}</p><p className="text-xs text-primary font-medium mt-1">by {selectedProof.agentFull}</p></div>
                <button onClick={()=>{notify('Downloaded!','success');setSelectedProof(null);}} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg cursor-pointer flex items-center gap-2"><Icon name="download" className="text-base"/>Download</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={()=>setSelectedActivity(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up my-8 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${typeIcon(selectedActivity.type).color} flex items-center justify-center text-white`}><Icon name={typeIcon(selectedActivity.type).icon} className="text-2xl"/></div>
                  <div>
                    <h3 className="font-headline text-xl font-bold">{typeLabel(selectedActivity.type)}</h3>
                    <p className="text-sm text-on-surface-variant">{selectedActivity.date} • {selectedActivity.time}</p>
                  </div>
                </div>
                <button onClick={()=>setSelectedActivity(null)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
              </div>

              {/* Info */}
              <div className="bg-surface-container-low rounded-xl p-5 space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Agent</span><span className="font-bold">{selectedActivity.agentFull}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Aksi</span><span className="font-medium">{selectedActivity.action}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Target</span><span className="font-medium text-primary">{selectedActivity.target}</span></div>
                {selectedActivity.amount&&<div className="flex justify-between text-sm"><span className="text-on-surface-variant">Jumlah</span><span className="font-bold text-primary text-lg">{fp(selectedActivity.amount)}</span></div>}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Verifikasi GPS</span>
                  <span className={`flex items-center gap-1 font-bold ${selectedActivity.verified?'text-primary':'text-on-surface-variant'}`}><Icon name={selectedActivity.verified?'verified':'pending'} className="text-base"/>{selectedActivity.verified?'Terverifikasi':'Belum'}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedActivity.notes && (
                <div className="bg-tertiary-fixed/20 rounded-xl p-5 mb-6 border-l-4 border-tertiary">
                  <p className="text-xs font-label font-bold text-tertiary uppercase tracking-wider mb-2">Catatan Agent</p>
                  <p className="text-sm text-on-surface">{selectedActivity.notes}</p>
                </div>
              )}

              {/* Proof Images */}
              {selectedActivity.proofImages && selectedActivity.proofImages.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-2"><Icon name="photo_library" className="text-primary text-base"/>Bukti Kerja ({selectedActivity.proofImages.length} foto)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedActivity.proofImages.map((p,i)=>(
                      <div key={i} className="group relative rounded-lg overflow-hidden border border-outline-variant/10 cursor-pointer aspect-square" onClick={e=>{e.stopPropagation();setSelectedActivity(null);setSelectedProof({id:String(i),title:p.label,date:selectedActivity.date,location:selectedActivity.target,image:p.url,agent:selectedActivity.agent,agentFull:selectedActivity.agentFull});}}>
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                          <p className="text-white text-[10px] font-bold uppercase">{p.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/10">
                {selectedActivity.type==='commission'&&selectedActivity.amount&&<button onClick={()=>{notify('Klaim komisi disetujui!','success');setSelectedActivity(null);}} className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold cursor-pointer flex items-center gap-2"><Icon name="check"/>Approve Klaim</button>}
                {selectedActivity.type==='booking'&&<button onClick={()=>{notify('Booking request disetujui!','success');setSelectedActivity(null);}} className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold cursor-pointer flex items-center gap-2"><Icon name="check"/>Approve Booking</button>}
                <button onClick={()=>setSelectedActivity(null)} className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface text-sm font-semibold cursor-pointer">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
