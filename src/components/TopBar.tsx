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
  Wrench,
  CalendarRange,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  Users
} from 'lucide-react';
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
    title = "Checklist Diário";
    subtitle = "Inspeção diária para saída e troca de turno";
    IconComponent = ClipboardCheck;
  } else if (path === '/manutencao') {
    title = "Manutenção Corretiva";
    subtitle = "Controle de ordens de serviço, oficinas e custos";
    IconComponent = Wrench;
  } else if (path === '/revisoes') {
    title = "Controle de Revisões";
    subtitle = "Cronograma de trocas de óleo, pneus e preventivas";
    IconComponent = CalendarRange;
  } else if (path === '/relatorios') {
    title = "Relatórios e Auditoria";
    subtitle = "Lançamentos de conferências e ações do sistema";
    IconComponent = FileSpreadsheet;
  } else if (path === '/chat') {
    title = "Central de Mensagens";
    subtitle = "Comunicação interna direta em tempo real";
    IconComponent = MessageSquare;
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

