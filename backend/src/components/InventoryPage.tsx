import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface Unit {
  id: string;
  projectId: string;
  projectName: string;
  block: string;
  unitNumber: string;
  houseType: string;
  floorArea: number;
  price: number;
  downPayment: number;
  dpPercent: number;
  status: 'Available' | 'Booked' | 'Sold';
  bedrooms: number;
  bathrooms: number;
  floor: number;
  facing: string;
  notes: string;
  bookedBy?: string;
  bookedDate?: string;
  soldDate?: string;
}

interface Project { id: string; name: string; }

interface DigitalAsset {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'image' | 'video' | 'other';
  size: string;
  url: string;
  projectId: string;
  uploadDate: string;
  description: string;
}

const projects: Project[] = [
  { id: '1', name: 'The Obsidian Groves' },
  { id: '2', name: 'Alabaster Heights' },
  { id: '3', name: 'Marine Wharf' },
  { id: '4', name: 'Azure Residences' },
  { id: '5', name: 'Villa Verde' },
];

const initialUnits: Unit[] = [
  { id:'1', projectId:'1', projectName:'The Obsidian Groves', block:'Block A', unitNumber:'12-04', houseType:'Penthouse Sky Suite', floorArea:2450, price:1250000, downPayment:250000, dpPercent:20, status:'Available', bedrooms:4, bathrooms:3, floor:12, facing:'North-East', notes:'Premium corner unit with private terrace' },
  { id:'2', projectId:'1', projectName:'The Obsidian Groves', block:'Block B', unitNumber:'08-11', houseType:'Terrace Loft', floorArea:1120, price:640000, downPayment:96000, dpPercent:15, status:'Booked', bedrooms:2, bathrooms:2, floor:8, facing:'South', notes:'Recently renovated', bookedBy:'John Smith', bookedDate:'2024-01-15' },
  { id:'3', projectId:'2', projectName:'Alabaster Heights', block:'Block A', unitNumber:'03-02', houseType:'Garden Duplex', floorArea:1850, price:985000, downPayment:197000, dpPercent:20, status:'Sold', bedrooms:3, bathrooms:2, floor:3, facing:'West', notes:'Ground floor with private garden', soldDate:'2024-01-10' },
  { id:'4', projectId:'3', projectName:'Marine Wharf', block:'Block C', unitNumber:'15-09', houseType:'Grand Panorama', floorArea:3100, price:2100000, downPayment:630000, dpPercent:30, status:'Available', bedrooms:5, bathrooms:4, floor:15, facing:'Ocean View', notes:'Top floor unit with 360° views' },
  { id:'5', projectId:'4', projectName:'Azure Residences', block:'Block B', unitNumber:'02-14', houseType:'Cozy Corner 2BR', floorArea:850, price:420000, downPayment:42000, dpPercent:10, status:'Available', bedrooms:2, bathrooms:1, floor:2, facing:'East', notes:'Ideal for young couples' },
  { id:'6', projectId:'2', projectName:'Alabaster Heights', block:'Block A', unitNumber:'10-05', houseType:'Executive Suite', floorArea:1650, price:890000, downPayment:178000, dpPercent:20, status:'Booked', bedrooms:3, bathrooms:2, floor:10, facing:'North', notes:'Corner unit with extra storage', bookedBy:'Sarah Johnson', bookedDate:'2024-02-01' },
  { id:'7', projectId:'5', projectName:'Villa Verde', block:'Villa', unitNumber:'V-08', houseType:'Mediterranean Villa', floorArea:4200, price:1850000, downPayment:462500, dpPercent:25, status:'Sold', bedrooms:6, bathrooms:5, floor:1, facing:'South-West', notes:'With private pool and olive garden', soldDate:'2023-12-20' },
  { id:'8', projectId:'4', projectName:'Azure Residences', block:'Block A', unitNumber:'25-01', houseType:'Sky Penthouse', floorArea:3800, price:2800000, downPayment:840000, dpPercent:30, status:'Available', bedrooms:4, bathrooms:4, floor:25, facing:'All', notes:'Full floor penthouse with helipad access' },
];

const initialAssets: DigitalAsset[] = [
  { id:'1', name:'Project_Brochure_V4.pdf', type:'pdf', size:'12.4 MB', url:'#', projectId:'1', uploadDate:'2024-01-15', description:'Official brochure for The Obsidian Groves' },
  { id:'2', name:'Full_Price_List_2024.xlsx', type:'excel', size:'1.1 MB', url:'#', projectId:'', uploadDate:'2024-02-01', description:'Master price list for all projects Q1 2024' },
  { id:'3', name:'Exterior_Rendering_01.jpg', type:'image', size:'4.8 MB', url:'https://lh3.googleusercontent.com/aida-public/AB6AXuAdGvcGyHEE-LUP4DfGqkNEhs9V8Ic9GfirSigkXWEz3rwRq3DcP4-lFe8zUQn5t8N2Q029LnxRUfYKABAykDzFCqhGNgNogH1GqTxeaKJUfnzWJWP0z7mmayhdRV75H9KLfQtIEy4KUek-wDOl2EBet-waSFsGv7DRrLma7eh4qcXdFC6HtWB9NOa2HVulNNreDfX1KJcPXpkmXwYnpNe3cSI1b-Qx8KqsYxTy9ebYevodOdQJ6J287xM0WsTs_2JMr_rfYvNCU-QJ', projectId:'2', uploadDate:'2024-01-20', description:'Exterior rendering of Alabaster Heights' },
  { id:'4', name:'Lobby_Interior.jpg', type:'image', size:'3.2 MB', url:'https://lh3.googleusercontent.com/aida-public/AB6AXuAnNW87i2cjOvgMaAiY0lWef8zsOLY42i_5_e4hXGBhddF2e0WhJwUxitsEJZOU-ncOQN4MgeKuI4zKPEOGlQgJQiNoi9UcOqc_ZsUTRAmuZgSKLrKaABW0aEt0QjUipmn6HUhSi3LvdvOt6gMS02h7iVWqanSHoXjJQRg1iNPAjf9vblkaqHi5otPFfuWr5pyGzhsjw9bIEuyWUhE6dBhLcoVjOCRhc5hFO2xzTSmaBqrxNcJCxtuOTba55m19DZ1pk6uZY_7dYVJX', projectId:'1', uploadDate:'2024-02-10', description:'Lobby interior design concept' },
];

const emptyForm = {
  projectId:'', block:'', unitNumber:'', houseType:'', floorArea:0, price:0,
  downPayment:0, dpPercent:20, status:'Available' as Unit['status'],
  bedrooms:1, bathrooms:1, floor:1, facing:'', notes:'',
};

const emptyAssetForm = {
  name:'', type:'pdf' as DigitalAsset['type'], size:'', url:'', projectId:'', description:'',
};

export default function InventoryPage() {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [assets, setAssets] = useState<DigitalAsset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [showToast, setShowToast] = useState<{message:string;type:'success'|'error'|'info'}|null>(null);

  // Unit modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit|null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState({status:'Available' as Unit['status'], bookedBy:'', notes:''});

  // Asset modals
  const [showAssetAddModal, setShowAssetAddModal] = useState(false);
  const [showAssetEditModal, setShowAssetEditModal] = useState(false);
  const [showAssetDeleteModal, setShowAssetDeleteModal] = useState(false);
  const [showAssetPreviewModal, setShowAssetPreviewModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset|null>(null);
  const [assetForm, setAssetForm] = useState(emptyAssetForm);
  const [assetErrors, setAssetErrors] = useState<Record<string,string>>({});

  const modalRef = useRef<HTMLDivElement>(null);

  const formatPrice = (p:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(p);
  const notify = (message:string, type:'success'|'error'|'info'='info') => { setShowToast({message,type}); setTimeout(()=>setShowToast(null),3000); };

  // Filtered
  const filteredUnits = units.filter(u => {
    const s = searchQuery ? u.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) || u.houseType.toLowerCase().includes(searchQuery.toLowerCase()) || u.block.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const p = filterProject ? u.projectId === filterProject : true;
    const st = filterStatus ? u.status === filterStatus : true;
    const pr = filterPrice ? filterPrice==='0-500k'?u.price<500000 : filterPrice==='500k-1m'?u.price>=500000&&u.price<1000000 : filterPrice==='1m+'?u.price>=1000000 : true : true;
    return s && p && st && pr;
  });

  const unitsForStats = filterProject ? units.filter(u=>u.projectId===filterProject) : units;
  const totalUnits = unitsForStats.length;
  const availableUnits = unitsForStats.filter(u=>u.status==='Available').length;
  const bookedUnits = unitsForStats.filter(u=>u.status==='Booked').length;
  const soldUnits = unitsForStats.filter(u=>u.status==='Sold').length;
  const totalValue = unitsForStats.reduce((s,u)=>s+u.price,0);
  const selectedProjectName = filterProject ? projects.find(p=>p.id===filterProject)?.name : 'Semua Project';

  // Escape key
  useEffect(() => {
    const h = (e:KeyboardEvent) => { if(e.key==='Escape'){ setShowAddModal(false); setShowEditModal(false); setShowDeleteModal(false); setShowDetailModal(false); setShowStatusModal(false); setShowAssetAddModal(false); setShowAssetEditModal(false); setShowAssetDeleteModal(false); setShowAssetPreviewModal(false); }};
    window.addEventListener('keydown',h);
    return ()=>window.removeEventListener('keydown',h);
  },[]);

  useEffect(()=>{ if(showAddModal){ setFormData(emptyForm); setFormErrors({}); }},[showAddModal]);
  useEffect(()=>{
    if(showEditModal && selectedUnit){
      setFormData({ projectId:selectedUnit.projectId, block:selectedUnit.block, unitNumber:selectedUnit.unitNumber, houseType:selectedUnit.houseType, floorArea:selectedUnit.floorArea, price:selectedUnit.price, downPayment:selectedUnit.downPayment, dpPercent:selectedUnit.dpPercent, status:selectedUnit.status, bedrooms:selectedUnit.bedrooms, bathrooms:selectedUnit.bathrooms, floor:selectedUnit.floor, facing:selectedUnit.facing, notes:selectedUnit.notes });
      setFormErrors({});
    }
  },[showEditModal, selectedUnit]);
  useEffect(()=>{ if(showAssetAddModal){ setAssetForm(emptyAssetForm); setAssetErrors({}); }},[showAssetAddModal]);
  useEffect(()=>{
    if(showAssetEditModal && selectedAsset){
      setAssetForm({ name:selectedAsset.name, type:selectedAsset.type, size:selectedAsset.size, url:selectedAsset.url, projectId:selectedAsset.projectId, description:selectedAsset.description });
      setAssetErrors({});
    }
  },[showAssetEditModal, selectedAsset]);

  // Auto-calc DP
  const updatePrice = (price:number) => {
    const dp = Math.round(price * formData.dpPercent / 100);
    setFormData({...formData, price, downPayment: dp});
  };
  const updateDpPercent = (pct:number) => {
    const dp = Math.round(formData.price * pct / 100);
    setFormData({...formData, dpPercent: pct, downPayment: dp});
  };
  const updateDp = (dp:number) => {
    const pct = formData.price > 0 ? Math.round((dp / formData.price) * 100) : 0;
    setFormData({...formData, downPayment: dp, dpPercent: pct});
  };

  // Validations
  const validateForm = () => {
    const e:Record<string,string> = {};
    if(!formData.projectId) e.projectId='Project wajib dipilih';
    if(!formData.block.trim()) e.block='Block wajib diisi';
    if(!formData.unitNumber.trim()) e.unitNumber='Nomor unit wajib diisi';
    if(!formData.houseType.trim()) e.houseType='Tipe rumah wajib diisi';
    if(!formData.floorArea||formData.floorArea<1) e.floorArea='Luas lantai minimal 1';
    if(!formData.price||formData.price<1) e.price='Harga minimal 1';
    setFormErrors(e); return Object.keys(e).length===0;
  };
  const validateAsset = () => {
    const e:Record<string,string> = {};
    if(!assetForm.name.trim()) e.name='Nama file wajib diisi';
    if(!assetForm.size.trim()) e.size='Ukuran file wajib diisi';
    setAssetErrors(e); return Object.keys(e).length===0;
  };

  // Unit CRUD
  const handleAddUnit = () => { if(!validateForm()) return; setIsSubmitting(true); setTimeout(()=>{
    const proj=projects.find(p=>p.id===formData.projectId);
    setUnits([{id:String(Date.now()), ...formData, projectName:proj?.name||''}, ...units]);
    setShowAddModal(false); setIsSubmitting(false); notify(`Unit "${formData.unitNumber}" berhasil ditambahkan!`,'success');
  },800);};

  const handleEditUnit = () => { if(!validateForm()||!selectedUnit) return; setIsSubmitting(true); setTimeout(()=>{
    const proj=projects.find(p=>p.id===formData.projectId);
    setUnits(units.map(u=>u.id===selectedUnit.id?{...u,...formData, projectName:proj?.name||''}:u));
    setShowEditModal(false); setIsSubmitting(false); notify(`Unit "${formData.unitNumber}" berhasil diperbarui!`,'success');
  },800);};

  const handleDeleteUnit = () => { if(!selectedUnit) return; setIsSubmitting(true); setTimeout(()=>{
    setUnits(units.filter(u=>u.id!==selectedUnit.id));
    setShowDeleteModal(false); setIsSubmitting(false); notify(`Unit "${selectedUnit.unitNumber}" berhasil dihapus!`,'success'); setSelectedUnit(null);
  },600);};

  const handleStatusChange = () => { if(!selectedUnit) return; setIsSubmitting(true); setTimeout(()=>{
    setUnits(units.map(u=>u.id===selectedUnit.id?{...u, status:statusChangeData.status, bookedBy:statusChangeData.status==='Booked'?statusChangeData.bookedBy:undefined, bookedDate:statusChangeData.status==='Booked'?new Date().toISOString().split('T')[0]:undefined, soldDate:statusChangeData.status==='Sold'?new Date().toISOString().split('T')[0]:undefined, notes:statusChangeData.notes||u.notes}:u));
    setShowStatusModal(false); setIsSubmitting(false); notify(`Status unit "${selectedUnit.unitNumber}" berhasil diubah!`,'success');
  },600);};

  // Asset CRUD
  const handleAddAsset = () => { if(!validateAsset()) return; setIsSubmitting(true); setTimeout(()=>{
    setAssets([{id:String(Date.now()), ...assetForm, uploadDate:new Date().toISOString().split('T')[0]}, ...assets]);
    setShowAssetAddModal(false); setIsSubmitting(false); notify(`Asset "${assetForm.name}" berhasil ditambahkan!`,'success');
  },800);};

  const handleEditAsset = () => { if(!validateAsset()||!selectedAsset) return; setIsSubmitting(true); setTimeout(()=>{
    setAssets(assets.map(a=>a.id===selectedAsset.id?{...a,...assetForm}:a));
    setShowAssetEditModal(false); setIsSubmitting(false); notify(`Asset "${assetForm.name}" berhasil diperbarui!`,'success');
  },800);};

  const handleDeleteAsset = () => { if(!selectedAsset) return; setIsSubmitting(true); setTimeout(()=>{
    setAssets(assets.filter(a=>a.id!==selectedAsset.id));
    setShowAssetDeleteModal(false); setIsSubmitting(false); notify(`Asset "${selectedAsset.name}" berhasil dihapus!`,'success'); setSelectedAsset(null);
  },600);};

  // Helpers
  const openDetail = (u:Unit) => { setSelectedUnit(u); setShowDetailModal(true); };
  const openEdit = (u:Unit) => { setSelectedUnit(u); setShowEditModal(true); };
  const openDel = (u:Unit) => { setSelectedUnit(u); setShowDeleteModal(true); };
  const openStatus = (u:Unit) => { setSelectedUnit(u); setStatusChangeData({status:u.status,bookedBy:u.bookedBy||'',notes:''}); setShowStatusModal(true); };

  const StatusBadge = ({status}:{status:Unit['status']}) => {
    const s = { Available:'bg-[#e7f5ed] text-[#1e4620]', Booked:'bg-[#fff4e5] text-[#663c00]', Sold:'bg-[#fce8e8] text-[#7a1b1b]' };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${s[status]}`}>{status}</span>;
  };

  const ModalBackdrop = ({children,onClose,wide=false}:{children:React.ReactNode;onClose:()=>void;wide?:boolean}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={e=>{if(e.target===e.currentTarget) onClose();}}>
      <div ref={modalRef} className={`bg-white rounded-2xl shadow-2xl ${wide?'w-full max-w-4xl':'w-full max-w-2xl'} max-h-[90vh] overflow-y-auto animate-fade-in-up my-8`} onClick={e=>e.stopPropagation()}>{children}</div>
    </div>
  );

  const FI = ({label,name,type='text',placeholder,value,onChange,error}:{label:string;name:string;type?:string;placeholder?:string;value:string|number;onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;error?:string}) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-4 py-3 bg-surface border rounded-lg text-sm outline-none transition-all ${error?'border-error focus:ring-2 focus:ring-error/20':'border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-primary'}`} />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );

  const FS = ({label,name,value,onChange,options}:{label:string;name:string;value:string;onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void;options:{value:string;label:string}[]}) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer">
        {options.map(o=>(<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );

  const Spinner = () => <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>;

  const assetIcon = (t:DigitalAsset['type']) => t==='pdf'?'picture_as_pdf':t==='excel'?'table_chart':t==='image'?'image':t==='video'?'videocam':'insert_drive_file';
  const assetColor = (t:DigitalAsset['type']) => t==='pdf'?'text-error bg-error-container/20':t==='excel'?'text-tertiary bg-tertiary-fixed-dim/30':t==='image'?'text-primary bg-primary-fixed/30':'text-secondary bg-secondary-fixed/30';

  // Unit form JSX (shared between add/edit)
  const UnitFormFields = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <FS label="Project *" name="projectId" value={formData.projectId} onChange={e=>setFormData({...formData,projectId:e.target.value})} options={[{value:'',label:'Pilih Project'},...projects.map(p=>({value:p.id,label:p.name}))]} />
        <FI label="Block *" name="block" placeholder="e.g. Block A" value={formData.block} onChange={e=>setFormData({...formData,block:e.target.value})} error={formErrors.block} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <FI label="Unit Number *" name="unitNumber" placeholder="e.g. 15-05" value={formData.unitNumber} onChange={e=>setFormData({...formData,unitNumber:e.target.value})} error={formErrors.unitNumber} />
        <FI label="House Type *" name="houseType" placeholder="e.g. Deluxe Terrace" value={formData.houseType} onChange={e=>setFormData({...formData,houseType:e.target.value})} error={formErrors.houseType} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <FI label="Area (sqft) *" name="floorArea" type="number" placeholder="0" value={formData.floorArea} onChange={e=>setFormData({...formData,floorArea:parseInt(e.target.value)||0})} error={formErrors.floorArea} />
        <FI label="Harga (USD) *" name="price" type="number" placeholder="0" value={formData.price} onChange={e=>updatePrice(parseInt(e.target.value)||0)} error={formErrors.price} />
        <FS label="Status" name="status" value={formData.status} onChange={e=>setFormData({...formData,status:e.target.value as Unit['status']})} options={[{value:'Available',label:'Available'},{value:'Booked',label:'Booked'},{value:'Sold',label:'Sold'}]} />
      </div>
      {/* DP Section */}
      <div className="bg-primary-fixed/20 rounded-xl p-5 border border-primary/10">
        <p className="font-label text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
          <Icon name="payments" className="text-base" /> Down Payment (DP)
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">DP %</label>
            <div className="flex items-center gap-2">
              <input type="range" min="5" max="50" step="5" value={formData.dpPercent} onChange={e=>updateDpPercent(parseInt(e.target.value))} className="flex-1 accent-primary cursor-pointer" />
              <span className="text-sm font-bold text-primary w-12 text-right">{formData.dpPercent}%</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nominal DP (USD)</label>
            <input type="number" value={formData.downPayment} onChange={e=>updateDp(parseInt(e.target.value)||0)} className="w-full px-4 py-3 bg-white border border-primary/20 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary font-bold text-primary" />
          </div>
          <div className="space-y-1.5">
            <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Sisa Pembayaran</label>
            <p className="px-4 py-3 bg-surface-container-low rounded-lg text-sm font-bold text-on-surface">{formatPrice(Math.max(formData.price - formData.downPayment, 0))}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <FI label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={e=>setFormData({...formData,bedrooms:parseInt(e.target.value)||1})} />
        <FI label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={e=>setFormData({...formData,bathrooms:parseInt(e.target.value)||1})} />
        <FI label="Floor" name="floor" type="number" value={formData.floor} onChange={e=>setFormData({...formData,floor:parseInt(e.target.value)||1})} />
        <FI label="Facing" name="facing" placeholder="North" value={formData.facing} onChange={e=>setFormData({...formData,facing:e.target.value})} />
      </div>
      <div>
        <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Internal Notes</label>
        <textarea value={formData.notes} onChange={e=>setFormData({...formData,notes:e.target.value})} placeholder="Additional specifications..." rows={2} className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
      </div>
    </>
  );

  return (
    <div className="p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">Property Inventory</h1>
          <p className="text-on-surface-variant font-body">Kelola unit properti individual, ketersediaan real-time, dan spesifikasi listing.</p>
        </div>
        <button onClick={()=>setShowAddModal(true)} className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:opacity-90 transition-all active:scale-95 cursor-pointer">
          <Icon name="add" /> New Listing
        </button>
      </div>

      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-label text-sm text-on-surface-variant">Statistik untuk:</span>
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${filterProject?'bg-primary-fixed text-on-primary-fixed-variant':'bg-surface-container-high text-on-surface'}`}>{selectedProjectName}</span>
          {filterProject && <button onClick={()=>setFilterProject('')} className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1"><Icon name="close" className="text-sm"/>Lihat Semua</button>}
        </div>
        <p className="text-sm text-on-surface-variant">Total Nilai: <span className="font-bold text-primary">{formatPrice(totalValue)}</span></p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl space-y-2 border border-outline-variant/10 hover:shadow-md transition-shadow">
          <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant opacity-70">Total Units</span>
          <p className="text-3xl font-headline font-bold">{totalUnits}</p>
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-on-surface rounded-full" style={{width:'100%'}}/></div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl space-y-2 border border-outline-variant/10 hover:shadow-md transition-shadow">
          <span className="font-label text-xs uppercase tracking-wider text-tertiary">Available</span>
          <p className="text-3xl font-headline font-bold text-tertiary">{availableUnits}</p>
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-tertiary rounded-full transition-all duration-500" style={{width:totalUnits>0?`${(availableUnits/totalUnits)*100}%`:'0%'}}/></div>
          <p className="text-[10px] text-on-surface-variant">{totalUnits>0?((availableUnits/totalUnits)*100).toFixed(1):0}% dari total</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl space-y-2 border border-outline-variant/10 hover:shadow-md transition-shadow">
          <span className="font-label text-xs uppercase tracking-wider text-primary">Booked</span>
          <p className="text-3xl font-headline font-bold text-primary">{bookedUnits}</p>
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-500" style={{width:totalUnits>0?`${(bookedUnits/totalUnits)*100}%`:'0%'}}/></div>
          <p className="text-[10px] text-on-surface-variant">{totalUnits>0?((bookedUnits/totalUnits)*100).toFixed(1):0}% dari total</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl space-y-2 border border-outline-variant/10 hover:shadow-md transition-shadow">
          <span className="font-label text-xs uppercase tracking-wider text-on-error-container">Sold</span>
          <p className="text-3xl font-headline font-bold text-on-error-container">{soldUnits}</p>
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-error rounded-full transition-all duration-500" style={{width:totalUnits>0?`${(soldUnits/totalUnits)*100}%`:'0%'}}/></div>
          <p className="text-[10px] text-on-surface-variant">{totalUnits>0?((soldUnits/totalUnits)*100).toFixed(1):0}% dari total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
        <div className="relative max-w-xs flex-1">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Cari unit..." className="w-full bg-surface-container-low rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
        </div>
        <select value={filterProject} onChange={e=>setFilterProject(e.target.value)} className="bg-surface-container-low border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary cursor-pointer">
          <option value="">Semua Project</option>
          {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="bg-surface-container-low border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary cursor-pointer">
          <option value="">Semua Status</option>
          <option value="Available">Available</option>
          <option value="Booked">Booked</option>
          <option value="Sold">Sold</option>
        </select>
        <select value={filterPrice} onChange={e=>setFilterPrice(e.target.value)} className="bg-surface-container-low border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary cursor-pointer">
          <option value="">Semua Harga</option>
          <option value="0-500k">$0 - $500k</option>
          <option value="500k-1m">$500k - $1M</option>
          <option value="1m+">$1M+</option>
        </select>
        <button onClick={()=>{setSearchQuery('');setFilterProject('');setFilterStatus('');setFilterPrice('');}} className="text-primary font-semibold text-sm px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer flex items-center gap-1">
          <Icon name="filter_list_off" className="text-lg"/>Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-high/50 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold border-b border-outline-variant/20">
              <tr>
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Block</th>
                <th className="px-5 py-4">Unit</th>
                <th className="px-5 py-4">Tipe</th>
                <th className="px-5 py-4 text-right">Luas</th>
                <th className="px-5 py-4 text-right">Harga</th>
                <th className="px-5 py-4 text-right">DP</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredUnits.map(u=>(
                <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-5 py-5 text-xs text-on-surface-variant max-w-[120px] truncate">{u.projectName}</td>
                  <td className="px-5 py-5 font-bold text-on-surface">{u.block}</td>
                  <td className="px-5 py-5 font-medium">{u.unitNumber}</td>
                  <td className="px-5 py-5 italic font-headline text-sm">{u.houseType}</td>
                  <td className="px-5 py-5 text-right font-label text-sm">{u.floorArea.toLocaleString()} sqft</td>
                  <td className="px-5 py-5 text-right font-bold text-primary">{formatPrice(u.price)}</td>
                  <td className="px-5 py-5 text-right">
                    <div className="text-right">
                      <p className="text-xs font-bold text-on-surface">{formatPrice(u.downPayment)}</p>
                      <p className="text-[10px] text-on-surface-variant">{u.dpPercent}%</p>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <button onClick={()=>openStatus(u)} className="cursor-pointer hover:scale-105 transition-transform"><StatusBadge status={u.status}/></button>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>openDetail(u)} className="p-1.5 hover:bg-primary-fixed rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="Detail"><Icon name="visibility" className="text-lg"/></button>
                      <button onClick={()=>openEdit(u)} className="p-1.5 hover:bg-primary-fixed rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="Edit"><Icon name="edit_note" className="text-lg"/></button>
                      <button onClick={()=>openDel(u)} className="p-1.5 hover:bg-error-container rounded-lg text-on-surface-variant hover:text-error transition-all cursor-pointer" title="Hapus"><Icon name="delete" className="text-lg"/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUnits.length===0 && <tr><td colSpan={9} className="px-6 py-16 text-center text-on-surface-variant">Tidak ada unit yang cocok dengan filter Anda.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-lowest flex justify-between items-center text-xs text-on-surface-variant font-label uppercase tracking-widest border-t border-outline-variant/10">
          <span>Showing 1-{filteredUnits.length} of {units.length} Units</span>
        </div>
      </div>

      {/* Digital Assets */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-headline text-2xl font-bold">Digital Assets Library</h2>
          <button onClick={()=>setShowAssetAddModal(true)} className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline cursor-pointer"><Icon name="upload_file"/>Upload New Asset</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {assets.map(a=>(
            <div key={a.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
              {a.type==='image' && a.url && a.url!=='#' ? (
                <div className="h-32 w-full bg-surface-container-high overflow-hidden cursor-pointer" onClick={()=>{setSelectedAsset(a);setShowAssetPreviewModal(true);}}>
                  <img src={a.url} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                </div>
              ) : (
                <div className="p-5 pb-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${assetColor(a.type)}`}>
                    <Icon name={assetIcon(a.type)} className="text-2xl"/>
                  </div>
                </div>
              )}
              <div className="p-5 pt-3">
                <h3 className="font-bold text-on-surface truncate text-sm">{a.name}</h3>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">{a.type.toUpperCase()} • {a.size}</p>
                {a.description && <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{a.description}</p>}
                <p className="text-[10px] text-outline mt-1">Uploaded: {a.uploadDate}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={()=>{setSelectedAsset(a);setShowAssetPreviewModal(true);}} className="flex-1 bg-surface-container-low py-2 rounded-lg text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer">Preview</button>
                  <button onClick={()=>{setSelectedAsset(a);setShowAssetEditModal(true);}} className="p-2 text-primary hover:bg-primary/5 rounded-lg cursor-pointer" title="Edit"><Icon name="edit" className="text-lg"/></button>
                  <button onClick={()=>{setSelectedAsset(a);setShowAssetDeleteModal(true);}} className="p-2 text-error hover:bg-error/5 rounded-lg cursor-pointer" title="Hapus"><Icon name="delete" className="text-lg"/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="pt-10 pb-4 text-center"><p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant opacity-35">© Agent Properti • Manajemen Sales Properti v2.4.0</p></footer>

      {/* ========== UNIT MODALS ========== */}

      {/* Add Unit */}
      {showAddModal && (
        <ModalBackdrop onClose={()=>setShowAddModal(false)}>
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <div><h2 className="font-headline text-2xl font-bold">Register New Unit</h2><p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Inventory Management Portal</p></div>
            <button onClick={()=>setShowAddModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"><Icon name="close"/></button>
          </div>
          <form className="p-8 space-y-6" onSubmit={e=>{e.preventDefault();handleAddUnit();}}>
            <UnitFormFields />
            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
              <button type="button" onClick={()=>setShowAddModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface transition-colors cursor-pointer">Discard</button>
              <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><Spinner/>Saving...</>:'Confirm and List Unit'}
              </button>
            </div>
          </form>
        </ModalBackdrop>
      )}

      {/* Edit Unit */}
      {showEditModal && selectedUnit && (
        <ModalBackdrop onClose={()=>setShowEditModal(false)}>
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <div><h2 className="font-headline text-2xl font-bold">Edit Unit</h2><p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Unit: {selectedUnit.unitNumber}</p></div>
            <button onClick={()=>setShowEditModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"><Icon name="close"/></button>
          </div>
          <form className="p-8 space-y-6" onSubmit={e=>{e.preventDefault();handleEditUnit();}}>
            <UnitFormFields />
            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
              <button type="button" onClick={()=>setShowEditModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface transition-colors cursor-pointer">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><Spinner/>Saving...</>:<><Icon name="save"/>Save Changes</>}
              </button>
            </div>
          </form>
        </ModalBackdrop>
      )}

      {/* Delete Unit */}
      {showDeleteModal && selectedUnit && (
        <ModalBackdrop onClose={()=>setShowDeleteModal(false)}>
          <div className="p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-error-container flex items-center justify-center mb-6"><Icon name="delete_forever" className="text-3xl text-error"/></div>
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Hapus Unit?</h3>
              <p className="text-on-surface-variant">Anda akan menghapus unit <span className="font-semibold text-on-surface">"{selectedUnit.unitNumber}"</span> dari <span className="font-semibold">{selectedUnit.projectName}</span>.</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex justify-between items-center">
              <div><p className="font-bold text-on-surface">{selectedUnit.houseType}</p><p className="text-xs text-on-surface-variant">{selectedUnit.block} • {selectedUnit.floorArea.toLocaleString()} sqft</p></div>
              <div className="text-right"><p className="font-bold text-primary">{formatPrice(selectedUnit.price)}</p><p className="text-xs text-on-surface-variant">DP: {formatPrice(selectedUnit.downPayment)} ({selectedUnit.dpPercent}%)</p></div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={()=>setShowDeleteModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Batal</button>
              <button onClick={handleDeleteUnit} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-error text-on-error text-sm font-semibold hover:bg-error/90 transition-all cursor-pointer disabled:opacity-70 flex items-center gap-2">
                {isSubmitting?<><Spinner/>Menghapus...</>:<><Icon name="delete"/>Ya, Hapus Unit</>}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Detail Unit */}
      {showDetailModal && selectedUnit && (
        <ModalBackdrop onClose={()=>setShowDetailModal(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2"><StatusBadge status={selectedUnit.status}/><span className="text-xs text-on-surface-variant font-label">{selectedUnit.projectName}</span></div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">{selectedUnit.houseType}</h3>
                <p className="text-on-surface-variant">{selectedUnit.block} • Unit {selectedUnit.unitNumber}</p>
              </div>
              <button onClick={()=>setShowDetailModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Spesifikasi</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-on-surface-variant">Luas</p><p className="font-bold">{selectedUnit.floorArea.toLocaleString()} sqft</p></div>
                    <div><p className="text-xs text-on-surface-variant">Lantai</p><p className="font-bold">{selectedUnit.floor}</p></div>
                    <div><p className="text-xs text-on-surface-variant">Kamar Tidur</p><p className="font-bold">{selectedUnit.bedrooms}</p></div>
                    <div><p className="text-xs text-on-surface-variant">Kamar Mandi</p><p className="font-bold">{selectedUnit.bathrooms}</p></div>
                    <div><p className="text-xs text-on-surface-variant">Hadap</p><p className="font-bold">{selectedUnit.facing||'-'}</p></div>
                  </div>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Catatan Internal</h4>
                  <p className="text-sm text-on-surface">{selectedUnit.notes||'Tidak ada catatan.'}</p>
                </div>
              </div>
              <div className="space-y-6">
                {/* Pricing & DP */}
                <div className="bg-primary-fixed/20 rounded-xl p-6 border border-primary/10">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2"><Icon name="payments" className="text-base"/>Harga & Down Payment</h4>
                  <p className="text-3xl font-headline font-bold text-primary">{formatPrice(selectedUnit.price)}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{formatPrice(Math.round(selectedUnit.price/selectedUnit.floorArea))}/sqft</p>
                  <div className="mt-4 pt-4 border-t border-primary/10 grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-lg font-headline font-bold text-primary">{selectedUnit.dpPercent}%</p>
                      <p className="text-[10px] text-on-surface-variant font-label uppercase">DP Persen</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-lg font-headline font-bold text-on-surface">{formatPrice(selectedUnit.downPayment)}</p>
                      <p className="text-[10px] text-on-surface-variant font-label uppercase">Nominal DP</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-lg font-headline font-bold text-on-surface">{formatPrice(selectedUnit.price-selectedUnit.downPayment)}</p>
                      <p className="text-[10px] text-on-surface-variant font-label uppercase">Sisa</p>
                    </div>
                  </div>
                </div>
                {selectedUnit.status==='Booked' && selectedUnit.bookedBy && (
                  <div className="bg-[#fff4e5] rounded-xl p-6"><h4 className="font-label text-xs font-bold uppercase tracking-wider text-[#663c00] mb-4">Booking Info</h4><p className="font-bold text-on-surface">{selectedUnit.bookedBy}</p><p className="text-xs text-on-surface-variant">Booked: {selectedUnit.bookedDate}</p></div>
                )}
                {selectedUnit.status==='Sold' && selectedUnit.soldDate && (
                  <div className="bg-[#fce8e8] rounded-xl p-6"><h4 className="font-label text-xs font-bold uppercase tracking-wider text-[#7a1b1b] mb-4">Sale Info</h4><p className="text-xs text-on-surface-variant">Sold: {selectedUnit.soldDate}</p></div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button onClick={()=>openStatus(selectedUnit)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2"><Icon name="swap_horiz"/>Ubah Status</button>
              <button onClick={()=>{setShowDetailModal(false);openEdit(selectedUnit);}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2"><Icon name="edit_note"/>Edit</button>
              <button onClick={()=>setShowDetailModal(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer">Tutup</button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Change Status */}
      {showStatusModal && selectedUnit && (
        <ModalBackdrop onClose={()=>setShowStatusModal(false)}>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div><h3 className="font-headline text-2xl font-bold text-on-surface">Ubah Status Unit</h3><p className="text-sm text-on-surface-variant">{selectedUnit.projectName} • {selectedUnit.unitNumber}</p></div>
              <button onClick={()=>setShowStatusModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex items-center justify-between">
              <div><p className="font-bold text-on-surface">{selectedUnit.houseType}</p><p className="text-xs text-on-surface-variant">{selectedUnit.block} • {formatPrice(selectedUnit.price)} • DP: {formatPrice(selectedUnit.downPayment)}</p></div>
              <StatusBadge status={selectedUnit.status}/>
            </div>
            <div className="space-y-4">
              <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Status Baru</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Available','Booked','Sold'] as const).map(s=>(
                    <button key={s} type="button" onClick={()=>setStatusChangeData({...statusChangeData,status:s})} className={`py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${statusChangeData.status===s ? s==='Available'?'bg-[#e7f5ed] text-[#1e4620] ring-2 ring-[#1e4620]' : s==='Booked'?'bg-[#fff4e5] text-[#663c00] ring-2 ring-[#663c00]' : 'bg-[#fce8e8] text-[#7a1b1b] ring-2 ring-[#7a1b1b]' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}>{s}</button>
                  ))}
                </div>
              </div>
              {statusChangeData.status==='Booked' && <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Nama Pembooking</label><input type="text" value={statusChangeData.bookedBy} onChange={e=>setStatusChangeData({...statusChangeData,bookedBy:e.target.value})} placeholder="Nama lengkap" className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"/></div>}
              <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Catatan (Opsional)</label><textarea value={statusChangeData.notes} onChange={e=>setStatusChangeData({...statusChangeData,notes:e.target.value})} placeholder="Catatan tambahan..." rows={2} className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/></div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button onClick={()=>setShowStatusModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer">Batal</button>
              <button onClick={handleStatusChange} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer disabled:opacity-70 flex items-center gap-2">
                {isSubmitting?<><Spinner/>Menyimpan...</>:<><Icon name="check"/>Simpan Perubahan</>}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* ========== ASSET MODALS ========== */}

      {/* Add Asset */}
      {showAssetAddModal && (
        <ModalBackdrop onClose={()=>setShowAssetAddModal(false)}>
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <div><h2 className="font-headline text-2xl font-bold">Upload New Asset</h2><p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Digital Assets Library</p></div>
            <button onClick={()=>setShowAssetAddModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"><Icon name="close"/></button>
          </div>
          <form className="p-8 space-y-5" onSubmit={e=>{e.preventDefault();handleAddAsset();}}>
            <FI label="Nama File *" name="name" placeholder="e.g. Site_Plan_v2.pdf" value={assetForm.name} onChange={e=>setAssetForm({...assetForm,name:e.target.value})} error={assetErrors.name} />
            <div className="grid grid-cols-3 gap-4">
              <FS label="Tipe File" name="type" value={assetForm.type} onChange={e=>setAssetForm({...assetForm,type:e.target.value as DigitalAsset['type']})} options={[{value:'pdf',label:'PDF'},{value:'excel',label:'Excel'},{value:'image',label:'Image'},{value:'video',label:'Video'},{value:'other',label:'Other'}]} />
              <FI label="Ukuran *" name="size" placeholder="e.g. 5.2 MB" value={assetForm.size} onChange={e=>setAssetForm({...assetForm,size:e.target.value})} error={assetErrors.size} />
              <FS label="Project" name="projectId" value={assetForm.projectId} onChange={e=>setAssetForm({...assetForm,projectId:e.target.value})} options={[{value:'',label:'Semua Project'},...projects.map(p=>({value:p.id,label:p.name}))]} />
            </div>
            <FI label="URL File" name="url" placeholder="https://..." value={assetForm.url} onChange={e=>setAssetForm({...assetForm,url:e.target.value})} />
            {/* Upload area */}
            <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer" onClick={()=>notify('Fitur upload file dari perangkat akan terhubung ke storage server.','info')}>
              <Icon name="cloud_upload" className="text-4xl text-outline mb-3" />
              <p className="text-sm text-on-surface font-medium">Klik untuk memilih file atau drag & drop</p>
              <p className="text-xs text-on-surface-variant mt-1">Mendukung PDF, Excel, Image, Video (Max 50MB)</p>
            </div>
            <div>
              <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Deskripsi</label>
              <textarea value={assetForm.description} onChange={e=>setAssetForm({...assetForm,description:e.target.value})} placeholder="Deskripsi asset..." rows={2} className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/>
            </div>
            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
              <button type="button" onClick={()=>setShowAssetAddModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface transition-colors cursor-pointer">Batal</button>
              <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><Spinner/>Uploading...</>:<><Icon name="upload_file"/>Upload Asset</>}
              </button>
            </div>
          </form>
        </ModalBackdrop>
      )}

      {/* Edit Asset */}
      {showAssetEditModal && selectedAsset && (
        <ModalBackdrop onClose={()=>setShowAssetEditModal(false)}>
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <div><h2 className="font-headline text-2xl font-bold">Edit Asset</h2><p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">{selectedAsset.name}</p></div>
            <button onClick={()=>setShowAssetEditModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"><Icon name="close"/></button>
          </div>
          <form className="p-8 space-y-5" onSubmit={e=>{e.preventDefault();handleEditAsset();}}>
            <FI label="Nama File *" name="name" value={assetForm.name} onChange={e=>setAssetForm({...assetForm,name:e.target.value})} error={assetErrors.name} />
            <div className="grid grid-cols-3 gap-4">
              <FS label="Tipe File" name="type" value={assetForm.type} onChange={e=>setAssetForm({...assetForm,type:e.target.value as DigitalAsset['type']})} options={[{value:'pdf',label:'PDF'},{value:'excel',label:'Excel'},{value:'image',label:'Image'},{value:'video',label:'Video'},{value:'other',label:'Other'}]} />
              <FI label="Ukuran *" name="size" value={assetForm.size} onChange={e=>setAssetForm({...assetForm,size:e.target.value})} error={assetErrors.size} />
              <FS label="Project" name="projectId" value={assetForm.projectId} onChange={e=>setAssetForm({...assetForm,projectId:e.target.value})} options={[{value:'',label:'Semua Project'},...projects.map(p=>({value:p.id,label:p.name}))]} />
            </div>
            <FI label="URL File" name="url" value={assetForm.url} onChange={e=>setAssetForm({...assetForm,url:e.target.value})} />
            <div>
              <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Deskripsi</label>
              <textarea value={assetForm.description} onChange={e=>setAssetForm({...assetForm,description:e.target.value})} rows={2} className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/>
            </div>
            <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
              <button type="button" onClick={()=>setShowAssetEditModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-semibold rounded-xl hover:bg-surface transition-colors cursor-pointer">Batal</button>
              <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting?<><Spinner/>Saving...</>:<><Icon name="save"/>Save Changes</>}
              </button>
            </div>
          </form>
        </ModalBackdrop>
      )}

      {/* Delete Asset */}
      {showAssetDeleteModal && selectedAsset && (
        <ModalBackdrop onClose={()=>setShowAssetDeleteModal(false)}>
          <div className="p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-error-container flex items-center justify-center mb-6"><Icon name="delete_forever" className="text-3xl text-error"/></div>
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Hapus Asset?</h3>
              <p className="text-on-surface-variant">Anda akan menghapus <span className="font-semibold text-on-surface">"{selectedAsset.name}"</span>.</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${assetColor(selectedAsset.type)}`}><Icon name={assetIcon(selectedAsset.type)} className="text-xl"/></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-on-surface truncate">{selectedAsset.name}</p>
                <p className="text-xs text-on-surface-variant">{selectedAsset.type.toUpperCase()} • {selectedAsset.size} • {selectedAsset.uploadDate}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={()=>setShowAssetDeleteModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Batal</button>
              <button onClick={handleDeleteAsset} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-error text-on-error text-sm font-semibold hover:bg-error/90 transition-all cursor-pointer disabled:opacity-70 flex items-center gap-2">
                {isSubmitting?<><Spinner/>Menghapus...</>:<><Icon name="delete"/>Ya, Hapus Asset</>}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Preview Asset */}
      {showAssetPreviewModal && selectedAsset && (
        <ModalBackdrop onClose={()=>setShowAssetPreviewModal(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${assetColor(selectedAsset.type)}`}><Icon name={assetIcon(selectedAsset.type)} className="text-xl"/></div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface">{selectedAsset.name}</h3>
                  <p className="text-xs text-on-surface-variant">{selectedAsset.type.toUpperCase()} • {selectedAsset.size} • Uploaded: {selectedAsset.uploadDate}</p>
                </div>
              </div>
              <button onClick={()=>setShowAssetPreviewModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
            </div>

            {/* Preview Content */}
            {selectedAsset.type==='image' && selectedAsset.url && selectedAsset.url!=='#' ? (
              <div className="rounded-xl overflow-hidden border border-outline-variant/10 mb-6">
                <img src={selectedAsset.url} alt={selectedAsset.name} className="w-full max-h-[500px] object-contain bg-surface-container-low"/>
              </div>
            ) : selectedAsset.type==='pdf' ? (
              <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-12 mb-6 flex flex-col items-center gap-4">
                <Icon name="picture_as_pdf" className="text-6xl text-error"/>
                <p className="text-on-surface font-bold">{selectedAsset.name}</p>
                <p className="text-sm text-on-surface-variant">Preview PDF tersedia setelah terhubung ke storage server.</p>
                <button onClick={()=>notify('Membuka PDF viewer...','info')} className="px-6 py-3 bg-error/10 text-error font-semibold rounded-xl hover:bg-error/20 transition-colors cursor-pointer flex items-center gap-2"><Icon name="open_in_new"/>Buka PDF</button>
              </div>
            ) : selectedAsset.type==='excel' ? (
              <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-12 mb-6 flex flex-col items-center gap-4">
                <Icon name="table_chart" className="text-6xl text-tertiary"/>
                <p className="text-on-surface font-bold">{selectedAsset.name}</p>
                <p className="text-sm text-on-surface-variant">Preview spreadsheet tersedia setelah terhubung ke storage server.</p>
                <button onClick={()=>notify('Membuka Excel viewer...','info')} className="px-6 py-3 bg-tertiary/10 text-tertiary font-semibold rounded-xl hover:bg-tertiary/20 transition-colors cursor-pointer flex items-center gap-2"><Icon name="open_in_new"/>Buka Spreadsheet</button>
              </div>
            ) : (
              <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-12 mb-6 flex flex-col items-center gap-4">
                <Icon name={assetIcon(selectedAsset.type)} className="text-6xl text-outline"/>
                <p className="text-on-surface font-bold">{selectedAsset.name}</p>
                <p className="text-sm text-on-surface-variant">Preview tidak tersedia untuk tipe file ini.</p>
              </div>
            )}

            {selectedAsset.description && (
              <div className="bg-surface-container-low rounded-xl p-4 mb-6">
                <p className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-2">Deskripsi</p>
                <p className="text-sm text-on-surface">{selectedAsset.description}</p>
              </div>
            )}

            {selectedAsset.projectId && (
              <div className="bg-surface-container-low rounded-xl p-4 mb-6">
                <p className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-2">Project Terkait</p>
                <p className="text-sm text-on-surface font-semibold">{projects.find(p=>p.id===selectedAsset.projectId)?.name || '-'}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/10">
              <button onClick={()=>notify(`Download ${selectedAsset.name}...`,'info')} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2"><Icon name="download"/>Download</button>
              <button onClick={()=>{setShowAssetPreviewModal(false);setShowAssetEditModal(true);}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2"><Icon name="edit"/>Edit</button>
              <button onClick={()=>setShowAssetPreviewModal(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer">Tutup</button>
            </div>
          </div>
        </ModalBackdrop>
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
