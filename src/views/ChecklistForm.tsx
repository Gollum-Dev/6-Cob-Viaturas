import { FireExtinguisher, Camera, Send, CheckCircle2, AlertCircle, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { cn } from '../lib/utils';

const checklistItems = [
  "LUZES INTERIORES: VERIFICAR O FUNCIONAMENTO",
  "BUZINA: VERIFICAR O FUNCIONAMENTO",
  "VERIFICAR SIRENE E/OU FÁDÓ (COMPLETAR O ÓLEO DA FÁDÓ SE NECESSÁRIO)",
  "VERIFICAR LUZES ACESAS NO PAINEL COM O MOTOR FUNCIONANDO (ABS, AIRBAG, INJEÇÃO, FREIO, ETC)",
  "PALHETA DOS LIMPADORES DOS VIDROS: VERIFICAR",
  "PARA-BRISA: REALIZAR INSPEÇÃO VISUAL QUANTO A DANOS (TRINCAS)",
  "SISTEMA DE LIMPADOR E LAVADOR DOS VIDROS: VERIFICAR O FUNCIONAMENTO",
  "PNEUS: VERIFICAR QUANTO A DESGASTE (TWI) E CALIBRAR",
  "LÍQUIDO DE ARREFECIMENTO (ÁGUA DO RADIADOR): VERIFICAR",
  "VERIFICAR NÍVEL DE ÓLEO DO MOTOR",
  "COMPLETAR O COMBUSTÍVEL",
];

export default function ChecklistForm() {
  const navigate = useNavigate();
  const { vehicles, updateVehicle } = useVehicles();
  const { user } = useAuth();
  const { addSubmission } = useReports();
  const [statuses, setStatuses] = useState<Record<number, boolean>>(
    Object.fromEntries(checklistItems.map((_, i) => [i, true]))
  );
  const [observations, setObservations] = useState<Record<number, string>>({});
  const [odometer, setOdometer] = useState<string>('');
  const [selectedPrefix, setSelectedPrefix] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);

  const toggleStatus = (index: number) => {
    setStatuses(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleObservationChange = (index: number, value: string) => {
    setObservations(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrefix) {
      alert('Selecione uma viatura');
      return;
    }
    if (!odometer) {
      alert('Informe o odômetro');
      return;
    }
    if (!isDeclarationChecked) {
      alert('Você deve marcar a caixa de Declaração Operacional para confirmar a veracidade dos dados antes de enviar o checklist.');
      return;
    }

    const vehicle = vehicles.find(v => v.prefix === selectedPrefix);
    if (!vehicle || !user) return;

    const newOdometer = Number(odometer);
    const currentOdometer = vehicle.odometer || 0;

    if (newOdometer < currentOdometer) {
      alert(`Erro: O odômetro informado (${newOdometer} km) não pode ser menor que o odômetro atual da viatura (${currentOdometer} km). Verifique o valor.`);
      return;
    }

    if (newOdometer > currentOdometer) {
      const diff = newOdometer - currentOdometer;
      const confirmed = window.confirm(`A viatura rodou ${diff} km desde o último registro.\n\nConfirma o novo odômetro de ${newOdometer} km?`);
      if (!confirmed) {
        return;
      }
    }

    setIsSubmitting(true);

    const submissionData = {
      vehicleId: vehicle.id,
      vehiclePrefix: vehicle.prefix,
      vehicleType: vehicle.type,
      userId: user.id,
      userName: user.name,
      userRank: user.rank,
      userMilNumber: user.milNumber,
      odometer: newOdometer,
      items: checklistItems.map((item, index) => ({
        description: item,
        status: statuses[index],
        observation: observations[index] || ''
      }))
    };

    try {
      await addSubmission(submissionData);
      
      // Update vehicle's odometer if it changed
      if (newOdometer > currentOdometer) {
         if (updateVehicle) {
            await updateVehicle(vehicle.id, { odometer: newOdometer });
         }
      }

      alert('Checklist enviado com sucesso!');
      navigate('/');
    } catch (err) {
      alert('Erro ao enviar checklist. Tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-2xl border border-outline-variant shadow-inner w-fit">
          <Clock className="w-4 h-4 text-primary" />
          <p className="font-data-mono text-xs md:text-sm font-bold text-on-surface">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} | {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      <form className="space-y-6 md:space-y-8 pb-12" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-7 bg-white p-6 md:p-8 border border-outline-variant rounded-xl shadow-sm space-y-6 md:space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-on-surface">Identificação da Viatura</h3>
                <p className="text-xs md:text-sm text-on-surface-variant font-medium">Selecione o prefixo para inspeção</p>
              </div>
              <FireExtinguisher className="hidden sm:block w-10 h-10 text-primary-container" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Prefixo da Viatura</label>
                <select 
                  required
                  value={selectedPrefix}
                  onChange={(e) => setSelectedPrefix(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 md:p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container appearance-none text-sm"
                >
                  <option value="">Selecione a viatura...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.prefix}>{v.prefix} ({v.type})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Odômetro Atual (km)</label>
                <input 
                  required
                  type="number" 
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  placeholder="42.350" 
                  className="w-full bg-surface-container-low border border-outline-variant p-3 md:p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 md:p-8 border border-outline-variant rounded-xl shadow-sm space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-on-surface">Militar Responsável</h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-container flex items-center justify-center text-white shadow-lg shadow-primary-container/20 shrink-0">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-black text-on-surface uppercase tracking-tight truncate">{user?.name || 'Militar não identificado'}</p>
                <p className="text-[10px] md:text-xs text-on-surface-variant font-semibold uppercase truncate">{user?.rank || 'Posto/Graduação'}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-outline-variant/30">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-on-surface-variant uppercase tracking-widest">ID Funcional</span>
                <span className="font-data-mono font-black text-on-surface">{user?.milNumber || '------'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-on-surface-variant uppercase tracking-widest">Unidade</span>
                <span className="font-data-mono font-black text-on-surface">{user?.unit || 'Unidade não informada'}</span>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="bg-surface-container-high px-4 md:px-8 py-4 border-b border-outline-variant flex items-center justify-between">
            <h4 className="font-black text-on-surface uppercase tracking-widest text-[10px] md:text-xs">ITENS DE INSPEÇÃO</h4>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-[9px] md:text-[10px]">{checklistItems.length} Itens</span>
          </div>
          
          <div className="divide-y divide-outline-variant/30">
            {checklistItems.map((item, index) => (
              <div key={index} className="px-4 md:px-8 py-4 md:py-6 group hover:bg-surface-container-low transition-colors">
                <div className="flex flex-row items-center justify-between gap-4">
                  <p className="text-xs md:text-sm font-semibold text-on-surface leading-tight flex-1">
                    <span className="text-on-surface-variant font-data-mono mr-2 md:mr-3">{String(index + 1).padStart(2, '0')}.</span>
                    {item}
                  </p>
                  
                  <div className="flex items-center justify-end shrink-0">
                    <button 
                      type="button"
                      onClick={() => toggleStatus(index)}
                      className={cn(
                        "relative w-20 h-8 rounded-full transition-all duration-300 p-1 flex items-center font-black text-[9px] uppercase tracking-tighter",
                        statuses[index] ? "bg-green-600" : "bg-error"
                      )}
                    >
                      <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none text-white opacity-80">
                        <span>OK</span>
                        <span>X</span>
                      </div>
                      <motion.div 
                        animate={{ x: statuses[index] ? 48 : 0 }}
                        className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
                      >
                         {!statuses[index] && <AlertCircle className="w-3 h-3 text-error" />}
                         {statuses[index] && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                      </motion.div>
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {!statuses[index] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 p-6 bg-error-container/10 rounded-lg border border-error/20 space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-error uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" />
                            Descrição da Anomalia
                          </label>
                          <button className="flex items-center gap-2 bg-white border border-outline px-3 py-1.5 rounded-lg text-on-surface text-[10px] font-bold uppercase hover:bg-surface-container transition-all">
                            <Camera className="w-3 h-3" />
                            Anexar Foto
                          </button>
                        </div>
                        <textarea 
                          placeholder="Especifique o problema encontrado..."
                          value={observations[index] || ''}
                          onChange={(e) => handleObservationChange(index, e.target.value)}
                          className="w-full bg-white border border-error/20 rounded-lg p-4 text-sm focus:outline-none focus:border-error transition-all"
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-white border border-outline-variant rounded-xl p-8 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-6">
              <h4 className="text-xl font-bold text-on-surface">Declaração Operacional</h4>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed italic">
                "Eu declaro por meio desta que a viatura foi inspecionada de acordo com os procedimentos operacionais padrão. Quaisquer defeitos identificados foram documentados e relatados ao comandante de socorro."
              </p>
              <div className="flex items-center gap-4 bg-surface-container p-4 rounded-lg border border-outline-variant group cursor-pointer hover:border-primary-container transition-all">
                <input 
                  type="checkbox" 
                  id="declaration"
                  required
                  checked={isDeclarationChecked}
                  onChange={(e) => setIsDeclarationChecked(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary h-5 transition-all"
                />
                <label htmlFor="declaration" className="text-[11px] font-black text-on-surface uppercase tracking-wider cursor-pointer">
                  Confirmo que todos os dados inseridos são precisos
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8 border-t border-outline-variant">
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-outline text-on-surface-variant font-bold rounded-xl hover:bg-surface-container transition-all uppercase tracking-widest text-[9px] md:text-[10px]">
              Salvar Rascunho
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-container shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[9px] md:text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Checklist
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
