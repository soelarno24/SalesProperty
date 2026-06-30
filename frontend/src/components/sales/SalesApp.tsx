import { useState, useEffect } from 'react';
import Icon from '../Icon';
import DashboardTab from './DashboardTab';
import CatalogTab from './CatalogTab';
import CRMTab from './CRMTab';
import ActivityTab from './ActivityTab';
import ProfileTab from './ProfileTab';

interface Props { onLogout:()=>void; }

const tabs = [
  {icon:'dashboard',label:'Home'},
  {icon:'home_work',label:'Katalog'},
  {icon:'contacts',label:'CRM'},
  {icon:'fact_check',label:'Aktivitas'},
  {icon:'person',label:'Profil'},
];

export default function SalesApp({ onLogout }: Props) {
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState<{m:string;t:'success'|'error'|'info'}|null>(null);
  const notify = (m:string,t:'success'|'error'|'info'='info') => { setToast({m,t}); setTimeout(()=>setToast(null),3000); };

  useEffect(()=>{ document.documentElement.style.setProperty('--sal-safe-bottom','env(safe-area-inset-bottom, 0px)'); },[]);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen max-w-md mx-auto relative" style={{maxWidth:'430px'}}>
      {/* Status Bar Mock */}
      <div className="sticky top-0 z-40 bg-primary px-5 pt-2 pb-3 flex justify-between items-center text-white text-[10px] font-label">
        <span>9:41</span>
        <span className="font-headline text-sm font-bold tracking-tight">Agent Properti</span>
        <div className="flex items-center gap-1"><Icon name="signal_cellular_alt" className="text-xs"/><Icon name="battery_full" className="text-xs"/></div>
      </div>

      {/* Page Content */}
      <div className="pb-20">
        {tab===0 && <DashboardTab notify={notify}/>}
        {tab===1 && <CatalogTab notify={notify}/>}
        {tab===2 && <CRMTab notify={notify}/>}
        {tab===3 && <ActivityTab notify={notify}/>}
        {tab===4 && <ProfileTab notify={notify} onLogout={onLogout}/>}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-surface-container-lowest border-t border-outline-variant/15 flex justify-around items-center py-2 pb-3 z-50" style={{maxWidth:'430px'}}>
        {tabs.map((t,i)=>(
          <button key={t.label} onClick={()=>setTab(i)} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg cursor-pointer transition-all ${tab===i?'text-primary':'text-on-surface-variant'}`}>
            <Icon name={t.icon} className={`text-xl ${tab===i?'':'opacity-50'}`}/>
            <span className={`text-[9px] font-label font-bold ${tab===i?'':'opacity-50'}`}>{t.label}</span>
            {tab===i && <div className="w-4 h-0.5 bg-primary rounded-full"/>}
          </button>
        ))}
      </nav>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-up" style={{maxWidth:'400px'}}>
          <div className={`px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${toast.t==='success'?'bg-tertiary text-on-tertiary':toast.t==='error'?'bg-error text-on-error':'bg-inverse-surface text-inverse-on-surface'}`}>
            <Icon name={toast.t==='success'?'check_circle':toast.t==='error'?'error':'info'} className="text-lg"/>{toast.m}
          </div>
        </div>
      )}
    </div>
  );
}
