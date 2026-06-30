import { useState } from 'react';
import Icon from '../Icon';

interface Props { notify:(m:string,t:'success'|'error'|'info')=>void; }

interface Commission { id:string; project:string; unit:string; client:string; amount:number; status:'Pending'|'Approved'|'Paid'; date:string; }
interface Leaderboard { rank:number; name:string; initials:string; closings:number; revenue:number; isMe:boolean; }

const commissions: Commission[] = [
  {id:'1',project:'The Obsidian Groves',unit:'Unit 402',client:'Richard Montgomery',amount:12400,status:'Pending',date:'14 Mar'},
  {id:'2',project:'The Obsidian Groves',unit:'Unit 1205',client:'David Kim',amount:18500,status:'Approved',date:'13 Mar'},
  {id:'3',project:'Marine Wharf',unit:'Suite 12',client:'Maria Santos',amount:8750,status:'Approved',date:'10 Mar'},
  {id:'4',project:'Alabaster Heights',unit:'Penthouse C',client:'Nadia Kwon',amount:24000,status:'Paid',date:'8 Mar'},
  {id:'5',project:'Azure Residences',unit:'Unit 25-01',client:'Emily Davis',amount:5500,status:'Paid',date:'5 Mar'},
];

const leaderboard: Leaderboard[] = [
  {rank:1,name:'Diana Mercer',initials:'DM',closings:8,revenue:2100000,isMe:false},
  {rank:2,name:'Julian Vance',initials:'JV',closings:6,revenue:1450000,isMe:true},
  {rank:3,name:'Sophia Liao',initials:'SL',closings:4,revenue:920000,isMe:false},
  {rank:4,name:'Mark Rivera',initials:'MR',closings:3,revenue:680000,isMe:false},
  {rank:5,name:'Sarah Jenkins',initials:'SJ',closings:1,revenue:220000,isMe:false},
];

const fp = (n:number) => '$'+n.toLocaleString();
const statusStyle = (s:string) => s==='Pending'?'bg-tertiary-fixed text-on-tertiary-fixed-variant':s==='Approved'?'bg-primary-fixed text-on-primary-fixed-variant':'bg-[#e7f5ed] text-[#1e4620]';
const statusIcon = (s:string) => s==='Pending'?'schedule':s==='Approved'?'check_circle':'paid';

export default function FinanceTab({ notify: _notify }: Props) {
  void _notify;
  const [view, setView] = useState<'wallet'|'leaderboard'>('wallet');
  const totalPending = commissions.filter(c=>c.status==='Pending').reduce((s,c)=>s+c.amount,0);
  const totalApproved = commissions.filter(c=>c.status==='Approved').reduce((s,c)=>s+c.amount,0);
  const totalPaid = commissions.filter(c=>c.status==='Paid').reduce((s,c)=>s+c.amount,0);

  return (
    <div>
      <div className="bg-primary px-5 pb-5 pt-2 rounded-b-3xl">
        <h2 className="text-white font-headline text-xl font-bold mb-3">Keuangan</h2>
        <div className="flex gap-2 bg-white/15 rounded-xl p-1">
          <button onClick={()=>setView('wallet')} className={`flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1 ${view==='wallet'?'bg-white text-primary':'text-white/70'}`}><Icon name="account_balance_wallet" className="text-sm"/>Dompet Komisi</button>
          <button onClick={()=>setView('leaderboard')} className={`flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1 ${view==='leaderboard'?'bg-white text-primary':'text-white/70'}`}><Icon name="leaderboard" className="text-sm"/>Leaderboard</button>
        </div>
      </div>

      {view==='wallet' && (
        <div className="px-4 py-4 space-y-4">
          {/* Balance Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-tertiary-fixed/30 rounded-xl p-3 text-center"><Icon name="schedule" className="text-tertiary text-lg"/><p className="text-lg font-headline font-bold text-tertiary mt-1">{fp(totalPending)}</p><p className="text-[9px] text-on-surface-variant uppercase">Pending</p></div>
            <div className="bg-primary-fixed/30 rounded-xl p-3 text-center"><Icon name="check_circle" className="text-primary text-lg"/><p className="text-lg font-headline font-bold text-primary mt-1">{fp(totalApproved)}</p><p className="text-[9px] text-on-surface-variant uppercase">Approved</p></div>
            <div className="bg-[#e7f5ed] rounded-xl p-3 text-center"><Icon name="paid" className="text-[#1e4620] text-lg"/><p className="text-lg font-headline font-bold text-[#1e4620] mt-1">{fp(totalPaid)}</p><p className="text-[9px] text-on-surface-variant uppercase">Paid</p></div>
          </div>

          {/* Commission List */}
          <div className="space-y-3">
            {commissions.map(c=>(
              <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusStyle(c.status)}`}><Icon name={statusIcon(c.status)}/></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between"><h3 className="text-sm font-bold truncate mr-2">{c.project}</h3><span className="text-sm font-bold text-primary shrink-0">{fp(c.amount)}</span></div>
                  <p className="text-[10px] text-on-surface-variant">{c.unit} • {c.client}</p>
                  <div className="flex justify-between items-center mt-1"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${statusStyle(c.status)}`}>{c.status}</span><span className="text-[10px] text-on-surface-variant">{c.date}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view==='leaderboard' && (
        <div className="px-4 py-4 space-y-4">
          {/* Podium */}
          <div className="bg-gradient-to-b from-primary to-primary-container rounded-2xl p-5 text-white text-center">
            <Icon name="emoji_events" className="text-4xl mb-1 opacity-80"/>
            <p className="text-xs opacity-70 uppercase font-label mb-2">Sales Leaderboard — Bulan Ini</p>
            <p className="text-2xl font-headline font-bold">{leaderboard[0].name}</p>
            <p className="text-sm opacity-80">{leaderboard[0].closings} closing • {fp(leaderboard[0].revenue)}</p>
          </div>

          {/* Ranking */}
          <div className="space-y-2">
            {leaderboard.map(l=>(
              <div key={l.rank} className={`flex items-center gap-3 p-3 rounded-xl ${l.isMe?'bg-primary-fixed/30 border-2 border-primary/30':'bg-white border border-outline-variant/10'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${l.rank===1?'bg-tertiary-fixed text-on-tertiary-fixed':l.rank===2?'bg-primary-fixed text-on-primary-fixed':'bg-surface-container text-on-surface-variant'}`}>{l.rank}</div>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">{l.initials}</div>
                <div className="flex-1"><p className="text-sm font-bold">{l.name}{l.isMe&&<span className="text-[9px] text-primary ml-1 font-label uppercase"> (Anda)</span>}</p><p className="text-[10px] text-on-surface-variant">{l.closings} closing</p></div>
                <p className="text-sm font-bold text-primary">{fp(l.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
