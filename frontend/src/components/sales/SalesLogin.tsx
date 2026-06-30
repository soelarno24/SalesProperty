import { useState, useRef, useEffect } from 'react';

interface Props { onLogin: () => void; }

const SIDE_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLucYGkZKOPUw4TMnGKYWJkfwwt8pUxz049uguSkYgtbT2IQSZu60WzVVlqIodFMsxbLg0ekcOPenae5JVTUzXkyoor0XQlMPBlVUG1ZNCN2DCpmk03U-5QAs9now9ziU05phVf8tQZD9hDCzEgRtouOuGnM_eC2AC7O0slfgoptj5nsEP4K9nzrrJ9CkyK9D4iY3pp3g9Aj4TB_hxAZhIEgkALUUtCTtnyDtQl24LNoWJpAYAQYjPd4rwcY-CLFcJ3Gca9qFWIixb';

export default function SalesLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [state, setState] = useState<'idle'|'loading'|'success'>('idle');
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state !== 'idle') return;
    if (!email.trim() || !password.trim()) { setError('Email dan password wajib diisi.'); return; }
    setError('');
    setState('loading');
    setTimeout(() => {
      setState('success');
      setTimeout(() => onLogin(), 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col relative">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-tertiary/5 rounded-full blur-[100px]" />
      </div>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-5 relative z-10">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>phone_android</span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-on-surface">Agent Properti</h1>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-1 font-semibold">Sales Mobile App</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/85 backdrop-blur-xl border border-outline-variant/15 p-7 rounded-2xl shadow-2xl shadow-on-surface/5">
            <header className="mb-6">
              <h2 className="font-headline text-xl text-on-surface mb-1">Sign In</h2>
              <p className="text-on-surface-variant text-sm">Masuk untuk mengakses katalog, CRM, dan tools penjualan.</p>
            </header>

            {error && (
              <div className="mb-4 p-3 bg-error-container/20 border border-error/20 rounded-xl flex items-center gap-2 text-sm text-error">
                <span className="material-symbols-outlined text-base">error</span>{error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@agentproperti.id"
                    disabled={state !== 'idle'}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password</label>
                  <a href="#" onClick={e => e.preventDefault()} className="text-primary text-xs font-medium hover:underline">Lupa password?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={state !== 'idle'}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-60"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-lg">{showPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center">
                <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} disabled={state !== 'idle'} className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary/20 cursor-pointer" />
                <label htmlFor="remember" className="ml-2 text-sm text-on-surface-variant cursor-pointer">Ingat saya di perangkat ini</label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={state !== 'idle'}
                className={`w-full py-3.5 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                  state === 'success'
                    ? 'bg-tertiary text-on-tertiary'
                    : 'bg-gradient-to-r from-primary to-primary-container text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5'
                } disabled:cursor-not-allowed`}
              >
                {state === 'idle' && (<>Masuk <span className="material-symbols-outlined text-lg">arrow_forward</span></>)}
                {state === 'loading' && (<>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Memverifikasi...
                </>)}
                {state === 'success' && (<><span className="material-symbols-outlined text-xl">check_circle</span>Berhasil!</>)}
              </button>
            </form>
          </div>

          {/* Footer */}
          <footer className="mt-6 text-center">
            <p className="text-xs text-on-surface-variant font-label tracking-wide">
              Hanya untuk sales agent yang terdaftar.
              <br />© 2024 Agent Properti. All rights reserved.
            </p>
            <div className="mt-3 flex justify-center gap-4">
              <a href="#" onClick={e => e.preventDefault()} className="text-xs text-outline hover:text-primary transition-colors">Privacy</a>
              <a href="#" onClick={e => e.preventDefault()} className="text-xs text-outline hover:text-primary transition-colors">Bantuan</a>
            </div>
          </footer>
        </div>
      </main>

      {/* Side Image (tablet/desktop) */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-1/3 z-0">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${SIDE_IMG}')` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}
