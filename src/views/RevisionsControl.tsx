import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Wrench, Disc, Gauge, Droplets, AlertTriangle, Edit } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import { useAuth } from '../context/AuthContext';
import { UserRole, VehicleStatus } from '../types';
import { cn } from '../lib/utils';

export default function RevisionsControl() {
  const { vehicles } = useVehicles();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCBU = user?.role === UserRole.CBU;
  const isCiaOP = user?.role === UserRole.CIA_OP;
  
  const [tirePage, setTirePage] = useState(1);
  const [oilKmPage, setOilKmPage] = useState(1);
  const [oilDatePage, setOilDatePage] = useState(1);

  const tireValidityAlerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return vehicles
      .filter(v => v.status === VehicleStatus.AVAILABLE && v.tireValidityDate)
      .map(v => {
        const [year, month, day] = v.tireValidityDate!.split('-').map(Number);
        const validityDate = new Date(year, month - 1, day);
        validityDate.setHours(0, 0, 0, 0);

        const diffTime = validityDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          ...v,
          daysRemaining: diffDays
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [vehicles]);

  const oilChangeAlerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return vehicles
      .filter(v => v.status === VehicleStatus.AVAILABLE && v.nextOilChangeDate)
      .map(v => {
        const [year, month, day] = v.nextOilChangeDate!.split('-').map(Number);
        const validityDate = new Date(year, month - 1, day);
        validityDate.setHours(0, 0, 0, 0);

        const diffTime = validityDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          ...v,
          daysRemaining: diffDays
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [vehicles]);

  const oilChangeKmAlerts = useMemo(() => {
    return vehicles
      .filter(v => v.status === VehicleStatus.AVAILABLE && v.lastOilChangeOdometer !== undefined)
      .map(v => {
        const nextChangeKm = (v.lastOilChangeOdometer || 0) + 10000;
        const kmRemaining = nextChangeKm - v.odometer;
        
        return {
          ...v,
          nextChangeKm,
          kmRemaining
        };
      })
      .sort((a, b) => a.kmRemaining - b.kmRemaining);
  }, [vehicles]);

  const ITEMS_PER_PAGE = 3;

  // Pagination for Tire Alerts
  const totalTirePages = Math.ceil(tireValidityAlerts.length / ITEMS_PER_PAGE) || 1;
  const currentTirePage = Math.min(tirePage, totalTirePages);
  const paginatedTireAlerts = useMemo(() => {
    const start = (currentTirePage - 1) * ITEMS_PER_PAGE;
    return tireValidityAlerts.slice(start, start + ITEMS_PER_PAGE);
  }, [tireValidityAlerts, currentTirePage]);

  // Pagination for Oil KM Alerts
  const totalOilKmPages = Math.ceil(oilChangeKmAlerts.length / ITEMS_PER_PAGE) || 1;
  const currentOilKmPage = Math.min(oilKmPage, totalOilKmPages);
  const paginatedOilKmAlerts = useMemo(() => {
    const start = (currentOilKmPage - 1) * ITEMS_PER_PAGE;
    return oilChangeKmAlerts.slice(start, start + ITEMS_PER_PAGE);
  }, [oilChangeKmAlerts, currentOilKmPage]);

  // Pagination for Oil Date Alerts
  const totalOilDatePages = Math.ceil(oilChangeAlerts.length / ITEMS_PER_PAGE) || 1;
  const currentOilDatePage = Math.min(oilDatePage, totalOilDatePages);
  const paginatedOilDateAlerts = useMemo(() => {
    const start = (currentOilDatePage - 1) * ITEMS_PER_PAGE;
    return oilChangeAlerts.slice(start, start + ITEMS_PER_PAGE);
  }, [oilChangeAlerts, currentOilDatePage]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pt-6">

      <div className="space-y-6 sm:space-y-8">
        {/* Alerta de Validade de Pneus Section */}
        <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="font-bold text-on-surface uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2">
              <Disc className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Alerta de Validade de Pneus
            </h3>
            <span className="text-[8px] sm:text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase">
              {tireValidityAlerts.length} Monitorados
            </span>
          </div>
          
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/30 border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Viatura</th>
                  {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Unidade</th>}
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Validade</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">Dias Restantes</th>
                  {!isCBU && !isCiaOP && (
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[80px] text-center">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {tireValidityAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) ? 6 : (!isCBU && !isCiaOP ? 5 : 4)} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                      Nenhuma data de validade de pneus cadastrada.
                    </td>
                  </tr>
                ) : (
                  paginatedTireAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-black text-primary text-xs uppercase">{alert.prefix}</span>
                        <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{alert.type}</span>
                      </td>
                      {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && (
                        <td className="px-6 py-4 font-bold text-on-surface text-[11px] uppercase tracking-wider">
                          {alert.unit || '-'}
                        </td>
                      )}
                      <td className="px-6 py-4 text-xs font-bold text-on-surface-variant font-data-mono">
                        {new Date(alert.tireValidityDate!).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        {alert.daysRemaining < 0 ? (
                          <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-error/20">Vencido</span>
                        ) : alert.daysRemaining <= 30 ? (
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-200">Próx. ao Vencimento</span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-200">Regular</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                         <span className={cn(
                           "text-xs font-bold font-data-mono",
                           alert.daysRemaining < 0 ? "text-error" : alert.daysRemaining <= 30 ? "text-amber-600" : "text-on-surface-variant"
                         )}>
                           {alert.daysRemaining < 0 ? `${Math.abs(alert.daysRemaining)} dias atrás` : `${alert.daysRemaining} dias`}
                         </span>
                      </td>
                      {!isCBU && !isCiaOP && (
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => navigate(`/viaturas/editar/${alert.id}`)}
                            className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Editar Viatura"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Card List */}
          <div className="block md:hidden divide-y divide-outline-variant/30">
            {tireValidityAlerts.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-on-surface-variant italic opacity-50">
                Nenhuma data de validade de pneus cadastrada.
              </div>
            ) : (
              paginatedTireAlerts.map((alert) => (
                <div key={alert.id} className="p-4 space-y-3 hover:bg-surface-container-low/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-black text-primary text-xs uppercase tracking-wider">{alert.prefix}</span>
                        <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{alert.type}</span>
                        {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && (
                          <span className="block text-[9px] font-bold text-on-surface-variant opacity-80 uppercase tracking-widest mt-1">
                            {alert.unit || '-'}
                          </span>
                        )}
                      </div>
                      {!isCBU && !isCiaOP && (
                        <button 
                          onClick={() => navigate(`/viaturas/editar/${alert.id}`)}
                          className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          title="Editar Viatura"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      {alert.daysRemaining < 0 ? (
                        <span className="bg-error/10 text-error px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-error/20">Vencido</span>
                      ) : alert.daysRemaining <= 30 ? (
                        <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-amber-200">Próx. Venc.</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-200">Regular</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-on-surface-variant font-bold">
                    <div>
                      <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">Validade</span>
                      <span className="font-data-mono text-on-surface text-xs">{new Date(alert.tireValidityDate!).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">Prazo</span>
                      <span className={cn(
                        "font-data-mono text-xs",
                        alert.daysRemaining < 0 ? "text-error" : alert.daysRemaining <= 30 ? "text-amber-600" : "text-on-surface"
                      )}>
                        {alert.daysRemaining < 0 ? `${Math.abs(alert.daysRemaining)} dias atrás` : `${alert.daysRemaining} dias`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalTirePages > 1 && (
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Página {currentTirePage} de {totalTirePages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentTirePage === 1}
                  onClick={() => setTirePage(prev => Math.max(prev - 1, 1))}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                    currentTirePage === 1
                      ? "bg-surface-container text-on-surface-variant/30 cursor-not-allowed border border-outline-variant/30"
                      : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-white border border-outline-variant cursor-pointer"
                  )}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={currentTirePage === totalTirePages}
                  onClick={() => setTirePage(prev => Math.min(prev + 1, totalTirePages))}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                    currentTirePage === totalTirePages
                      ? "bg-surface-container text-on-surface-variant/30 cursor-not-allowed border border-outline-variant/30"
                      : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-white border border-outline-variant cursor-pointer"
                  )}
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Alerta de Troca de Óleo (KM) Section */}
        <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="font-bold text-on-surface uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2">
              <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Alerta de Troca de Óleo (KM)
            </h3>
            <span className="text-[8px] sm:text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase">
              {oilChangeKmAlerts.length} Monitorados
            </span>
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/30 border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Viatura</th>
                  {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Unidade</th>}
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Próxima Troca</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">KM Restante</th>
                  {!isCBU && !isCiaOP && (
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[80px] text-center">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {oilChangeKmAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) ? 6 : (!isCBU && !isCiaOP ? 5 : 4)} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                      Nenhuma informação de quilometragem de óleo cadastrada.
                    </td>
                  </tr>
                ) : (
                  paginatedOilKmAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-black text-primary text-xs uppercase">{alert.prefix}</span>
                        <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{alert.type}</span>
                      </td>
                      {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && (
                        <td className="px-6 py-4 font-bold text-on-surface text-[11px] uppercase tracking-wider">
                          {alert.unit || '-'}
                        </td>
                      )}
                      <td className="px-6 py-4 text-xs font-bold text-on-surface-variant font-data-mono">
                        {alert.nextChangeKm.toLocaleString()} KM
                      </td>
                      <td className="px-6 py-4">
                        {alert.kmRemaining <= 0 ? (
                          <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-error/20">Limite Atingido</span>
                        ) : alert.kmRemaining <= 1000 ? (
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-200">Revisão Próxima</span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-200">Regular</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                         <span className={cn(
                           "text-xs font-bold font-data-mono",
                           alert.kmRemaining <= 0 ? "text-error" : alert.kmRemaining <= 1000 ? "text-amber-600" : "text-on-surface-variant"
                         )}>
                           {alert.kmRemaining <= 0 ? `Excedido em ${Math.abs(alert.kmRemaining).toLocaleString()} KM` : `${alert.kmRemaining.toLocaleString()} KM rest`}
                         </span>
                      </td>
                      {!isCBU && !isCiaOP && (
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => navigate(`/viaturas/editar/${alert.id}`)}
                            className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Editar Viatura"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Card List */}
          <div className="block md:hidden divide-y divide-outline-variant/30">
            {oilChangeKmAlerts.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-on-surface-variant italic opacity-50">
                Nenhuma informação de quilometragem de óleo cadastrada.
              </div>
            ) : (
              paginatedOilKmAlerts.map((alert) => (
                <div key={alert.id} className="p-4 space-y-3 hover:bg-surface-container-low/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-black text-primary text-xs uppercase tracking-wider">{alert.prefix}</span>
                        <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{alert.type}</span>
                        {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && (
                          <span className="block text-[9px] font-bold text-on-surface-variant opacity-80 uppercase tracking-widest mt-1">
                            {alert.unit || '-'}
                          </span>
                        )}
                      </div>
                      {!isCBU && !isCiaOP && (
                        <button 
                          onClick={() => navigate(`/viaturas/editar/${alert.id}`)}
                          className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          title="Editar Viatura"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      {alert.kmRemaining <= 0 ? (
                        <span className="bg-error/10 text-error px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-error/20">Limite</span>
                      ) : alert.kmRemaining <= 1000 ? (
                        <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-amber-200">Próximo</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-200">Regular</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-on-surface-variant font-bold">
                    <div>
                      <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">Próxima Troca</span>
                      <span className="font-data-mono text-on-surface text-xs">{alert.nextChangeKm.toLocaleString()} KM</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">KM Restante</span>
                      <span className={cn(
                        "font-data-mono text-xs",
                        alert.kmRemaining <= 0 ? "text-error" : alert.kmRemaining <= 1000 ? "text-amber-600" : "text-on-surface"
                      )}>
                        {alert.kmRemaining <= 0 ? `Excedido em ${Math.abs(alert.kmRemaining).toLocaleString()} KM` : `${alert.kmRemaining.toLocaleString()} KM`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalOilKmPages > 1 && (
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Página {currentOilKmPage} de {totalOilKmPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentOilKmPage === 1}
                  onClick={() => setOilKmPage(prev => Math.max(prev - 1, 1))}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                    currentOilKmPage === 1
                      ? "bg-surface-container text-on-surface-variant/30 cursor-not-allowed border border-outline-variant/30"
                      : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-white border border-outline-variant cursor-pointer"
                  )}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={currentOilKmPage === totalOilKmPages}
                  onClick={() => setOilKmPage(prev => Math.min(prev + 1, totalOilKmPages))}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                    currentOilKmPage === totalOilKmPages
                      ? "bg-surface-container text-on-surface-variant/30 cursor-not-allowed border border-outline-variant/30"
                      : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-white border border-outline-variant cursor-pointer"
                  )}
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Alerta de Troca de Óleo Section */}
        <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="font-bold text-on-surface uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2">
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Alerta de Troca de Óleo (Data)
            </h3>
            <span className="text-[8px] sm:text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase">
              {oilChangeAlerts.length} Monitorados
            </span>
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/30 border-b border-outline-variant">
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Viatura</th>
                  {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Unidade</th>}
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Próxima Troca</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">Dias Restantes</th>
                  {!isCBU && !isCiaOP && (
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[80px] text-center">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {oilChangeAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) ? 6 : (!isCBU && !isCiaOP ? 5 : 4)} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                      Nenhuma data de próxima troca de óleo cadastrada.
                    </td>
                  </tr>
                ) : (
                  paginatedOilDateAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-black text-primary text-xs uppercase">{alert.prefix}</span>
                        <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{alert.type}</span>
                      </td>
                      {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && (
                        <td className="px-6 py-4 font-bold text-on-surface text-[11px] uppercase tracking-wider">
                          {alert.unit || '-'}
                        </td>
                      )}
                      <td className="px-6 py-4 text-xs font-bold text-on-surface-variant font-data-mono">
                        {new Date(alert.nextOilChangeDate!).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        {alert.daysRemaining < 0 ? (
                          <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-error/20">Vencido</span>
                        ) : alert.daysRemaining <= 15 ? (
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-200">Próx. ao Vencimento</span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-200">Regular</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                         <span className={cn(
                           "text-xs font-bold font-data-mono",
                           alert.daysRemaining < 0 ? "text-error" : alert.daysRemaining <= 15 ? "text-amber-600" : "text-on-surface-variant"
                         )}>
                           {alert.daysRemaining < 0 ? `${Math.abs(alert.daysRemaining)} dias atrás` : `${alert.daysRemaining} dias`}
                         </span>
                      </td>
                      {!isCBU && !isCiaOP && (
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => navigate(`/viaturas/editar/${alert.id}`)}
                            className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Editar Viatura"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Card List */}
          <div className="block md:hidden divide-y divide-outline-variant/30">
            {oilChangeAlerts.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-on-surface-variant italic opacity-50">
                Nenhuma data de próxima troca de óleo cadastrada.
              </div>
            ) : (
              paginatedOilDateAlerts.map((alert) => (
                <div key={alert.id} className="p-4 space-y-3 hover:bg-surface-container-low/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-black text-primary text-xs uppercase tracking-wider">{alert.prefix}</span>
                        <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{alert.type}</span>
                        {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && (
                          <span className="block text-[9px] font-bold text-on-surface-variant opacity-80 uppercase tracking-widest mt-1">
                            {alert.unit || '-'}
                          </span>
                        )}
                      </div>
                      {!isCBU && !isCiaOP && (
                        <button 
                          onClick={() => navigate(`/viaturas/editar/${alert.id}`)}
                          className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          title="Editar Viatura"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      {alert.daysRemaining < 0 ? (
                        <span className="bg-error/10 text-error px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-error/20">Vencido</span>
                      ) : alert.daysRemaining <= 15 ? (
                        <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-amber-200">Próx. Venc.</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-200">Regular</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-on-surface-variant font-bold">
                    <div>
                      <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">Próxima Troca</span>
                      <span className="font-data-mono text-on-surface text-xs">{new Date(alert.nextOilChangeDate!).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">Prazo</span>
                      <span className={cn(
                        "font-data-mono text-xs",
                        alert.daysRemaining < 0 ? "text-error" : alert.daysRemaining <= 15 ? "text-amber-600" : "text-on-surface"
                      )}>
                        {alert.daysRemaining < 0 ? `${Math.abs(alert.daysRemaining)} dias atrás` : `${alert.daysRemaining} dias`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalOilDatePages > 1 && (
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Página {currentOilDatePage} de {totalOilDatePages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentOilDatePage === 1}
                  onClick={() => setOilDatePage(prev => Math.max(prev - 1, 1))}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                    currentOilDatePage === 1
                      ? "bg-surface-container text-on-surface-variant/30 cursor-not-allowed border border-outline-variant/30"
                      : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-white border border-outline-variant cursor-pointer"
                  )}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={currentOilDatePage === totalOilDatePages}
                  onClick={() => setOilDatePage(prev => Math.min(prev + 1, totalOilDatePages))}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                    currentOilDatePage === totalOilDatePages
                      ? "bg-surface-container text-on-surface-variant/30 cursor-not-allowed border border-outline-variant/30"
                      : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-white border border-outline-variant cursor-pointer"
                  )}
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

