import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface AuditLog {
  id: string;
  timestamp: string;
  date: string;
  userName: string;
  userRole: string;
  userId: string;
  initials: string;
  initialsColor: string;
  action: string;
  actionColor: string;
  entity: string;
  entityDetail: string;
  entityDetailColor: string;
  ipAddress: string;
}

interface ExportReport {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeBg: string;
}

const exportReports: ExportReport[] = [
  { id:'1', title:'Quarterly Sales Summary', description:'Laporan konsolidasi semua booking unit, penyesuaian harga, dan rekognisi pendapatan.', icon:'assessment', iconBg:'bg-primary-fixed', iconColor:'text-on-primary-fixed-variant', badge:'Fiscal Year', badgeBg:'bg-tertiary-container/20 text-on-tertiary-fixed-variant' },
  { id:'2', title:'Inventory Audit', description:'Analisis mendalam ketersediaan proyek, status reservasi, dan pemetaan fase konstruksi.', icon:'inventory', iconBg:'bg-secondary-container', iconColor:'text-on-secondary-container', badge:'Real-Time', badgeBg:'bg-surface-variant text-on-surface-variant' },
  { id:'3', title:'System Security Log', description:'Riwayat lengkap perubahan permission, event autentikasi, dan override administratif.', icon:'security', iconBg:'bg-tertiary-fixed', iconColor:'text-on-tertiary-fixed-variant', badge:'Compliance', badgeBg:'bg-primary-fixed/30 text-on-primary-fixed-variant' },
  { id:'4', title:'Commission Report', description:'Laporan komisi dan bonus sales agent per periode, termasuk accelerator dan closing bonus.', icon:'payments', iconBg:'bg-tertiary-fixed-dim/30', iconColor:'text-tertiary', badge:'Monthly', badgeBg:'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  { id:'5', title:'User Activity Report', description:'Rekap aktivitas login, perubahan data, dan performa setiap user dalam sistem.', icon:'group', iconBg:'bg-secondary-container', iconColor:'text-on-secondary-container', badge:'Analytics', badgeBg:'bg-primary-fixed/30 text-on-primary-fixed-variant' },
  { id:'6', title:'Developer Compliance', description:'Status kepatuhan semua developer mitra: izin usaha, asuransi, dan sertifikasi.', icon:'gavel', iconBg:'bg-error-container/30', iconColor:'text-error', badge:'Audit', badgeBg:'bg-error-container/30 text-on-error-container' },
];

const initialLogs: AuditLog[] = [
  { id:'1', timestamp:'Today, 14:12:08', date:'02 Oct 2023', userName:'Thorne, Julian', userRole:'Admin (ID: 0882)', userId:'0882', initials:'TH', initialsColor:'bg-secondary-fixed text-on-secondary-fixed', action:'Updated Price', actionColor:'bg-primary-fixed/50 text-on-primary-fixed-variant', entity:'Unit 402 — Azure Residences', entityDetail:'+$12,500 adjustment', entityDetailColor:'text-primary', ipAddress:'192.168.1.144' },
  { id:'2', timestamp:'Today, 12:45:33', date:'02 Oct 2023', userName:'Chen, Sarah', userRole:'Manager (ID: 1104)', userId:'1104', initials:'SC', initialsColor:'bg-primary-fixed text-on-primary-fixed', action:'Booked Unit', actionColor:'bg-tertiary-container/30 text-on-tertiary-container', entity:'Unit 1005 — The Archive Towers', entityDetail:'Lead Ref: #ABC-900', entityDetailColor:'text-on-surface-variant', ipAddress:'72.14.192.12' },
  { id:'3', timestamp:'Today, 09:20:11', date:'02 Oct 2023', userName:'Lowe, Marcus', userRole:'Editor (ID: 0942)', userId:'0942', initials:'ML', initialsColor:'bg-error-container text-on-error-container', action:'Failed Login', actionColor:'bg-error-container/40 text-on-error-container', entity:'Admin Portal Access', entityDetail:'3 Incorrect Attempts', entityDetailColor:'text-error', ipAddress:'203.0.113.45' },
  { id:'4', timestamp:'Yesterday, 18:55:00', date:'01 Oct 2023', userName:'System Automator', userRole:'Cron (ID: 0001)', userId:'0001', initials:'SYS', initialsColor:'bg-surface-variant text-on-surface-variant', action:'Scheduled Archive', actionColor:'bg-secondary-container/50 text-on-secondary-container', entity:'Historical Records Sync', entityDetail:'Database Batch: #SYNC-22', entityDetailColor:'text-on-surface-variant', ipAddress:'Internal (AWS)' },
  { id:'5', timestamp:'Yesterday, 16:30:12', date:'01 Oct 2023', userName:'Vance, Elias', userRole:'Dev Ops (ID: 0014)', userId:'0014', initials:'EV', initialsColor:'bg-tertiary-fixed-dim text-on-tertiary-fixed', action:'Modified Config', actionColor:'bg-surface-variant text-on-surface-variant', entity:'Payment Gateway Settings', entityDetail:'Webhook URL update', entityDetailColor:'text-on-surface-variant', ipAddress:'88.21.0.122' },
  { id:'6', timestamp:'Yesterday, 14:10:45', date:'01 Oct 2023', userName:'Thorne, Julian', userRole:'Admin (ID: 0882)', userId:'0882', initials:'TH', initialsColor:'bg-secondary-fixed text-on-secondary-fixed', action:'Approved Payment', actionColor:'bg-[#e7f5ed] text-[#1e4620]', entity:'TXN-88201 — Azure Residences', entityDetail:'$280,000 verified', entityDetailColor:'text-primary', ipAddress:'192.168.1.144' },
  { id:'7', timestamp:'Yesterday, 10:05:22', date:'01 Oct 2023', userName:'Sari, Rina', userRole:'Agent (ID: 2201)', userId:'2201', initials:'RS', initialsColor:'bg-primary-fixed text-on-primary-fixed', action:'Created Listing', actionColor:'bg-tertiary-fixed/50 text-on-tertiary-fixed-variant', entity:'Unit V-12 — Villa Verde', entityDetail:'New unit registered', entityDetailColor:'text-tertiary', ipAddress:'103.25.88.201' },
  { id:'8', timestamp:'30 Sep, 22:00:00', date:'30 Sep 2023', userName:'System Automator', userRole:'Cron (ID: 0001)', userId:'0001', initials:'SYS', initialsColor:'bg-surface-variant text-on-surface-variant', action:'Backup Completed', actionColor:'bg-[#e7f5ed] text-[#1e4620]', entity:'Full Database Backup', entityDetail:'Size: 2.4 GB — Duration: 12m', entityDetailColor:'text-on-surface-variant', ipAddress:'Internal (AWS)' },
];

const actionFilters = ['All Actions','Updated Price','Booked Unit','Failed Login','Scheduled Archive','Modified Config','Approved Payment','Created Listing','Backup Completed'] as const;

export default function ReportingPage() {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('All Actions');
  const [showToast, setShowToast] = useState<{message:string;type:'success'|'error'|'info'}|null>(null);
  const [showLogDetail, setShowLogDetail] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog|null>(null);
  const [selectedReport, setSelectedReport] = useState<ExportReport|null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf'|'excel'>('pdf');
  const [exportDateRange, setExportDateRange] = useState({from:'', to:''});

  const modalRef = useRef<HTMLDivElement>(null);
  const notify = (m:string,t:'success'|'error'|'info'='info') => { setShowToast({message:m,type:t}); setTimeout(()=>setShowToast(null),3000); };

  const filteredLogs = logs.filter(l => {
    const matchSearch = searchQuery ? l.userName.toLowerCase().includes(searchQuery.toLowerCase()) || l.action.toLowerCase().includes(searchQuery.toLowerCase()) || l.entity.toLowerCase().includes(searchQuery.toLowerCase()) || l.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchAction = actionFilter === 'All Actions' ? true : l.action === actionFilter;
    return matchSearch && matchAction;
  });

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{if(e.key==='Escape'){setShowLogDetail(false);setShowExportModal(false);}};
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[]);

  const handleExport = (report: ExportReport, format: 'pdf'|'excel') => {
    setSelectedReport(report);
    setExportFormat(format);
    setExportDateRange({from:'', to:''});
    setShowExportModal(true);
  };

  const processExport = () => {
    setIsExporting(true);
    setTimeout(()=>{
      setIsExporting(false);
      setShowExportModal(false);
      notify(`${selectedReport?.title} (${exportFormat.toUpperCase()}) berhasil diunduh!`,'success');
    },2000);
  };

  const handleDeleteLog = (log: AuditLog) => {
    setLogs(logs.filter(l=>l.id!==log.id));
    setShowLogDetail(false);
    notify(`Log entry "${log.action}" berhasil dihapus.`,'success');
  };

  const MB = ({children,onClose,wide=false}:{children:React.ReactNode;onClose:()=>void;wide?:boolean}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={e=>{if(e.target===e.currentTarget) onClose();}}>
      <div ref={modalRef} className={`bg-white rounded-2xl shadow-2xl ${wide?'w-full max-w-4xl':'w-full max-w-lg'} max-h-[90vh] overflow-y-auto animate-fade-in-up my-8`} onClick={e=>e.stopPropagation()}>{children}</div>
    </div>
  );

  const Spinner = () => <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;

  // Stats
  const todayLogs = logs.filter(l=>l.date.includes('Oct 2023')).length;
  const failedLogins = logs.filter(l=>l.action==='Failed Login').length;
  const systemActions = logs.filter(l=>l.userName==='System Automator').length;

  return (
    <div className="p-10 max-w-[1400px] w-full mx-auto space-y-10">
      {/* Header */}
      <div>
        <h2 className="font-headline text-4xl font-bold text-on-surface mb-2">Reporting & Audit Log</h2>
        <p className="text-on-surface-variant max-w-2xl font-body leading-relaxed">Akses ekspor laporan fiskal dan catatan aktivitas sistem. Monitor pengawasan administratif dan verifikasi integritas struktural platform.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-fixed text-primary rounded-lg flex items-center justify-center"><Icon name="receipt_long"/></div>
          <div><p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Total Logs</p><p className="text-xl font-headline font-bold">{logs.length}</p></div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-tertiary-fixed text-tertiary rounded-lg flex items-center justify-center"><Icon name="today"/></div>
          <div><p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Hari Ini</p><p className="text-xl font-headline font-bold">{todayLogs}</p></div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-error-container text-on-error-container rounded-lg flex items-center justify-center"><Icon name="warning"/></div>
          <div><p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Failed Login</p><p className="text-xl font-headline font-bold text-error">{failedLogins}</p></div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center"><Icon name="smart_toy"/></div>
          <div><p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">System Auto</p><p className="text-xl font-headline font-bold">{systemActions}</p></div>
        </div>
      </div>

      {/* Export Center */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h3 className="font-headline text-xl font-bold text-on-surface">Export Center</h3>
          <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60">Generated {new Date().toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'})}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exportReports.map(report=>(
            <div key={report.id} className="group relative overflow-hidden bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container flex flex-col justify-between h-56 border border-transparent hover:border-outline-variant/20">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 ${report.iconBg} rounded-lg ${report.iconColor}`}>
                    <Icon name={report.icon} className="text-2xl"/>
                  </div>
                  <span className={`${report.badgeBg} px-2 py-1 rounded text-[10px] font-bold font-label uppercase`}>{report.badge}</span>
                </div>
                <h4 className="font-headline text-lg font-bold mb-1">{report.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{report.description}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={()=>handleExport(report,'excel')} className="flex-1 py-2 rounded font-label text-[10px] uppercase font-bold tracking-widest border border-outline-variant hover:bg-white transition-colors cursor-pointer">Excel</button>
                <button onClick={()=>handleExport(report,'pdf')} className="flex-1 py-2 rounded font-label text-[10px] uppercase font-bold tracking-widest bg-gradient-to-r from-primary to-primary-container text-white cursor-pointer">PDF</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audit Trail */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="font-headline text-xl font-bold">Audit Trail</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative max-w-xs">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg"/>
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Cari log..." className="bg-surface-container rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary border-none w-52"/>
            </div>
            <select value={actionFilter} onChange={e=>setActionFilter(e.target.value)} className="bg-surface-container border-none rounded-lg px-4 py-2 text-sm font-label font-medium focus:ring-2 focus:ring-primary cursor-pointer">
              {actionFilters.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
            <button onClick={()=>notify('Export audit trail...','info')} className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant/30 rounded-lg font-label text-xs font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">
              <Icon name="download" className="text-sm"/> Export View
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold border-b border-outline-variant/20">Timestamp</th>
                  <th className="px-6 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold border-b border-outline-variant/20">User Identity</th>
                  <th className="px-6 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold border-b border-outline-variant/20">Action</th>
                  <th className="px-6 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold border-b border-outline-variant/20">Entity</th>
                  <th className="px-6 py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold border-b border-outline-variant/20 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filteredLogs.map(log=>(
                  <tr key={log.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={()=>{setSelectedLog(log);setShowLogDetail(true);}}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-semibold">{log.timestamp}</p>
                      <p className="text-[10px] text-on-surface-variant opacity-60">{log.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${log.initialsColor} flex items-center justify-center font-bold text-[10px]`}>{log.initials}</div>
                        <div>
                          <p className="text-xs font-bold">{log.userName}</p>
                          <p className="text-[10px] text-on-surface-variant">{log.userRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded ${log.actionColor} text-[10px] font-bold font-label uppercase`}>{log.action}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium">{log.entity}</p>
                      <p className={`text-[10px] font-bold ${log.entityDetailColor}`}>{log.entityDetail}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[10px] text-on-surface-variant">{log.ipAddress}</td>
                  </tr>
                ))}
                {filteredLogs.length===0 && <tr><td colSpan={5} className="px-6 py-16 text-center text-on-surface-variant">Tidak ada log yang cocok.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low/30 border-t border-outline-variant/10">
            <p className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-widest">Showing {filteredLogs.length} of {logs.length} entries</p>
          </div>
        </div>
      </section>

      {/* System Status Footer */}
      <div className="bg-surface-container-highest rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <div className="flex flex-col"><span className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Database Integrity</span><span className="text-xs font-bold text-on-surface flex items-center gap-1.5"><span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(9,76,178,0.5)]"></span>Synchronized</span></div>
          <div className="flex flex-col"><span className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Encryption Status</span><span className="text-xs font-bold text-on-surface">AES-256 Enabled</span></div>
          <div className="flex flex-col"><span className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Last Backup</span><span className="text-xs font-bold text-on-surface">{logs.find(l=>l.action==='Backup Completed')?.timestamp || 'N/A'}</span></div>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Agent Properti v2.4.0</p>
          <button onClick={()=>notify('Mencetak laporan...','info')} className="p-2 rounded bg-white shadow-sm border border-outline-variant/20 hover:bg-surface transition-colors cursor-pointer"><Icon name="print" className="text-sm"/></button>
          <button onClick={()=>notify('Mengirim email laporan...','info')} className="p-2 rounded bg-white shadow-sm border border-outline-variant/20 hover:bg-surface transition-colors cursor-pointer"><Icon name="mail" className="text-sm"/></button>
        </div>
      </div>

      {/* ========== MODALS ========== */}

      {/* Log Detail */}
      {showLogDetail && selectedLog && (
        <MB onClose={()=>setShowLogDetail(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${selectedLog.initialsColor} flex items-center justify-center font-bold text-lg`}>{selectedLog.initials}</div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface">{selectedLog.userName}</h3>
                  <p className="text-sm text-on-surface-variant">{selectedLog.userRole}</p>
                </div>
              </div>
              <button onClick={()=>setShowLogDetail(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Detail Event</h4>
                <div className="flex justify-between items-center"><span className="text-sm text-on-surface-variant">Waktu</span><span className="text-sm font-bold">{selectedLog.timestamp}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-on-surface-variant">Tanggal</span><span className="text-sm font-medium">{selectedLog.date}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-on-surface-variant">Aksi</span><span className={`inline-flex items-center px-3 py-1 rounded ${selectedLog.actionColor} text-[10px] font-bold font-label uppercase`}>{selectedLog.action}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-on-surface-variant">IP Address</span><span className="text-sm font-mono font-medium">{selectedLog.ipAddress}</span></div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Entity Terdampak</h4>
                <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Entity</span><span className="text-sm font-bold">{selectedLog.entity}</span></div>
                <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Detail</span><span className={`text-sm font-bold ${selectedLog.entityDetailColor}`}>{selectedLog.entityDetail}</span></div>
                <div className="flex justify-between"><span className="text-sm text-on-surface-variant">User ID</span><span className="text-sm font-mono">{selectedLog.userId}</span></div>
              </div>
            </div>

            {selectedLog.action === 'Failed Login' && (
              <div className="bg-error-container/20 rounded-xl p-5 mb-6 flex items-start gap-4 border border-error/10">
                <Icon name="warning" className="text-2xl text-error mt-0.5"/>
                <div>
                  <p className="font-bold text-error mb-1">Peringatan Keamanan</p>
                  <p className="text-sm text-on-surface-variant">Terdeteksi percobaan login gagal dari IP <span className="font-mono font-bold">{selectedLog.ipAddress}</span>. Pertimbangkan untuk memblokir IP ini jika aktivitas mencurigakan berlanjut.</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/10">
              <button onClick={()=>handleDeleteLog(selectedLog)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error-container transition-colors cursor-pointer flex items-center gap-2"><Icon name="delete"/>Hapus Log</button>
              <button onClick={()=>setShowLogDetail(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer">Tutup</button>
            </div>
          </div>
        </MB>
      )}

      {/* Export Modal */}
      {showExportModal && selectedReport && (
        <MB onClose={()=>setShowExportModal(false)}>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${selectedReport.iconBg} rounded-lg ${selectedReport.iconColor}`}><Icon name={selectedReport.icon} className="text-2xl"/></div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface">{selectedReport.title}</h3>
                  <p className="text-xs text-on-surface-variant">Export sebagai {exportFormat.toUpperCase()}</p>
                </div>
              </div>
              <button onClick={()=>setShowExportModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl"/></button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-on-surface-variant mb-3">{selectedReport.description}</p>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Format File</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={()=>setExportFormat('pdf')} className={`py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${exportFormat==='pdf'?'bg-primary text-on-primary ring-2 ring-primary':'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}>
                    <Icon name="picture_as_pdf" className="text-lg"/> PDF
                  </button>
                  <button type="button" onClick={()=>setExportFormat('excel')} className={`py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${exportFormat==='excel'?'bg-tertiary text-on-tertiary ring-2 ring-tertiary':'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'}`}>
                    <Icon name="table_chart" className="text-lg"/> Excel
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Dari Tanggal</label>
                  <input type="date" value={exportDateRange.from} onChange={e=>setExportDateRange({...exportDateRange,from:e.target.value})} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Sampai Tanggal</label>
                  <input type="date" value={exportDateRange.to} onChange={e=>setExportDateRange({...exportDateRange,to:e.target.value})} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"/>
                </div>
              </div>

              {/* Export Progress */}
              {isExporting && (
                <div className="bg-primary-fixed/20 rounded-xl p-5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Spinner/>
                    <span className="text-sm font-medium text-primary">Generating report...</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{width:'70%'}}/>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button onClick={()=>setShowExportModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer">Batal</button>
              <button onClick={processExport} disabled={isExporting} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer disabled:opacity-70 flex items-center gap-2">
                {isExporting?<><Spinner/>Generating...</>:<><Icon name="download"/>Download {exportFormat.toUpperCase()}</>}
              </button>
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
