import React from 'react';
import { LayoutDashboard, Car, ClipboardCheck, ClipboardList, Wrench, FileText, FileSpreadsheet, User as UserIcon, Settings, LogOut, Users, Calendar, MessageSquare, Package, Home, Clock } from 'lucide-react';
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
  { icon: Home, label: 'Início', href: '/', roles: [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL] },
  { icon: LayoutDashboard, label: 'Painel', href: '/painel', roles: [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: Car, label: 'Viaturas', href: '/viaturas', roles: [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR] },
  { icon: Users, label: 'Militares', href: '/militares', roles: [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR] },
  { icon: ClipboardCheck, label: 'Checklist Viatura', href: '/checklist', roles: [UserRole.DESENVOLVEDOR, UserRole.CBU, UserRole.OPERACIONAL] },
  { icon: ClipboardList, label: 'Checklist Carga', href: '/checklist-carga', roles: [UserRole.DESENVOLVEDOR, UserRole.CBU, UserRole.OPERACIONAL] },
  { icon: Package, label: 'Mapa Carga', href: '/mapacarga', roles: [UserRole.DESENVOLVEDOR, UserRole.CIA_OP] },
  { icon: Wrench, label: 'Manutenção', href: '/manutencao', roles: [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR] },
  { icon: Calendar, label: 'Revisões', href: '/revisoes', roles: [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR] },
  { icon: Clock, label: 'Horas / KM', href: '/banco-horas', roles: [UserRole.DESENVOLVEDOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL] },
  { icon: FileText, label: 'Relatório Viatura', href: '/relatorios', roles: [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: FileSpreadsheet, label: 'Relatório Carga', href: '/relatorios-carga', roles: [UserRole.DESENVOLVEDOR, UserRole.CIA_OP, UserRole.CBU] },
  { icon: MessageSquare, label: 'Mensagens', href: '/chat', roles: [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL] },
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
    <aside 
      className={cn(
        "notranslate fixed left-0 top-0 h-full w-[280px] bg-gradient-to-br from-[#1e252b] via-[#2d3a43] to-[#1a2025] border-r border-white/5 flex flex-col py-8 z-50 shadow-2xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="px-6 mb-10 flex justify-between items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black text-white tracking-tight drop-shadow-sm uppercase truncate">
            {user?.unit || '7ª Cia Ind'}
          </h1>
          <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mt-1">Gestão Operacional</p>
        </div>
        <button onClick={onClose} className="p-2 text-white/50 hover:text-white cursor-pointer flex-shrink-0 ml-2">
          <LogOut className="w-6 h-6 rotate-180" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center px-6 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 border-l-4 border-transparent group select-none cursor-pointer",
                isActive && "border-primary bg-white/10 text-white font-bold"
              )
            }
          >
            <item.icon className="mr-4 w-5 h-5 opacity-75 group-hover:opacity-100 transition-opacity" />
            <span className="uppercase font-black tracking-widest text-[11px] flex-1 group-hover:translate-x-0.5 transition-transform">{item.label}</span>
            {item.label === 'Mensagens' && unreadCount > 0 && (
              <span className="bg-error text-white font-black text-[9px] px-2 py-0.5 rounded-full mr-4 animate-pulse">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Perfil do Usuário no rodapé da Sidebar para dispositivos móveis */}
      {user && (
        <div className="px-6 pt-4 mt-auto border-t border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-white shrink-0">
            <UserIcon className="w-5 h-5 opacity-75 text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-white uppercase tracking-tight truncate leading-none">
              {user.rank} {user.name}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">
              {user.role === UserRole.ADMINISTRADOR ? 'Administrador' :
               user.role === UserRole.DESENVOLVEDOR ? 'Desenvolvedor' :
               user.role === UserRole.CIA_OP ? 'Cia OP - Gestão' :
               user.role === UserRole.CBU ? 'CBU - Coordenador' :
               user.role === UserRole.OPERACIONAL ? 'Operacional' : user.role}
            </span>
            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 truncate">
              {user.unit || '7ª CIA IND'}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
