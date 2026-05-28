import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, RefreshCw, Clock, ChevronDown, ChevronUp, FileText, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, ArrowUpDown, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, TimeBankType, TimeBankRecord } from '../types';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface MovimentacaoUser {
  id: string;
  rank: string;
  name: string;
  mil_number: string;
  ala: string | null;
  unit: string;
}

interface DailyGroup {
  date: string;
  entradas: number;
  saidas: number;
  saldo: number;
  records: TimeBankRecord[];
}

export default function MovimentacaoDiaria() {
  const { user, registeredUsers } = useAuth();
  const [users, setUsers] = useState<MovimentacaoUser[]>([]);
  const [records, setRecords] = useState<TimeBankRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Date Filters
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1); // Default to start of current month
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Expandable rows state (stores date keys)
  const [expandedDates, setExpandedDates] = useState<{ [key: string]: boolean }>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Fetch Users and Records
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch users from the same unit if restricted
      let usersQuery = supabase
        .from('users')
        .select('id, rank, name, mil_number, ala, unit, role');

      if (user && user.role !== UserRole.ADMINISTRADOR && user.role !== UserRole.DESENVOLVEDOR) {
        usersQuery = usersQuery.eq('unit', user.unit);
      }

      const { data: usersData, error: usersError } = await usersQuery;
      if (usersError) throw usersError;

      const mappedUsers = (usersData || []).map(u => ({
        id: u.id,
        rank: u.rank,
        name: u.name,
        mil_number: u.mil_number,
        ala: u.ala,
        unit: u.unit
      }));
      setUsers(mappedUsers);

      const userIds = mappedUsers.map(u => u.id);

      if (userIds.length === 0) {
        setRecords([]);
        setIsLoading(false);
        return;
      }

      // 2. Fetch Time Bank Records in the date range for these users
      const { data: recordsData, error: recordsError } = await supabase
        .from('time_bank_records')
        .select('*')
        .in('user_id', userIds)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (recordsError) throw recordsError;

      const mappedRecords: TimeBankRecord[] = (recordsData || []).map(r => ({
        id: r.id,
        userId: r.user_id,
        type: r.type as TimeBankType,
        hours: Number(r.hours),
        date: r.date,
        description: r.description,
        createdAt: r.created_at,
        createdBy: r.created_by
      }));

      setRecords(mappedRecords);
    } catch (err) {
      console.error('Error fetching daily movement data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentPage(1);
    setExpandedDates({});
  }, [user, startDate, endDate]);

  // Group records by Date
  const dailyGroups = useMemo(() => {
    const groups: { [key: string]: DailyGroup } = {};

    records.forEach(record => {
      const dateKey = record.date;
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          entradas: 0,
          saidas: 0,
          saldo: 0,
          records: []
        };
      }

      groups[dateKey].records.push(record);

      if (record.type === TimeBankType.WORKED || record.type === TimeBankType.OVERTIME) {
        groups[dateKey].entradas += record.hours;
      } else if (record.type === TimeBankType.TIME_OFF) {
        groups[dateKey].saidas += record.hours;
      }
    });

    // Calculate saldo for each group and return sorted list by date (descending)
    return Object.values(groups)
      .map(group => {
        group.saldo = group.entradas - group.saidas;
        return group;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [records]);

  // Period consolidation totals
  const periodTotals = useMemo(() => {
    let totalEntradas = 0;
    let totalSaidas = 0;

    dailyGroups.forEach(g => {
      totalEntradas += g.entradas;
      totalSaidas += g.saidas;
    });

    return {
      entradas: totalEntradas,
      saidas: totalSaidas,
      saldo: totalEntradas - totalSaidas
    };
  }, [dailyGroups]);

  // Toggle row expansion
  const toggleRow = (date: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Helper to get military identification
  const getMilitarInfo = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      return {
        name: found.name,
        rank: found.rank,
        mil_number: found.mil_number,
        ala: found.ala
      };
    }
    const globalFound = registeredUsers.find(u => u.id === userId);
    if (globalFound) {
      return {
        name: globalFound.name,
        rank: globalFound.rank,
        mil_number: globalFound.milNumber,
        ala: globalFound.ala || null
      };
    }
    return {
      name: 'Militar',
      rank: 'Bombeiro',
      mil_number: 'N/A',
      ala: null
    };
  };

  // Helper to get creator rank/name
  const getCreatorInfo = (creatorId?: string) => {
    if (!creatorId) return 'Sistema';
    if (creatorId === user?.id) return 'Você';
    const found = registeredUsers.find(u => u.id === creatorId);
    return found ? `${found.rank} ${found.name}` : 'Militar';
  };

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(dailyGroups.length / itemsPerPage));
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return dailyGroups.slice(start, start + itemsPerPage);
  }, [dailyGroups, currentPage]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header and Sync */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
            <ArrowUpDown className="w-6 h-6 text-primary" />
            Movimentação Diária
          </h1>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">
            Histórico diário condensado de entradas (créditos) e saídas (débitos)
          </p>
        </div>

        <button 
          onClick={fetchData} 
          disabled={isLoading}
          className="p-3 border border-outline-variant rounded-xl hover:bg-surface-container text-on-surface-variant cursor-pointer transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-50"
          title="Atualizar dados"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Fluxo
        </button>
      </div>

      {/* Date Range Filters */}
      <div className="bg-surface-container-lowest rounded-[28px] border border-outline-variant p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Data Inicial
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Data Final
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 shadow-inner"
            />
          </div>

          <div className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-wider pb-3 italic sm:col-span-2 md:col-span-1">
            * Mostrando lançamentos consolidados no período selecionado.
          </div>

        </div>
      </div>

      {/* Period Consolidation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Entradas */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant shadow-sm flex flex-col justify-between"
        >
          <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Total Entradas
          </span>
          <div className="flex justify-between items-end mt-4">
            <span className="text-3xl font-black text-green-500">+{periodTotals.entradas.toFixed(1)}h</span>
            <span className="text-[10px] font-black uppercase text-green-500/70 bg-green-500/10 px-2.5 py-1 rounded-full">Créditos</span>
          </div>
        </motion.div>

        {/* Saídas */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant shadow-sm flex flex-col justify-between"
        >
          <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-error" />
            Total Saídas
          </span>
          <div className="flex justify-between items-end mt-4">
            <span className="text-3xl font-black text-error">-{periodTotals.saidas.toFixed(1)}h</span>
            <span className="text-[10px] font-black uppercase text-error/70 bg-error/10 px-2.5 py-1 rounded-full">Débitos</span>
          </div>
        </motion.div>

        {/* Saldo Líquido do Período */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`p-6 rounded-[24px] border shadow-sm flex flex-col justify-between ${
            periodTotals.saldo >= 0 
              ? 'bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20' 
              : 'bg-gradient-to-br from-error/5 to-transparent border-error/20'
          }`}
        >
          <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Saldo do Período</span>
          <div className="flex justify-between items-end mt-4">
            <span className={`text-3xl font-black ${periodTotals.saldo >= 0 ? 'text-green-600' : 'text-error'}`}>
              {periodTotals.saldo >= 0 ? '+' : ''}{periodTotals.saldo.toFixed(1)}h
            </span>
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
              periodTotals.saldo >= 0 ? 'text-green-600 bg-green-600/10' : 'text-error bg-error/10'
            }`}>
              {periodTotals.saldo >= 0 ? 'Superávit' : 'Déficit'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Daily Grouping Table */}
      <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[50px]"></th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Data</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Entradas (+h)</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Saídas (-h)</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Saldo do Dia</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[120px]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Carregando movimentações...</p>
                    </div>
                  </td>
                </tr>
              ) : dailyGroups.length > 0 ? (
                paginatedGroups.map((g) => {
                  const isExpanded = !!expandedDates[g.date];
                  const [year, month, day] = g.date.split('-');
                  const formattedDate = `${day}/${month}/${year}`;
                  
                  return (
                    <React.Fragment key={g.date}>
                      <tr 
                        onClick={() => toggleRow(g.date)}
                        className={`hover:bg-surface-container-low/30 transition-all cursor-pointer ${
                          isExpanded ? 'bg-surface-container-low/20' : ''
                        }`}
                      >
                        {/* Toggle expand icon */}
                        <td className="px-8 py-5 text-center">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-on-surface-variant" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-8 py-5">
                          <span className="font-black text-on-surface text-sm">{formattedDate}</span>
                        </td>

                        {/* Entradas */}
                        <td className="px-8 py-5 text-center font-bold text-green-500">
                          {g.entradas > 0 ? `+${g.entradas.toFixed(1)}h` : '0.0h'}
                        </td>

                        {/* Saídas */}
                        <td className="px-8 py-5 text-center font-bold text-error">
                          {g.saidas > 0 ? `-${g.saidas.toFixed(1)}h` : '0.0h'}
                        </td>

                        {/* Saldo */}
                        <td className={`px-8 py-5 text-center font-black text-sm ${
                          g.saldo >= 0 ? 'text-green-600' : 'text-error'
                        }`}>
                          {g.saldo >= 0 ? '+' : ''}{g.saldo.toFixed(1)}h
                        </td>

                        {/* Expand Details Button */}
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(g.date);
                            }}
                            className="px-3 py-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer text-[10px] font-black uppercase tracking-widest border border-outline-variant/40"
                          >
                            {isExpanded ? 'Ocultar' : 'Detalhar'}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable details container */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-surface-container-low/10 p-6 border-b border-outline-variant">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="rounded-[20px] border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-inner p-4 space-y-4">
                                <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5 border-b border-outline-variant/30 pb-3 pl-1">
                                  <FileText className="w-3.5 h-3.5 text-primary" />
                                  Movimentações em {formattedDate}
                                </h4>

                                <div className="divide-y divide-outline-variant/20">
                                  {g.records.map((record) => {
                                    const mil = getMilitarInfo(record.userId);
                                    return (
                                      <div 
                                        key={record.id}
                                        className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-surface-container-low/20 px-2 rounded-lg transition-colors"
                                      >
                                        {/* Military info and type */}
                                        <div className="flex items-center gap-3">
                                          <div className={`w-2 h-8 rounded-full shrink-0 ${
                                            record.type === TimeBankType.WORKED ? 'bg-blue-500' :
                                            record.type === TimeBankType.OVERTIME ? 'bg-green-500' : 'bg-error'
                                          }`} />
                                          <div>
                                            <p className="text-xs font-black text-on-surface uppercase">
                                              {mil.rank} {mil.name} <span className="text-[9px] font-bold text-on-surface-variant/60 lowercase tracking-normal pl-1">(RE: {mil.mil_number})</span>
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                record.type === TimeBankType.WORKED ? 'text-blue-500 bg-blue-500/10' :
                                                record.type === TimeBankType.OVERTIME ? 'text-green-500 bg-green-500/10' : 'text-error bg-error/10'
                                              }`}>
                                                {record.type === TimeBankType.WORKED ? 'Plantão Base' :
                                                 record.type === TimeBankType.OVERTIME ? 'Hora Extra' : 'Folga'}
                                              </span>
                                              <span className="text-[9px] font-bold text-on-surface-variant/70 italic max-w-sm truncate">
                                                {record.description || 'Sem justificativa cadastrada'}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Hours & Creator */}
                                        <div className="text-right self-end sm:self-center">
                                          <span className={`text-xs font-black block ${
                                            record.type === TimeBankType.TIME_OFF ? 'text-error' : 'text-on-surface'
                                          }`}>
                                            {record.type === TimeBankType.TIME_OFF ? '-' : '+'}{record.hours.toFixed(1)}h
                                          </span>
                                          <span className="text-[8px] font-black uppercase text-on-surface-variant/40 block mt-0.5">
                                            Por: {getCreatorInfo(record.createdBy)}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <HelpCircle className="w-16 h-16 mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Nenhuma movimentação registrada neste período</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-6 bg-surface-container-low/30 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-60">
              Exibindo {paginatedGroups.length} de {dailyGroups.length} dia{dailyGroups.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-black text-on-surface uppercase tracking-widest px-2">
                Pág. {currentPage} de {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
