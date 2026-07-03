import { useEffect, useState } from 'react'
import { supabase, type Commission, type KpiTarget, type Client, type ActivityLog, type User } from '../lib/supabase'
import Icon from '../Icon'

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void }

export default function DashboardTab({ notify }: Props) {
  const [showDetail, setShowDetail] = useState(false)
  const [showWallet, setShowWallet] = useState(false)
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [kpi, setKpi] = useState<KpiTarget | null>(null)
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [leaderboard, setLeaderboard] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Get current user (using first user as demo)
      const { data: userData } = await supabase.from('users').select('*').eq('role', 'Sales Agent').limit(1).single()
      const userId = userData?.id || '00000000-0000-0000-0000-000000000000'

      // Fetch commissions
      const { data: commData } = await supabase
        .from('commissions')
        .select('*, users!agent_id(name)')
        .eq('agent_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)
      if (commData) setCommissions(commData)

      // Fetch KPI
      const { data: kpiData } = await supabase
        .from('kpi_targets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (kpiData) setKpi(kpiData)

      // Fetch activities
      const { data: actData } = await supabase
        .from('activity_logs')
        .select('*, clients(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
      if (actData) setActivities(actData)

      // Fetch leaderboard
      const { data: lbData } = await supabase
        .from('v_agent_leaderboard')
        .select('*')
        .limit(5)
      if (lbData) setLeaderboard(lbData)

    } catch (error: any) {
      notify('Gagal memuat data: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const fp = (n: number) => '$' + n?.toLocaleString() || '$0'
  const diff = (cur: number, prev: number) => {
    const p = prev > 0 ? Math.round(((cur - prev) / prev) * 100) : 100
    return { val: `${p >= 0 ? '+' : ''}${p}%`, up: p >= 0 }
  }

  const me = {
    name: 'Julian Vance', initials: 'JV', role: 'Senior Sales Agent', team: 'Vanguard Curators',
    leads: kpi?.actual_leads || 48,
    followUps: kpi?.actual_follow_ups || 35,
    siteVisits: kpi?.actual_site_visits || 18,
    closings: kpi?.actual_closings || 6,
    lostDeals: kpi?.actual_lost || 3,
    revenue: kpi?.actual_revenue || 1450000,
    target: kpi?.target_revenue || 2000000,
    commission: kpi?.commission_earned || 36250,
    convRate: kpi?.conversion_rate || 12.5,
    avgDealSize: kpi?.avg_deal_size || 241667,
    responseTime: kpi?.avg_response_time || '1.2 jam',
    satisfaction: kpi?.client_satisfaction || 94,
    prevLeads: 42, prevFollowUps: 30, prevSiteVisits: 14, prevClosings: 4,
    prevRevenue: 980000, prevCommission: 24500,
  }

  const pct = Math.round((me.revenue / me.target) * 100)
  const revenueGrowth = Math.round(((me.revenue - me.prevRevenue) / me.prevRevenue) * 100)
  const closingGrowth = Math.round(((me.closings - me.prevClosings) / me.prevClosings) * 100)
  const commGrowth = Math.round(((me.commission - me.prevCommission) / me.prevCommission) * 100)

  const funnel = [
    { label: 'Leads', count: me.leads, pct: 100, bg: 'bg-primary/10', text: 'text-primary' },
    { label: 'Follow-up', count: me.followUps, pct: Math.round((me.followUps / me.leads) * 100), bg: 'bg-primary/25', text: 'text-primary' },
    { label: 'Site Visit', count: me.siteVisits, pct: Math.round((me.siteVisits / me.leads) * 100), bg: 'bg-primary/50', text: 'text-white' },
    { label: 'Closing', count: me.closings, pct: Math.round((me.closings / me.leads) * 100), bg: 'bg-primary', text: 'text-white' },
  ]

  const pendingTasks: { task:string; time:string; urgent:boolean }[] = []

  const commStatusStyle = (s:string) => s==='Pending'?'bg-tertiary-fixed text-on-tertiary-fixed-variant':s==='Approved'?'bg-primary-fixed text-on-primary-fixed-variant':'bg-[#e7f5ed] text-[#1e4620]'
  const commStatusIcon = (s:string) => s==='Pending'?'schedule':s==='Approved'?'check_circle':'paid'

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Icon name="progress_activity" className="text-2xl animate-spin" /></div>
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-primary px-5 pb-6 pt-2 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-[10px] font-label uppercase tracking-widest">Selamat datang,</p>
            <h2 className="text-white font-headline text-xl font-bold">{me.name}</h2>
            <p className="text-white/50 text-xs">{me.role} • {me.team}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-headline font-bold text-lg">{me.initials}</div>
        </div>

        {/* Target Progress */}
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white/70 text-[10px] font-label uppercase tracking-widest">Target Bulan Ini</p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pct >= 80 ? 'bg-white/30 text-white' : pct >= 50 ? 'bg-white/20 text-white' : 'bg-error/30 text-white'}`}>{pct}%</span>
          </div>
          <p className="text-white font-headline text-2xl font-bold">{fp(me.revenue)} <span className="text-base text-white/50 font-normal">/ {fp(me.target)}</span></p>
          <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className={`text-xs mt-2 font-bold ${revenueGrowth >= 0 ? 'text-tertiary-fixed' : 'text-error-container'}`}>
            {revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueGrowth)}% vs bulan lalu
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-outline-variant/10">
            <p className="text-lg font-headline font-bold text-primary">{me.leads}</p>
            <p className="text-[8px] font-label uppercase text-on-surface-variant">Leads</p>
            <p className={`text-[8px] font-bold ${diff(me.leads, me.prevLeads).up ? 'text-[#1e4620]' : 'text-error'}`}>{diff(me.leads, me.prevLeads).val}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-outline-variant/10">
            <p className="text-lg font-headline font-bold text-tertiary">{me.siteVisits}</p>
            <p className="text-[8px] font-label uppercase text-on-surface-variant">Visits</p>
            <p className={`text-[8px] font-bold ${diff(me.siteVisits, me.prevSiteVisits || 0).up ? 'text-[#1e4620]' : 'text-error'}`}>{diff(me.siteVisits, me.prevSiteVisits || 0).val}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-outline-variant/10">
            <p className="text-lg font-headline font-bold text-[#1e4620]">{me.closings}</p>
            <p className="text-[8px] font-label uppercase text-on-surface-variant">Closing</p>
            <p className="text-[8px] font-bold text-[#1e4620]">+{closingGrowth}%</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-outline-variant/10">
            <p className="text-lg font-headline font-bold text-error">{me.lostDeals}</p>
            <p className="text-[8px] font-label uppercase text-on-surface-variant">Lost</p>
          </div>
        </div>

        {/* Sales Funnel */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Icon name="filter_alt" className="text-primary text-base" />Sales Funnel Saya</h3>
          <div className="flex items-end gap-1.5 h-28">
            {funnel.map(f => (
              <div key={f.label} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-xs font-bold">{f.count}</p>
                <div className={`w-full ${f.bg} rounded-t-lg ${f.text} flex items-end justify-center`} style={{ height: `${Math.max(f.pct, 10)}%` }} />
                <p className="text-[7px] font-label uppercase text-on-surface-variant text-center leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Komisi & Performa Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-4 text-white cursor-pointer active:scale-95 transition-transform" onClick={() => setShowWallet(true)}>
            <Icon name="account_balance_wallet" className="text-xl opacity-70 mb-1" />
            <p className="text-lg font-headline font-bold">{fp(me.commission)}</p>
            <p className="text-[9px] opacity-60 uppercase font-label">Komisi Bulan Ini</p>
            <p className={`text-[9px] font-bold mt-1 ${commGrowth >= 0 ? 'text-tertiary-fixed' : 'text-error-container'}`}>{commGrowth >= 0 ? '↑' : '↓'} {Math.abs(commGrowth)}%</p>
            <p className="text-[9px] opacity-70 mt-1 flex items-center gap-0.5">Lihat Semua <Icon name="arrow_forward" className="text-[10px]" /></p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10 cursor-pointer active:scale-95 transition-transform" onClick={() => setShowDetail(true)}>
            <Icon name="speed" className="text-xl text-tertiary mb-1" />
            <p className="text-lg font-headline font-bold">{me.convRate}%</p>
            <p className="text-[9px] text-on-surface-variant uppercase font-label">Conversion Rate</p>
            <p className="text-[9px] text-primary font-bold mt-1 flex items-center gap-0.5">Detail <Icon name="arrow_forward" className="text-[10px]" /></p>
          </div>
        </div>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="bg-tertiary-fixed/20 rounded-2xl p-4 border border-tertiary/15">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Icon name="alarm" className="text-tertiary text-base" />Tugas Hari Ini <span className="ml-auto text-[10px] font-label font-bold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-full">{pendingTasks.length}</span></h3>
            <div className="space-y-2">
              {pendingTasks.map((t, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${t.urgent ? 'bg-error-container/20 border border-error/15' : 'bg-white border border-outline-variant/10'}`}>
                  <Icon name={t.urgent ? 'priority_high' : 'schedule'} className={`text-base ${t.urgent ? 'text-error' : 'text-on-surface-variant'}`} />
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{t.task}</p><p className="text-[10px] text-on-surface-variant">{t.time}</p></div>
                  {t.urgent && <span className="text-[8px] font-bold text-error bg-error/10 px-1.5 py-0.5 rounded">URGENT</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Mini */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Icon name="emoji_events" className="text-tertiary text-base" />Leaderboard</h3>
          <div className="space-y-2">
            {leaderboard.slice(0, 3).map((l, i) => (
              <div key={l.id || i} className={`flex items-center gap-3 p-2.5 rounded-xl ${l.role === 'Senior Sales Agent' ? 'bg-primary-fixed/30 border border-primary/20' : 'bg-surface-container-low'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${(i+1) === 1 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : (i+1) === 2 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'}`}>{i+1}</div>
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-[9px] text-primary">{l.name?.split(' ').map((n:string) => n[0]).join('') || '?'}</div>
                <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{l.name || 'Unknown'}{false && <span className="text-[8px] text-primary ml-1">(Anda)</span>}</p><p className="text-[9px] text-on-surface-variant">{(l as any).actual_closings || 0} closing</p></div>
                <p className="text-xs font-bold text-primary">{fp((l as any).actual_revenue || 0)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Icon name="history" className="text-primary text-base" />Aktivitas Terakhir</h3>
          <div className="space-y-3">
            {activities.length > 0 ? activities.map((a, i) => (
              <div key={a.id} className="flex items-start gap-3">
                <Icon name={a.activity_type === 'Site Visit' ? 'location_on' : a.activity_type === 'Commission Claim' ? 'check_circle' : 'call'} className={`text-base mt-0.5 ${a.activity_type === 'Site Visit' ? 'text-primary' : 'text-tertiary'}`} />
                <div className="flex-1"><p className="text-xs"><span className="font-semibold">{a.activity_type}</span> — {(a as any).clients?.name || 'Client'}</p><p className="text-[10px] text-on-surface-variant">{a.created_at ? new Date(a.created_at).toLocaleDateString() : '-'}</p></div>
              </div>
            )) : <p className="text-xs text-on-surface-variant">Belum ada aktivitas</p>}
          </div>
        </div>
      </div>

      {/* Performance Detail Sheet */}
      {showDetail && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={() => setShowDetail(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[88vh] overflow-y-auto" style={{ maxWidth: '430px' }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mt-3" />
            <div className="p-5 space-y-5">
              <h3 className="font-headline text-lg font-bold flex items-center gap-2"><Icon name="insights" className="text-primary" />Detail Performa Saya</h3>

              <div className="bg-primary-fixed/20 rounded-xl p-4 border border-primary/10">
                <div className="flex justify-between items-end mb-2">
                  <div><p className="text-[10px] font-label uppercase text-on-surface-variant">Revenue vs Target</p><p className="text-2xl font-headline font-bold text-primary">{fp(me.revenue)}</p></div>
                  <div className="text-right"><p className="text-xl font-bold">{pct}%</p><p className={`text-xs font-bold ${revenueGrowth >= 0 ? 'text-[#1e4620]' : 'text-error'}`}>{revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueGrowth)}%</p></div>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{ width: `${pct}%` }} /></div>
                <p className="text-right text-[10px] text-on-surface-variant mt-1">Target: {fp(me.target)}</p>
              </div>

              <button onClick={() => { notify('Laporan performa dikirim ke leader!', 'success'); setShowDetail(false); }} className="w-full py-3 bg-primary text-white font-semibold rounded-xl cursor-pointer flex items-center justify-center gap-2"><Icon name="send" />Kirim Laporan ke Leader</button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Wallet Sheet */}
      {showWallet && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={() => setShowWallet(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[90vh] overflow-y-auto" style={{ maxWidth: '430px' }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mt-3" />
            <div className="p-5 space-y-4">
              <h3 className="font-headline text-lg font-bold flex items-center gap-2"><Icon name="account_balance_wallet" className="text-primary" />Dompet Komisi</h3>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-tertiary-fixed/30 rounded-xl p-3 text-center">
                  <Icon name="schedule" className="text-tertiary text-base" />
                  <p className="text-sm font-headline font-bold text-tertiary mt-0.5">{fp(commissions.filter(c=>c.status==='Pending').reduce((s,c)=>s+Number(c.amount),0))}</p>
                  <p className="text-[8px] text-on-surface-variant uppercase font-label">Pending</p>
                </div>
                <div className="bg-primary-fixed/30 rounded-xl p-3 text-center">
                  <Icon name="check_circle" className="text-primary text-base" />
                  <p className="text-sm font-headline font-bold text-primary mt-0.5">{fp(commissions.filter(c=>c.status==='Approved').reduce((s,c)=>s+Number(c.amount),0))}</p>
                  <p className="text-[8px] text-on-surface-variant uppercase font-label">Approved</p>
                </div>
                <div className="bg-[#e7f5ed] rounded-xl p-3 text-center">
                  <Icon name="paid" className="text-[#1e4620] text-base" />
                  <p className="text-sm font-headline font-bold text-[#1e4620] mt-0.5">{fp(commissions.filter(c=>c.status==='Paid').reduce((s,c)=>s+Number(c.amount),0))}</p>
                  <p className="text-[8px] text-on-surface-variant uppercase font-label">Paid</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-4 text-white text-center">
                <p className="text-[10px] opacity-70 uppercase font-label">Total Komisi</p>
                <p className="text-2xl font-headline font-bold">{fp(commissions.reduce((s,c)=>s+Number(c.amount),0))}</p>
              </div>

              <div>
                <h4 className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-2">Riwayat Komisi</h4>
                <div className="space-y-2">
                  {commissions.length > 0 ? commissions.map(c => (
                    <div key={c.id} className="bg-surface-container-low rounded-xl p-3 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${commStatusStyle(c.status || '')}`}>
                        <Icon name={commStatusIcon(c.status || '')} className="text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold truncate mr-2">{c.project_name || 'Project'}</p>
                          <span className="text-xs font-bold text-primary shrink-0">{fp(c.amount)}</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant">{c.unit_info || '-'} • {c.client_name || '-'}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${commStatusStyle(c.status || '')}`}>{c.status || 'Unknown'}</span>
                          <span className="text-[10px] text-on-surface-variant">{c.period || '-'}</span>
                        </div>
                      </div>
                    </div>
                  )) : <p className="text-xs text-on-surface-variant">Belum ada komisi</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}