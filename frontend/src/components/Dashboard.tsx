import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatCards from './StatCards';
import SalesChart from './SalesChart';
import QuickActions from './QuickActions';
import TeamLeaderboard from './TeamLeaderboard';
import FlagshipProjects from './FlagshipProjects';
import DeveloperManagementPage from './DeveloperManagementPage';
import ProjectsPage from './ProjectsPage';
import InventoryPage from './InventoryPage';
import UserManagementPage from './UserManagementPage';
import FinancePage from './FinancePage';
import ReportingPage from './ReportingPage';
import SettingsProfileModals, { defaultProfile } from './SettingsProfileModals';
import type { AdminProfile } from './SettingsProfileModals';
import Icon from './Icon';

interface DashboardProps {
  onLogout: () => void;
}

const searchPlaceholders = [
  'Search projects, sales or users...',
  'Cari developer, perumahan, atau NIB...',
  'Cari project berdasarkan nama, lokasi, atau RERA ID...',
  'Cari unit berdasarkan nomor, tipe, atau block...',
  'Cari user, role, atau ID registrasi...',
  'Cari transaksi, ledger, atau akun...',
  'Cari log, laporan, atau user...',
];

export default function Dashboard({ onLogout }: DashboardProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(defaultProfile);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const renderDashboardHome = () => (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-on-surface tracking-tight mb-2">Portfolio Overview</h2>
          <p className="text-on-surface-variant max-w-lg font-body leading-relaxed">
            Ringkasan editorial dari kepemilikan properti Anda dan performa penjualan. Pantau metrik global di semua agen dan developer.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="px-4 py-2 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">
            <Icon name="calendar_today" className="text-sm" />
            Oct 24 — Oct 31, 2023
          </div>
          <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-label font-bold uppercase tracking-widest hover:shadow-lg transition-all cursor-pointer">
            Download Report
          </button>
        </div>
      </section>
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SalesChart />
        <QuickActions />
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TeamLeaderboard />
        <FlagshipProjects />
      </section>
    </div>
  );

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      {/* Sidebar */}
      <Sidebar
        onLogout={onLogout}
        activeIndex={pageIndex}
        onNavigate={setPageIndex}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content - responsive padding */}
      <main className="lg:pl-72 min-h-screen flex flex-col bg-surface-container-lowest">
        <Header
          searchPlaceholder={searchPlaceholders[pageIndex] || searchPlaceholders[0]}
          adminName={adminProfile.name}
          adminRole={adminProfile.role}
          adminAvatar={adminProfile.avatar}
          onSettingsClick={() => setShowSettings(true)}
          onProfileClick={() => setShowProfile(true)}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        {pageIndex === 0 && renderDashboardHome()}
        {pageIndex === 1 && <DeveloperManagementPage />}
        {pageIndex === 2 && <ProjectsPage />}
        {pageIndex === 3 && <InventoryPage />}
        {pageIndex === 4 && <UserManagementPage />}
        {pageIndex === 5 && <FinancePage />}
        {pageIndex === 6 && <ReportingPage />}

        {pageIndex === 0 && (
          <footer className="mt-auto p-8 border-t border-outline-variant/10 text-center">
            <p className="text-[10px] font-label uppercase tracking-[0.25em] text-on-surface-variant font-semibold">
              Agent Properti © 2023 — Manajemen Sales Properti Dashboard
            </p>
          </footer>
        )}
      </main>

      {/* Settings & Profile Modals */}
      <SettingsProfileModals
        showSettings={showSettings}
        showProfile={showProfile}
        onCloseSettings={() => setShowSettings(false)}
        onCloseProfile={() => setShowProfile(false)}
        profile={adminProfile}
        onUpdateProfile={setAdminProfile}
        notify={notify}
      />

      {/* Global Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-fade-in-up">
          <div className={`px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${showToast.type === 'success' ? 'bg-tertiary text-on-tertiary' : showToast.type === 'error' ? 'bg-error text-on-error' : 'bg-inverse-surface text-inverse-on-surface'}`}>
            <Icon name={showToast.type === 'success' ? 'check_circle' : showToast.type === 'error' ? 'error' : 'info'} className="text-[18px]" />
            {showToast.message}
          </div>
        </div>
      )}
    </div>
  );
}
