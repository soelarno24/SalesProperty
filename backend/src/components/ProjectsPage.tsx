import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Icon from './Icon'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('v_inventory_summary').select('*').order('total_units', { ascending: false })
      if (data) setProjects(data)
    } catch (error: any) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><Icon name="progress_activity" className="text-2xl animate-spin" /></div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <div>
        <h2 className="font-headline text-4xl text-on-surface font-bold">Active Housing Portfolios</h2>
        <p className="text-on-surface-variant mt-2 text-sm">Kelola project perumahan berdasarkan developer mitra.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? projects.map((p: any) => (
          <div key={p.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-headline text-lg font-bold text-on-surface">{p.project_name}</h3>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${p.progress >= 80 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : p.progress >= 50 ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-error-container text-on-error-container'}`}>
                {p.available > 0 ? 'Ongoing' : 'Completed'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-2">{p.developer_name}</p>
            <p className="text-[10px] text-on-surface-variant flex items-center gap-1 mb-3">
              <Icon name="location_on" className="text-xs" />{p.developer_name}
            </p>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-on-surface-variant">Units</span>
              <span className="font-bold text-on-surface">{p.available + p.booked + p.sold} Total</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-on-surface-variant">Sold</span>
              <span className="font-bold text-[#1e4620]">{p.sold}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-on-surface-variant">Available</span>
              <span className="font-bold text-primary">{p.available}</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${p.avg_price ? p.progress : 0}%` }} />
            </div>
          </div>
        )) : <p className="text-center text-on-surface-variant col-span-full">Belum ada project</p>}
      </div>
    </div>
  )
}