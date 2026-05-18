import { Bell, HelpCircle, Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  let title = "Sistema";
  let subtitle = "Gestão de Frotas";

  if (path === '/') {
    title = "Painel";
    subtitle = "Visão Geral";
  } else if (path === '/viaturas') {
    title = "Viaturas";
    subtitle = "Inventário";
  } else if (path.startsWith('/viaturas/novo')) {
    title = "Nova Viatura";
    subtitle = "Cadastrar";
  } else if (path.startsWith('/viaturas/editar')) {
    title = "Editar Viatura";
    subtitle = "Ajustar Dados";
  } else if (path === '/militares') {
    title = "Militares";
    subtitle = "Efetivo";
  } else if (path.startsWith('/militares/novo')) {
    title = "Novo Militar";
    subtitle = "Cadastrar";
  } else if (path.startsWith('/militares/editar')) {
    title = "Editar Militar";
    subtitle = "Ajustar Dados";
  } else if (path === '/checklist') {
    title = "Checklist Diário";
    subtitle = "Inspeção";
  } else if (path === '/manutencao') {
    title = "Manutenção";
    subtitle = "Controle de O.S.";
  } else if (path === '/revisoes') {
    title = "Revisões";
    subtitle = "Alertas";
  } else if (path === '/relatorios') {
    title = "Relatórios";
    subtitle = "Logs";
  } else if (path === '/chat') {
    title = "Mensagens";
    subtitle = "Comunicação";
  } else if (path === '/configuracoes') {
    title = "Configurações";
    subtitle = "Ajustes";
  }

  return (
    <header className="h-16 flex justify-between items-center px-4 md:px-8 bg-white/90 border-b border-outline-variant fixed top-0 left-0 right-0 lg:sticky lg:top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors flex-shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Título e Descrição da Página para Todas as Versões */}
        <div className="flex flex-col items-start justify-center min-w-0">
          <span className="text-[11px] md:text-sm lg:text-base font-black text-on-surface leading-tight uppercase tracking-wider truncate w-full">
            {title}
          </span>
          <span className="text-[8px] md:text-[9px] lg:text-[11px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest truncate w-full mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
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
