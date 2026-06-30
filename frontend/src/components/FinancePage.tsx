import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface Transaction {
  id: string;
  txnId: string;
  date: string;
  clientName: string;
  projectName: string;
  unitInfo: string;
  amount: number;
  method: 'Bank Transfer' | 'Credit Card' | 'Cash' | 'Cheque';
  status: 'Pending' | 'Approved' | 'Rejected';
  agentName: string;
  notes: string;
}

interface CommissionScheme {
  id: string;
  name: string;
  projectCount: number;
  baseCommission: number;
  closingBonus: string;
  accelerator: string;
  status: 'Active' | 'Inactive';
  description: string;
}

interface Disbursement {
  id: string;
  agentName: string;
  role: string;
  amount: number;
  bonusType: string;
  avatar: string;
  status: 'Cleared' | 'Processing' | 'On Hold';
  period: string;
}

const initialTransactions: Transaction[] = [
  { id:'1', txnId:'TXN-88219', date:'2024-05-24', clientName:'Julianna Thorne', projectName:'The Obsidian Groves', unitInfo:'Unit 402', amount:12500, method:'Bank Transfer', status:'Pending', agentName:'Eleanor Thorne', notes:'DP pertama' },
  { id:'2', txnId:'TXN-88224', date:'2024-05-24', clientName:'Marcus Holloway', projectName:'Alabaster Heights', unitInfo:'Penthouse C', amount:45000, method:'Credit Card', status:'Pending', agentName:'Helena Vance', notes:'Full booking fee' },
  { id:'3', txnId:'TXN-88231', date:'2024-05-23', clientName:'Elena Rostova', projectName:'Marine Wharf', unitInfo:'Commercial Suite', amount:8750, method:'Bank Transfer', status:'Pending', agentName:'Rina Sari', notes:'' },
  { id:'4', txnId:'TXN-88239', date:'2024-05-23', clientName:'Aria Sterling', projectName:'The Obsidian Groves', unitInfo:'Unit 105', amount:15200, method:'Bank Transfer', status:'Pending', agentName:'Julian Sterling', notes:'DP kedua' },
  { id:'5', txnId:'TXN-88201', date:'2024-05-22', clientName:'David Chen', projectName:'Azure Residences', unitInfo:'Unit 25-01', amount:280000, method:'Bank Transfer', status:'Approved', agentName:'Budi Pratama', notes:'Full payment approved' },
  { id:'6', txnId:'TXN-88195', date:'2024-05-21', clientName:'Sarah Liu', projectName:'Villa Verde', unitInfo:'Villa V-03', amount:92500, method:'Cheque', status:'Rejected', agentName:'Rina Sari', notes:'Cheque bounced - insufficient funds' },
];

const initialSchemes: CommissionScheme[] = [
  { id:'1', name:'Luxury High-Rise Tier', projectCount:4, baseCommission:2.5, closingBonus:'+$5,000 Flat', accelerator:'3% over $2M', status:'Active', description:'Skema komisi premium untuk proyek high-rise mewah' },
  { id:'2', name:'Commercial Curator Rate', projectCount:2, baseCommission:1.8, closingBonus:'20% of Fee', accelerator:'0.2% Annually', status:'Active', description:'Skema khusus untuk properti komersial' },
  { id:'3', name:'Standard Residential', projectCount:6, baseCommission:2.0, closingBonus:'+$2,000 Flat', accelerator:'2.5% over $1M', status:'Active', description:'Skema standar untuk rumah tinggal' },
];

const initialDisbursements: Disbursement[] = [
  { id:'1', agentName:'Clara Montgomery', role:'Senior Curator', amount:18400, bonusType:'Q2 PREMIER', avatar:'https://lh3.googleusercontent.com/aida-public/AB6AXuAlNeBK9Z24l_ivFhUvw-KnT1w1_PwFvHwkg_UpPxsvtdGkwD8uU667W6cJq_KszOZnDLrDMtu6CptiM53N-xgLGlOFrGsvu7YhpQIcDhqXX1pUKPha8ggok5rjAea6_SSQEzK_yKKt3Hck4fRToWBI6e-KT26x4auc1PmnH4nRvkO4RT0-6oioraVhozIVgtKz3JcPe55e-c2uCuBBTuAwtGhbACY1viDhAJ1etB66T-fWhQC9Iu529xjFAw_hx19aN9uFa6y8mY5G', status:'Cleared', period:'May 2024' },
  { id:'2', agentName:'David Sterling', role:'Project Lead', amount:22100, bonusType:'LOYALTY CAP', avatar:'https://lh3.googleusercontent.com/aida-public/AB6AXuAmL3eE5--4i_xN0Vp1mDGK3szgtS1Xp67ceucGgxa9fZfx8gE1HqfyyYaLE8MH-uJQmqvLFDoZDerleLcEEELqPm5tyZMhpiVDD58NVwVaQBurax6eDJR2Mn5i7rs53Z7F5YvRHg-MLa5foES43ovJ84JQub-jhta3q8mtdH2nZ6Ly_lJZq9dg34edEdKYgCfzhv8T3gmSYKZwQmtTPC7uOnqHgVsKzmYv3RkiyLpGRj5eOOzZqWfKWkBIAQzJlFDMsENfyPaNv0gA', status:'Cleared', period:'May 2024' },
  { id:'3', agentName:'Sarah Jenkins', role:'Assoc. Curator', amount:17700, bonusType:'VOLUME TIER', avatar:'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Q7osDqQwZIN9MsD-K_ikCw_6_uDWxaM2G9xPO2qQ8uk-je-p-839Omv-Sy4QsnfIes55T7octXJM5Kyk2G4Yv9n_dU4zVgW9wiz2X1VGwZS2dp1v-mDVOYZtppDPXQAZ75SrW8K2h62tPyjEAMJegm6IytUDxU74FvtT9TXxowYvw4JYnzaB28NyvznY_5HGMac8jrGNoyenRdIE8eY0suTMzOIhgiGWOiEZKR_IZvc55y4nwfgKjDVJL6RQ39M8NSgfdYxJ8Brd', status:'Cleared', period:'May 2024' },
];

const fp = (p:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(p);
const fp2 = (p:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(p);

const emptyTxn = { clientName:'', projectName:'', unitInfo:'', amount:0, method:'Bank Transfer' as Transaction['method'], agentName:'', notes:'' };
const emptyScheme = { name:'', baseCommission:0, closingBonus:'', accelerator:'', description:'', projectCount:0, status:'Active' as CommissionScheme['status'] };

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [schemes, setSchemes] = useState<CommissionScheme[]>(initialSchemes);
  const [disbursements, setDisbursements] = useState<Disbursement[]>(initialDisbursements);
  const [txnFilter, setTxnFilter] = useState<'All'|'Pending'|'Approved'|'Rejected'>('All');
  const [showToast, setShowToast] = useState<{message:string;type:'success'|'error'|'info'}|null>(null);

  // Modals
  const [showAddTxn, setShowAddTxn] = useState(false);
  const [showDetailTxn, setShowDetailTxn] = useState(false);
  const [showAddScheme, setShowAddScheme] = useState(false);
  const [showEditScheme, setShowEditScheme] = useState(false);
  const [showDeleteScheme, setShowDeleteScheme] = useState(false);
  const [showDisbDetail, setShowDisbDetail] = useState(false);

  const [selectedTxn, setSelectedTxn] = useState<Transaction|null>(null);
  const [selectedScheme, setSelectedScheme] = useState<CommissionScheme|null>(null);
  const [selectedDisb, setSelectedDisb] = useState<Disbursement|null>(null);
  const [txnForm, setTxnForm] = useState(emptyTxn);
  const [schemeForm, setSchemeForm] = useState(emptyScheme);
  const [formErrors, setFormErrors] = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const notify = (m:string,t:'success'|'error'|'info'='info') => { setShowToast({message:m,type:t}); setTimeout(()=>setShowToast(null),3000); };

  const filteredTxns = transactions.filter(t => txnFilter==='All' ? true : t.status===txnFilter);
  const pendingTotal = transactions.filter(t=>t.status==='Pending').reduce((s,t)=>s+t.amount,0);
  const bonusTotal = disbursements.reduce((s,d)=>s+d.amount,0);

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{if(e.key==='Escape'){setShowAddTxn(false);setShowDetailTxn(false);setShowAddScheme(false);setShowEditScheme(false);setShowDeleteScheme(false);setShowDisbDetail(false);}};
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[]);
  useEffect(()=>{if(showAddTxn){setTxnForm(emptyTxn);setFormErrors({});}},[showAddTxn]);
  useEffect(()=>{if(showAddScheme){setSchemeForm(emptyScheme);setFormErrors({});}},[showAddScheme]);
  useEffect(()=>{if(showEditScheme&&selectedScheme){setSchemeForm({name:selectedScheme.name,baseCommission:selectedScheme.baseCommission,closingBonus:selectedScheme.closingBonus,accelerator:selectedScheme.accelerator,description:selectedScheme.description,projectCount:selectedScheme.projectCount,status:selectedScheme.status});setFormErrors({});}},[showEditScheme,selectedScheme]);

  // Handlers
  const handleApproveTxn = (txn:Transaction) => {
    setTransactions(transactions.map(t=>t.id===txn.id?{...t,status:'Approved'}:t));
    notify(`Transaksi ${txn.txnId} disetujui!`,'success');
  };
  const handleRejectTxn = (txn:Transaction) => {
    setTransactions(transactions.map(t=>t.id===txn.id?{...t,status:'Rejected'}:t));
    notify(`Transaksi ${txn.txnId} ditolak.`,'error');
  };
  const handleAddTxn = () => {
    const e:Record<string,string>={};
    if(!txnForm.clientName.trim()) e.clientName='Nama klien wajib diisi';
    if(!txnForm.projectName.trim()) e.projectName='Project wajib diisi';
    if(!txnForm.amount||txnForm.amount<1) e.amount='Jumlah minimal $1';
    setFormErrors(e); if(Object.keys(e).length>0) return;
    setIsSubmitting(true); setTimeout(()=>{
      const newTxn:Transaction = { id:String(Date.now()), txnId:`TXN-${Math.floor(10000+Math.random()*89999)}`, date:new Date().toISOString().split('T')[0], ...txnForm, status:'Pending' };
      setTransactions([newTxn,...transactions]); setShowAddTxn(false); setIsSubmitting(false);
      notify(`Transaksi ${newTxn.txnId} berhasil dicatat!`,'success');
    },800);
  };
  const handleAddScheme = () => {
    const e:Record<string,string>={};
    if(!schemeForm.name.trim()) e.name='Nama skema wajib diisi';
    if(!schemeForm.baseCommission) e.baseCommission='Komisi dasar wajib diisi';
    setFormErrors(e); if(Object.keys(e).length>0) return;
    setIsSubmitting(true); setTimeout(()=>{
      setSchemes([{id:String(Date.now()),...schemeForm},...schemes]); setShowAddScheme(false); setIsSubmitting(false);
      notify(`Skema "${schemeForm.name}" berhasil dibuat!`,'success');
    },800);
  };
  const handleEditScheme = () => {
    if(!selectedScheme) return;
    const e:Record<string,string>={};
    if(!schemeForm.name.trim()) e.name='Nama skema wajib diisi';
    setFormErrors(e); if(Object.keys(e).length>0) return;
    setIsSubmitting(true); setTimeout(()=>{
      setSchemes(schemes.map(s=>s.id===selectedScheme.id?{...s,...schemeForm}:s)); setShowEditScheme(false); setIsSubmitting(false);
      notify(`Skema "${schemeForm.name}" berhasil diperbarui!`,'success');
    },800);
  };
  const handleDeleteScheme = () => {
    if(!selectedScheme) return; setIsSubmitting(true); setTimeout(()=>{
      setSchemes(schemes.filter(s=>s.id!==selectedScheme.id)); setShowDeleteScheme(false); setIsSubmitting(false);
      notify(`Skema "${selectedScheme.name}" berhasil dihapus!`,'success');
    },600);
  };
  const handleProcessAll = () => {
    notify('Memproses semua disbursement...','info');
    setTimeout(()=>{
      setDisbursements(disbursements.map(d=>({...d,status:'Processing' as Disbursement['status']})));
      setTimeout(()=>{
        setDisbursements(prev=>prev.map(d=>({...d,status:'Cleared' as Disbursement['status']})));
        notify('Semua disbursement berhasil diproses!','success');
      },2000);
    },500);
  };

  // Shared components
  const MB = ({children,onClose,wide=false}:{children:React.ReactNode;onClose:()=>void;wide?:boolean}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={e=>{if(e.target===e.currentTarget) onClose();}}>
      <div ref={modalRef} className={`bg-white rounded-2xl shadow-2xl ${wide?'w-full max-w-4xl':'w-full max-w-lg'} max-h-[90vh] overflow-y-auto animate-fade-in-up my-8`} onClick={e=>e.stopPropagation()}>{children}</div>
    </div>
  );
  const FI = ({label,name,type='text',placeholder,value,onChange,error}:{label:string;name:string;type?:string;placeholder?:string;value:string|number;onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;error?:string}) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-4 py-3 bg-surface-container-low border rounded-lg text-sm outline-none transition-all ${error?'border-error focus:ring-2 focus:ring-error/20':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>
      {error&&<p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
  const FS = ({label,value,onChange,options}:{label:string;value:string;onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void;options:{value:string;label:string}[]}) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <select value={value} onChange={onChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer">
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
  const Spinner = () => <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;

  const MethodBadge = ({method}:{method:Transaction['method']}) => {
    const s = method==='Bank Transfer'?'bg-tertiary-fixed text-on-tertiary-fixed-variant':method==='Credit Card'?'bg-secondary-container text-on-secondary-container':method==='Cash'?'bg-primary-fixed text-on-primary-fixed-variant':'bg-surface-container-high text-on-surface-variant';
    return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s}`}>{method}</span>;
  };

  const StatusBadge = ({status}:{status:Transaction['status']}) => {
    const s = status==='Pending'?'bg-tertiary-fixed text-on-tertiary-fixed-variant':status==='Approved'?'bg-[#e7f5ed] text-[#1e4620]':'bg-error-container text-on-error-container';
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${s}`}>{status}</span>;
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="font-headline text-4xl font-bold text-on-surface leading-tight">Financial Oversight</h2>
          <p className="font-body text-on-surface-variant max-w-xl">Kelola verifikasi transaksi, struktur komisi, dan disbursement bonus penjualan.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>notify('Export laporan keuangan...','info')} className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-high text-primary font-semibold rounded-lg hover:bg-surface-variant transition-all cursor-pointer">
            <Icon name="download" className="text-lg"/><span className="font-label text-sm uppercase tracking-wide">Export Report</span>
          </button>
          <button onClick={()=>setShowAddTxn(true)} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
            <Icon name="add" className="text-lg"/><span className="font-label text-sm uppercase tracking-wide">Record Entry</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary">
          <p className="font-label uppercase tracking-widest text-[10px] font-bold text-on-surface-variant mb-2">Total Pending Verification</p>
          <p className="font-headline text-3xl font-bold text-on-surface">{fp2(pendingTotal)}</p>
          <div className="mt-4 flex items-center gap-2 text-tertiary"><Icon name="schedule" className="text-sm"/><span className="text-xs font-medium italic">{transactions.filter(t=>t.status==='Pending').length} items memerlukan perhatian</span></div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-tertiary">
          <p className="font-label uppercase tracking-widest text-[10px] font-bold text-on-surface-variant mb-2">Monthly Sales Bonuses</p>
          <p className="font-headline text-3xl font-bold text-on-surface">{fp2(bonusTotal)}</p>
          <div className="mt-4 flex items-center gap-2 text-primary"><Icon name="check_circle" className="text-sm"/><span className="text-xs font-medium italic">Siap untuk disbursement</span></div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-on-surface-variant">
          <p className="font-label uppercase tracking-widest text-[10px] font-bold text-on-surface-variant mb-2">Active Commission Schemes</p>
          <p className="font-headline text-3xl font-bold text-on-surface">{schemes.filter(s=>s.status==='Active').length}</p>
          <div className="mt-4 flex items-center gap-2 text-on-secondary-fixed-variant"><Icon name="description" className="text-sm"/><span className="text-xs font-medium italic">Linked across {schemes.reduce((s,c)=>s+c.projectCount,0)} projects</span></div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2/3: Transactions + Schemes */}
        <section className="lg:col-span-2 space-y-8">
          {/* Transactions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline text-xl font-semibold">Booking Verifications</h3>
              <div className="flex gap-2">
                {(['All','Pending','Approved','Rejected'] as const).map(f=>(
                  <button key={f} onClick={()=>setTxnFilter(f)} className={`px-3 py-1 text-[10px] font-bold font-label uppercase tracking-widest rounded-full cursor-pointer transition-colors ${txnFilter===f?'bg-primary text-white':'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}>{f}</button>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="py-4 px-6 font-label uppercase tracking-widest text-[10px] font-bold text-on-secondary-fixed-variant">Transaction ID</th>
                      <th className="py-4 px-6 font-label uppercase tracking-widest text-[10px] font-bold text-on-secondary-fixed-variant">Client & Project</th>
                      <th className="py-4 px-6 font-label uppercase tracking-widest text-[10px] font-bold text-on-secondary-fixed-variant">Amount</th>
                      <th className="py-4 px-6 font-label uppercase tracking-widest text-[10px] font-bold text-on-secondary-fixed-variant">Status</th>
                      <th className="py-4 px-6 font-label uppercase tracking-widest text-[10px] font-bold text-on-secondary-fixed-variant text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    {filteredTxns.map(txn=>(
                      <tr key={txn.id} className="hover:bg-surface transition-colors group">
                        <td className="py-4 px-6">
                          <p className="font-mono text-xs text-on-surface">#{txn.txnId}</p>
                          <p className="text-[10px] text-on-surface-variant">{new Date(txn.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-semibold">{txn.clientName}</p>
                          <p className="text-xs text-on-surface-variant">{txn.projectName} — {txn.unitInfo}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-on-surface">{fp2(txn.amount)}</p>
                          <MethodBadge method={txn.method}/>
                        </td>
                        <td className="py-4 px-6"><StatusBadge status={txn.status}/></td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>{setSelectedTxn(txn);setShowDetailTxn(true);}} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary-fixed text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="Detail"><Icon name="visibility" className="text-[16px]"/></button>
                            {txn.status==='Pending' && <>
                              <button onClick={()=>handleApproveTxn(txn)} className="px-3 py-1.5 text-[10px] font-bold font-label uppercase tracking-widest bg-primary-fixed text-on-primary-fixed-variant rounded hover:bg-primary hover:text-white transition-all cursor-pointer">Approve</button>
                              <button onClick={()=>handleRejectTxn(txn)} className="px-3 py-1.5 text-[10px] font-bold font-label uppercase tracking-widest bg-error-container text-on-error-container rounded hover:bg-error hover:text-white transition-all cursor-pointer">Reject</button>
                            </>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTxns.length===0 && <tr><td colSpan={5} className="py-12 text-center text-on-surface-variant">Tidak ada transaksi.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Commission Schemes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline text-xl font-semibold">Project Commission Schemes</h3>
              <button onClick={()=>setShowAddScheme(true)} className="text-[10px] font-label uppercase tracking-widest font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"><Icon name="add" className="text-sm"/>New Scheme</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schemes.map(scheme=>(
                <div key={scheme.id} className="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between group hover:bg-white hover:shadow-xl hover:shadow-on-surface/5 transition-all border border-outline-variant/8">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-on-surface">{scheme.name}</h4>
                        <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{scheme.status} — {scheme.projectCount} Projects</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={()=>{setSelectedScheme(scheme);setShowEditScheme(true);}} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary-fixed text-on-surface-variant hover:text-primary transition-all cursor-pointer"><Icon name="edit_note" className="text-[16px]"/></button>
                        <button onClick={()=>{setSelectedScheme(scheme);setShowDeleteScheme(true);}} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-all cursor-pointer"><Icon name="delete" className="text-[16px]"/></button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs"><span className="text-on-surface-variant">Base Commission</span><span className="font-bold">{scheme.baseCommission}%</span></div>
                      <div className="flex justify-between items-center text-xs"><span className="text-on-surface-variant">Closing Bonus</span><span className="font-bold text-tertiary">{scheme.closingBonus||'-'}</span></div>
                      <div className="flex justify-between items-center text-xs"><span className="text-on-surface-variant">Accelerator</span><span className="font-bold text-primary">{scheme.accelerator||'-'}</span></div>
                    </div>
                  </div>
                  {scheme.description && <p className="text-xs text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/10 italic">{scheme.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right 1/3: Disbursements */}
        <aside className="space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-lg font-bold">Disbursement Queue</h3>
              <Icon name="account_balance_wallet" className="text-on-surface-variant"/>
            </div>
            <p className="text-xs text-on-surface-variant mb-6 italic leading-relaxed">Bonus yang sudah diverifikasi dan siap dicairkan untuk siklus billing bulan ini.</p>
            <div className="space-y-6">
              {disbursements.map(d=>(
                <div key={d.id} className="flex items-center gap-4 group cursor-pointer hover:bg-surface-container-low rounded-lg p-2 -mx-2 transition-colors" onClick={()=>{setSelectedDisb(d);setShowDisbDetail(true);}}>
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    {d.avatar ? <img src={d.avatar} alt={d.agentName} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-surface-dim flex items-center justify-center font-bold text-sm">{d.agentName.split(' ').map(n=>n[0]).join('')}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold truncate">{d.agentName}</h5>
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{d.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{fp(d.amount)}</p>
                    <p className="text-[9px] text-tertiary font-bold">{d.bonusType}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-surface-container-high">
              <button onClick={handleProcessAll} className="w-full py-3 bg-on-surface text-surface text-[10px] font-label uppercase tracking-[0.2em] font-bold rounded hover:bg-primary transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Icon name="rocket_launch" className="text-sm"/> Process All Disbursements
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
            <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Ringkasan Bulan Ini</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Transaksi Approved</span><span className="font-bold text-on-surface">{transactions.filter(t=>t.status==='Approved').length}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Total Approved</span><span className="font-bold text-primary">{fp(transactions.filter(t=>t.status==='Approved').reduce((s,t)=>s+t.amount,0))}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Transaksi Rejected</span><span className="font-bold text-error">{transactions.filter(t=>t.status==='Rejected').length}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Total Disbursement</span><span className="font-bold text-tertiary">{fp(bonusTotal)}</span></div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="pt-10 pb-4 text-center"><p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant opacity-35">© Agent Properti • Manajemen Sales Properti v2.4.0</p></footer>

      {/* ========== MODALS ========== */}

      {/* Add Transaction */}
      {showAddTxn && (
        <MB onClose={()=>setShowAddTxn(false)}>
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <div><h2 className="font-headline text-2xl font-bold">Record New Entry</h2><p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Financial Ledger</p></div>
            <button onClick={()=>setShowAddTxn(false)} className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer"><Icon name="close"/></button>
          </div>
          <form className="p-8 space-y-5" onSubmit={e=>{e.preventDefault();handleAddTxn();}}>
            <div className="grid grid-cols-2 gap-5">
              <FI label="Nama Klien *" name="clientName" placeholder="Julianna Thorne" value={txnForm.clientName} onChange={e=>setTxnForm({...txnForm,clientName:e.target.value})} error={formErrors.clientName}/>
              <FI label="Nama Agent" name="agentName" placeholder="Eleanor Thorne" value={txnForm.agentName} onChange={e=>setTxnForm({...txnForm,agentName:e.target.value})}/>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FI label="Project *" name="projectName" placeholder="The Obsidian Groves" value={txnForm.projectName} onChange={e=>setTxnForm({...txnForm,projectName:e.target.value})} error={formErrors.projectName}/>
              <FI label="Unit" name="unitInfo" placeholder="Unit 402" value={txnForm.unitInfo} onChange={e=>setTxnForm({...txnForm,unitInfo:e.target.value})}/>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FI label="Jumlah (USD) *" name="amount" type="number" placeholder="0" value={txnForm.amount} onChange={e=>setTxnForm({...txnForm,amount:parseFloat(e.target.value)||0})} error={formErrors.amount}/>
              <FS label="Metode Pembayaran" value={txnForm.method} onChange={e=>setTxnForm({...txnForm,method:e.target.value as Transaction['method']})} options={[{value:'Bank Transfer',label:'Bank Transfer'},{value:'Credit Card',label:'Credit Card'},{value:'Cash',label:'Cash'},{value:'Cheque',label:'Cheque'}]}/>
            </div>
            <div>
              <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Catatan</label>
              <textarea value={txnForm.notes} onChange={e=>setTxnForm({...txnForm,notes:e.target.value})} placeholder="DP pertama, full payment, dll." rows={2} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/>
            </div>
            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
              <button type="button" onClick={()=>setShowAddTxn(false)} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface cursor-pointer">Batal</button>
              <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><Spinner/>Menyimpan...</>:<><Icon name="add"/>Record Entry</>}
              </button>
            </div>
          </form>
        </MB>
      )}

      {/* Transaction Detail */}
      {showDetailTxn && selectedTxn && (
        <MB onClose={()=>setShowDetailTxn(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-3">
                  <span className="font-mono text-lg text-primary">#{selectedTxn.txnId}</span>
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">{new Date(selectedTxn.date).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedTxn.status}/>
                <button onClick={()=>setShowDetailTxn(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-surface-container-low rounded-xl p-6 space-y-3">
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Informasi Klien</h4>
                <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Klien</span><span className="text-sm font-medium">{selectedTxn.clientName}</span></div>
                <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Project</span><span className="text-sm font-medium">{selectedTxn.projectName}</span></div>
                <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Unit</span><span className="text-sm font-medium">{selectedTxn.unitInfo}</span></div>
                <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Agent</span><span className="text-sm font-medium">{selectedTxn.agentName||'-'}</span></div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-6 space-y-3">
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Informasi Pembayaran</h4>
                <div className="flex justify-between items-center"><span className="text-sm text-on-surface-variant">Jumlah</span><span className="text-2xl font-headline font-bold text-primary">{fp2(selectedTxn.amount)}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-on-surface-variant">Metode</span><MethodBadge method={selectedTxn.method}/></div>
                {selectedTxn.notes && <div className="pt-3 border-t border-outline-variant/10"><span className="text-xs text-on-surface-variant">Catatan: </span><span className="text-sm text-on-surface">{selectedTxn.notes}</span></div>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              {selectedTxn.status==='Pending' && <>
                <button onClick={()=>{handleRejectTxn(selectedTxn);setShowDetailTxn(false);}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error-container transition-colors cursor-pointer flex items-center gap-2"><Icon name="close"/>Reject</button>
                <button onClick={()=>{handleApproveTxn(selectedTxn);setShowDetailTxn(false);}} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer flex items-center gap-2"><Icon name="check"/>Approve</button>
              </>}
              {selectedTxn.status!=='Pending' && <button onClick={()=>setShowDetailTxn(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer">Tutup</button>}
            </div>
          </div>
        </MB>
      )}

      {/* Add Scheme */}
      {showAddScheme && (
        <MB onClose={()=>setShowAddScheme(false)}>
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <div><h2 className="font-headline text-2xl font-bold">Skema Komisi Baru</h2></div>
            <button onClick={()=>setShowAddScheme(false)} className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer"><Icon name="close"/></button>
          </div>
          <form className="p-8 space-y-5" onSubmit={e=>{e.preventDefault();handleAddScheme();}}>
            <FI label="Nama Skema *" name="name" placeholder="Premium Residential Tier" value={schemeForm.name} onChange={e=>setSchemeForm({...schemeForm,name:e.target.value})} error={formErrors.name}/>
            <div className="grid grid-cols-2 gap-5">
              <FI label="Base Commission (%) *" name="baseCommission" type="number" placeholder="2.5" value={schemeForm.baseCommission} onChange={e=>setSchemeForm({...schemeForm,baseCommission:parseFloat(e.target.value)||0})} error={formErrors.baseCommission}/>
              <FI label="Jumlah Project" name="projectCount" type="number" placeholder="0" value={schemeForm.projectCount} onChange={e=>setSchemeForm({...schemeForm,projectCount:parseInt(e.target.value)||0})}/>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FI label="Closing Bonus" name="closingBonus" placeholder="+$5,000 Flat" value={schemeForm.closingBonus} onChange={e=>setSchemeForm({...schemeForm,closingBonus:e.target.value})}/>
              <FI label="Accelerator" name="accelerator" placeholder="3% over $2M" value={schemeForm.accelerator} onChange={e=>setSchemeForm({...schemeForm,accelerator:e.target.value})}/>
            </div>
            <FS label="Status" value={schemeForm.status} onChange={e=>setSchemeForm({...schemeForm,status:e.target.value as CommissionScheme['status']})} options={[{value:'Active',label:'Active'},{value:'Inactive',label:'Inactive'}]}/>
            <div>
              <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Deskripsi</label>
              <textarea value={schemeForm.description} onChange={e=>setSchemeForm({...schemeForm,description:e.target.value})} placeholder="Deskripsi skema..." rows={2} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/>
            </div>
            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
              <button type="button" onClick={()=>setShowAddScheme(false)} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface cursor-pointer">Batal</button>
              <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><Spinner/>Menyimpan...</>:<><Icon name="add"/>Buat Skema</>}
              </button>
            </div>
          </form>
        </MB>
      )}

      {/* Edit Scheme */}
      {showEditScheme && selectedScheme && (
        <MB onClose={()=>setShowEditScheme(false)}>
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <div><h2 className="font-headline text-2xl font-bold">Edit Skema Komisi</h2><p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">{selectedScheme.name}</p></div>
            <button onClick={()=>setShowEditScheme(false)} className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer"><Icon name="close"/></button>
          </div>
          <form className="p-8 space-y-5" onSubmit={e=>{e.preventDefault();handleEditScheme();}}>
            <FI label="Nama Skema *" name="name" value={schemeForm.name} onChange={e=>setSchemeForm({...schemeForm,name:e.target.value})} error={formErrors.name}/>
            <div className="grid grid-cols-2 gap-5">
              <FI label="Base Commission (%)" name="baseCommission" type="number" value={schemeForm.baseCommission} onChange={e=>setSchemeForm({...schemeForm,baseCommission:parseFloat(e.target.value)||0})}/>
              <FI label="Jumlah Project" name="projectCount" type="number" value={schemeForm.projectCount} onChange={e=>setSchemeForm({...schemeForm,projectCount:parseInt(e.target.value)||0})}/>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FI label="Closing Bonus" name="closingBonus" value={schemeForm.closingBonus} onChange={e=>setSchemeForm({...schemeForm,closingBonus:e.target.value})}/>
              <FI label="Accelerator" name="accelerator" value={schemeForm.accelerator} onChange={e=>setSchemeForm({...schemeForm,accelerator:e.target.value})}/>
            </div>
            <FS label="Status" value={schemeForm.status} onChange={e=>setSchemeForm({...schemeForm,status:e.target.value as CommissionScheme['status']})} options={[{value:'Active',label:'Active'},{value:'Inactive',label:'Inactive'}]}/>
            <div>
              <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Deskripsi</label>
              <textarea value={schemeForm.description} onChange={e=>setSchemeForm({...schemeForm,description:e.target.value})} rows={2} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/>
            </div>
            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
              <button type="button" onClick={()=>setShowEditScheme(false)} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface cursor-pointer">Batal</button>
              <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><Spinner/>Menyimpan...</>:<><Icon name="save"/>Simpan</>}
              </button>
            </div>
          </form>
        </MB>
      )}

      {/* Delete Scheme */}
      {showDeleteScheme && selectedScheme && (
        <MB onClose={()=>setShowDeleteScheme(false)}>
          <div className="p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-error-container flex items-center justify-center mb-6"><Icon name="delete_forever" className="text-3xl text-error"/></div>
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Hapus Skema Komisi?</h3>
              <p className="text-on-surface-variant">Skema <span className="font-semibold text-on-surface">"{selectedScheme.name}"</span> akan dihapus secara permanen.</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Base Commission</span><span className="font-bold">{selectedScheme.baseCommission}%</span></div>
              <div className="flex justify-between text-sm mt-2"><span className="text-on-surface-variant">Linked Projects</span><span className="font-bold">{selectedScheme.projectCount}</span></div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={()=>setShowDeleteScheme(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer">Batal</button>
              <button onClick={handleDeleteScheme} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-error text-on-error text-sm font-semibold hover:bg-error/90 cursor-pointer disabled:opacity-70 flex items-center gap-2">
                {isSubmitting?<><Spinner/>Menghapus...</>:<><Icon name="delete"/>Ya, Hapus</>}
              </button>
            </div>
          </div>
        </MB>
      )}

      {/* Disbursement Detail */}
      {showDisbDetail && selectedDisb && (
        <MB onClose={()=>setShowDisbDetail(false)}>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">{selectedDisb.avatar?<img src={selectedDisb.avatar} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full bg-surface-dim flex items-center justify-center font-bold text-xl">{selectedDisb.agentName.split(' ').map(n=>n[0]).join('')}</div>}</div>
                <div>
                  <h3 className="font-headline text-xl font-bold">{selectedDisb.agentName}</h3>
                  <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">{selectedDisb.role}</p>
                </div>
              </div>
              <button onClick={()=>setShowDisbDetail(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close"/></button>
            </div>
            <div className="bg-primary-fixed/20 rounded-xl p-6 mb-6 text-center border border-primary/10">
              <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Bonus Amount</p>
              <p className="text-4xl font-headline font-bold text-primary">{fp(selectedDisb.amount)}</p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-tertiary-fixed text-on-tertiary-fixed-variant">{selectedDisb.bonusType}</span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-surface-container-high text-on-surface-variant">{selectedDisb.period}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${selectedDisb.status==='Cleared'?'bg-[#e7f5ed] text-[#1e4620]':selectedDisb.status==='Processing'?'bg-tertiary-fixed text-on-tertiary-fixed-variant':'bg-error-container text-on-error-container'}`}>{selectedDisb.status}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/10">
              <button onClick={()=>{notify(`Disbursement untuk ${selectedDisb.agentName} diproses...`,'info');setShowDisbDetail(false);}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed cursor-pointer flex items-center gap-2"><Icon name="send"/>Process</button>
              <button onClick={()=>setShowDisbDetail(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer">Tutup</button>
            </div>
          </div>
        </MB>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-fade-in-up">
          <div className={`px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${showToast.type==='success'?'bg-tertiary text-on-tertiary':showToast.type==='error'?'bg-error text-on-error':'bg-inverse-surface text-inverse-on-surface'}`}>
            <Icon name={showToast.type==='success'?'check_circle':showToast.type==='error'?'error':'info'} className="text-[18px]"/>
            {showToast.message}
          </div>
        </div>
      )}
    </div>
  );
}
