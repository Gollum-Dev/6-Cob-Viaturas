import React, { useState, useEffect, useMemo } from 'react';
import { Eye, History, Search, Award, Users, RefreshCw, Clock, Filter, Calendar, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, TimeBankType, TimeBankRecord } from '../types';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface ConsultaUser {
  id: string;
  rank: string;
  name: string;
  mil_number: string;
  ala: string | null;
  unit: string;
  role: string;
}

interface UserBalance {
  worked: number;
  overtime: number;
  timeOff: number;
  netBalance: number;
}

export default function ConsultaHoras() {
  const { user, registeredUsers } = useAuth();
  const [users, setUsers] = useState<ConsultaUser[]>([]);
  const [balances, setBalances] = useState<{ [key: string]: UserBalance }>({});
  
  // Filters & State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [alaFilter, setAlaFilter] = useState<string>('Todas');

  // Pagination for main table
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modal audit state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [auditUser, setAuditUser] = useState<ConsultaUser | null>(null);
  const [auditRecords, setAuditRecords] = useState<TimeBankRecord[]>([]);
  const [isAuditLoading, setIsAuditLoading] = useState<boolean>(false);
  const [auditCurrentPage, setAuditCurrentPage] = useState<number>(1);
  const auditItemsPerPage = 5;

  // Fetch users and consolidated balances
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Users
      let usersQuery = supabase
        .from('users')
        .select('id, rank, name, mil_number, ala, unit, role')
        .order('rank', { ascending: true })
        .order('name', { ascending: true });

      if (user && user.role !== UserRole.ADMINISTRADOR && user.role !== UserRole.DESENVOLVEDOR) {
        usersQuery = usersQuery.eq('unit', user.unit);
      }

      const { data: usersData, error: usersError } = await usersQuery;
      if (usersError) throw usersError;
      
      // 2. Fetch Time Bank Records for consolidation
      const { data: recordsData, error: recordsError } = await supabase
        .from('time_bank_records')
        .select('user_id, type, hours');
      
      if (recordsError) throw recordsError;

      // 3. Aggregate Balances
      const aggregated: { [key: string]: UserBalance } = {};
      
      (usersData || []).forEach(u => {
        aggregated[u.id] = { worked: 0, overtime: 0, timeOff: 0, netBalance: 0 };
      });

      (recordsData || []).forEach(r => {
        const uid = r.user_id;
        const type = r.type;
        const hours = Number(r.hours);

        if (!aggregated[uid]) {
          aggregated[uid] = { worked: 0, overtime: 0, timeOff: 0, netBalance: 0 };
        }

        if (type === 'TRABALHADA') {
          aggregated[uid].worked += hours;
        } else if (type === 'EXTRA') {
          aggregated[uid].overtime += hours;
        } else if (type === 'FOLGA') {
          aggregated[uid].timeOff += hours;
        }
      });

      // Calculate net balances (worked + overtime - timeOff)
      Object.keys(aggregated).forEach(uid => {
        aggregated[uid].netBalance = aggregated[uid].worked + aggregated[uid].overtime - aggregated[uid].timeOff;
      });

      setUsers(usersData || []);
      setBalances(aggregated);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchQuery = 
        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.mil_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.rank || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchAla = true;
      if (alaFilter !== 'Todas') {
        if (alaFilter === 'Sem Ala') {
          matchAla = u.ala === null || u.ala === '';
        } else {
          matchAla = u.ala === alaFilter;
        }
      }

      return matchQuery && matchAla;
    });
  }, [users, searchQuery, alaFilter]);

  // Main Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Open audit modal and fetch history
  const handleOpenAudit = async (targetUser: ConsultaUser) => {
    setAuditUser(targetUser);
    setIsModalOpen(true);
    setAuditRecords([]);
    setAuditCurrentPage(1);
    setIsAuditLoading(true);

    try {
      const { data, error } = await supabase
        .from('time_bank_records')
        .select('*')
        .eq('user_id', targetUser.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: TimeBankRecord[] = (data || []).map(r => ({
        id: r.id,
        userId: r.user_id,
        type: r.type as TimeBankType,
        hours: Number(r.hours),
        date: r.date,
        description: r.description,
        createdAt: r.created_at,
        createdBy: r.created_by
      }));
      setAuditRecords(mapped);
    } catch (err) {
      console.error('Error fetching audit trail:', err);
    } finally {
      setIsAuditLoading(false);
    }
  };

  // Helper to get creator info
  const getCreatorInfo = (creatorId?: string) => {
    if (!creatorId) return 'Sistema';
    if (creatorId === user?.id) return 'Você';
    const found = registeredUsers.find(u => u.id === creatorId);
    return found ? `${found.rank} ${found.name}` : 'Militar';
  };

  // Audit Pagination
  const auditTotalPages = Math.max(1, Math.ceil(auditRecords.length / auditItemsPerPage));
  const paginatedAudit = useMemo(() => {
    const start = (auditCurrentPage - 1) * auditItemsPerPage;
    return auditRecords.slice(start, start + auditItemsPerPage);
  }, [auditRecords, auditCurrentPage]);

  const alasList = ['1ALA', '2ALA', '3ALA', '4ALA', 'ADM', 'PPV'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Consulta de Horas
          </h1>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">
            Consulta Geral de Saldos e Rastreamento/Auditoria de Lançamentos
          </p>
        </div>

        <button 
          onClick={fetchData} 
          disabled={isLoading}
          className="p-3 border border-outline-variant rounded-xl hover:bg-surface-container text-on-surface-variant cursor-pointer transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-50"
          title="Recarregar dados"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Saldos
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-[28px] border border-outline-variant p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          
          {/* Search */}
          <div className="md:col-span-2 flex flex-col gap-1.5 w-full">
            <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Buscar Militar</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-surface-container-low border border-outline-variant p-3.5 pl-11 pr-4 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface placeholder:text-on-surface-variant/40"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant/60 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Ala */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Filtrar por Ala</label>
            <div className="relative">
              <select 
                value={alaFilter}
                onChange={(e) => {
                  setAlaFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-surface-container-low border border-outline-variant p-3.5 pr-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest cursor-pointer appearance-none text-on-surface"
              >
                <option value="Todas">TODAS AS ALAS</option>
                {alasList.map(ala => (
                  <option key={ala} value={ala}>{ala}</option>
                ))}
                <option value="Sem Ala">SEM ALA DEFINIDA</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-on-surface-variant/60">
                <Filter className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Table */}
      <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant overflow-hidden shadow-sm">
        
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Militar</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Ala</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[120px]">Plantões</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[120px]">Horas Extras</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[120px]">Folgas</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[120px]">Saldo Geral</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[120px]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Carregando saldos...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                paginatedUsers.map((u) => {
                  const bal = balances[u.id] || { worked: 0, overtime: 0, timeOff: 0, netBalance: 0 };
                  return (
                    <tr key={u.id} className="hover:bg-surface-container-low/30 transition-all">
                      
                      {/* Name RE Rank */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-2.5 py-1.5 rounded-lg border border-outline-variant/60 shrink-0">
                            {u.rank}
                          </span>
                          <div>
                            <p className="font-black text-on-surface uppercase tracking-tight text-sm leading-none">
                              {u.name}
                            </p>
                            <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">
                              RE {u.mil_number} • {u.unit}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Ala */}
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                          u.ala === '1ALA' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                          u.ala === '2ALA' ? 'text-green-500 bg-green-500/10 border-green-500/20' :
                          u.ala === '3ALA' ? 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' :
                          u.ala === '4ALA' ? 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' :
                          u.ala === 'ADM' ? 'text-orange-500 bg-orange-500/10 border-orange-500/20' :
                          u.ala === 'PPV' ? 'text-pink-500 bg-pink-500/10 border-pink-500/20' :
                          'text-on-surface-variant/40 bg-surface-container-low border-outline-variant/30'
                        }`}>
                          {u.ala || 'SEM ALA'}
                        </span>
                      </td>

                      {/* Plantões */}
                      <td className="px-8 py-5 text-center font-bold text-blue-500">
                        {bal.worked > 0 ? `+${bal.worked.toFixed(1)}h` : '0.0h'}
                      </td>

                      {/* Extras */}
                      <td className="px-8 py-5 text-center font-bold text-green-500">
                        {bal.overtime > 0 ? `+${bal.overtime.toFixed(1)}h` : '0.0h'}
                      </td>

                      {/* Folgas */}
                      <td className="px-8 py-5 text-center font-bold text-error">
                        {bal.timeOff > 0 ? `-${bal.timeOff.toFixed(1)}h` : '0.0h'}
                      </td>

                      {/* Saldo Geral */}
                      <td className={`px-8 py-5 text-center font-black text-sm ${
                        bal.netBalance >= 0 ? 'text-green-600' : 'text-error'
                      }`}>
                        {bal.netBalance >= 0 ? '+' : ''}{bal.netBalance.toFixed(1)}h
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => handleOpenAudit(u)}
                          className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border border-outline-variant/40 hover:border-primary/20"
                          title="Rastrear histórico completo"
                        >
                          <History className="w-4 h-4" />
                          Rastrear
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <Users className="w-16 h-16 mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Nenhum militar encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Carregando saldos...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            paginatedUsers.map((u) => {
              const bal = balances[u.id] || { worked: 0, overtime: 0, timeOff: 0, netBalance: 0 };
              return (
                <div 
                  key={u.id}
                  className="bg-surface-container-low/30 border border-outline-variant/60 rounded-2xl p-5 space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/60">
                        {u.rank}
                      </span>
                      <p className="font-black text-on-surface uppercase tracking-tight text-xs mt-1.5 leading-none">
                        {u.name}
                      </p>
                      <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">
                        RE {u.mil_number}
                      </p>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                      u.ala === '1ALA' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                      u.ala === '2ALA' ? 'text-green-500 bg-green-500/10 border-green-500/20' :
                      u.ala === '3ALA' ? 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' :
                      u.ala === '4ALA' ? 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' :
                      u.ala === 'ADM' ? 'text-orange-500 bg-orange-500/10 border-orange-500/20' :
                      u.ala === 'PPV' ? 'text-pink-500 bg-pink-500/10 border-pink-500/20' :
                      'text-on-surface-variant/40 bg-surface-container-low border-outline-variant/30'
                    }`}>
                      {u.ala || 'SEM ALA'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 py-2.5 border-t border-b border-outline-variant/15 text-center text-xs">
                    <div>
                      <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Plantão</p>
                      <p className="font-bold text-blue-500 mt-0.5">+{bal.worked.toFixed(1)}h</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Extras</p>
                      <p className="font-bold text-green-500 mt-0.5">+{bal.overtime.toFixed(1)}h</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Folgas</p>
                      <p className="font-bold text-error mt-0.5">-{bal.timeOff.toFixed(1)}h</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Saldo</p>
                      <p className={`font-black mt-0.5 ${bal.netBalance >= 0 ? 'text-green-600' : 'text-error'}`}>
                        {bal.netBalance >= 0 ? '+' : ''}{bal.netBalance.toFixed(1)}h
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleOpenAudit(u)}
                      className="w-full py-2 bg-surface-container-high hover:bg-primary/10 border border-outline-variant/40 rounded-xl text-[9px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5" />
                      Rastrear Histórico
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center opacity-30 bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/60">
              <Users className="w-12 h-12 mx-auto mb-3" />
              <p className="text-xs font-black uppercase tracking-widest">Nenhum militar encontrado</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-6 bg-surface-container-low/30 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-60">
              Exibindo {paginatedUsers.length} de {filteredUsers.length} militar{filteredUsers.length !== 1 ? 'es' : ''}
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

      {/* Audit Modal (Overlay) */}
      <AnimatePresence>
        {isModalOpen && auditUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glassmorphism background */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0c1013]/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-surface-container-lowest border border-outline-variant/60 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              
              {/* Modal Header */}
              <div className="p-6 md:p-8 bg-surface-container-low/50 border-b border-outline-variant flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                      Rastreamento de Lançamentos
                    </h2>
                    <p className="text-[9px] font-bold text-on-surface-variant/80 uppercase tracking-widest mt-0.5">
                      {auditUser.rank} {auditUser.name} ({auditUser.mil_number}) • {auditUser.unit}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                
                {isAuditLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Consultando registros...</p>
                  </div>
                ) : auditRecords.length > 0 ? (
                  <div className="space-y-4">
                    {paginatedAudit.map((record) => (
                      <div
                        key={record.id}
                        className="p-4 rounded-2xl bg-surface-container-low/30 border border-outline-variant/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="flex items-center gap-3">
                          {/* Colored shift indicator */}
                          <div className={`w-2 h-10 rounded-full shrink-0 ${
                            record.type === TimeBankType.WORKED ? 'bg-blue-500' :
                            record.type === TimeBankType.OVERTIME ? 'bg-green-500' : 'bg-error'
                          }`} />

                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <span className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                record.type === TimeBankType.WORKED ? 'text-blue-500 bg-blue-500/10' :
                                record.type === TimeBankType.OVERTIME ? 'text-green-500 bg-green-500/10' : 'text-error bg-error/10'
                              }`}>
                                {record.type === TimeBankType.WORKED ? 'Plantão Base' :
                                 record.type === TimeBankType.OVERTIME ? 'Hora Extra' : 'Folga'}
                              </span>
                              <span className="text-[9px] font-bold text-on-surface-variant/80 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-on-surface-variant/50" />
                                {(() => {
                                  const [year, month, day] = record.date.split('-');
                                  return `${day}/${month}/${year}`;
                                })()}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-on-surface mt-1.5 leading-snug">
                              {record.description || <span className="opacity-40 italic font-medium">Sem descrição cadastrada</span>}
                            </p>
                            <p className="text-[8px] font-black uppercase text-on-surface-variant/50 tracking-widest mt-1">
                              Lançado por: {getCreatorInfo(record.createdBy)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={`text-xs font-black ${
                            record.type === TimeBankType.TIME_OFF ? 'text-error' : 'text-on-surface'
                          }`}>
                            {record.type === TimeBankType.TIME_OFF ? '-' : '+'}{record.hours.toFixed(2)}h
                          </span>
                          <span className="text-[8px] font-bold text-on-surface-variant/40 block mt-1 uppercase">
                            {new Date(record.createdAt).toLocaleDateString('pt-BR')} às {new Date(record.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center opacity-30 bg-surface-container-low/20 rounded-[20px] border border-dashed border-outline-variant/60">
                    <Clock className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-xs font-black uppercase tracking-widest">Nenhum lançamento registrado</p>
                  </div>
                )}
              </div>

              {/* Modal Pagination Footer */}
              {!isAuditLoading && auditTotalPages > 1 && (
                <div className="p-6 bg-surface-container-low/30 border-t border-outline-variant flex justify-between items-center shrink-0">
                  <span className="text-[9px] font-black uppercase text-on-surface-variant opacity-60">
                    Total: {auditRecords.length} lançamentos
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAuditCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={auditCurrentPage === 1}
                      className="p-1.5 border border-outline-variant rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[9px] font-black text-on-surface uppercase tracking-widest px-1">
                      {auditCurrentPage} / {auditTotalPages}
                    </span>
                    <button
                      onClick={() => setAuditCurrentPage(prev => Math.min(auditTotalPages, prev + 1))}
                      disabled={auditCurrentPage === auditTotalPages}
                      className="p-1.5 border border-outline-variant rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
