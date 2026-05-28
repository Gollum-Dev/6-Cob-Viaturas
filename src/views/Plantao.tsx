import React, { useState, useEffect, useMemo } from 'react';
import { CalendarCheck, Search, Shield, Award, Users, RefreshCw, CheckCircle2, AlertCircle, Calendar, Plus, Filter, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, TimeBankType } from '../types';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface PlantaoUser {
  id: string;
  rank: string;
  name: string;
  mil_number: string;
  ala: string | null;
  unit: string;
  role: string;
}

export default function Plantao() {
  const { user } = useAuth();
  const [users, setUsers] = useState<PlantaoUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [alaFilter, setAlaFilter] = useState<string>('Todas');
  
  // Plantão states
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});
  const [overtimeHours, setOvertimeHours] = useState<{ [key: string]: string }>({});
  const [folgaHours, setFolgaHours] = useState<{ [key: string]: string }>({});
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch users in the same unit
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('users')
        .select('id, rank, name, mil_number, ala, unit, role')
        .order('rank', { ascending: true })
        .order('name', { ascending: true });

      // Filter by unit if not ADMINISTRADOR or DESENVOLVEDOR
      if (user && user.role !== UserRole.ADMINISTRADOR && user.role !== UserRole.DESENVOLVEDOR) {
        query = query.eq('unit', user.unit);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  // Filter and search users
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

  // Toggle user selection
  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Select all filtered users
  const handleSelectAllFiltered = () => {
    const updates: { [key: string]: boolean } = {};
    filteredUsers.forEach(u => {
      updates[u.id] = true;
    });
    setSelectedUsers(prev => ({ ...prev, ...updates }));
  };

  // Deselect all filtered users
  const handleDeselectAllFiltered = () => {
    const updates: { [key: string]: boolean } = {};
    filteredUsers.forEach(u => {
      updates[u.id] = false;
    });
    setSelectedUsers(prev => ({ ...prev, ...updates }));
  };

  // Submit Plantão
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const activeUserIds = Object.keys(selectedUsers).filter(id => selectedUsers[id]);
    
    if (activeUserIds.length === 0) {
      setStatusMessage({ text: 'Por favor, selecione pelo menos um militar que trabalhou no plantão.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const recordsToInsert: any[] = [];

      activeUserIds.forEach(userId => {
        // 1. Base Worked Hours (1.14h)
        recordsToInsert.push({
          user_id: userId,
          type: TimeBankType.WORKED, // 'TRABALHADA'
          hours: 1.14,
          date: date,
          description: 'Serviço de Plantão Operacional (Crédito Base)',
          created_by: user?.id
        });

        // 2. Overtime if specified
        const extraVal = parseFloat(overtimeHours[userId] || '0');
        if (!isNaN(extraVal) && extraVal > 0) {
          recordsToInsert.push({
            user_id: userId,
            type: TimeBankType.OVERTIME, // 'EXTRA'
            hours: extraVal,
            date: date,
            description: 'Hora Extra lançada em Plantão',
            created_by: user?.id
          });
        }

        // 3. Folgas if specified
        const folgaVal = parseFloat(folgaHours[userId] || '0');
        if (!isNaN(folgaVal) && folgaVal > 0) {
          recordsToInsert.push({
            user_id: userId,
            type: TimeBankType.TIME_OFF, // 'FOLGA'
            hours: folgaVal,
            date: date,
            description: 'Folga/Abate lançado em Plantão',
            created_by: user?.id
          });
        }
      });

      // Insert all records into Supabase in bulk
      const { error } = await supabase
        .from('time_bank_records')
        .insert(recordsToInsert);

      if (error) {
        console.error('Error inserting plantao records:', error);
        setStatusMessage({ text: `Erro ao salvar plantão: ${error.message}`, type: 'error' });
      } else {
        setStatusMessage({ text: `Plantão salvo com sucesso para ${activeUserIds.length} militar(es)!`, type: 'success' });
        // Clear selections and inputs
        setSelectedUsers({});
        setOvertimeHours({});
        setFolgaHours({});
        
        // Auto-clear success message
        setTimeout(() => {
          setStatusMessage(null);
        }, 5000);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: `Erro inesperado: ${err.message || err}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const alasList = ['1ALA', '2ALA', '3ALA', '4ALA', 'ADM', 'PPV'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-primary" />
            Lançamento de Plantão
          </h1>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">
            Lançamento em Lote de Presença em Escala e Crédito Base de 1.14h
          </p>
        </div>

        <button 
          onClick={fetchUsers} 
          disabled={isLoading}
          className="p-3 border border-outline-variant rounded-xl hover:bg-surface-container text-on-surface-variant cursor-pointer transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-50"
          title="Recarregar militares"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Lista
        </button>
      </div>

      {/* Success/Error Banner */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
              statusMessage.type === 'success' 
                ? 'bg-green-500/5 border-green-500/20 text-green-600' 
                : 'bg-error/5 border-error/20 text-error'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="text-xs font-black uppercase tracking-wider">{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Controls Block */}
        <div className="bg-surface-container-lowest rounded-[28px] border border-outline-variant p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Plantão Date */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Data do Plantão
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 shadow-inner"
              />
            </div>

            {/* Search Bar */}
            <div className="flex flex-col gap-1.5 w-full lg:col-span-2">
              <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Filtrar por Nome / Grad / RE</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 pl-11 pr-4 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface placeholder:text-on-surface-variant/40"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant/60 pointer-events-none">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Filter by Ala */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Filtrar por Ala</label>
              <div className="relative">
                <select 
                  value={alaFilter}
                  onChange={(e) => setAlaFilter(e.target.value)}
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

          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="px-4 py-2.5 bg-surface-container-high border border-outline-variant hover:bg-primary hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              Selecionar Filtrados
            </button>
            <button
              type="button"
              onClick={handleDeselectAllFiltered}
              className="px-4 py-2.5 bg-surface-container-high border border-outline-variant hover:bg-error hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              Limpar Filtrados
            </button>
          </div>
        </div>

        {/* Military List & Inputs Table */}
        <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant overflow-hidden shadow-sm">
          
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[80px]">Militar</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Identificação</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Ala</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[160px]">Lançamento Base</th>
                  <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[180px]">Hora Extra (+h)</th>
                  <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[180px]">Folga (-h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Carregando militares...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const isChecked = !!selectedUsers[u.id];
                    return (
                      <tr 
                        key={u.id} 
                        className={`transition-all group ${
                          isChecked ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-surface-container-low/30'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-8 py-5 text-center">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleUser(u.id)}
                            className="w-5 h-5 rounded-lg border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
                          />
                        </td>
                        
                        {/* Rank and Guerra */}
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
                                RE {u.mil_number}
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

                        {/* Automatic addition indicator */}
                        <td className="px-8 py-5">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${
                            isChecked ? 'text-green-600' : 'text-on-surface-variant/40'
                          }`}>
                            {isChecked ? '+1.14h Plantão' : '--'}
                          </span>
                        </td>

                        {/* Overtime input */}
                        <td className="px-8 py-5 text-center">
                          <input 
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="Extra (h)"
                            disabled={!isChecked}
                            value={overtimeHours[u.id] || ''}
                            onChange={(e) => setOvertimeHours(prev => ({ ...prev, [u.id]: e.target.value }))}
                            className={`w-28 text-center bg-surface-container-low border border-outline-variant p-2 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 transition-all ${
                              !isChecked ? 'opacity-30 cursor-not-allowed border-transparent bg-surface-container-lowest' : 'shadow-inner'
                            }`}
                          />
                        </td>

                        {/* Folga input */}
                        <td className="px-8 py-5 text-center">
                          <input 
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="Folga (h)"
                            disabled={!isChecked}
                            value={folgaHours[u.id] || ''}
                            onChange={(e) => setFolgaHours(prev => ({ ...prev, [u.id]: e.target.value }))}
                            className={`w-28 text-center bg-surface-container-low border border-outline-variant p-2 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 transition-all ${
                              !isChecked ? 'opacity-30 cursor-not-allowed border-transparent bg-surface-container-lowest' : 'shadow-inner'
                            }`}
                          />
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
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Carregando militares...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isChecked = !!selectedUsers[u.id];
                return (
                  <div 
                    key={u.id}
                    className={`border rounded-2xl p-5 space-y-4 transition-all shadow-sm ${
                      isChecked ? 'bg-primary/5 border-primary/30' : 'bg-surface-container-low/30 border-outline-variant/60'
                    }`}
                  >
                    
                    {/* Header: Checkbox, Name, RE */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleUser(u.id)}
                          className="w-5 h-5 rounded-lg border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                        <div>
                          <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/60">
                            {u.rank}
                          </span>
                          <p className="font-black text-on-surface uppercase tracking-tight text-xs mt-1 leading-none">
                            {u.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Número (RE)</p>
                        <p className="text-[10px] font-bold text-on-surface mt-0.5">{u.mil_number}</p>
                      </div>
                    </div>

                    {/* Ala & Base Worked Hours */}
                    <div className="flex justify-between items-center py-2 border-t border-b border-outline-variant/15 text-xs">
                      <div>
                        <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Ala</p>
                        <span className={`text-[9px] font-black uppercase tracking-wider block mt-0.5 ${
                          u.ala === '1ALA' ? 'text-blue-500' :
                          u.ala === '2ALA' ? 'text-green-500' :
                          u.ala === '3ALA' ? 'text-indigo-500' :
                          u.ala === '4ALA' ? 'text-cyan-500' :
                          u.ala === 'ADM' ? 'text-orange-500' :
                          u.ala === 'PPV' ? 'text-pink-500' : 'text-on-surface-variant/40'
                        }`}>
                          {u.ala || 'SEM ALA'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Base Plantão</p>
                        <span className={`font-black uppercase tracking-wider text-[9px] ${
                          isChecked ? 'text-green-600' : 'text-on-surface-variant/40'
                        }`}>
                          {isChecked ? '+1.14h' : '--'}
                        </span>
                      </div>
                    </div>

                    {/* Inputs */}
                    {isChecked && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Hora Extra (+h)</label>
                          <input 
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="0"
                            value={overtimeHours[u.id] || ''}
                            onChange={(e) => setOvertimeHours(prev => ({ ...prev, [u.id]: e.target.value }))}
                            className="w-full bg-surface-container-low border border-outline-variant p-2 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 shadow-inner"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Folga (-h)</label>
                          <input 
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="0"
                            value={folgaHours[u.id] || ''}
                            onChange={(e) => setFolgaHours(prev => ({ ...prev, [u.id]: e.target.value }))}
                            className="w-full bg-surface-container-low border border-outline-variant p-2 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 shadow-inner"
                          />
                        </div>
                      </div>
                    )}

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

        </div>

        {/* Floating Submit Summary Panel */}
        <div className="bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block opacity-70">Resumo do Lançamento</span>
            <span className="text-sm font-black text-on-surface uppercase tracking-tight mt-1 block">
              {Object.keys(selectedUsers).filter(id => selectedUsers[id]).length} militares selecionados para o plantão
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || Object.keys(selectedUsers).filter(id => selectedUsers[id]).length === 0}
            className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando Plantão...' : 'Salvar Plantão'}
          </button>
        </div>

      </form>

    </div>
  );
}
