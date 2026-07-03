import { useEffect, useState } from 'react'
import { supabase, type Project, type UnitType, type Developer } from '../lib/supabase'
import Icon from '../Icon'

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void }

const fp = (n: number) => '$' + (n || 0).toLocaleString()

export default function LeaderProjects({ notify }: Props) {
  const [projects, setProjects] = useState<Project[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Project | null>(null)
  const [galleryIdx, setGalleryIdx] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: projData } = await supabase
        .from('projects')
        .select('*, developers(name), project_facilities(name), project_certificates(name), project_images(url), units(*)')
        .order('created_at', { ascending: false })
      if (projData) setProjects(projData)

      const { data: devData } = await supabase.from('developers').select('*')
      if (devData) setDevelopers(devData)
    } catch (error: any) {
      notify('Gagal memuat data: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const openDetail = (p: Project) => { setSelected(p); setGalleryIdx(0) }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-4"><Icon name="progress_activity" className="text-2xl animate-spin" /></div>
  }

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h2 className="font-headline text-3xl lg:text-4xl font-bold">Project Overview</h2>
        <p className="text-on-surface-variant mt-1">Pantau progress penjualan, detail project, fasilitas, harga, dan alokasi tim.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Total Projects</p>
          <p className="text-2xl font-headline font-bold">{projects.length}</p>
        </div>
        <div className="bg-primary-fixed/30 p-5 rounded-xl">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Aktif</p>
          <p className="text-2xl font-headline font-bold text-primary">{projects.filter(p => p.status === 'Active').length}</p>
        </div>
        <div className="bg-tertiary-fixed/30 p-5 rounded-xl">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Total Unit</p>
          <p className="text-2xl font-headline font-bold text-tertiary">{projects.reduce((s, p) => s + (p.total_units || 0), 0)}</p>
        </div>
        <div className="bg-[#e7f5ed] p-5 rounded-xl">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Terjual</p>
          <p className="text-2xl font-headline font-bold text-[#1e4620]">{projects.reduce((s, p) => s + (p.sold_units || 0), 0)}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Available</p>
          <p className="text-2xl font-headline font-bold">{projects.reduce((s, p) => s + (p.available_units || 0), 0)}</p>
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? projects.map(p => (
          <div key={p.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer" onClick={() => openDetail(p)}>
            <div className="h-44 overflow-hidden relative">
              <img src={p.image_url || 'https://via.placeholder.com/400x176'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${p.status === 'Active' ? 'bg-white/90 text-primary' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>
                  {p.status}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded bg-on-surface/60 text-white text-[10px] font-bold">{p.project_type || '-'}</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-headline text-lg font-bold mb-1">{p.name}</h3>
              <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-3">
                <Icon name="location_on" className="text-sm" />{p.city || '-'} • {p.map_area || '-'}
              </p>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-bold text-primary">{p.price_range_min && p.price_range_max ? `$${p.price_range_min?.toLocaleString()} - $${p.price_range_max?.toLocaleString()}` : '-'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="bg-surface-container-low rounded-lg p-2">
                  <p className="text-sm font-bold">{p.total_units || 0}</p>
                  <p className="text-[9px] text-on-surface-variant">Total</p>
                </div>
                <div className="bg-[#e7f5ed] rounded-lg p-2">
                  <p className="text-sm font-bold text-[#1e4620]">{p.sold_units || 0}</p>
                  <p className="text-[9px] text-on-surface-variant">Sold</p>
                </div>
                <div className="bg-primary-fixed/30 rounded-lg p-2">
                  <p className="text-sm font-bold text-primary">{p.available_units || 0}</p>
                  <p className="text-[9px] text-on-surface-variant">Available</p>
                </div>
              </div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-on-surface-variant">Progress</span>
                <span className="font-bold">{p.progress_pct || 0}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${p.progress_pct >= 80 ? 'bg-tertiary' : p.progress_pct >= 50 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${p.progress_pct || 0}%` }} />
              </div>
            </div>
          </div>
        )) : <div className="col-span-full text-center py-12 text-on-surface-variant"><Icon name="apartment" className="text-4xl opacity-30 mb-2" /><p className="text-sm">Belum ada project</p></div>}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl animate-fade-in-up my-8 max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* Gallery Header */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
              <img src={selected.image_url || 'https://via.placeholder.com/800x320'} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 via-transparent to-on-surface/20" />
              <div className="absolute bottom-4 left-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${selected.status === 'Active' ? 'bg-white/90 text-primary' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>
                  {selected.status}
                </span>
                <h3 className="font-headline text-3xl font-bold text-white mt-2 drop-shadow-lg">{selected.name}</h3>
                <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                  <Icon name="location_on" className="text-sm" />{selected.address || '-'}, {selected.city || '-'}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-10 h-10 bg-on-surface/50 text-white rounded-full flex items-center justify-center hover:bg-on-surface/70 cursor-pointer">
                <Icon name="close" />
              </button>
            </div>

            <div className="p-6 lg:p-8 space-y-8">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                  <p className="text-2xl font-headline font-bold">{selected.total_units || 0}</p>
                  <p className="text-[10px] font-label uppercase text-on-surface-variant">Total Unit</p>
                </div>
                <div className="bg-[#e7f5ed] rounded-xl p-4 text-center">
                  <p className="text-2xl font-headline font-bold text-[#1e4620]">{selected.sold_units || 0}</p>
                  <p className="text-[10px] font-label uppercase text-on-surface-variant">Sold</p>
                </div>
                <div className="bg-[#fff4e5] rounded-xl p-4 text-center">
                  <p className="text-2xl font-headline font-bold text-[#663c00]">{selected.booked_units || 0}</p>
                  <p className="text-[10px] font-label uppercase text-on-surface-variant">Booked</p>
                </div>
                <div className="bg-primary-fixed/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-headline font-bold text-primary">{selected.available_units || 0}</p>
                  <p className="text-[10px] font-label uppercase text-on-surface-variant">Available</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                  <p className="text-2xl font-headline font-bold">{selected.progress_pct || 0}%</p>
                  <p className="text-[10px] font-label uppercase text-on-surface-variant">Progress</p>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mt-1">
                    <div className={`h-full rounded-full ${selected.progress_pct >= 80 ? 'bg-tertiary' : 'bg-primary'}`} style={{ width: `${selected.progress_pct || 0}%` }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-surface-container-low rounded-xl p-6">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Deskripsi</h4>
                    <p className="text-sm text-on-surface leading-relaxed">{selected.description || '-'}</p>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-6 space-y-3">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                      <Icon name="location_on" className="text-primary text-sm" />Lokasi
                    </h4>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Alamat</span><span className="font-medium text-right max-w-[250px]">{selected.address || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Kota</span><span className="font-medium">{selected.city || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Koordinat</span><span className="font-mono text-primary text-xs">{selected.coordinates || '-'}</span></div>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-6 space-y-3">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                      <Icon name="info" className="text-primary text-sm" />Info Project
                    </h4>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Developer</span><span className="font-medium">{(selected as any).developers?.name || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">RERA ID</span><span className="font-mono font-medium">{selected.rera_id || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Tipe</span><span className="font-medium">{selected.project_type || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Mulai</span><span className="font-medium">{selected.start_date || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Est. Selesai</span><span className="font-medium">{selected.estimated_completion || '-'}</span></div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-primary-fixed/20 rounded-xl p-6 border border-primary/10">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                      <Icon name="payments" className="text-sm" />Harga & Down Payment
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Range Harga</span><span className="font-bold text-primary text-lg">{selected.price_range_min && selected.price_range_max ? `$${selected.price_range_min?.toLocaleString()} - $${selected.price_range_max?.toLocaleString()}` : '-'}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Rata-rata</span><span className="font-bold">{fp(selected.avg_price || 0)}</span></div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-6">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-2">
                      <Icon name="fitness_center" className="text-primary text-sm" />Fasilitas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selected as any).project_facilities?.length > 0 ? (
                        (selected as any).project_facilities.map((f: any) => (
                          <span key={f.id} className="px-3 py-1.5 bg-white rounded-lg border border-outline-variant/10 text-xs font-medium flex items-center gap-1.5">
                            <Icon name="check_circle" className="text-primary text-sm" />{f.name}
                          </span>
                        ))
                      ) : <span className="text-xs text-on-surface-variant">-</span>}
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-6">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-2">
                      <Icon name="verified" className="text-tertiary text-sm" />Sertifikasi
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selected as any).project_certificates?.length > 0 ? (
                        (selected as any).project_certificates.map((c: any) => (
                          <span key={c.id} className="px-3 py-1.5 bg-tertiary-fixed/30 rounded-lg text-xs font-bold text-on-tertiary-fixed-variant uppercase">{c.name}</span>
                        ))
                      ) : <span className="text-xs text-on-surface-variant">-</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/10">
                <button onClick={() => notify(`Export data ${selected.name}...`, 'info')} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed cursor-pointer flex items-center gap-2">
                  <Icon name="download" />Export
                </button>
                <button onClick={() => setSelected(null)} className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold cursor-pointer">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}