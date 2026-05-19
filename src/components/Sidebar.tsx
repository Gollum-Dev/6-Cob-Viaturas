import { LayoutDashboard, Car, ClipboardCheck, ClipboardList, Wrench, FileText, FileSpreadsheet, User as UserIcon, Settings, LogOut, Users, Calendar, MessageSquare, Package, Home } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { UserRole } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: Home, label: 'Início', href: '/', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL] },
  { icon: LayoutDashboard, label: 'Painel', href: '/painel', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: Car, label: 'Viaturas', href: '/viaturas', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: Users, label: 'Militares', href: '/militares', roles: [UserRole.ADMINISTRADOR] },
  { icon: ClipboardCheck, label: 'Checklist Viatura', href: '/checklist', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL] },
  { icon: ClipboardList, label: 'Checklist Carga', href: '/checklist-carga', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL] },
  { icon: Package, label: 'Mapa Carga', href: '/mapacarga', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL] },
  { icon: Wrench, label: 'Manutenção', href: '/manutencao', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP] },
  { icon: Calendar, label: 'Revisões', href: '/revisoes', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP] },
  { icon: FileText, label: 'Relatório Viatura', href: '/relatorios', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: FileSpreadsheet, label: 'Relatório Carga', href: '/relatorios-carga', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: MessageSquare, label: 'Mensagens', href: '/chat', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useChat();

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full w-[280px] bg-gradient-to-br from-[#1e252b] via-[#2d3a43] to-[#1a2025] border-r border-white/5 flex flex-col py-8 z-50 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="px-6 mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm uppercase">7ª Cia Ind</h1>
          <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mt-1">Gestão de Frotas</p>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-white/50 hover:text-white cursor-pointer">
          <LogOut className="w-6 h-6 rotate-180" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={({ isActive }) =>
              cn(
                "flex items-center px-6 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 border-l-4 border-transparent group select-none cursor-pointer",
                isActive && "border-primary bg-white/10 text-white font-bold"
              )
            }
          >
            <item.icon className="mr-4 w-5 h-5 opacity-75 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm uppercase font-black tracking-widest text-[11px] flex-1 group-hover:translate-x-0.5 transition-transform">{item.label}</span>
            {item.label === 'Mensagens' && unreadCount > 0 && (
              <span className="bg-error text-white font-black text-[9px] px-2 py-0.5 rounded-full mr-4 animate-pulse">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
