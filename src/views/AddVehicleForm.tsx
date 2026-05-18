import { Car, Save, ArrowLeft, Camera, Shield, Gauge, Hash, Zap, Settings, Droplets, Disc, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { VehicleStatus } from '../types';

export default function AddVehicleForm() {
  const navigate = useNavigate();
  const { addVehicle } = useVehicles();

  const [formData, setFormData] = useState({
    prefix: '',
    plate: '',
    type: 'SALVAMENTO',
    unit: 'ITAJUBA',
    odometer: 0,
    lastOilChangeDate: '',
    nextOilChangeDate: '',
    lastOilChangeOdometer: 0,
    tireValidityDate: '',
    imageUrl: '',
    status: VehicleStatus.AVAILABLE
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle(formData);
    navigate('/viaturas');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header com Botão de Voltar */}
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={() => navigate('/viaturas')}
          className="p-2 md:p-3 bg-surface-container-low border border-outline-variant rounded-2xl text-on-surface-variant hover:text-primary transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
             <Car className="w-8 h-8 text-primary" />
             Nova Viatura
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">Inclusão de unidade operacional na frota ativa do sistema.</p>
        </div>
      </div>

      <form className="space-y-6 md:space-y-8 pb-12" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Coluna Principal: Dados Técnicos */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <section className="bg-white border border-outline-variant rounded-xl p-5 md:p-8 shadow-sm space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-on-surface">Informações de Identificação</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Prefix (Cód. Operacional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: ABTS-01" 
                    value={formData.prefix}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Hash className="w-3 h-3" /> Placa do Veículo
                  </label>
                  <input 
                    type="text" 
                    placeholder="BRA2E24" 
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Tipo de Viatura</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container appearance-none"
                    required
                  >
                    <option value="SALVAMENTO">SALVAMENTO</option>
                    <option value="SOCORRO">SOCORRO</option>
                    <option value="RESGATE">RESGATE</option>
                    <option value="APOIO">APOIO</option>
                    <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Unidade da Viatura
                  </label>
                  <select 
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container appearance-none"
                    required
                  >
                    <option value="ITAJUBA">ITAJUBA</option>
                    <option value="POUSO ALEGRE">POUSO ALEGRE</option>
                    <option value="EXTREMA">EXTREMA</option>
                    <option value="PARAISOPOLIS">PARAISOPOLIS</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Gauge className="w-3 h-3" /> Odômetro de Entrada
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.odometer}
                    onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value) || 0 })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="bg-white border border-outline-variant rounded-xl p-5 md:p-8 shadow-sm space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-on-surface">Controle de Manutenção Preventiva</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Droplets className="w-3 h-3" /> Data Úl. Troca de Óleo
                  </label>
                  <input 
                    type="date" 
                    value={formData.lastOilChangeDate}
                    onChange={(e) => setFormData({ ...formData, lastOilChangeDate: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Droplets className="w-3 h-3" /> Data Próx. Troca de Óleo
                  </label>
                  <input 
                    type="date" 
                    value={formData.nextOilChangeDate}
                    onChange={(e) => setFormData({ ...formData, nextOilChangeDate: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Gauge className="w-3 h-3" /> KM Úl. Troca de Óleo
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.lastOilChangeOdometer}
                    onChange={(e) => setFormData({ ...formData, lastOilChangeOdometer: parseInt(e.target.value) || 0 })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Disc className="w-3 h-3" /> Validade dos Pneus
                  </label>
                  <input 
                    type="date" 
                    value={formData.tireValidityDate}
                    onChange={(e) => setFormData({ ...formData, tireValidityDate: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white border border-outline-variant rounded-xl p-5 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                <div className="w-10 h-10 bg-secondary-container/30 rounded-lg flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-on-surface">Registro Visual</h3>
              </div>
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-xl p-8 bg-surface-container-lowest group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden h-48">
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} alt="Vehicle Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Alterar Fotografia</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-outline-variant mb-4 group-hover:text-primary transition-colors opacity-30" />
                      <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Anexar foto frontal</p>
                      <p className="text-[10px] text-on-surface-variant mt-2">Clique ou arraste o arquivo</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </label>
                <p className="text-[10px] text-on-surface-variant text-center">Formatos aceitos: JPG, PNG (Max 5MB)</p>
              </div>
            </section>
          </div>

          {/* Coluna Lateral: Especificações e Atribuição */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-surface-container-high border border-outline-variant rounded-xl p-8 shadow-sm space-y-6">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Status e Disponibilidade</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Status Inicial</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
                    className="w-full bg-white border border-outline-variant p-3 rounded-lg text-xs font-bold focus:outline-none"
                  >
                    <option value={VehicleStatus.AVAILABLE}>DISPONÍVEL</option>
                    <option value={VehicleStatus.DOWN}>BAIXADA</option>
                    <option value={VehicleStatus.DISCHARGE_PROCESS}>PROCESSO DE DESCARGA</option>
                    <option value={VehicleStatus.DISCHARGE_AVAILABLE}>DISPONÍVEL PARA DESCARGA</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
              <p className="text-xs font-medium text-on-surface-variant leading-relaxed italic">
                "Todo novo recurso deve passar pelo checklist de entrada antes de ser liberado para empenho operacional."
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
          <div className="flex justify-end gap-3 md:gap-4 p-1 flex-1">
            <button 
              type="button"
              onClick={() => navigate('/viaturas')}
              className="flex-1 sm:flex-none px-6 md:px-8 py-3 border border-outline text-on-surface-variant font-bold rounded-lg hover:bg-surface-container transition-all text-[10px] md:text-xs uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-[2] sm:flex-none px-6 md:px-10 py-3 bg-primary text-white font-black rounded-lg hover:bg-primary-container shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs uppercase tracking-widest"
            >
              <Save className="w-4 h-4 shrink-0" />
              <span className="truncate">Salvar Viatura</span>
            </button>
        </div>
      </form>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
