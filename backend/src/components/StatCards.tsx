import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Icon from './Icon'

interface StatCardProps {
  icon: string
  badgeText: string
  badgeColor: string
  label: string
  value: string
  delay: number
}

function StatCard({ icon, badgeText, badgeColor, label, value, delay }: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-primary-fixed transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between items-start">
        <Icon name={icon} className="text-primary group-hover:text-on-primary-fixed-variant" />
        <span className={`text-[10px] font-label font-bold uppercase tracking-widest px-2 py-1 rounded-full ${badgeColor}`}>{badgeText}</span>
      </div>
      <div>
        <p className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant group-hover:text-on-primary-fixed-variant">{label}</p>
        <h3 className="font-headline text-3xl font-bold mt-1">{value}</h3>
      </div>
    </div>
  )
}

const fp = (n: number) => (n || 0).toLocaleString()

export default function StatCards() {
  const [stats, setStats] = useState([
    { icon: 'inventory', badgeText: 'Archive', badgeColor: 'text-tertiary bg-tertiary-fixed', label: 'Total Units', value: '0' },
    { icon: 'event_available', badgeText: 'Live', badgeColor: 'text-green-700 bg-green-100', label: 'Available', value: '0' },
    { icon: 'bookmark', badgeText: 'Pending', badgeColor: 'text-blue-700 bg-blue-100', label: 'Booked', value: '0' },
    { icon: 'sell', badgeText: 'Completed', badgeColor: 'text-on-tertiary-fixed-variant bg-tertiary-fixed', label: 'Sold', value: '0' },
  ])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.from('v_inventory_summary').select('*')
      if (error) return

      const total = data.reduce((s: number, p: any) => s + (p.total_units || 0), 0)
      const sold = data.reduce((s: number, p: any) => s + (p.sold || 0), 0)
      const booked = data.reduce((s: number, p: any) => s + (p.booked || 0), 0)
      const available = data.reduce((s: number, p: any) => s + (p.available || 0), 0)

      setStats([
        { icon: 'inventory', badgeText: 'Archive', badgeColor: 'text-tertiary bg-tertiary-fixed', label: 'Total Units', value: fp(total) },
        { icon: 'event_available', badgeText: 'Live', badgeColor: 'text-green-700 bg-green-100', label: 'Available', value: fp(available) },
        { icon: 'bookmark', badgeText: 'Pending', badgeColor: 'text-blue-700 bg-blue-100', label: 'Booked', value: fp(booked) },
        { icon: 'sell', badgeText: 'Completed', badgeColor: 'text-on-tertiary-fixed-variant bg-tertiary-fixed', label: 'Sold', value: fp(sold) },
      ])
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 100} />
      ))}
    </section>
  )
}