import React, { useState, useMemo } from 'react';
import { Shield, Download, Terminal, User, FileText, AlertTriangle, Car, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useReports } from '../context/ReportContext';
import { cn } from '../lib/utils';

export default function AuditLogs() {
  const { submissions } = useReports();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OK' | 'ISSUE' | 'MAINTENANCE'>('ALL');

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

      return matchesStatus;
    });
  }, [submissions, statusFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
            <Terminal className="w-8 h-8 text-primary" />
            Relatórios e Auditoria
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">Lançamentos automáticos de conferências e ações do sistema.</p>
        </div>
        <button className="bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 group">
          <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Exportar Relatório (CSV)
        </button>
      </div>

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
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
                <div className="relative group">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="appearance-none flex items-center gap-2 px-6 py-3 border border-outline text-on-surface-variant font-bold rounded-lg hover:bg-surface-container transition-all text-sm uppercase tracking-widest cursor-pointer pr-10"
                  >
                    <option value="ALL">Todos os Status</option>
                    <option value="OK">Sem Alteração</option>
                    <option value="ISSUE">Com Ressalva</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-high/50 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Data / Hora</th>
                <th className="px-8 py-6">Militar Responsável</th>
                <th className="px-8 py-6">Viatura</th>
                <th className="px-8 py-6">Odômetro</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center">Itens OK</th>
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
                      <td className="px-8 py-6 font-data-mono text-on-surface-variant">
                        {sub.odometer.toLocaleString('pt-BR')} KM
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight inline-flex items-center gap-1.5",
                          hasIssues ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                        )}>
                            {hasIssues ? <AlertTriangle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                            {hasIssues ? 'Com Ressalva' : 'Sem Alteração'}
                        </span>
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-surface-container-low border-t border-outline-variant flex justify-center">
            <button className="text-[11px] font-black text-primary uppercase tracking-[0.2em] hover:underline">Ver Histórico Completo</button>
        </div>
      </div>
    </div>
  );
}
