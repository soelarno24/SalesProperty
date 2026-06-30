import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  password: string;
  lastPasswordChange: string;
  joinDate: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  dateFormat: string;
}

const defaultProfile: AdminProfile = {
  name: 'Agent Properti Admin',
  email: 'admin@agentproperti.id',
  phone: '+62 812 0000 1111',
  role: 'System Administrator',
  avatar: '',
  password: 'Admin@2024!Secure',
  lastPasswordChange: '2024-02-01',
  joinDate: '2023-06-15',
  timezone: 'Asia/Jakarta (WIB)',
  language: 'Bahasa Indonesia',
  emailNotifications: true,
  pushNotifications: true,
  twoFactorAuth: false,
  sessionTimeout: 30,
  theme: 'light',
  currency: 'USD',
  dateFormat: 'DD/MM/YYYY',
};

interface Props {
  showSettings: boolean;
  showProfile: boolean;
  onCloseSettings: () => void;
  onCloseProfile: () => void;
  profile: AdminProfile;
  onUpdateProfile: (p: AdminProfile) => void;
  notify: (m: string, t: 'success' | 'error' | 'info') => void;
}

export { defaultProfile };

export default function SettingsProfileModals({ showSettings, showProfile, onCloseSettings, onCloseProfile, profile, onUpdateProfile, notify }: Props) {
  // Profile state
  const [profileForm, setProfileForm] = useState({ name: profile.name, email: profile.email, phone: profile.phone });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);

  // Password change state
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Settings state
  const [settingsTab, setSettingsTab] = useState<'general' | 'notifications' | 'security' | 'display'>('general');
  const [settings, setSettings] = useState({
    emailNotifications: profile.emailNotifications,
    pushNotifications: profile.pushNotifications,
    twoFactorAuth: profile.twoFactorAuth,
    sessionTimeout: profile.sessionTimeout,
    theme: profile.theme,
    currency: profile.currency,
    dateFormat: profile.dateFormat,
    language: profile.language,
    timezone: profile.timezone,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showProfile) {
      setProfileForm({ name: profile.name, email: profile.email, phone: profile.phone });
      setProfileErrors({});
      setShowChangePw(false);
      setPwForm({ current: '', newPw: '', confirm: '' });
      setPwErrors({});
    }
  }, [showProfile, profile]);

  useEffect(() => {
    if (showSettings) {
      setSettings({ emailNotifications: profile.emailNotifications, pushNotifications: profile.pushNotifications, twoFactorAuth: profile.twoFactorAuth, sessionTimeout: profile.sessionTimeout, theme: profile.theme, currency: profile.currency, dateFormat: profile.dateFormat, language: profile.language, timezone: profile.timezone });
    }
  }, [showSettings, profile]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { onCloseSettings(); onCloseProfile(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onCloseSettings, onCloseProfile]);

  // Helpers
  const generatePassword = () => {
    const u='ABCDEFGHJKLMNPQRSTUVWXYZ',l='abcdefghjkmnpqrstuvwxyz',d='23456789',s='!@#$%&*',a=u+l+d+s;
    let pw=u[Math.floor(Math.random()*u.length)]+l[Math.floor(Math.random()*l.length)]+d[Math.floor(Math.random()*d.length)]+s[Math.floor(Math.random()*s.length)];
    for(let i=0;i<8;i++) pw+=a[Math.floor(Math.random()*a.length)];
    return pw.split('').sort(()=>Math.random()-0.5).join('');
  };

  const getPasswordStrength = (pw: string) => {
    if (!pw) return { label: '', color: '', percent: 0 };
    let sc = 0;
    if (pw.length >= 8) sc++;
    if (pw.length >= 12) sc++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) sc++;
    if (/\d/.test(pw)) sc++;
    if (/[^a-zA-Z\d]/.test(pw)) sc++;
    if (sc <= 1) return { label: 'Sangat Lemah', color: 'bg-error', percent: 20 };
    if (sc === 2) return { label: 'Lemah', color: 'bg-error', percent: 40 };
    if (sc === 3) return { label: 'Cukup', color: 'bg-tertiary', percent: 60 };
    if (sc === 4) return { label: 'Kuat', color: 'bg-primary', percent: 80 };
    return { label: 'Sangat Kuat', color: 'bg-tertiary', percent: 100 };
  };

  const daysSince = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24));

  // Profile handlers
  const handleSaveProfile = () => {
    const e: Record<string, string> = {};
    if (!profileForm.name.trim()) e.name = 'Nama wajib diisi';
    if (!profileForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) e.email = 'Email tidak valid';
    if (!profileForm.phone.trim()) e.phone = 'Telepon wajib diisi';
    setProfileErrors(e);
    if (Object.keys(e).length > 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateProfile({ ...profile, ...profileForm });
      setIsSubmitting(false);
      notify('Profil berhasil diperbarui!', 'success');
    }, 800);
  };

  const handleChangePassword = () => {
    const e: Record<string, string> = {};
    if (!pwForm.current) e.current = 'Password saat ini wajib diisi';
    if (pwForm.current && pwForm.current !== profile.password) e.current = 'Password saat ini salah';
    if (!pwForm.newPw) e.newPw = 'Password baru wajib diisi';
    if (pwForm.newPw && pwForm.newPw.length < 8) e.newPw = 'Minimal 8 karakter';
    if (pwForm.newPw && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwForm.newPw)) e.newPw = 'Harus mengandung huruf besar, kecil, dan angka';
    if (pwForm.newPw === pwForm.current && pwForm.current) e.newPw = 'Password baru tidak boleh sama dengan yang lama';
    if (!pwForm.confirm) e.confirm = 'Konfirmasi password wajib diisi';
    if (pwForm.confirm && pwForm.confirm !== pwForm.newPw) e.confirm = 'Password tidak cocok';
    setPwErrors(e);
    if (Object.keys(e).length > 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateProfile({ ...profile, password: pwForm.newPw, lastPasswordChange: new Date().toISOString().split('T')[0] });
      setIsSubmitting(false);
      setShowChangePw(false);
      setPwForm({ current: '', newPw: '', confirm: '' });
      notify('Password berhasil diubah!', 'success');
    }, 800);
  };

  // Settings handler
  const handleSaveSettings = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateProfile({ ...profile, ...settings });
      setIsSubmitting(false);
      notify('Pengaturan berhasil disimpan!', 'success');
      onCloseSettings();
    }, 800);
  };

  const MB = ({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={modalRef} className={`bg-white rounded-2xl shadow-2xl ${wide ? 'w-full max-w-4xl' : 'w-full max-w-lg'} max-h-[90vh] overflow-y-auto animate-fade-in-up my-8`} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-on-surface">{label}</span>
      <button type="button" onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${checked ? 'bg-primary' : 'bg-surface-container-high'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  const Spinner = () => <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>;

  const pwStr = getPasswordStrength(pwForm.newPw);

  return (
    <>
      {/* ==================== PROFILE MODAL ==================== */}
      {showProfile && (
        <MB onClose={onCloseProfile} wide>
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img src={profile.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMjI2Ro3edpxVjk09nx201uy5XgKz64hKHbQhJ3pB64h6yasU1azk-VkR1rAsyzlyFGqfPbbVVNlIREK_f8DgPlmoR130JyDVzOwkKyCa9Qs2ejE7IVsioorw8YoNHnQWxREQo9mgFR5k3yFvrChLljTPrYP2O4CK7D_7kN59odXXiMNzlc57B4PozVRIrI_4yFbfaBNYYPev7Uzni51yV2jmzbppwA-Tmc6F9JCGjaAt4bAGKgpRtyQg6FonxLqwsmKVoacTlW_y_'} alt="Profile" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary-fixed" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="verified" className="text-white text-xs" />
                  </div>
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">{profile.name}</h3>
                  <p className="text-sm text-on-surface-variant">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold font-label uppercase tracking-widest rounded-full">{profile.role}</span>
                    <span className="text-xs text-on-surface-variant">Bergabung sejak {new Date(profile.joinDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <button onClick={onCloseProfile} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Edit Profile */}
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6 space-y-5">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2"><Icon name="person" className="text-primary" />Informasi Profil</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nama Lengkap</label>
                      <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className={`w-full px-4 py-3 bg-white border rounded-lg text-sm outline-none ${profileErrors.name ? 'border-error' : 'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`} />
                      {profileErrors.name && <p className="text-xs text-error">{profileErrors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label>
                      <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className={`w-full px-4 py-3 bg-white border rounded-lg text-sm outline-none ${profileErrors.email ? 'border-error' : 'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`} />
                      {profileErrors.email && <p className="text-xs text-error">{profileErrors.email}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">No. Telepon</label>
                      <input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className={`w-full px-4 py-3 bg-white border rounded-lg text-sm outline-none ${profileErrors.phone ? 'border-error' : 'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`} />
                      {profileErrors.phone && <p className="text-xs text-error">{profileErrors.phone}</p>}
                    </div>
                  </div>
                  <button onClick={handleSaveProfile} disabled={isSubmitting} className="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                    {isSubmitting ? <><Spinner />Menyimpan...</> : <><Icon name="save" />Simpan Profil</>}
                  </button>
                </div>
              </div>

              {/* Right: Password */}
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 mb-4"><Icon name="lock" className="text-primary" />Keamanan Akun</h4>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">Password</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{showCurrentPw ? profile.password : '•'.repeat(Math.min(profile.password.length, 12))}</span>
                        <button onClick={() => setShowCurrentPw(!showCurrentPw)} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name={showCurrentPw ? 'visibility_off' : 'visibility'} className="text-sm" /></button>
                        <button onClick={() => { navigator.clipboard.writeText(profile.password); notify('Password disalin!', 'success'); }} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name="content_copy" className="text-sm" /></button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">Terakhir diubah</span>
                      <span className={`text-sm font-medium ${daysSince(profile.lastPasswordChange) > 90 ? 'text-error' : 'text-on-surface'}`}>
                        {daysSince(profile.lastPasswordChange)} hari lalu
                        {daysSince(profile.lastPasswordChange) > 90 && <span className="text-[10px] ml-1 text-error font-label uppercase"> (expired)</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">Kekuatan</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className={`h-full rounded-full ${getPasswordStrength(profile.password).color}`} style={{ width: `${getPasswordStrength(profile.password).percent}%` }} /></div>
                        <span className="text-xs font-medium">{getPasswordStrength(profile.password).label}</span>
                      </div>
                    </div>
                  </div>

                  {!showChangePw ? (
                    <button onClick={() => setShowChangePw(true)} className="w-full py-3 bg-primary/5 text-primary font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors">
                      <Icon name="lock_reset" />Ganti Password
                    </button>
                  ) : (
                    <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                      <p className="text-xs font-label font-bold uppercase tracking-wider text-primary">Ganti Password</p>
                      {/* Current Password */}
                      <div className="space-y-1.5">
                        <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password Saat Ini</label>
                        <div className="relative">
                          <input type="password" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} placeholder="Masukkan password saat ini" className={`w-full px-4 py-3 pr-12 bg-white border rounded-lg text-sm outline-none ${pwErrors.current ? 'border-error' : 'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`} />
                        </div>
                        {pwErrors.current && <p className="text-xs text-error">{pwErrors.current}</p>}
                      </div>
                      {/* New Password */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password Baru</label>
                          <button type="button" onClick={() => { const pw = generatePassword(); setPwForm({ ...pwForm, newPw: pw, confirm: pw }); setShowNewPw(true); }} className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1"><Icon name="casino" className="text-sm" />Generate</button>
                        </div>
                        <div className="relative">
                          <input type={showNewPw ? 'text' : 'password'} value={pwForm.newPw} onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })} placeholder="Minimal 8 karakter" className={`w-full px-4 py-3 pr-20 bg-white border rounded-lg text-sm outline-none ${pwErrors.newPw ? 'border-error' : 'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`} />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name={showNewPw ? 'visibility_off' : 'visibility'} className="text-base" /></button>
                            {pwForm.newPw && <button type="button" onClick={() => { navigator.clipboard.writeText(pwForm.newPw); notify('Password baru disalin!', 'success'); }} className="p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name="content_copy" className="text-base" /></button>}
                          </div>
                        </div>
                        {pwErrors.newPw && <p className="text-xs text-error">{pwErrors.newPw}</p>}
                      </div>
                      {/* Strength */}
                      {pwForm.newPw && (
                        <div className="space-y-1">
                          <div className="flex justify-between"><span className="text-[10px] font-label uppercase text-on-surface-variant">Kekuatan</span><span className={`text-[10px] font-bold font-label uppercase ${pwStr.percent >= 80 ? 'text-primary' : pwStr.percent >= 60 ? 'text-tertiary' : 'text-error'}`}>{pwStr.label}</span></div>
                          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-300 ${pwStr.color}`} style={{ width: `${pwStr.percent}%` }} /></div>
                        </div>
                      )}
                      {/* Confirm */}
                      <div className="space-y-1.5">
                        <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Konfirmasi Password Baru</label>
                        <div className="relative">
                          <input type={showConfirmPw ? 'text' : 'password'} value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="Ketik ulang password baru" className={`w-full px-4 py-3 pr-12 bg-white border rounded-lg text-sm outline-none ${pwErrors.confirm ? 'border-error' : 'border-outline-variant/30 focus:ring-2 focus:ring-primary'}`} />
                          <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary cursor-pointer"><Icon name={showConfirmPw ? 'visibility_off' : 'visibility'} className="text-base" /></button>
                        </div>
                        {pwErrors.confirm && <p className="text-xs text-error">{pwErrors.confirm}</p>}
                        {pwForm.confirm && pwForm.confirm === pwForm.newPw && !pwErrors.confirm && <p className="text-xs text-primary flex items-center gap-1"><Icon name="check_circle" className="text-sm" />Password cocok</p>}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => { setShowChangePw(false); setPwForm({ current: '', newPw: '', confirm: '' }); setPwErrors({}); }} className="flex-1 py-2.5 border border-outline text-on-surface font-semibold rounded-lg cursor-pointer text-sm">Batal</button>
                        <button onClick={handleChangePassword} disabled={isSubmitting} className="flex-1 py-2.5 bg-primary text-on-primary font-semibold rounded-lg cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 text-sm">
                          {isSubmitting ? <><Spinner />Mengubah...</> : <><Icon name="lock_reset" className="text-base" />Ubah Password</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Info Akun</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-on-surface-variant">Timezone</span><span className="font-medium">{profile.timezone}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Bahasa</span><span className="font-medium">{profile.language}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">2FA</span><span className={`font-medium ${profile.twoFactorAuth ? 'text-primary' : 'text-on-surface-variant'}`}>{profile.twoFactorAuth ? 'Aktif' : 'Nonaktif'}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button onClick={onCloseProfile} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer">Tutup</button>
            </div>
          </div>
        </MB>
      )}

      {/* ==================== SETTINGS MODAL ==================== */}
      {showSettings && (
        <MB onClose={onCloseSettings} wide>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-3"><Icon name="settings" className="text-primary" />Pengaturan Sistem</h3>
                <p className="text-sm text-on-surface-variant mt-1">Konfigurasi preferensi aplikasi dan keamanan akun.</p>
              </div>
              <button onClick={onCloseSettings} className="p-2 hover:bg-surface-container-high rounded-lg cursor-pointer"><Icon name="close" className="text-xl" /></button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-surface-container-low rounded-lg p-1 mb-8">
              {([['general', 'tune', 'Umum'], ['notifications', 'notifications', 'Notifikasi'], ['security', 'security', 'Keamanan'], ['display', 'palette', 'Tampilan']] as const).map(([key, icon, label]) => (
                <button key={key} onClick={() => setSettingsTab(key)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${settingsTab === key ? 'bg-white shadow-sm text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  <Icon name={icon} className="text-base" />{label}
                </button>
              ))}
            </div>

            {/* General */}
            {settingsTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Preferensi Regional</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Bahasa</label>
                      <select value={settings.language} onChange={e => setSettings({ ...settings, language: e.target.value })} className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                        <option>Bahasa Indonesia</option><option>English</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Timezone</label>
                      <select value={settings.timezone} onChange={e => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                        <option>Asia/Jakarta (WIB)</option><option>Asia/Makassar (WITA)</option><option>Asia/Jayapura (WIT)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Mata Uang</label>
                      <select value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                        <option value="USD">USD ($)</option><option value="IDR">IDR (Rp)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Format Tanggal</label>
                      <select value={settings.dateFormat} onChange={e => setSettings({ ...settings, dateFormat: e.target.value })} className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                        <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {settingsTab === 'notifications' && (
              <div className="bg-surface-container-low rounded-xl p-6 space-y-2">
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Preferensi Notifikasi</h4>
                <Toggle checked={settings.emailNotifications} onChange={v => setSettings({ ...settings, emailNotifications: v })} label="Notifikasi Email" />
                <Toggle checked={settings.pushNotifications} onChange={v => setSettings({ ...settings, pushNotifications: v })} label="Push Notifications" />
                <div className="pt-4 border-t border-outline-variant/10">
                  <p className="text-xs text-on-surface-variant">Notifikasi dikirim untuk: transaksi baru, persetujuan pending, login mencurigakan, dan update sistem.</p>
                </div>
              </div>
            )}

            {/* Security */}
            {settingsTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6 space-y-2">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Autentikasi</h4>
                  <Toggle checked={settings.twoFactorAuth} onChange={v => setSettings({ ...settings, twoFactorAuth: v })} label="Two-Factor Authentication (2FA)" />
                  {settings.twoFactorAuth && <p className="text-xs text-primary font-medium pl-1">2FA akan aktif setelah menyimpan pengaturan. Anda perlu scan QR code saat login berikutnya.</p>}
                </div>
                <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                  <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Session Timeout</h4>
                  <div className="flex items-center gap-4">
                    <input type="range" min="5" max="120" step="5" value={settings.sessionTimeout} onChange={e => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })} className="flex-1 accent-primary cursor-pointer" />
                    <span className="text-sm font-bold text-primary w-20 text-right">{settings.sessionTimeout} menit</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Sesi akan otomatis berakhir setelah {settings.sessionTimeout} menit tidak aktif.</p>
                </div>
              </div>
            )}

            {/* Display */}
            {settingsTab === 'display' && (
              <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tema Tampilan</h4>
                <div className="grid grid-cols-3 gap-3">
                  {([['light', 'light_mode', 'Light'], ['dark', 'dark_mode', 'Dark'], ['auto', 'brightness_auto', 'Auto']] as const).map(([key, icon, label]) => (
                    <button key={key} onClick={() => setSettings({ ...settings, theme: key })} className={`py-4 rounded-xl font-semibold text-sm transition-all cursor-pointer flex flex-col items-center gap-2 ${settings.theme === key ? 'bg-primary text-on-primary ring-2 ring-primary' : 'bg-white text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/20'}`}>
                      <Icon name={icon} className="text-2xl" />{label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-8 mt-8 border-t border-outline-variant/10">
              <button onClick={onCloseSettings} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high cursor-pointer">Batal</button>
              <button onClick={handleSaveSettings} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer disabled:opacity-70 flex items-center gap-2">
                {isSubmitting ? <><Spinner />Menyimpan...</> : <><Icon name="save" />Simpan Pengaturan</>}
              </button>
            </div>
          </div>
        </MB>
      )}
    </>
  );
}
