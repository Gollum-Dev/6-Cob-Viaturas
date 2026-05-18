import { Bell, HelpCircle, Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 flex justify-between items-center px-4 md:px-8 bg-white/90 border-b border-outline-variant fixed top-0 left-0 right-0 lg:sticky lg:top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4 border-l border-outline-variant pl-4 md:pl-8">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-black text-on-surface leading-none uppercase tracking-tight">{user?.rank} {user?.name}</span>
            <span className="text-[8px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mt-1">{user?.role}</span>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-surface-container-high rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant">
            <UserIcon className="w-4 h-4 md:w-5 md:h-5 opacity-40" />
          </div>
        </div>
      </div>
    </header>
  );
}
