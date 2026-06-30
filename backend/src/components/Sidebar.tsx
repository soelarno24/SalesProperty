import { useState } from 'react';
import Icon from './Icon';

interface NavItem {
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { icon: 'dashboard', label: 'Dashboard' },
  { icon: 'business', label: 'Developer Management' },
  { icon: 'apartment', label: 'Projects' },
  { icon: 'inventory_2', label: 'Inventory' },
  { icon: 'group', label: 'User Management' },
  { icon: 'payments', label: 'Finance' },
  { icon: 'analytics', label: 'Reporting' },
];

interface SidebarProps {
  onLogout?: () => void;
  activeIndex?: number;
  onNavigate?: (index: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ onLogout, activeIndex = 0, onNavigate, isOpen = false, onClose }: SidebarProps) {
  const [localActive, setLocalActive] = useState(0);
  const currentActive = onNavigate ? activeIndex : localActive;

  const handleClick = (index: number) => {
    if (onNavigate) {
      onNavigate(index);
    } else {
      setLocalActive(index);
    }
    // Auto-close on mobile after navigation
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`h-screen w-72 fixed left-0 top-0 z-50 bg-surface flex flex-col py-8 px-6 gap-y-6 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo + Close button on mobile */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary-container">
              <Icon name="business_center" />
            </div>
            <div>
              <h1 className="font-headline text-xl text-on-surface leading-tight">Agent Properti</h1>
              <p className="font-label uppercase tracking-widest text-[10px] font-semibold text-on-secondary-fixed-variant">
                Manajemen Sales Properti
              </p>
            </div>
          </div>
          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleClick(index);
              }}
              className={`flex items-center gap-3 px-4 py-3 transition-all ${
                currentActive === index
                  ? 'text-on-primary-fixed-variant font-bold bg-primary-fixed rounded-lg scale-[0.98]'
                  : 'text-on-secondary-fixed-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg'
              }`}
            >
              <Icon name={item.icon} />
              <span className="font-label uppercase tracking-widest text-xs">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/10 pt-6">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-3 px-4 py-2 text-on-secondary-fixed-variant hover:text-on-surface transition-all rounded-lg hover:bg-surface-container-high"
          >
            <Icon name="help" />
            <span className="font-label uppercase tracking-widest text-[10px] font-semibold">Support</span>
          </a>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2 text-on-secondary-fixed-variant hover:text-on-surface transition-all cursor-pointer w-full rounded-lg hover:bg-surface-container-high"
          >
            <Icon name="logout" />
            <span className="font-label uppercase tracking-widest text-[10px] font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
