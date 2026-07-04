import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface TeamMember {
  name: string
  projects: number
  revenue: number
  change: string
  positive: boolean
  rank: number
}

export default function TeamLeaderboard() {
  const [teams, setTeams] = useState<TeamMember[]>([])

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase.from('v_team_performance').select('*')
      if (error) return
      if (data) {
        setTeams(data.map((t: any, i: number) => ({
          name: t.team_name || 'Unknown',
          projects: t.agent_count || 0,
          revenue: t.total_revenue || 0,
          change: `${t.achievement_pct || 0}%`,
          positive: (t.achievement_pct || 0) >= 50,
          rank: i + 1
        })))
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="font-headline text-2xl font-bold">Team Leaderboard</h4>
          <p className="text-sm text-on-surface-variant font-body">Highest performing curator circles.</p>
        </div>
      </div>
      <div className="space-y-6">
        {teams.length > 0 ? teams.map((team) => (
          <div key={team.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div>
                <span className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ${team.rank === 1 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-high text-on-surface'}`}>
                  {team.rank}
                </span>
              </div>
              <div>
                <p className="font-bold text-sm">{team.name}</p>
                <p className="text-[11px] text-on-surface-variant font-label uppercase tracking-wider">
                  {team.projects} Active Projects
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">${team.revenue.toLocaleString()}</p>
              <p className={`text-[10px] font-bold font-label uppercase tracking-wider ${team.positive ? 'text-green-600' : 'text-red-600'}`}>
                {team.change}
              </p>
            </div>
          </div>
        )) : <p className="text-center text-sm text-on-surface-variant">Belum ada data tim</p>}
      </div>
    </div>
  )
}