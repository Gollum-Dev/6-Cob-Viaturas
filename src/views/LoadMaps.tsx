import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, Plus, Edit, Eye, Trash2, X, Package, Folder, Tag, 
  ChevronRight, Grid, Shield, MapPin, Layers, Settings, 
  AlertCircle, CheckCircle2, Truck, ArrowRightLeft, Award, ChevronLeft, Wrench, Search
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';
import { UserRole, Vehicle, LoadMap, LoadMapSector, LoadMapItem } from '../types';
import { cn } from '../lib/utils';

export default function LoadMaps() {
  const { user } = useAuth();
  const { vehicles } = useVehicles();

  // State lists
  const [maps, setMaps] = useState<LoadMap[]>([]);
  const [sectors, setSectors] = useState<LoadMapSector[]>([]);
  const [items, setItems] = useState<LoadMapItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view states
  const [selectedMap, setSelectedMap] = useState<LoadMap | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtering states
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState('Todos');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('Todos');

  // Modal control states
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [editingMap, setEditingMap] = useState<Partial<LoadMap> | null>(null);

  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Partial<LoadMapSector> | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<LoadMapItem> | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningMap, setAssigningMap] = useState<LoadMap | null>(null);

  // Extract units list dynamically if user is Admin
  const availableUnits = useMemo(() => {
    if (user?.role !== UserRole.ADMINISTRADOR && user?.role !== UserRole.DESENVOLVEDOR) return [user?.unit || ''];
    const unitsSet = new Set(vehicles.map(v => v.unit).filter(Boolean));
    return ['Todos', ...Array.from(unitsSet)];
  }, [vehicles, user]);

  // Fetch all maps
  const fetchMaps = async () => {
    setLoading(true);
    try {
      let query = supabase.from('load_maps').select('*');
      
      // Filter by unit if not an administrator
      if (user && user.role !== UserRole.ADMINISTRADOR && user.role !== UserRole.DESENVOLVEDOR) {
        query = query.eq('unit', user.unit);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      if (data) {
        setMaps(data.map((m: any) => ({
          id: m.id,
          vehicleId: m.vehicle_id,
          unit: m.unit,
          name: m.name,
          description: m.description,
          createdAt: m.created_at,
          updatedAt: m.updated_at
        })));
      }
    } catch (error) {
      console.error('Erro ao buscar mapas de carga:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sectors and items for the active map
  const fetchSectorsAndItems = async (mapId: string) => {
    try {
      const { data: secData, error: secErr } = await supabase
        .from('load_map_sectors')
        .select('*')
        .eq('load_map_id', mapId)
        .order('created_at', { ascending: true });
      if (secErr) throw secErr;

      if (secData) {
        const mappedSectors: LoadMapSector[] = secData.map((s: any) => ({
          id: s.id,
          loadMapId: s.load_map_id,
          name: s.name,
          description: s.description,
          createdAt: s.created_at,
          updatedAt: s.updated_at
        }));
        setSectors(mappedSectors);

        const sectorIds = mappedSectors.map(s => s.id);
        if (sectorIds.length > 0) {
          const { data: itemData, error: itemErr } = await supabase
            .from('load_map_items')
            .select('*')
            .in('sector_id', sectorIds)
            .order('created_at', { ascending: true });
          if (itemErr) throw itemErr;

          if (itemData) {
            setItems(itemData.map((i: any) => ({
              id: i.id,
              sectorId: i.sector_id,
              name: i.name,
              quantity: i.quantity,
              description: i.description,
              status: i.status as any,
              createdAt: i.created_at,
              updatedAt: i.updated_at
            })));
          } else {
            setItems([]);
          }
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar setores e itens:', error);
    }
  };

  useEffect(() => {
    fetchMaps();
  }, [user]);

  useEffect(() => {
    if (selectedMap) {
      fetchSectorsAndItems(selectedMap.id);
    }
  }, [selectedMap]);

  // Filter maps based on query, vehicle, and unit selection
  const filteredMaps = useMemo(() => {
    return maps.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (m.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUnit = selectedUnitFilter === 'Todos' || m.unit === selectedUnitFilter;
      
      let matchesVehicle = true;
      if (selectedVehicleFilter === 'Sem Viatura') {
        matchesVehicle = !m.vehicleId;
      } else if (selectedVehicleFilter !== 'Todos') {
        matchesVehicle = m.vehicleId === selectedVehicleFilter;
      }
      
      return matchesSearch && matchesUnit && matchesVehicle;
    });
  }, [maps, searchQuery, selectedVehicleFilter, selectedUnitFilter]);

  // Map totals and stats
  const stats = useMemo(() => {
    const total = filteredMaps.length;
    const assigned = filteredMaps.filter(m => m.vehicleId).length;
    const unassigned = total - assigned;
    return { total, assigned, unassigned };
  }, [filteredMaps]);

  // Vehicle information helper
  const getVehicleInfo = (vehicleId?: string | null) => {
    if (!vehicleId) return null;
    return vehicles.find(v => v.id === vehicleId) || null;
  };

  // CRUD handlers - Map
  const handleSaveMap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMap || !editingMap.name || !user) return;

    try {
      const payload = {
        name: editingMap.name,
        description: editingMap.description || null,
        unit: editingMap.unit || user.unit,
        vehicle_id: editingMap.vehicleId || null,
        updated_at: new Date().toISOString()
      };

      if (editingMap.id) {
        const { error } = await supabase
          .from('load_maps')
          .update(payload)
          .eq('id', editingMap.id);
        if (error) throw error;
        
        // Update active selection view if currently active
        if (selectedMap?.id === editingMap.id) {
          setSelectedMap(prev => prev ? { ...prev, ...editingMap } as LoadMap : null);
        }
      } else {
        const { error } = await supabase
          .from('load_maps')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
      }
      
      setIsMapModalOpen(false);
      setEditingMap(null);
      fetchMaps();
    } catch (error) {
      console.error('Erro ao salvar mapa:', error);
      alert('Erro ao salvar mapa de carga.');
    }
  };

  const handleDeleteMap = async (id: string) => {
    if (!confirm('Deseja realmente remover este Mapa de Carga? Todos os setores e itens vinculados serão permanentemente deletados.')) return;
    try {
      const { error } = await supabase.from('load_maps').delete().eq('id', id);
      if (error) throw error;
      if (selectedMap?.id === id) {
        setSelectedMap(null);
      }
      fetchMaps();
    } catch (error) {
      console.error('Erro ao deletar mapa:', error);
      alert('Erro ao excluir o mapa de carga.');
    }
  };

  // CRUD handlers - Sector
  const handleSaveSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSector || !editingSector.name || !selectedMap) return;

    try {
      const payload = {
        name: editingSector.name,
        description: editingSector.description || null,
        load_map_id: selectedMap.id,
        updated_at: new Date().toISOString()
      };

      if (editingSector.id) {
        const { error } = await supabase
          .from('load_map_sectors')
          .update(payload)
          .eq('id', editingSector.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('load_map_sectors')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
      }

      setIsSectorModalOpen(false);
      setEditingSector(null);
      fetchSectorsAndItems(selectedMap.id);
    } catch (error) {
      console.error('Erro ao salvar setor:', error);
      alert('Erro ao salvar setor.');
    }
  };

  const handleDeleteSector = async (id: string) => {
    if (!confirm('Excluir este setor apagará todos os itens contidos nele. Deseja continuar?')) return;
    try {
      const { error } = await supabase.from('load_map_sectors').delete().eq('id', id);
      if (error) throw error;
      if (selectedMap) fetchSectorsAndItems(selectedMap.id);
    } catch (error) {
      console.error('Erro ao deletar setor:', error);
      alert('Erro ao excluir setor.');
    }
  };

  // CRUD handlers - Item
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.sectorId || !selectedMap) return;

    try {
      const payload = {
        name: editingItem.name,
        quantity: editingItem.quantity ?? 1,
        description: editingItem.description || null,
        status: editingItem.status || 'DISPONÍVEL',
        sector_id: editingItem.sectorId,
        updated_at: new Date().toISOString()
      };

      if (editingItem.id) {
        const { error } = await supabase
          .from('load_map_items')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('load_map_items')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
      }

      setIsItemModalOpen(false);
      setEditingItem(null);
      fetchSectorsAndItems(selectedMap.id);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Deseja realmente remover este item?')) return;
    try {
      const { error } = await supabase.from('load_map_items').delete().eq('id', id);
      if (error) throw error;
      if (selectedMap) fetchSectorsAndItems(selectedMap.id);
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      alert('Erro ao excluir item.');
    }
  };

  // Quick action item handlers (UX highlights)
  const adjustItemQuantity = async (item: LoadMapItem, change: number) => {
    const newQty = Math.max(0, item.quantity + change);
    try {
      const { error } = await supabase
        .from('load_map_items')
        .update({ quantity: newQty, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) throw error;
      if (selectedMap) fetchSectorsAndItems(selectedMap.id);
    } catch (error) {
      console.error('Erro ao atualizar quantidade do item:', error);
    }
  };

  const cycleItemStatus = async (item: LoadMapItem) => {
    const statuses: Array<'DISPONÍVEL' | 'AUSENTE' | 'MANUTENÇÃO'> = ['DISPONÍVEL', 'AUSENTE', 'MANUTENÇÃO'];
    const nextIndex = (statuses.indexOf(item.status) + 1) % statuses.length;
    const newStatus = statuses[nextIndex];
    try {
      const { error } = await supabase
        .from('load_map_items')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) throw error;
      if (selectedMap) fetchSectorsAndItems(selectedMap.id);
    } catch (error) {
      console.error('Erro ao atualizar status do item:', error);
    }
  };

  // Reassignment handler
  const handleAssignVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningMap) return;

    try {
      const { error } = await supabase
        .from('load_maps')
        .update({ 
          vehicle_id: assigningMap.vehicleId || null, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', assigningMap.id);
      if (error) throw error;

      setIsAssignModalOpen(false);
      setAssigningMap(null);
      fetchMaps();
    } catch (error) {
      console.error('Erro ao associar viatura:', error);
      alert('Erro ao vincular mapa de carga à viatura.');
    }
  };

  // Available vehicles for assignment dropdown (filtered by unit of the load map!)
  const getEligibleVehicles = (mapUnit: string) => {
    return vehicles.filter(v => v.unit === mapUnit);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* PAGE HEADER */}
      {!selectedMap && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in duration-300">
          <div>
            {(user?.role !== UserRole.ADMINISTRADOR && user?.role !== UserRole.DESENVOLVEDOR) && (
              <span className="bg-primary/10 text-primary font-black text-[10px] px-3.5 py-2.5 rounded-xl uppercase tracking-widest flex items-center gap-1.5 border border-primary/20">
                <MapPin className="w-3.5 h-3.5" />
                UNIDADE DE SERVIÇO: {(user?.unit || '').toUpperCase()}
              </span>
            )}
          </div>
          
          <button 
            onClick={() => {
              setEditingMap({ unit: user?.unit || '', name: '', description: '', vehicleId: null });
              setIsMapModalOpen(true);
            }}
            className="w-full sm:w-auto bg-primary text-white px-5 py-3.5 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md uppercase tracking-wider text-xs"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Novo Mapa de Carga
          </button>
        </div>
      )}

      {/* DETAILED VIEW MODE */}
      {selectedMap ? (
        <div className="space-y-6">
          {/* Breadcrumb / Map Header */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[32px] shadow-sm flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedMap(null)}
                className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-wider hover:text-black transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar aos Mapas
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg sm:text-2xl font-black text-on-surface uppercase tracking-tight leading-none">{selectedMap.name}</h3>
                  <span className="bg-surface-container text-on-surface-variant font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-widest border border-outline-variant/55">
                    {selectedMap.unit}
                  </span>
                  
                  {/* Current Vehicle Badge */}
                  {selectedMap.vehicleId ? (
                    (() => {
                      const v = getVehicleInfo(selectedMap.vehicleId);
                      return (
                        <span className="bg-primary/10 text-primary font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5 border border-primary/20">
                          <Truck className="w-3.5 h-3.5" />
                          Viatura: {v ? v.prefix : 'VINCULADA'}
                        </span>
                      );
                    })()
                  ) : (
                    <span className="bg-surface-container-high/60 text-on-surface-variant font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-widest border border-outline-variant">
                      Sem Viatura
                    </span>
                  )}
                </div>
                {selectedMap.description && (
                  <p className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-wide mt-2">{selectedMap.description}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => {
                  setAssigningMap(selectedMap);
                  setIsAssignModalOpen(true);
                }}
                className="flex-1 md:flex-none border border-outline hover:bg-surface-container text-on-surface-variant font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                title="Vincular/Transferir Viatura"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Vincular
              </button>
              
              <button
                onClick={() => {
                  setEditingSector({ name: '', description: '' });
                  setIsSectorModalOpen(true);
                }}
                className="flex-1 md:flex-none bg-primary text-white font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Setor
              </button>
            </div>
          </div>

          {/* Sectors and Items Section */}
          {sectors.length === 0 ? (
            <div className="bg-surface border border-dashed border-outline rounded-[32px] p-12 text-center flex flex-col items-center justify-center space-y-4">
              <Layers className="w-12 h-12 text-on-surface-variant/30 animate-pulse" />
              <div>
                <h4 className="text-sm font-black text-on-surface uppercase tracking-wider">Nenhum Setor Cadastrado</h4>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">Crie setores para organizar e catalogar os itens de carga deste mapa.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingSector({ name: '', description: '' });
                  setIsSectorModalOpen(true);
                }}
                className="bg-primary text-white font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Criar Primeiro Setor
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {sectors.map((sec) => {
                const sectorItems = items.filter(i => i.sectorId === sec.id);

                return (
                  <div key={sec.id} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] overflow-hidden shadow-sm">
                    {/* Sector Header */}
                    <div className="bg-surface-container-low/40 px-6 py-5 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                          <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-primary/70" />
                          {sec.name}
                        </h4>
                        {sec.description && (
                          <p className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mt-1">{sec.description}</p>
                        )}
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setEditingItem({ name: '', quantity: 1, status: 'DISPONÍVEL', description: '', sectorId: sec.id });
                            setIsItemModalOpen(true);
                          }}
                          className="flex-1 sm:flex-none border border-outline hover:bg-surface-container-low text-on-surface-variant font-black px-3.5 py-2.5 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Item
                        </button>
                        <button
                          onClick={() => {
                            setEditingSector(sec);
                            setIsSectorModalOpen(true);
                          }}
                          className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all border border-outline-variant/40"
                          title="Editar Setor"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSector(sec.id)}
                          className="p-2.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all border border-outline-variant/40"
                          title="Excluir Setor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Sector Items Grid */}
                    <div className="p-6">
                      {sectorItems.length === 0 ? (
                        <p className="text-center text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-[0.15em] py-6">Nenhum item cadastrado neste setor.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {sectorItems.map((item) => (
                            <div 
                              key={item.id}
                              className="bg-surface-container-low/40 border border-outline-variant/65 rounded-2xl p-5 hover:border-primary/20 transition-all flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex justify-between items-start gap-3">
                                  <div>
                                    <h5 className="text-xs sm:text-sm font-black text-on-surface uppercase tracking-tight">{item.name}</h5>
                                    {item.description && (
                                      <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">{item.description}</p>
                                    )}
                                  </div>
                                  
                                  {/* Quick Status Cycler */}
                                  <button
                                    onClick={() => cycleItemStatus(item)}
                                    className={cn(
                                      "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all active:scale-95 flex items-center gap-1",
                                      item.status === 'DISPONÍVEL' && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
                                      item.status === 'AUSENTE' && "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
                                      item.status === 'MANUTENÇÃO' && "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                                    )}
                                    title="Clique para alternar o status rapidamente"
                                  >
                                    {item.status === 'DISPONÍVEL' && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                                    {item.status === 'AUSENTE' && <AlertCircle className="w-3 h-3 text-red-600" />}
                                    {item.status === 'MANUTENÇÃO' && <Wrench className="w-3 h-3 text-amber-600" />}
                                    {item.status}
                                  </button>
                                </div>
                              </div>

                              <div className="flex justify-between items-center border-t border-outline-variant/15 mt-4 pt-3">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 bg-surface-container-high/40 border border-outline-variant/40 rounded-lg p-0.5">
                                  <button 
                                    onClick={() => adjustItemQuantity(item, -1)}
                                    className="w-6 h-6 flex items-center justify-center font-black text-on-surface hover:bg-surface-container-highest rounded text-xs select-none"
                                  >
                                    -
                                  </button>
                                  <span className="text-[10px] font-black text-on-surface px-1 select-none">
                                    QTD: {item.quantity}
                                  </span>
                                  <button 
                                    onClick={() => adjustItemQuantity(item, 1)}
                                    className="w-6 h-6 flex items-center justify-center font-black text-on-surface hover:bg-surface-container-highest rounded text-xs select-none"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingItem(item);
                                      setIsItemModalOpen(true);
                                    }}
                                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                    title="Editar Item"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all"
                                    title="Remover Item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* LIST VIEW MODE */
        <div className="space-y-6">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[9px] font-black text-on-surface-variant/65 uppercase tracking-widest">Total de Mapas</p>
                <h4 className="text-xl sm:text-2xl font-black text-on-surface mt-1">{stats.total.toString().padStart(2, '0')}</h4>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Package className="w-5 h-5" />
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[9px] font-black text-on-surface-variant/65 uppercase tracking-widest">Atribuídos a Viaturas</p>
                <h4 className="text-xl sm:text-2xl font-black text-on-surface mt-1">{stats.assigned.toString().padStart(2, '0')}</h4>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 border border-green-100">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[9px] font-black text-on-surface-variant/65 uppercase tracking-widest">Não Atribuídos (Avulsos)</p>
                <h4 className="text-xl sm:text-2xl font-black text-on-surface mt-1">{stats.unassigned.toString().padStart(2, '0')}</h4>
              </div>
              <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center text-on-surface-variant">
                <Grid className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* FILTERS & SEARCH */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 shadow-sm">
            <div className="grid grid-cols-1 md:flex md:flex-wrap gap-4 items-end">
              
              {/* Search Bar */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[200px] w-full">
                <label className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest pl-1">Buscar Mapa</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="DIGITE NOME OU DESCRIÇÃO..."
                    className="w-full bg-surface-container-low border border-outline-variant p-3 pl-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant/50 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Unit Filter (ADMIN/DEVELOPER ONLY) */}
              {(user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.DESENVOLVEDOR) && (
                <div className="flex flex-col gap-1.5 flex-1 min-w-[150px] w-full">
                  <label className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest pl-1">Unidade</label>
                  <div className="relative">
                    <select 
                      value={selectedUnitFilter}
                      onChange={(e) => setSelectedUnitFilter(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant p-3 pr-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest cursor-pointer appearance-none text-on-surface"
                    >
                      {availableUnits.map(u => (
                        <option key={u} value={u}>{u === 'Todos' ? 'TODAS' : u.toUpperCase()}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-on-surface-variant/60">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Assignment Filter */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[160px] w-full">
                <label className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest pl-1">Vínculo de Viatura</label>
                <div className="relative">
                  <select 
                    value={selectedVehicleFilter}
                    onChange={(e) => setSelectedVehicleFilter(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 pr-10 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest cursor-pointer appearance-none text-on-surface"
                  >
                    <option value="Todos">TODOS</option>
                    <option value="Sem Viatura">SEM VIATURA (AVULSO)</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.prefix.toUpperCase()}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-on-surface-variant/60">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Clean Filter Button */}
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedVehicleFilter('Todos');
                  setSelectedUnitFilter('Todos');
                }}
                className="flex items-center justify-center gap-2 h-[42px] px-6 border border-outline hover:bg-surface-container rounded-xl text-on-surface-variant hover:text-primary font-black transition-all uppercase tracking-widest text-[10px] w-full md:w-auto shrink-0"
              >
                <Filter className="w-3.5 h-3.5" />
                Limpar
              </button>
            </div>
          </div>

          {/* MAPS LIST GRID */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Carregando Mapas de Carga...</p>
            </div>
          ) : filteredMaps.length === 0 ? (
            <div className="bg-surface border border-dashed border-outline rounded-[32px] p-12 text-center flex flex-col items-center justify-center space-y-4">
              <Package className="w-12 h-12 text-on-surface-variant/30" />
              <div>
                <h4 className="text-sm font-black text-on-surface uppercase tracking-wider">Nenhum Mapa Carga Encontrado</h4>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">Crie um novo mapa de carga ou limpe os filtros de busca para ver resultados.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaps.map((map) => {
                const vehicle = getVehicleInfo(map.vehicleId);

                return (
                  <div 
                    key={map.id}
                    onClick={() => setSelectedMap(map)}
                    className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 hover:shadow-md hover:border-primary/25 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Top Header Card info */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-inner">
                          <Package className="w-5 h-5 opacity-70" />
                        </div>

                        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setAssigningMap(map);
                              setIsAssignModalOpen(true);
                            }}
                            className="p-2 border border-outline-variant/65 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Vincular/Transferir Viatura"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingMap(map);
                              setIsMapModalOpen(true);
                            }}
                            className="p-2 border border-outline-variant/65 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Editar Mapa"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMap(map.id)}
                            className="p-2 border border-outline-variant/65 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                            title="Remover Mapa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Info */}
                      <div className="mt-4 space-y-2">
                        <h4 className="font-black text-on-surface text-base group-hover:text-primary transition-colors uppercase tracking-tight">{map.name}</h4>
                        {map.description && (
                          <p className="text-[11px] font-bold text-on-surface-variant/75 uppercase tracking-wide line-clamp-2">{map.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="border-t border-outline-variant/15 mt-6 pt-4 flex flex-wrap justify-between items-center gap-3">
                      <span className="bg-surface-container text-on-surface-variant font-black text-[8px] px-2.5 py-0.5 rounded uppercase tracking-widest border border-outline-variant/40">
                        {map.unit}
                      </span>
                      
                      {vehicle ? (
                        <span className="bg-primary/10 text-primary font-black text-[8px] px-2.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1.5">
                          <Truck className="w-3 h-3" />
                          {vehicle.prefix}
                        </span>
                      ) : (
                        <span className="bg-surface-container-high/65 text-on-surface-variant font-black text-[8px] px-2.5 py-0.5 rounded uppercase tracking-widest">
                          Sem Viatura
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- MODALS --- */}

      {/* 1. Map Create/Edit Modal */}
      {isMapModalOpen && editingMap && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white border border-outline-variant rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                {editingMap.id ? 'Editar Mapa Carga' : 'Novo Mapa Carga'}
              </h3>
              <button onClick={() => setIsMapModalOpen(false)} className="p-1.5 text-on-surface-variant hover:text-black rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMap} className="p-6 md:p-8 space-y-4">
              {/* Unit Field (Only Admin can set, otherwise inherited) */}
              {user?.role === UserRole.ADMINISTRADOR ? (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Unidade</label>
                  <select
                    value={editingMap.unit || ''}
                    onChange={(e) => setEditingMap({ ...editingMap, unit: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface"
                    required
                  >
                    <option value="" disabled>SELECIONE UMA UNIDADE</option>
                    {availableUnits.filter(u => u !== 'Todos').map(u => (
                      <option key={u} value={u}>{u.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex justify-between items-center">
                  <span className="text-[10px] font-black text-on-surface-variant/65 uppercase tracking-widest">Unidade Vinculada</span>
                  <span className="bg-primary-container text-white font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {user?.unit}
                  </span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Nome do Mapa</label>
                <input 
                  type="text"
                  value={editingMap.name || ''}
                  onChange={(e) => setEditingMap({ ...editingMap, name: e.target.value })}
                  placeholder="EX: MAPA CARGA GERAL, TEMPLATE DE SALVAMENTO..."
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Descrição</label>
                <textarea 
                  value={editingMap.description || ''}
                  onChange={(e) => setEditingMap({ ...editingMap, description: e.target.value })}
                  placeholder="EX: CONJUNTO DE EQUIPAMENTOS DA CARGA OPERACIONAL DA FROTA."
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-wide text-on-surface h-24 resize-none"
                />
              </div>

              {/* Vehicle Assignment */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Viatura Vinculada (Opcional)</label>
                <select
                  value={editingMap.vehicleId || ''}
                  onChange={(e) => setEditingMap({ ...editingMap, vehicleId: e.target.value || null })}
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface"
                >
                  <option value="">NÃO VINCULAR A NENHUMA VIATURA</option>
                  {getEligibleVehicles(editingMap.unit || user?.unit || '').map(v => (
                    <option key={v.id} value={v.id}>{v.prefix.toUpperCase()} - {v.plate.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsMapModalOpen(false)}
                  className="flex-1 border border-outline text-on-surface font-black p-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white font-black p-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-black transition-all shadow-md shadow-primary/20"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Sector Create/Edit Modal */}
      {isSectorModalOpen && editingSector && selectedMap && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white border border-outline-variant rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                <Folder className="w-5 h-5 text-primary" />
                {editingSector.id ? 'Editar Setor' : 'Novo Setor'}
              </h3>
              <button onClick={() => setIsSectorModalOpen(false)} className="p-1.5 text-on-surface-variant hover:text-black rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSector} className="p-6 md:p-8 space-y-4">
              <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 mb-2">
                <p className="text-[8px] font-black text-on-surface-variant/65 uppercase tracking-widest block">Mapa de Carga</p>
                <p className="text-xs font-black text-on-surface uppercase block mt-1">{selectedMap.name}</p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Nome do Setor</label>
                <input 
                  type="text"
                  value={editingSector.name || ''}
                  onChange={(e) => setEditingSector({ ...editingSector, name: e.target.value })}
                  placeholder="EX: LADO DIREITO (D1), GAVETA TRASEIRA..."
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Descrição</label>
                <textarea 
                  value={editingSector.description || ''}
                  onChange={(e) => setEditingSector({ ...editingSector, description: e.target.value })}
                  placeholder="EX: SETOR DE MANGUEIRAS E VÁLVULAS DE RECALQUE."
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-wide text-on-surface h-24 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsSectorModalOpen(false)}
                  className="flex-1 border border-outline text-on-surface font-black p-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white font-black p-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-black transition-all shadow-md shadow-primary/20"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Item Create/Edit Modal */}
      {isItemModalOpen && editingItem && selectedMap && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white border border-outline-variant rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                {editingItem.id ? 'Editar Item Operacional' : 'Novo Item Operacional'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="p-1.5 text-on-surface-variant hover:text-black rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 md:p-8 space-y-4">
              <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 mb-2">
                <p className="text-[8px] font-black text-on-surface-variant/65 uppercase tracking-widest block">Setor Destino</p>
                <p className="text-xs font-black text-on-surface uppercase block mt-1">
                  {sectors.find(s => s.id === editingItem.sectorId)?.name || 'NÃO ENCONTRADO'}
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Nome do Item</label>
                <input 
                  type="text"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="EX: DESENCARCERADOR HOLMATRO, MANGUEIRA 2.1/2..."
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Quantidade</label>
                  <input 
                    type="number"
                    min="0"
                    value={editingItem.quantity ?? 1}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface"
                    required
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Disponibilidade</label>
                  <select
                    value={editingItem.status || 'DISPONÍVEL'}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface cursor-pointer"
                  >
                    <option value="DISPONÍVEL">DISPONÍVEL</option>
                    <option value="AUSENTE">AUSENTE</option>
                    <option value="MANUTENÇÃO">MANUTENÇÃO</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Observações / Descrição</label>
                <textarea 
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="EX: EQUIPAMENTO TESTADO E FUNCIONANDO COM PRESSÃO PLENA."
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-wide text-on-surface h-20 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsItemModalOpen(false)}
                  className="flex-1 border border-outline text-on-surface font-black p-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white font-black p-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-black transition-all shadow-md shadow-primary/20"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Reassignment Modal */}
      {isAssignModalOpen && assigningMap && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white border border-outline-variant rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary" />
                Vincular Viatura
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-1.5 text-on-surface-variant hover:text-black rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignVehicle} className="p-6 md:p-8 space-y-4">
              <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 mb-2 space-y-1">
                <p className="text-[8px] font-black text-on-surface-variant/65 uppercase tracking-widest">Mapa de Carga Selecionado</p>
                <p className="text-sm font-black text-on-surface uppercase">{assigningMap.name}</p>
                <p className="text-[8px] font-black text-primary uppercase tracking-widest mt-0.5">Unidade: {assigningMap.unit}</p>
              </div>

              {/* Vehicle Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant/75 uppercase tracking-widest pl-1">Escolha a Viatura ({assigningMap.unit})</label>
                <select
                  value={assigningMap.vehicleId || ''}
                  onChange={(e) => setAssigningMap({ ...assigningMap, vehicleId: e.target.value || null })}
                  className="w-full bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-xs font-black focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-widest text-on-surface cursor-pointer"
                >
                  <option value="">-- SEM VIATURA (AVULSO/RESERVA) --</option>
                  {getEligibleVehicles(assigningMap.unit).map(v => (
                    <option key={v.id} value={v.id}>{v.prefix.toUpperCase()} - {v.plate.toUpperCase()} ({v.type})</option>
                  ))}
                </select>
              </div>

              {/* Informative Alert */}
              <div className="bg-surface-container-low border border-outline-variant/40 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider leading-relaxed">
                  Nota: Apenas viaturas pertencentes à unidade **{assigningMap.unit}** estão qualificadas para vinculação, de forma a garantir a segurança e a coerência operacional.
                </p>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 border border-outline text-on-surface font-black p-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white font-black p-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-black transition-all shadow-md shadow-primary/20"
                >
                  Atualizar Vínculo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
