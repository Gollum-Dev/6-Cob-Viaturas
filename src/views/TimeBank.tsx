import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Plus, Trash2, Award, Calendar, FileText, CheckCircle, ChevronLeft, ChevronRight, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, TimeBankType, TimeBankRecord } from '../types';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export default function TimeBank() {
  const { user, registeredUsers } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [records, setRecords] = useState<TimeBankRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Form State
  const [type, setType] = useState<TimeBankType>(TimeBankType.OVERTIME);
  const [hours, setHours] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Check if current user can manage time bank
  const isManager = useMemo(() => {
    return user && [UserRole.ADMINISTRADOR, UserRole.DESENVOLVEDOR, UserRole.CIA_OP, UserRole.CBU].includes(user.role);
  }, [user]);

  // Set initial selected user
  useEffect(() => {
    if (user) {
      if (isManager) {
        // Default to the first registered user or current user
        setSelectedUserId(user.id);
      } else {
        // Operational users can only view their own
        setSelectedUserId(user.id);
      }
    }
  }, [user, isManager]);

  // Fetch records whenever selected user changes
  const fetchRecords = async () => {
    if (!selectedUserId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_bank_records')
        .select('*')
        .eq('user_id', selectedUserId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching time bank records:', error);
      } else {
        // Map backend fields to frontend types
        const mappedRecords: TimeBankRecord[] = (data || []).map(r => ({
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
      }
    } catch (err) {
      console.error('Unexpected error fetching records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    setCurrentPage(1);
  }, [selectedUserId]);


  // Calculate balances
  const balances = useMemo(() => {
    let worked = 0;
    let overtime = 0;
    let timeOff = 0;

    records.forEach(r => {
      if (r.type === TimeBankType.WORKED) {
        worked += r.hours;
      } else if (r.type === TimeBankType.OVERTIME) {
        overtime += r.hours;
      } else if (r.type === TimeBankType.TIME_OFF) {
        timeOff += r.hours;
      }
    });

    const netBalance = worked + overtime - timeOff;

    return { worked, overtime, timeOff, netBalance };
  }, [records]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedHours = parseFloat(hours);
    if (isNaN(parsedHours) || parsedHours <= 0) {
      setFormError('Insira uma quantidade de horas válida maior que zero.');
      return;
    }

    if (!selectedUserId) {
      setFormError('Por favor, selecione um militar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('time_bank_records')
        .insert({
          user_id: selectedUserId,
          type,
          hours: parsedHours,
          date,
          description: description.trim() || null,
          created_by: user?.id
        });

      if (error) {
        setFormError(error.message);
      } else {
        // Clear form fields
        setHours('');
        setDescription('');
        // Refresh records
        fetchRecords();
      }
    } catch (err: any) {
      setFormError(err.message || 'Erro inesperado ao salvar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Record Deletion
  const handleDelete = async (recordId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este registro do banco de horas?')) return;

    try {
      const { error } = await supabase
        .from('time_bank_records')
        .delete()
        .eq('id', recordId);

      if (error) {
        alert('Erro ao deletar registro: ' + error.message);
      } else {
        fetchRecords();
      }
    } catch (err: any) {
      alert('Erro inesperado: ' + err.message);
    }
  };

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(records.length / itemsPerPage));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return records.slice(start, start + itemsPerPage);
  }, [records, currentPage]);

  // Helper to get creator's identifier
  const getCreatorInfo = (creatorId?: string) => {
    if (!creatorId) return 'Sistema';
    if (creatorId === user?.id) return 'Você';
    const found = registeredUsers.find(u => u.id === creatorId);
    return found ? `${found.rank} ${found.name}` : 'Militar';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header and Select Military (if Manager) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Folga / Hora Extra
          </h1>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">
            Controle e Gestão de Folgas e Horas Extras
          </p>
        </div>

        {isManager && (
          <div className="flex flex-col gap-1.5 min-w-[280px] w-full md:w-auto">
            <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Selecionar Militar</label>
            <div className="relative">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant p-3 pr-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest cursor-pointer appearance-none text-on-surface"
              >
                {registeredUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.rank} {u.name} ({u.milNumber}) - {u.unit}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant/60">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Balances Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Plantões */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl sm:rounded-[24px] border border-outline-variant shadow-sm flex flex-col justify-between"
        >
          <span className="text-[8px] sm:text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Plantões</span>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-2 sm:mt-4 gap-1.5 sm:gap-0">
            <span className="text-xl sm:text-3xl font-black text-blue-500 leading-none">+{balances.worked.toFixed(1)}h</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-blue-500/70 bg-blue-500/10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full inline-block">Trabalhadas</span>
          </div>
        </motion.div>

        {/* Extras */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl sm:rounded-[24px] border border-outline-variant shadow-sm flex flex-col justify-between"
        >
          <span className="text-[8px] sm:text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Horas Extras</span>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-2 sm:mt-4 gap-1.5 sm:gap-0">
            <span className="text-xl sm:text-3xl font-black text-green-500 leading-none">+{balances.overtime.toFixed(1)}h</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-green-500/70 bg-green-500/10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full inline-block">Crédito</span>
          </div>
        </motion.div>

        {/* Folgas */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl sm:rounded-[24px] border border-outline-variant shadow-sm flex flex-col justify-between"
        >
          <span className="text-[8px] sm:text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Folgas / Dispensa</span>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-2 sm:mt-4 gap-1.5 sm:gap-0">
            <span className="text-xl sm:text-3xl font-black text-error leading-none">-{balances.timeOff.toFixed(1)}h</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-error/70 bg-error/10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full inline-block">Débito</span>
          </div>
        </motion.div>

        {/* Saldo Líquido */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`p-4 sm:p-6 rounded-2xl sm:rounded-[24px] border shadow-sm flex flex-col justify-between ${
            balances.netBalance >= 0 
              ? 'bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20' 
              : 'bg-gradient-to-br from-error/5 to-transparent border-error/20'
          }`}
        >
          <span className="text-[8px] sm:text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Saldo Geral</span>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-2 sm:mt-4 gap-1.5 sm:gap-0">
            <span className={`text-xl sm:text-3xl font-black leading-none ${balances.netBalance >= 0 ? 'text-green-600' : 'text-error'}`}>
              {balances.netBalance >= 0 ? '+' : ''}{balances.netBalance.toFixed(1)}h
            </span>
            <span className={`text-[8px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full inline-block ${
              balances.netBalance >= 0 ? 'text-green-600 bg-green-600/10' : 'text-error bg-error/10'
            }`}>
              {balances.netBalance >= 0 ? 'Positivo' : 'Negativo'}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form to Add Entry (Visible to Managers) */}
        {isManager && (
          <div className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-[28px] border border-outline-variant shadow-sm h-fit">
            <h2 className="text-xs font-black text-on-surface uppercase tracking-widest mb-6 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Lançar Horas
            </h2>
            
            {formError && (
              <div className="mb-4 p-3.5 bg-error-container text-error rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Tipo de Lançamento</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Extra', value: TimeBankType.OVERTIME },
                    { label: 'Folga', value: TimeBankType.TIME_OFF }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setType(opt.value)}
                      className={`py-3 px-2 border rounded-xl text-[10px] font-black uppercase tracking-wider text-center cursor-pointer transition-all ${
                        type === opt.value 
                          ? 'border-primary bg-primary text-white shadow-lg shadow-primary/10' 
                          : 'bg-surface-container-low border-outline-variant hover:bg-surface-container'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Quantidade de Horas</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  placeholder="Ex: 8.5 ou 12"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 shadow-inner"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Data</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 shadow-inner"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Descrição / Justificativa</label>
                <textarea
                  placeholder="Descreva o motivo (Ex: Serviço Operacional de Escala, Recobrimento de Turno, etc.)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/50 shadow-inner resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Confirmar Lançamento'}
              </button>
            </form>
          </div>
        )}

        {/* History / Timeline List */}
        <div className={`${isManager ? 'lg:col-span-2' : 'lg:col-span-3'} bg-surface-container-lowest p-6 rounded-[28px] border border-outline-variant shadow-sm flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-black text-on-surface uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Histórico de Lançamentos
              </h2>
              <button 
                onClick={fetchRecords} 
                className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"
                title="Recarregar histórico"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Carregando registros...</p>
              </div>
            ) : records.length > 0 ? (
              <div className="space-y-4">
                {paginatedRecords.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-surface-container-low/40 border border-outline-variant/50 hover:border-outline transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* Badge / Colored Indicator */}
                      <div className={`w-2.5 h-12 rounded-full shrink-0 ${
                        record.type === TimeBankType.WORKED ? 'bg-blue-500' :
                        record.type === TimeBankType.OVERTIME ? 'bg-green-500' : 'bg-error'
                      }`} />

                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            record.type === TimeBankType.WORKED ? 'text-blue-500 bg-blue-500/10' :
                            record.type === TimeBankType.OVERTIME ? 'text-green-500 bg-green-500/10' : 'text-error bg-error/10'
                          }`}>
                            {record.type === TimeBankType.WORKED ? 'Trabalhada' :
                             record.type === TimeBankType.OVERTIME ? 'Hora Extra' : 'Folga'}
                          </span>
                          <span className="text-[10px] font-black text-on-surface-variant flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-on-surface-variant/60" />
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

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`text-sm font-black ${
                        record.type === TimeBankType.TIME_OFF ? 'text-error' : 'text-on-surface'
                      }`}>
                        {record.type === TimeBankType.TIME_OFF ? '-' : '+'}{record.hours.toFixed(1)}h
                      </span>
                      {isManager && (
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all cursor-pointer"
                          title="Remover lançamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center opacity-30 bg-surface-container-low/20 rounded-[20px] border border-dashed border-outline-variant/60">
                <Clock className="w-12 h-12 mx-auto mb-3" />
                <p className="text-xs font-black uppercase tracking-widest">Nenhum lançamento no banco de horas</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-outline-variant flex justify-between items-center gap-4 mt-6">
              <span className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">
                Exibindo {paginatedRecords.length} de {records.length} lançamentos
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-outline-variant rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-50 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-outline-variant rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-50 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
