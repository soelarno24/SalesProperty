import { useEffect, useState } from 'react'
import { supabase, type ActivityLog, type Client, type Project } from '../lib/supabase'
import Icon from '../Icon'

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void }

export default function ActivityTab({ notify }: Props) {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showLog, setShowLog] = useState(false)
  const [logType, setLogType] = useState<'Cold Calling' | 'Chat Follow-up' | 'Meeting' | 'Site Visit' | 'Negotiation' | 'Booking' | 'Document Upload' | 'Commission Claim'>('Site Visit')
  const [formData, setFormData] = useState({ client_id: '', project_id: '', notes: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: actData } = await supabase
        .from('activity_logs')
        .select('*, clients(name), projects(name)')
        .order('created_at', { ascending: false })
      if (actData) setActivities(actData)

      const { data: clientData } = await supabase.from('clients').select('id, name, project_id').order('created_at', { ascending: false })
      if (clientData) setClients(clientData)

      const { data: projData } = await supabase.from('projects').select('id, name')
      if (projData) setProjects(projData)
    } catch (error: any) {
      notify('Gagal memuat data: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const typeIcon = (t: string) => ({
    'Site Visit': 'location_on', 'Chat Follow-up': 'chat', 'Meeting': 'handshake', 'Cold Calling': 'call', 'Negotiation': 'gavel', 'Booking': 'lock', 'Document Upload': 'upload', 'Commission Claim': 'payments'
  }[t] || 'note')

  const typeColor = (t: string) => ({
    'Site Visit': 'bg-primary text-white', 'Chat Follow-up': 'bg-tertiary text-white', 'Meeting': 'bg-primary-container text-white', 
    'Cold Calling': 'bg-secondary text-white', 'Negotiation': 'bg-tertiary-container text-on-tertiary-container', 'Booking': 'bg-primary', 
    'Document Upload': 'bg-secondary', 'Commission Claim': 'bg-tertiary'
  }[t] || 'bg-surface-container')

  const logActivity = async () => {
    try {
      const { error } = await supabase.from('activity_logs').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        client_id: formData.client_id || null,
        project_id: formData.project_id || null,
        activity_type: logType,
        notes: formData.notes
      })
      if (error) throw error
      notify('Aktivitas berhasil dicatat!', 'success')
      setShowLog(false)
      setFormData({ client_id: '', project_id: '', notes: '' })
      fetchData()
    } catch (error: any) {
      notify('Gagal menyimpan aktivitas: ' + error.message, 'error')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Icon name="progress_activity" className="text-2xl animate-spin" /></div>
  }

  const todayCount = activities.filter(a => a.created_at && new Date(a.created_at).toDateString() === new Date().toDateString()).length
  const photoCount = activities.filter(a => a.notes?.includes('foto')).length
  const gpsCount = activities.filter(a => a.is_gps_verified).length

  return (
    <div>
      <div className="bg-primary px-5 pb-5 pt-2 rounded-b-3xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-headline text-xl font-bold">Log Aktivitas</h2>
          <button onClick={() => setShowLog(true)} className="px-4 py-2 bg-white text-primary font-bold text-xs rounded-full cursor-pointer flex items-center gap-1">
            <Icon name="add" className="text-sm" />Catat Aktivitas
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-xl p-3 text-center text-white">
            <p className="text-xl font-bold">{todayCount}</p>
            <p className="text-[9px] opacity-70 uppercase">Hari Ini</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center text-white">
            <p className="text-xl font-bold">{photoCount}</p>
            <p className="text-[9px] opacity-70 uppercase">Foto Bukti</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center text-white">
            <p className="text-xl font-bold">{gpsCount}</p>
            <p className="text-[9px] opacity-70 uppercase">GPS Verified</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {activities.length > 0 ? activities.map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${typeColor(a.activity_type)} flex items-center justify-center shrink-0`}>
                <Icon name={typeIcon(a.activity_type)} className="text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold">{a.activity_type}</h3>
                    <p className="text-[10px] text-on-surface-variant">{(a as any).clients?.name || '-'} • {(a as any).projects?.name || '-'}</p>
                  </div>
                  <p className="text-[10px] text-on-surface-variant shrink-0">{a.created_at ? new Date(a.created_at).toLocaleTimeString() : '-'}</p>
                </div>
                {a.notes && <p className="text-xs text-on-surface-variant mt-1 italic">"{a.notes}"</p>}
                <div className="flex gap-2 mt-2">
                  {a.is_gps_verified && (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#1e4620] bg-[#e7f5ed] px-2 py-0.5 rounded">
                      <Icon name="gps_fixed" className="text-[10px]" />GPS ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant text-right mt-2">{a.created_at ? new Date(a.created_at).toLocaleDateString() : '-'}</p>
          </div>
        )) : <div className="text-center py-12 text-on-surface-variant"><Icon name="history" className="text-4xl opacity-30 mb-2"/><p className="text-sm">Belum ada aktivitas</p></div>}
      </div>

      {showLog && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={() => setShowLog(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[90vh] overflow-y-auto p-6" style={{ maxWidth: '430px' }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 -mt-1" />
            <h3 className="font-headline text-lg font-bold mb-4">Catat Aktivitas Baru</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-2 block">Tipe Aktivitas</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cold Calling', 'Chat Follow-up', 'Meeting', 'Site Visit', 'Negotiation'].map(t => (
                    <button key={t} onClick={() => setLogType(t as any)} className={`py-2.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all flex flex-col items-center gap-1 ${logType === t ? 'bg-primary text-white ring-2 ring-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      <Icon name={typeIcon(t)} className="text-base" />{t}
                    </button>
                  ))}
                </div>
              </div>
              <select 
                value={formData.client_id}
                onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="">Pilih Klien (opsional)</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select 
                value={formData.project_id}
                onChange={e => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="">Pilih Project (opsional)</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <textarea 
                placeholder="Catatan aktivitas..." 
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={2} 
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary resize-none" 
              />

              <div className="bg-primary-fixed/20 rounded-xl p-4 border border-primary/10 space-y-3">
                <p className="text-xs font-label font-bold uppercase text-primary flex items-center gap-1">
                  <Icon name="verified" className="text-sm" />Bukti Kerja (Proof of Work)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => notify('📸 Kamera dibuka — Foto langsung', 'info')} className="py-4 bg-white rounded-xl flex flex-col items-center gap-1 cursor-pointer border border-outline-variant/10 active:scale-95 transition-transform">
                    <Icon name="photo_camera" className="text-2xl text-primary" /><span className="text-[10px] font-bold">Ambil Foto</span>
                  </button>
                  <button onClick={() => notify('📱 Upload screenshot chat/call', 'info')} className="py-4 bg-white rounded-xl flex flex-col items-center gap-1 cursor-pointer border border-outline-variant/10 active:scale-95 transition-transform">
                    <Icon name="chat" className="text-2xl text-tertiary" /><span className="text-[10px] font-bold">Upload Chat</span>
                  </button>
                </div>
              </div>
            </div>

            <button onClick={logActivity} className="w-full mt-4 py-3.5 bg-primary text-white font-bold rounded-xl cursor-pointer text-sm flex items-center justify-center gap-2">
              <Icon name="check" />Simpan Aktivitas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}