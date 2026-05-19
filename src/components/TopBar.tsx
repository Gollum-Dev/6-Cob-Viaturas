import { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  HelpCircle, 
  Menu, 
  User as UserIcon,
  LayoutDashboard,
  Car,
  PlusCircle,
  Edit3,
  Shield,
  UserPlus,
  Award,
  ClipboardCheck,
  ClipboardList,
  Wrench,
  CalendarRange,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  ChevronDown,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let title = "Sistema";
  let subtitle = "Gestão de Frotas";
  let IconComponent = Shield;

  if (path === '/') {
    title = "Painel de Controle";
    subtitle = "Indicadores em tempo real e status da frota";
    IconComponent = LayoutDashboard;
  } else if (path === '/viaturas') {
    title = "Frota de Viaturas";
    subtitle = "Gestão detalhada, ficha técnica e disponibilidade";
    IconComponent = Car;
  } else if (path.startsWith('/viaturas/nova') || path.startsWith('/viaturas/novo')) {
    title = "Nova Viatura";
    subtitle = "Inclusão de viatura operacional na frota ativa";
    IconComponent = PlusCircle;
  } else if (path.startsWith('/viaturas/editar')) {
    title = "Editar Viatura";
    subtitle = "Atualização de dados cadastrais e status operacional";
    IconComponent = Edit3;
  } else if (path === '/militares') {
    title = "Efetivo Militar";
    subtitle = "Cadastro, permissões e gerenciamento do efetivo";
    IconComponent = Users;
  } else if (path.startsWith('/militares/novo')) {
    title = "Novo Cadastro";
    subtitle = "Registrar novo acesso militar no sistema";
    IconComponent = UserPlus;
  } else if (path.startsWith('/militares/editar')) {
    title = "Editar Militar";
    subtitle = "Atualizar informações e permissões do militar";
    IconComponent = Award;
  } else if (path === '/checklist') {
    title = "Checklist Viatura";
    subtitle = "Inspeção da viatura para saída e troca de turno";
    IconComponent = ClipboardCheck;
  } else if (path === '/checklist-carga') {
    title = "Checklist Carga";
    subtitle = "Conferência e vistoria dos materiais e equipamentos de carga";
    IconComponent = ClipboardList;
  } else if (path === '/manutencao') {
    title = "Manutenção Corretiva";
    subtitle = "Controle de ordens de serviço, oficinas e custos";
    IconComponent = Wrench;
  } else if (path === '/revisoes') {
    title = "Controle de Revisões";
    subtitle = "Cronograma de trocas de óleo, pneus e preventivas";
    IconComponent = CalendarRange;
  } else if (path === '/relatorios') {
    title = "Relatório Viatura";
    subtitle = "Lançamentos de checklists e ações do sistema";
    IconComponent = FileSpreadsheet;
  } else if (path === '/relatorios-carga') {
    title = "Relatório Carga";
    subtitle = "Lançamentos de checklists e inspeções de carga";
    IconComponent = FileSpreadsheet;
  } else if (path === '/chat') {
    title = "Central de Mensagens";
    subtitle = "Comunicação interna direta em tempo real";
    IconComponent = MessageSquare;
  } else if (path === '/mapacarga') {
    title = "Mapa de Carga";
    subtitle = "Gerenciamento e controle de carga de viaturas";
    IconComponent = Package;
  } else if (path === '/configuracoes') {
    title = "Configurações";
    subtitle = "Dados pessoais, segurança e chave de acesso";
    IconComponent = Settings;
  }

  return (
    <header className="h-20 flex justify-between items-center px-4 md:px-8 bg-white/90 border-b border-outline-variant fixed top-0 left-0 right-0 lg:sticky lg:top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors flex-shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Título e Descrição da Página com Ícone de Identificação */}
        <div className="flex items-center gap-3 min-w-0 max-w-[85%] sm:max-w-full">
          <div className="p-2 bg-primary/10 rounded-xl text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="flex flex-col items-start justify-center min-w-0">
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-on-surface leading-none uppercase tracking-tight truncate w-full">
              {title}
            </span>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider truncate w-full mt-1.5 opacity-80">
              {subtitle}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
        {/* Profile Avatar e Dropdown Interativo */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 border-l border-outline-variant pl-4 md:pl-8 hover:bg-surface-container/60 rounded-xl py-1.5 px-2 transition-all duration-200 select-none cursor-pointer active:scale-98"
          >
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black text-on-surface leading-none uppercase tracking-tight">{user?.rank} {user?.name}</span>
              <span className="text-[8px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mt-1">{user?.role}</span>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-surface-container-high rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant transition-all hover:border-primary/40 relative overflow-hidden group">
              <UserIcon className="w-4 h-4 md:w-5 md:h-5 opacity-50 group-hover:scale-110 transition-transform text-primary" />
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant/60 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white/95 border border-outline-variant shadow-2xl rounded-2xl p-2 z-50 backdrop-blur-md transition-all duration-200 transform origin-top-right animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-outline-variant/60 flex flex-col">
                <span className="text-xs font-black text-on-surface uppercase tracking-tight truncate">
                  {user?.rank} {user?.name}
                </span>
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-70">
                  {user?.role}
                </span>
              </div>
              
              <div className="mt-1 space-y-1">
                <Link 
                  to="/configuracoes"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-surface-container rounded-xl text-on-surface transition-colors group text-left"
                >
                  <Settings className="w-4 h-4 text-on-surface-variant group-hover:rotate-45 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Configurações</span>
                </Link>
                
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-error/10 hover:text-error rounded-xl text-error transition-colors group text-left border-t border-outline-variant/30 mt-1"
                >
                  <LogOut className="w-4 h-4 text-error/80 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sair do Sistema</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

