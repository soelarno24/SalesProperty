import { useState, useEffect } from 'react';
import Icon from './Icon';

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCMjI2Ro3edpxVjk09nx201uy5XgKz64hKHbQhJ3pB64h6yasU1azk-VkR1rAsyzlyFGqfPbbVVNlIREK_f8DgPlmoR130JyDVzOwkKyCa9Qs2ejE7IVsioorw8YoNHnQWxREQo9mgFR5k3yFvrChLljTPrYP2O4CK7D_7kN59odXXiMNzlc57B4PozVRIrI_4yFbfaBNYYPev7Uzni51yV2jmzbppwA-Tmc6F9JCGjaAt4bAGKgpRtyQg6FonxLqwsmKVoacTlW_y_';

interface HeaderProps {
  searchPlaceholder?: string;
  adminName?: string;
  adminRole?: string;
  adminAvatar?: string;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onMenuToggle?: () => void;
}

export default function Header({
  searchPlaceholder = 'Search projects, sales or users...',
  adminName = 'Agent Properti Admin',
  adminRole = 'System Administrator',
  adminAvatar,
  onSettingsClick,
  onProfileClick,
  onMenuToggle,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 right-0 z-30 flex justify-between items-center w-full px-4 lg:px-8 h-16 bg-surface-container-lowest transition-all duration-300 ${
        scrolled ? 'shadow-sm bg-white/90 backdrop-blur-md' : ''
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <Icon name="menu" />
        </button>

        <div className="relative w-full max-w-md group">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-body outline-none"
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 cursor-pointer">
          <Icon name="notifications" />
        </button>
        <button
          onClick={onSettingsClick}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 cursor-pointer"
        >
          <Icon name="settings" />
        </button>
        <div className="hidden sm:block h-8 w-[1px] bg-outline-variant opacity-20 mx-1 lg:mx-2"></div>
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 pl-1 lg:pl-2 hover:bg-surface-container-low rounded-lg pr-2 py-1 transition-colors cursor-pointer"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-on-surface">{adminName}</p>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{adminRole}</p>
          </div>
          <img
            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-fixed"
            alt="Admin avatar"
            src={adminAvatar || AVATAR_URL}
          />
        </button>
      </div>
    </header>
  );
}
