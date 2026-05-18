import React, { useState, useMemo } from 'react';
import { Wrench, AlertTriangle, Plus, Trash2, Filter, DollarSign, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVehicles } from '../context/VehicleContext';
import { useMaintenance } from '../context/MaintenanceContext';
import { useReports } from '../context/ReportContext';
import { MaintenanceType, MaintenanceStatus } from '../types';
import { cn } from '../lib/utils';

/**
 * Retorna uma palavra-chave simplificada para os itens de inspeção do checklist diário.
 * Evita poluição visual na tabela de manutenção com textos excessivamente longos.
 */
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
  const { records, addRecord, updateRecord, deleteRecord } = useMaintenance();
  const { submissions } = useReports();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState<MaintenanceType>(MaintenanceType.PREVENTIVE_GENERAL);
  const [workshop, setWorkshop] = useState('');
  const [cost, setCost] = useState('');
  const [odometer, setOdometer] = useState('');
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus>(MaintenanceStatus.IN_PROGRESS);

  const [filterVehicle, setFilterVehicle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchVehicle = !filterVehicle || r.vehicleId === filterVehicle;
      const matchStatus = !filterStatus || r.status === filterStatus;
      return matchVehicle && matchStatus;
    });
  }, [records, filterVehicle, filterStatus]);

  const totalFilteredCost = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + r.cost, 0);
  }, [filteredRecords]);

  const activeOrdersCount = useMemo(() => {
    return records.filter(r => r.status === MaintenanceStatus.IN_PROGRESS).length;
  }, [records]);

  const completedOrdersCount = useMemo(() => {
    return records.filter(r => r.status === MaintenanceStatus.COMPLETED).length;
  }, [records]);

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

      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-white px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg text-[10px] sm:text-xs uppercase tracking-widest group w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
          Lançar Manutenção
        </button>
      </div>


      <div className="space-y-8">
          {/* Checklist Issues Planilha */}
          <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-error" />
                Checklist Diário com Ressalvas
              </h3>
              <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full uppercase">{checklistIssues.length} Ressalvas Ativas</span>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
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

            {/* Mobile View: Card List */}
            <div className="block md:hidden divide-y divide-outline-variant/30">
              {checklistIssues.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-on-surface-variant italic opacity-50">
                  Nenhuma ressalva pendente nos checklists.
                </div>
              ) : (
                checklistIssues.map((issue, idx) => (
                  <div key={`${issue.submissionId}-${idx}`} className="p-4 space-y-3 hover:bg-surface-container-low/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-black text-primary text-xs uppercase tracking-wider">{issue.vehiclePrefix}</span>
                        <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{issue.vehicleType}</span>
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant font-data-mono">{issue.date}</span>
                    </div>

                    <div className="text-xs space-y-2">
                      <p className="font-semibold text-on-surface-variant"><span className="opacity-50 uppercase tracking-widest text-[8px] block mb-0.5 font-bold">Responsável</span>{issue.userName}</p>
                      <p className="font-bold text-error uppercase tracking-tight"><span className="opacity-50 text-[8px] block mb-0.5 font-bold text-on-surface-variant">Item / Defeito</span>{getKeyword(issue.item)}</p>
                      {issue.observation && (
                        <p className="text-on-surface-variant font-medium leading-relaxed bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">{issue.observation}</p>
                      )}
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => {
                          setSelectedVehicleId(vehicles.find(v => v.prefix === issue.vehiclePrefix)?.id || '');
                          setMaintenanceType(MaintenanceType.CORRECTIVE);
                          setWorkshop('Oficina Sede');
                          setShowAddForm(true);
                        }}
                        className="w-full bg-primary/5 hover:bg-primary text-primary hover:text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-center border border-primary/10"
                      >
                        Abrir O.S.
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Resumo Financeiro e Contadores de O.S. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center border border-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Investimento Total</p>
                <p className="text-xl font-black text-on-surface mt-1">
                  R$ {totalFilteredCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {filterVehicle || filterStatus ? (
                  <p className="text-[9px] font-bold text-primary uppercase mt-0.5">Filtrado</p>
                ) : (
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase mt-0.5">Geral da Frota</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
                <Wrench className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-black">O.S. Em Andamento</p>
                <p className="text-xl font-black text-on-surface mt-1">{activeOrdersCount}</p>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase mt-0.5">Ativas no momento</p>
              </div>
            </div>

            <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center border border-green-100">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-black">O.S. Concluídas</p>
                <p className="text-xl font-black text-on-surface mt-1">{completedOrdersCount}</p>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase mt-0.5">Total concluído</p>
              </div>
            </div>
          </div>

          {/* Planilha de Ordens de Serviço (Salvo em Banco) */}
          <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Planilha de Lançamentos de Manutenção
              </h3>
              
              {/* Barra de Filtros */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-white border border-outline-variant px-3 py-1.5 rounded-lg w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-on-surface-variant" />
                  <select 
                    value={filterVehicle}
                    onChange={(e) => setFilterVehicle(e.target.value)}
                    className="text-xs font-bold text-on-surface focus:outline-none bg-transparent w-full sm:w-auto"
                  >
                    <option value="">Todas as Viaturas</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.prefix}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-white border border-outline-variant px-3 py-1.5 rounded-lg w-full sm:w-auto">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-xs font-bold text-on-surface focus:outline-none bg-transparent w-full sm:w-auto"
                  >
                    <option value="">Todos os Status</option>
                    {Object.values(MaintenanceStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-outline-variant">
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Data</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Viatura</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">Serviço / O.S.</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">Oficina</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">KM</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[110px]">Custo</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[150px]">Status (Banco)</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[130px]">Progresso</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                        Nenhum registro de manutenção encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => {
                      const vehicle = vehicles.find(v => v.id === record.vehicleId);
                      return (
                        <tr key={record.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-on-surface-variant font-data-mono">
                            {record.date ? new Date(record.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'S/D'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-black text-primary text-xs uppercase">{vehicle?.prefix || 'VIATURA'}</span>
                            <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{vehicle?.type || 'Tipo'}</span>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-on-surface uppercase">
                            {record.type}
                          </td>
                          <td className="px-6 py-4 text-xs text-on-surface font-medium">
                            {record.workshop}
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-on-surface-variant font-data-mono">
                            {record.odometerAtMaintenance?.toLocaleString() || '0'} KM
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-green-700 font-data-mono">
                            R$ {record.cost?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={record.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value as MaintenanceStatus;
                                const newProgress = newStatus === MaintenanceStatus.COMPLETED ? 100 : newStatus === MaintenanceStatus.SCHEDULED ? 0 : 50;
                                  await updateRecord(record.id, { status: newStatus, progress: newProgress });
                              }}
                              className={cn(
                                "text-[10px] font-black uppercase tracking-wider p-2 rounded-lg border focus:outline-none w-full",
                                record.status === MaintenanceStatus.COMPLETED && "bg-green-50 text-green-700 border-green-200",
                                record.status === MaintenanceStatus.IN_PROGRESS && "bg-amber-50 text-amber-700 border-amber-200",
                                record.status === MaintenanceStatus.SCHEDULED && "bg-blue-50 text-blue-700 border-blue-200"
                              )}
                            >
                              {Object.values(MaintenanceStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    record.status === MaintenanceStatus.COMPLETED ? "bg-green-600" : record.status === MaintenanceStatus.SCHEDULED ? "bg-blue-600" : "bg-primary"
                                  )}
                                  style={{ width: `${record.progress ?? 0}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-on-surface-variant font-data-mono w-8">
                                {record.progress ?? 0}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={async () => {
                                if (window.confirm("Deseja realmente excluir este registro de manutenção permanente?")) {
                                  await deleteRecord(record.id);
                                }
                              }}
                              className="text-on-surface-variant hover:text-error transition-colors p-1"
                              title="Excluir O.S."
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Card List */}
            <div className="block md:hidden divide-y divide-outline-variant/30">
              {filteredRecords.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-on-surface-variant italic opacity-50">
                  Nenhum registro de manutenção encontrado para os filtros selecionados.
                </div>
              ) : (
                filteredRecords.map((record) => {
                  const vehicle = vehicles.find(v => v.id === record.vehicleId);
                  return (
                    <div key={record.id} className="p-4 space-y-4 hover:bg-surface-container-low/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-black text-primary text-xs uppercase tracking-wider">{vehicle?.prefix || 'VIATURA'}</span>
                          <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{vehicle?.type || 'Tipo'}</span>
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant font-data-mono">
                          {record.date ? new Date(record.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'S/D'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                        <div>
                          <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">Serviço / O.S.</span>
                          <span className="text-on-surface uppercase text-xs">{record.type}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">Oficina</span>
                          <span className="text-on-surface-variant font-semibold">{record.workshop}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                        <div>
                          <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">Quilometragem</span>
                          <span className="text-on-surface-variant font-data-mono">{record.odometerAtMaintenance?.toLocaleString() || '0'} KM</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5">Custo</span>
                          <span className="text-green-700 font-data-mono">R$ {record.cost?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-1">Status</span>
                          <select 
                            value={record.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as MaintenanceStatus;
                              const newProgress = newStatus === MaintenanceStatus.COMPLETED ? 100 : newStatus === MaintenanceStatus.SCHEDULED ? 0 : 50;
                              await updateRecord(record.id, { status: newStatus, progress: newProgress });
                            }}
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider p-2.5 rounded-lg border focus:outline-none w-full",
                              record.status === MaintenanceStatus.COMPLETED && "bg-green-50 text-green-700 border-green-200",
                              record.status === MaintenanceStatus.IN_PROGRESS && "bg-amber-50 text-amber-700 border-amber-200",
                              record.status === MaintenanceStatus.SCHEDULED && "bg-blue-50 text-blue-700 border-blue-200"
                            )}
                          >
                            {Object.values(MaintenanceStatus).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div className="w-1/3">
                          <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-1">Progresso</span>
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  record.status === MaintenanceStatus.COMPLETED ? "bg-green-600" : record.status === MaintenanceStatus.SCHEDULED ? "bg-blue-600" : "bg-primary"
                                )}
                                style={{ width: `${record.progress ?? 0}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-on-surface-variant font-data-mono">
                              {record.progress ?? 0}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/30 flex justify-end">
                        <button 
                          onClick={async () => {
                            if (window.confirm("Deseja realmente excluir este registro de manutenção permanente?")) {
                              await deleteRecord(record.id);
                            }
                          }}
                          className="flex items-center gap-1.5 text-[9px] font-black text-error uppercase tracking-widest hover:underline px-3 py-1 bg-error/5 hover:bg-error/10 border border-error/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Excluir Registro
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
      </div>
    </div>
  );
}
