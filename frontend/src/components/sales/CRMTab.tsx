import { useEffect, useState } from 'react'
import { supabase, type Client } from '../lib/supabase'
import Icon from '../Icon'

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void }

export default function CRMTab({ notify }: Props) {
  const [leads, setLeads] = useState<Client[]>([])
  const [projects, setProjects] = useState<{id: string; name: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'All' | 'Hot' | 'Warm' | 'Cold'>('All')
  const [selected, setSelected] = useState<Client | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', project_id: '', potential: 'Warm', notes: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: leadData } = await supabase
        .from('clients')
        .select('*, projects(name)')
        .order('created_at', { ascending: false })
      if (leadData) setLeads(leadData)

      const { data: projData } = await supabase.from('projects').select('id, name')
      if (projData) setProjects(projData)
    } catch (error: any) {
      notify('Gagal memuat data: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const filtered = leads.filter(l => filter === 'All' || l.potential === filter)
  const potColor = (p: string) => p === 'Hot' ? 'bg-error text-white' : p === 'Warm' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-surface-container-high text-on-surface-variant'

  const addLead = async () => {
    if (!formData.name || !formData.phone) {
      notify('Nama dan telepon wajib diisi', 'error')
      return
    }
    try {
      const { error } = await supabase.from('clients').insert({
        name: formData.name,
        phone: formData.phone,
        project_id: formData.project_id || null,
        potential: formData.potential,
        notes: formData.notes,
        status: 'New Lead'
      })
      if (error) throw error
      notify('Lead berhasil ditambahkan!', 'success')
      setShowAdd(false)
      setFormData({ name: '', phone: '', project_id: '', potential: 'Warm', notes: '' })
      fetchData()
    } catch (error: any) {
      notify('Gagal menambah lead: ' + error.message, 'error')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Icon name="progress_activity" className="text-2xl animate-spin" /></div>
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-primary px-5 pb-5 pt-2 rounded-b-3xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-headline text-xl font-bold">CRM — Leads</h2>
          <button onClick={() => setShowAdd(true)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer">
            <Icon name="add" />
          </button>
        </div>
        <div className="flex gap-2">
          {['All', 'Hot', 'Warm', 'Cold'].map(f => (
            <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase cursor-pointer ${filter === f ? 'bg-white text-primary' : 'bg-white/15 text-white/70'}`}>
              {f} {f !== 'All' && `(${leads.filter(l => l.potential === f).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders */}
      {leads.filter(l => l.last_contact && new Date().toDateString() === new Date(l.last_contact).toDateString()).length > 0 && (
        <div className="mx-4 mt-4 bg-tertiary-fixed/30 rounded-xl p-3 flex items-start gap-3 border border-tertiary/20">
          <Icon name="alarm" className="text-tertiary text-xl mt-0.5" />
          <div>
            <p className="text-xs font-bold text-tertiary">Follow-up Hari Ini</p>
            <p className="text-[10px] text-on-surface-variant">
              {leads.filter(l => l.last_contact && new Date().toDateString() === new Date(l.last_contact).toDateString()).map(l => l.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Lead Cards */}
      <div className="px-4 py-4 space-y-3">
        {filtered.length > 0 ? filtered.map(l => (
          <div key={l.id} className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10 active:scale-[0.98] transition-transform" onClick={() => setSelected(l)}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-sm font-bold">{l.name}</h3>
                <p className="text-[10px] text-on-surface-variant">{(l as any).projects?.name || '-'} • {l.phone}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${potColor(l.potential || '')}`}>
                {l.potential || 'Cold'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded font-medium">{l.status}</span>
              <div className="flex items-center gap-3 text-[10px] text-on-surface-variant">
                <span>{l.last_contact ? new Date(l.last_contact).toLocaleDateString() : '-'}</span>
              </div>
            </div>
          </div>
        )) : <div className="text-center py-12 text-on-surface-variant"><Icon name="person_off" className="text-4xl opacity-30 mb-2"/><p className="text-sm">Tidak ada lead ditemukan</p></div>}
      </div>

      {/* Lead Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={() => setSelected(null)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[88vh] overflow-y-auto" style={{ maxWidth: '430px' }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mt-3 mb-4" />
            <div className="px-5 pb-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline text-xl font-bold">{selected.name}</h3>
                  <p className="text-sm text-on-surface-variant">{selected.phone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${potColor(selected.potential || '')}`}>
                  {selected.potential || 'Cold'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low rounded-xl p-3">
                  <p className="text-[10px] text-on-surface-variant">Project</p>
                  <p className="text-sm font-bold">{(selected as any).projects?.name || '-'}</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-3">
                  <p className="text-[10px] text-on-surface-variant">Status</p>
                  <p className="text-sm font-bold">{selected.status}</p>
                </div>
              </div>

              {selected.notes && <div className="bg-tertiary-fixed/20 rounded-xl p-3 border-l-4 border-tertiary"><p className="text-xs">{selected.notes}</p></div>}

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => notify('Menelepon...', 'info')} className="py-3 bg-surface-container-low rounded-xl flex flex-col items-center gap-1 cursor-pointer text-[10px] font-bold">
                  <Icon name="call" className="text-primary text-lg" />Call
                </button>
                <button onClick={() => notify('Buka WhatsApp...', 'info')} className="py-3 bg-surface-container-low rounded-xl flex flex-col items-center gap-1 cursor-pointer text-[10px] font-bold">
                  <Icon name="chat" className="text-tertiary text-lg" />WA
                </button>
                <button onClick={() => notify('Kirim brochure...', 'success')} className="py-3 bg-surface-container-low rounded-xl flex flex-col items-center gap-1 cursor-pointer text-[10px] font-bold">
                  <Icon name="share" className="text-primary text-lg" />Share
                </button>
                <button onClick={() => notify('Atur jadwal...', 'info')} className="py-3 bg-surface-container-low rounded-xl flex flex-col items-center gap-1 cursor-pointer text-[10px] font-bold">
                  <Icon name="event" className="text-tertiary text-lg" />Jadwal
                </button>
              </div>

              {/* Timeline placeholder */}
              <div>
                <h4 className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-3">Riwayat Interaksi</h4>
                <p className="text-xs text-on-surface-variant">Belum ada timeline - akan diintegrasikan dengan activity_logs</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Sheet */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={() => setShowAdd(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[85vh] overflow-y-auto p-6" style={{ maxWidth: '430px' }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 -mt-1" />
            <h3 className="font-headline text-lg font-bold mb-4">Tambah Lead Baru</h3>
            <div className="space-y-3">
              <input 
                placeholder="Nama Lengkap" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" 
              />
              <input 
                placeholder="No. Telepon" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" 
              />
              <select 
                value={formData.project_id}
                onChange={e => setFormData({...formData, project_id: e.target.value})}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="">Pilih Project (opsional)</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select 
                value={formData.potential}
                onChange={e => setFormData({...formData, potential: e.target.value as any})}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option>Hot</option>
                <option>Warm</option>
                <option>Cold</option>
              </select>
              <textarea 
                placeholder="Catatan..." 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                rows={2} 
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary resize-none" 
              />
            </div>
            <button onClick={addLead} className="w-full mt-4 py-3.5 bg-primary text-white font-bold rounded-xl cursor-pointer">Simpan Lead</button>
          </div>
        </div>
      )}
    </div>
  );
}