import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface Unit { id:string; name:string; project:string; type:string; size:string; price:number; dp:number; dpPct:number; status:'Available'|'Booked'|'Sold'; floor:number; bed:number; bath:number; facing:string; image:string; }

const IMG='https://lh3.googleusercontent.com/aida-public/AB6AXuA7Rgn9nTqgf6PeAIGdhxr7bHFbQr4ZgsoR0YbmuQfT__5zqQb3GHIn5dtNM9w6d5oTdgr8-ZyKYBQeDMD7awiDlDWpig-8AvD_wH16kad30BlYkR_mYVtx-gccmrFBzSJfB6umkTxOqu_I--heCDSsEf-Yvt_t4OpODzRs80tRoWbu-TjPptryBlOAjc18J2PiubYvJw8p6pC-8XII4I3GrTrTbhKgC7eqR29ur_nrmvmJoAmLJnn7YPrb9_FZHrKfD-lReq8NzJ5a';

const units: Unit[] = [
  {id:'1',name:'Studio Compact A-12',project:'The Obsidian Groves',type:'Studio',size:'450',price:420000,dp:84000,dpPct:20,status:'Available',floor:12,bed:1,bath:1,facing:'North',image:IMG},
  {id:'2',name:'2BR Terrace B-08',project:'The Obsidian Groves',type:'2BR',size:'1120',price:640000,dp:128000,dpPct:20,status:'Available',floor:8,bed:2,bath:2,facing:'South',image:IMG},
  {id:'3',name:'Penthouse Sky C-15',project:'Marine Wharf',type:'Penthouse',size:'3100',price:2100000,dp:630000,dpPct:30,status:'Available',floor:15,bed:5,bath:4,facing:'Ocean',image:IMG},
  {id:'4',name:'Executive Suite A-10',project:'Alabaster Heights',type:'3BR',size:'1650',price:890000,dp:222500,dpPct:25,status:'Booked',floor:10,bed:3,bath:2,facing:'East',image:IMG},
  {id:'5',name:'Garden Duplex A-03',project:'Alabaster Heights',type:'Duplex',size:'1850',price:985000,dp:246250,dpPct:25,status:'Sold',floor:3,bed:3,bath:2,facing:'West',image:IMG},
  {id:'6',name:'Smart Studio D-02',project:'Azure Residences',type:'Studio',size:'380',price:380000,dp:38000,dpPct:10,status:'Available',floor:2,bed:1,bath:1,facing:'East',image:IMG},
];

const fp = (n:number) => '$'+n.toLocaleString();

export default function CatalogTab({ notify }: Props) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Available');
  const [selected, setSelected] = useState<Unit|null>(null);
  const [showCalc, setShowCalc] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [calcUnit, setCalcUnit] = useState<Unit|null>(null);
  const [calcDp, setCalcDp] = useState(20);
  const [calcRate, setCalcRate] = useState(8);
  const [calcTenor, setCalcTenor] = useState(20);

  const filtered = units.filter(u => {
    const ms = search ? u.name.toLowerCase().includes(search.toLowerCase())||u.project.toLowerCase().includes(search.toLowerCase()) : true;
    return ms && u.status===filterStatus;
  });

  const statusColor = (s:string) => s==='Available'?'bg-[#1e4620] text-white':s==='Booked'?'bg-[#663c00] text-white':'bg-error text-white';

  // KPR Calculator
  const calcMonthly = () => {
    if(!calcUnit) return 0;
    const principal = calcUnit.price * (1 - calcDp/100);
    const monthlyRate = calcRate / 100 / 12;
    const months = calcTenor * 12;
    if(monthlyRate===0) return Math.round(principal/months);
    return Math.round(principal * (monthlyRate * Math.pow(1+monthlyRate,months)) / (Math.pow(1+monthlyRate,months)-1));
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-primary px-5 pb-5 pt-2 rounded-b-3xl">
        <h2 className="text-white font-headline text-xl font-bold mb-3">Katalog Properti</h2>
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-lg"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari unit, project..." className="w-full bg-white/15 text-white placeholder:text-white/50 border-none rounded-xl pl-10 pr-4 py-3 text-sm outline-none"/>
        </div>
        <div className="flex gap-2 mt-3">
          {['Available','Booked','Sold'].map(s=>(
            <button key={s} onClick={()=>setFilterStatus(s)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-all ${filterStatus===s?'bg-white text-primary':'bg-white/15 text-white/70'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Master Plan Legend */}
      <div className="px-5 py-3 flex items-center gap-4 bg-surface-container-low">
        <span className="text-[10px] font-label text-on-surface-variant font-bold uppercase">Status:</span>
        <span className="flex items-center gap-1 text-[10px]"><span className="w-2.5 h-2.5 rounded-sm bg-[#1e4620]"/>Available</span>
        <span className="flex items-center gap-1 text-[10px]"><span className="w-2.5 h-2.5 rounded-sm bg-[#663c00]"/>Booked</span>
        <span className="flex items-center gap-1 text-[10px]"><span className="w-2.5 h-2.5 rounded-sm bg-error"/>Sold</span>
      </div>

      {/* Unit List */}
      <div className="px-4 py-4 space-y-3">
        {filtered.map(u=>(
          <div key={u.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-outline-variant/10 active:scale-[0.98] transition-transform" onClick={()=>setSelected(u)}>
            <div className="flex">
              <div className="w-28 h-28 shrink-0"><img src={u.image} alt="" className="w-full h-full object-cover"/></div>
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start"><h3 className="text-sm font-bold leading-tight">{u.name}</h3><span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${statusColor(u.status)}`}>{u.status}</span></div>
                  <p className="text-[10px] text-on-surface-variant">{u.project}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div><p className="text-xs font-bold text-primary">{fp(u.price)}</p><p className="text-[9px] text-on-surface-variant">DP {fp(u.dp)} ({u.dpPct}%)</p></div>
                  <div className="flex gap-2 text-[9px] text-on-surface-variant"><span>{u.bed}🛏</span><span>{u.bath}🚿</span><span>{u.size}sqft</span></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div className="text-center py-12 text-on-surface-variant"><Icon name="search_off" className="text-4xl opacity-30 mb-2"/><p className="text-sm">Tidak ada unit ditemukan</p></div>}
      </div>

      {/* Unit Detail Sheet */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={()=>setSelected(null)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[90vh] overflow-y-auto" style={{maxWidth:'430px'}} onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mt-3"/>
            <div className="relative h-52"><img src={selected.image} alt="" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent"/><div className="absolute bottom-4 left-5 text-white"><h3 className="font-headline text-xl font-bold">{selected.name}</h3><p className="text-sm opacity-80">{selected.project}</p></div><span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold ${statusColor(selected.status)}`}>{selected.status}</span></div>

            <div className="p-5 space-y-4">
              {/* Specs */}
              <div className="grid grid-cols-4 gap-3">
                {[{i:'bed',v:`${selected.bed} BR`},{i:'shower',v:`${selected.bath} BA`},{i:'square_foot',v:`${selected.size} sqft`},{i:'layers',v:`Lantai ${selected.floor}`}].map(s=>(
                  <div key={s.i} className="bg-surface-container-low rounded-xl p-3 text-center"><Icon name={s.i} className="text-primary text-lg mb-1"/><p className="text-[10px] font-bold">{s.v}</p></div>
                ))}
              </div>

              {/* Price */}
              <div className="bg-primary-fixed/20 rounded-xl p-4 border border-primary/10">
                <div className="flex justify-between mb-2"><span className="text-sm text-on-surface-variant">Harga</span><span className="text-xl font-headline font-bold text-primary">{fp(selected.price)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Down Payment ({selected.dpPct}%)</span><span className="text-sm font-bold">{fp(selected.dp)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Sisa</span><span className="text-sm font-bold">{fp(selected.price-selected.dp)}</span></div>
              </div>

              <div className="flex justify-between text-xs text-on-surface-variant"><span>Hadap: {selected.facing}</span><span>Tipe: {selected.type}</span></div>

              {/* Actions */}
              {selected.status==='Available' && (
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={e=>{e.stopPropagation();setCalcUnit(selected);setShowCalc(true);setSelected(null);}} className="py-3 bg-surface-container-high rounded-xl text-xs font-bold cursor-pointer flex flex-col items-center gap-1"><Icon name="calculate" className="text-primary"/>KPR Calc</button>
                  <button onClick={e=>{e.stopPropagation();notify('Brosur dikirim ke WhatsApp!','success');}} className="py-3 bg-surface-container-high rounded-xl text-xs font-bold cursor-pointer flex flex-col items-center gap-1"><Icon name="share" className="text-tertiary"/>Share</button>
                  <button onClick={e=>{e.stopPropagation();setShowBooking(true);setSelected(null);}} className="py-3 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer flex flex-col items-center gap-1"><Icon name="lock"/>Booking</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KPR Calculator */}
      {showCalc && calcUnit && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={()=>setShowCalc(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[85vh] overflow-y-auto p-6" style={{maxWidth:'430px'}} onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 -mt-1"/>
            <h3 className="font-headline text-lg font-bold mb-1">Kalkulator KPR</h3>
            <p className="text-xs text-on-surface-variant mb-4">{calcUnit.name} — {fp(calcUnit.price)}</p>

            <div className="space-y-5">
              <div><label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-1 block">Uang Muka (DP): {calcDp}%</label><input type="range" min={10} max={50} step={5} value={calcDp} onChange={e=>setCalcDp(+e.target.value)} className="w-full accent-primary cursor-pointer"/><p className="text-right text-sm font-bold text-primary">{fp(Math.round(calcUnit.price*calcDp/100))}</p></div>
              <div><label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-1 block">Suku Bunga: {calcRate}% / tahun</label><input type="range" min={4} max={15} step={0.5} value={calcRate} onChange={e=>setCalcRate(+e.target.value)} className="w-full accent-primary cursor-pointer"/></div>
              <div><label className="text-xs font-label font-bold uppercase text-on-surface-variant mb-1 block">Tenor: {calcTenor} tahun</label><input type="range" min={5} max={30} step={5} value={calcTenor} onChange={e=>setCalcTenor(+e.target.value)} className="w-full accent-primary cursor-pointer"/></div>

              <div className="bg-primary rounded-2xl p-5 text-white text-center">
                <p className="text-xs opacity-70 uppercase font-label mb-1">Estimasi Cicilan / Bulan</p>
                <p className="text-3xl font-headline font-bold">{fp(calcMonthly())}</p>
                <p className="text-xs opacity-70 mt-1">{calcTenor * 12} bulan • Total {fp(calcMonthly()*calcTenor*12)}</p>
              </div>
            </div>

            <button onClick={()=>{notify('Hasil simulasi dikirim ke client!','success');setShowCalc(false);}} className="w-full mt-4 py-3 bg-tertiary text-white font-semibold rounded-xl cursor-pointer flex items-center justify-center gap-2"><Icon name="share"/>Kirim ke Client via WhatsApp</button>
          </div>
        </div>
      )}

      {/* Booking Sheet */}
      {showBooking && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 animate-fade-in" onClick={()=>setShowBooking(false)}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl animate-fade-in-up max-h-[85vh] overflow-y-auto p-6" style={{maxWidth:'430px'}} onClick={e=>e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline-variant/30 rounded-full mx-auto mb-4 -mt-1"/>
            <h3 className="font-headline text-lg font-bold mb-1 flex items-center gap-2"><Icon name="lock" className="text-primary"/>Booking Unit</h3>
            <p className="text-xs text-on-surface-variant mb-4">Kunci unit ini untuk 24 jam. Upload dokumen client.</p>
            <div className="space-y-3">
              <input placeholder="Nama Klien" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/>
              <input placeholder="No. KTP (NIK)" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/>
              <input placeholder="No. Telepon" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"/>
              <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-6 text-center cursor-pointer" onClick={()=>notify('Upload foto KTP...','info')}><Icon name="upload_file" className="text-3xl text-outline mb-1"/><p className="text-xs text-on-surface-variant">Upload KTP & Bukti Transfer</p></div>
            </div>
            <div className="bg-error-container/20 rounded-xl p-3 mt-4 flex items-center gap-2"><Icon name="timer" className="text-error"/><p className="text-xs text-on-surface-variant">Booking berlaku <strong className="text-error">24 jam</strong>. Unit otomatis released jika tidak ada pembayaran.</p></div>
            <button onClick={()=>{notify('Unit berhasil di-booking!','success');setShowBooking(false);}} className="w-full mt-4 py-3.5 bg-primary text-white font-bold rounded-xl cursor-pointer text-sm">Konfirmasi Booking</button>
          </div>
        </div>
      )}
    </div>
  );
}
