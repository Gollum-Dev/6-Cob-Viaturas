import React, { useMemo } from 'react';
import { CheckCircle2, ShieldCheck, Wrench, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { useMaintenance } from '../context/MaintenanceContext';
import { useReports } from '../context/ReportContext';
import { VehicleStatus, MaintenanceStatus, MaintenanceType } from '../types';
import { cn } from '../lib/utils';

const OIL_CHANGE_THRESHOLD = 10000;

export default function Dashboard() {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const { records } = useMaintenance();
  const { submissions } = useReports();

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
      total: totalVehicles
    },
    { 
      label: 'DISPONÍVEIS', 
      value: availableVehicles.toString().padStart(2, '0'), 
      icon: CheckCircle2, 
      color: 'text-green-600', 
      subText: `${((availableVehicles / totalVehicles) * 100 || 0).toFixed(1)}% Prontas para Missão`,
      types: getVehicleTypeBreakdown(vehicles.filter(v => v.status === VehicleStatus.AVAILABLE)),
      total: availableVehicles
    },
    { 
      label: 'BAIXADAS / DESCARGA', 
      value: (downVehicles + dischargeVehicles).toString().padStart(2, '0'), 
      icon: Wrench, 
      color: 'text-primary', 
      subText: `${downVehicles} baixadas, ${dischargeVehicles} p/ descarga`,
      types: getVehicleTypeBreakdown(vehicles.filter(v => v.status !== VehicleStatus.AVAILABLE)),
      total: (downVehicles + dischargeVehicles)
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Painel de Controle
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">Bem-vindo ao sistema de comando e controle da frota.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface border border-outline-variant p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-widest leading-none truncate pr-2">{stat.label}</p>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <p className={cn("text-3xl md:text-4xl font-black", stat.color)}>{stat.value}</p>
              {stat.subText && <p className="text-[10px] text-on-surface-variant font-bold opacity-70 uppercase tracking-tighter truncate">{stat.subText}</p>}
            </div>

            <div className="space-y-3 pt-4 border-t border-outline-variant/30">
              {Object.entries(stat.types).map(([type, count]) => {
                const barColor = typeColors[type.toUpperCase()] || 'bg-primary';
                const percentage = (count / (stat.total || 1)) * 100;
                
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                      <span className="text-on-surface-variant opacity-60">{type}</span>
                      <span className="text-on-surface">{count}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-6">
          <section className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 md:p-6 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
              <h3 className="text-sm md:text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Viaturas por Unidade
              </h3>
            </div>
            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {unitStats.map(([unit, data]) => (
                  <div key={unit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:border-primary/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-on-surface text-lg leading-tight uppercase">{unit}</h4>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Frota Designada</p>
                      </div>
                      <div className="w-10 h-10 bg-white border border-outline-variant rounded-lg flex items-center justify-center font-black text-primary text-lg shadow-sm">
                        {data.total.toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
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
                          <div key={type} className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                              <span className="text-on-surface-variant opacity-70">{type}</span>
                              <span className="text-on-surface">{count}</span>
                            </div>
                            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
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
    </div>
  );
}
