import { useEffect, useState } from 'react'
import { supabase, type UnitBooking, type Commission } from '../lib/supabase'
import Icon from '../Icon'

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void }

export default function Approvals({ notify }: Props) {
  const [bookings, setBookings] = useState<UnitBooking[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'bookings' | 'commissions'>('bookings')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: bookingData } = await supabase
        .from('unit_bookings')
        .select('*, units(unit_number), clients(name), users(name)')
        .order('created_at', { ascending: false })
      if (bookingData) setBookings(bookingData)

      const { data: commData } = await supabase
        .from('commissions')
        .select('*, users(name)')
        .order('created_at', { ascending: false })
      if (commData) setCommissions(commData)
    } catch (error: any) {
      notify('Gagal memuat data: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const fp = (n: number) => '$' + (n || 0).toLocaleString()

  const approveBooking = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const { error } = await supabase
        .from('unit_bookings')
        .update({ status })
        .eq('id', id)
      if (error) throw error
      notify(`Booking ${status === 'Approved' ? 'disetujui' : 'ditolak'}!`, status === 'Approved' ? 'success' : 'error')
      fetchData()
    } catch (error: any) {
      notify('Gagal update: ' + error.message, 'error')
    }
  }

  const approveCommission = async (id: string, status: 'Approved' | 'Paid' | 'Rejected') => {
    try {
      const { error } = await supabase
        .from('commissions')
        .update({ status })
        .eq('id', id)
      if (error) throw error
      notify(`Komisi ${status === 'Approved' ? 'disetujui' : 'ditolak'}!`, status === 'Approved' ? 'success' : 'error')
      fetchData()
    } catch (error: any) {
      notify('Gagal update: ' + error.message, 'error')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-4"><Icon name="progress_activity" className="text-2xl animate-spin" /></div>
  }

  const pendingBookings = bookings.filter(b => b.status === 'Pending Leader' || b.status === 'Pending Admin').length
  const pendingClaims = commissions.filter(c => c.status === 'Pending').length

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-8">
      <div><h2 className="font-headline text-3xl lg:text-4xl font-bold">Persetujuan & Validasi</h2><p className="text-on-surface-variant mt-1">Validasi booking unit dan persetujuan klaim komisi tim.</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-error-container/10 p-5 rounded-xl border border-error/5">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Booking Pending</p>
          <p className="text-2xl font-headline font-bold text-error">{pendingBookings}</p>
        </div>
        <div className="bg-tertiary-fixed/30 p-5 rounded-xl">
          <p className="text-[10px] font-label uppercase text-on-surface-variant">Komisi Pending</p>
          <p className="text-2xl font-headline font-bold text-tertiary">{pendingClaims}</p>
        </div>
      </div>

      <div className="flex gap-1 bg-surface-container-low rounded-lg p-1">
        <button onClick={() => setTab('bookings')} className={`flex-1 py-2.5 rounded-md text-sm font-medium cursor-pointer flex items-center justify-center gap-2 ${tab === 'bookings' ? 'bg-white shadow-sm text-primary font-semibold' : 'text-on-surface-variant'}`}>
          <Icon name="receipt_long" className="text-base" />Booking Units {pendingBookings > 0 && <span className="w-5 h-5 bg-error text-white text-[10px] rounded-full flex items-center justify-center font-bold">{pendingBookings}</span>}
        </button>
        <button onClick={() => setTab('commissions')} className={`flex-1 py-2.5 rounded-md text-sm font-medium cursor-pointer flex items-center justify-center gap-2 ${tab === 'commissions' ? 'bg-white shadow-sm text-primary font-semibold' : 'text-on-surface-variant'}`}>
          <Icon name="payments" className="text-base" />Klaim Komisi {pendingClaims > 0 && <span className="w-5 h-5 bg-tertiary text-white text-[10px] rounded-full flex items-center justify-center font-bold">{pendingClaims}</span>}
        </button>
      </div>

      {tab === 'bookings' && (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Agent</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Client & Unit</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Amount</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {bookings.length > 0 ? bookings.map(b => (
                <tr key={b.id} className="hover:bg-surface-container/30 transition-colors group">
                  <td className="px-6 py-4"><p className="text-sm font-semibold">{(b as any).users?.name || 'Agent'}</p></td>
                  <td className="px-6 py-4"><p className="text-sm font-medium">{(b as any).clients?.name || 'Client'}</p><p className="text-xs text-on-surface-variant">{(b as any).units?.unit_number || '-'}</p></td>
                  <td className="px-6 py-4 text-right"><p className="text-sm font-bold">{fp(b.booking_amount)}</p></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${b.status === 'Approved' ? 'bg-[#e7f5ed] text-[#1e4620]' : b.status === 'Rejected' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(b.status === 'Pending Leader' || b.status === 'Pending Admin') && (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => approveBooking(b.id, 'Approved')} className="px-3 py-1.5 text-[10px] font-bold uppercase bg-primary-fixed text-on-primary-fixed-variant rounded hover:bg-primary hover:text-white cursor-pointer">Approve</button>
                        <button onClick={() => approveBooking(b.id, 'Rejected')} className="px-3 py-1.5 text-[10px] font-bold uppercase bg-error-container text-on-error-container rounded hover:bg-error hover:text-white cursor-pointer">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan={5} className="p-4 text-center text-xs text-on-surface-variant">Belum ada booking</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'commissions' && (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Agent</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Project & Tipe</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Amount</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {commissions.length > 0 ? commissions.map(c => (
                <tr key={c.id} className="hover:bg-surface-container/30 transition-colors group">
                  <td className="px-6 py-4"><p className="text-sm font-semibold">{(c as any).users?.name || 'Agent'}</p></td>
                  <td className="px-6 py-4"><p className="text-sm">{c.project_name || '-'}</p><span className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold uppercase">{c.commission_type || '-'}</span></td>
                  <td className="px-6 py-4 text-right font-bold text-primary">{fp(c.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${c.status === 'Pending' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : c.status === 'Approved' ? 'bg-[#e7f5ed] text-[#1e4620]' : 'bg-error-container text-on-error-container'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {c.status === 'Pending' && (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => approveCommission(c.id, 'Approved')} className="px-3 py-1.5 text-[10px] font-bold uppercase bg-primary-fixed text-on-primary-fixed-variant rounded hover:bg-primary hover:text-white cursor-pointer">Approve</button>
                        <button onClick={() => approveCommission(c.id, 'Rejected')} className="px-3 py-1.5 text-[10px] font-bold uppercase bg-error-container text-on-error-container rounded hover:bg-error hover:text-white cursor-pointer">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan={5} className="p-4 text-center text-xs text-on-surface-variant">Belum ada komisi</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}