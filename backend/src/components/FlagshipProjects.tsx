import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Project {
  name: string
  location: string
  soldPercent: number
  image: string
}

export default function FlagshipProjects() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('v_inventory_summary').select('*').order('total_units', { ascending: false }).limit(3)
      if (error) return
      if (data) {
        setProjects(data.map((p: any) => ({
          name: p.project_name || 'Unknown',
          location: p.developer_name || '-',
          soldPercent: p.total_units > 0 ? Math.round((p.sold / p.total_units) * 100) : 0,
          image: ''
        })))
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="font-headline text-2xl font-bold">Flagship Projects</h4>
          <p className="text-sm text-on-surface-variant font-body">Most in-demand property listings.</p>
        </div>
      </div>
      <div className="space-y-6">
        {projects.length > 0 ? projects.map((project) => (
          <div key={project.name} className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl bg-surface-container-low overflow-hidden shrink-0">
              <img className="w-full h-full object-cover" alt={project.name} src={project.image || 'https://via.placeholder.com/64'} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h5 className="font-bold text-sm truncate">{project.name}</h5>
                <span className={`text-[10px] font-label font-bold uppercase px-2 py-0.5 rounded shrink-0 ${project.soldPercent >= 80 ? 'text-on-primary-fixed-variant bg-primary-fixed' : project.soldPercent >= 50 ? 'text-on-tertiary-fixed-variant bg-tertiary-fixed' : 'text-on-surface-variant bg-surface-container-high'}`}>
                  {project.soldPercent}% Sold
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-body mt-1">{project.location}</p>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-2">
                <div className="h-full bg-primary rounded-full" style={{ width: `${project.soldPercent}%` }}></div>
              </div>
            </div>
          </div>
        )) : <p className="text-center text-sm text-on-surface-variant">Belum ada project</p>}
      </div>
    </div>
  )
}