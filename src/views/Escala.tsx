import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Search, Shield, Award, Users, RefreshCw, CheckCircle2, AlertCircle, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface EscalaUser {
  id: string;
  rank: string;
  name: string;
  mil_number: string;
  ala: string | null;
  unit: string;
  role: string;
}

export default function Escala() {
  const { user } = useAuth();
  const [users, setUsers] = useState<EscalaUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [alaFilter, setAlaFilter] = useState<string>('Todas');
  
  // Status feedback state
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Check if current user is manager (can change ALAs)
  const isManager = useMemo(() => {
    return user && [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR, UserRole.CIA_OP, UserRole.CBU].includes(user.role);
  }, [user]);

  // Fetch users and their ALAs
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('users')
        .select('id, rank, name, mil_number, ala, unit, role')
        .order('rank', { ascending: true })
        .order('name', { ascending: true });

      // If not ADMINISTRADOR and not DESENVOLVEDOR, filter by their own unit
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
      console.error('Unexpected error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  // Handle ALA change
  const handleAlaChange = async (userId: string, newAla: string) => {
    setUpdatingUserId(userId);
    setStatusMessage(null);

    const alaValue = newAla === '' ? null : newAla;

    try {
      const { error } = await supabase
        .from('users')
        .update({ ala: alaValue })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user ala:', error);
        setStatusMessage({ text: 'Erro ao atualizar a ala. Tente novamente.', type: 'error' });
      } else {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(u => u.id === userId ? { ...u, ala: alaValue } : u)
        );
        setStatusMessage({ text: 'Escala atualizada com sucesso!', type: 'success' });
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: 'Erro inesperado.', type: 'error' });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter and Search logic
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

  const alasList = ['1ALA', '2ALA', '3ALA', '4ALA', 'ADM', 'PPV'];

  const getAlaColorClass = (ala: string | null) => {
    if (!ala) return 'text-on-surface-variant/50 border-outline-variant/40 bg-surface-container-low';
    switch (ala) {
      case '1ALA':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case '2ALA':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case '3ALA':
        return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case '4ALA':
        return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      case 'ADM':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'PPV':
        return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
      default:
        return 'text-on-surface-variant/50 border-outline-variant/40 bg-surface-container-low';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Escala Operacional
          </h1>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">
            Distribuição de Militares por Ala e Setor de Trabalho
          </p>
        </div>

        <button 
          onClick={fetchUsers} 
          disabled={isLoading}
          className="p-3 border border-outline-variant rounded-xl hover:bg-surface-container text-on-surface-variant cursor-pointer transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-50"
          title="Recarregar dados"
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

      {/* Filters and Search */}
      <div className="bg-surface-container-lowest rounded-[28px] border border-outline-variant p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          
          {/* Search Field */}
          <div className="md:col-span-2 flex flex-col gap-1.5 w-full">
            <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Buscar Militar</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Pesquisar por nome, graduação ou RE..."
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
      </div>

      {/* Main Table view */}
      <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant overflow-hidden shadow-sm">
        
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Posto/Grad</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Nome de Guerra</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Número (RE)</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant">Unidade</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] border-b border-outline-variant w-[200px]">Escala / Ala</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Carregando militares...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/30 transition-all group">
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/60">
                        {u.rank || 'Militar'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-black text-on-surface uppercase tracking-tight text-sm">
                        {u.name}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-on-surface-variant/60 tracking-wider">
                        {u.mil_number}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-on-surface-variant/80 uppercase">
                        {u.unit}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {updatingUserId === u.id && (
                          <div className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin mr-2" />
                        )}
                        <select
                          value={u.ala || ''}
                          disabled={!isManager || updatingUserId === u.id}
                          onChange={(e) => handleAlaChange(u.id, e.target.value)}
                          className={`w-full max-w-[150px] bg-surface-container-low border p-2.5 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer text-center appearance-none focus:outline-none focus:border-primary transition-all ${
                            !isManager 
                              ? 'border-transparent text-primary cursor-default' 
                              : 'border-outline-variant hover:bg-surface-container'
                          } ${getAlaColorClass(u.ala)}`}
                        >
                          <option value="">NÃO DEFINIDA</option>
                          {alasList.map(ala => (
                            <option key={ala} value={ala}>{ala}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
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
            filteredUsers.map((u) => (
              <div 
                key={u.id}
                className="bg-surface-container-low/30 border border-outline-variant/60 rounded-2xl p-5 space-y-4 hover:border-primary/30 transition-all shadow-sm"
              >
                {/* Header: Name and Rank */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                      {u.rank || 'Militar'}
                    </span>
                    <p className="font-black text-on-surface uppercase tracking-tight text-sm mt-1.5">
                      {u.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest">Número (RE)</p>
                    <p className="text-xs font-bold text-on-surface mt-0.5">{u.mil_number}</p>
                  </div>
                </div>

                {/* Info & Ala Selector */}
                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                  <div>
                    <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Unidade</p>
                    <p className="text-[10px] font-black text-on-surface uppercase tracking-tight">{u.unit}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {updatingUserId === u.id && (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    )}
                    <select
                      value={u.ala || ''}
                      disabled={!isManager || updatingUserId === u.id}
                      onChange={(e) => handleAlaChange(u.id, e.target.value)}
                      className={`bg-surface-container-low border p-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-center focus:outline-none transition-all ${
                        !isManager 
                          ? 'border-transparent text-primary cursor-default' 
                          : 'border-outline-variant hover:bg-surface-container'
                      } ${getAlaColorClass(u.ala)}`}
                    >
                      <option value="">SEM ALA</option>
                      {alasList.map(ala => (
                        <option key={ala} value={ala}>{ala}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center opacity-30 bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/60">
              <Users className="w-12 h-12 mx-auto mb-3" />
              <p className="text-xs font-black uppercase tracking-widest">Nenhum militar encontrado</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        {!isLoading && (
          <div className="p-6 bg-surface-container-low/30 border-t border-outline-variant flex justify-between items-center">
            <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-60">
              Total: {filteredUsers.length} militar{filteredUsers.length !== 1 ? 'es' : ''} exibido{filteredUsers.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
