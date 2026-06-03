import React, { useState, useMemo } from 'react';
import { Shield, Terminal, User, FileText, AlertTriangle, Car, ChevronDown, Eye, X, Pencil, Trash2, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { useReports } from '../context/ReportContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AuditLogs() {
  const { submissions, deleteSubmission, updateSubmission } = useReports();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OK' | 'ISSUE' | 'MAINTENANCE'>('ALL');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [militarFilter, setMilitarFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('Todos');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [editingSubmission, setEditingSubmission] = useState<any>(null);

  const today = new Date().toLocaleDateString('pt-BR');

  const typeColors: Record<string, string> = {
    'SALVAMENTO': 'bg-green-600',
    'SOCORRO': 'bg-blue-600',
    'RESGATE': 'bg-red-600',
    'APOIO': 'bg-gray-500',
    'ADMINISTRATIVO': 'bg-yellow-500',
  };

  const todaySubmissions = useMemo(() => {
    return submissions.filter(sub => sub.timestamp.startsWith(today));
  }, [submissions, today]);

  const submissionTypeBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    todaySubmissions.forEach(sub => {
      const type = sub.vehicleType || 'N/A';
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    return breakdown;
  }, [todaySubmissions]);

  const anomalyTypeBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    todaySubmissions.forEach(sub => {
      const anomaliesCount = sub.items.filter(i => !i.status).length;
      if (anomaliesCount > 0) {
        const type = sub.vehicleType || 'N/A';
        breakdown[type] = (breakdown[type] || 0) + anomaliesCount;
      }
    });
    return breakdown;
  }, [todaySubmissions]);

  const totalAnomalies = useMemo(() => {
    return todaySubmissions.reduce((acc, s) => acc + s.items.filter(i => !i.status).length, 0);
  }, [todaySubmissions]);

  const todayAnomaliesList = useMemo(() => {
    return todaySubmissions
      .filter(sub => sub.items.some(i => !i.status))
      .map(sub => {
        const anomalies = sub.items.filter(i => !i.status);
        return {
          ...sub,
          anomaliesCount: anomalies.length
        };
      });
  }, [todaySubmissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const itemsOk = sub.items.filter(i => i.status).length;
      const totalItems = sub.items.length;
      const hasIssues = itemsOk < totalItems;

      const matchesStatus = 
        statusFilter === 'ALL' ||
        (statusFilter === 'OK' && !hasIssues) ||
        (statusFilter === 'ISSUE' && hasIssues) ||
        (statusFilter === 'MAINTENANCE'); // For now, just show non-maintenance in this table or expand table.

      const matchesVehicle = !vehicleFilter || 
        sub.vehiclePrefix.toLowerCase().includes(vehicleFilter.toLowerCase()) ||
        (sub.vehicleType && sub.vehicleType.toLowerCase().includes(vehicleFilter.toLowerCase()));

      const matchesMilitar = !militarFilter ||
        sub.userName.toLowerCase().includes(militarFilter.toLowerCase()) ||
        (sub.userRank && sub.userRank.toLowerCase().includes(militarFilter.toLowerCase()));

      let matchesDate = true;
      if (dateFilter) {
        const [year, month, day] = dateFilter.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        matchesDate = sub.timestamp.startsWith(formattedDate);
      }

      let matchesUnit = true;
      if (unitFilter !== 'Todos') {
        matchesUnit = sub.vehicleUnit === unitFilter || sub.userUnit === unitFilter;
      }

      return matchesStatus && matchesVehicle && matchesMilitar && matchesDate && matchesUnit;
    });
  }, [submissions, statusFilter, vehicleFilter, militarFilter, dateFilter, unitFilter]);

  const units = useMemo(() => {
    const u = new Set(submissions.map(sub => sub.vehicleUnit).filter(Boolean));
    return ['Todos', ...Array.from(u)].sort();
  }, [submissions]);

  const generatePDF = (submission: any) => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Relatorio de Alteracoes e Ressalvas', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Viatura: ${submission.vehiclePrefix} (${submission.vehicleType})`, 14, 30);
    doc.text(`Odometro: ${submission.odometer?.toLocaleString('pt-BR')} KM`, 14, 36);
    doc.text(`Militar Responsavel: ${submission.userRank} ${submission.userName} (${submission.userMilNumber})`, 14, 42);
    doc.text(`Data/Hora: ${submission.timestamp}`, 14, 48);
    
    const anomalies = submission.items.filter((item: any) => !item.status);
    
    const tableData = anomalies.map((item: any) => [
      item.description,
      item.observation || 'Nenhuma observacao descrita.'
    ]);
    
    autoTable(doc, {
      startY: 55,
      head: [['Item com Alteracao', 'Ressalva / Observacao']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 9 }
    });
    
    doc.save(`relatorio_alteracoes_${submission.vehiclePrefix}_${submission.timestamp.replace(/[\/\s:]/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-surface-container rounded-lg">
                    <FileText className="w-5 h-5 text-on-surface-variant" />
                </div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Checklists Enviados - ({today})</p>
            </div>
            <p className="text-3xl font-black text-on-surface mb-4">{todaySubmissions.length}</p>

            <div className="space-y-3 pt-4 border-t border-outline-variant/30">
              {Object.entries(submissionTypeBreakdown).map(([type, count]) => {
                const barColor = typeColors[type.toUpperCase()] || 'bg-primary';
                const percentage = ((count as number) / (todaySubmissions.length || 1)) * 100;
                
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

            <div className="mt-6 pt-6 border-t border-outline-variant/30 space-y-3">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-primary" />
                Viaturas Recebidas Hoje
              </p>
              {todaySubmissions.length === 0 ? (
                <p className="text-xs text-on-surface-variant italic opacity-50 py-2">Nenhuma viatura recebida hoje.</p>
              ) : (
                <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {todaySubmissions.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center bg-surface-container-lowest/50 hover:bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 transition-all">
                      <div className="flex flex-col">
                        <span className="font-black text-primary text-xs uppercase tracking-tight">{sub.vehiclePrefix}</span>
                        <span className="text-[8px] font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">{sub.vehicleType}</span>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="font-bold text-[11px] text-on-surface uppercase tracking-tight">{sub.userRank} {sub.userName}</span>
                        <span className="text-[8px] font-black text-on-surface-variant opacity-40 font-data-mono uppercase tracking-wider">
                          {sub.timestamp.split(' ')[1]?.substring(0, 5) || ''}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
        
        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-error-container/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-error" />
                </div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-error">Anomalias Relatadas - ({today})</p>
            </div>
            <p className="text-3xl font-black text-error mb-4">{totalAnomalies}</p>

            <div className="space-y-3 pt-4 border-t border-outline-variant/30">
              {Object.entries(anomalyTypeBreakdown).map(([type, count]) => {
                const barColor = typeColors[type.toUpperCase()] || 'bg-error';
                const percentage = ((count as number) / (totalAnomalies || 1)) * 100;
                
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

            <div className="mt-6 pt-6 border-t border-outline-variant/30 space-y-3">
              <p className="text-[10px] font-black text-error uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-error" />
                Viaturas com Anomalias Recebidas Hoje
              </p>
              {todayAnomaliesList.length === 0 ? (
                <p className="text-xs text-on-surface-variant italic opacity-50 py-2">Nenhuma anomalia relatada hoje.</p>
              ) : (
                <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {todayAnomaliesList.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center bg-error-container/5 hover:bg-error-container/10 p-2.5 rounded-lg border border-error/10 transition-all">
                      <div className="flex flex-col">
                        <span className="font-black text-error text-xs uppercase tracking-tight">{sub.vehiclePrefix}</span>
                        <span className="text-[8px] font-bold text-error/80 opacity-90 uppercase tracking-widest">
                          {sub.anomaliesCount} {sub.anomaliesCount === 1 ? 'Anomalia Relatada' : 'Anomalias Relatadas'}
                        </span>
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="mt-1.5 self-start bg-error/10 hover:bg-error text-error hover:text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-2.5 h-2.5" />
                          Ver Alterações
                        </button>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="font-bold text-[11px] text-on-surface uppercase tracking-tight">{sub.userRank} {sub.userName}</span>
                        <span className="text-[8px] font-black text-on-surface-variant opacity-40 font-data-mono uppercase tracking-wider">
                          {sub.timestamp.split(' ')[1]?.substring(0, 5) || ''}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className={cn(
          "p-6 border-b border-outline-variant bg-surface-container-low grid grid-cols-1 sm:grid-cols-2 gap-4 items-end",
          user?.role === UserRole.ADMINISTRADOR ? "lg:grid-cols-5" : "lg:grid-cols-4"
        )}>
          {/* Status Filter */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Status</label>
            <div className="relative w-full">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full appearance-none flex items-center gap-2 px-4 py-3 bg-white border border-outline-variant text-on-surface-variant font-bold rounded-lg hover:bg-surface-container transition-all text-xs uppercase tracking-widest cursor-pointer pr-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="ALL">Todos os Status</option>
                <option value="OK">Sem Alteração</option>
                <option value="ISSUE">Com Ressalva</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
            </div>
          </div>

          {/* Vehicle Filter */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Viatura</label>
            <div className="relative w-full">
              <input
                type="text"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                placeholder="Ex: ABS-01, UR-02..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant text-on-surface font-bold rounded-lg text-xs uppercase tracking-wider placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
              <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            </div>
          </div>

          {/* Militar Filter */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Militar Responsável</label>
            <div className="relative w-full">
              <input
                type="text"
                value={militarFilter}
                onChange={(e) => setMilitarFilter(e.target.value)}
                placeholder="Nome ou Graduação..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant text-on-surface font-bold rounded-lg text-xs uppercase tracking-wider placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            </div>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Dia / Data</label>
            <div className="relative w-full">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-outline-variant text-on-surface font-bold rounded-lg text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Unit Filter (Administrador only) */}
          {user?.role === UserRole.ADMINISTRADOR && (
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Unidade</label>
              <div className="relative w-full">
                <select 
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="w-full appearance-none flex items-center gap-2 px-4 py-3 bg-white border border-outline-variant text-on-surface-variant font-bold rounded-lg hover:bg-surface-container transition-all text-xs uppercase tracking-widest cursor-pointer pr-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit === 'Todos' ? 'Todas as Unidades' : (unit as string).toUpperCase()}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-high/50 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Data / Hora</th>
                <th className="px-8 py-6">Militar Responsável</th>
                <th className="px-8 py-6">Viatura</th>
                {user?.role === UserRole.ADMINISTRADOR && <th className="px-8 py-6">Unidade</th>}
                <th className="px-8 py-6">Odômetro</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center">Itens OK</th>
                {user?.role === UserRole.DESENVOLVEDOR && <th className="px-8 py-6 text-center">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-[13px]">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant font-medium opacity-50 italic">
                    Nenhum checklist encontrado para os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const itemsOk = sub.items.filter(i => i.status).length;
                  const totalItems = sub.items.length;
                  const hasIssues = itemsOk < totalItems;

                  return (
                    <tr key={sub.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-8 py-6 font-data-mono font-bold text-on-surface-variant opacity-80 whitespace-nowrap">
                        {sub.timestamp}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant">
                                <User className="w-4 h-4 text-on-surface-variant" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-on-surface uppercase tracking-tight leading-none">{sub.userName}</span>
                              <span className="opacity-40 font-medium text-[9px] uppercase tracking-wider">{sub.userRank} | {sub.userMilNumber}</span>
                            </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-primary opacity-70" />
                          <span className="font-bold text-on-surface">{sub.vehiclePrefix}</span>
                          <span className="text-[10px] font-medium text-on-surface-variant opacity-60">({sub.vehicleType})</span>
                        </div>
                      </td>
                      {user?.role === UserRole.ADMINISTRADOR && (
                        <td className="px-8 py-6 font-bold text-on-surface text-[11px] uppercase tracking-wider">
                          {sub.vehicleUnit || sub.userUnit || '-'}
                        </td>
                      )}
                      <td className="px-8 py-6 font-data-mono text-on-surface-variant">
                        {sub.odometer.toLocaleString('pt-BR')} KM
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight inline-flex items-center gap-1.5",
                            hasIssues ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                          )}>
                              {hasIssues ? <AlertTriangle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                              {hasIssues ? 'Com Ressalva' : 'Sem Alteração'}
                          </span>
                          {hasIssues && (
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline cursor-pointer flex items-center gap-1 mt-1 shrink-0"
                            >
                              <Eye className="w-3 h-3" />
                              Ver Alterações
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-on-surface">{itemsOk}/{totalItems}</span>
                          <div className="w-20 h-1 bg-surface-container rounded-full mt-1 overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", itemsOk === totalItems ? "bg-green-500" : "bg-amber-500")}
                              style={{ width: `${(itemsOk / totalItems) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      {user?.role === UserRole.DESENVOLVEDOR && (
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditingSubmission(sub)}
                              className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm("Deseja excluir este relatório permanentemente?")) {
                                  await deleteSubmission(sub.id);
                                }
                              }}
                              className="p-1.5 bg-error/10 text-error hover:bg-error hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Card List */}
        <div className="block md:hidden divide-y divide-outline-variant/30">
          {filteredSubmissions.length === 0 ? (
            <div className="px-4 py-12 text-center text-on-surface-variant font-medium opacity-50 italic">
              Nenhum checklist encontrado para os filtros aplicados.
            </div>
          ) : (
            filteredSubmissions.map((sub) => {
              const itemsOk = sub.items.filter(i => i.status).length;
              const totalItems = sub.items.length;
              const hasIssues = itemsOk < totalItems;

              return (
                <div key={sub.id} className="p-4 space-y-4 hover:bg-surface-container-low transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant">
                        <User className="w-4 h-4 text-on-surface-variant" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-on-surface uppercase tracking-tight leading-tight">{sub.userName}</span>
                        <span className="opacity-50 text-[9px] uppercase tracking-wider font-semibold">{sub.userRank} | {sub.userMilNumber}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight inline-flex items-center gap-1",
                        hasIssues ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                      )}>
                        {hasIssues ? <AlertTriangle className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
                        {hasIssues ? 'Com Ressalva' : 'Sem Alt.'}
                      </span>
                      {hasIssues && (
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="text-[8px] font-black text-primary uppercase tracking-widest hover:underline cursor-pointer flex items-center gap-0.5 mt-0.5"
                        >
                          <Eye className="w-2.5 h-2.5 shrink-0" />
                          Alterações
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest mb-0.5">Viatura</span>
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-primary opacity-70" />
                        <span className="font-bold text-on-surface">{sub.vehiclePrefix}</span>
                        <span className="text-[9px] font-semibold text-on-surface-variant opacity-60">({sub.vehicleType})</span>
                      </div>
                      {user?.role === UserRole.ADMINISTRADOR && (
                        <span className="block text-[9px] font-bold text-on-surface-variant opacity-80 uppercase tracking-widest mt-1">
                          {sub.vehicleUnit || sub.userUnit || '-'}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="block text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest mb-0.5">Odômetro / Data</span>
                      <span className="font-data-mono text-on-surface block text-[11px] font-semibold leading-tight">{sub.odometer.toLocaleString('pt-BR')} KM</span>
                      <span className="font-data-mono text-[9px] text-on-surface-variant/60 block">{sub.timestamp}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest mb-1">
                      <span className="text-on-surface-variant/60">Itens Conformidade</span>
                      <span className="text-on-surface">{itemsOk}/{totalItems}</span>
                    </div>
                    <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", itemsOk === totalItems ? "bg-green-500" : "bg-amber-500")}
                        style={{ width: `${(itemsOk / totalItems) * 100}%` }}
                      />
                    </div>
                  </div>

                  {user?.role === UserRole.DESENVOLVEDOR && (
                    <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingSubmission(sub)}
                        className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest px-3 py-1.5 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors cursor-pointer border border-primary/10"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Deseja excluir este relatório permanentemente?")) {
                            await deleteSubmission(sub.id);
                          }
                        }}
                        className="flex items-center gap-1.5 text-[9px] font-black text-error uppercase tracking-widest px-3 py-1.5 bg-error/5 hover:bg-error/10 rounded-lg transition-colors cursor-pointer border border-error/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-6 bg-surface-container-low border-t border-outline-variant flex justify-center">
            <button className="text-[11px] font-black text-primary uppercase tracking-[0.2em] hover:underline">Ver Histórico Completo</button>
        </div>
      </div>

      {/* Modal de Detalhes das Anomalias */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div 
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="bg-white border border-outline-variant w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="p-6 bg-error-container/10 border-b border-outline-variant flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-error shrink-0" />
                  <h3 className="font-black text-on-surface text-base uppercase tracking-wider">
                    Alterações e Ressalvas da Viatura
                  </h3>
                </div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  {selectedSubmission.vehiclePrefix} • {selectedSubmission.timestamp}
                </p>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              {/* Info militar e viatura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                <div className="space-y-1">
                  <span className="block text-[8px] font-black text-on-surface-variant/60 uppercase tracking-widest">Militar Vistoriador</span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-on-surface-variant" />
                    <span className="font-bold text-xs uppercase text-on-surface">
                      {selectedSubmission.userRank} {selectedSubmission.userName} ({selectedSubmission.userMilNumber})
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[8px] font-black text-on-surface-variant/60 uppercase tracking-widest">Viatura / Odômetro</span>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-primary" />
                    <span className="font-bold text-xs uppercase text-on-surface">
                      {selectedSubmission.vehiclePrefix} ({selectedSubmission.vehicleType}) • {selectedSubmission.odometer?.toLocaleString('pt-BR')} KM
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista de anomalias */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-error" />
                  Itens com Alteração
                </h4>
                
                <div className="space-y-2.5">
                  {selectedSubmission.items.filter((item: any) => !item.status).map((item: any, idx: number) => (
                    <div key={idx} className="border border-error/10 bg-error-container/5 rounded-xl p-4 space-y-3 hover:bg-error-container/10 transition-colors">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h5 className="font-bold text-sm text-on-surface mt-1">
                          {item.description}
                        </h5>
                      </div>
                      
                      <div className="bg-white border border-error/20 rounded-lg p-3 space-y-1">
                        <span className="block text-[8px] font-black text-error uppercase tracking-widest">
                          Ressalva Registrada:
                        </span>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {item.observation || 'Nenhuma observação descrita.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-end gap-3">
              <button 
                onClick={() => generatePDF(selectedSubmission)}
                className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Gerar PDF
              </button>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="bg-on-surface text-white hover:bg-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Edição */}
      {editingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div 
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="bg-white border border-outline-variant w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="p-6 bg-primary/10 border-b border-outline-variant flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="font-black text-on-surface text-base uppercase tracking-wider">
                    Editar Relatório
                  </h3>
                </div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  {editingSubmission.vehiclePrefix} • {editingSubmission.timestamp}
                </p>
              </div>
              <button 
                onClick={() => setEditingSubmission(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Odômetro</label>
                <input 
                  type="number"
                  value={editingSubmission.odometer}
                  onChange={(e) => setEditingSubmission({ ...editingSubmission, odometer: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-sm"
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Itens do Checklist</h4>
                <div className="space-y-3">
                  {editingSubmission.items.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 border border-outline-variant rounded-xl bg-surface-container-low/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">{item.description}</span>
                        <div className="flex items-center gap-2 bg-surface-container rounded-lg p-1">
                          <button
                            onClick={() => {
                              const newItems = [...editingSubmission.items];
                              newItems[idx].status = true;
                              setEditingSubmission({ ...editingSubmission, items: newItems });
                            }}
                            className={cn("px-3 py-1 rounded text-xs font-black uppercase tracking-widest transition-all", item.status ? "bg-green-500 text-white shadow-sm" : "text-on-surface-variant hover:bg-black/5")}
                          >
                            OK
                          </button>
                          <button
                            onClick={() => {
                              const newItems = [...editingSubmission.items];
                              newItems[idx].status = false;
                              setEditingSubmission({ ...editingSubmission, items: newItems });
                            }}
                            className={cn("px-3 py-1 rounded text-xs font-black uppercase tracking-widest transition-all", !item.status ? "bg-error text-white shadow-sm" : "text-on-surface-variant hover:bg-black/5")}
                          >
                            Ressalva
                          </button>
                        </div>
                      </div>
                      {!item.status && (
                        <textarea
                          value={item.observation || ''}
                          onChange={(e) => {
                            const newItems = [...editingSubmission.items];
                            newItems[idx].observation = e.target.value;
                            setEditingSubmission({ ...editingSubmission, items: newItems });
                          }}
                          placeholder="Descreva a ressalva..."
                          className="w-full px-3 py-2 text-xs border border-error/30 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-error"
                          rows={2}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-end gap-3">
              <button 
                onClick={() => setEditingSubmission(null)}
                className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  try {
                    await updateSubmission(editingSubmission.id, {
                      odometer: editingSubmission.odometer,
                      items: editingSubmission.items
                    });
                    setEditingSubmission(null);
                  } catch (err) {
                    alert('Erro ao atualizar relatório.');
                  }
                }}
                className="bg-primary text-white hover:bg-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
