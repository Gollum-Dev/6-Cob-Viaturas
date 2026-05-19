import React, { useMemo, useState } from 'react';
import { CheckCircle2, ShieldCheck, Wrench, MapPin, Eye, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { useMaintenance } from '../context/MaintenanceContext';
import { useReports } from '../context/ReportContext';
import { VehicleStatus } from '../types';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const { records } = useMaintenance();
  const { submissions } = useReports();

  // Estados do Modal Premium
  const [selectedModal, setSelectedModal] = useState<{
    title: string;
    vehicles: typeof vehicles;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length;
  const downVehicles = vehicles.filter(v => v.status === VehicleStatus.DOWN).length;
  const dischargeVehicles = vehicles.filter(v => v.status === VehicleStatus.DISCHARGE_PROCESS || v.status === VehicleStatus.DISCHARGE_AVAILABLE).length;

  const unitStats = useMemo(() => {
    const units: Record<string, { total: number; available: number; down: number; types: Record<string, number> }> = {};
    vehicles.forEach(v => {
      const unitName = v.unit || 'S/ UNIDADE';
      const type = v.type || 'N/A';
      if (!units[unitName]) {
        units[unitName] = { total: 0, available: 0, down: 0, types: {} };
      }
      units[unitName].total++;
      units[unitName].types[type] = (units[unitName].types[type] || 0) + 1;
      
      if (v.status === VehicleStatus.AVAILABLE) {
        units[unitName].available++;
      } else {
        units[unitName].down++;
      }
    });
    return Object.entries(units).sort((a, b) => b[1].total - a[1].total);
  }, [vehicles]);

  const typeColors: Record<string, string> = {
    'SALVAMENTO': 'bg-green-600',
    'SOCORRO': 'bg-blue-600',
    'RESGATE': 'bg-red-600',
    'APOIO': 'bg-gray-500',
    'ADMINISTRATIVO': 'bg-yellow-500',
  };

  const getVehicleTypeBreakdown = (vehicleList: typeof vehicles) => {
    const breakdown: Record<string, number> = {};
    vehicleList.forEach(v => {
      const type = v.type || 'N/A';
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    return breakdown;
  };

  const stats = [
    { 
      label: 'TOTAL DE VIATURAS', 
      value: totalVehicles.toString().padStart(2, '0'), 
      icon: ShieldCheck, 
      color: 'text-on-surface',
      types: getVehicleTypeBreakdown(vehicles),
      total: totalVehicles,
      vehiclesList: vehicles
    },
    { 
      label: 'DISPONÍVEIS', 
      value: availableVehicles.toString().padStart(2, '0'), 
      icon: CheckCircle2, 
      color: 'text-green-600', 
      subText: `${((availableVehicles / totalVehicles) * 100 || 0).toFixed(1)}% Prontas para Missão`,
      types: getVehicleTypeBreakdown(vehicles.filter(v => v.status === VehicleStatus.AVAILABLE)),
      total: availableVehicles,
      vehiclesList: vehicles.filter(v => v.status === VehicleStatus.AVAILABLE)
    },
    { 
      label: 'BAIXADAS / DESCARGA', 
      value: (downVehicles + dischargeVehicles).toString().padStart(2, '0'), 
      icon: Wrench, 
      color: 'text-primary', 
      subText: `${downVehicles} baixadas, ${dischargeVehicles} p/ descarga`,
      types: getVehicleTypeBreakdown(vehicles.filter(v => v.status !== VehicleStatus.AVAILABLE)),
      total: (downVehicles + dischargeVehicles),
      vehiclesList: vehicles.filter(v => v.status !== VehicleStatus.AVAILABLE)
    },
  ];

  // Filtro de viaturas do modal
  const filteredVehicles = useMemo(() => {
    if (!selectedModal) return [];
    return selectedModal.vehicles.filter(v => {
      const q = searchQuery.toLowerCase();
      return (
        v.prefix.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q) ||
        (v.model && v.model.toLowerCase().includes(q)) ||
        v.type.toLowerCase().includes(q) ||
        v.unit.toLowerCase().includes(q)
      );
    });
  }, [selectedModal, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Cards de Estatísticas com botões interativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface border border-outline-variant p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
              <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-widest leading-none truncate pr-2">{stat.label}</p>
              <stat.icon className={cn("w-4 h-4 sm:w-5 sm:h-5 shrink-0", stat.color)} />
            </div>
            
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <div className="flex items-baseline gap-2">
                <p className={cn("text-2xl sm:text-3xl md:text-4xl font-black leading-none", stat.color)}>{stat.value}</p>
                <button
                  onClick={() => {
                    setSelectedModal({
                      title: stat.label,
                      vehicles: stat.vehiclesList
                    });
                    setSearchQuery('');
                  }}
                  className={cn(
                    "p-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-outline-variant/30 bg-surface-container-low hover:bg-slate-900 text-on-surface-variant/70 hover:text-white hover:border-transparent hover:scale-105 active:scale-95 shadow-sm"
                  )}
                  title={`Visualizar viaturas de: ${stat.label}`}
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              {stat.subText && (
                <p className="text-[8px] sm:text-[10px] text-on-surface-variant font-bold opacity-70 uppercase tracking-tighter truncate max-w-[50%] text-right leading-tight">
                  {stat.subText}
                </p>
              )}
            </div>

            <div className="space-y-2 pt-3 sm:pt-4 border-t border-outline-variant/30">
              {Object.entries(stat.types).map(([type, count]) => {
                const barColor = typeColors[type.toUpperCase()] || 'bg-primary';
                const percentage = (count / (stat.total || 1)) * 100;
                
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                      <span className="text-on-surface-variant opacity-60 truncate pr-2">{type}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedModal({
                              title: `${stat.label} - ${type}`,
                              vehicles: stat.vehiclesList.filter(v => v.type.toUpperCase() === type.toUpperCase())
                            });
                            setSearchQuery('');
                          }}
                          className="p-0.5 rounded hover:bg-slate-900 text-on-surface-variant/50 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-outline-variant/10 bg-surface-container-low shadow-sm"
                          title={`Visualizar viaturas de ${type} em ${stat.label}`}
                        >
                          <Eye className="w-2.5 h-2.5 sm:w-3 h-3" />
                        </button>
                        <span className="text-on-surface shrink-0">{count}</span>
                      </div>
                    </div>
                    <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={cn("h-full rounded-full", barColor)} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grid de viaturas por unidade com botão de listagem */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-12 space-y-6">
          <section className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 md:p-6 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
              <h3 className="text-xs sm:text-sm md:text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                Viaturas por Unidade
              </h3>
            </div>
            <div className="p-4 sm:p-5 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {unitStats.map(([unit, data]) => (
                  <div key={unit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-5 hover:border-primary/30 transition-all group">
                    <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                      <div className="min-w-0">
                        <h4 className="font-black text-on-surface text-sm sm:text-base md:text-lg leading-tight uppercase truncate">{unit}</h4>
                        <p className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Frota Designada</p>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedModal({
                              title: `Frota - ${unit}`,
                              vehicles: vehicles.filter(v => v.unit === unit || (!v.unit && unit === 'S/ UNIDADE'))
                            });
                            setSearchQuery('');
                          }}
                          className="p-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-outline-variant/30 bg-surface-container-low hover:bg-slate-900 text-primary hover:text-white hover:border-transparent hover:scale-105 active:scale-95 shadow-sm"
                          title={`Visualizar frota da unidade: ${unit}`}
                        >
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-outline-variant rounded-lg flex items-center justify-center font-black text-primary text-sm sm:text-lg shadow-sm">
                          {data.total.toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {Object.entries(data.types).map(([type, count]) => {
                        const typeColors: Record<string, string> = {
                          'SALVAMENTO': 'bg-green-600',
                          'SOCORRO': 'bg-blue-600',
                          'RESGATE': 'bg-red-600',
                          'APOIO': 'bg-gray-500',
                          'ADMINISTRATIVO': 'bg-yellow-500',
                        };
                        const barColor = typeColors[type.toUpperCase()] || 'bg-primary';

                        return (
                          <div key={type} className="space-y-1">
                            <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                              <span className="text-on-surface-variant opacity-75 truncate pr-2">{type}</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    const unitVehicles = vehicles.filter(v => v.unit === unit || (!v.unit && unit === 'S/ UNIDADE'));
                                    setSelectedModal({
                                      title: `${unit} - ${type}`,
                                      vehicles: unitVehicles.filter(v => v.type.toUpperCase() === type.toUpperCase())
                                    });
                                    setSearchQuery('');
                                  }}
                                  className="p-0.5 rounded hover:bg-slate-900 text-on-surface-variant/50 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-outline-variant/10 bg-surface-container-low shadow-sm"
                                  title={`Visualizar viaturas de ${type} em ${unit}`}
                                >
                                  <Eye className="w-2.5 h-2.5 sm:w-3 h-3" />
                                </button>
                                <span className="text-on-surface shrink-0">{count}</span>
                              </div>
                            </div>
                            <div className="h-1 sm:h-1.5 bg-surface-container rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${((count as number) / data.total) * 100}%` }}
                                className={cn("h-full rounded-full", barColor)} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal Interativo e Premium */}
      <AnimatePresence>
        {selectedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
              onClick={() => {
                setSelectedModal(null);
                setSearchQuery('');
              }}
            />

            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-outline-variant w-full max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Header */}
              <div className="p-5 md:p-6 border-b border-outline-variant bg-[#1e252b] text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    {selectedModal.title}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {selectedModal.vehicles.length} {selectedModal.vehicles.length === 1 ? 'Viatura Encontrada' : 'Viaturas Encontradas'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedModal(null);
                    setSearchQuery('');
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 bg-slate-50 border-b border-outline-variant flex gap-2 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                  <input
                    type="text"
                    placeholder="Pesquisar por prefixo, placa, modelo, tipo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 space-y-3">
                {filteredVehicles.length === 0 ? (
                  <div className="text-center py-12 text-on-surface-variant opacity-60">
                    <p className="text-xs sm:text-sm font-black uppercase tracking-wider">Nenhuma viatura correspondente</p>
                    <p className="text-[10px] sm:text-xs mt-1">Tente ajustar os termos da pesquisa.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {filteredVehicles.map((vehicle) => {
                      const statusConfig = {
                        [VehicleStatus.AVAILABLE]: { bg: 'bg-green-50 text-green-700 border-green-200/50', label: 'Disponível', dot: 'bg-green-600' },
                        [VehicleStatus.DOWN]: { bg: 'bg-red-50 text-red-700 border-red-200/50', label: 'Baixada', dot: 'bg-red-600' },
                        [VehicleStatus.DISCHARGE_PROCESS]: { bg: 'bg-amber-50 text-amber-700 border-amber-200/50', label: 'Proc. Descarga', dot: 'bg-amber-600' },
                        [VehicleStatus.DISCHARGE_AVAILABLE]: { bg: 'bg-slate-100 text-slate-700 border-slate-300/50', label: 'Disponível p/ Descarga', dot: 'bg-slate-500' },
                      }[vehicle.status] || { bg: 'bg-gray-50 text-gray-700 border-gray-200', label: vehicle.status, dot: 'bg-gray-500' };

                      const barColor = typeColors[vehicle.type.toUpperCase()] || 'bg-primary';

                      return (
                        <div 
                          key={vehicle.id}
                          className="bg-white border border-outline-variant rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-primary/20 hover:shadow transition-all group"
                        >
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-on-surface text-sm sm:text-base tracking-tight">{vehicle.prefix}</span>
                                <span className="text-[9px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/30 uppercase tracking-widest shrink-0">{vehicle.plate}</span>
                              </div>
                              <p className="text-[10px] sm:text-xs text-on-surface-variant font-bold mt-1 uppercase tracking-wide truncate max-w-[160px]">
                                {vehicle.model || 'Modelo não especificado'}
                              </p>
                            </div>
                            <span className={cn(
                              "text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 shrink-0",
                              statusConfig.bg
                            )}>
                              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusConfig.dot, vehicle.status === VehicleStatus.AVAILABLE && "animate-pulse")} />
                              {statusConfig.label}
                            </span>
                          </div>

                          <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className={cn("w-2 h-2 rounded-full shrink-0", barColor)} />
                              <span className="text-[8px] sm:text-[9px] font-black text-on-surface-variant uppercase tracking-widest truncate">{vehicle.type}</span>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-black text-on-surface uppercase tracking-tight shrink-0">
                              {vehicle.odometer.toLocaleString('pt-BR')} KM
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-outline-variant bg-white flex justify-end">
                <button 
                  onClick={() => {
                    setSelectedModal(null);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#1e252b] hover:bg-slate-800 rounded-xl text-white font-black text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
