import { useEffect, useState } from 'react'
import { supabase, type Team, type User, type Project } from '../lib/supabase'
import Icon from '../Icon'

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void }

export default function LeaderHome({ notify }: Props) {
  const [loading, setLoading] = useState(true)
  const [teamStats, setTeamStats] = useState({ revenue: 0, target: 0, prevRevenue: 0, agents: 0, clients: 0, pendingApprovals: 0, siteVisits: 0 })
  const [funnel, setFunnel] = useState({ newLeads: 0, followUps: 0, siteVisits: 0, negotiations: 0, closed: 0 })
  const [alerts, setAlerts] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch team performance
      const { data: perfData } = await supabase.from('v_team_performance').select('*').limit(1).single()
      if (perfData) {
        setTeamStats({
          revenue: Number(perfData.total_revenue) || 0,
          target: Number(perfData.total_target) || 0,
          prevRevenue: 0,
          agents: perfData.agent_count || 0,
          clients: perfData.total_leads || 0,
          pendingApprovals: 0,
          siteVisits: 0
        })
      }

      // Fetch funnel data
      const { data: funnelData } = await supabase.from('v_sales_funnel').select('*').limit(1).single()
      if (funnelData) {
        setFunnel({
          newLeads: funnelData.new_leads || 0,
          followUps: funnelData.follow_ups || 0,
          siteVisits: funnelData.site_visits || 0,
          negotiations: funnelData.negotiations || 0,
          closed: funnelData.closed || 0
        })
      }

      // Fetch hot leads as alerts
      const { data: hotLeads } = await supabase.from('v_hot_leads').select('*').limit(5)
      if (hotLeads) {
        setAlerts(hotLeads.map((h: any) => ({
          name: h.name,
          project: h.project_name,
          agent: h.agent_name,
          days: h.days_since_contact,
          status: h.days_since_contact > 3 ? 'Critical' : 'Stagnant'
        })))
      }

      // Fetch recent activities
      const { data: actData } = await supabase
        .from('activity_logs')
        .select('*, users!user_id(name), clients(name), projects(name)')
        .order('created_at', { ascending: false })
        .limit(5)
      if (actData) {
        setActivities(actData.map((a: any) => ({
          agent: a.users?.name || 'Agent',
          action: a.activity_type,
          target: a.projects?.name || a.clients?.name || a.target || '-',
          time: a.created_at ? new Date(a.created_at).toLocaleDateString() : '-'
        })))
      }

      // Fetch leaderboard
      const { data: lbData } = await supabase.from('v_agent_leaderboard').select('*').limit(5)
      if (lbData) setAgents(lbData)

      // Fetch projects
      const { data: projData } = await supabase.from('v_inventory_summary').select('*')
      if (projData) setProjects(projData)

    } catch (error: any) {
      notify('Gagal memuat data: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const fp = (n: number) => '$' + n?.toLocaleString() || '$0'
  const pct = Math.round((teamStats.revenue / teamStats.target) * 100) || 0
  const growth = teamStats.prevRevenue > 0 ? Math.round(((teamStats.revenue - teamStats.prevRevenue) / teamStats.prevRevenue) * 100) : 0

  const funnelData = [
    { label: 'New Leads', count: funnel.newLeads, pct: 100, bg: 'bg-primary/10', text: 'text-primary' },
    { label: 'Follow-up', count: funnel.followUps, pct: Math.round((funnel.followUps / funnel.newLeads) * 100) || 0, bg: 'bg-primary/30', text: 'text-primary' },
    { label: 'Site Visit', count: funnel.siteVisits, pct: Math.round((funnel.siteVisits / funnel.newLeads) * 100) || 0, bg: 'bg-primary/60', text: 'text-white' },
    { label: 'Negotiation', count: funnel.negotiations, pct: Math.round((funnel.negotiations / funnel.newLeads) * 100) || 0, bg: 'bg-primary/80', text: 'text-white' },
    { label: 'Closing', count: funnel.closed, pct: Math.round((funnel.closed / funnel.newLeads) * 100) || 0, bg: 'bg-primary', text: 'text-white' },
  ]

  const statusColor = (s:string) => s==='Top Performer'?'text-tertiary':s==='On Track'?'text-primary':s==='Below Target'?'text-on-surface-variant':'text-error'
  const statusDot = (s:string) => s==='Top Performer'?'bg-tertiary':s==='On Track'?'bg-primary':s==='Below Target'?'bg-outline':'bg-error animate-pulse'
  const alertColor = (s:string) => s==='Stagnant'?'border-error bg-error-container/10':s==='Critical'?'border-error bg-error/5':'border-tertiary-container bg-tertiary-fixed/10'
  const alertBadge = (s:string) => s==='Critical'?'bg-error text-white':s==='Stagnant'?'bg-error-container text-on-error-container':'bg-tertiary-fixed text-on-tertiary-fixed-variant'

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-4"><Icon name="progress_activity" className="text-2xl animate-spin" /></div>
  }

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
        <div className="bg-[#e7f5ed] p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Site Visits</p><p className="text-2xl font-headline font-bold text-[#1e4620]">{funnel.siteVisits}</p></div>
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
            {funnelData.map(f=>(
              <div key={f.label} className="flex-1 flex flex-col items-center gap-2 group">
                <p className="text-sm font-headline font-bold">{f.count}</p>
                <div className={`w-full ${f.bg} rounded-t-lg transition-all duration-500 hover:opacity-80 flex items-center justify-center ${f.text}`} style={{height:`${Math.max(f.pct, 10)}%`}}/>
                <p className="font-label text-[8px] lg:text-[9px] uppercase tracking-widest text-on-surface-variant text-center">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 bg-surface-container-lowest p-6 lg:p-8 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-4"><Icon name="error" className="text-error"/><h4 className="font-headline text-lg font-bold">Priority Alerts</h4><span className="ml-auto text-[10px] font-label font-bold text-error bg-error/10 px-2 py-0.5 rounded-full">{alerts.filter(a=>a.status!=='Needs Follow-up').length}</span></div>
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((a,i)=>(
              <div key={i} className={`p-3 rounded-lg border-l-4 flex items-start justify-between ${alertColor(a.status)}`}>
                <div><h5 className="font-body text-sm font-semibold">{a.name}</h5><p className="text-[10px] text-on-surface-variant">{a.project} • {a.agent}</p><p className="text-[10px] text-on-surface-variant">{a.days} hari lalu</p></div>
                <span className={`text-[9px] font-label font-bold px-2 py-0.5 rounded ${alertBadge(a.status)}`}>{a.status}</span>
              </div>
            )) : <p className="text-xs text-on-surface-variant">Tidak ada alert</p>}
          </div>
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
              {agents.length > 0 ? agents.map((a: any, i) => {
                const ap = a.target_revenue > 0 ? Math.round((a.actual_revenue / a.target_revenue) * 100) : 0
                const status = ap >= 80 ? 'Top Performer' : ap >= 50 ? 'On Track' : 'Below Target'
                return (
                <tr key={a.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-5 py-3"><div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${i===0?'bg-tertiary-fixed text-on-tertiary-fixed':i===1?'bg-primary-fixed text-on-primary-fixed':'bg-surface-container text-on-surface-variant'}`}>{i+1}</div></td>
                  <td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-[9px] text-primary">{a.name?.split(' ').map((n:string) => n[0]).join('') || '?'}</div><div><p className="text-sm font-semibold">{a.name}</p><p className="text-[10px] text-on-surface-variant">{a.actual_leads || 0} leads • {a.actual_closings || 0} closing</p></div></div></td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-primary">{fp(a.actual_revenue || 0)}</td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2"><div className="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden"><div className={`h-full rounded-full ${ap>=80?'bg-tertiary':ap>=50?'bg-primary':'bg-error'}`} style={{width:`${Math.min(ap,100)}%`}}/></div><span className="text-xs font-medium">{ap}%</span></div></td>
                  <td className="px-4 py-3"><span className={`w-2 h-2 inline-block rounded-full ${statusDot(status)} mr-1.5`}/><span className={`text-xs font-label ${statusColor(status)}`}>{status}</span></td>
                </tr>);
              }) : <tr><td colSpan={5} className="p-4 text-center text-xs text-on-surface-variant">Belum ada data agen</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{icon:'person_add',title:'Assign Leads',desc:'14 leads belum ditugaskan',color:'text-primary'},{icon:'fact_check',title:'Pending Approvals',desc:`${teamStats.pendingApprovals} menunggu validasi`,color:'text-error'},{icon:'location_on',title:'Site Visit Hari Ini',desc:`${funnel.siteVisits} kunjungan terjadwal`,color:'text-tertiary'},{icon:'download',title:'Download Report',desc:'Export rekap tim',color:'text-primary'}].map(a=>(
          <button key={a.title} onClick={()=>notify(`${a.title}...`,'info')} className="flex items-center gap-4 p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/10 hover:shadow-md hover:border-primary/20 transition-all text-left cursor-pointer group">
            <Icon name={a.icon} className={`${a.color} text-2xl`}/>
            <div><p className="font-body text-sm font-semibold group-hover:text-primary transition-colors">{a.title}</p><p className="text-xs text-on-surface-variant">{a.desc}</p></div>
          </button>
        ))}
      </div>
    </div>
  );
}