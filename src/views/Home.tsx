import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  ClipboardCheck, 
  ClipboardList, 
  Package, 
  Wrench, 
  Calendar, 
  FileText, 
  FileSpreadsheet, 
  MessageSquare, 
  Settings,
  ChevronRight,
  Shield,
  Clock,
  CalendarDays
} from 'lucide-react';
import { UserRole } from '../types';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR:
        return 'Administrador - Acesso Geral';
      case UserRole.CIA_OP:
        return 'Cia OP - Gestão Operacional';
      case UserRole.CBU:
        return 'CBU - Coordenador de Bombeiros da Unidade';
      case UserRole.OPERACIONAL:
        return 'Operacional - Acesso de Turno';
      default:
        return 'Militar';
    }
  };

  const getRoleBadgeStyle = (role?: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR:
        return 'bg-error/10 text-error border-error/20';
      case UserRole.CIA_OP:
        return 'bg-primary/10 text-primary border-primary/20';
      case UserRole.CBU:
        return 'bg-success/10 text-success border-success/20';
      case UserRole.OPERACIONAL:
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-outline-variant/10 text-on-surface-variant border-outline-variant/20';
    }
  };

  const allShortcuts = [
    {
      id: 'painel',
      label: 'Painel Analítico',
      description: 'Indicadores operacionais de frota, status de prontidão e gráficos analíticos.',
      href: '/painel',
      icon: LayoutDashboard,
      color: 'from-blue-500/20 to-blue-600/5 hover:border-blue-500/50 text-blue-600 dark:text-blue-400',
      iconColor: 'bg-blue-500/10 text-blue-600',
      roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU]
    },
    {
      id: 'viaturas',
      label: 'Frota de Viaturas',
      description: 'Inventário de viaturas, cadastramento, controle de quilometragem e operacionalidade.',
      href: '/viaturas',
      icon: Car,
      color: 'from-indigo-500/20 to-indigo-600/5 hover:border-indigo-500/50 text-indigo-600 dark:text-indigo-400',
      iconColor: 'bg-indigo-500/10 text-indigo-600',
      roles: [UserRole.ADMINISTRADOR]
    },
    {
      id: 'militares',
      label: 'Efetivo Militar',
      description: 'Cadastro, gerenciamento e controle de permissões de acesso do efetivo militar.',
      href: '/militares',
      icon: Users,
      color: 'from-emerald-500/20 to-emerald-600/5 hover:border-emerald-500/50 text-emerald-600 dark:text-emerald-400',
      iconColor: 'bg-emerald-500/10 text-emerald-600',
      roles: [UserRole.ADMINISTRADOR]
    },
    {
      id: 'checklist',
      label: 'Checklist Viatura',
      description: 'Formulário de vistoria mecânica e de conservação para início e troca de turno.',
      href: '/checklist',
      icon: ClipboardCheck,
      color: 'from-amber-500/20 to-amber-600/5 hover:border-amber-500/50 text-amber-600 dark:text-amber-400',
      iconColor: 'bg-amber-500/10 text-amber-600',
      roles: [UserRole.ADMINISTRADOR, UserRole.CBU, UserRole.OPERACIONAL]
    },
    {
      id: 'checklist-carga',
      label: 'Checklist de Carga',
      description: 'Conferência técnica detalhada de todos os materiais e equipamentos operacionais das viaturas.',
      href: '/checklist-carga',
      icon: ClipboardList,
      color: 'from-purple-500/20 to-purple-600/5 hover:border-purple-500/50 text-purple-600 dark:text-purple-400',
      iconColor: 'bg-purple-500/10 text-purple-600',
      roles: [UserRole.ADMINISTRADOR, UserRole.CBU, UserRole.OPERACIONAL]
    },
    {
      id: 'mapacarga',
      label: 'Mapa de Carga',
      description: 'Visualização e acompanhamento dos mapas de carga ativos e atribuições de materiais.',
      href: '/mapacarga',
      icon: Package,
      color: 'from-orange-500/20 to-orange-600/5 hover:border-orange-500/50 text-orange-600 dark:text-orange-400',
      iconColor: 'bg-orange-500/10 text-orange-600',
      roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.OPERACIONAL]
    },
    {
      id: 'manutencao',
      label: 'Controle de Manutenção',
      description: 'Gerenciamento de ordens de serviço, oficinas credenciadas e registro de custos gerais.',
      href: '/manutencao',
      icon: Wrench,
      color: 'from-red-500/20 to-red-600/5 hover:border-red-500/50 text-red-600 dark:text-red-400',
      iconColor: 'bg-red-500/10 text-red-600',
      roles: [UserRole.ADMINISTRADOR]
    },
    {
      id: 'revisoes',
      label: 'Controle de Revisões',
      description: 'Cronograma de preventivas, alertas de troca de óleo, pneus e revisões periódicas.',
      href: '/revisoes',
      icon: Calendar,
      color: 'from-teal-500/20 to-teal-600/5 hover:border-teal-500/50 text-teal-600 dark:text-teal-400',
      iconColor: 'bg-teal-500/10 text-teal-600',
      roles: [UserRole.ADMINISTRADOR]
    },
    {
      id: 'relatorios',
      label: 'Relatórios Diários',
      description: 'Histórico consolidado, filtros avançados e exportações de vistorias das viaturas.',
      href: '/relatorios',
      icon: FileText,
      color: 'from-cyan-500/20 to-cyan-600/5 hover:border-cyan-500/50 text-cyan-600 dark:text-cyan-400',
      iconColor: 'bg-cyan-500/10 text-cyan-600',
      roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU]
    },
    {
      id: 'relatorios-carga',
      label: 'Relatórios de Carga',
      description: 'Histórico de checklists de carga, controle de perdas e movimentações de materiais.',
      href: '/relatorios-carga',
      icon: FileSpreadsheet,
      color: 'from-violet-500/20 to-violet-600/5 hover:border-violet-500/50 text-violet-600 dark:text-violet-400',
      iconColor: 'bg-violet-500/10 text-violet-600',
      roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU]
    },
    {
      id: 'chat',
      label: 'Central de Mensagens',
      description: 'Canal de comunicação direta e envio de avisos operacionais em tempo real.',
      href: '/chat',
      icon: MessageSquare,
      color: 'from-pink-500/20 to-pink-600/5 hover:border-pink-500/50 text-pink-600 dark:text-pink-400',
      iconColor: 'bg-pink-500/10 text-pink-600',
      roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL]
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      description: 'Configurações de conta pessoal, chave de segurança e preferências do sistema.',
      href: '/configuracoes',
      icon: Settings,
      color: 'from-slate-500/20 to-slate-600/5 hover:border-slate-500/50 text-slate-600 dark:text-slate-400',
      iconColor: 'bg-slate-500/10 text-slate-600',
      roles: [UserRole.ADMINISTRADOR, UserRole.CIA_OP, UserRole.CBU, UserRole.OPERACIONAL]
    }
  ];

  const allowedShortcuts = allShortcuts.filter(shortcut => 
    user && shortcut.roles.includes(user.role)
  );

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Banner / Cabeçalho de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e252b] via-[#2d3a43] to-[#1a2025] text-white p-6 sm:p-8 md:p-10 shadow-lg border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-primary-container/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 text-primary-container animate-pulse" />
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getRoleBadgeStyle(user?.role)}`}>
                {getRoleLabel(user?.role)}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none text-white drop-shadow-sm">
              {getGreeting()}, {user?.rank} {user?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium tracking-wide leading-relaxed">
              Seja bem-vindo à Central Operacional da 7ª Cia Ind. Selecione um dos atalhos rápidos abaixo para acessar e gerenciar as funções administrativas e operacionais disponíveis para o seu perfil.
            </p>
          </div>
          
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-white/10 pt-4 md:pt-0 gap-2 shrink-0">
            <div className="flex items-center gap-2 text-slate-300">
              <CalendarDays className="w-4 h-4 text-primary-container shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-[9px] font-black uppercase tracking-widest md:mt-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <Clock className="w-3.5 h-3.5 text-primary-container shrink-0" />
              <span>Prontidão Operacional</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Atalhos */}
      <div className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {allowedShortcuts.map((shortcut, index) => {
            const Icon = shortcut.icon;
            return (
              <button
                key={shortcut.id}
                onClick={() => navigate(shortcut.href)}
                className="group relative flex flex-col text-left p-5 sm:p-6 bg-gradient-to-br from-white to-surface-container-lowest border border-outline-variant hover:border-primary/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 select-none cursor-pointer transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-98 animate-in fade-in zoom-in-95 duration-200"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                {/* Background Decorativo no Hover */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                
                {/* Ícone Redesenhado */}
                <div className="flex items-center justify-between w-full relative z-10 mb-4">
                  <div className={`p-3 rounded-xl ${shortcut.iconColor} border border-outline-variant/20 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-primary">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Conteúdo Textual */}
                <div className="space-y-2 relative z-10">
                  <h4 className="text-xs sm:text-sm font-black text-on-surface uppercase tracking-wider group-hover:text-primary transition-colors">
                    {shortcut.label}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] leading-relaxed text-on-surface-variant font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {shortcut.description}
                  </p>
                </div>

              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
