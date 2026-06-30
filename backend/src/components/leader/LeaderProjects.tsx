import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface UnitType { name:string; size:string; price:number; dp:number; dpPercent:number; available:number; total:number; }

interface Project {
  id:string; name:string; image:string; status:'Active'|'Completed'|'Coming Soon';
  // Location
  address:string; city:string; coordinates:string; mapArea:string;
  // Stats
  totalUnits:number; sold:number; booked:number; available:number; progress:number; agents:number;
  // Details
  developer:string; reraId:string; startDate:string; completionDate:string; type:string;
  description:string;
  // Pricing
  priceRange:string; avgPrice:number; minDp:number; maxDp:number; dpPercent:string;
  // Facilities
  facilities:string[];
  // Certificates
  certificates:string[];
  // Unit Types
  unitTypes: UnitType[];
  // Images
  gallery:string[];
  // Assigned agents
  assignedAgents:string[];
}

const IMG='https://lh3.googleusercontent.com/aida-public/AB6AXuA7Rgn9nTqgf6PeAIGdhxr7bHFbQr4ZgsoR0YbmuQfT__5zqQb3GHIn5dtNM9w6d5oTdgr8-ZyKYBQeDMD7awiDlDWpig-8AvD_wH16kad30BlYkR_mYVtx-gccmrFBzSJfB6umkTxOqu_I--heCDSsEf-Yvt_t4OpODzRs80tRoWbu-TjPptryBlOAjc18J2PiubYvJw8p6pC-8XII4I3GrTrTbhKgC7eqR29ur_nrmvmJoAmLJnn7YPrb9_FZHrKfD-lReq8NzJ5a';
const IMG2='https://lh3.googleusercontent.com/aida-public/AB6AXuCeza2KH5jLlRVxene78J-S8C3fCCPOXpr2vSYR1CsLSpdUdhpYNYe6lYbdwrLRMIoGcuHzPHg5ub24BdVUTn0tqy9B8K6PcwIwMb69rwkJVs8KStpiGmNJA1G4nRnqv3lHjINJuXmcfpRTfvWaOJvZN8YQlVDz8B3-DKBGr7gtnTpyFCwF2BxhhZxuixtAi30w_ivM-EyAbKeimqvAsES_9CdHeQ_sHFehDBIEgvREOCGoVSAT78eri7i-5CW1vlz8rVSsWt_B-Vf5';
const IMG3='https://lh3.googleusercontent.com/aida-public/AB6AXuCiyzHYccguqZ1MFwev-F3ZIpnnUYxhuuDdWbfKRJ33KPxCx1JMlvjE9XW-bcsblyoOW589C11NQsL4_mslteAScr3ivOSDASxpZDPYbp9-z8Nc83_-08XwNP6V1pedCLq9yXWsepH4_UU9RkHWLSol7HAWXuL3L8vummwX78rAR0vBre7NNcGwVPZsAHyfovTB3KrwAov43uXgVTUfScFQIACBak-3zEHhgK5MDR6y9BQTJOO3xKG0bUTx6kTwwspxPzhlxD9rwhs8';
const IMG4='https://lh3.googleusercontent.com/aida-public/AB6AXuBq3S3UtRtrBzuJzEDFp0uy25Fpjw9gX3vHGvH3-Q06JeMdMU9cgbzwGpm_66JyH3Ier4Jo17WjMpL7p93lB4qQEVwOAWJSHsJY6S4ilQlSsXvDMJYD4DLCL7hddA-fJvAT46-E_haPcF6rFKa_JtFIzGay3ItLA7nzV1syeysRJ1_ck9akQTKW6e5sOt1aMwOHqU7mhBLUTCou6Xe5nXXm3M7DYXC2QLGnVZNFp2RuZStAxRvStVePybZFTfcN0U1Jr4TTfaS_PmSF';

const projects: Project[] = [
  {id:'1',name:'The Obsidian Groves',image:IMG,status:'Active',
    address:'Sector 45, Azure Coastline Boulevard',city:'Jakarta Selatan',coordinates:'6.26°S, 106.81°E',mapArea:'Central Business District',
    totalUnits:140,sold:98,booked:12,available:30,progress:70,agents:3,
    developer:'Vanguard Urban Developments',reraId:'RERA-X0922',startDate:'2022-03-15',completionDate:'2025-12-31',type:'Premium High-Rise',
    description:'Integrasi desain biophilic dan densitas urban. Dilengkapi 140 unit mewah dengan teknologi smart-grid dan arboretum privat di setiap lantai.',
    priceRange:'$420K - $2.8M',avgPrice:890000,minDp:84000,maxDp:840000,dpPercent:'20% - 30%',
    facilities:['Swimming Pool','Fitness Center','EV Station','Spa & Wellness','Clubhouse','Sky Garden','Concierge 24/7','Children Playground'],
    certificates:['LEED Platinum','RERA-X0922','Fire Safety Cert','Green Building Cert'],
    unitTypes:[
      {name:'Studio Compact',size:'450 sqft',price:420000,dp:84000,dpPercent:20,available:8,total:40},
      {name:'2BR Terrace Loft',size:'1,120 sqft',price:640000,dp:128000,dpPercent:20,available:12,total:50},
      {name:'3BR Garden Duplex',size:'1,850 sqft',price:985000,dp:246250,dpPercent:25,available:6,total:30},
      {name:'Penthouse Sky Suite',size:'2,450 sqft',price:2800000,dp:840000,dpPercent:30,available:4,total:20},
    ],
    gallery:[IMG,IMG2,IMG3,IMG4],
    assignedAgents:['Julian Vance','Mark Rivera','Diana Mercer']},
  {id:'2',name:'Alabaster Heights',image:IMG2,status:'Active',
    address:'West District Highlands, Block C',city:'Tangerang Selatan',coordinates:'6.30°S, 106.66°E',mapArea:'West Highlands',
    totalUnits:220,sold:180,booked:15,available:25,progress:82,agents:4,
    developer:'Stonegate Collective',reraId:'RERA-AH881',startDate:'2021-06-01',completionDate:'2024-08-15',type:'Luxury Residential',
    description:'Simetri klasik bertemu kemewahan modern. Taman courtyard formal dengan elemen arsitektur elegan menciptakan keanggunan abadi.',
    priceRange:'$550K - $1.8M',avgPrice:750000,minDp:110000,maxDp:450000,dpPercent:'20% - 25%',
    facilities:['Clubhouse','Spa','Tennis Court','Jogging Track','Library','Business Center'],
    certificates:['RERA-AH881','Green Building Cert','ISO 14001'],
    unitTypes:[
      {name:'2BR Classic Suite',size:'980 sqft',price:550000,dp:110000,dpPercent:20,available:10,total:80},
      {name:'3BR Executive',size:'1,650 sqft',price:890000,dp:222500,dpPercent:25,available:8,total:90},
      {name:'Penthouse Collection',size:'2,800 sqft',price:1800000,dp:450000,dpPercent:25,available:7,total:50},
    ],
    gallery:[IMG2,IMG,IMG4],
    assignedAgents:['Sophia Liao','Julian Vance','Sarah Jenkins','Diana Mercer']},
  {id:'3',name:'Marine Wharf',image:IMG3,status:'Active',
    address:'North Bay Marina, Pier 12',city:'Jakarta Utara',coordinates:'6.11°S, 106.85°E',mapArea:'Waterfront District',
    totalUnits:45,sold:12,booked:5,available:28,progress:27,agents:2,
    developer:'Lighthouse Estuary',reraId:'RERA-MW445',startDate:'2023-01-10',completionDate:'2026-03-30',type:'Exclusive Waterfront',
    description:'Hunian eksklusif tepi air dengan akses dermaga privat. Arsitektur coastal modern dengan integrasi teknologi maritime berkelanjutan.',
    priceRange:'$1.2M - $3.5M',avgPrice:2100000,minDp:360000,maxDp:1050000,dpPercent:'30%',
    facilities:['Private Pier','Gym','Rooftop Lounge','Yacht Club','Beach Access','Helipad'],
    certificates:['RERA-MW445','Coastal Development Permit','Marine Safety Cert'],
    unitTypes:[
      {name:'Waterfront Suite',size:'1,800 sqft',price:1200000,dp:360000,dpPercent:30,available:15,total:25},
      {name:'Grand Panorama',size:'3,100 sqft',price:2100000,dp:630000,dpPercent:30,available:10,total:15},
      {name:'Captain\'s Penthouse',size:'4,500 sqft',price:3500000,dp:1050000,dpPercent:30,available:3,total:5},
    ],
    gallery:[IMG3,IMG,IMG2],
    assignedAgents:['Mark Rivera','Sophia Liao']},
  {id:'4',name:'Azure Residences',image:IMG4,status:'Active',
    address:'Central Business District, Tower A-B',city:'Jakarta Pusat',coordinates:'6.21°S, 106.84°E',mapArea:'CBD Premium',
    totalUnits:380,sold:95,booked:20,available:265,progress:25,agents:3,
    developer:'Vanguard Urban Developments',reraId:'RERA-AR992',startDate:'2023-09-01',completionDate:'2027-06-30',type:'Premium Mixed-Use',
    description:'High-rise premium di jantung kota. Smart home automation dan sky garden di setiap lantai ketiga. Konsep mixed-use dengan retail podium.',
    priceRange:'$380K - $2.5M',avgPrice:680000,minDp:38000,maxDp:750000,dpPercent:'10% - 30%',
    facilities:['Sky Garden','Infinity Pool','Business Center','Cinema','Co-working Space','Retail Podium','Smart Parking'],
    certificates:['LEED Gold','RERA-AR992','Smart Building Cert'],
    unitTypes:[
      {name:'Studio Smart',size:'380 sqft',price:380000,dp:38000,dpPercent:10,available:120,total:150},
      {name:'1BR City View',size:'650 sqft',price:520000,dp:78000,dpPercent:15,available:80,total:120},
      {name:'2BR Premium',size:'1,100 sqft',price:850000,dp:170000,dpPercent:20,available:45,total:80},
      {name:'Sky Penthouse',size:'3,800 sqft',price:2500000,dp:750000,dpPercent:30,available:20,total:30},
    ],
    gallery:[IMG4,IMG,IMG3,IMG2],
    assignedAgents:['Diana Mercer','Sarah Jenkins','Julian Vance']},
  {id:'5',name:'Villa Verde',image:IMG4,status:'Completed',
    address:'Tuscany Hills, Olive Grove Lane',city:'Bogor',coordinates:'6.60°S, 106.80°E',mapArea:'Highland Retreat',
    totalUnits:28,sold:28,booked:0,available:0,progress:100,agents:1,
    developer:'Arcadia Living Group',reraId:'RERA-VV112',startDate:'2020-04-15',completionDate:'2023-12-20',type:'Mediterranean Villas',
    description:'Villa bergaya mediterania dikelilingi kebun zaitun. Arsitektur berkelanjutan dengan material lokal.',
    priceRange:'$850K - $2.2M',avgPrice:1200000,minDp:212500,maxDp:550000,dpPercent:'25%',
    facilities:['Vineyard','Olive Grove','Community Kitchen','Private Pool','Garden Terrace'],
    certificates:['RERA-VV112','Organic Living Cert'],
    unitTypes:[
      {name:'Garden Villa',size:'2,800 sqft',price:850000,dp:212500,dpPercent:25,available:0,total:18},
      {name:'Mediterranean Grand',size:'4,200 sqft',price:2200000,dp:550000,dpPercent:25,available:0,total:10},
    ],
    gallery:[IMG4,IMG2],
    assignedAgents:['Sarah Jenkins']},
];

const fp = (n:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

export default function LeaderProjects({ notify }: Props) {
  const [selected, setSelected] = useState<Project|null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  const openDetail = (p:Project) => { setSelected(p); setGalleryIdx(0); };

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-8">
      <div><h2 className="font-headline text-3xl lg:text-4xl font-bold">Project Overview</h2><p className="text-on-surface-variant mt-1">Pantau progress penjualan, detail project, fasilitas, harga, dan alokasi tim.</p></div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10"><p className="text-[10px] font-label uppercase text-on-surface-variant">Total Projects</p><p className="text-2xl font-headline font-bold">{projects.length}</p></div>
        <div className="bg-primary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Aktif</p><p className="text-2xl font-headline font-bold text-primary">{projects.filter(p=>p.status==='Active').length}</p></div>
        <div className="bg-tertiary-fixed/30 p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Total Unit</p><p className="text-2xl font-headline font-bold text-tertiary">{projects.reduce((s,p)=>s+p.totalUnits,0)}</p></div>
        <div className="bg-[#e7f5ed] p-5 rounded-xl"><p className="text-[10px] font-label uppercase text-on-surface-variant">Terjual</p><p className="text-2xl font-headline font-bold text-[#1e4620]">{projects.reduce((s,p)=>s+p.sold,0)}</p></div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10"><p className="text-[10px] font-label uppercase text-on-surface-variant">Available</p><p className="text-2xl font-headline font-bold">{projects.reduce((s,p)=>s+p.available,0)}</p></div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p=>(
          <div key={p.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
            <div className="h-44 overflow-hidden relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              <div className="absolute top-3 left-3"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${p.status==='Active'?'bg-white/90 text-primary':'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>{p.status}</span></div>
              <div className="absolute top-3 right-3"><span className="px-2 py-1 rounded bg-on-surface/60 text-white text-[10px] font-bold">{p.type}</span></div>
            </div>
            <div className="p-5">
              <h3 className="font-headline text-lg font-bold mb-1">{p.name}</h3>
              <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-3"><Icon name="location_on" className="text-sm"/>{p.city} • {p.mapArea}</p>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-bold text-primary">{p.priceRange}</span>
                <span className="text-[10px] text-on-surface-variant">• DP {p.dpPercent}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="bg-surface-container-low rounded-lg p-2"><p className="text-sm font-bold">{p.totalUnits}</p><p className="text-[9px] text-on-surface-variant">Total</p></div>
                <div className="bg-[#e7f5ed] rounded-lg p-2"><p className="text-sm font-bold text-[#1e4620]">{p.sold}</p><p className="text-[9px] text-on-surface-variant">Sold</p></div>
                <div className="bg-primary-fixed/30 rounded-lg p-2"><p className="text-sm font-bold text-primary">{p.available}</p><p className="text-[9px] text-on-surface-variant">Available</p></div>
              </div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-on-surface-variant">Progress</span><span className="font-bold">{p.progress}%</span></div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-4"><div className={`h-full rounded-full ${p.progress>=80?'bg-tertiary':p.progress>=50?'bg-primary':'bg-error'}`} style={{width:`${p.progress}%`}}/></div>
              <button onClick={()=>openDetail(p)} className="w-full py-2.5 text-primary text-sm font-semibold hover:bg-primary/5 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 border border-primary/20"><Icon name="visibility" className="text-base"/>Lihat Detail Lengkap</button>
            </div>
          </div>
        ))}
      </div>

      <footer className="pt-8 pb-4 text-center"><p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant opacity-35">© Agent Properti • Leader Panel</p></footer>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl animate-fade-in-up my-8 max-h-[92vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>

            {/* Gallery Header */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
              <img src={selected.gallery[galleryIdx]} alt="" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 via-transparent to-on-surface/20"/>
              {/* Nav arrows */}
              {selected.gallery.length>1 && <>
                <button onClick={e=>{e.stopPropagation();setGalleryIdx(i=>(i-1+selected.gallery.length)%selected.gallery.length);}} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white cursor-pointer shadow-lg"><Icon name="chevron_left"/></button>
                <button onClick={e=>{e.stopPropagation();setGalleryIdx(i=>(i+1)%selected.gallery.length);}} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white cursor-pointer shadow-lg"><Icon name="chevron_right"/></button>
              </>}
              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {selected.gallery.map((_,i)=><button key={i} onClick={e=>{e.stopPropagation();setGalleryIdx(i);}} className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${galleryIdx===i?'bg-white scale-125':'bg-white/50'}`}/>)}
              </div>
              {/* Title overlay */}
              <div className="absolute bottom-4 left-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${selected.status==='Active'?'bg-white/90 text-primary':'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>{selected.status}</span>
                <h3 className="font-headline text-3xl font-bold text-white mt-2 drop-shadow-lg">{selected.name}</h3>
                <p className="text-white/80 text-sm flex items-center gap-1 mt-1"><Icon name="location_on" className="text-sm"/>{selected.address}, {selected.city}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="absolute top-4 right-4 w-10 h-10 bg-on-surface/50 text-white rounded-full flex items-center justify-center hover:bg-on-surface/70 cursor-pointer"><Icon name="close"/></button>
            </div>

            <div className="p-6 lg:p-8 space-y-8">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-surface-container-low rounded-xl p-4 text-center"><p className="text-2xl font-headline font-bold">{selected.totalUnits}</p><p className="text-[10px] font-label uppercase text-on-surface-variant">Total Unit</p></div>
                <div className="bg-[#e7f5ed] rounded-xl p-4 text-center"><p className="text-2xl font-headline font-bold text-[#1e4620]">{selected.sold}</p><p className="text-[10px] font-label uppercase text-on-surface-variant">Sold</p></div>
                <div className="bg-[#fff4e5] rounded-xl p-4 text-center"><p className="text-2xl font-headline font-bold text-[#663c00]">{selected.booked}</p><p className="text-[10px] font-label uppercase text-on-surface-variant">Booked</p></div>
                <div className="bg-primary-fixed/30 rounded-xl p-4 text-center"><p className="text-2xl font-headline font-bold text-primary">{selected.available}</p><p className="text-[10px] font-label uppercase text-on-surface-variant">Available</p></div>
                <div className="bg-surface-container-low rounded-xl p-4 text-center"><p className="text-2xl font-headline font-bold">{selected.progress}%</p><p className="text-[10px] font-label uppercase text-on-surface-variant">Progress</p><div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mt-1"><div className={`h-full rounded-full ${selected.progress>=80?'bg-tertiary':'bg-primary'}`} style={{width:`${selected.progress}%`}}/></div></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Description */}
                  <div className="bg-surface-container-low rounded-xl p-6">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Deskripsi</h4>
                    <p className="text-sm text-on-surface leading-relaxed">{selected.description}</p>
                  </div>

                  {/* Location */}
                  <div className="bg-surface-container-low rounded-xl p-6 space-y-3">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="location_on" className="text-primary text-sm"/>Lokasi</h4>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Alamat</span><span className="font-medium text-right max-w-[250px]">{selected.address}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Kota</span><span className="font-medium">{selected.city}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Koordinat</span><span className="font-mono text-primary text-xs">{selected.coordinates}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Area</span><span className="font-medium">{selected.mapArea}</span></div>
                  </div>

                  {/* Project Info */}
                  <div className="bg-surface-container-low rounded-xl p-6 space-y-3">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="info" className="text-primary text-sm"/>Info Project</h4>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Developer</span><span className="font-medium">{selected.developer}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">RERA ID</span><span className="font-mono font-medium">{selected.reraId}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Tipe</span><span className="font-medium">{selected.type}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Mulai</span><span className="font-medium">{selected.startDate}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Est. Selesai</span><span className="font-medium">{selected.completionDate}</span></div>
                  </div>

                  {/* Assigned Agents */}
                  <div className="bg-surface-container-low rounded-xl p-6">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-2"><Icon name="group" className="text-primary text-sm"/>Agent Ditugaskan ({selected.assignedAgents.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.assignedAgents.map(a=>(
                        <div key={a} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-outline-variant/10">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{a.split(' ').map(n=>n[0]).join('')}</div>
                          <span className="text-sm font-medium">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Pricing Overview */}
                  <div className="bg-primary-fixed/20 rounded-xl p-6 border border-primary/10">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2"><Icon name="payments" className="text-sm"/>Harga & Down Payment</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Range Harga</span><span className="font-bold text-primary text-lg">{selected.priceRange}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Rata-rata</span><span className="font-bold">{fp(selected.avgPrice)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-on-surface-variant">DP Range</span><span className="font-bold">{fp(selected.minDp)} - {fp(selected.maxDp)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Persentase DP</span><span className="font-bold">{selected.dpPercent}</span></div>
                    </div>
                  </div>

                  {/* Unit Types Table */}
                  <div className="bg-surface-container-low rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-outline-variant/10"><h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="apartment" className="text-primary text-sm"/>Tipe Unit & Harga</h4></div>
                    <table className="w-full text-left">
                      <thead><tr className="bg-surface-container/50"><th className="px-5 py-3 text-[10px] font-label uppercase text-on-surface-variant font-bold">Tipe</th><th className="px-4 py-3 text-[10px] font-label uppercase text-on-surface-variant font-bold">Luas</th><th className="px-4 py-3 text-[10px] font-label uppercase text-on-surface-variant font-bold text-right">Harga</th><th className="px-4 py-3 text-[10px] font-label uppercase text-on-surface-variant font-bold text-right">DP ({'\u0025'})</th><th className="px-4 py-3 text-[10px] font-label uppercase text-on-surface-variant font-bold text-center">Stok</th></tr></thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {selected.unitTypes.map(u=>(
                          <tr key={u.name} className="hover:bg-white transition-colors">
                            <td className="px-5 py-3 text-sm font-semibold">{u.name}</td>
                            <td className="px-4 py-3 text-xs text-on-surface-variant">{u.size}</td>
                            <td className="px-4 py-3 text-right text-sm font-bold text-primary">{fp(u.price)}</td>
                            <td className="px-4 py-3 text-right text-xs">{fp(u.dp)} <span className="text-on-surface-variant">({u.dpPercent}%)</span></td>
                            <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.available>0?'bg-[#e7f5ed] text-[#1e4620]':'bg-error-container text-on-error-container'}`}>{u.available}/{u.total}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Facilities */}
                  <div className="bg-surface-container-low rounded-xl p-6">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-2"><Icon name="fitness_center" className="text-primary text-sm"/>Fasilitas ({selected.facilities.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.facilities.map(f=><span key={f} className="px-3 py-1.5 bg-white rounded-lg border border-outline-variant/10 text-xs font-medium flex items-center gap-1.5"><Icon name="check_circle" className="text-primary text-sm"/>{f}</span>)}
                    </div>
                  </div>

                  {/* Certificates */}
                  <div className="bg-surface-container-low rounded-xl p-6">
                    <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-2"><Icon name="verified" className="text-tertiary text-sm"/>Sertifikasi</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.certificates.map(c=><span key={c} className="px-3 py-1.5 bg-tertiary-fixed/30 rounded-lg text-xs font-bold text-on-tertiary-fixed-variant uppercase">{c}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div>
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Gallery ({selected.gallery.length} Foto)</h4>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {selected.gallery.map((img,i)=>(
                    <div key={i} className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${galleryIdx===i?'border-primary shadow-lg scale-105':'border-transparent hover:border-primary/30'}`} onClick={()=>setGalleryIdx(i)}>
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/10">
                <button onClick={()=>{notify(`Export data ${selected.name}...`,'info');}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed cursor-pointer flex items-center gap-2"><Icon name="download"/>Export</button>
                <button onClick={()=>setSelected(null)} className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold cursor-pointer">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
