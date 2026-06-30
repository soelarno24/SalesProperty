import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface Developer {
  id: string;
  name: string;
  initial: string;
}

interface Project {
  id: string;
  name: string;
  developerId: string;
  developerName: string;
  location: string;
  coordinates: string;
  description: string;
  totalUnits: number;
  facilities: string[];
  certificates: string[];
  progress: number;
  status: 'Ongoing' | 'Completed' | 'Pending OC' | 'Legal Clear';
  image: string;
  reraId: string;
  type: 'Premium' | 'Standard' | 'Luxury';
  startDate: string;
  estimatedCompletion: string;
  gpsStatus: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
}

const developers: Developer[] = [
  { id: '1', name: 'Vanguard Urban Developments', initial: 'V' },
  { id: '2', name: 'Arcadia Living Group', initial: 'A' },
  { id: '3', name: 'Stonegate Collective', initial: 'S' },
  { id: '4', name: 'Lighthouse Estuary', initial: 'L' },
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'The Obsidian Groves',
    developerId: '1',
    developerName: 'Vanguard Urban Developments',
    location: 'Sector 45, Azure Coastline',
    coordinates: '22.34°N, 114.12°E',
    description: 'A scholarly integration of biophilic design and urban density. Features 140 luxury units with integrated smart-grid technology and private arboretums.',
    totalUnits: 140,
    facilities: ['pool', 'fitness_center', 'ev_station', 'spa', 'clubhouse', 'garden'],
    certificates: ['LEED Platinum', 'RERA-X0922', 'Fire Safety Cert'],
    progress: 84,
    status: 'Ongoing',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Rgn9nTqgf6PeAIGdhxr7bHFbQr4ZgsoR0YbmuQfT__5zqQb3GHIn5dtNM9w6d5oTdgr8-ZyKYBQeDMD7awiDlDWpig-8AvD_wH16kad30BlYkR_mYVtx-gccmrFBzSJfB6umkTxOqu_I--heCDSsEf-Yvt_t4OpODzRs80tRoWbu-TjPptryBlOAjc18J2PiubYvJw8p6pC-8XII4I3GrTrTbhKgC7eqR29ur_nrmvmJoAmLJnn7YPrb9_FZHrKfD-lReq8NzJ5a',
    reraId: 'RERA-X0922',
    type: 'Premium',
    startDate: '2022-03-15',
    estimatedCompletion: '2025-12-31',
    gpsStatus: 'ONLINE',
  },
  {
    id: '2',
    name: 'Alabaster Heights',
    developerId: '3',
    developerName: 'Stonegate Collective',
    location: 'West District Highlands, Block C',
    coordinates: '40.71°N, 74.00°W',
    description: 'Classical symmetry meets modern luxury. Grand courtyard gardens with formal architectural elements creating timeless elegance.',
    totalUnits: 220,
    facilities: ['clubhouse', 'spa', 'tennis_court'],
    certificates: ['RERA-AH881', 'Green Building Cert'],
    progress: 92,
    status: 'Legal Clear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeza2KH5jLlRVxene78J-S8C3fCCPOXpr2vSYR1CsLSpdUdhpYNYe6lYbdwrLRMIoGcuHzPHg5ub24BdVUTn0tqy9B8K6PcwIwMb69rwkJVs8KStpiGmNJA1G4nRnqv3lHjINJuXmcfpRTfvWaOJvZN8YQlVDz8B3-DKBGr7gtnTpyFCwF2BxhhZxuixtAi30w_ivM-EyAbKeimqvAsES_9CdHeQ_sHFehDBIEgvREOCGoVSAT78eri7i-5CW1vlz8rVSsWt_B-Vf5',
    reraId: 'RERA-AH881',
    type: 'Luxury',
    startDate: '2021-06-01',
    estimatedCompletion: '2024-08-15',
    gpsStatus: 'ONLINE',
  },
  {
    id: '3',
    name: 'Marine Wharf',
    developerId: '4',
    developerName: 'Lighthouse Estuary',
    location: 'North Bay Marina, Pier 12',
    coordinates: '49.28°N, 123.12°W',
    description: 'Exclusive waterfront living with private pier access. Modern coastal architecture with sustainable marine technology integration.',
    totalUnits: 45,
    facilities: ['private_pier', 'gym', 'rooftop_lounge'],
    certificates: ['RERA-MW445', 'Coastal Development Permit'],
    progress: 67,
    status: 'Pending OC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiyzHYccguqZ1MFwev-F3ZIpnnUYxhuuDdWbfKRJ33KPxCx1JMlvjE9XW-bcsblyoOW589C11NQsL4_mslteAScr3ivOSDASxpZDPYbp9-z8Nc83_-08XwNP6V1pedCLq9yXWsepH4_UU9RkHWLSol7HAWXuL3L8vummwX78rAR0vBre7NNcGwVPZsAHyfovTB3KrwAov43uXgVTUfScFQIACBak-3zEHhgK5MDR6y9BQTJOO3xKG0bUTx6kTwwspxPzhlxD9rwhs8',
    reraId: 'RERA-MW445',
    type: 'Luxury',
    startDate: '2023-01-10',
    estimatedCompletion: '2026-03-30',
    gpsStatus: 'MAINTENANCE',
  },
  {
    id: '4',
    name: 'Azure Residences',
    developerId: '1',
    developerName: 'Vanguard Urban Developments',
    location: 'Central Business District, Tower A',
    coordinates: '22.31°N, 114.17°E',
    description: 'Premium high-rise living in the heart of the city. Smart home automation and sky gardens on every third floor.',
    totalUnits: 380,
    facilities: ['sky_garden', 'infinity_pool', 'business_center', 'cinema'],
    certificates: ['LEED Gold', 'RERA-AR992', 'Smart Building Cert'],
    progress: 45,
    status: 'Ongoing',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLucYGkZKOPUw4TMnGKYWJkfwwt8pUxz049uguSkYgtbT2IQSZu60WzVVlqIodFMsxbLg0ekcOPenae5JVTUzXkyoor0XQlMPBlVUG1ZNCN2DCpmk03U-5QAs9now9ziU05phVf8tQZD9hDCzEgRtouOuGnM_eC2AC7O0slfgoptj5nsEP4K9nzrrJ9CkyK9D4iY3pp3g9Aj4TB_hxAZhIEgkALUUtCTtnyDtQl24LNoWJpAYAQYjPd4rwcY-CLFcJ3Gca9qFWIixb',
    reraId: 'RERA-AR992',
    type: 'Premium',
    startDate: '2023-09-01',
    estimatedCompletion: '2027-06-30',
    gpsStatus: 'ONLINE',
  },
  {
    id: '5',
    name: 'Villa Verde',
    developerId: '2',
    developerName: 'Arcadia Living Group',
    location: 'Tuscany Hills, Olive Grove Lane',
    coordinates: '43.77°N, 11.25°E',
    description: 'Mediterranean-inspired villas surrounded by olive groves. Sustainable architecture with locally sourced materials.',
    totalUnits: 28,
    facilities: ['vineyard', 'olive_grove', 'community_kitchen'],
    certificates: ['RERA-VV112', 'Organic Living Cert'],
    progress: 100,
    status: 'Completed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq3S3UtRtrBzuJzEDFp0uy25Fpjw9gX3vHGvH3-Q06JeMdMU9cgbzwGpm_66JyH3Ier4Jo17WjMpL7p93lB4qQEVwOAWJSHsJY6S4ilQlSsXvDMJYD4DLCL7hddA-fJvAT46-E_haPcF6rFKa_JtFIzGay3ItLA7nzV1syeysRJ1_ck9akQTKW6e5sOt1aMwOHqU7mhBLUTCou6Xe5nXXm3M7DYXC2QLGnVZNFp2RuZStAxRvStVePybZFTfcN0U1Jr4TTfaS_PmSF',
    reraId: 'RERA-VV112',
    type: 'Standard',
    startDate: '2020-04-15',
    estimatedCompletion: '2023-12-20',
    gpsStatus: 'ONLINE',
  },
];

const tabs = ['All Projects', 'Ongoing', 'Completed', 'Pending OC'] as const;

const emptyFormData = {
  name: '',
  developerId: '',
  location: '',
  coordinates: '',
  description: '',
  totalUnits: 0,
  facilities: [] as string[],
  certificates: [] as string[],
  reraId: '',
  type: 'Standard' as 'Premium' | 'Standard' | 'Luxury',
  startDate: '',
  estimatedCompletion: '',
  status: 'Ongoing' as Project['status'],
  image: '',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All Projects');
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = searchQuery
      ? proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.reraId.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesDeveloper = selectedDeveloper ? proj.developerId === selectedDeveloper : true;
    
    if (activeTab === 'Ongoing') return matchesSearch && matchesDeveloper && proj.status === 'Ongoing';
    if (activeTab === 'Completed') return matchesSearch && matchesDeveloper && proj.status === 'Completed';
    if (activeTab === 'Pending OC') return matchesSearch && matchesDeveloper && proj.status === 'Pending OC';
    return matchesSearch && matchesDeveloper;
  });

  const featuredProject = filteredProjects[0] || projects[0];
  const otherProjects = filteredProjects.slice(1);

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
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Nama project wajib diisi';
    if (!formData.developerId) errors.developerId = 'Developer wajib dipilih';
    if (!formData.location.trim()) errors.location = 'Lokasi wajib diisi';
    if (!formData.reraId.trim()) errors.reraId = 'RERA ID wajib diisi';
    if (!formData.totalUnits || formData.totalUnits < 1) errors.totalUnits = 'Jumlah unit minimal 1';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProject = () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const dev = developers.find(d => d.id === formData.developerId);
      const newProject: Project = {
        id: String(Date.now()),
        ...formData,
        developerName: dev?.name || '',
        progress: 0,
        gpsStatus: 'ONLINE',
        image: formData.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLucYGkZKOPUw4TMnGKYWJkfwwt8pUxz049uguSkYgtbT2IQSZu60WzVVlqIodFMsxbLg0ekcOPenae5JVTUzXkyoor0XQlMPBlVUG1ZNCN2DCpmk03U-5QAs9now9ziU05phVf8tQZD9hDCzEgRtouOuGnM_eC2AC7O0slfgoptj5nsEP4K9nzrrJ9CkyK9D4iY3pp3g9Aj4TB_hxAZhIEgkALUUtCTtnyDtQl24LNoWJpAYAQYjPd4rwcY-CLFcJ3Gca9qFWIixb',
      };
      setProjects([newProject, ...projects]);
      setShowAddModal(false);
      setIsSubmitting(false);
      notify(`Project "${formData.name}" berhasil ditambahkan!`, 'success');
    }, 800);
  };

  const handleEditProject = () => {
    if (!validateForm() || !selectedProject) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const dev = developers.find(d => d.id === formData.developerId);
      setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...formData, developerName: dev?.name || '' } : p));
      setShowEditModal(false);
      setIsSubmitting(false);
      notify(`Project "${formData.name}" berhasil diperbarui!`, 'success');
    }, 800);
  };

  const handleDeleteProject = () => {
    if (!selectedProject) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      setShowDeleteModal(false);
      setIsSubmitting(false);
      notify(`Project "${selectedProject.name}" berhasil dihapus!`, 'success');
      setSelectedProject(null);
    }, 600);
  };

  const openDetailModal = (proj: Project) => {
    setSelectedProject(proj);
    setShowDetailModal(true);
  };

  const openEditModal = (proj: Project) => {
    setSelectedProject(proj);
    setFormData({
      name: proj.name,
      developerId: proj.developerId,
      location: proj.location,
      coordinates: proj.coordinates,
      description: proj.description,
      totalUnits: proj.totalUnits,
      facilities: proj.facilities,
      certificates: proj.certificates,
      reraId: proj.reraId,
      type: proj.type,
      startDate: proj.startDate,
      estimatedCompletion: proj.estimatedCompletion,
      status: proj.status,
      image: proj.image,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (proj: Project) => {
    setSelectedProject(proj);
    setShowDeleteModal(true);
  };

  const ModalBackdrop = ({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={modalRef} className={`bg-white rounded-2xl shadow-2xl ${wide ? 'w-full max-w-4xl' : 'w-full max-w-lg'} max-h-[90vh] overflow-y-auto animate-fade-in-up my-8`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  const FormInput = ({ label, name, type = 'text', placeholder, value, onChange, error }: { label: string; name: string; type?: string; placeholder?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string }) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-4 py-3 bg-surface-container-low border rounded-lg text-sm outline-none transition-all ${error ? 'border-error focus:ring-2 focus:ring-error/20' : 'border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-primary'}`} />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );

  const FormSelect = ({ label, name, value, onChange, options }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }) => (
    <div className="space-y-1.5">
      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer">
        {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
    </div>
  );

  const StatusBadge = ({ status }: { status: Project['status'] }) => {
    const styles = {
      'Ongoing': 'bg-primary-fixed text-on-primary-fixed-variant',
      'Completed': 'bg-tertiary-fixed text-on-tertiary-fixed',
      'Pending OC': 'bg-error-container text-on-error-container',
      'Legal Clear': 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant',
    };
    return (
      <span className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${styles[status]}`}>
        {status === 'Pending OC' ? 'PENDING OC' : status.toUpperCase()}
      </span>
    );
  };

  const GPSBadge = ({ status }: { status: Project['gpsStatus'] }) => {
    const styles = {
      'ONLINE': 'bg-tertiary text-on-tertiary',
      'OFFLINE': 'bg-error text-on-error',
      'MAINTENANCE': 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant',
    };
    return (
      <span className={`text-[10px] font-bold font-label uppercase tracking-wider ${styles[status]}`}>
        {status === 'ONLINE' ? 'GPS ACTIVE' : status}
      </span>
    );
  };

  return (
    <div className="p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <nav className="flex gap-2 text-[10px] font-label uppercase tracking-[0.2em] text-outline mb-2">
            <span className="text-primary">Core</span>
            <span>/</span>
            <span className="text-on-surface-variant">Projects Management</span>
          </nav>
          <h2 className="font-headline text-4xl text-on-surface font-bold tracking-tight">Active Housing Portfolios</h2>
          <p className="text-on-surface-variant mt-2 text-sm">Kelola project perumahan berdasarkan developer mitra.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            className="px-4 py-2.5 bg-surface-container-high text-on-surface rounded-xl text-sm font-label border-none outline-none cursor-pointer"
          >
            <option value="">Semua Developer</option>
            {developers.map(dev => (
              <option key={dev.id} value={dev.id}>{dev.name}</option>
            ))}
          </select>
          <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer">
            <Icon name="add" className="text-lg" />
            <span className="font-label text-xs uppercase tracking-widest">Add New Project</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-outline-variant/20 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-label transition-colors pb-2 cursor-pointer ${activeTab === tab ? 'font-bold border-b-2 border-primary text-primary' : 'font-semibold text-on-surface-variant hover:text-on-surface'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects by name, location, or RERA ID..."
          className="w-full bg-surface-container rounded-full pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary border-none"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Total Projects</p>
          <p className="text-3xl font-headline font-bold text-on-surface">{projects.length}</p>
        </div>
        <div className="bg-primary-fixed rounded-2xl p-6">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-primary-fixed-variant mb-2">Ongoing</p>
          <p className="text-3xl font-headline font-bold text-primary">{projects.filter(p => p.status === 'Ongoing').length}</p>
        </div>
        <div className="bg-tertiary-fixed rounded-2xl p-6">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-tertiary-fixed-variant mb-2">Completed</p>
          <p className="text-3xl font-headline font-bold text-tertiary">{projects.filter(p => p.status === 'Completed').length}</p>
        </div>
        <div className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/10">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Total Units</p>
          <p className="text-3xl font-headline font-bold text-on-surface">{projects.reduce((sum, p) => sum + p.totalUnits, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-12 gap-6">
          {/* Featured Project */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm group border border-outline-variant/15">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 relative h-64 md:h-full">
                <img src={featuredProject.image} alt={featuredProject.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-6 left-6 bg-surface-container-lowest/80 backdrop-blur-sm text-on-surface px-4 py-1.5 rounded-full text-[9px] font-bold font-label uppercase tracking-[0.2em] border border-outline-variant/30 shadow-sm">
                  {featuredProject.type} Portfolio
                </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-headline text-2xl font-bold text-on-surface">{featuredProject.name}</h3>
                    <button onClick={() => openDetailModal(featuredProject)} className="p-2 hover:bg-primary-fixed rounded-lg text-primary transition-all cursor-pointer">
                      <Icon name="open_in_new" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary italic">
                      {featuredProject.developerName.charAt(0)}
                    </div>
                    <span className="text-sm text-on-surface-variant">{featuredProject.developerName}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <Icon name="location_on" className="text-sm" />
                      <span className="text-xs font-body">{featuredProject.location} - {featuredProject.coordinates}</span>
                      <GPSBadge status={featuredProject.gpsStatus} />
                    </div>
                    <p className="text-sm text-outline leading-relaxed line-clamp-3">{featuredProject.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {featuredProject.certificates.map((cert, i) => (
                        <span key={i} className="px-2 py-1 bg-surface-container text-on-surface-variant rounded text-[9px] font-bold font-label uppercase tracking-tighter">{cert}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-outline-variant/15 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {featuredProject.facilities.slice(0, 3).map((fac, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center">
                        <Icon name={fac} className="text-xs" />
                      </div>
                    ))}
                    {featuredProject.facilities.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary-fixed text-primary text-[10px] font-bold flex items-center justify-center">
                        +{featuredProject.facilities.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-label uppercase tracking-[0.2em] text-outline mb-1">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${featuredProject.progress}%` }} />
                      </div>
                      <p className="text-xs font-bold text-on-surface">{featuredProject.progress}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="col-span-12 lg:col-span-4 bg-primary text-on-primary rounded-3xl p-8 flex flex-col justify-between shadow-lg shadow-primary/20">
            <div>
              <p className="font-label uppercase tracking-[0.2em] text-[10px] opacity-70 mb-4">Portfolio Analytics</p>
              <h4 className="font-headline text-2xl font-medium leading-tight italic">Project Oversight & Compliance</h4>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-on-primary/10 pb-4">
                <div>
                  <p className="text-3xl font-bold">{projects.filter(p => p.status === 'Ongoing').length}</p>
                  <p className="text-[10px] font-label uppercase tracking-widest opacity-80">Ongoing Projects</p>
                </div>
                <Icon name="trending_up" className="opacity-40" />
              </div>
              <div className="flex justify-between items-end border-b border-on-primary/10 pb-4">
                <div>
                  <p className="text-3xl font-bold">
                    {((projects.filter(p => p.status === 'Completed').length / projects.length) * 100).toFixed(0)}%
                  </p>
                  <p className="text-[10px] font-label uppercase tracking-widest opacity-80">Completion Rate</p>
                </div>
                <Icon name="verified_user" className="opacity-40" />
              </div>
            </div>
            <button onClick={() => notify('Download audit report...', 'info')} className="w-full py-4 bg-on-primary text-primary rounded-xl font-bold text-xs font-label uppercase tracking-widest hover:bg-primary-fixed transition-colors cursor-pointer flex items-center justify-center gap-2">
              <Icon name="download" /> Download Audit Report
            </button>
          </div>

          {/* Other Projects */}
          {otherProjects.map((proj) => (
            <div key={proj.id} className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-3xl p-6 shadow-sm hover:translate-y-[-4px] transition-all group border border-outline-variant/15">
              <div className="h-40 rounded-2xl overflow-hidden mb-6 relative">
                <img src={proj.image} alt={proj.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={proj.status} />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary italic">
                  {proj.developerName.charAt(0)}
                </div>
                <span className="text-xs text-on-surface-variant truncate">{proj.developerName}</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">{proj.name}</h3>
              <p className="text-[11px] text-outline mb-4 flex items-center gap-1">
                <Icon name="location_on" className="text-xs" />
                {proj.location}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/15">
                <div>
                  <p className="text-[9px] font-label uppercase tracking-tighter text-outline">RERA ID</p>
                  <p className="text-xs font-bold text-on-surface">{proj.reraId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-label uppercase tracking-tighter text-outline">Units</p>
                  <p className="text-xs font-bold text-on-surface">{proj.totalUnits}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${proj.progress >= 80 ? 'bg-tertiary' : proj.progress >= 50 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${proj.progress}%` }} />
                  </div>
                  <span className="text-xs font-medium">{proj.progress}%</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openDetailModal(proj)} className="p-1.5 hover:bg-primary-fixed rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="Detail">
                    <Icon name="visibility" className="text-lg" />
                  </button>
                  <button onClick={() => openEditModal(proj)} className="p-1.5 hover:bg-primary-fixed rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="Edit">
                    <Icon name="edit_note" className="text-lg" />
                  </button>
                  <button onClick={() => openDeleteModal(proj)} className="p-1.5 hover:bg-error-container rounded-lg text-on-surface-variant hover:text-error transition-all cursor-pointer" title="Hapus">
                    <Icon name="delete" className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* GPS Tracker Card */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-3xl p-8 relative overflow-hidden group border border-outline-variant/15 shadow-sm">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h4 className="font-headline text-lg font-bold text-on-surface mb-1 italic">Fleet & Site Monitor</h4>
                <p className="text-xs text-on-surface-variant font-body">Real-time GPS status across project sites.</p>
              </div>
              <div className="mt-8 space-y-3">
                {projects.slice(0, 3).map((proj) => (
                  <div key={proj.id} className="bg-surface-container-lowest/80 backdrop-blur-sm p-3 rounded-xl flex items-center justify-between border border-white/40">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${proj.gpsStatus === 'ONLINE' ? 'bg-tertiary' : proj.gpsStatus === 'OFFLINE' ? 'bg-error' : 'bg-tertiary-fixed-dim'}`} />
                      <p className="text-[10px] font-bold text-on-surface truncate max-w-[120px]">{proj.name}</p>
                    </div>
                    <span className={`text-[10px] font-label font-bold ${proj.gpsStatus === 'ONLINE' ? 'text-primary' : proj.gpsStatus === 'OFFLINE' ? 'text-error' : 'text-tertiary'}`}>
                      {proj.gpsStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-container-high flex items-center justify-center mb-4">
            <Icon name="search_off" className="text-3xl text-on-surface-variant" />
          </div>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Tidak ada project ditemukan</h3>
          <p className="text-on-surface-variant">Coba ubah filter atau kata kunci pencarian Anda.</p>
        </div>
      )}

      <footer className="pt-10 pb-4 text-center">
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant opacity-35">© Agent Properti • Manajemen Sales Properti v2.4.0</p>
      </footer>

      {/* ==================== MODALS ==================== */}

      {/* Add Project Modal */}
      {showAddModal && (
        <ModalBackdrop onClose={() => setShowAddModal(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Tambah Project Baru</h3>
                <p className="text-sm text-on-surface-variant mt-1">Daftarkan project perumahan baru ke dalam sistem.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
                <Icon name="close" className="text-xl" />
              </button>
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAddProject(); }}>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Nama Project *" name="name" placeholder="Azure Residences" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={formErrors.name} />
                <FormSelect label="Developer *" name="developerId" value={formData.developerId} onChange={(e) => setFormData({ ...formData, developerId: e.target.value })} options={[{ value: '', label: 'Pilih Developer' }, ...developers.map(d => ({ value: d.id, label: d.name }))]} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Lokasi *" name="location" placeholder="Central Business District" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} error={formErrors.location} />
                <FormInput label="Koordinat GPS" name="coordinates" placeholder="22.31°N, 114.17°E" value={formData.coordinates} onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })} />
              </div>
              <FormInput label="RERA ID *" name="reraId" placeholder="RERA-XXXXX" value={formData.reraId} onChange={(e) => setFormData({ ...formData, reraId: e.target.value })} error={formErrors.reraId} />
              <div>
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi project..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormInput label="Jumlah Unit *" name="totalUnits" type="number" placeholder="100" value={formData.totalUnits} onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })} error={formErrors.totalUnits} />
                <FormSelect label="Tipe" name="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Premium' | 'Standard' | 'Luxury' })} options={[{ value: 'Standard', label: 'Standard' }, { value: 'Premium', label: 'Premium' }, { value: 'Luxury', label: 'Luxury' }]} />
                <FormSelect label="Status" name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })} options={[{ value: 'Ongoing', label: 'Ongoing' }, { value: 'Completed', label: 'Completed' }, { value: 'Pending OC', label: 'Pending OC' }, { value: 'Legal Clear', label: 'Legal Clear' }]} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Tanggal Mulai" name="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                <FormInput label="Estimasi Selesai" name="estimatedCompletion" type="date" value={formData.estimatedCompletion} onChange={(e) => setFormData({ ...formData, estimatedCompletion: e.target.value })} />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                  {isSubmitting ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Menyimpan...</>) : (<><Icon name="add" className="text-lg" />Tambah Project</>)}
                </button>
              </div>
            </form>
          </div>
        </ModalBackdrop>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <ModalBackdrop onClose={() => setShowEditModal(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Edit Project</h3>
                <p className="text-sm text-on-surface-variant mt-1">Perbarui informasi <span className="font-semibold">{selectedProject.name}</span></p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
                <Icon name="close" className="text-xl" />
              </button>
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleEditProject(); }}>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Nama Project *" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={formErrors.name} />
                <FormSelect label="Developer *" name="developerId" value={formData.developerId} onChange={(e) => setFormData({ ...formData, developerId: e.target.value })} options={[{ value: '', label: 'Pilih Developer' }, ...developers.map(d => ({ value: d.id, label: d.name }))]} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Lokasi *" name="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} error={formErrors.location} />
                <FormInput label="Koordinat GPS" name="coordinates" value={formData.coordinates} onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })} />
              </div>
              <FormInput label="RERA ID *" name="reraId" value={formData.reraId} onChange={(e) => setFormData({ ...formData, reraId: e.target.value })} error={formErrors.reraId} />
              <div>
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Deskripsi</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormInput label="Jumlah Unit *" name="totalUnits" type="number" value={formData.totalUnits} onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })} error={formErrors.totalUnits} />
                <FormSelect label="Tipe" name="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Premium' | 'Standard' | 'Luxury' })} options={[{ value: 'Standard', label: 'Standard' }, { value: 'Premium', label: 'Premium' }, { value: 'Luxury', label: 'Luxury' }]} />
                <FormSelect label="Status" name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })} options={[{ value: 'Ongoing', label: 'Ongoing' }, { value: 'Completed', label: 'Completed' }, { value: 'Pending OC', label: 'Pending OC' }, { value: 'Legal Clear', label: 'Legal Clear' }]} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Tanggal Mulai" name="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                <FormInput label="Estimasi Selesai" name="estimatedCompletion" type="date" value={formData.estimatedCompletion} onChange={(e) => setFormData({ ...formData, estimatedCompletion: e.target.value })} />
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
      {showDeleteModal && selectedProject && (
        <ModalBackdrop onClose={() => setShowDeleteModal(false)}>
          <div className="p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-error-container flex items-center justify-center mb-6">
              <Icon name="delete_forever" className="text-3xl text-error" />
            </div>
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Hapus Project?</h3>
              <p className="text-on-surface-variant leading-relaxed">Anda akan menghapus project <span className="font-semibold text-on-surface">"{selectedProject.name}"</span>.<br />Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <img src={selectedProject.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-on-surface">{selectedProject.name}</p>
                  <p className="text-xs text-on-surface-variant">{selectedProject.developerName}</p>
                  <p className="text-xs text-on-surface-variant">{selectedProject.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-on-surface">{selectedProject.totalUnits} Units</p>
                  <StatusBadge status={selectedProject.status} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Batal</button>
              <button onClick={handleDeleteProject} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-error text-on-error text-sm font-semibold hover:bg-error/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                {isSubmitting ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Menghapus...</>) : (<><Icon name="delete" className="text-lg" />Ya, Hapus Project</>)}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Detail Project Modal */}
      {showDetailModal && selectedProject && (
        <ModalBackdrop onClose={() => setShowDetailModal(false)} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img src={selectedProject.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">{selectedProject.name}</h3>
                  <p className="text-sm text-on-surface-variant flex items-center gap-2">
                    <Icon name="apartment" className="text-sm" />
                    {selectedProject.developerName}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              <StatusBadge status={selectedProject.status} />
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${selectedProject.type === 'Luxury' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : selectedProject.type === 'Premium' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-container-high text-on-surface-variant'}`}>
                {selectedProject.type}
              </span>
              <span className="px-3 py-1.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant">
                {selectedProject.reraId}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Informasi Lokasi</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Alamat</span><span className="text-sm font-medium text-on-surface">{selectedProject.location}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Koordinat</span><span className="text-sm font-medium text-primary">{selectedProject.coordinates}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-on-surface-variant">GPS Status</span><GPSBadge status={selectedProject.gpsStatus} /></div>
                  </div>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Detail Project</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Total Unit</span><span className="text-sm font-medium text-on-surface">{selectedProject.totalUnits}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Tanggal Mulai</span><span className="text-sm font-medium text-on-surface">{selectedProject.startDate || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-on-surface-variant">Estimasi Selesai</span><span className="text-sm font-medium text-on-surface">{selectedProject.estimatedCompletion || '-'}</span></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Deskripsi</h4>
                  <p className="text-sm text-on-surface leading-relaxed">{selectedProject.description}</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Progress</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${selectedProject.progress >= 80 ? 'bg-tertiary' : selectedProject.progress >= 50 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${selectedProject.progress}%` }} />
                    </div>
                    <span className="text-xl font-bold text-on-surface">{selectedProject.progress}%</span>
                  </div>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Fasilitas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.facilities.map((fac, i) => (
                      <span key={i} className="px-3 py-1.5 bg-surface-container rounded-lg text-xs font-medium text-on-surface flex items-center gap-1">
                        <Icon name={fac} className="text-sm" />
                        {fac.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button onClick={() => { setShowDetailModal(false); openEditModal(selectedProject); }} className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-2">
                <Icon name="edit_note" className="text-lg" />Edit Project
              </button>
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all cursor-pointer">Tutup</button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Toast */}
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
