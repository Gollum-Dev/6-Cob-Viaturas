import { useState, useMemo } from 'react';
import { Filter, Plus, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { VehicleStatus } from '../types';
import { cn } from '../lib/utils';

export default function VehicleInventory() {
  const navigate = useNavigate();
  const { vehicles, deleteVehicle } = useVehicles();

  const [typeFilter, setTypeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [unitFilter, setUnitFilter] = useState('Todos');

  const getStatusInfo = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return { label: 'Disponível', color: 'bg-green-100 text-green-700' };
      case VehicleStatus.DOWN:
        return { label: 'Baixada', color: 'bg-amber-100 text-amber-700' };
      case VehicleStatus.DISCHARGE_PROCESS:
        return { label: 'P. Descarga', color: 'bg-orange-100 text-orange-700' };
      case VehicleStatus.DISCHARGE_AVAILABLE:
        return { label: 'Disp. Descarga', color: 'bg-error/10 text-error' };
      default:
        return { label: status, color: 'bg-surface-container text-on-surface' };
    }
  };

  const vehicleTypes = useMemo(() => {
    const types = new Set(vehicles.map(v => v.type));
    return ['Todos', ...Array.from(types)].sort();
  }, [vehicles]);

  const units = useMemo(() => {
    const distinctUnits = new Set(vehicles.map(v => v.unit).filter(Boolean));
    return ['Todos', 'ITAJUBA', 'POUSO ALEGRE', 'EXTREMA', 'PARAISOPOLIS', ...Array.from(distinctUnits)].filter((v, i, a) => a.indexOf(v) === i);
  }, [vehicles]);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesType = typeFilter === 'Todos' || v.type === typeFilter;
    const matchesStatus = statusFilter === 'Todos' || v.status === statusFilter;
    const matchesUnit = unitFilter === 'Todos' || v.unit === unitFilter;

    return matchesType && matchesStatus && matchesUnit;
  });

  const getTypeColorSheet = (type: string) => {
    switch ((type || '').toUpperCase()) {
      case 'SOCORRO':
        return 'bg-blue-100/80 text-blue-700';
      case 'SALVAMENTO':
        return 'bg-green-100/80 text-green-700';
      case 'RESGATE':
        return 'bg-red-100/80 text-red-700 font-black';
      case 'ADMINISTRATIVO':
        return 'bg-yellow-100/80 text-yellow-800';
      case 'APOIO':
        return 'bg-gray-100/80 text-gray-600';
      default:
        return 'bg-surface-container text-on-surface';
    }
  };

  const getUnitColorSheet = (unit: string) => {
    switch ((unit || '').toUpperCase()) {
      case 'ITAJUBA':
        return 'bg-purple-100/80 text-purple-700';
      case 'POUSO ALEGRE':
        return 'bg-cyan-100/80 text-cyan-700';
      case 'EXTREMA':
        return 'bg-emerald-100/80 text-emerald-700';
      case 'PARAISOPOLIS':
        return 'bg-orange-100/80 text-orange-700';
      default:
        return 'bg-surface-container text-on-surface';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
            <Car className="w-8 h-8 text-primary" />
            Inventário de Viaturas
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">Lista completa de unidades operacionais e de manutenção.</p>
        </div>
        <Link 
          to="/viaturas/novo" 
          className="bg-primary text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-primary/20 uppercase tracking-widest text-xs group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Adicionar Nova Viatura
        </Link>
      </div>


      <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-outline-variant bg-surface-container-low/30">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex flex-wrap gap-6 items-center flex-1">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest pl-1">Tipo</label>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-xs font-black focus:outline-none uppercase tracking-widest cursor-pointer pr-4"
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type === 'Todos' ? 'TODOS' : (type || '').toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest pl-1">Unidade</label>
                <select 
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="bg-transparent text-xs font-black focus:outline-none uppercase tracking-widest cursor-pointer pr-4"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit === 'Todos' ? 'TODAS' : (unit || '').toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest pl-1">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-black focus:outline-none uppercase tracking-widest cursor-pointer pr-4"
                >
                    <option value="Todos">TODOS</option>
                    <option value={VehicleStatus.AVAILABLE}>DISPONÍVEL</option>
                    <option value={VehicleStatus.DOWN}>BAIXADA</option>
                    <option value={VehicleStatus.DISCHARGE_PROCESS}>P. DESCARGA</option>
                    <option value={VehicleStatus.DISCHARGE_AVAILABLE}>DISP. DESCARGA</option>
                </select>
              </div>
              
              <button 
                onClick={() => {
                  setTypeFilter('Todos');
                  setStatusFilter('Todos');
                  setUnitFilter('Todos');
                }}
                className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-primary font-black transition-all uppercase tracking-widest text-[10px]"
              >
                <Filter className="w-3 h-3" />
                Limpar Filtros
              </button>
            </div>
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
                  <tr key={v.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-4 py-6 min-w-[160px]">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-outline-variant overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                           {v.imageUrl ? (
                             <img src={v.imageUrl} alt={v.prefix} className="w-full h-full object-cover" />
                           ) : (
                             <Car className="w-6 h-6 text-primary/60 opacity-50" />
                           )}
                         </div>
                         <span className="font-black text-on-surface tracking-tight uppercase leading-none">{v.prefix}</span>
                       </div>
                    </td>
                    <td className="px-4 py-6">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{v.plate}</span>
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
                    <td className="px-4 py-6">
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-on-surface tracking-tight">{v.odometer.toLocaleString()}</span>
                        <span className="text-[8px] font-black text-on-surface-variant uppercase opacity-50">KM</span>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => navigate(`/viaturas/editar/${v.id}`)}
                            className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all" 
                            title="Editar"
                          >
                              <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteVehicle(v.id)}
                            className="p-3 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all" 
                            title="Remover"
                          >
                              <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-outline-variant/30 px-6">
          {filteredVehicles.map((v) => {
            const statusInfo = getStatusInfo(v.status);
            return (
              <div key={v.id} className="py-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-outline-variant overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.prefix} className="w-full h-full object-cover" />
                      ) : (
                        <Car className="w-8 h-8 text-primary/60 opacity-50" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-on-surface tracking-tight uppercase leading-none">{v.prefix}</h2>
                      <p className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-widest">{v.plate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/viaturas/editar/${v.id}`)}
                      className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteVehicle(v.id)}
                      className="p-3 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/10">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest">Unidade</p>
                    <p className="text-[11px] font-black text-on-surface uppercase tracking-tight">{v.unit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest">Tipo</p>
                    <p className="text-[11px] font-black text-on-surface uppercase tracking-tight">{v.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest">Odômetro</p>
                    <p className="text-[11px] font-black text-on-surface uppercase tracking-tight">{v.odometer.toLocaleString()} KM</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest">Status</p>
                    <span className={cn("inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest", statusInfo.color)}>
                      {statusInfo.label}
                    </span>
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
    </div>
  );
}
