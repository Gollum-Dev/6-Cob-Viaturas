import React, { useState, useMemo } from 'react';
import { Wrench, Plus, Trash2, Filter, DollarSign, CheckCircle2, FileSpreadsheet, Pencil, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVehicles } from '../context/VehicleContext';
import { useMaintenance } from '../context/MaintenanceContext';
import { useAuth } from '../context/AuthContext';
import { MaintenanceType, MaintenanceStatus, Commitment, CommitmentStatus, CommitmentCategory, MaintenanceRecord } from '../types';
import { cn } from '../lib/utils';
const getProgressFromStatus = (status: MaintenanceStatus): number => {
  switch (status) {
    case MaintenanceStatus.MANUTENCAO: return 20;
    case MaintenanceStatus.ORCAMENTO: return 40;
    case MaintenanceStatus.NOTA_FISCAL: return 60;
    case MaintenanceStatus.SEI: return 80;
    case MaintenanceStatus.CONCLUIDO: return 100;
    default: return 0;
  }
};

export default function MaintenanceControl() {
  const { vehicles } = useVehicles();
  const { 
    records, 
    commitments, 
    addRecord, 
    updateRecord, 
    deleteRecord,
    addCommitment,
    updateCommitment,
    deleteCommitment
  } = useMaintenance();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'manutencoes' | 'empenhos'>('manutencoes');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State da Manutenção
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState<MaintenanceType>(MaintenanceType.PREVENTIVE_GENERAL);
  const [workshop, setWorkshop] = useState('');
  const [cost, setCost] = useState('');
  const [odometer, setOdometer] = useState('');
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus>(MaintenanceStatus.MANUTENCAO);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [servicesPerformed, setServicesPerformed] = useState('');
  const [budgetDocument, setBudgetDocument] = useState('');
  const [commitmentDocument, setCommitmentDocument] = useState('');
  const [invoiceDocument, setInvoiceDocument] = useState('');
  const [seiDocument, setSeiDocument] = useState('');
  const [invoiceValue, setInvoiceValue] = useState('');
  const [selectedCommitmentId, setSelectedCommitmentId] = useState('');

  // Filtros de O.S.
  const [filterVehicle, setFilterVehicle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCommitment, setFilterCommitment] = useState('');
  const [filterSearchQuery, setFilterSearchQuery] = useState('');
  // State e Filtros de Empenho
  const [filterCommitmentQuery, setFilterCommitmentQuery] = useState('');
  const [filterCommitmentStatus, setFilterCommitmentStatus] = useState('');
  const [filterCommitmentCategory, setFilterCommitmentCategory] = useState('');
  const [filterCommitmentSupplier, setFilterCommitmentSupplier] = useState('');
  const [showCommitmentModal, setShowCommitmentModal] = useState<boolean>(false);
  const [editingCommitmentId, setEditingCommitmentId] = useState<string | null>(null);

  // Campos do Formulário de Empenho
  const [compUnit, setCompUnit] = useState('');
  const [compSei, setCompSei] = useState('');
  const [compStatus, setCompStatus] = useState<CommitmentStatus>(CommitmentStatus.VIGENTE);
  const [compCategory, setCompCategory] = useState<CommitmentCategory>(CommitmentCategory.LEVE);
  const [compCity, setCompCity] = useState('');
  const [compSupplier, setCompSupplier] = useState('');
  const [compNumber, setCompNumber] = useState('');
  const [compYear, setCompYear] = useState(new Date().getFullYear().toString());
  const [compInitialValue, setCompInitialValue] = useState('');
  const [compReinforcementValue, setCompReinforcementValue] = useState('0');
  const [compCancellationValue, setCompCancellationValue] = useState('0');
  const [compBudgetedToPay, setCompBudgetedToPay] = useState('0');
  const [compLiquidatedValue, setCompLiquidatedValue] = useState('0');

  // Helpers de Manutenção
  const handleEditClick = (record: MaintenanceRecord) => {
    setEditingRecordId(record.id);
    setSelectedVehicleId(record.vehicleId);
    setMaintenanceType(record.type);
    setWorkshop(record.workshop || '');
    setCost(record.cost ? record.cost.toString() : '');
    setOdometer(record.odometerAtMaintenance ? record.odometerAtMaintenance.toString() : '');
    setMaintenanceStatus(record.status);
    setStartDate(record.date || new Date().toISOString().split('T')[0]);
    setServicesPerformed(record.servicesPerformed || '');
    setBudgetDocument(record.budgetDocument || '');
    setCommitmentDocument(record.commitmentDocument || '');
    setInvoiceDocument(record.invoiceDocument || '');
    setSeiDocument(record.seiDocument || '');
    setInvoiceValue(record.invoiceValue ? record.invoiceValue.toString() : '');
    setSelectedCommitmentId(record.commitmentId || '');
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingRecordId(null);
    setSelectedVehicleId('');
    setWorkshop('');
    setCost('');
    setOdometer('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setServicesPerformed('');
    setBudgetDocument('');
    setCommitmentDocument('');
    setInvoiceDocument('');
    setSeiDocument('');
    setInvoiceValue('');
    setSelectedCommitmentId('');
  };

  // Cálculos dinâmicos em tela do Empenho
  const compBalance = useMemo(() => {
    const initial = Number(compInitialValue || 0);
    const reinforcement = Number(compReinforcementValue || 0);
    const cancellation = Number(compCancellationValue || 0);
    const liquidated = Number(compLiquidatedValue || 0);
    return initial + reinforcement - cancellation - liquidated;
  }, [compInitialValue, compReinforcementValue, compCancellationValue, compLiquidatedValue]);

  const filteredRecords = useMemo(() => {
    return records
      .filter(r => {
        const matchVehicle = !filterVehicle || r.vehicleId === filterVehicle;
        const matchStatus = !filterStatus || r.status === filterStatus;
        const matchCommitment = !filterCommitment || r.commitmentId === filterCommitment;
        
        const query = filterSearchQuery.toLowerCase();
        const matchSearch = !query || 
          (r.type?.toLowerCase().includes(query)) ||
          (r.workshop?.toLowerCase().includes(query)) ||
          (r.servicesPerformed?.toLowerCase().includes(query)) ||
          (r.budgetDocument?.toLowerCase().includes(query)) ||
          (r.commitmentDocument?.toLowerCase().includes(query)) ||
          (r.invoiceDocument?.toLowerCase().includes(query)) ||
          (r.seiDocument?.toLowerCase().includes(query));

        return matchVehicle && matchStatus && matchCommitment && matchSearch;
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
  }, [records, filterVehicle, filterStatus, filterCommitment, filterSearchQuery]);

  const commitmentSuppliers = useMemo(() => {
    const seen = new Set<string>();
    return commitments
      .map(c => c.supplier)
      .filter(s => s && s.trim() !== '' && !seen.has(s) && seen.add(s));
  }, [commitments]);

  const filteredCommitments = useMemo(() => {
    return commitments
      .filter(c => {
        const query = filterCommitmentQuery.toLowerCase();
        const matchQuery = !query || c.number.toLowerCase().includes(query) ||
               c.supplier.toLowerCase().includes(query) ||
               c.sei.toLowerCase().includes(query) ||
               c.city.toLowerCase().includes(query);
        const matchStatus = !filterCommitmentStatus || c.status === filterCommitmentStatus;
        const matchCategory = !filterCommitmentCategory || c.category === filterCommitmentCategory;
        const matchSupplier = !filterCommitmentSupplier || c.supplier === filterCommitmentSupplier;
        return matchQuery && matchStatus && matchCategory && matchSupplier;
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [commitments, filterCommitmentQuery, filterCommitmentStatus, filterCommitmentCategory, filterCommitmentSupplier]);

  const totalFilteredCost = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + (r.invoiceValue && r.invoiceValue > 0 ? r.invoiceValue : r.cost), 0);
  }, [filteredRecords]);

  const activeOrdersCount = useMemo(() => {
    return records.filter(r => r.status !== MaintenanceStatus.CONCLUIDO).length;
  }, [records]);

  const completedOrdersCount = useMemo(() => {
    return records.filter(r => r.status === MaintenanceStatus.CONCLUIDO).length;
  }, [records]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId) return;

    const recordData = {
      vehicleId: selectedVehicleId,
      type: maintenanceType,
      workshop,
      date: startDate,
      odometerAtMaintenance: Number(odometer),
      status: maintenanceStatus,
      cost: Number(cost || 0),
      progress: getProgressFromStatus(maintenanceStatus),
      servicesPerformed,
      budgetDocument,
      commitmentDocument,
      invoiceDocument,
      seiDocument,
      invoiceValue: Number(invoiceValue || 0),
      commitmentId: selectedCommitmentId || undefined,
    };

    try {
      if (editingRecordId) {
        await updateRecord(editingRecordId, recordData);
      } else {
        await addRecord(recordData);
      }
      handleCancel();
    } catch (err: any) {
      alert('Erro ao salvar ordem de serviço: ' + (err.message || err));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Sub-Navegação superior */}
      <div className="flex border-b border-outline-variant pb-1.5 gap-6">
        <button
          onClick={() => setActiveTab('manutencoes')}
          className={cn(
            "text-xs font-black uppercase tracking-widest pb-3 px-1 transition-all border-b-2",
            activeTab === 'manutencoes' 
              ? "border-primary text-primary" 
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          )}
        >
          Ordens de Serviço
        </button>
        <button
          onClick={() => setActiveTab('empenhos')}
          className={cn(
            "text-xs font-black uppercase tracking-widest pb-3 px-1 transition-all border-b-2",
            activeTab === 'empenhos' 
              ? "border-primary text-primary" 
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          )}
        >
          Gerenciador de Empenhos
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && activeTab === 'manutencoes' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-xl mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-on-surface uppercase tracking-tight">
                {editingRecordId ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
              </h2>
              <button 
                type="button"
                onClick={handleCancel} 
                className="text-on-surface-variant hover:text-primary font-bold text-sm uppercase"
              >
                Cancelar
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-outline-variant pb-4">
                <h3 className="text-[11px] font-black text-primary uppercase tracking-widest mb-4">1. Detalhamento Administrativo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Campo de Empenho Cadastrado */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Selecione o Empenho *</label>
                    <div className="flex gap-2">
                      <select 
                        required
                        value={selectedCommitmentId}
                        onChange={(e) => {
                          const id = e.target.value;
                          setSelectedCommitmentId(id);
                          const chosen = commitments.find(c => c.id === id);
                          if (chosen) {
                            setCommitmentDocument(chosen.number);
                            setSeiDocument(chosen.sei);
                            if (chosen.supplier) {
                              setWorkshop(chosen.supplier);
                            }
                          } else {
                            setCommitmentDocument('');
                            setSeiDocument('');
                            setWorkshop('');
                          }
                        }}
                        className="flex-1 bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none animate-none"
                      >
                        <option value="">-- Escolha um empenho cadastrado --</option>
                        {commitments.filter(c => c.status === CommitmentStatus.VIGENTE).map(c => (
                          <option key={c.id} value={c.id}>
                            {c.number} - {c.category} - {c.city} (Saldo: R$ {c.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                          </option>
                        ))}
                      </select>
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingCommitmentId(null);
                          setCompUnit(user?.unit || '');
                          setCompSei('');
                          setCompStatus(CommitmentStatus.VIGENTE);
                          setCompCategory(CommitmentCategory.LEVE);
                          setCompCity('');
                          setCompSupplier('');
                          setCompNumber('');
                          setCompYear(new Date().getFullYear().toString());
                          setCompInitialValue('');
                          setCompReinforcementValue('0');
                          setCompCancellationValue('0');
                          setCompBudgetedToPay('0');
                          setCompLiquidatedValue('0');
                          setShowCommitmentModal(true);
                        }}
                        className="bg-primary/5 hover:bg-primary border border-primary/20 hover:border-primary text-primary hover:text-white px-4 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 flex-shrink-0"
                      >
                        + Novo Empenho
                      </button>
                    </div>
                  </div>

                  {/* Oficina Credenciada (Preenchido Automaticamente) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Oficina Credenciada</label>
                    <input 
                      disabled
                      type="text"
                      value={workshop}
                      placeholder="Definido pelo Empenho"
                      className="w-full bg-surface-container/50 border border-outline-variant p-3 rounded-lg font-bold text-on-surface-variant cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-outline-variant pb-4">
                <h3 className="text-[11px] font-black text-primary uppercase tracking-widest mb-4">2. Dados Operacionais da Manutenção</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Viatura (Prefixo)</label>
                    <select 
                      required
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.prefix} - {v.type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Data do Início</label>
                    <input 
                      required
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">KM da Manutenção</label>
                    <input 
                      required
                      type="number"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      placeholder="Quilometragem atual"
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Categoria de Serviço</label>
                    <select 
                      required
                      value={maintenanceType}
                      onChange={(e) => setMaintenanceType(e.target.value as MaintenanceType)}
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      {Object.values(MaintenanceType).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Situação</label>
                    <select 
                      value={maintenanceStatus}
                      onChange={(e) => setMaintenanceStatus(e.target.value as MaintenanceStatus)}
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      {Object.values(MaintenanceStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Serviços Realizados</label>
                    <textarea 
                      value={servicesPerformed}
                      onChange={(e) => setServicesPerformed(e.target.value)}
                      placeholder="Descreva detalhadamente os serviços corretivos/preventivos realizados na viatura..."
                      rows={3}
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black text-primary uppercase tracking-widest mb-4">3. Detalhamento Financeiro</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Valor Pago / Nota Fiscal (R$)</label>
                    <input 
                      type="number"
                      value={invoiceValue}
                      onChange={(e) => setInvoiceValue(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Doc. Orçamento (Ref.)</label>
                    <input 
                      type="text"
                      value={budgetDocument}
                      onChange={(e) => setBudgetDocument(e.target.value)}
                      placeholder="Nº Orçamento"
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Doc. Nota Fiscal</label>
                    <input 
                      type="text"
                      value={invoiceDocument}
                      onChange={(e) => setInvoiceDocument(e.target.value)}
                      placeholder="Nº Nota Fiscal"
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-outline-variant">
                <button type="submit" className="bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg">
                  {editingRecordId ? 'Atualizar Ordem de Serviço' : 'Salvar Ordem de Serviço'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDERIZAR TAB DE MANUTENÇÃO */}
      {activeTab === 'manutencoes' ? (
        <>
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => { handleCancel(); setShowAddForm(true); }}
              className="bg-primary text-white px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg text-[10px] sm:text-xs uppercase tracking-widest group w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
              Lançar Manutenção
            </button>
          </div>

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
                      <option value="">Todas as Situações</option>
                      {Object.values(MaintenanceStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-outline-variant px-3 py-1.5 rounded-lg w-full sm:w-auto">
                    <select 
                      value={filterCommitment}
                      onChange={(e) => setFilterCommitment(e.target.value)}
                      className="text-xs font-bold text-on-surface focus:outline-none bg-transparent w-full sm:w-auto"
                    >
                      <option value="">Todos os Empenhos</option>
                      {commitments.map(c => (
                        <option key={c.id} value={c.id}>{c.number} - {c.category} - {c.city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-outline-variant px-3 py-1.5 rounded-lg w-full sm:w-auto">
                    <Search className="w-3.5 h-3.5 text-on-surface-variant" />
                    <input
                      type="text"
                      placeholder="Buscar em todos os dados..."
                      value={filterSearchQuery}
                      onChange={(e) => setFilterSearchQuery(e.target.value)}
                      className="text-xs font-bold text-on-surface focus:outline-none bg-transparent w-full sm:w-auto placeholder:font-normal"
                    />
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
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[180px]">Serviço / Detalhes</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[110px] text-right">Nota Fiscal (R$)</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Orçamento</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Empenho</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Nota Fiscal</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">SEI</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[140px]">Situação</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[80px]">Progresso</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 text-xs">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                          Nenhum registro de manutenção no banco de dados.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((record) => {
                        const vehicle = vehicles.find(v => v.id === record.vehicleId);
                        return (
                          <tr key={record.id} className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-on-surface-variant font-data-mono">
                              {record.date ? new Date(record.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'S/D'}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-black text-primary text-xs uppercase block">{vehicle?.prefix || 'VIATURA'}</span>
                              <span className="block text-[9px] font-bold text-on-surface-variant uppercase">{vehicle?.type || 'Tipo'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-on-surface uppercase tracking-tight">{record.type}</span>
                              {record.servicesPerformed && (
                                <span className="block text-[10px] text-on-surface-variant font-medium mt-0.5 leading-relaxed max-w-xs">{record.servicesPerformed}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-green-700 font-data-mono">
                              R$ {record.invoiceValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                            </td>
                            <td className="px-6 py-4 font-bold text-on-surface-variant font-data-mono">
                              {record.budgetDocument ? (
                                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded shadow-sm">
                                  {record.budgetDocument}
                                </span>
                              ) : (
                                <span className="text-on-surface-variant/40">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-bold text-on-surface-variant font-data-mono">
                              {record.commitmentDocument ? (
                                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded shadow-sm">
                                  {record.commitmentDocument}
                                </span>
                              ) : (
                                <span className="text-on-surface-variant/40">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-bold text-on-surface-variant font-data-mono">
                              {record.invoiceDocument ? (
                                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 rounded shadow-sm">
                                  {record.invoiceDocument}
                                </span>
                              ) : (
                                <span className="text-on-surface-variant/40">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-bold text-on-surface-variant font-data-mono">
                              {record.seiDocument ? (
                                <span className="text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                                  {record.seiDocument}
                                </span>
                              ) : (
                                <span className="text-on-surface-variant/40">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <select 
                                value={record.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as MaintenanceStatus;
                                  const newProgress = getProgressFromStatus(newStatus);
                                  await updateRecord(record.id, { status: newStatus, progress: newProgress });
                                }}
                                className={cn(
                                  "text-[10px] font-black uppercase tracking-wider p-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:outline-none w-full",
                                  record.status === MaintenanceStatus.CONCLUIDO && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                  record.status === MaintenanceStatus.MANUTENCAO && "bg-amber-50 text-amber-700 border-amber-200",
                                  record.status === MaintenanceStatus.ORCAMENTO && "bg-blue-50 text-blue-700 border-blue-200",
                                  record.status === MaintenanceStatus.NOTA_FISCAL && "bg-purple-50 text-purple-700 border-purple-200",
                                  record.status === MaintenanceStatus.SEI && "bg-slate-50 text-slate-700 border-slate-200"
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
                                      record.status === MaintenanceStatus.CONCLUIDO ? "bg-emerald-600" :
                                      record.status === MaintenanceStatus.MANUTENCAO ? "bg-amber-600" :
                                      record.status === MaintenanceStatus.ORCAMENTO ? "bg-blue-600" :
                                      record.status === MaintenanceStatus.NOTA_FISCAL ? "bg-purple-600" :
                                      "bg-slate-600"
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
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEditClick(record)}
                                  className="text-on-surface-variant hover:text-primary transition-colors p-1"
                                  title="Editar O.S."
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
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
                              </div>
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

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5 font-bold">Serviço / O.S.</span>
                            <span className="inline-block bg-surface-container px-2 py-0.5 rounded text-[9px] font-black text-on-surface uppercase mr-2">{record.type}</span>
                            {record.servicesPerformed && (
                              <p className="text-xs text-on-surface font-medium mt-1 leading-relaxed">{record.servicesPerformed}</p>
                            )}
                          </div>
                          <div>
                            <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5 font-bold">Oficina</span>
                            <span className="text-on-surface-variant font-semibold">{record.workshop}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs font-bold font-data-mono">
                          <div>
                            <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5 font-bold">Quilometragem</span>
                            <span className="text-on-surface-variant">{record.odometerAtMaintenance?.toLocaleString() || '0'} KM</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-0.5 font-bold">Financeiro (R$)</span>
                            <div className="text-[10px] text-on-surface-variant/80">
                              Orçado: R$ {record.cost?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                            </div>
                            <div className="text-[10px] text-green-700 font-black">
                              Nota: R$ {record.invoiceValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                            </div>
                          </div>
                        </div>

                        {/* Documentos no Mobile */}
                        {(record.budgetDocument || record.commitmentDocument || record.invoiceDocument || record.seiDocument) && (
                          <div className="space-y-1">
                            <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest font-bold">Documentação</span>
                            <div className="flex flex-wrap gap-1">
                              {record.budgetDocument && (
                                <span className="text-[8px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded">
                                  ORÇ: {record.budgetDocument}
                                </span>
                              )}
                              {record.commitmentDocument && (
                                <span className="text-[8px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded">
                                  EMP: {record.commitmentDocument}
                                </span>
                              )}
                              {record.invoiceDocument && (
                                <span className="text-[8px] font-bold bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 rounded">
                                  NF: {record.invoiceDocument}
                                </span>
                              )}
                              {record.seiDocument && (
                                <span className="text-[8px] font-bold bg-slate-50 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">
                                  SEI: {record.seiDocument}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-1 font-bold">Situação</span>
                            <select 
                              value={record.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value as MaintenanceStatus;
                                const newProgress = getProgressFromStatus(newStatus);
                                  await updateRecord(record.id, { status: newStatus, progress: newProgress });
                              }}
                              className={cn(
                                "text-[10px] font-black uppercase tracking-wider p-2.5 rounded-lg border focus:outline-none w-full",
                                record.status === MaintenanceStatus.CONCLUIDO && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                record.status === MaintenanceStatus.MANUTENCAO && "bg-amber-50 text-amber-700 border-amber-200",
                                record.status === MaintenanceStatus.ORCAMENTO && "bg-blue-50 text-blue-700 border-blue-200",
                                record.status === MaintenanceStatus.NOTA_FISCAL && "bg-purple-50 text-purple-700 border-purple-200",
                                record.status === MaintenanceStatus.SEI && "bg-slate-50 text-slate-700 border-slate-200"
                              )}
                            >
                              {Object.values(MaintenanceStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>

                          <div className="w-1/3">
                            <span className="block text-[8px] text-on-surface-variant/60 uppercase tracking-widest mb-1 font-bold">Progresso</span>
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    record.status === MaintenanceStatus.CONCLUIDO ? "bg-emerald-600" :
                                    record.status === MaintenanceStatus.MANUTENCAO ? "bg-amber-600" :
                                    record.status === MaintenanceStatus.ORCAMENTO ? "bg-blue-600" :
                                    record.status === MaintenanceStatus.NOTA_FISCAL ? "bg-purple-600" :
                                    "bg-slate-600"
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

                        <div className="pt-2 border-t border-outline-variant/30 flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(record)}
                            className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest hover:underline px-3 py-1 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-lg transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Editar Registro
                          </button>
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
        </>
      ) : (
        /* RENDERIZAR TAB DE EMPENHOS (GERENCIADOR) */
        <div className="space-y-6">
          <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Painel de Empenhos Cadastrados
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">Gerencie os recursos, empenhos, reforços e saldos de manutenção.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Filtro Situação */}
              <select
                value={filterCommitmentStatus}
                onChange={(e) => setFilterCommitmentStatus(e.target.value)}
                className="text-xs font-bold text-on-surface bg-white border border-outline-variant px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todas Situações</option>
                <option value="vigente">Vigente</option>
                <option value="finalizado">Finalizado</option>
              </select>

              {/* Filtro Categoria */}
              <select
                value={filterCommitmentCategory}
                onChange={(e) => setFilterCommitmentCategory(e.target.value)}
                className="text-xs font-bold text-on-surface bg-white border border-outline-variant px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todas Categorias</option>
                <option value="leve">Leve</option>
                <option value="pesado">Pesado</option>
              </select>

              {/* Filtro Fornecedor */}
              <select
                value={filterCommitmentSupplier}
                onChange={(e) => setFilterCommitmentSupplier(e.target.value)}
                className="text-xs font-bold text-on-surface bg-white border border-outline-variant px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos Fornecedores</option>
                {commitmentSuppliers.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Busca texto */}
              <div className="flex items-center gap-2 bg-white border border-outline-variant px-3 py-1.5 rounded-lg">
                <Filter className="w-3.5 h-3.5 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Buscar nº/SEI..."
                  value={filterCommitmentQuery}
                  onChange={(e) => setFilterCommitmentQuery(e.target.value)}
                  className="text-xs font-bold text-on-surface focus:outline-none bg-transparent placeholder-on-surface-variant/40 w-28"
                />
              </div>

              {/* Botão Cadastrar */}
              <button
                onClick={() => {
                  setEditingCommitmentId(null);
                  setCompUnit(user?.unit || '');
                  setCompSei('');
                  setCompStatus(CommitmentStatus.VIGENTE);
                  setCompCategory(CommitmentCategory.LEVE);
                  setCompCity('');
                  setCompSupplier('');
                  setCompNumber('');
                  setCompYear(new Date().getFullYear().toString());
                  setCompInitialValue('');
                  setCompReinforcementValue('0');
                  setCompCancellationValue('0');
                  setCompBudgetedToPay('0');
                  setCompLiquidatedValue('0');
                  setShowCommitmentModal(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 hover:bg-black transition-all shadow-md w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" />
                Novo Empenho
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-outline-variant">
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[120px]">Nº Empenho</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[160px]">Fornecedor</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[100px]">Categoria</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[140px]">Cidade / SEI</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Inic. + Ref. - Anul.</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Liquidado</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Saldo Restante</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest min-w-[80px]">Situação</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-xs">
                  {filteredCommitments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-sm text-on-surface-variant italic opacity-50">
                        Nenhum empenho cadastrado.
                      </td>
                    </tr>
                  ) : (
                    filteredCommitments.map((c) => (
                      <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4 space-y-0.5">
                          <span className="font-black font-data-mono text-primary uppercase block">{c.number}</span>
                          <span className="text-[10px] text-on-surface-variant font-bold block">Ano: {c.year}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-on-surface block max-w-[160px] truncate">{c.supplier || <span className="italic text-on-surface-variant/40">—</span>}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                            c.category === CommitmentCategory.LEVE ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
                          )}>
                            {c.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="block font-bold text-on-surface-variant">{c.city}</span>
                          <span className="block text-[10px] text-on-surface-variant/60 font-medium font-data-mono">{c.sei}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold font-data-mono space-y-0.5">
                          <div className="text-[10px] text-on-surface-variant">Inicial: R$ {c.initialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          {c.reinforcementValue > 0 && <div className="text-[9px] text-green-600">+ Ref: R$ {c.reinforcementValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>}
                          {c.cancellationValue > 0 && <div className="text-[9px] text-error">- Anul: R$ {c.cancellationValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-purple-700 font-data-mono">
                          R$ {c.liquidatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className={cn(
                          "px-6 py-4 text-right font-black font-data-mono text-sm",
                          c.balance > 0 ? "text-emerald-700" : "text-error"
                        )}>
                          R$ {c.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                            c.status === CommitmentStatus.VIGENTE ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-50 text-slate-600 border border-slate-200"
                          )}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCommitmentId(c.id);
                                setCompUnit(c.unit);
                                setCompSei(c.sei);
                                setCompStatus(c.status);
                                setCompCategory(c.category);
                                setCompCity(c.city);
                                setCompSupplier(c.supplier);
                                setCompNumber(c.number);
                                setCompYear(c.year.toString());
                                setCompInitialValue(c.initialValue.toString());
                                setCompReinforcementValue(c.reinforcementValue.toString());
                                setCompCancellationValue(c.cancellationValue.toString());
                                setCompBudgetedToPay(c.budgetedToPay.toString());
                                setCompLiquidatedValue(c.liquidatedValue.toString());
                                setShowCommitmentModal(true);
                              }}
                              className="text-on-surface-variant hover:text-primary transition-colors p-1"
                              title="Editar Empenho"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Deseja realmente excluir permanentemente o empenho ${c.number}?`)) {
                                  await deleteCommitment(c.id);
                                }
                              }}
                              className="text-on-surface-variant hover:text-error transition-colors p-1"
                              title="Excluir Empenho"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {filteredCommitments.length === 0 ? (
              <div className="bg-white border border-outline-variant rounded-xl p-6 text-center text-xs text-on-surface-variant italic opacity-50">
                Nenhum empenho cadastrado.
              </div>
            ) : (
              filteredCommitments.map((c) => (
                <div key={c.id} className="bg-white border border-outline-variant rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-primary text-sm uppercase tracking-wide font-data-mono block">{c.number}</span>
                      <span className="text-[10px] text-on-surface-variant/70 font-semibold block">{c.supplier}</span>
                      <span className="text-[10px] text-on-surface-variant/50 font-bold block">Ano: {c.year}</span>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                      c.status === CommitmentStatus.VIGENTE ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-slate-600 border border-slate-200"
                    )}>
                      {c.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Cidade</span>
                      <span className="font-semibold text-on-surface">{c.city || '—'}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Processo SEI</span>
                      <span className="font-medium font-data-mono text-[10px]">{c.sei}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Categoria</span>
                      <span className={cn(
                        "inline-block px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider",
                        c.category === CommitmentCategory.LEVE ? "bg-blue-50 text-blue-700" : c.category === CommitmentCategory.PESADO ? "bg-orange-50 text-orange-700" : "bg-slate-50 text-slate-400"
                      )}>
                        {c.category || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant/30 pt-3 grid grid-cols-2 gap-2 font-data-mono text-[10px]">
                    <div className="space-y-0.5">
                      <span className="block text-[8px] text-on-surface-variant/60 font-bold uppercase font-sans">Valores</span>
                      <div>Inic: R$ {c.initialValue.toLocaleString('pt-BR')}</div>
                      {c.reinforcementValue > 0 && <div className="text-green-600">+Ref: R$ {c.reinforcementValue.toLocaleString('pt-BR')}</div>}
                      {c.cancellationValue > 0 && <div className="text-error">-Anul: R$ {c.cancellationValue.toLocaleString('pt-BR')}</div>}
                    </div>
                    <div className="text-right space-y-1">
                      <div>
                        <span className="block text-[8px] text-on-surface-variant/60 font-bold uppercase font-sans">Liquidado</span>
                        <span className="font-bold text-purple-700">R$ {c.liquidatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-on-surface-variant/60 font-bold uppercase font-sans">Saldo Restante</span>
                        <span className={cn(
                          "font-black text-xs",
                          c.balance > 0 ? "text-emerald-700" : "text-error"
                        )}>R$ {c.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/30 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingCommitmentId(c.id);
                        setCompUnit(c.unit);
                        setCompSei(c.sei);
                        setCompStatus(c.status);
                        setCompCategory(c.category);
                        setCompCity(c.city);
                        setCompSupplier(c.supplier);
                        setCompNumber(c.number);
                        setCompYear(c.year.toString());
                        setCompInitialValue(c.initialValue.toString());
                        setCompReinforcementValue(c.reinforcementValue.toString());
                        setCompCancellationValue(c.cancellationValue.toString());
                        setCompBudgetedToPay(c.budgetedToPay.toString());
                        setCompLiquidatedValue(c.liquidatedValue.toString());
                        setShowCommitmentModal(true);
                      }}
                      className="px-2.5 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(`Deseja realmente excluir permanentemente o empenho ${c.number}?`)) {
                          await deleteCommitment(c.id);
                        }
                      }}
                      className="px-2.5 py-1.5 bg-error/5 hover:bg-error/10 text-error border border-error/10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO/EDIÇÃO DE EMPENHOS */}
      <AnimatePresence>
        {showCommitmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-outline-variant rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                <h3 className="text-base font-black text-on-surface uppercase tracking-wider">
                  {editingCommitmentId ? 'Editar Empenho' : 'Cadastrar Novo Empenho'}
                </h3>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCommitmentModal(false);
                    setEditingCommitmentId(null);
                  }} 
                  className="text-on-surface-variant hover:text-error font-bold text-sm uppercase"
                >
                  Fechar
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Processo SEI */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Processo SEI</label>
                    <input 
                      required
                      type="text"
                      value={compSei}
                      onChange={(e) => setCompSei(e.target.value)}
                      placeholder="Ex: 00120-000034/2026-00"
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>

                  {/* Número Empenho */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Número do Empenho</label>
                    <input 
                      required
                      type="text"
                      value={compNumber}
                      onChange={(e) => setCompNumber(e.target.value)}
                      placeholder="Ex: 2026NE00123"
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>

                  {/* Ano */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ano</label>
                    <input 
                      required
                      type="number"
                      min="2000"
                      max="2100"
                      value={compYear}
                      onChange={(e) => setCompYear(e.target.value)}
                      placeholder="Ex: 2026"
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>

                  {/* Fornecedor */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Fornecedor</label>
                    <input 
                      required
                      type="text"
                      value={compSupplier}
                      onChange={(e) => setCompSupplier(e.target.value)}
                      placeholder="Ex: Auto Peças Silva Ltda"
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>

                  {/* Categoria */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Categoria da Frota</label>
                    <select 
                      value={compCategory}
                      onChange={(e) => setCompCategory(e.target.value as CommitmentCategory)}
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <option value={CommitmentCategory.LEVE}>Leve</option>
                      <option value={CommitmentCategory.PESADO}>Pesado</option>
                    </select>
                  </div>

                  {/* Cidade */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cidade</label>
                    <select 
                      required
                      value={compCity}
                      onChange={(e) => setCompCity(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      <option value="ITAJUBA">ITAJUBA</option>
                      <option value="EXTREMA">EXTREMA</option>
                      <option value="POUSO ALEGRE">POUSO ALEGRE</option>
                    </select>
                  </div>

                  {/* Situação */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Situação</label>
                    <select 
                      value={compStatus}
                      onChange={(e) => setCompStatus(e.target.value as CommitmentStatus)}
                      className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <option value={CommitmentStatus.VIGENTE}>Vigente</option>
                      <option value={CommitmentStatus.FINALIZADO}>Finalizado</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-outline-variant pt-6">
                  <h4 className="text-[11px] font-black text-primary uppercase tracking-widest mb-4">Detalhamento Financeiro (Valores R$)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Empenho Inicial */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Empenho Inicial</label>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        value={compInitialValue}
                        onChange={(e) => setCompInitialValue(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    {/* Reforço de Empenho */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reforço de Empenho</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={compReinforcementValue}
                        onChange={(e) => setCompReinforcementValue(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    {/* Anulação de Empenho */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Anulação de Empenho</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={compCancellationValue}
                        onChange={(e) => setCompCancellationValue(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    {/* Valor Orçado a Pagar */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Valor Orçado a Pagar</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={compBudgetedToPay}
                        onChange={(e) => setCompBudgetedToPay(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    {/* Valor Liquidado */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Valor Liquidado</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={compLiquidatedValue}
                        onChange={(e) => setCompLiquidatedValue(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    {/* Saldo de Empenho */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Saldo de Empenho (Calculado)</label>
                      <div className="w-full bg-emerald-50 border border-emerald-200 p-3 rounded-lg font-black text-emerald-800 text-xs">
                        R$ {compBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCommitmentModal(false);
                    setEditingCommitmentId(null);
                  }} 
                  className="px-5 py-3 rounded-xl font-bold text-xs uppercase border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  onClick={async () => {
                    const finalUnit = compUnit || user?.unit || '1º BBM';
                    if (!compSei || !compNumber || !compSupplier || !compCity || !compInitialValue || !compYear) {
                      alert('Por favor, preencha todos os campos obrigatórios.');
                      return;
                    }
                    
                    const payload = {
                      unit: finalUnit,
                      sei: compSei,
                      status: compStatus,
                      category: compCategory,
                      city: compCity,
                      supplier: compSupplier,
                      number: compNumber,
                      year: Number(compYear),
                      initialValue: Number(compInitialValue),
                      reinforcementValue: Number(compReinforcementValue || 0),
                      cancellationValue: Number(compCancellationValue || 0),
                      budgetedToPay: Number(compBudgetedToPay || 0),
                      liquidatedValue: Number(compLiquidatedValue || 0),
                    };

                    try {
                      if (editingCommitmentId) {
                        await updateCommitment(editingCommitmentId, payload);
                      } else {
                        await addCommitment(payload);
                      }
                      setShowCommitmentModal(false);
                      setEditingCommitmentId(null);
                    } catch (err: any) {
                      alert('Erro ao salvar empenho: ' + (err.message || err));
                    }
                  }}
                  className="px-6 py-3 rounded-xl font-black text-xs uppercase bg-primary text-white hover:bg-black transition-colors"
                >
                  {editingCommitmentId ? 'Salvar Alterações' : 'Salvar Empenho'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
