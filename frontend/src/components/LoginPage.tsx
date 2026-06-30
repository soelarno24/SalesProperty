import { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

type UserRole = 'admin' | 'leader' | 'sales';

const SIDE_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDLucYGkZKOPUw4TMnGKYWJkfwwt8pUxz049uguSkYgtbT2IQSZu60WzVVlqIodFMsxbLg0ekcOPenae5JVTUzXkyoor0XQlMPBlVUG1ZNCN2DCpmk03U-5QAs9now9ziU05phVf8tQZD9hDCzEgRtouOuGnM_eC2AC7O0slfgoptj5nsEP4K9nzrrJ9CkyK9D4iY3pp3g9Aj4TB_hxAZhIEgkALUUtCTtnyDtQl24LNoWJpAYAQYjPd4rwcY-CLFcJ3Gca9qFWIixb';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitState !== 'idle') return;

    setSubmitState('loading');

    setTimeout(() => {
      setSubmitState('success');
      setTimeout(() => {
        onLogin(selectedRole);
      }, 800);
    }, 1500);
  };

  return (
    <div className="bg-surface-container-lowest font-body text-on-surface min-h-screen flex flex-col relative">
      {/* Atmospheric Background Element */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-tertiary/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-4xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_stories
              </span>
            </div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
              Agent Properti
            </h2>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-1 font-semibold">
              Manajemen Sales Properti
            </p>
          </div>

          {/* Login Card */}
          <div className="glass-panel border border-outline-variant/15 p-10 rounded-xl shadow-2xl shadow-on-surface/5">
            <header className="mb-8">
              <h1 className="font-headline text-2xl text-on-surface mb-2">Sign In</h1>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Enter your credentials to access the Sales Properties management dashboard.
              </p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span
                    className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors duration-200 ${
                      emailFocused ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    mail
                  </span>
                  <input
                    ref={emailRef}
                    className="editorial-input w-full pl-10 pr-4 py-3 bg-white border border-outline-variant/30 rounded-lg text-sm placeholder:text-outline/50"
                    id="email"
                    name="email"
                    placeholder="name@alexandria.pro"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    disabled={submitState !== 'idle'}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-primary text-xs font-medium hover:underline transition-all"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span
                    className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors duration-200 ${
                      passwordFocused ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    lock
                  </span>
                  <input
                    className="editorial-input w-full pl-10 pr-12 py-3 bg-white border border-outline-variant/30 rounded-lg text-sm placeholder:text-outline/50"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    disabled={submitState !== 'idle'}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    tabIndex={-1}
                  >
                    <Icon
                      name={showPassword ? 'visibility_off' : 'visibility'}
                      className="text-lg"
                    />
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Login Sebagai
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setSelectedRole('admin')} disabled={submitState !== 'idle'}
                    className={`py-3 rounded-lg font-medium text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${selectedRole === 'admin' ? 'bg-primary text-on-primary ring-2 ring-primary shadow-md' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'}`}>
                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                    <span className="text-xs">Admin</span>
                  </button>
                  <button type="button" onClick={() => setSelectedRole('leader')} disabled={submitState !== 'idle'}
                    className={`py-3 rounded-lg font-medium text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${selectedRole === 'leader' ? 'bg-tertiary text-on-tertiary ring-2 ring-tertiary shadow-md' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'}`}>
                    <span className="material-symbols-outlined text-lg">groups</span>
                    <span className="text-xs">Leader</span>
                  </button>
                  <button type="button" onClick={() => setSelectedRole('sales')} disabled={submitState !== 'idle'}
                    className={`py-3 rounded-lg font-medium text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${selectedRole === 'sales' ? 'bg-gradient-to-b from-primary to-primary-container text-white ring-2 ring-primary shadow-md' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'}`}>
                    <span className="material-symbols-outlined text-lg">phone_android</span>
                    <span className="text-xs">Sales</span>
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center">
                <input
                  className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={submitState !== 'idle'}
                />
                <label className="ml-2 text-sm text-on-surface-variant cursor-pointer" htmlFor="remember">
                  Keep me logged in for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                className={`w-full py-4 font-medium text-sm rounded-lg flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer ${
                  submitState === 'success'
                    ? 'bg-tertiary text-on-tertiary'
                    : 'btn-primary-gradient text-white'
                }`}
                type="submit"
                disabled={submitState !== 'idle'}
              >
                {submitState === 'idle' && (
                  <>
                    Sign In
                    <Icon
                      name="arrow_forward"
                      className="text-lg group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
                {submitState === 'loading' && (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Authenticating...
                  </>
                )}
                {submitState === 'success' && (
                  <>
                    <Icon name="check_circle" className="text-xl" />
                    Access Granted
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Meta */}
          <footer className="mt-8 text-center">
            <p className="text-xs text-on-surface-variant font-label tracking-wide">
              Authorized personnel only.
              <br />
              © 2024 Agent Properti. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center gap-6">
              <a
                href="#"
                className="text-xs text-outline hover:text-primary transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-outline hover:text-primary transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Security Standards
              </a>
              <a
                href="#"
                className="text-xs text-outline hover:text-primary transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Contact Support
              </a>
            </div>
          </footer>
        </div>
      </main>

      {/* Side Image Decor (Visible on larger screens) */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-1/3 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${SIDE_IMAGE_URL}')` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-surface-container-lowest via-transparent to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
