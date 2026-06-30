import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

// Data aligned with all other leader modules
const teamStats = { revenue:5370000, target:8000000, prevRevenue:4380000, agents:5, clients:7, pendingApprovals:4, siteVisits:6 };
const pct = Math.round((teamStats.revenue/teamStats.target)*100);
const growth = Math.round(((teamStats.revenue-teamStats.prevRevenue)/teamStats.prevRevenue)*100);

const funnel = [{label:'New Leads',count:177,pct:100,bg:'bg-primary/10',text:'text-primary'},{label:'Follow-up',count:138,pct:78,bg:'bg-primary/30',text:'text-primary'},{label:'Site Visit',count:64,pct:36,bg:'bg-primary/60',text:'text-white'},{label:'Negotiation',count:32,pct:18,bg:'bg-primary/80',text:'text-white'},{label:'Closing',count:22,pct:12,bg:'bg-primary',text:'text-white'}];

const alerts = [
  {name:'Richard Montgomery',project:'The Obsidian Groves',agent:'Julian Vance',days:3,status:'Stagnant' as const},
  {name:'Thomas Hartwell',project:'Marine Wharf',agent:'Mark Rivera',days:4,status:'Critical' as const},
  {name:'Elise Valerius',project:'Marine Wharf',agent:'Sophia Liao',days:2,status:'Needs Follow-up' as const},
  {name:'Nadia Kwon',project:'Alabaster Heights',agent:'Sarah Jenkins',days:2,status:'Needs Follow-up' as const},
];

const activities = [
  {agent:'Julian Vance',action:'checked in at',target:'Emerald Towers Phase 1',time:'10 menit lalu',color:'bg-primary',icon:'location_on'},
  {agent:'Sophia Liao',action:'uploaded chat history for',target:'Lead #8841',time:'30 menit lalu',color:'bg-tertiary',icon:'attach_file'},
  {agent:'Mark Rivera',action:'filed commission claim',target:'Booking BK-909 ($4,250)',time:'1 jam lalu',color:'bg-primary',icon:'payments'},
  {agent:'Diana Mercer',action:'closed deal for',target:'Unit 1205 - Azure Heights',time:'2 jam lalu',color:'bg-tertiary',icon:'handshake'},
  {agent:'Sarah Jenkins',action:'completed follow-up call with',target:'Mrs. Tanaka',time:'3 jam lalu',color:'bg-primary/40',icon:'call'},
];

const agents = [
  {name:'Diana Mercer',initials:'DM',leads:52,closings:8,conv:15.4,revenue:2100000,target:2500000,status:'Top Performer' as const},
  {name:'Julian Vance',initials:'JV',leads:48,closings:6,conv:12.5,revenue:1450000,target:2000000,status:'On Track' as const},
  {name:'Sophia Liao',initials:'SL',leads:34,closings:4,conv:11.8,revenue:920000,target:1500000,status:'On Track' as const},
  {name:'Mark Rivera',initials:'MR',leads:28,closings:3,conv:10.7,revenue:680000,target:1200000,status:'Below Target' as const},
  {name:'Sarah Jenkins',initials:'SJ',leads:15,closings:1,conv:6.7,revenue:220000,target:800000,status:'Needs Improvement' as const},
];

const fp = (n:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

const projectSummary = [
  {name:'The Obsidian Groves',sold:98,total:140,available:30,pct:70},
  {name:'Alabaster Heights',sold:180,total:220,available:25,pct:82},
  {name:'Marine Wharf',sold:12,total:45,available:28,pct:27},
  {name:'Azure Residences',sold:95,total:380,available:265,pct:25},
];

export default function LeaderHome({ notify }: Props) {
  const statusColor = (s:string) => s==='Top Performer'?'text-tertiary':s==='On Track'?'text-primary':s==='Below Target'?'text-on-surface-variant':'text-error';
  const statusDot = (s:string) => s==='Top Performer'?'bg-tertiary':s==='On Track'?'bg-primary':s==='Below Target'?'bg-outline':'bg-error animate-pulse';
  const alertColor = (s:string) => s==='Stagnant'?'border-error bg-error-container/10':s==='Critical'?'border-error bg-error/5':'border-tertiary-container bg-tertiary-fixed/10';
  const alertBadge = (s:string) => s==='Critical'?'bg-error text-white':s==='Stagnant'?'bg-error-container text-on-error-container':'bg-tertiary-fixed text-on-tertiary-fixed-variant';

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="col-span-2 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-label uppercase text-on-surface-variant mb-1">Team Revenue</p>
          <p className="text-2xl font-headline font-bold text-primary">{fp(teamStats.revenue)}</p>
          <p className={`text-xs font-bold mt-1 ${growth>=0?'text-[#1e4620]':'text-error'}`}>{growth>=0?'↑':'↓'} {Math.abs(growth)}% vs bulan lalu</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Target</p>
          <p className="text-2xl font-headline font-bold">{pct}%</p>
          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mt-1"><div className={`h-full rounded-full ${pct>=80?'bg-tertiary':'bg-primary'}`} style={{width:`${pct}%`}}/></div>
        </div>
        <div className="bg-tertiary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Agents</p><p className="text-2xl font-headline font-bold text-tertiary">{teamStats.agents}</p></div>
        <div className="bg-primary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Clients</p><p className="text-2xl font-headline font-bold text-primary">{teamStats.clients}</p></div>
        <div className="bg-error-container/20 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Pending</p><p className="text-2xl font-headline font-bold text-error">{teamStats.pendingApprovals}</p></div>
        <div className="bg-[#e7f5ed] p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Site Visits</p><p className="text-2xl font-headline font-bold text-[#1e4620]">{teamStats.siteVisits}</p></div>
      </div>

      {/* Goal Progress */}
      <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-xl ring-1 ring-outline-variant/10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div><p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">Monthly Goal Progress</p><h3 className="font-headline text-2xl lg:text-3xl font-bold">{fp(teamStats.revenue)} <span className="text-lg text-on-surface-variant font-normal">/ {fp(teamStats.target)}</span></h3></div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full font-label text-xs font-semibold ${pct>=80?'bg-tertiary-fixed/30 text-tertiary':pct>=50?'bg-primary-fixed/30 text-primary':'bg-error-container/30 text-error'}`}>{pct}% Complete</span>
        </div>
        <div className="relative w-full h-3 bg-surface-container rounded-full overflow-hidden mb-3"><div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{width:`${pct}%`}}/></div>
        <div className="flex justify-between text-[10px] font-label text-on-surface-variant/60 uppercase tracking-tighter"><span>Initiated</span><span>Mid-Cycle</span><span>Forecast</span><span>Target</span></div>
      </div>

      {/* Funnel + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 lg:p-8 rounded-xl shadow-sm border border-outline-variant/10">
          <h4 className="font-headline text-xl font-bold mb-8">Team Sales Funnel</h4>
          <div className="flex items-end gap-2 h-48 lg:h-56">
            {funnel.map(f=>(
              <div key={f.label} className="flex-1 flex flex-col items-center gap-2 group">
                <p className="text-sm font-headline font-bold">{f.count}</p>
                <div className={`w-full ${f.bg} rounded-t-lg transition-all duration-500 hover:opacity-80 flex items-center justify-center ${f.text}`} style={{height:`${f.pct}%`}}/>
                <p className="font-label text-[8px] lg:text-[9px] uppercase tracking-widest text-on-surface-variant text-center">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 bg-surface-container-lowest p-6 lg:p-8 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-4"><Icon name="error" className="text-error"/><h4 className="font-headline text-lg font-bold">Priority Alerts</h4><span className="ml-auto text-[10px] font-label font-bold text-error bg-error/10 px-2 py-0.5 rounded-full">{alerts.filter(a=>a.status!=='Needs Follow-up').length}</span></div>
          <div className="space-y-3">
            {alerts.map((a,i)=>(
              <div key={i} className={`p-3 rounded-lg border-l-4 flex items-start justify-between ${alertColor(a.status)}`}>
                <div><h5 className="font-body text-sm font-semibold">{a.name}</h5><p className="text-[10px] text-on-surface-variant">{a.project} • {a.agent}</p><p className="text-[10px] text-on-surface-variant">{a.days} hari lalu</p></div>
                <span className={`text-[9px] font-label font-bold px-2 py-0.5 rounded ${alertBadge(a.status)}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Agent Performance + Project Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Live Activity */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-6 lg:p-8 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex items-center justify-between mb-6"><h4 className="font-headline text-lg font-bold">Live Activity</h4><span className="font-label text-[10px] text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded font-bold">LIVE</span></div>
          <div className="space-y-5 relative">
            <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-outline-variant/30"/>
            {activities.map((a,i)=>(
              <div key={i} className={`relative pl-10 ${i===activities.length-1?'opacity-50':''}`}>
                <div className={`absolute left-3 top-1.5 w-2.5 h-2.5 rounded-full ${a.color} ring-4 ring-surface-container-lowest shadow-sm`}/>
                <p className="font-body text-sm"><span className="font-semibold">{a.agent}</span> {a.action} <span className="text-primary italic">{a.target}</span></p>
                <p className="text-[10px] font-label text-on-surface-variant uppercase mt-0.5">{a.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Ranking */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
          <div className="p-5 border-b border-outline-variant/10 bg-surface-container-low/30"><h4 className="font-headline text-lg font-bold">Agent Ranking</h4></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-outline-variant/10">
                <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">#</th>
                <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Agent</th>
                <th className="px-4 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-right">Revenue</th>
                <th className="px-4 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-right">Target</th>
                <th className="px-4 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-outline-variant/5">
                {agents.map((a,i)=>{
                  const ap=Math.round((a.revenue/a.target)*100);
                  return(
                  <tr key={a.name} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-5 py-3"><div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${i===0?'bg-tertiary-fixed text-on-tertiary-fixed':i===1?'bg-primary-fixed text-on-primary-fixed':'bg-surface-container text-on-surface-variant'}`}>{i+1}</div></td>
                    <td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-[9px] text-primary">{a.initials}</div><div><p className="text-sm font-semibold">{a.name}</p><p className="text-[10px] text-on-surface-variant">{a.leads} leads • {a.closings} closing</p></div></div></td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-primary">{fp(a.revenue)}</td>
                    <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2"><div className="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden"><div className={`h-full rounded-full ${ap>=80?'bg-tertiary':ap>=50?'bg-primary':'bg-error'}`} style={{width:`${Math.min(ap,100)}%`}}/></div><span className="text-xs font-medium">{ap}%</span></div></td>
                    <td className="px-4 py-3"><span className={`w-2 h-2 inline-block rounded-full ${statusDot(a.status)} mr-1.5`}/><span className={`text-xs font-label ${statusColor(a.status)}`}>{a.status}</span></td>
                  </tr>);
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Summary */}
        <div className="lg:col-span-3 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <h4 className="font-headline text-lg font-bold mb-5">Project Summary</h4>
          <div className="space-y-4">
            {projectSummary.map(p=>(
              <div key={p.name}>
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold truncate mr-2">{p.name}</span><span className="text-on-surface-variant shrink-0">{p.sold}/{p.total}</span></div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden"><div className={`h-full rounded-full ${p.pct>=80?'bg-tertiary':p.pct>=50?'bg-primary':'bg-error'}`} style={{width:`${p.pct}%`}}/></div>
                <div className="flex justify-between text-[10px] mt-0.5"><span className="text-on-surface-variant">{p.available} available</span><span className="font-bold">{p.pct}%</span></div>
              </div>
            ))}
          </div>
          <button onClick={()=>notify('Lihat semua projects','info')} className="w-full mt-4 py-2 text-primary text-xs font-label font-semibold hover:bg-primary/5 rounded-lg cursor-pointer">Lihat Semua →</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{icon:'person_add',title:'Assign Leads',desc:'14 leads belum ditugaskan',color:'text-primary'},{icon:'fact_check',title:'Pending Approvals',desc:`${teamStats.pendingApprovals} menunggu validasi`,color:'text-error'},{icon:'location_on',title:'Site Visit Hari Ini',desc:`${teamStats.siteVisits} kunjungan terjadwal`,color:'text-tertiary'},{icon:'download',title:'Download Report',desc:'Export rekap tim',color:'text-primary'}].map(a=>(
          <button key={a.title} onClick={()=>notify(`${a.title}...`,'info')} className="flex items-center gap-4 p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/10 hover:shadow-md hover:border-primary/20 transition-all text-left cursor-pointer group">
            <Icon name={a.icon} className={`${a.color} text-2xl`}/>
            <div><p className="font-body text-sm font-semibold group-hover:text-primary transition-colors">{a.title}</p><p className="text-xs text-on-surface-variant">{a.desc}</p></div>
          </button>
        ))}
      </div>
    </div>
  );
}
