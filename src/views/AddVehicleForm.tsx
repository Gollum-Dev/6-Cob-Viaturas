import { Car, Save, ArrowLeft, Camera, Shield, Gauge, Hash, Zap, Settings, Droplets, Disc, MapPin, Radio, DollarSign, FileText, Calendar } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { useAuth } from '../context/AuthContext';
import { VehicleStatus, UserRole } from '../types';

const calculateNextOilChangeDate = (lastDateStr: string): string => {
  if (!lastDateStr) return '';
  const parts = lastDateStr.split('-');
  if (parts.length !== 3) return '';
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-based month
  const day = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  date.setFullYear(date.getFullYear() + 1);
  
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getDate()).padStart(2, '0');
  
  return `${nextYear}-${nextMonth}-${nextDay}`;
};

export default function AddVehicleForm() {
  const navigate = useNavigate();
  const { addVehicle } = useVehicles();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    prefix: '',
    plate: '',
    type: 'SALVAMENTO',
    unit: user?.role === UserRole.ADMINISTRADOR ? 'ITAJUBA' : user?.unit || 'ITAJUBA',
    odometer: 0,
    lastOilChangeDate: '',
    nextOilChangeDate: '',
    lastOilChangeOdometer: 0,
    tireValidityDate: '',
    imageUrl: '',
    status: VehicleStatus.AVAILABLE,
    
    // Novos campos solicitados
    vehicleClass: '',
    patrimony: '',
    yearOfManufacture: new Date().getFullYear(),
    model: '',
    documentLink: '',
    radioModel: '',
    radioPatrimony: '',
    radioStatus: 'RÁDIO NÃO FOI TESTADO',
    frontTireModel: '',
    rearTireModel: '',
    vehicleValue: 0,
    marketValue: 0
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header com Botão de Voltar */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/viaturas')}
          className="p-2 md:p-3 bg-surface-container-low border border-outline-variant rounded-2xl text-on-surface-variant hover:text-primary transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>

      <form className="space-y-6 md:space-y-8 pb-12" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Coluna Principal: Dados Técnicos */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            
            {/* Seção 1: Informações de Identificação */}
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
                    <Zap className="w-3 h-3 text-primary" /> Prefixo (Cód. Operacional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: ABTS-01" 
                    value={formData.prefix}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Hash className="w-3 h-3 text-primary" /> Placa do Veículo
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: BRA2E24" 
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Car className="w-3 h-3 text-primary" /> Tipo de Viatura
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary appearance-none"
                    required
                  >
                    <option value="SALVAMENTO">SALVAMENTO</option>
                    <option value="SOCORRO">SOCORRO</option>
                    <option value="RESGATE">RESGATE</option>
                    <option value="APOIO">APOIO</option>
                    <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                    <option value="CARRETINHA">CARRETINHA</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3 text-primary" /> Classe da Viatura
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Auto Bomba Tanque Socorro" 
                    value={formData.vehicleClass}
                    onChange={(e) => setFormData({ ...formData, vehicleClass: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3 text-primary" /> Modelo / Fabricante
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Toyota Hilux 4x4" 
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" /> Unidade da Viatura
                  </label>
                  <select 
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    disabled={user?.role !== UserRole.ADMINISTRADOR}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary appearance-none disabled:opacity-75 disabled:cursor-not-allowed"
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
                    <Hash className="w-3 h-3 text-primary" /> Número de Patrimônio
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: PMG-123456" 
                    value={formData.patrimony}
                    onChange={(e) => setFormData({ ...formData, patrimony: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-primary" /> Ano de Fabricação
                  </label>
                  <input 
                    type="number" 
                    placeholder="Ex: 2023" 
                    value={formData.yearOfManufacture}
                    onChange={(e) => setFormData({ ...formData, yearOfManufacture: parseInt(e.target.value) || 0 })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </section>

            {/* Seção 2: Controle de Manutenção, Óleo & Pneus */}
            <section className="bg-white border border-outline-variant rounded-xl p-5 md:p-8 shadow-sm space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-on-surface">Controle Técnico & Operacional</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Gauge className="w-3 h-3 text-primary" /> Odômetro Atual (KM)
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.odometer}
                    onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value) || 0 })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-primary" /> Data da Última Troca de Óleo
                  </label>
                  <input 
                    type="date" 
                    value={formData.lastOilChangeDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newLastDate = e.target.value;
                      const newNextDate = calculateNextOilChangeDate(newLastDate);
                      setFormData({ 
                        ...formData, 
                        lastOilChangeDate: newLastDate,
                        nextOilChangeDate: newNextDate 
                      });
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Gauge className="w-3 h-3 text-primary" /> Odomêtro na Última Troca de Óleo
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.lastOilChangeOdometer}
                    onChange={(e) => setFormData({ ...formData, lastOilChangeOdometer: parseInt(e.target.value) || 0 })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-primary" /> Data da Próxima Troca de Óleo
                  </label>
                  <input 
                    type="date" 
                    value={formData.nextOilChangeDate}
                    readOnly
                    disabled
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface/50 focus:outline-none cursor-not-allowed opacity-75"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Disc className="w-3 h-3 text-primary" /> Modelo do Pneu Dianteiro
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Michelin 215/75 R17.5" 
                    value={formData.frontTireModel}
                    onChange={(e) => setFormData({ ...formData, frontTireModel: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Disc className="w-3 h-3 text-primary" /> Modelo do Pneu Traseiro
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Michelin 215/75 R17.5" 
                    value={formData.rearTireModel}
                    onChange={(e) => setFormData({ ...formData, rearTireModel: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-primary" /> Validade dos Pneus
                  </label>
                  <input 
                    type="date" 
                    value={formData.tireValidityDate}
                    onChange={(e) => setFormData({ ...formData, tireValidityDate: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </section>

            {/* Seção 3: Equipamentos de Rádio & Comunicação */}
            <section className="bg-white border border-outline-variant rounded-xl p-5 md:p-8 shadow-sm space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-on-surface">Comunicação e Rádio</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Radio className="w-3 h-3 text-primary" /> Modelo do Rádio Comunicador
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Motorola APX 2000 VHF" 
                    value={formData.radioModel}
                    onChange={(e) => setFormData({ ...formData, radioModel: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Hash className="w-3 h-3 text-primary" /> Patrimônio do Rádio
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: RAD-987654" 
                    value={formData.radioPatrimony}
                    onChange={(e) => setFormData({ ...formData, radioPatrimony: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3 text-primary" /> Situação do Rádio
                  </label>
                  <select 
                    value={formData.radioStatus}
                    onChange={(e) => setFormData({ ...formData, radioStatus: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary appearance-none"
                  >
                    <option value="FUNCIONANDO 5.5">FUNCIONANDO 5.5</option>
                    <option value="FUNCIONANDO 3.3">FUNCIONANDO 3.3</option>
                    <option value="RÁDIO INOPERANTE">RÁDIO INOPERANTE</option>
                    <option value="NÃO TEM RÁDIO">NÃO TEM RÁDIO</option>
                    <option value="RÁDIO NÃO FOI TESTADO">RÁDIO NÃO FOI TESTADO</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Seção 4: Financeiro & Documentação */}
            <section className="bg-white border border-outline-variant rounded-xl p-5 md:p-8 shadow-sm space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-on-surface">Financeiro e Documentos</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-primary" /> Valor Contábil da Viatura (R$)
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.vehicleValue}
                    onChange={(e) => setFormData({ ...formData, vehicleValue: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-primary" /> Valor Venal (Estimativa FIPE/Mercado) (R$)
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.marketValue}
                    onChange={(e) => setFormData({ ...formData, marketValue: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3 h-3 text-primary" /> Link do Documento (CRLV/CRV)
                  </label>
                  <input 
                    type="url" 
                    placeholder="Ex: https://drive.google.com/file/d/..." 
                    value={formData.documentLink}
                    onChange={(e) => setFormData({ ...formData, documentLink: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-lg font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </section>

            {/* Seção 5: Registro Visual */}
            <section className="bg-white border border-outline-variant rounded-xl p-5 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                <div className="w-10 h-10 bg-secondary-container/30 rounded-lg flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-on-surface">Registro Visual (Fotografia)</h3>
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
