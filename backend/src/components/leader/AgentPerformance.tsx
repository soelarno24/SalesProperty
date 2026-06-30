import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface AgentPerf {
  id:string; name:string; initials:string; avatar:string; role:string; tier:string;
  // This month
  leads:number; followUps:number; siteVisits:number; closings:number; lostDeals:number;
  revenue:number; target:number; commission:number; conversionRate:number;
  avgDealSize:number; responseTime:string; clientSatisfaction:number;
  // Last month
  prevLeads:number; prevFollowUps:number; prevSiteVisits:number; prevClosings:number;
  prevRevenue:number; prevTarget:number; prevCommission:number; prevConversionRate:number;
}

const agents: AgentPerf[] = [
  {id:'1',name:'Julian Vance',initials:'JV',avatar:'',role:'Senior Sales',tier:'Tier 1',
    leads:48,followUps:35,siteVisits:18,closings:6,lostDeals:3,revenue:1450000,target:2000000,commission:36250,conversionRate:12.5,avgDealSize:241667,responseTime:'1.2 jam',clientSatisfaction:94,
    prevLeads:42,prevFollowUps:30,prevSiteVisits:14,prevClosings:4,prevRevenue:980000,prevTarget:2000000,prevCommission:24500,prevConversionRate:9.5},
  {id:'2',name:'Sophia Liao',initials:'SL',avatar:'',role:'Lead Associate',tier:'Tier 2',
    leads:34,followUps:28,siteVisits:12,closings:4,lostDeals:2,revenue:920000,target:1500000,commission:23000,conversionRate:11.8,avgDealSize:230000,responseTime:'0.8 jam',clientSatisfaction:97,
    prevLeads:30,prevFollowUps:22,prevSiteVisits:10,prevClosings:3,prevRevenue:750000,prevTarget:1500000,prevCommission:18750,prevConversionRate:10.0},
  {id:'3',name:'Mark Rivera',initials:'MR',avatar:'',role:'Sales Agent',tier:'Tier 2',
    leads:28,followUps:20,siteVisits:8,closings:3,lostDeals:4,revenue:680000,target:1200000,commission:17000,conversionRate:10.7,avgDealSize:226667,responseTime:'2.1 jam',clientSatisfaction:82,
    prevLeads:32,prevFollowUps:25,prevSiteVisits:11,prevClosings:5,prevRevenue:850000,prevTarget:1200000,prevCommission:21250,prevConversionRate:15.6},
  {id:'4',name:'Diana Mercer',initials:'DM',avatar:'',role:'Regional Director',tier:'Tier 1',
    leads:52,followUps:45,siteVisits:22,closings:8,lostDeals:1,revenue:2100000,target:2500000,commission:52500,conversionRate:15.4,avgDealSize:262500,responseTime:'0.5 jam',clientSatisfaction:98,
    prevLeads:48,prevFollowUps:40,prevSiteVisits:20,prevClosings:7,prevRevenue:1800000,prevTarget:2500000,prevCommission:45000,prevConversionRate:14.6},
  {id:'5',name:'Sarah Jenkins',initials:'SJ',avatar:'',role:'Sales Agent',tier:'Trainee',
    leads:15,followUps:10,siteVisits:4,closings:1,lostDeals:2,revenue:220000,target:800000,commission:5500,conversionRate:6.7,avgDealSize:220000,responseTime:'3.5 jam',clientSatisfaction:75,
    prevLeads:12,prevFollowUps:8,prevSiteVisits:3,prevClosings:0,prevRevenue:0,prevTarget:800000,prevCommission:0,prevConversionRate:0},
];

const fp = (n:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

export default function AgentPerformance({ notify }: Props) {
  const [selectedAgent, setSelectedAgent] = useState<AgentPerf|null>(null);
  const [viewMode, setViewMode] = useState<'cards'|'table'>('cards');

  const teamTotals = {
    leads: agents.reduce((s,a)=>s+a.leads,0), closings: agents.reduce((s,a)=>s+a.closings,0),
    revenue: agents.reduce((s,a)=>s+a.revenue,0), target: agents.reduce((s,a)=>s+a.target,0),
    commission: agents.reduce((s,a)=>s+a.commission,0),
    prevRevenue: agents.reduce((s,a)=>s+a.prevRevenue,0), prevClosings: agents.reduce((s,a)=>s+a.prevClosings,0),
  };
  const teamPct = Math.round((teamTotals.revenue/teamTotals.target)*100);
  const revenueGrowth = teamTotals.prevRevenue>0 ? Math.round(((teamTotals.revenue-teamTotals.prevRevenue)/teamTotals.prevRevenue)*100) : 100;

  const diff = (cur:number,prev:number) => {
    if(prev===0) return cur>0?{val:'+100%',up:true}:{val:'0%',up:true};
    const p = Math.round(((cur-prev)/prev)*100);
    return {val:`${p>=0?'+':''}${p}%`, up:p>=0};
  };

  const tierStyle = (t:string) => t==='Tier 1'?'bg-tertiary-fixed text-on-tertiary-fixed':'bg-secondary-fixed text-on-secondary-fixed';
  const Bar = ({pct,color='bg-primary'}:{pct:number;color?:string}) => <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{width:`${Math.min(pct,100)}%`}}/></div>;

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div><h2 className="font-headline text-3xl lg:text-4xl font-bold mb-2">Performa Agent Sales</h2><p className="text-on-surface-variant max-w-xl">Rekap lengkap kinerja, target, capaian, leads, closing, dan perbandingan performa bulan ini vs bulan lalu.</p></div>
        <div className="flex gap-3">
          <div className="flex bg-surface-container-low rounded-lg p-1">
            <button onClick={()=>setViewMode('cards')} className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all flex items-center gap-1.5 ${viewMode==='cards'?'bg-white shadow-sm text-primary font-semibold':'text-on-surface-variant'}`}><Icon name="grid_view" className="text-base"/>Cards</button>
            <button onClick={()=>setViewMode('table')} className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all flex items-center gap-1.5 ${viewMode==='table'?'bg-white shadow-sm text-primary font-semibold':'text-on-surface-variant'}`}><Icon name="table_rows" className="text-base"/>Table</button>
          </div>
          <button onClick={()=>notify('Export performa...','info')} className="px-5 py-2 bg-primary text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"><Icon name="download"/>Export</button>
        </div>
      </div>

      {/* Team Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 col-span-2 md:col-span-1">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Team Revenue</p>
          <p className="text-2xl font-headline font-bold text-primary">{fp(teamTotals.revenue)}</p>
          <p className={`text-xs font-bold mt-1 ${revenueGrowth>=0?'text-[#1e4620]':'text-error'}`}>{revenueGrowth>=0?'↑':'↓'} {Math.abs(revenueGrowth)}% vs bulan lalu</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Target</p>
          <p className="text-2xl font-headline font-bold">{teamPct}%</p>
          <Bar pct={teamPct} color={teamPct>=80?'bg-tertiary':teamPct>=50?'bg-primary':'bg-error'}/>
        </div>
        <div className="bg-tertiary-fixed/30 p-5 rounded-xl">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Total Leads</p>
          <p className="text-2xl font-headline font-bold text-tertiary">{teamTotals.leads}</p>
        </div>
        <div className="bg-[#e7f5ed] p-5 rounded-xl">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Total Closing</p>
          <p className="text-2xl font-headline font-bold text-[#1e4620]">{teamTotals.closings}</p>
          <p className={`text-xs font-bold mt-1 ${teamTotals.closings>=teamTotals.prevClosings?'text-[#1e4620]':'text-error'}`}>{diff(teamTotals.closings,teamTotals.prevClosings).val} vs lalu</p>
        </div>
        <div className="bg-primary-fixed/30 p-5 rounded-xl">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Total Komisi</p>
          <p className="text-2xl font-headline font-bold text-primary">{fp(teamTotals.commission)}</p>
        </div>
      </div>

      {/* Cards View */}
      {viewMode==='cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map(a=>{
            const pct=Math.round((a.revenue/a.target)*100);
            const revDiff=diff(a.revenue,a.prevRevenue);
            const closDiff=diff(a.closings,a.prevClosings);
            const leadDiff=diff(a.leads,a.prevLeads);
            return (
              <div key={a.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer" onClick={()=>setSelectedAgent(a)}>
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">{a.initials}</div>
                    <div className="flex-1"><p className="font-semibold text-on-surface">{a.name}</p><p className="text-xs text-on-surface-variant">{a.role}</p></div>
                    <span className={`px-2 py-1 text-[10px] font-label font-bold rounded uppercase ${tierStyle(a.tier)}`}>{a.tier}</span>
                  </div>
                  {/* Target Progress */}
                  <div className="flex justify-between text-xs text-on-surface-variant mb-1.5"><span>Target: {fp(a.target)}</span><span className="font-bold text-on-surface">{pct}%</span></div>
                  <Bar pct={pct} color={pct>=80?'bg-gradient-to-r from-tertiary to-tertiary-container':pct>=50?'bg-gradient-to-r from-primary to-primary-container':'bg-error'}/>
                  <p className="text-right text-xs font-bold text-primary mt-1">{fp(a.revenue)}</p>
                </div>
                {/* Metrics Grid */}
                <div className="grid grid-cols-4 border-t border-outline-variant/10 divide-x divide-outline-variant/10">
                  <div className="p-3 text-center"><p className="text-lg font-headline font-bold">{a.leads}</p><p className="text-[9px] font-label uppercase text-on-surface-variant">Leads</p><p className={`text-[9px] font-bold ${leadDiff.up?'text-[#1e4620]':'text-error'}`}>{leadDiff.val}</p></div>
                  <div className="p-3 text-center"><p className="text-lg font-headline font-bold">{a.siteVisits}</p><p className="text-[9px] font-label uppercase text-on-surface-variant">Visits</p><p className={`text-[9px] font-bold ${diff(a.siteVisits,a.prevSiteVisits).up?'text-[#1e4620]':'text-error'}`}>{diff(a.siteVisits,a.prevSiteVisits).val}</p></div>
                  <div className="p-3 text-center"><p className="text-lg font-headline font-bold text-[#1e4620]">{a.closings}</p><p className="text-[9px] font-label uppercase text-on-surface-variant">Closing</p><p className={`text-[9px] font-bold ${closDiff.up?'text-[#1e4620]':'text-error'}`}>{closDiff.val}</p></div>
                  <div className="p-3 text-center"><p className="text-lg font-headline font-bold text-error">{a.lostDeals}</p><p className="text-[9px] font-label uppercase text-on-surface-variant">Lost</p></div>
                </div>
                {/* Footer */}
                <div className="px-6 py-3 bg-surface-container-low/50 flex justify-between items-center">
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant"><span>Conv: <strong className="text-on-surface">{a.conversionRate}%</strong></span><span>•</span><span>Komisi: <strong className="text-primary">{fp(a.commission)}</strong></span></div>
                  <span className={`text-xs font-bold ${revDiff.up?'text-[#1e4620]':'text-error'}`}>{revDiff.val}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode==='table' && (
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                <th className="px-5 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Agent</th>
                <th className="px-4 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Leads</th>
                <th className="px-4 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Follow-up</th>
                <th className="px-4 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Site Visit</th>
                <th className="px-4 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Closing</th>
                <th className="px-4 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Lost</th>
                <th className="px-4 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Conv %</th>
                <th className="px-4 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Revenue</th>
                <th className="px-4 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Target %</th>
                <th className="px-4 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Komisi</th>
                <th className="px-5 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Trend</th>
              </tr></thead>
              <tbody className="divide-y divide-outline-variant/10">
                {agents.map(a=>{
                  const pct=Math.round((a.revenue/a.target)*100);
                  const revD=diff(a.revenue,a.prevRevenue);
                  return (
                    <tr key={a.id} className="hover:bg-surface-container-low/50 transition-colors cursor-pointer" onClick={()=>setSelectedAgent(a)}>
                      <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-[10px] text-primary">{a.initials}</div><div><p className="text-sm font-semibold">{a.name}</p><p className="text-[10px] text-on-surface-variant">{a.role}</p></div></div></td>
                      <td className="px-4 py-4 text-center text-sm font-medium">{a.leads} <span className={`text-[9px] font-bold ${diff(a.leads,a.prevLeads).up?'text-[#1e4620]':'text-error'}`}>{diff(a.leads,a.prevLeads).val}</span></td>
                      <td className="px-4 py-4 text-center text-sm">{a.followUps}</td>
                      <td className="px-4 py-4 text-center text-sm">{a.siteVisits}</td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-[#1e4620]">{a.closings}</td>
                      <td className="px-4 py-4 text-center text-sm text-error">{a.lostDeals}</td>
                      <td className="px-4 py-4 text-center text-sm font-medium">{a.conversionRate}%</td>
                      <td className="px-4 py-4 text-right text-sm font-bold text-primary">{fp(a.revenue)}</td>
                      <td className="px-4 py-4 text-right"><div className="flex items-center justify-end gap-2"><div className="w-14 h-1.5 bg-surface-container rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct>=80?'bg-tertiary':pct>=50?'bg-primary':'bg-error'}`} style={{width:`${Math.min(pct,100)}%`}}/></div><span className="text-xs font-bold">{pct}%</span></div></td>
                      <td className="px-4 py-4 text-right text-sm font-medium">{fp(a.commission)}</td>
                      <td className="px-5 py-4 text-center"><span className={`text-xs font-bold ${revD.up?'text-[#1e4620]':'text-error'}`}>{revD.up?'↑':'↓'} {revD.val}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={()=>setSelectedAgent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl animate-fade-in-up my-8 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">{selectedAgent.initials}</div>
                  <div><h3 className="font-headline text-2xl font-bold">{selectedAgent.name}</h3><p className="text-sm text-on-surface-variant">{selectedAgent.role}</p>
                    <div className="flex items-center gap-2 mt-1"><span className={`px-2 py-0.5 text-[10px] font-label font-bold rounded uppercase ${tierStyle(selectedAgent.tier)}`}>{selectedAgent.tier}</span><span className="text-xs text-on-surface-variant">Response time: <strong>{selectedAgent.responseTime}</strong></span><span className="text-xs text-on-surface-variant">Satisfaction: <strong>{selectedAgent.clientSatisfaction}%</strong></span></div>
                  </div>
                </div>
                <button onClick={()=>setSelectedAgent(null)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
              </div>

              {/* Target Progress */}
              <div className="bg-primary-fixed/20 rounded-xl p-6 mb-6 border border-primary/10">
                <div className="flex justify-between items-end mb-3">
                  <div><p className="text-xs font-label uppercase text-on-surface-variant">Target Bulan Ini</p><p className="text-3xl font-headline font-bold text-primary">{fp(selectedAgent.revenue)} <span className="text-lg text-on-surface-variant font-normal">/ {fp(selectedAgent.target)}</span></p></div>
                  <div className="text-right"><p className="text-3xl font-headline font-bold">{Math.round((selectedAgent.revenue/selectedAgent.target)*100)}%</p><p className={`text-sm font-bold ${diff(selectedAgent.revenue,selectedAgent.prevRevenue).up?'text-[#1e4620]':'text-error'}`}>{diff(selectedAgent.revenue,selectedAgent.prevRevenue).val} vs bulan lalu</p></div>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden"><div className={`h-full rounded-full ${Math.round((selectedAgent.revenue/selectedAgent.target)*100)>=80?'bg-gradient-to-r from-tertiary to-tertiary-container':'bg-gradient-to-r from-primary to-primary-container'}`} style={{width:`${Math.min(Math.round((selectedAgent.revenue/selectedAgent.target)*100),100)}%`}}/></div>
              </div>

              {/* Comparison Table: This Month vs Last Month */}
              <div className="mb-6">
                <h4 className="font-headline text-lg font-bold mb-4 flex items-center gap-2"><Icon name="compare_arrows" className="text-primary"/>Perbandingan Bulan Ini vs Bulan Lalu</h4>
                <div className="bg-surface-container-low rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead><tr className="bg-surface-container/50">
                      <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Metrik</th>
                      <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Bulan Lalu</th>
                      <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-primary font-bold text-right">Bulan Ini</th>
                      <th className="px-5 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Perubahan</th>
                    </tr></thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {[
                        {label:'Leads',cur:selectedAgent.leads,prev:selectedAgent.prevLeads,fmt:(v:number)=>String(v)},
                        {label:'Follow-up',cur:selectedAgent.followUps,prev:selectedAgent.prevFollowUps,fmt:(v:number)=>String(v)},
                        {label:'Site Visits',cur:selectedAgent.siteVisits,prev:selectedAgent.prevSiteVisits,fmt:(v:number)=>String(v)},
                        {label:'Closings',cur:selectedAgent.closings,prev:selectedAgent.prevClosings,fmt:(v:number)=>String(v)},
                        {label:'Revenue',cur:selectedAgent.revenue,prev:selectedAgent.prevRevenue,fmt:fp},
                        {label:'Conversion Rate',cur:selectedAgent.conversionRate,prev:selectedAgent.prevConversionRate,fmt:(v:number)=>`${v}%`},
                        {label:'Komisi',cur:selectedAgent.commission,prev:selectedAgent.prevCommission,fmt:fp},
                      ].map(row=>{
                        const d=diff(row.cur,row.prev);
                        return (
                          <tr key={row.label} className="hover:bg-white transition-colors">
                            <td className="px-5 py-3 text-sm font-medium">{row.label}</td>
                            <td className="px-5 py-3 text-sm text-right text-on-surface-variant">{row.fmt(row.prev)}</td>
                            <td className="px-5 py-3 text-sm text-right font-bold text-on-surface">{row.fmt(row.cur)}</td>
                            <td className="px-5 py-3 text-right"><span className={`text-sm font-bold ${d.up?'text-[#1e4620]':'text-error'}`}>{d.up?'↑':'↓'} {d.val}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detail Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-container-low rounded-xl p-4 text-center"><Icon name="speed" className="text-primary text-2xl mb-1"/><p className="text-xl font-headline font-bold">{selectedAgent.conversionRate}%</p><p className="text-[10px] font-label uppercase text-on-surface-variant">Conversion Rate</p></div>
                <div className="bg-surface-container-low rounded-xl p-4 text-center"><Icon name="attach_money" className="text-tertiary text-2xl mb-1"/><p className="text-xl font-headline font-bold">{fp(selectedAgent.avgDealSize)}</p><p className="text-[10px] font-label uppercase text-on-surface-variant">Avg Deal Size</p></div>
                <div className="bg-surface-container-low rounded-xl p-4 text-center"><Icon name="schedule" className="text-primary text-2xl mb-1"/><p className="text-xl font-headline font-bold">{selectedAgent.responseTime}</p><p className="text-[10px] font-label uppercase text-on-surface-variant">Response Time</p></div>
                <div className="bg-surface-container-low rounded-xl p-4 text-center"><Icon name="sentiment_satisfied" className={`text-2xl mb-1 ${selectedAgent.clientSatisfaction>=90?'text-tertiary':selectedAgent.clientSatisfaction>=70?'text-primary':'text-error'}`}/><p className="text-xl font-headline font-bold">{selectedAgent.clientSatisfaction}%</p><p className="text-[10px] font-label uppercase text-on-surface-variant">Client Satisfaction</p></div>
              </div>

              {/* Sales Funnel Visual */}
              <div className="bg-surface-container-low rounded-xl p-6 mb-6">
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Sales Funnel</h4>
                <div className="flex items-end gap-2 h-32">
                  {[{l:'Leads',v:selectedAgent.leads,p:100},{l:'Follow-up',v:selectedAgent.followUps,p:selectedAgent.leads?Math.round((selectedAgent.followUps/selectedAgent.leads)*100):0},{l:'Site Visit',v:selectedAgent.siteVisits,p:selectedAgent.leads?Math.round((selectedAgent.siteVisits/selectedAgent.leads)*100):0},{l:'Closing',v:selectedAgent.closings,p:selectedAgent.leads?Math.round((selectedAgent.closings/selectedAgent.leads)*100):0}].map((step,i)=>(
                    <div key={step.l} className="flex-1 flex flex-col items-center gap-2">
                      <p className="text-lg font-headline font-bold">{step.v}</p>
                      <div className={`w-full rounded-t-lg ${i===3?'bg-primary':'bg-primary/'+[10,30,50,100][i]}`} style={{height:`${Math.max(step.p,8)}%`}}/>
                      <p className="text-[9px] font-label uppercase text-on-surface-variant text-center">{step.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/10">
                <button onClick={()=>{notify(`Export data ${selectedAgent.name}...`,'info');}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed cursor-pointer flex items-center gap-2"><Icon name="download"/>Export</button>
                <button onClick={()=>setSelectedAgent(null)} className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold cursor-pointer">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="pt-8 pb-4 text-center"><p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant opacity-35">© Agent Properti • Leader Panel</p></footer>
    </div>
  );
}
