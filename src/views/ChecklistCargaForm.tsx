import { ClipboardList, Camera, Send, CheckCircle2, AlertCircle, Clock, User, Package, Layers, Info, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoadChecklists } from '../context/LoadChecklistContext';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { LoadMap, LoadMapSector, LoadMapItem, UserRole } from '../types';

interface LoadMapWithVehicle extends LoadMap {
  vehicles?: {
    prefix: string;
    type: string;
  } | null;
}

export default function ChecklistCargaForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addLoadSubmission } = useLoadChecklists();

  // State for Load Maps
  const [loadMaps, setLoadMaps] = useState<LoadMapWithVehicle[]>([]);
  const [selectedMapId, setSelectedMapId] = useState('');
  const [selectedMap, setSelectedMap] = useState<LoadMapWithVehicle | null>(null);

  // State for Sectors and Items
  const [sectors, setSectors] = useState<LoadMapSector[]>([]);
  const [items, setItems] = useState<LoadMapItem[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Checklist toggles and observations state
  const [statuses, setStatuses] = useState<Record<string, boolean>>({}); // itemId -> status (true=OK, false=X)
  const [observations, setObservations] = useState<Record<string, string>>({}); // itemId -> observation text

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);

  // 1. Fetch available Load Maps on mount
  useEffect(() => {
    async function fetchMaps() {
      if (!user) return;
      let query = supabase
        .from('load_maps')
        .select('*, vehicles(prefix, type)');

      // Non-administrators only see maps of their unit
      if (user.role !== UserRole.ADMINISTRADOR) {
        query = query.eq('unit', user.unit);
      }

      const { data, error } = await query;
      if (!error && data) {
        setLoadMaps(data as LoadMapWithVehicle[]);
      } else {
        console.error('Error fetching load maps:', error);
      }
    }
    fetchMaps();
  }, [user]);

  // 2. Fetch Sectors and Items when Load Map selection changes
  useEffect(() => {
    async function fetchMapDetails() {
      if (!selectedMapId) {
        setSectors([]);
        setItems([]);
        setSelectedMap(null);
        return;
      }

      setIsLoadingDetails(true);
      const currentMap = loadMaps.find(m => m.id === selectedMapId) || null;
      setSelectedMap(currentMap);

      try {
        // Fetch sectors belonging to the load map
        const { data: secData, error: secErr } = await supabase
          .from('load_map_sectors')
          .select('*')
          .eq('load_map_id', selectedMapId)
          .order('name', { ascending: true });

        if (secErr) throw secErr;

        if (secData && secData.length > 0) {
          const mappedSectors: LoadMapSector[] = secData.map((s: any) => ({
            id: s.id,
            loadMapId: s.load_map_id,
            name: s.name,
            description: s.description,
            createdAt: s.created_at,
            updatedAt: s.updated_at
          }));

          const sectorIds = mappedSectors.map(s => s.id);

          // Fetch items belonging to these sectors
          const { data: itemData, error: itemErr } = await supabase
            .from('load_map_items')
            .select('*')
            .in('sector_id', sectorIds)
            .order('name', { ascending: true });

          if (itemErr) throw itemErr;

          const mappedItems: LoadMapItem[] = (itemData || []).map((i: any) => ({
            id: i.id,
            sectorId: i.sector_id,
            name: i.name,
            quantity: i.quantity,
            description: i.description,
            status: i.status as any,
            createdAt: i.created_at,
            updatedAt: i.updated_at
          }));

          setSectors(mappedSectors);
          setItems(mappedItems);

          // Initialize toggles as true (OK) for all fetched items
          const initialStatuses: Record<string, boolean> = {};
          mappedItems.forEach(item => {
            initialStatuses[item.id] = true;
          });
          setStatuses(initialStatuses);
          setObservations({});
        } else {
          setSectors([]);
          setItems([]);
        }
      } catch (err) {
        console.error('Error loading map sectors/items:', err);
      } finally {
        setIsLoadingDetails(false);
      }
    }

    fetchMapDetails();
  }, [selectedMapId, loadMaps]);

  const toggleStatus = (itemId: string) => {
    setStatuses(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleObservationChange = (itemId: string, value: string) => {
    setObservations(prev => ({ ...prev, [itemId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMapId) {
      alert('Selecione um Mapa de Carga');
      return;
    }
    if (items.length === 0) {
      alert('Este mapa de carga não contém nenhum item cadastrado para vistoria.');
      return;
    }
    if (!isDeclarationChecked) {
      alert('Você deve marcar a caixa de Declaração Operacional para confirmar a veracidade dos dados antes de enviar o checklist.');
      return;
    }

    // Verify observations are filled for all "X" items
    const missingObservations = items.some(item => !statuses[item.id] && !observations[item.id]?.trim());
    if (missingObservations) {
      alert('Por favor, descreva a anomalia para todos os itens marcados como inadequados (X).');
      return;
    }

    setIsSubmitting(true);

    // Format items list with sector name mapped
    const formattedItems = items.map(item => {
      const sector = sectors.find(s => s.id === item.sectorId);
      return {
        itemId: item.id,
        name: item.name,
        quantity: item.quantity,
        sectorName: sector ? sector.name : 'Outros',
        status: statuses[item.id],
        observation: observations[item.id] || ''
      };
    });

    try {
      await addLoadSubmission({
        loadMapId: selectedMapId,
        loadMapName: selectedMap?.name || '',
        items: formattedItems,
        userId: user?.id || '',
        userName: user?.name || '',
        userRank: user?.rank || '',
        userMilNumber: user?.milNumber || '',
        unit: user?.unit || '',
        vehiclePrefix: selectedMap?.vehicles?.prefix || undefined
      });

      alert('Checklist de carga enviado com sucesso!');
      navigate('/');
    } catch (err) {
      alert('Erro ao enviar checklist de carga. Tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Date-Time badge */}
      <div className="flex justify-end animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-2xl border border-outline-variant shadow-inner w-fit">
          <Clock className="w-4 h-4 text-primary" />
          <p className="font-data-mono text-xs md:text-sm font-bold text-on-surface">
            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} | {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <form className="space-y-6 md:space-y-8 pb-12" onSubmit={handleSubmit}>
        {/* Bloco de Cabeçalho Unificado, Premium e Responsivo */}
        <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* Título do Bloco */}
          <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-black text-on-surface uppercase tracking-widest">Identificação da Carga</h3>
              <p className="text-[10px] md:text-xs text-on-surface-variant font-medium">Selecione o mapa de carga antes do preenchimento</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Dados da Carga */}
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Mapa de Carga</label>
              <div className="relative">
                <select 
                  required
                  value={selectedMapId}
                  onChange={(e) => setSelectedMapId(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 md:p-4 rounded-xl font-bold text-on-surface focus:outline-none focus:border-primary-container appearance-none text-sm cursor-pointer pr-10 hover:bg-surface-container transition-colors"
                >
                  <option value="">Selecione o mapa...</option>
                  {loadMaps.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.vehicles ? `— Viatura ${m.vehicles.prefix} (${m.vehicles.type})` : '— Avulso'}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Sectors and Items Inspection Area */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="bg-surface-container-high px-4 md:px-8 py-4 border-b border-outline-variant flex items-center justify-between">
            <h4 className="font-black text-on-surface uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary shrink-0" />
              ITENS DE INSPEÇÃO DE CARGA
            </h4>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-[9px] md:text-[10px]">
              {items.length} Materiais
            </span>
          </div>

          {isLoadingDetails ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Carregando itens da carga...</p>
            </div>
          ) : !selectedMapId ? (
            <div className="py-16 px-6 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-primary/40 mx-auto" />
              <p className="text-sm md:text-base font-bold text-on-surface uppercase tracking-wide">
                Nenhum mapa selecionado
              </p>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Por favor, escolha um Mapa de Carga ativo no painel superior para carregar os setores e itens cadastrados para esta vistoria.
              </p>
            </div>
          ) : sectors.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-2">
              <AlertCircle className="w-12 h-12 text-error/40 mx-auto" />
              <p className="text-sm md:text-base font-bold text-error uppercase tracking-wide">
                Nenhum setor cadastrado
              </p>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Este Mapa de Carga não possui nenhum setor cadastrado. Cadastre setores e itens na aba "Mapa Carga" antes de conferir.
              </p>
            </div>
          ) : (
            <div className="space-y-8 p-4 md:p-8">
              {sectors.map((sector) => {
                const sectorItems = items.filter(i => i.sectorId === sector.id);

                return (
                  <div key={sector.id} className="border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-all duration-200">
                    {/* Sector Header */}
                    <div className="bg-surface-container-low px-4 md:px-6 py-3 border-b border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h5 className="text-xs md:text-sm font-black text-on-surface uppercase tracking-wider">
                          SETOR: {sector.name}
                        </h5>
                        {sector.description && (
                          <p className="text-[10px] md:text-xs text-on-surface-variant/80 font-medium italic mt-0.5">
                            {sector.description}
                          </p>
                        )}
                      </div>
                      <span className="bg-white/80 border border-outline px-2 py-0.5 rounded text-[9px] font-bold text-on-surface-variant tracking-wider uppercase shrink-0 w-fit">
                        {sectorItems.length} Itens
                      </span>
                    </div>

                    {/* Sector Items List */}
                    <div className="divide-y divide-outline-variant/30">
                      {sectorItems.length === 0 ? (
                        <div className="p-6 text-center text-xs text-on-surface-variant italic">
                          Nenhum material cadastrado neste setor.
                        </div>
                      ) : (
                        sectorItems.map((item, idx) => (
                          <div key={item.id} className="p-4 md:p-6 group hover:bg-surface-container-lowest transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                  <span className="font-data-mono text-xs text-on-surface-variant font-bold">
                                    {String(idx + 1).padStart(2, '0')}.
                                  </span>
                                  <p className="text-xs md:text-sm font-semibold text-on-surface leading-tight uppercase truncate">
                                    {item.name}
                                  </p>
                                  <span className="bg-primary-container/20 text-primary-container text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded">
                                    QTD: {item.quantity}
                                  </span>
                                </div>
                                {item.description && (
                                  <p className="text-[10px] text-on-surface-variant/60 font-medium ml-7">
                                    Obs: {item.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-end shrink-0 ml-7 sm:ml-0">
                                <button
                                  type="button"
                                  onClick={() => toggleStatus(item.id)}
                                  className={cn(
                                    "relative w-20 h-8 rounded-full transition-all duration-300 p-1 flex items-center font-black text-[9px] uppercase tracking-tighter cursor-pointer select-none",
                                    statuses[item.id] ? "bg-green-600 animate-none" : "bg-error"
                                  )}
                                >
                                  <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none text-white opacity-80">
                                    <span>OK</span>
                                    <span>X</span>
                                  </div>
                                  <motion.div
                                    animate={{ x: statuses[item.id] ? 48 : 0 }}
                                    className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
                                  >
                                    {!statuses[item.id] && <AlertCircle className="w-3 h-3 text-error" />}
                                    {statuses[item.id] && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                                  </motion.div>
                                </button>
                              </div>
                            </div>

                            {/* Anomaly observations text area */}
                            <AnimatePresence>
                              {!statuses[item.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 p-4 bg-error-container/10 rounded-lg border border-error/20 space-y-3">
                                    <div className="flex justify-between items-center">
                                      <label className="text-[10px] font-black text-error uppercase tracking-widest flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3" />
                                        Descrição da Anomalia / Observação do Material
                                      </label>
                                      <button type="button" className="flex items-center gap-2 bg-white border border-outline px-3 py-1.5 rounded-lg text-on-surface text-[10px] font-bold uppercase hover:bg-surface-container transition-all cursor-pointer">
                                        <Camera className="w-3 h-3 text-primary" />
                                        Anexar Foto
                                      </button>
                                    </div>
                                    <textarea
                                      required
                                      placeholder="Especifique a anomalia deste material (Ex: item faltando, quebrado, etc.)"
                                      value={observations[item.id] || ''}
                                      onChange={(e) => handleObservationChange(item.id, e.target.value)}
                                      className="w-full bg-white border border-error/20 rounded-lg p-3 text-sm focus:outline-none focus:border-error transition-all font-medium"
                                      rows={2}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Declaration and Submit button */}
        {selectedMapId && items.length > 0 && (
          <div className="bg-white border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm space-y-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1 space-y-4">
                <h4 className="text-lg md:text-xl font-bold text-on-surface">Declaração Operacional de Carga</h4>
                <p className="text-xs md:text-sm text-on-surface-variant font-medium leading-relaxed italic">
                  "Eu declaro por meio desta que os materiais e equipamentos pertencentes a este mapa de carga foram devidamente conferidos de forma presencial e todos os itens em desconformidade foram detalhados apropriadamente."
                </p>
                <div className="flex items-center gap-4 bg-surface-container p-4 rounded-lg border border-outline-variant group cursor-pointer hover:border-primary-container transition-all">
                  <input
                    type="checkbox"
                    id="declaration_carga"
                    required
                    checked={isDeclarationChecked}
                    onChange={(e) => setIsDeclarationChecked(e.target.checked)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary h-5 transition-all cursor-pointer"
                  />
                  <label htmlFor="declaration_carga" className="text-[10px] md:text-[11px] font-black text-on-surface uppercase tracking-wider cursor-pointer">
                    Confirmo a veracidade de todas as informações de materiais inseridas
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-outline text-on-surface-variant font-bold rounded-xl hover:bg-surface-container transition-all uppercase tracking-widest text-[9px] md:text-[10px] cursor-pointer"
              >
                Cancelar Vistoria
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-container shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[9px] md:text-[10px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Checklist Carga
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
