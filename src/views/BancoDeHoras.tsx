import React, { useState, useMemo } from 'react';
import { Clock, Calendar, CalendarCheck, Eye, ArrowUpDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import TimeBank from './TimeBank';
import Escala from './Escala';
import Plantao from './Plantao';
import ConsultaHoras from './ConsultaHoras';
import MovimentacaoDiaria from './MovimentacaoDiaria';
import { motion, AnimatePresence } from 'motion/react';

type SubTab = 'folga_extra' | 'escala' | 'plantao' | 'consulta' | 'movimentacao';

export default function BancoDeHoras() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SubTab>(() => {
    return user?.role === UserRole.OPERACIONAL ? 'consulta' : 'escala';
  });

  // Adjust active tab when user loads
  React.useEffect(() => {
    if (user) {
      if (user.role === UserRole.OPERACIONAL) {
        setActiveTab('consulta');
      } else {
        setActiveTab('escala');
      }
    }
  }, [user]);

  // Define tab configuration based on permissions
  const tabs = useMemo(() => {
    if (!user) return [];

    // Operational users see ONLY Consulta de Horas and Movimentação Diária
    if (user.role === UserRole.OPERACIONAL) {
      return [
        { id: 'consulta' as SubTab, label: 'CONSULTA', icon: Eye },
        { id: 'movimentacao' as SubTab, label: 'MOVIMENTAÇÃO DIÁRIA', icon: ArrowUpDown }
      ];
    }

    // CBU, CIA OP and Developers see the full list of 5 sub-tabs
    if ([UserRole.CBU, UserRole.CIA_OP, UserRole.DESENVOLVEDOR].includes(user.role)) {
      return [
        { id: 'escala' as SubTab, label: 'ESCALA', icon: Calendar },
        { id: 'folga_extra' as SubTab, label: 'FOLGA / HORA EXTRA', icon: Clock },
        { id: 'plantao' as SubTab, label: 'PLANTÃO', icon: CalendarCheck },
        { id: 'consulta' as SubTab, label: 'CONSULTA', icon: Eye },
        { id: 'movimentacao' as SubTab, label: 'MOVIMENTAÇÃO DIÁRIA', icon: ArrowUpDown }
      ];
    }

    return [];
  }, [user]);

  // Block ADMINISTRADOR from viewing this component completely
  if (user && user.role === UserRole.ADMINISTRADOR) {
    return (
      <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-[24px] text-center shadow-sm max-w-lg mx-auto mt-10">
        <p className="text-xs font-black uppercase text-error tracking-widest">Acesso Não Autorizado</p>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-2">
          O Banco de Horas / KM não está disponível para o perfil Administrativo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Sub-Tabs Navigation Bar */}
      <div className="bg-surface-container-lowest p-2 rounded-[20px] border border-outline-variant shadow-sm overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer select-none relative ${
                  isActive 
                    ? 'text-white bg-primary shadow-lg shadow-primary/10' 
                    : 'text-on-surface-variant hover:text-primary hover:bg-primary/5 bg-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeSubTabIndicator"
                    className="absolute inset-0 bg-primary rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Sub-view Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'folga_extra' && <TimeBank />}
            {activeTab === 'escala' && <Escala />}
            {activeTab === 'plantao' && <Plantao />}
            {activeTab === 'consulta' && <ConsultaHoras />}
            {activeTab === 'movimentacao' && <MovimentacaoDiaria />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
