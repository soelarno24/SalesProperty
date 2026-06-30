import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface Developer {
  id: string;
  name: string;
  initial: string;
  established: string;
  location: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  projects: number;
  projectProgress: number;
  legalStatus: 'Verified Institutional' | 'Review Pending';
  // Extended details
  taxId: string;
  businessLicense: string;
  licenseExpiry: string;
  insuranceCert: string;
  insuranceExpiry: string;
  totalUnits: number;
  completedProjects: number;
  onTimeDelivery: number;
  qualityScore: number;
  lastAuditDate: string;
  auditStatus: 'Passed' | 'Pending' | 'Failed';
}

const initialDevelopers: Developer[] = [
  {
    id: '1',
    name: 'Vanguard Urban Developments',
    initial: 'V',
    established: '2012',
    location: 'London, UK',
    contactName: 'Eleanor Vance',
    contactEmail: 'e.vance@vanguard-urban.co',
    contactPhone: '+44 20 7946 0958',
    projects: 14,
    projectProgress: 75,
    legalStatus: 'Verified Institutional',
    taxId: 'GB123456789',
    businessLicense: 'BL-2012-UK-4521',
    licenseExpiry: '2025-12-31',
    insuranceCert: 'INS-VUD-2024-001',
    insuranceExpiry: '2025-06-30',
    totalUnits: 1250,
    completedProjects: 28,
    onTimeDelivery: 92,
    qualityScore: 94,
    lastAuditDate: '2024-01-15',
    auditStatus: 'Passed',
  },
  {
    id: '2',
    name: 'Arcadia Living Group',
    initial: 'A',
    established: '2018',
    location: 'Milan, Italy',
    contactName: 'Marco Belmonte',
    contactEmail: 'm.belmonte@arcadia.it',
    contactPhone: '+39 02 1234 5678',
    projects: 3,
    projectProgress: 25,
    legalStatus: 'Review Pending',
    taxId: 'IT98765432100',
    businessLicense: 'BL-2018-IT-8832',
    licenseExpiry: '2024-08-15',
    insuranceCert: 'INS-ALG-2024-002',
    insuranceExpiry: '2024-12-31',
    totalUnits: 180,
    completedProjects: 5,
    onTimeDelivery: 78,
    qualityScore: 72,
    lastAuditDate: '2023-11-20',
    auditStatus: 'Pending',
  },
  {
    id: '3',
    name: 'Stonegate Collective',
    initial: 'S',
    established: '1995',
    location: 'New York, USA',
    contactName: 'Sarah Jenkins',
    contactEmail: 's.jenkins@stonegate.com',
    contactPhone: '+1 212 555 0147',
    projects: 32,
    projectProgress: 100,
    legalStatus: 'Verified Institutional',
    taxId: 'US-EIN-12-3456789',
    businessLicense: 'BL-1995-NY-0012',
    licenseExpiry: '2026-03-31',
    insuranceCert: 'INS-SGC-2024-003',
    insuranceExpiry: '2025-09-30',
    totalUnits: 4200,
    completedProjects: 85,
    onTimeDelivery: 96,
    qualityScore: 98,
    lastAuditDate: '2024-02-28',
    auditStatus: 'Passed',
  },
  {
    id: '4',
    name: 'Lighthouse Estuary',
    initial: 'L',
    established: '2021',
    location: 'Vancouver, CA',
    contactName: 'David Chen',
    contactEmail: 'd.chen@lighthouse.ca',
    contactPhone: '+1 604 555 0198',
    projects: 8,
    projectProgress: 50,
    legalStatus: 'Verified Institutional',
    taxId: 'CA-BN-123456789',
    businessLicense: 'BL-2021-BC-1122',
    licenseExpiry: '2025-07-15',
    insuranceCert: 'INS-LHE-2024-004',
    insuranceExpiry: '2025-03-31',
    totalUnits: 420,
    completedProjects: 12,
    onTimeDelivery: 88,
    qualityScore: 85,
    lastAuditDate: '2024-01-05',
    auditStatus: 'Passed',
  },
];

const tabs = ['All Entities', 'Verified Only', 'Pending Approval'] as const;

const emptyFormData = {
  name: '',
  established: '',
  location: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  projects: 0,
  legalStatus: 'Review Pending' as 'Verified Institutional' | 'Review Pending',
  taxId: '',
  businessLicense: '',
  licenseExpiry: '',
  insuranceCert: '',
  insuranceExpiry: '',
};

export default function DeveloperManagementPage() {
  const [developers, setDevelopers] = useState<Developer[]>(initialDevelopers);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All Entities');
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage] = useState(1);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditInProgress, setAuditInProgress] = useState(false);
  const [auditResults, setAuditResults] = useState<{devId: string; status: 'checking' | 'passed' | 'failed' | 'warning'}[]>([]);

  const modalRef = useRef<HTMLDivElement>(null);

  const filteredDevelopers = developers.filter((dev) => {
    if (searchQuery) {
      return (
        dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeTab === 'Verified Only') return dev.legalStatus === 'Verified Institutional';
    if (activeTab === 'Pending Approval') return dev.legalStatus === 'Review Pending';
    return true;
  });

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setShowDetailModal(false);
        setShowPerformanceModal(false);
        setShowAuditModal(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (showAddModal) {
      setFormData(emptyFormData);
      setFormErrors({});
    }
  }, [showAddModal]);

  useEffect(() => {
    if (showEditModal && selectedDeveloper) {
      setFormData({
        name: selectedDeveloper.name,
        established: selectedDeveloper.established,
        location: selectedDeveloper.location,
        contactName: selectedDeveloper.contactName,
        contactEmail: selectedDeveloper.contactEmail,
        contactPhone: selectedDeveloper.contactPhone,
        projects: selectedDeveloper.projects,
        legalStatus: selectedDeveloper.legalStatus,
        taxId: selectedDeveloper.taxId,
        businessLicense: selectedDeveloper.businessLicense,
        licenseExpiry: selectedDeveloper.licenseExpiry,
        insuranceCert: selectedDeveloper.insuranceCert,
        insuranceExpiry: selectedDeveloper.insuranceExpiry,
      });
      setFormErrors({});
    }
  }, [showEditModal, selectedDeveloper]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Nama perusahaan wajib diisi';
    if (!formData.established.trim()) errors.established = 'Tahun berdiri wajib diisi';
    if (!/^\d{4}$/.test(formData.established)) errors.established = 'Format tahun tidak valid (YYYY)';
    if (!formData.location.trim()) errors.location = 'Lokasi wajib diisi';
    if (!formData.contactName.trim()) errors.contactName = 'Nama kontak wajib diisi';
    if (!formData.contactEmail.trim()) errors.contactEmail = 'Email kontak wajib diisi';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) errors.contactEmail = 'Format email tidak valid';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddDeveloper = () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const newDeveloper: Developer = {
        id: String(Date.now()),
        name: formData.name,
        initial: formData.name.charAt(0).toUpperCase(),
        established: formData.established,
        location: formData.location,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || '-',
        projects: formData.projects,
        projectProgress: Math.min(formData.projects * 3, 100),
        legalStatus: formData.legalStatus,
        taxId: formData.taxId || '-',
        businessLicense: formData.businessLicense || '-',
        licenseExpiry: formData.licenseExpiry || '-',
        insuranceCert: formData.insuranceCert || '-',
        insuranceExpiry: formData.insuranceExpiry || '-',
        totalUnits: 0,
        completedProjects: 0,
        onTimeDelivery: 0,
        qualityScore: 0,
        lastAuditDate: '-',
        auditStatus: 'Pending',
      };
      setDevelopers([newDeveloper, ...developers]);
      setShowAddModal(false);
      setIsSubmitting(false);
      notify(`Developer "${formData.name}" berhasil ditambahkan!`, 'success');
    }, 800);
  };

  const handleEditDeveloper = () => {
    if (!validateForm() || !selectedDeveloper) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setDevelopers(
        developers.map((dev) =>
          dev.id === selectedDeveloper.id
            ? {
                ...dev,
                name: formData.name,
                initial: formData.name.charAt(0).toUpperCase(),
                established: formData.established,
                location: formData.location,
                contactName: formData.contactName,
                contactEmail: formData.contactEmail,
                contactPhone: formData.contactPhone,
                projects: formData.projects,
                projectProgress: Math.min(formData.projects * 3, 100),
                legalStatus: formData.legalStatus,
                taxId: formData.taxId,
                businessLicense: formData.businessLicense,
                licenseExpiry: formData.licenseExpiry,
                insuranceCert: formData.insuranceCert,
                insuranceExpiry: formData.insuranceExpiry,
              }
            : dev
        )
      );
      setShowEditModal(false);
      setIsSubmitting(false);
      notify(`Developer "${formData.name}" berhasil diperbarui!`, 'success');
    }, 800);
  };

  const handleDeleteDeveloper = () => {
    if (!selectedDeveloper) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setDevelopers(developers.filter((dev) => dev.id !== selectedDeveloper.id));
      setShowDeleteModal(false);
      setIsSubmitting(false);
      notify(`Developer "${selectedDeveloper.name}" berhasil dihapus!`, 'success');
      setSelectedDeveloper(null);
    }, 600);
  };

  const openDetailModal = (dev: Developer) => {
    setSelectedDeveloper(dev);
    setShowDetailModal(true);
  };

  const openEditModal = (dev: Developer) => {
    setSelectedDeveloper(dev);
    setShowEditModal(true);
  };

  const openDeleteModal = (dev: Developer) => {
    setSelectedDeveloper(dev);
    setShowDeleteModal(true);
  };

  const runComplianceAudit = () => {
    setAuditInProgress(true);
    setAuditResults([]);
    
    developers.forEach((dev, index) => {
      setTimeout(() => {
        setAuditResults(prev => [...prev, { devId: dev.id, status: 'checking' }]);
        
        setTimeout(() => {
          const isExpiringSoon = new Date(dev.licenseExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
          const isInsuranceExpiring = new Date(dev.insuranceExpiry) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
          const isPending = dev.legalStatus === 'Review Pending';
          
          let status: 'passed' | 'failed' | 'warning' = 'passed';
          if (isPending) status = 'failed';
          else if (isExpiringSoon || isInsuranceExpiring) status = 'warning';
          
          setAuditResults(prev => prev.map(r => r.devId === dev.id ? { ...r, status } : r));
          
          if (index === developers.length - 1) {
            setTimeout(() => setAuditInProgress(false), 500);
          }
        }, 800);
      }, index * 600);
    });
  };

  // Modal Components
  const ModalBackdrop = ({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-2xl ${wide ? 'w-full max-w-4xl' : 'w-full max-w-lg'} max-h-[90vh] overflow-y-auto animate-fade-in-up my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  const FormInput = ({
    label, name, type = 'text', placeholder, value, onChange, error, disabled = false,
  }: {
    label: string; name: string; type?: string; placeholder?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; disabled?: boolean;
  }) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        className={`w-full px-4 py-3 bg-surface-container-low border rounded-lg text-sm outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
          error ? 'border-error focus:ring-2 focus:ring-error/20' : 'border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-primary'
        }`}
      />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );

  const FormSelect = ({
    label, name, value, onChange, options,
  }: {
    label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[];
  }) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer">
        {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
    </div>
  );

  const InfoRow = ({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) => (
    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-0">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-primary' : 'text-on-surface'}`}>{value}</span>
    </div>
  );

  const ScoreBar = ({ label, value, color = 'primary' }: { label: string; value: number; color?: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-on-surface-variant">{label}</span>
        <span className="font-bold text-on-surface">{value}%</span>
      </div>
      <div className="h-2 bg-surface-container rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            color === 'primary' ? 'bg-primary' : color === 'tertiary' ? 'bg-tertiary' : color === 'error' ? 'bg-error' : 'bg-secondary'
          }`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-tertiary';
    if (score >= 70) return 'text-primary';
    if (score >= 50) return 'text-secondary';
    return 'text-error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Sangat Baik';
    if (score >= 70) return 'Baik';
    if (score >= 50) return 'Cukup';
    return 'Perlu Perbaikan';
  };

  return (
    <div className="p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-headline font-bold text-on-surface leading-tight">Developer Management</h2>
          <p className="mt-4 text-on-surface-variant font-body text-lg leading-relaxed max-w-xl">
            Registrasi mitra developer perumahan dan rekanan institusi. Kelola legal compliance, pantau portofolio aktif, dan orkestrasi hubungan institusional baru.
          </p>
        </div>
        <div>
          <button onClick={() => setShowAddModal(true)} className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-medium shadow-lg hover:shadow-primary/20 transition-all active:scale-95 cursor-pointer">
            <Icon name="add" className="text-xl" />
            <span>Tambah Developer Baru</span>
          </button>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-40 border border-outline-variant/10">
          <span className="font-label uppercase text-[10px] tracking-widest font-bold text-tertiary">Mitra Aktif</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold">{developers.length}</span>
            <span className="text-xs text-primary font-semibold">+{developers.length > 4 ? developers.length - 4 : 0} baru</span>
          </div>
        </div>
        <div className="bg-surface-container-high p-8 rounded-xl flex flex-col justify-between h-40 border border-outline-variant/10">
          <span className="font-label uppercase text-[10px] tracking-widest font-bold text-on-surface-variant">Portofolio Global</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold">{(developers.reduce((sum, d) => sum + d.totalUnits, 0) / 1000).toFixed(1)}k</span>
            <span className="text-xs text-on-surface-variant">Unit dalam pengelolaan</span>
          </div>
        </div>
        <div className="bg-surface-dim p-8 rounded-xl flex flex-col justify-between h-40 relative overflow-hidden border border-outline-variant/10">
          <span className="font-label uppercase text-[10px] tracking-widest font-bold text-on-surface relative z-10">Tingkat Kepatuhan</span>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-headline font-bold">
              {((developers.filter((d) => d.legalStatus === 'Verified Institutional').length / developers.length) * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-primary font-semibold">
              {developers.filter((d) => d.legalStatus === 'Verified Institutional').length >= developers.length * 0.7 ? 'Sangat Baik' : 'Perlu Perhatian'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Table */}
      <section className="bg-white rounded-2xl overflow-hidden border border-outline-variant/8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-8 py-6 border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="flex gap-6 flex-wrap">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`text-sm font-label transition-colors pb-1 cursor-pointer ${activeTab === tab ? 'font-bold border-b-2 border-primary text-primary' : 'font-semibold text-on-surface-variant hover:text-on-surface'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => notify('Filter lanjutan dibuka', 'info')} className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer" aria-label="Filter">
              <Icon name="filter_list" className="text-sm" />
            </button>
            <button onClick={() => notify('Ekspor CSV dimulai', 'info')} className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer" aria-label="Download">
              <Icon name="download" className="text-sm" />
            </button>
          </div>
        </div>

        <div className="px-8 pt-5 pb-0">
          <div className="relative max-w-sm">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari developer, registry, atau NIB..." className="w-full bg-surface-container-low rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Nama Perusahaan</th>
                <th className="px-8 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Kontak Utama</th>
                <th className="px-8 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Proyek Aktif</th>
                <th className="px-8 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Status Legal</th>
                <th className="px-8 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredDevelopers.map((dev) => (
                <tr key={dev.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center font-headline font-bold text-primary italic shrink-0">{dev.initial}</div>
                      <div>
                        <p className="font-body font-semibold text-on-surface">{dev.name}</p>
                        <p className="text-xs text-on-surface-variant font-label">Est. {dev.established} • {dev.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div>
                      <p className="font-body text-sm text-on-surface">{dev.contactName}</p>
                      <p className="text-[11px] text-primary font-medium">{dev.contactEmail}</p>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <span className="block h-full bg-primary rounded-full" style={{ width: `${dev.projectProgress}%` }} />
                      </span>
                      <span className="text-sm font-body font-medium whitespace-nowrap">{dev.projects} Proyek</span>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider whitespace-nowrap ${dev.legalStatus === 'Verified Institutional' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {dev.legalStatus === 'Verified Institutional' ? 'Terverifikasi' : 'Menunggu Review'}
                    </span>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openDetailModal(dev)} className="p-2 hover:bg-primary-fixed rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="Lihat Detail">
                        <Icon name="visibility" className="text-xl" />
                      </button>
                      <button onClick={() => openEditModal(dev)} className="p-2 hover:bg-primary-fixed rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="Edit">
                        <Icon name="edit_note" className="text-xl" />
                      </button>
                      <button onClick={() => openDeleteModal(dev)} className="p-2 hover:bg-error-container rounded-lg text-on-surface-variant hover:text-error transition-all cursor-pointer" title="Hapus">
                        <Icon name="delete" className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDevelopers.length === 0 && (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-on-surface-variant">Tidak ada developer yang cocok dengan pencarian Anda.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/10 bg-surface-container-lowest">
          <p className="text-xs font-label text-on-surface-variant">Menampilkan <span className="font-bold text-on-surface">1-{filteredDevelopers.length}</span> dari <span className="font-bold text-on-surface">{developers.length}</span> entri</p>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant cursor-pointer"><Icon name="chevron_left" className="text-base" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold cursor-pointer">{currentPage}</button>
            <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant cursor-pointer"><Icon name="chevron_right" className="text-base" /></button>
          </div>
        </div>
      </section>

      {/* Secondary Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group relative overflow-hidden bg-white p-8 rounded-2xl flex flex-col gap-6 hover:bg-surface-container transition-colors border border-outline-variant/8 shadow-sm">
          <div className="w-12 h-12 bg-primary-fixed text-primary rounded-xl flex items-center justify-center">
            <Icon name="gavel" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2 font-headline">Audit Kepatuhan Hukum</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Jalankan verifikasi sistem terhadap semua sertifikat asuransi developer dan perpanjangan izin untuk kuartal fiskal berjalan.</p>
          </div>
          <button onClick={() => setShowAuditModal(true)} className="mt-auto self-start text-sm font-label font-bold text-primary flex items-center gap-1 hover:underline underline-offset-4 cursor-pointer">
            Inisialisasi Permintaan Audit
            <Icon name="arrow_forward" className="text-base" />
          </button>
        </div>
        <div className="group relative overflow-hidden bg-white p-8 rounded-2xl flex flex-col gap-6 hover:bg-surface-container transition-colors border border-outline-variant/8 shadow-sm">
          <div className="w-12 h-12 bg-tertiary-fixed text-tertiary rounded-xl flex items-center justify-center">
            <Icon name="insights" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2 font-headline">Performa Developer</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Analisis timeline konstruksi historis vs. estimasi serah terima untuk menentukan skor kualitas internal tiap mitra institusional.</p>
          </div>
          <button onClick={() => setShowPerformanceModal(true)} className="mt-auto self-start text-sm font-label font-bold text-tertiary flex items-center gap-1 hover:underline underline-offset-4 cursor-pointer">
            Lihat Sistem Peringkat
            <Icon name="arrow_forward" className="text-base" />
          </button>
        </div>
      </section>

      <footer className="pt-10 pb-4 text-center">
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant opacity-35">© Agent Properti • Manajemen Sales Properti v2.4.0</p>
      </footer>

      {/* ==================== MODALS ==================== */}

      {/* Add Developer Modal */}
      {showAddModal && (
        <ModalBackdrop onClose={() => setShowAddModal(false)}>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Tambah Developer Baru</h3>
                <p className="text-sm text-on-surface-variant mt-1">Isi informasi developer untuk mendaftarkan mitra baru.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
                <Icon name="close" className="text-xl" />
              </button>
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAddDeveloper(); }}>
              <FormInput label="Nama Perusahaan *" name="name" placeholder="PT. Contoh Developer Indonesia" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={formErrors.name} />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Tahun Berdiri *" name="established" placeholder="2020" value={formData.established} onChange={(e) => setFormData({ ...formData, established: e.target.value })} error={formErrors.established} />
                <FormInput label="Lokasi *" name="location" placeholder="Jakarta, Indonesia" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} error={formErrors.location} />
              </div>
              <FormInput label="Nama Kontak Utama *" name="contactName" placeholder="Ahmad Wijaya" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} error={formErrors.contactName} />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Email Kontak *" name="contactEmail" type="email" placeholder="contact@developer.co.id" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} error={formErrors.contactEmail} />
                <FormInput label="No. Telepon" name="contactPhone" placeholder="+62 812 3456 7890" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Jumlah Proyek" name="projects" type="number" placeholder="0" value={formData.projects} onChange={(e) => setFormData({ ...formData, projects: parseInt(e.target.value) || 0 })} />
                <FormSelect label="Status Legal" name="legalStatus" value={formData.legalStatus} onChange={(e) => setFormData({ ...formData, legalStatus: e.target.value as 'Verified Institutional' | 'Review Pending' })} options={[{ value: 'Review Pending', label: 'Menunggu Review' }, { value: 'Verified Institutional', label: 'Terverifikasi' }]} />
              </div>
              <div className="pt-2 border-t border-outline-variant/10">
                <p className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-3">Dokumen Legal (Opsional)</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="NPWP / Tax ID" name="taxId" placeholder="XX.XXX.XXX.X-XXX.XXX" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
                  <FormInput label="No. Izin Usaha" name="businessLicense" placeholder="BL-XXXX-XX-XXXX" value={formData.businessLicense} onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                  {isSubmitting ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Menyimpan...</>) : (<><Icon name="add" className="text-lg" />Tambah Developer</>)}
                </button>
              </div>
            </form>
          </div>
        </ModalBackdrop>
      )}

      {/* Edit Developer Modal */}
      {showEditModal && selectedDeveloper && (
        <ModalBackdrop onClose={() => setShowEditModal(false)}>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Edit Developer</h3>
                <p className="text-sm text-on-surface-variant mt-1">Perbarui informasi untuk <span className="font-semibold">{selectedDeveloper.name}</span></p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
                <Icon name="close" className="text-xl" />
              </button>
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleEditDeveloper(); }}>
              <FormInput label="Nama Perusahaan *" name="name" placeholder="PT. Contoh Developer Indonesia" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={formErrors.name} />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Tahun Berdiri *" name="established" placeholder="2020" value={formData.established} onChange={(e) => setFormData({ ...formData, established: e.target.value })} error={formErrors.established} />
                <FormInput label="Lokasi *" name="location" placeholder="Jakarta, Indonesia" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} error={formErrors.location} />
              </div>
              <FormInput label="Nama Kontak Utama *" name="contactName" placeholder="Ahmad Wijaya" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} error={formErrors.contactName} />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Email Kontak *" name="contactEmail" type="email" placeholder="contact@developer.co.id" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} error={formErrors.contactEmail} />
                <FormInput label="No. Telepon" name="contactPhone" placeholder="+62 812 3456 7890" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Jumlah Proyek" name="projects" type="number" placeholder="0" value={formData.projects} onChange={(e) => setFormData({ ...formData, projects: parseInt(e.target.value) || 0 })} />
                <FormSelect label="Status Legal" name="legalStatus" value={formData.legalStatus} onChange={(e) => setFormData({ ...formData, legalStatus: e.target.value as 'Verified Institutional' | 'Review Pending' })} options={[{ value: 'Review Pending', label: 'Menunggu Review' }, { value: 'Verified Institutional', label: 'Terverifikasi' }]} />
              </div>
              <div className="pt-2 border-t border-outline-variant/10">
                <p className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-3">Dokumen Legal</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="NPWP / Tax ID" name="taxId" placeholder="XX.XXX.XXX.X-XXX.XXX" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
                  <FormInput label="No. Izin Usaha" name="businessLicense" placeholder="BL-XXXX-XX-XXXX" value={formData.businessLicense} onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormInput label="Masa Berlaku Izin" name="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })} />
                  <FormInput label="Masa Berlaku Asuransi" name="insuranceExpiry" type="date" value={formData.insuranceExpiry} onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/10">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                  {isSubmitting ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Menyimpan...</>) : (<><Icon name="save" className="text-lg" />Simpan Perubahan</>)}
                </button>
              </div>
            </form>
          </div>
        </ModalBackdrop>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDeveloper && (
        <ModalBackdrop onClose={() => setShowDeleteModal(false)}>
          <div className="p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-error-container flex items-center justify-center mb-6">
              <Icon name="delete_forever" className="text-3xl text-error" />
            </div>
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Hapus Developer?</h3>
              <p className="text-on-surface-variant leading-relaxed">Anda akan menghapus developer <span className="font-semibold text-on-surface">"{selectedDeveloper.name}"</span>.<br />Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center font-headline font-bold text-primary italic shrink-0">{selectedDeveloper.initial}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-on-surface truncate">{selectedDeveloper.name}</p>
                <p className="text-xs text-on-surface-variant">Est. {selectedDeveloper.established} • {selectedDeveloper.location}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-on-surface">{selectedDeveloper.projects} Proyek</p>
                <p className="text-xs text-on-surface-variant">{selectedDeveloper.contactName}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Batal</button>
              <button onClick={handleDeleteDeveloper} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-error text-on-error text-sm font-semibold hover:bg-error/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                {isSubmitting ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Menghapus...</>) : (<><Icon name="delete" className="text-lg" />Ya, Hapus Developer</>)}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Detail Developer Modal */}
      {showDetailModal && selectedDeveloper && (
        <ModalBackdrop onClose={() => setShowDetailModal(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary-fixed flex items-center justify-center font-headline text-3xl font-bold text-primary italic">{selectedDeveloper.initial}</div>
                <div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">{selectedDeveloper.name}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Est. {selectedDeveloper.established} • {selectedDeveloper.location}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${selectedDeveloper.legalStatus === 'Verified Institutional' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
                {selectedDeveloper.legalStatus === 'Verified Institutional' ? 'Terverifikasi' : 'Menunggu Review'}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${selectedDeveloper.auditStatus === 'Passed' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : selectedDeveloper.auditStatus === 'Failed' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                Audit: {selectedDeveloper.auditStatus === 'Passed' ? 'Lulus' : selectedDeveloper.auditStatus === 'Failed' ? 'Gagal' : 'Pending'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                    <Icon name="person" className="text-primary" /> Informasi Kontak
                  </h4>
                  <InfoRow label="Nama Kontak" value={selectedDeveloper.contactName} />
                  <InfoRow label="Email" value={selectedDeveloper.contactEmail} highlight />
                  <InfoRow label="Telepon" value={selectedDeveloper.contactPhone} />
                </div>

                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                    <Icon name="description" className="text-primary" /> Dokumen Legal
                  </h4>
                  <InfoRow label="NPWP / Tax ID" value={selectedDeveloper.taxId} />
                  <InfoRow label="No. Izin Usaha" value={selectedDeveloper.businessLicense} />
                  <InfoRow label="Masa Berlaku Izin" value={selectedDeveloper.licenseExpiry} />
                  <InfoRow label="No. Sertifikat Asuransi" value={selectedDeveloper.insuranceCert} />
                  <InfoRow label="Masa Berlaku Asuransi" value={selectedDeveloper.insuranceExpiry} />
                  <InfoRow label="Audit Terakhir" value={selectedDeveloper.lastAuditDate} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                    <Icon name="apartment" className="text-primary" /> Statistik Proyek
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-3xl font-headline font-bold text-primary">{selectedDeveloper.projects}</p>
                      <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Proyek Aktif</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-3xl font-headline font-bold text-tertiary">{selectedDeveloper.completedProjects}</p>
                      <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Proyek Selesai</p>
                    </div>
                  </div>
                  <InfoRow label="Total Unit Dikelola" value={selectedDeveloper.totalUnits.toLocaleString()} />
                </div>

                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                    <Icon name="insights" className="text-primary" /> Skor Performa
                  </h4>
                  <div className="space-y-4">
                    <ScoreBar label="Ketepatan Waktu Serah Terima" value={selectedDeveloper.onTimeDelivery} color={selectedDeveloper.onTimeDelivery >= 90 ? 'tertiary' : selectedDeveloper.onTimeDelivery >= 70 ? 'primary' : 'error'} />
                    <ScoreBar label="Skor Kualitas" value={selectedDeveloper.qualityScore} color={selectedDeveloper.qualityScore >= 90 ? 'tertiary' : selectedDeveloper.qualityScore >= 70 ? 'primary' : 'error'} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Rating Keseluruhan</span>
                    <span className={`text-2xl font-headline font-bold ${getScoreColor(Math.round((selectedDeveloper.onTimeDelivery + selectedDeveloper.qualityScore) / 2))}`}>
                      {Math.round((selectedDeveloper.onTimeDelivery + selectedDeveloper.qualityScore) / 2)}%
                      <span className="text-sm ml-2 font-normal">{getScoreLabel(Math.round((selectedDeveloper.onTimeDelivery + selectedDeveloper.qualityScore) / 2))}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button onClick={() => { setShowDetailModal(false); openEditModal(selectedDeveloper); }} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2">
                <Icon name="edit_note" className="text-lg" />Edit Developer
              </button>
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all cursor-pointer">Tutup</button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Performance Modal */}
      {showPerformanceModal && (
        <ModalBackdrop onClose={() => setShowPerformanceModal(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-3">
                  <div className="w-10 h-10 bg-tertiary-fixed text-tertiary rounded-xl flex items-center justify-center"><Icon name="insights" /></div>
                  Performa Developer
                </h3>
                <p className="text-sm text-on-surface-variant mt-2">Analisis performa dan peringkat mitra developer berdasarkan ketepatan waktu dan kualitas.</p>
              </div>
              <button onClick={() => setShowPerformanceModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-tertiary-fixed/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-headline font-bold text-tertiary">{developers.filter(d => (d.onTimeDelivery + d.qualityScore) / 2 >= 90).length}</p>
                <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Sangat Baik</p>
              </div>
              <div className="bg-primary-fixed/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-headline font-bold text-primary">{developers.filter(d => { const avg = (d.onTimeDelivery + d.qualityScore) / 2; return avg >= 70 && avg < 90; }).length}</p>
                <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Baik</p>
              </div>
              <div className="bg-error-container/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-headline font-bold text-error">{developers.filter(d => (d.onTimeDelivery + d.qualityScore) / 2 < 70).length}</p>
                <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Perlu Perbaikan</p>
              </div>
            </div>

            {/* Performance Table */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container">
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Peringkat</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Developer</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold text-center">Ketepatan Waktu</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold text-center">Skor Kualitas</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold text-center">Rating</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {[...developers]
                    .sort((a, b) => ((b.onTimeDelivery + b.qualityScore) / 2) - ((a.onTimeDelivery + a.qualityScore) / 2))
                    .map((dev, index) => {
                      const avgScore = Math.round((dev.onTimeDelivery + dev.qualityScore) / 2);
                      return (
                        <tr key={dev.id} className="hover:bg-white transition-colors">
                          <td className="px-6 py-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : index === 1 ? 'bg-primary-fixed text-on-primary-fixed' : index === 2 ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-on-surface-variant'}`}>
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center font-headline font-bold text-primary italic">{dev.initial}</div>
                              <div>
                                <p className="font-semibold text-on-surface">{dev.name}</p>
                                <p className="text-xs text-on-surface-variant">{dev.completedProjects} proyek selesai</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-surface-container rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${dev.onTimeDelivery >= 90 ? 'bg-tertiary' : dev.onTimeDelivery >= 70 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${dev.onTimeDelivery}%` }} />
                              </div>
                              <span className="text-sm font-medium">{dev.onTimeDelivery}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-surface-container rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${dev.qualityScore >= 90 ? 'bg-tertiary' : dev.qualityScore >= 70 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${dev.qualityScore}%` }} />
                              </div>
                              <span className="text-sm font-medium">{dev.qualityScore}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-xl font-headline font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${avgScore >= 90 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : avgScore >= 70 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-error-container text-on-error-container'}`}>
                              {getScoreLabel(avgScore)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button onClick={() => notify('Ekspor laporan performa...', 'info')} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2">
                <Icon name="download" className="text-lg" />Ekspor Laporan
              </button>
              <button onClick={() => setShowPerformanceModal(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all cursor-pointer">Tutup</button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Audit Modal */}
      {showAuditModal && (
        <ModalBackdrop onClose={() => setShowAuditModal(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-fixed text-primary rounded-xl flex items-center justify-center"><Icon name="gavel" /></div>
                  Audit Kepatuhan Hukum
                </h3>
                <p className="text-sm text-on-surface-variant mt-2">Verifikasi sertifikat, izin usaha, dan dokumen asuransi semua developer.</p>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            {/* Audit Summary */}
            {auditResults.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                  <p className="text-2xl font-headline font-bold text-on-surface">{developers.length}</p>
                  <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Total</p>
                </div>
                <div className="bg-tertiary-fixed/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-headline font-bold text-tertiary">{auditResults.filter(r => r.status === 'passed').length}</p>
                  <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Lulus</p>
                </div>
                <div className="bg-tertiary-fixed-dim/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-headline font-bold text-on-tertiary-fixed-variant">{auditResults.filter(r => r.status === 'warning').length}</p>
                  <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Peringatan</p>
                </div>
                <div className="bg-error-container/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-headline font-bold text-error">{auditResults.filter(r => r.status === 'failed').length}</p>
                  <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Gagal</p>
                </div>
              </div>
            )}

            {/* Audit Table */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container">
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Developer</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Izin Usaha</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Asuransi</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold">Status Legal</th>
                    <th className="px-6 py-4 font-label uppercase text-[10px] tracking-widest text-on-surface-variant font-bold text-center">Hasil Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {developers.map((dev) => {
                    const result = auditResults.find(r => r.devId === dev.id);
                    const licenseExpiring = new Date(dev.licenseExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                    const insuranceExpiring = new Date(dev.insuranceExpiry) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <tr key={dev.id} className="hover:bg-white transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center font-headline font-bold text-primary italic">{dev.initial}</div>
                            <div>
                              <p className="font-semibold text-on-surface">{dev.name}</p>
                              <p className="text-xs text-on-surface-variant">{dev.taxId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-on-surface">{dev.businessLicense}</p>
                          <p className={`text-xs ${licenseExpiring ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>
                            Exp: {dev.licenseExpiry} {licenseExpiring && '⚠️'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-on-surface">{dev.insuranceCert}</p>
                          <p className={`text-xs ${insuranceExpiring ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>
                            Exp: {dev.insuranceExpiry} {insuranceExpiring && '⚠️'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${dev.legalStatus === 'Verified Institutional' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
                            {dev.legalStatus === 'Verified Institutional' ? 'Terverifikasi' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {result ? (
                            result.status === 'checking' ? (
                              <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                <span className="text-sm text-on-surface-variant">Memeriksa...</span>
                              </div>
                            ) : (
                              <span className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider inline-flex items-center gap-1 ${result.status === 'passed' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : result.status === 'warning' ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' : 'bg-error-container text-on-error-container'}`}>
                                <Icon name={result.status === 'passed' ? 'check_circle' : result.status === 'warning' ? 'warning' : 'cancel'} className="text-sm" />
                                {result.status === 'passed' ? 'Lulus' : result.status === 'warning' ? 'Peringatan' : 'Gagal'}
                              </span>
                            )
                          ) : (
                            <span className="text-sm text-on-surface-variant">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
              <div className="text-sm text-on-surface-variant">
                {auditInProgress ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Audit sedang berjalan...
                  </span>
                ) : auditResults.length > 0 ? (
                  <span className="flex items-center gap-2 text-tertiary">
                    <Icon name="check_circle" className="text-lg" />
                    Audit selesai
                  </span>
                ) : (
                  <span>Klik tombol untuk memulai audit</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {auditResults.length > 0 && !auditInProgress && (
                  <button onClick={() => notify('Ekspor hasil audit...', 'info')} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2">
                    <Icon name="download" className="text-lg" />Ekspor Hasil
                  </button>
                )}
                <button 
                  onClick={runComplianceAudit} 
                  disabled={auditInProgress}
                  className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {auditInProgress ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Sedang Memeriksa...
                    </>
                  ) : (
                    <>
                      <Icon name="play_arrow" className="text-lg" />
                      {auditResults.length > 0 ? 'Jalankan Ulang Audit' : 'Mulai Audit'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Toast Notification */}
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
