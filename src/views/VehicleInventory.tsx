import React, { useState, useMemo } from 'react';
import { Filter, Plus, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Car, X, Radio, DollarSign, Disc, Settings, FileText, Calendar, Hash, Zap, Shield, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { useAuth } from '../context/AuthContext';
import { VehicleStatus, UserRole, Vehicle } from '../types';
import { cn } from '../lib/utils';

export default function VehicleInventory() {
  const navigate = useNavigate();
  const { vehicles, deleteVehicle, updateVehicle } = useVehicles();
  const { user } = useAuth();

  const isCBU = user?.role === UserRole.CBU;

  const [typeFilter, setTypeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [unitFilter, setUnitFilter] = useState('Todos');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Inline odometer editing state
  const [editingOdometerId, setEditingOdometerId] = useState<string | null>(null);
  const [tempOdometer, setTempOdometer] = useState<string>('');
  const [isSavingOdometer, setIsSavingOdometer] = useState<boolean>(false);

  const handleStartEditOdometer = (v: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOdometerId(v.id);
    setTempOdometer(v.odometer.toString());
  };

  const handleSaveOdometer = async (v: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOdometer = parseInt(tempOdometer, 10);
    if (isNaN(newOdometer) || newOdometer < 0) {
      alert('Por favor, insira um valor válido de quilometragem.');
      return;
    }

    setIsSavingOdometer(true);
    try {
      await updateVehicle(v.id, { odometer: newOdometer });
      setEditingOdometerId(null);
    } catch (err: any) {
      alert('Erro ao atualizar odômetro: ' + (err.message || err));
    } finally {
      setIsSavingOdometer(false);
    }
  };

  const handleCancelEditOdometer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOdometerId(null);
  };

  const getStatusInfo = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return { label: 'Disponível', color: 'bg-green-100 text-green-700' };
      case VehicleStatus.DOWN:
        return { label: 'Baixada', color: 'bg-amber-100 text-amber-700' };
      case VehicleStatus.DISCHARGE_PROCESS:
        return { label: 'P. Descarga', color: 'bg-orange-100 text-orange-700' };
      case VehicleStatus.DISCHARGE_AVAILABLE:
        return { label: 'Disp. Descarga', color: 'bg-red-100 text-red-700' };
      default:
        return { label: 'Desconhecido', color: 'bg-surface-container text-on-surface' };
    }
  };

  const vehicleTypes = useMemo(() => {
    const types = new Set(vehicles.map(v => v.type));
    return ['Todos', ...Array.from(types)];
  }, [vehicles]);

  const units = useMemo(() => {
    const u = new Set(vehicles.map(v => v.unit));
    return ['Todos', ...Array.from(u)];
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchType = typeFilter === 'Todos' || v.type === typeFilter;
      const matchStatus = statusFilter === 'Todos' || v.status === statusFilter;
      const matchUnit = unitFilter === 'Todos' || v.unit === unitFilter;
      return matchType && matchStatus && matchUnit;
    });
  }, [vehicles, typeFilter, statusFilter, unitFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {!isCBU && (
        <div className="flex justify-end">
          <Link 
            to="/viaturas/novo" 
            className="bg-primary text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-primary/20 uppercase tracking-widest text-[10px] sm:text-xs group w-full md:w-auto"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
            Adicionar Nova Viatura
          </Link>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-outline-variant bg-surface-container-low/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-4 items-end w-full">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] w-full">
              <label className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest pl-1">Tipo</label>
              <div className="relative">
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 pr-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest cursor-pointer appearance-none text-on-surface"
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type === 'Todos' ? 'TODOS' : (type || '').toUpperCase()}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant/60">
                  <Filter className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] w-full">
              <label className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest pl-1">Unidade</label>
              <div className="relative">
                <select 
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 pr-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest cursor-pointer appearance-none text-on-surface"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit === 'Todos' ? 'TODAS' : (unit || '').toUpperCase()}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant/60">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] w-full">
              <label className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest pl-1">Status</label>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 pr-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest cursor-pointer appearance-none text-on-surface"
                >
                    <option value="Todos">TODOS</option>
                    <option value={VehicleStatus.AVAILABLE}>DISPONÍVEL</option>
                    <option value={VehicleStatus.DOWN}>BAIXADA</option>
                    <option value={VehicleStatus.DISCHARGE_PROCESS}>P. DESCARGA</option>
                    <option value={VehicleStatus.DISCHARGE_AVAILABLE}>DISP. DESCARGA</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant/60">
                  <Settings className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setTypeFilter('Todos');
                setStatusFilter('Todos');
                setUnitFilter('Todos');
              }}
              className="flex items-center justify-center gap-2 h-[42px] px-6 border border-outline hover:bg-surface-container rounded-xl text-on-surface-variant hover:text-primary font-black transition-all uppercase tracking-widest text-[10px] w-full md:w-auto shrink-0 mt-2 md:mt-0"
            >
              <Filter className="w-3 h-3" />
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline-variant">
              <tr>
                <th className="px-4 py-5 min-w-[160px]">Prefixo</th>
                <th className="px-4 py-5">Placa</th>
                <th className="px-4 py-5 min-w-[140px]">Unidade</th>
                <th className="px-4 py-5">Tipo</th>
                <th className="px-4 py-5 text-center">Status</th>
                <th className="px-4 py-5">Odômetro</th>
                <th className="px-4 py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredVehicles.map((v) => {
                const statusInfo = getStatusInfo(v.status);
                return (
                  <tr 
                    key={v.id} 
                    onClick={() => setSelectedVehicle(v)}
                    className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-6 min-w-[160px]">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-outline-variant overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                            {v.imageUrl ? (
                              <img src={v.imageUrl} alt={v.prefix} className="w-full h-full object-cover" />
                            ) : (
                              <Car className="w-6 h-6 text-primary/60 opacity-50" />
                            )}
                          </div>
                          <div>
                            <span className="font-black text-on-surface tracking-tight uppercase leading-none block">{v.prefix}</span>
                            {v.model && (
                              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wide opacity-60 block mt-0.5">{v.model}</span>
                            )}
                          </div>
                       </div>
                    </td>
                    <td className="px-4 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      {v.plate}
                    </td>
                    <td className="px-4 py-6 min-w-[140px]">
                       <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-70">
                          {v.unit}
                       </span>
                    </td>
                    <td className="px-4 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-70 line-clamp-1">
                        {v.type}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <span className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap", statusInfo.color)}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-6" onClick={(e) => e.stopPropagation()}>
                      {editingOdometerId === v.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={tempOdometer}
                            onChange={(e) => setTempOdometer(e.target.value.replace(/\D/g, ''))}
                            className="w-20 bg-surface-container-low border border-outline-variant p-1.5 rounded-lg text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface text-center"
                            disabled={isSavingOdometer}
                          />
                          <button
                            onClick={(e) => handleSaveOdometer(v, e)}
                            disabled={isSavingOdometer}
                            className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[10px] font-black uppercase cursor-pointer"
                            title="Salvar"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEditOdometer}
                            disabled={isSavingOdometer}
                            className="p-1.5 bg-error hover:bg-error-container text-white rounded-lg text-[10px] font-black uppercase cursor-pointer"
                            title="Cancelar"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center gap-1.5 group/odo cursor-pointer hover:bg-surface-container-low/40 p-1 px-2 rounded-lg -ml-2 w-fit transition-colors"
                          onClick={(e) => {
                            if (!isCBU) {
                              handleStartEditOdometer(v, e);
                            }
                          }}
                          title={!isCBU ? "Clique para editar o odômetro" : undefined}
                        >
                          <div className="flex items-baseline gap-0.5">
                            <span className="font-black text-on-surface tracking-tight">{v.odometer.toLocaleString()}</span>
                            <span className="text-[8px] font-black text-on-surface-variant uppercase opacity-55">KM</span>
                          </div>
                          {!isCBU && (
                            <Edit className="w-3.5 h-3.5 text-on-surface-variant/40 group-hover/odo:text-primary transition-colors opacity-0 group-hover/odo:opacity-100" />
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-1">
                          <button 
                            onClick={() => setSelectedVehicle(v)}
                            className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all" 
                            title="Visualizar Ficha Técnica"
                          >
                              <Eye className="w-4 h-4" />
                          </button>
                          {!isCBU && (
                            <>
                              <button 
                                onClick={() => navigate(`/viaturas/editar/${v.id}`)}
                                className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all" 
                                title="Editar"
                              >
                                  <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`Deseja realmente remover a viatura ${v.prefix}?`)) {
                                    deleteVehicle(v.id);
                                  }
                                }}
                                className="p-2.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all" 
                                title="Remover"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-6">
          {filteredVehicles.map((v) => {
            const statusInfo = getStatusInfo(v.status);
            return (
              <div 
                key={v.id} 
                onClick={() => setSelectedVehicle(v)}
                className="bg-surface-container-low/40 border border-outline-variant/60 rounded-2xl p-5 space-y-4 hover:border-primary/35 transition-all shadow-sm cursor-pointer"
              >
                {/* Header: Vehicle Image/Prefix & Actions */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.prefix} className="w-full h-full object-cover" />
                      ) : (
                        <Car className="w-5 h-5 text-primary/60 opacity-55" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-black text-on-surface uppercase tracking-tight leading-none truncate">
                        {v.prefix}
                      </h2>
                      {v.model && (
                        <p className="text-[9px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mt-1 truncate">
                          {v.model}
                        </p>
                      )}
                      <p className="text-[9px] font-bold text-on-surface-variant/70 uppercase tracking-widest mt-0.5">
                        Placa: {v.plate}
                      </p>
                    </div>
                  </div>

                  {/* Actions in top-right */}
                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setSelectedVehicle(v)}
                      className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg border border-outline-variant/40 bg-surface-container-lowest transition-all"
                      title="Visualizar Ficha Técnica"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {!isCBU && (
                      <>
                        <button 
                          onClick={() => navigate(`/viaturas/editar/${v.id}`)}
                          className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg border border-outline-variant/40 bg-surface-container-lowest transition-all"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Deseja realmente remover a viatura ${v.prefix}?`)) {
                              deleteVehicle(v.id);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg border border-outline-variant/40 bg-surface-container-lowest transition-all cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-outline-variant/15">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Unidade</p>
                    <p className="text-[10px] font-black text-on-surface uppercase tracking-tight truncate">{v.unit}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Tipo</p>
                    <p className="text-[10px] font-black text-on-surface uppercase tracking-tight truncate">{v.type}</p>
                  </div>
                  <div className="space-y-0.5" onClick={(e) => e.stopPropagation()}>
                    <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Odômetro</p>
                    {editingOdometerId === v.id ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          value={tempOdometer}
                          onChange={(e) => setTempOdometer(e.target.value.replace(/\D/g, ''))}
                          className="w-16 bg-surface-container-low border border-outline-variant p-1 rounded-lg text-[10px] font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase text-on-surface text-center"
                          disabled={isSavingOdometer}
                        />
                        <button
                          onClick={(e) => handleSaveOdometer(v, e)}
                          disabled={isSavingOdometer}
                          className="p-1 bg-green-500 hover:bg-green-600 text-white rounded text-[8px] font-black cursor-pointer"
                          title="Salvar"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEditOdometer}
                          disabled={isSavingOdometer}
                          className="p-1 bg-error hover:bg-error-container text-white rounded text-[8px] font-black cursor-pointer"
                          title="Cancelar"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="flex items-center gap-1 cursor-pointer hover:bg-surface-container-low/40 rounded -ml-1 p-0.5 w-fit transition-colors"
                        onClick={(e) => {
                          if (!isCBU) {
                            handleStartEditOdometer(v, e);
                          }
                        }}
                        title={!isCBU ? "Clique para editar o odômetro" : undefined}
                      >
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[10px] font-black text-on-surface uppercase tracking-tight">{v.odometer.toLocaleString()}</span>
                          <span className="text-[7px] font-black text-on-surface-variant uppercase opacity-55">KM</span>
                        </div>
                        {!isCBU && (
                          <Edit className="w-2.5 h-2.5 text-on-surface-variant/40" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest">Status</p>
                    <div>
                      <span className={cn("inline-block px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap", statusInfo.color)}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-surface-container-low/30 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-60">Exibindo {filteredVehicles.length} de {vehicles.length} unidades</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl text-xs font-black bg-primary text-white shadow-lg shadow-primary/20">1</button>
            <button className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sliding Drawer for Vehicle Details */}
      {selectedVehicle && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-300"
            onClick={() => setSelectedVehicle(null)}
          />
          
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-[520px] md:w-[620px] bg-white border-l border-outline-variant shadow-2xl z-50 flex flex-col transform transition-all duration-300 ease-out animate-in slide-in-from-right">
            
            {/* Header com Imagem */}
            <div className="relative h-64 bg-surface-container-high border-b border-outline-variant flex-shrink-0 overflow-hidden">
              {selectedVehicle.imageUrl ? (
                <img src={selectedVehicle.imageUrl} alt={selectedVehicle.prefix} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                  <Car className="w-24 h-24 text-primary/40 animate-pulse" />
                </div>
              )}
              
              {/* Close button */}
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-xl transition-all shadow-md active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Floating Info Plate */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-4 rounded-2xl text-white flex justify-between items-center shadow-lg">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight leading-none">{selectedVehicle.prefix}</h2>
                  <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-primary" /> {selectedVehicle.plate}
                  </p>
                </div>
                <span className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm", 
                  selectedVehicle.status === VehicleStatus.AVAILABLE 
                    ? "bg-green-500 text-white" 
                    : "bg-error text-white"
                )}>
                  {getStatusInfo(selectedVehicle.status).label}
                </span>
              </div>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Seção 1: Identificação Geral */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                  <Car className="w-4 h-4" /> Identificação Geral
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Classe</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.vehicleClass || 'Não Informada'}</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Modelo / Marca</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.model || 'Não Informado'}</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Patrimônio</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.patrimony || 'Não Informado'}</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Ano de Fabricação</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.yearOfManufacture || 'Não Informado'}</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Unidade</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.unit}</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Tipo Operacional</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.type}</span>
                  </div>
                </div>
              </div>

              {/* Seção 2: Controle de Odômetro e Manutenção */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                  <Settings className="w-4 h-4" /> Controle de Manutenção
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30 col-span-2">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Odômetro Atual</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-black text-on-surface tracking-tight">{selectedVehicle.odometer.toLocaleString()}</span>
                      <span className="text-[9px] font-black text-on-surface-variant uppercase opacity-55">KM</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Última Troca de Óleo</span>
                    <span className="text-xs font-bold text-on-surface block mt-1">
                      {selectedVehicle.lastOilChangeDate ? new Date(selectedVehicle.lastOilChangeDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'Não Cadastrada'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">KM na Última Troca</span>
                    <span className="text-xs font-bold text-on-surface block mt-1">
                      {selectedVehicle.lastOilChangeOdometer ? `${selectedVehicle.lastOilChangeOdometer.toLocaleString()} KM` : 'Não Cadastrado'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30 col-span-2">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Próxima Troca de Óleo</span>
                    <span className="text-xs font-bold text-on-surface block mt-1">
                      {selectedVehicle.nextOilChangeDate ? new Date(selectedVehicle.nextOilChangeDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'Não Cadastrada'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seção 3: Comunicação e Pneus */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                  <Radio className="w-4 h-4" /> Comunicação & Pneus
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30 col-span-2">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Modelo do Rádio Comunicador</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.radioModel || 'Não Cadastrado'}</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Patrimônio do Rádio</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.radioPatrimony || 'Não Cadastrado'}</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Situação do Rádio</span>
                    <div className="mt-1">
                      <span className={cn(
                        "inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                        selectedVehicle.radioStatus === 'FUNCIONANDO 5.5' && "bg-green-100 text-green-700",
                        selectedVehicle.radioStatus === 'FUNCIONANDO 3.3' && "bg-blue-100 text-blue-700",
                        selectedVehicle.radioStatus === 'RÁDIO INOPERANTE' && "bg-red-100 text-red-700",
                        selectedVehicle.radioStatus === 'NÃO TEM RÁDIO' && "bg-surface-container-high text-on-surface-variant",
                        selectedVehicle.radioStatus === 'RÁDIO NÃO FOI TESTADO' && "bg-amber-100 text-amber-700",
                        !selectedVehicle.radioStatus && "bg-surface-container text-on-surface"
                      )}>
                        {selectedVehicle.radioStatus || 'NÃO CADASTRADO'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Pneu Dianteiro</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.frontTireModel || 'Não Cadastrado'}</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Pneu Traseiro</span>
                    <span className="text-xs font-bold text-on-surface uppercase block mt-1">{selectedVehicle.rearTireModel || 'Não Cadastrado'}</span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30 col-span-2">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Validade dos Pneus</span>
                    <span className="text-xs font-bold text-on-surface block mt-1">
                      {selectedVehicle.tireValidityDate ? new Date(selectedVehicle.tireValidityDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'Não Cadastrada'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seção 4: Valores Financeiros */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                  <DollarSign className="w-4 h-4" /> Valores Financeiros
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Valor Contábil (Estado)</span>
                    <span className="text-sm font-black text-on-surface block mt-1 text-primary">
                      {selectedVehicle.vehicleValue ? selectedVehicle.vehicleValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Não Cadastrado'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                    <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block">Valor Venal (Mercado)</span>
                    <span className="text-sm font-black text-on-surface block mt-1 text-primary">
                      {selectedVehicle.marketValue ? selectedVehicle.marketValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Não Cadastrado'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer com Ações */}
            <div className="p-6 bg-surface-container-low border-t border-outline-variant flex gap-3 flex-shrink-0">
              {selectedVehicle.documentLink && (
                <button 
                  onClick={() => window.open(selectedVehicle.documentLink, '_blank')}
                  className="flex-1 bg-surface-container border border-outline text-on-surface-variant font-black p-3.5 rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                >
                  <FileText className="w-4 h-4" />
                  Documento CRLV
                </button>
              )}
              {!isCBU && (
                <button 
                  onClick={() => {
                    setSelectedVehicle(null);
                    navigate(`/viaturas/editar/${selectedVehicle.id}`);
                  }}
                  className="flex-1 bg-primary text-white font-black p-3.5 rounded-xl hover:bg-primary-container shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                >
                  <Edit className="w-4 h-4" />
                  Editar Viatura
                </button>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
