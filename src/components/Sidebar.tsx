import { LayoutDashboard, Car, ClipboardCheck, Wrench, FileText, User as UserIcon, Settings, LogOut, Users, Calendar } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Painel', href: '/', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: Car, label: 'Viaturas', href: '/viaturas', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: Users, label: 'Militares', href: '/militares', roles: [UserRole.ADMINISTRADOR] },
  { icon: ClipboardCheck, label: 'Checklist Diário', href: '/checklist', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL] },
  { icon: Wrench, label: 'Manutenção', href: '/manutencao', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: Calendar, label: 'Revisões', href: '/revisoes', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: FileText, label: 'Relatórios', href: '/relatorios', roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full w-[280px] bg-secondary flex flex-col py-8 z-50 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="px-6 mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">7ª Cia Ind</h1>
          <p className="text-[10px] uppercase font-black text-secondary-fixed-dim opacity-70 tracking-widest mt-1">Gestão de Frotas</p>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-white/50 hover:text-white">
          <LogOut className="w-6 h-6 rotate-180" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={({ isActive }) =>
              cn(
                "flex items-center px-6 py-3 text-secondary-fixed-dim hover:text-white hover:bg-white/5 transition-all duration-200 border-l-4 border-transparent",
                isActive && "border-primary-container bg-white/10 text-white font-bold"
              )
            }
          >
            <item.icon className="mr-4 w-5 h-5 opacity-70" />
            <span className="text-sm uppercase font-black tracking-widest text-[11px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto border-t border-white/5 pt-8 space-y-2">
        <NavLink 
          to="/configuracoes"
          onClick={() => {
            if (window.innerWidth < 1024) onClose();
          }}
          className={({ isActive }) =>
            cn(
              "flex items-center w-full text-secondary-fixed-dim hover:text-white transition-colors py-2 px-2 group rounded-xl",
              isActive && "bg-white/10 text-white font-bold"
            )
          }
        >
          <Settings className="mr-4 w-5 h-5 group-hover:rotate-45 transition-transform opacity-70" />
          <span className="text-[10px] uppercase font-black tracking-widest">Configurações</span>
        </NavLink>
        <button 
          onClick={logout}
          className="flex items-center w-full text-error/80 hover:text-error transition-colors py-2 px-2 group mt-4"
        >
          <LogOut className="mr-4 w-5 h-5 group-hover:-translate-x-1 transition-transform opacity-70" />
          <span className="text-[10px] uppercase font-black tracking-widest">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}
