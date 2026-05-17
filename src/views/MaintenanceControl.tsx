import React, { useState, useMemo } from 'react';
import { Wrench, Clock, CheckCircle2, AlertCircle, AlertTriangle, TrendingUp, DollarSign, Calendar, MapPin, ChevronRight, Filter, Plus, Car, History, Settings, Thermometer, Droplets, Disc, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVehicles } from '../context/VehicleContext';
import { useMaintenance } from '../context/MaintenanceContext';
import { useReports } from '../context/ReportContext';
import { MaintenanceType, MaintenanceStatus, MaintenanceRecord } from '../types';
import { cn } from '../lib/utils';

const OIL_CHANGE_THRESHOLD = 10000;
const TIRE_ROTATION_THRESHOLD = 10000;
const TIRE_REPLACEMENT_THRESHOLD = 40000;

const getKeyword = (description: string): string => {
  const desc = description.toUpperCase();
  if (desc.includes("LUZES INTERIORES")) return "Luzes";
  if (desc.includes("BUZINA")) return "Buzina";
  if (desc.includes("SIRENE") || desc.includes("FÁDÓ") || desc.includes("FADO")) return "Sirene/Fádó";
  if (desc.includes("PAINEL")) return "Painel";
  if (desc.includes("PALHETA")) return "Palhetas";
  if (desc.includes("PARA-BRISA") || desc.includes("PARABRISA")) return "Para-brisa";
  if (desc.includes("SISTEMA DE LIMPADOR")) return "Limpadores";
  if (desc.includes("PNEUS")) return "Pneus";
  if (desc.includes("ARREFECIMENTO") || desc.includes("RADIADOR")) return "Arrefecimento";
  if (desc.includes("ÓLEO DO MOTOR") || desc.includes("OLEO DO MOTOR")) return "Óleo do Motor";
  if (desc.includes("COMBUSTÍVEL") || desc.includes("COMBUSTIVEL")) return "Combustível";
  return description.length > 20 ? description.substring(0, 17) + "..." : description;
};

export default function MaintenanceControl() {
  const { vehicles } = useVehicles();
  const { records, addRecord, updateRecord } = useMaintenance();
  const { submissions } = useReports();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState<MaintenanceType>(MaintenanceType.PREVENTIVE_GENERAL);
  const [workshop, setWorkshop] = useState('');
  const [cost, setCost] = useState('');
  const [odometer, setOdometer] = useState('');
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus>(MaintenanceStatus.IN_PROGRESS);

  // Get current odometer for each vehicle from submissions or base data
  const vehicleStats = useMemo(() => {
    return vehicles.map(v => {
      const vehicleSubmissions = submissions.filter(s => s.vehicleId === v.id);
      const currentOdo = vehicleSubmissions.length > 0 
        ? Math.max(...vehicleSubmissions.map(s => s.odometer), v.odometer)
        : v.odometer;

      const vehicleRecords = records.filter(r => r.vehicleId === v.id && r.status === MaintenanceStatus.COMPLETED);
      
      const lastOilChangeRecord = vehicleRecords.find(r => r.type === MaintenanceType.OIL_CHANGE);
      const baseOilOdo = lastOilChangeRecord ? lastOilChangeRecord.odometerAtMaintenance : (v.lastOilChangeOdometer || 0);
      const kmSinceOilChange = currentOdo - baseOilOdo;
      
      const lastTireWork = vehicleRecords.find(r => r.type === MaintenanceType.TIRE_ROTATION || r.type === MaintenanceType.TIRE_REPLACEMENT);
      const kmSinceTireWork = lastTireWork ? currentOdo - lastTireWork.odometerAtMaintenance : currentOdo;

      return {
        ...v,
        currentOdo,
        kmSinceOilChange,
        kmSinceTireWork,
        oilStatus: kmSinceOilChange > OIL_CHANGE_THRESHOLD ? 'EXCEDIDO' : 'OK',
        tireStatus: kmSinceTireWork > TIRE_ROTATION_THRESHOLD ? 'NECESSÁRIO' : 'OK'
      };
    });
  }, [vehicles, submissions, records]);

  const checklistIssues = useMemo(() => {
    const issues: { submissionId: string; vehiclePrefix: string; vehicleType: string; userName: string; item: string; observation: string; date: string }[] = [];
    
    submissions.forEach(sub => {
      sub.items.forEach(item => {
        if (!item.status) {
          issues.push({
            submissionId: sub.id,
            vehiclePrefix: sub.vehiclePrefix,
            vehicleType: sub.vehicleType,
            userName: `${sub.userRank} ${sub.userName}`,
            item: item.description,
            observation: item.observation || 'Sem observação detalhada',
            date: sub.timestamp.split(' ')[0]
          });
        }
      });
    });
    
    return issues.reverse(); // Newest first
  }, [submissions]);

  const totalMonthlyCost = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return records
      .filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, r) => acc + r.cost, 0);
  }, [records]);

  const tireValidityAlerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return vehicles
      .filter(v => v.tireValidityDate)
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
      .filter(v => v.nextOilChangeDate)
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
      .filter(v => v.lastOilChangeOdometer !== undefined)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId) return;

    addRecord({
      vehicleId: selectedVehicleId,
      type: maintenanceType,
      workshop,
      date: new Date().toISOString().split('T')[0],
      odometerAtMaintenance: Number(odometer),
      status: maintenanceStatus,
      cost: Number(cost),
      progress: maintenanceStatus === MaintenanceStatus.IN_PROGRESS ? 0 : 100,
    });

    setShowAddForm(false);
    setSelectedVehicleId('');
    setWorkshop('');
    setCost('');
    setOdometer('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-xl mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-on-surface uppercase tracking-tight">Nova Ordem de Serviço</h2>
              <button onClick={() => setShowAddForm(false)} className="text-on-surface-variant hover:text-primary font-bold text-sm uppercase">Cancelar</button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Viatura</label>
                <select 
                  required
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface"
                >
                  <option value="">Selecione...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.prefix} - {v.type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tipo de Serviço</label>
                <select 
                  required
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value as MaintenanceType)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface"
                >
                  {Object.values(MaintenanceType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Oficina / Fornecedor</label>
                <input 
                  required
                  type="text"
                  value={workshop}
                  onChange={(e) => setWorkshop(e.target.value)}
                  placeholder="Nome da oficina"
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Odômetro Atual</label>
                <input 
                  required
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  placeholder="KM"
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Custo Estimado (R$)</label>
                <input 
                  required
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status Inicial</label>
                <select 
                  value={maintenanceStatus}
                  onChange={(e) => setMaintenanceStatus(e.target.value as MaintenanceStatus)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface"
                >
                  {Object.values(MaintenanceStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg">
                  Salvar Ordem de Serviço
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
          <Wrench className="w-6 h-6 text-primary" />
          Controle de Manutenção
        </h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg text-xs uppercase tracking-widest group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Lançar Manutenção
        </button>
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          {/* Alerta de Validade de Pneus Section */}
          <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm flex items-center gap-2">
                <Disc className="w-5 h-5 text-primary" />
                Alerta de Validade de Pneus
              </h3>
              <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full uppercase">
                {tireValidityAlerts.length} Monitorados
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-outline-variant">
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Viatura</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Validade</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">Dias Restantes</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {tireValidityAlerts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                        Nenhuma data de validade de pneus cadastrada.
                      </td>
                    </tr>
                  ) : (
                    tireValidityAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-black text-primary text-xs uppercase">{alert.prefix}</span>
                          <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{alert.type}</span>
                        </td>
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
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => {
                              setSelectedVehicleId(alert.id);
                              setMaintenanceType(MaintenanceType.TIRE_REPLACEMENT);
                              setWorkshop('Borracharia Credenciada');
                              setShowAddForm(true);
                            }}
                            className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline whitespace-nowrap"
                          >
                            Agendar Troca
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Alerta de Troca de Óleo (KM) Section */}
          <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary" />
                Alerta de Troca de Óleo (KM)
              </h3>
              <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full uppercase">
                {oilChangeKmAlerts.length} Monitorados
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-outline-variant">
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Viatura</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Próxima Troca</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">KM Restante</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {oilChangeKmAlerts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                        Nenhuma informação de quilometragem de óleo cadastrada.
                      </td>
                    </tr>
                  ) : (
                    oilChangeKmAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-black text-primary text-xs uppercase">{alert.prefix}</span>
                          <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{alert.type}</span>
                        </td>
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
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => {
                              setSelectedVehicleId(alert.id);
                              setMaintenanceType(MaintenanceType.OIL_CHANGE);
                              setWorkshop('Oficina Sede');
                              setShowAddForm(true);
                            }}
                            className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline whitespace-nowrap"
                          >
                            Agendar Troca
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Alerta de Troca de Óleo Section */}
          <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                Alerta de Troca de Óleo
              </h3>
              <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full uppercase">
                {oilChangeAlerts.length} Monitorados
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-outline-variant">
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Viatura</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Próxima Troca</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">Dias Restantes</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {oilChangeAlerts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                        Nenhuma data de próxima troca de óleo cadastrada.
                      </td>
                    </tr>
                  ) : (
                    oilChangeAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-black text-primary text-xs uppercase">{alert.prefix}</span>
                          <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{alert.type}</span>
                        </td>
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
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => {
                              setSelectedVehicleId(alert.id);
                              setMaintenanceType(MaintenanceType.OIL_CHANGE);
                              setWorkshop('Oficina Sede');
                              setShowAddForm(true);
                            }}
                            className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline whitespace-nowrap"
                          >
                            Agendar Troca
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Checklist Issues Planilha */}
          <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-error" />
                Checklist Diário com Ressalvas
              </h3>
              <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full uppercase">{checklistIssues.length} Ressalvas Ativas</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-outline-variant">
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Data</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Viatura</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">Militar</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">Item / Defeito</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[200px]">Observação</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {checklistIssues.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                        Nenhuma ressalva pendente nos checklists.
                      </td>
                    </tr>
                  ) : (
                    checklistIssues.map((issue, idx) => (
                      <tr key={`${issue.submissionId}-${idx}`} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-bold text-on-surface-variant font-data-mono">{issue.date}</td>
                        <td className="px-6 py-4">
                          <span className="font-black text-primary text-xs uppercase">{issue.vehiclePrefix}</span>
                          <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{issue.vehicleType}</span>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase">{issue.userName}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-error uppercase tracking-tight">{getKeyword(issue.item)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-on-surface-variant font-medium leading-relaxed max-w-xs">{issue.observation}</p>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => {
                              setSelectedVehicleId(vehicles.find(v => v.prefix === issue.vehiclePrefix)?.id || '');
                              setMaintenanceType(MaintenanceType.CORRECTIVE);
                              setWorkshop('Oficina Sede');
                              setShowAddForm(true);
                            }}
                            className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline whitespace-nowrap"
                          >
                            Abrir O.S.
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="xl:col-span-4 space-y-6">
           <section className="bg-white border border-outline-variant rounded-xl p-8 shadow-sm">
                <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Últimos Eventos
                </h3>
                <div className="space-y-6">
                    {records.filter(r => r.status === MaintenanceStatus.COMPLETED).slice(0, 5).map((item) => {
                        const vehicle = vehicles.find(v => v.id === item.vehicleId);
                        return (
                          <div key={item.id} className="flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border bg-surface-container border-outline-variant text-on-surface-variant">
                                      {vehicle?.prefix}
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-on-surface">{item.type}</p>
                                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-black text-green-700">R$ {item.cost.toLocaleString('pt-BR')}</p>
                              </div>
                          </div>
                        );
                    })}
                    {records.filter(r => r.status === MaintenanceStatus.COMPLETED).length === 0 && (
                      <p className="text-xs text-on-surface-variant italic text-center py-4">Nenhum histórico disponível.</p>
                    )}
                </div>
           </section>

           <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 shadow-sm relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <h4 className="text-[11px] font-black text-secondary uppercase tracking-[0.2em]">Diretriz de Frota</h4>
                    <p className="text-xs text-on-surface font-medium leading-relaxed italic">
                      "A manutenção preventiva é investiminento, não custo. Uma viatura bem cuidada salva vidas e preserva o patrimônio público."
                    </p>
                </div>
                <div className="absolute -bottom-8 -right-8 opacity-5">
                    <Wrench className="w-32 h-32 text-secondary" />
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
