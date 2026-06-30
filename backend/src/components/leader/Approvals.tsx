import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface BookingRequest { id:string; agent:string; client:string; project:string; unit:string; amount:number; date:string; status:'Pending'|'Approved'|'Rejected'; notes:string; }
interface CommissionClaim { id:string; agent:string; project:string; amount:number; type:string; date:string; status:'Pending'|'Approved'|'Rejected'; }

const fp = (n:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

const initialBookings: BookingRequest[] = [
  {id:'1',agent:'Michael Scott',client:'Sarah Johnson',project:'The Obsidian Groves',unit:'Unit 402',amount:12500,date:'2024-02-15',status:'Pending',notes:'DP pertama - bank transfer'},
  {id:'2',agent:'Angela Martin',client:'David Kim',project:'Alabaster Heights',unit:'Penthouse C',amount:45000,date:'2024-02-14',status:'Pending',notes:'Full booking fee'},
  {id:'3',agent:'Dwight Schrute',client:'Maria Santos',project:'Marine Wharf',unit:'Suite 12',amount:8750,date:'2024-02-13',status:'Pending',notes:''},
  {id:'4',agent:'Jim Halpert',client:'James Wilson',project:'Azure Residences',unit:'Unit 25-01',amount:28000,date:'2024-02-12',status:'Approved',notes:'Sudah diverifikasi dokumen'},
];

const initialClaims: CommissionClaim[] = [
  {id:'1',agent:'Michael Scott',project:'The Obsidian Groves',amount:18400,type:'Closing Bonus',date:'2024-02-10',status:'Pending'},
  {id:'2',agent:'Dwight Schrute',project:'Alabaster Heights',amount:12200,type:'Base Commission',date:'2024-02-08',status:'Pending'},
  {id:'3',agent:'Angela Martin',project:'Marine Wharf',amount:5600,type:'Volume Tier',date:'2024-02-05',status:'Approved'},
];

export default function Approvals({ notify }: Props) {
  const [bookings, setBookings] = useState<BookingRequest[]>(initialBookings);
  const [claims, setClaims] = useState<CommissionClaim[]>(initialClaims);
  const [tab, setTab] = useState<'bookings'|'commissions'>('bookings');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest|null>(null);

  const handleBooking = (id:string, action:'Approved'|'Rejected') => {
    setBookings(bookings.map(b=>b.id===id?{...b,status:action}:b));
    setSelectedBooking(null);
    notify(`Booking ${action==='Approved'?'disetujui':'ditolak'}!`,action==='Approved'?'success':'error');
  };
  const handleClaim = (id:string, action:'Approved'|'Rejected') => {
    setClaims(claims.map(c=>c.id===id?{...c,status:action}:c));
    notify(`Klaim komisi ${action==='Approved'?'disetujui':'ditolak'}!`,action==='Approved'?'success':'error');
  };

  const pendingBookings = bookings.filter(b=>b.status==='Pending').length;
  const pendingClaims = claims.filter(c=>c.status==='Pending').length;

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-8">
      <div><h2 className="font-headline text-3xl lg:text-4xl font-bold">Persetujuan & Validasi</h2><p className="text-on-surface-variant mt-1">Validasi booking unit dan persetujuan klaim komisi tim.</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-error-container/10 p-5 rounded-xl border border-error/5"><p className="text-[10px] font-label uppercase text-on-surface-variant">Booking Pending</p><p className="text-2xl font-headline font-bold text-error">{pendingBookings}</p></div>
        <div className="bg-tertiary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Komisi Pending</p><p className="text-2xl font-headline font-bold text-tertiary">{pendingClaims}</p></div>
        <div className="bg-primary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Total Booking Value</p><p className="text-2xl font-headline font-bold text-primary">{fp(bookings.filter(b=>b.status==='Pending').reduce((s,b)=>s+b.amount,0))}</p></div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10"><p className="text-[10px] font-label uppercase text-on-surface-variant">Total Klaim</p><p className="text-2xl font-headline font-bold">{fp(claims.filter(c=>c.status==='Pending').reduce((s,c)=>s+c.amount,0))}</p></div>
      </div>

      <div className="flex gap-1 bg-surface-container-low rounded-lg p-1">
        <button onClick={()=>setTab('bookings')} className={`flex-1 py-2.5 rounded-md text-sm font-medium cursor-pointer flex items-center justify-center gap-2 ${tab==='bookings'?'bg-white shadow-sm text-primary font-semibold':'text-on-surface-variant'}`}><Icon name="receipt_long" className="text-base"/>Booking Units {pendingBookings>0&&<span className="w-5 h-5 bg-error text-white text-[10px] rounded-full flex items-center justify-center font-bold">{pendingBookings}</span>}</button>
        <button onClick={()=>setTab('commissions')} className={`flex-1 py-2.5 rounded-md text-sm font-medium cursor-pointer flex items-center justify-center gap-2 ${tab==='commissions'?'bg-white shadow-sm text-primary font-semibold':'text-on-surface-variant'}`}><Icon name="payments" className="text-base"/>Klaim Komisi {pendingClaims>0&&<span className="w-5 h-5 bg-tertiary text-white text-[10px] rounded-full flex items-center justify-center font-bold">{pendingClaims}</span>}</button>
      </div>

      {tab==='bookings' && (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm">
          <table className="w-full text-left"><thead><tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Agent</th>
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Client & Unit</th>
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Amount</th>
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Aksi</th>
          </tr></thead>
          <tbody className="divide-y divide-outline-variant/5">
            {bookings.map(b=>(
              <tr key={b.id} className="hover:bg-surface-container/30 transition-colors group">
                <td className="px-6 py-4"><p className="text-sm font-semibold">{b.agent}</p><p className="text-xs text-on-surface-variant">{b.date}</p></td>
                <td className="px-6 py-4"><p className="text-sm font-medium">{b.client}</p><p className="text-xs text-on-surface-variant">{b.project} — {b.unit}</p></td>
                <td className="px-6 py-4 text-right"><p className="text-sm font-bold">{fp(b.amount)}</p></td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${b.status==='Pending'?'bg-tertiary-fixed text-on-tertiary-fixed-variant':b.status==='Approved'?'bg-[#e7f5ed] text-[#1e4620]':'bg-error-container text-on-error-container'}`}>{b.status}</span></td>
                <td className="px-6 py-4 text-right">
                  {b.status==='Pending' && (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>setSelectedBooking(b)} className="p-1.5 hover:bg-primary-fixed rounded-lg text-on-surface-variant hover:text-primary cursor-pointer"><Icon name="visibility" className="text-lg"/></button>
                      <button onClick={()=>handleBooking(b.id,'Approved')} className="px-3 py-1.5 text-[10px] font-bold uppercase bg-primary-fixed text-on-primary-fixed-variant rounded hover:bg-primary hover:text-white cursor-pointer">Approve</button>
                      <button onClick={()=>handleBooking(b.id,'Rejected')} className="px-3 py-1.5 text-[10px] font-bold uppercase bg-error-container text-on-error-container rounded hover:bg-error hover:text-white cursor-pointer">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody></table>
        </div>
      )}

      {tab==='commissions' && (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm">
          <table className="w-full text-left"><thead><tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Agent</th>
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Project & Tipe</th>
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Amount</th>
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
            <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Aksi</th>
          </tr></thead>
          <tbody className="divide-y divide-outline-variant/5">
            {claims.map(c=>(
              <tr key={c.id} className="hover:bg-surface-container/30 transition-colors group">
                <td className="px-6 py-4"><p className="text-sm font-semibold">{c.agent}</p><p className="text-xs text-on-surface-variant">{c.date}</p></td>
                <td className="px-6 py-4"><p className="text-sm">{c.project}</p><span className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold uppercase">{c.type}</span></td>
                <td className="px-6 py-4 text-right font-bold text-primary">{fp(c.amount)}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${c.status==='Pending'?'bg-tertiary-fixed text-on-tertiary-fixed-variant':c.status==='Approved'?'bg-[#e7f5ed] text-[#1e4620]':'bg-error-container text-on-error-container'}`}>{c.status}</span></td>
                <td className="px-6 py-4 text-right">
                  {c.status==='Pending' && (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>handleClaim(c.id,'Approved')} className="px-3 py-1.5 text-[10px] font-bold uppercase bg-primary-fixed text-on-primary-fixed-variant rounded hover:bg-primary hover:text-white cursor-pointer">Approve</button>
                      <button onClick={()=>handleClaim(c.id,'Rejected')} className="px-3 py-1.5 text-[10px] font-bold uppercase bg-error-container text-on-error-container rounded hover:bg-error hover:text-white cursor-pointer">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody></table>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in" onClick={e=>{if(e.target===e.currentTarget)setSelectedBooking(null);}}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up p-8" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6"><h3 className="font-headline text-xl font-bold">Detail Booking</h3><button onClick={()=>setSelectedBooking(null)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close"/></button></div>
            <div className="space-y-4 mb-6">
              <div className="bg-surface-container-low rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Agent</span><span className="font-semibold">{selectedBooking.agent}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Client</span><span className="font-semibold">{selectedBooking.client}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Project</span><span className="font-semibold">{selectedBooking.project}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Unit</span><span className="font-semibold">{selectedBooking.unit}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Jumlah</span><span className="font-bold text-primary text-lg">{fp(selectedBooking.amount)}</span></div>
                {selectedBooking.notes && <div className="pt-2 border-t border-outline-variant/10"><p className="text-xs text-on-surface-variant">Catatan: {selectedBooking.notes}</p></div>}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>handleBooking(selectedBooking.id,'Rejected')} className="flex-1 py-3 bg-error-container text-on-error-container font-semibold rounded-lg cursor-pointer hover:bg-error hover:text-white transition-colors">Reject</button>
              <button onClick={()=>handleBooking(selectedBooking.id,'Approved')} className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg cursor-pointer hover:opacity-90">Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
