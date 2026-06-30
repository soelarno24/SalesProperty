import { useState, useEffect } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface Client {
  id:string; name:string; email:string; phone:string; ktp:string;
  address:string; city:string; occupation:string; budget:string;
  source:'Website'|'Referral'|'Walk-in'|'Social Media'|'Event';
  status:'New Lead'|'Follow-up'|'Site Visit'|'Negotiation'|'Booked'|'Closed'|'Lost';
  assignedAgent:string; project:string; unit:string;
  notes:string; createdDate:string; lastContact:string;
}

const initialClients: Client[] = [
  {id:'1',name:'Richard Montgomery',email:'richard.m@gmail.com',phone:'+62 812 1111 0001',ktp:'3201011234560001',address:'Jl. Sudirman No. 45',city:'Jakarta Selatan',occupation:'CEO - PT Maju Jaya',budget:'$1.2M',source:'Referral',status:'Negotiation',assignedAgent:'Julian Vance',project:'The Obsidian Groves',unit:'Unit 402',notes:'Tertarik penthouse, minta diskon 5%. Decision maker.',createdDate:'2024-01-10',lastContact:'2024-02-13'},
  {id:'2',name:'Elise Valerius',email:'elise.v@outlook.com',phone:'+62 813 2222 0002',ktp:'3202021234560002',address:'Jl. Gatot Subroto Kav. 12',city:'Jakarta Pusat',occupation:'Director - Valerius Corp',budget:'$4.5M',source:'Event',status:'Site Visit',assignedAgent:'Sophia Liao',project:'Marine Wharf',unit:'Commercial Suite',notes:'Butuh ruang komersial 500sqm+. Visit kedua dijadwalkan.',createdDate:'2024-01-15',lastContact:'2024-02-14'},
  {id:'3',name:'Sarah Johnson',email:'sarah.j@yahoo.com',phone:'+62 856 3333 0003',ktp:'3203031234560003',address:'Jl. Kemang Raya No. 8',city:'Jakarta Selatan',occupation:'Entrepreneur',budget:'$980K',source:'Website',status:'Follow-up',assignedAgent:'Sarah Jenkins',project:'Alabaster Heights',unit:'-',notes:'Cari 3BR untuk keluarga. Budget terbatas.',createdDate:'2024-02-01',lastContact:'2024-02-15'},
  {id:'4',name:'David Kim',email:'david.kim@gmail.com',phone:'+62 878 4444 0004',ktp:'3204041234560004',address:'Jl. Senopati No. 22',city:'Jakarta Selatan',occupation:'Investor',budget:'$2.8M',source:'Referral',status:'Booked',assignedAgent:'Mark Rivera',project:'The Obsidian Groves',unit:'Unit 1205',notes:'Sudah bayar DP. Proses dokumen KPR.',createdDate:'2023-12-20',lastContact:'2024-02-10'},
  {id:'5',name:'Maria Santos',email:'maria.s@hotmail.com',phone:'+62 812 5555 0005',ktp:'3205051234560005',address:'Jl. Pluit Karang No. 3',city:'Jakarta Utara',occupation:'Doctor',budget:'$750K',source:'Walk-in',status:'New Lead',assignedAgent:'',project:'-',unit:'-',notes:'Walk-in saat open house. Tertarik tipe studio.',createdDate:'2024-02-15',lastContact:'2024-02-15'},
  {id:'6',name:'Thomas Hartwell',email:'thomas.h@company.co',phone:'+62 813 6666 0006',ktp:'3206061234560006',address:'Jl. Rasuna Said Blok X',city:'Jakarta Selatan',occupation:'VP Marketing',budget:'$1.6M',source:'Social Media',status:'Lost',assignedAgent:'Diana Mercer',project:'Azure Residences',unit:'Unit 25-01',notes:'Batal karena pindah ke luar negeri.',createdDate:'2023-11-05',lastContact:'2024-01-20'},
  {id:'7',name:'Nadia Kwon',email:'nadia.k@gmail.com',phone:'+62 857 7777 0007',ktp:'3207071234560007',address:'Jl. BSD Green Office',city:'Tangerang',occupation:'Architect',budget:'$1.1M',source:'Referral',status:'Closed',assignedAgent:'Julian Vance',project:'Alabaster Heights',unit:'Penthouse C',notes:'Deal closed. Handover scheduled Q2 2024.',createdDate:'2023-10-15',lastContact:'2024-02-08'},
];

const emptyForm = {name:'',email:'',phone:'',ktp:'',address:'',city:'',occupation:'',budget:'',source:'Website' as Client['source'],status:'New Lead' as Client['status'],assignedAgent:'',project:'',unit:'',notes:''};
const agentList = ['Julian Vance','Sophia Liao','Mark Rivera','Diana Mercer','Sarah Jenkins'];
const statusColors:Record<Client['status'],string> = {'New Lead':'bg-primary-fixed text-on-primary-fixed-variant','Follow-up':'bg-tertiary-fixed text-on-tertiary-fixed-variant','Site Visit':'bg-primary/10 text-primary','Negotiation':'bg-tertiary-container/30 text-on-tertiary-container','Booked':'bg-[#fff4e5] text-[#663c00]','Closed':'bg-[#e7f5ed] text-[#1e4620]','Lost':'bg-error-container text-on-error-container'};

export default function ClientData({ notify }: Props) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAgent, setFilterAgent] = useState('all');

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState<Client|null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);

  const filtered = clients.filter(c => {
    const ms = search ? c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.ktp.includes(search) : true;
    const mst = filterStatus === 'all' || c.status === filterStatus;
    const ma = filterAgent === 'all' || c.assignedAgent === filterAgent;
    return ms && mst && ma;
  });

  const stats = {total:clients.length, newLead:clients.filter(c=>c.status==='New Lead').length, active:clients.filter(c=>!['Lost','Closed'].includes(c.status)).length, closed:clients.filter(c=>c.status==='Closed').length, lost:clients.filter(c=>c.status==='Lost').length};

  useEffect(()=>{const h=(e:KeyboardEvent)=>{if(e.key==='Escape'){setShowAdd(false);setShowEdit(false);setShowDelete(false);setShowDetail(false);}};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);},[]);
  useEffect(()=>{if(showAdd){setForm(emptyForm);setErrors({});}},[showAdd]);
  useEffect(()=>{if(showEdit&&selected){setForm({name:selected.name,email:selected.email,phone:selected.phone,ktp:selected.ktp,address:selected.address,city:selected.city,occupation:selected.occupation,budget:selected.budget,source:selected.source,status:selected.status,assignedAgent:selected.assignedAgent,project:selected.project,unit:selected.unit,notes:selected.notes});setErrors({});}},[showEdit,selected]);

  const validate = () => {
    const e:Record<string,string> = {};
    if(!form.name.trim()) e.name='Nama wajib diisi';
    if(!form.phone.trim()) e.phone='Telepon wajib diisi';
    if(form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Format email tidak valid';
    if(form.ktp && form.ktp.length !== 16) e.ktp='KTP harus 16 digit';
    setErrors(e); return Object.keys(e).length===0;
  };

  const handleAdd = () => {if(!validate())return;setSubmitting(true);setTimeout(()=>{setClients([{id:String(Date.now()),...form,createdDate:new Date().toISOString().split('T')[0],lastContact:new Date().toISOString().split('T')[0]},...clients]);setShowAdd(false);setSubmitting(false);notify(`Client "${form.name}" berhasil ditambahkan!`,'success');},800);};
  const handleEdit = () => {if(!validate()||!selected)return;setSubmitting(true);setTimeout(()=>{setClients(clients.map(c=>c.id===selected.id?{...c,...form}:c));setShowEdit(false);setSubmitting(false);notify(`Data "${form.name}" berhasil diperbarui!`,'success');},800);};
  const handleDelete = () => {if(!selected)return;setSubmitting(true);setTimeout(()=>{setClients(clients.filter(c=>c.id!==selected.id));setShowDelete(false);setSubmitting(false);notify(`Client "${selected.name}" berhasil dihapus.`,'success');setSelected(null);},600);};

  const Sp = () => <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
  const FI = ({label,value,onChange,placeholder,error,type='text'}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string;error?:string;type?:string}) => (
    <div className="space-y-1"><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={`w-full px-4 py-3 bg-surface-container-low border rounded-lg text-sm outline-none transition-all ${error?'border-error focus:ring-2 focus:ring-error/20':'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`}/>{error&&<p className="text-xs text-error">{error}</p>}</div>
  );
  const FS = ({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:{v:string;l:string}[]}) => (
    <div className="space-y-1"><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label><select value={value} onChange={e=>onChange(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer">{options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>
  );

  const MB = ({children,onClose,wide=false}:{children:React.ReactNode;onClose:()=>void;wide?:boolean}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className={`bg-white rounded-2xl shadow-2xl ${wide?'w-full max-w-4xl':'w-full max-w-2xl'} max-h-[90vh] overflow-y-auto animate-fade-in-up my-8`} onClick={e=>e.stopPropagation()}>{children}</div>
    </div>
  );

  const FormFields = () => (
    <>
      <div className="bg-surface-container-low rounded-xl p-5 space-y-4 border border-outline-variant/10">
        <p className="font-label text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2"><Icon name="person" className="text-base"/>Data Pribadi</p>
        <div className="grid grid-cols-2 gap-4">
          <FI label="Nama Lengkap *" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Nama lengkap client" error={errors.name}/>
          <FI label="No. KTP (NIK)" value={form.ktp} onChange={v=>setForm({...form,ktp:v})} placeholder="16 digit NIK" error={errors.ktp}/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FI label="Email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="email@example.com" type="email" error={errors.email}/>
          <FI label="No. Telepon *" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="+62 812 xxxx xxxx" error={errors.phone}/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FI label="Alamat" value={form.address} onChange={v=>setForm({...form,address:v})} placeholder="Jl. ..."/>
          <FI label="Kota" value={form.city} onChange={v=>setForm({...form,city:v})} placeholder="Jakarta"/>
        </div>
        <FI label="Pekerjaan" value={form.occupation} onChange={v=>setForm({...form,occupation:v})} placeholder="Jabatan - Perusahaan"/>
      </div>
      <div className="bg-surface-container-low rounded-xl p-5 space-y-4 border border-outline-variant/10">
        <p className="font-label text-xs font-bold uppercase tracking-wider text-tertiary flex items-center gap-2"><Icon name="real_estate_agent" className="text-base"/>Info Properti & Sales</p>
        <div className="grid grid-cols-3 gap-4">
          <FI label="Budget" value={form.budget} onChange={v=>setForm({...form,budget:v})} placeholder="$1.2M"/>
          <FS label="Sumber Lead" value={form.source} onChange={v=>setForm({...form,source:v as Client['source']})} options={[{v:'Website',l:'Website'},{v:'Referral',l:'Referral'},{v:'Walk-in',l:'Walk-in'},{v:'Social Media',l:'Social Media'},{v:'Event',l:'Event'}]}/>
          <FS label="Status" value={form.status} onChange={v=>setForm({...form,status:v as Client['status']})} options={[{v:'New Lead',l:'New Lead'},{v:'Follow-up',l:'Follow-up'},{v:'Site Visit',l:'Site Visit'},{v:'Negotiation',l:'Negotiation'},{v:'Booked',l:'Booked'},{v:'Closed',l:'Closed'},{v:'Lost',l:'Lost'}]}/>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FS label="Agent Ditugaskan" value={form.assignedAgent} onChange={v=>setForm({...form,assignedAgent:v})} options={[{v:'',l:'Belum ditugaskan'},...agentList.map(a=>({v:a,l:a}))]}/>
          <FI label="Project" value={form.project} onChange={v=>setForm({...form,project:v})} placeholder="Nama project"/>
          <FI label="Unit" value={form.unit} onChange={v=>setForm({...form,unit:v})} placeholder="Unit number"/>
        </div>
      </div>
      <div><label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Catatan</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} placeholder="Catatan tentang client..." className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"/></div>
    </>
  );

  const statuses: Client['status'][] = ['New Lead','Follow-up','Site Visit','Negotiation','Booked','Closed','Lost'];

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div><h2 className="font-headline text-3xl lg:text-4xl font-bold mb-2">Data Client</h2><p className="text-on-surface-variant max-w-xl">Database lengkap calon pembeli dan client aktif. Kelola data, pantau status, dan track pipeline penjualan.</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer hover:opacity-90 shadow-lg shadow-primary/20"><Icon name="person_add"/>Tambah Client</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10"><p className="text-[10px] font-label uppercase text-on-surface-variant">Total Client</p><p className="text-2xl font-headline font-bold">{stats.total}</p></div>
        <div className="bg-primary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">New Lead</p><p className="text-2xl font-headline font-bold text-primary">{stats.newLead}</p></div>
        <div className="bg-tertiary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Aktif Pipeline</p><p className="text-2xl font-headline font-bold text-tertiary">{stats.active}</p></div>
        <div className="bg-[#e7f5ed] p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Closed</p><p className="text-2xl font-headline font-bold text-[#1e4620]">{stats.closed}</p></div>
        <div className="bg-error-container/20 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Lost</p><p className="text-2xl font-headline font-bold text-error">{stats.lost}</p></div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama, email, KTP, telepon..." className="w-full bg-surface-container-low rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary border-none"/></div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="bg-surface-container-low border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary cursor-pointer">
          <option value="all">Semua Status</option>
          {statuses.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterAgent} onChange={e=>setFilterAgent(e.target.value)} className="bg-surface-container-low border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary cursor-pointer">
          <option value="all">Semua Agent</option>
          {agentList.map(a=><option key={a} value={a}>{a}</option>)}
        </select>
        <button onClick={()=>{setSearch('');setFilterStatus('all');setFilterAgent('all');}} className="text-primary font-semibold text-sm px-3 py-2 hover:bg-primary/5 rounded-lg cursor-pointer flex items-center gap-1"><Icon name="filter_list_off" className="text-lg"/>Reset</button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
              <th className="px-5 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Client</th>
              <th className="px-5 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Kontak</th>
              <th className="px-5 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Budget</th>
              <th className="px-5 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Agent</th>
              <th className="px-5 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Project</th>
              <th className="px-5 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
              <th className="px-5 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Aksi</th>
            </tr></thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.map(c=>(
                <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-5 py-4"><p className="font-semibold text-sm">{c.name}</p><p className="text-[10px] text-on-surface-variant">{c.occupation||'-'}</p></td>
                  <td className="px-5 py-4"><p className="text-xs">{c.phone}</p><p className="text-[10px] text-primary">{c.email||'-'}</p></td>
                  <td className="px-5 py-4 text-sm font-bold">{c.budget||'-'}</td>
                  <td className="px-5 py-4 text-xs text-on-surface-variant">{c.assignedAgent||<span className="text-error italic">Belum</span>}</td>
                  <td className="px-5 py-4"><p className="text-xs">{c.project||'-'}</p><p className="text-[10px] text-on-surface-variant">{c.unit||''}</p></td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${statusColors[c.status]}`}>{c.status}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>{setSelected(c);setShowDetail(true);}} className="p-1.5 hover:bg-primary-fixed rounded-lg text-on-surface-variant hover:text-primary cursor-pointer" title="Detail"><Icon name="visibility" className="text-lg"/></button>
                      <button onClick={()=>{setSelected(c);setShowEdit(true);}} className="p-1.5 hover:bg-primary-fixed rounded-lg text-on-surface-variant hover:text-primary cursor-pointer" title="Edit"><Icon name="edit" className="text-lg"/></button>
                      <button onClick={()=>{setSelected(c);setShowDelete(true);}} className="p-1.5 hover:bg-error-container rounded-lg text-on-surface-variant hover:text-error cursor-pointer" title="Hapus"><Icon name="delete" className="text-lg"/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={7} className="px-5 py-16 text-center text-on-surface-variant">Tidak ada client yang cocok.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-surface-container-low/30 flex justify-between items-center text-xs text-on-surface-variant font-label uppercase tracking-widest border-t border-outline-variant/10">
          <span>Showing {filtered.length} of {clients.length}</span>
        </div>
      </div>

      <footer className="pt-8 pb-4 text-center"><p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant opacity-35">© Agent Properti • Leader Panel</p></footer>

      {/* ===== MODALS ===== */}

      {/* Add Client */}
      {showAdd&&(<MB onClose={()=>setShowAdd(false)} wide><div className="p-6 border-b border-outline-variant/20 flex justify-between items-center"><div><h3 className="font-headline text-xl font-bold">Tambah Client Baru</h3><p className="text-xs text-on-surface-variant">Daftarkan calon pembeli ke database.</p></div><button onClick={()=>setShowAdd(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close"/></button></div>
        <form className="p-6 space-y-5" onSubmit={e=>{e.preventDefault();handleAdd();}}><FormFields/><div className="flex gap-3 pt-4 border-t border-outline-variant/20"><button type="button" onClick={()=>setShowAdd(false)} className="flex-1 py-3 border border-outline font-semibold rounded-xl cursor-pointer">Batal</button><button type="submit" disabled={submitting} className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">{submitting?<><Sp/>Menyimpan...</>:<><Icon name="person_add"/>Tambah Client</>}</button></div></form>
      </MB>)}

      {/* Edit Client */}
      {showEdit&&selected&&(<MB onClose={()=>setShowEdit(false)} wide><div className="p-6 border-b border-outline-variant/20 flex justify-between items-center"><div><h3 className="font-headline text-xl font-bold">Edit Client</h3><p className="text-xs text-on-surface-variant">{selected.name}</p></div><button onClick={()=>setShowEdit(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close"/></button></div>
        <form className="p-6 space-y-5" onSubmit={e=>{e.preventDefault();handleEdit();}}><FormFields/><div className="flex gap-3 pt-4 border-t border-outline-variant/20"><button type="button" onClick={()=>setShowEdit(false)} className="flex-1 py-3 border border-outline font-semibold rounded-xl cursor-pointer">Batal</button><button type="submit" disabled={submitting} className="flex-[2] py-3 bg-primary text-white font-semibold rounded-xl cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">{submitting?<><Sp/>Menyimpan...</>:<><Icon name="save"/>Simpan</>}</button></div></form>
      </MB>)}

      {/* Delete Client */}
      {showDelete&&selected&&(<MB onClose={()=>setShowDelete(false)}><div className="p-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-error-container flex items-center justify-center mb-6"><Icon name="delete_forever" className="text-3xl text-error"/></div>
        <div className="text-center mb-6"><h3 className="font-headline text-xl font-bold mb-2">Hapus Client?</h3><p className="text-on-surface-variant"><span className="font-semibold text-on-surface">"{selected.name}"</span> akan dihapus permanen.</p></div>
        <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex justify-between items-center"><div><p className="font-bold">{selected.name}</p><p className="text-xs text-on-surface-variant">{selected.phone} • {selected.occupation}</p></div><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[selected.status]}`}>{selected.status}</span></div>
        <div className="flex gap-3"><button onClick={()=>setShowDelete(false)} className="flex-1 py-3 border border-outline font-semibold rounded-xl cursor-pointer">Batal</button><button onClick={handleDelete} disabled={submitting} className="flex-1 py-3 bg-error text-white font-semibold rounded-xl cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">{submitting?<><Sp/>Menghapus...</>:<><Icon name="delete"/>Ya, Hapus</>}</button></div>
      </div></MB>)}

      {/* Detail Client */}
      {showDetail&&selected&&(<MB onClose={()=>setShowDetail(false)} wide><div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-2xl">{selected.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
            <div><h3 className="font-headline text-2xl font-bold">{selected.name}</h3><p className="text-sm text-on-surface-variant">{selected.occupation||'N/A'}</p>
              <div className="flex items-center gap-2 mt-1"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[selected.status]}`}>{selected.status}</span><span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-surface-container-high text-on-surface-variant">{selected.source}</span></div>
            </div>
          </div>
          <button onClick={()=>setShowDetail(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-surface-container-low rounded-xl p-5 space-y-3">
              <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="person" className="text-primary text-sm"/>Data Pribadi</h4>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Email</span><span className="font-medium text-primary">{selected.email||'-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Telepon</span><span className="font-medium">{selected.phone}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">KTP (NIK)</span><span className="font-mono text-sm">{selected.ktp||'-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Alamat</span><span className="font-medium text-right max-w-[200px]">{selected.address?`${selected.address}, ${selected.city}`:'-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Pekerjaan</span><span className="font-medium">{selected.occupation||'-'}</span></div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5 space-y-3">
              <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Catatan</h4>
              <p className="text-sm text-on-surface">{selected.notes||'Tidak ada catatan.'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-primary-fixed/20 rounded-xl p-5 space-y-3 border border-primary/10">
              <h4 className="font-label text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2"><Icon name="real_estate_agent" className="text-sm"/>Info Properti</h4>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Budget</span><span className="font-bold text-primary text-lg">{selected.budget||'-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Project</span><span className="font-medium">{selected.project||'-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Unit</span><span className="font-medium">{selected.unit||'-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Agent</span><span className="font-medium">{selected.assignedAgent||<span className="text-error italic">Belum ditugaskan</span>}</span></div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5 space-y-3">
              <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Timeline</h4>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Terdaftar</span><span className="font-medium">{new Date(selected.createdDate).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Kontak Terakhir</span><span className="font-medium">{new Date(selected.lastContact).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Sumber</span><span className="font-medium">{selected.source}</span></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
          <button onClick={()=>{setShowDetail(false);setShowDelete(true);}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error-container cursor-pointer flex items-center gap-2"><Icon name="delete"/>Hapus</button>
          <button onClick={()=>{setShowDetail(false);setShowEdit(true);}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed cursor-pointer flex items-center gap-2"><Icon name="edit"/>Edit</button>
          <button onClick={()=>setShowDetail(false)} className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold cursor-pointer">Tutup</button>
        </div>
      </div></MB>)}
    </div>
  );
}
