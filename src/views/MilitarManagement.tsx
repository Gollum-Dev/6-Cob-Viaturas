import React, { useState, useMemo, Fragment } from 'react';
import { Users, UserPlus, Shield, Trash2, Award, Briefcase, Pencil, ChevronLeft, ChevronRight, Info, Phone, Calendar, Fingerprint, Contact } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function MilitarManagement() {
  const { registeredUsers, deleteUser } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [unitFilter, setUnitFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const roles = useMemo(() => {
    const r = new Set(registeredUsers.map(u => u.role).filter(Boolean));
    return ['Todos', ...Array.from(r)];
  }, [registeredUsers]);

  const units = useMemo(() => {
    const u = new Set(registeredUsers.map(u => u.unit).filter(Boolean));
    return ['Todos', ...Array.from(u)];
  }, [registeredUsers]);

  const filteredUsers = useMemo(() => {
    return registeredUsers.filter(u => {
      const matchQuery = 
        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.milNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.rank || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchRole = roleFilter === 'Todos' || u.role === roleFilter;
      const matchUnit = unitFilter === 'Todos' || u.unit === unitFilter;
      
      return matchQuery && matchRole && matchUnit;
    });
  }, [registeredUsers, searchQuery, roleFilter, unitFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, activePage, itemsPerPage]);

  const handleDelete = (id: string) => {
    deleteUser(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <Link 
          to="/militares/novo"
          className="bg-primary text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 group w-full md:w-auto"
        >
          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
          Cadastrar Militar
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant overflow-hidden shadow-sm">
        {/* Filtros e Pesquisa */}
        <div className="p-6 md:p-8 border-b border-outline-variant bg-surface-container-low/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 items-end w-full">
            {/* Campo Pesquisa */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px] w-full">
              <label className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest pl-1">Pesquisar Militar</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="NOME, POSTO/GRAD OU NÚMERO..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 pl-10 pr-4 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface placeholder:text-on-surface-variant/40"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant/60 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Filtro Unidade */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] w-full">
              <label className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest pl-1">Unidade</label>
              <div className="relative">
                <select 
                  value={unitFilter}
                  onChange={(e) => {
                    setUnitFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 pr-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest cursor-pointer appearance-none text-on-surface"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit === 'Todos' ? 'TODAS' : (unit || '').toUpperCase()}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant/60">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Filtro Nível de Acesso */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] w-full">
              <label className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest pl-1">Nível de Acesso</label>
              <div className="relative">
                <select 
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 pr-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest cursor-pointer appearance-none text-on-surface"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role === 'Todos' ? 'TODOS' : (role || '').toUpperCase()}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant/60">
                  <Shield className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
            
            {/* Limpar Filtros */}
            <button 
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('Todos');
                setUnitFilter('Todos');
                setCurrentPage(1);
              }}
              className="flex items-center justify-center gap-2 h-[42px] px-6 border border-outline hover:bg-surface-container rounded-xl text-on-surface-variant hover:text-primary font-black transition-all uppercase tracking-widest text-[10px] w-full lg:w-auto shrink-0 mt-2 lg:mt-0 cursor-pointer"
            >
              <Users className="w-3 h-3" />
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline-variant">Militar</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline-variant">Unidade</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline-variant">Nível de Acesso</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline-variant">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <Fragment key={user.id}>
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-surface-container-low/30 transition-colors group"
                    >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant shadow-inner group-hover:scale-105 transition-transform">
                          <Award className="w-6 h-6 text-primary/60" />
                        </div>
                        <div>
                          <p className="font-black text-on-surface uppercase tracking-tight leading-none">{user.rank} {user.name}</p>
                          <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mt-1">Nº {user.milNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">{user.unit || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black text-on-surface uppercase tracking-widest">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 relative">
                        {deletingId === user.id ? (
                          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                             <button 
                              onClick={() => handleDelete(user.id)}
                              className="px-4 py-2 bg-error text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                            >
                              Confirmar
                            </button>
                            <button 
                              onClick={() => setDeletingId(null)}
                              className="px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-highest transition-all"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              type="button"
                              onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                              className={`p-3 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center ${expandedUserId === user.id ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary hover:bg-primary/10'}`}
                              title="Ver Detalhes"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                            <Link 
                              to={`/militares/editar/${user.id}`}
                              className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                              title="Editar Militar"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeletingId(user.id);
                              }}
                              className="p-3 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                              title="Excluir Militar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                  {expandedUserId === user.id && (
                    <tr className="bg-surface-container-lowest">
                      <td colSpan={4} className="px-8 py-4 border-b border-outline-variant/30">
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-5 rounded-2xl bg-surface-container-low/40 border border-outline-variant/40"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-surface-container-high rounded-xl text-primary border border-outline-variant/60">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest leading-none">Nome Completo</p>
                              <p className="text-xs font-bold text-on-surface mt-1.5 truncate uppercase" title={user.fullName}>{user.fullName || 'Não Informado'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-surface-container-high rounded-xl text-primary border border-outline-variant/60">
                              <Phone className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest leading-none">Telefone</p>
                              <p className="text-xs font-bold text-on-surface mt-1.5">{user.phone || 'Não Informado'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-surface-container-high rounded-xl text-primary border border-outline-variant/60">
                              <Fingerprint className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest leading-none">CPF</p>
                              <p className="text-xs font-bold text-on-surface mt-1.5">{user.cpf || 'Não Informado'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-surface-container-high rounded-xl text-primary border border-outline-variant/60">
                              <Contact className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest leading-none">RG</p>
                              <p className="text-xs font-bold text-on-surface mt-1.5">{user.rg || 'Não Informado'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-surface-container-high rounded-xl text-primary border border-outline-variant/60">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest leading-none">Nascimento</p>
                              <p className="text-xs font-bold text-on-surface mt-1.5">
                                {user.birthDate ? (() => {
                                  const parts = user.birthDate.split('-');
                                  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                  return new Date(user.birthDate + 'T12:00:00').toLocaleDateString('pt-BR');
                                })() : 'Não Informado'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <Users className="w-16 h-16 mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Nenhum militar cadastrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-6">
          {filteredUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <div 
                key={user.id} 
                className="bg-surface-container-low/40 border border-outline-variant/60 rounded-2xl p-5 space-y-4 hover:border-primary/35 transition-all shadow-sm"
              >
                {/* Header: Avatar, Info, Actions */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant shadow-inner flex-shrink-0">
                      <Award className="w-5 h-5 text-primary/60" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-on-surface uppercase tracking-tight leading-none text-xs truncate">
                        {user.rank} {user.name}
                      </p>
                      <p className="text-[9px] font-bold text-on-surface-variant/70 uppercase tracking-widest mt-1">
                        Nº {user.milNumber}
                      </p>
                    </div>
                  </div>

                  {/* Actions in top-right */}
                  {deletingId !== user.id && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Link 
                        to={`/militares/editar/${user.id}`}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg border border-outline-variant/40 bg-surface-container-lowest transition-all"
                        title="Editar Militar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button 
                        onClick={() => setDeletingId(user.id)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg border border-outline-variant/40 bg-surface-container-lowest transition-all cursor-pointer"
                        title="Excluir Militar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-outline-variant/15">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Unidade</p>
                    <p className="text-[10px] font-black text-on-surface uppercase tracking-tight truncate">{user.unit || 'N/A'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Nível de Acesso</p>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-primary/70" />
                      <p className="text-[10px] font-black text-on-surface uppercase tracking-tight truncate">{user.role}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Expandable Block */}
                {expandedUserId === user.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-3 border-t border-outline-variant/10 text-left"
                  >
                    <div className="space-y-1 pb-2 border-b border-outline-variant/10">
                      <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest leading-none">Nome Completo</p>
                      <p className="text-[10px] font-bold text-on-surface mt-1.5 uppercase">{user.fullName || 'Não Informado'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest leading-none">Telefone</p>
                        <p className="text-[10px] font-bold text-on-surface mt-1">{user.phone || 'Não Informado'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest leading-none">CPF</p>
                        <p className="text-[10px] font-bold text-on-surface mt-1">{user.cpf || 'Não Informado'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest leading-none">RG</p>
                        <p className="text-[10px] font-bold text-on-surface mt-1">{user.rg || 'Não Informado'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest leading-none">Nascimento</p>
                        <p className="text-[10px] font-bold text-on-surface mt-1">
                          {user.birthDate ? (() => {
                            const parts = user.birthDate.split('-');
                            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                            return new Date(user.birthDate + 'T12:00:00').toLocaleDateString('pt-BR');
                          })() : 'Não Informado'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Mobile expand toggle button */}
                <div className="flex justify-center pt-2">
                  <button 
                    onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                    className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 py-1 px-3 bg-primary/5 hover:bg-primary/10 rounded-full transition-all cursor-pointer"
                  >
                    <Info className="w-3 h-3" />
                    {expandedUserId === user.id ? 'Esconder Detalhes' : 'Ver Detalhes'}
                  </button>
                </div>

                {/* Inline Confirmation when deleting */}
                {deletingId === user.id && (
                  <div className="flex flex-col gap-2 p-3 bg-error/5 border border-error/20 rounded-xl animate-in slide-in-from-bottom-2 duration-200">
                    <p className="text-[9px] font-black text-error uppercase tracking-widest text-center">Confirmar exclusão?</p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="flex-1 py-2 bg-error text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md cursor-pointer"
                      >
                        Excluir
                      </button>
                      <button 
                        onClick={() => setDeletingId(null)}
                        className="flex-1 py-2 bg-surface-container-high text-on-surface-variant rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-16 text-center opacity-30 bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/60">
              <Users className="w-12 h-12 mx-auto mb-3" />
              <p className="text-xs font-black uppercase tracking-widest">Nenhum militar encontrado</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-surface-container-low/30 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-60">
            Exibindo {paginatedUsers.length} de {filteredUsers.length} militares {filteredUsers.length !== registeredUsers.length && `(filtrados de ${registeredUsers.length})`}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={activePage === 1}
                className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-black text-on-surface uppercase tracking-widest px-2">
                Pág. {activePage} de {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={activePage === totalPages}
                className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
