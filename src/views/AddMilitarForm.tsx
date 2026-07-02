import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { UserPlus, Award, Shield, Lock, ArrowLeft, Save, AlertTriangle, User, MapPin, Phone, Calendar, Fingerprint, Contact } from 'lucide-react';
import { motion } from 'motion/react';

export default function AddMilitarForm() {
  const { register, user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [milNumber, setMilNumber] = useState('');
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [rank, setRank] = useState('SD');
  const [role, setRole] = useState<UserRole>(UserRole.OPERACIONAL);
  const [unit, setUnit] = useState(currentUser?.role === UserRole.ADMINISTRADOR || currentUser?.role === UserRole.DESENVOLVEDOR ? '6COB' : currentUser?.unit || '6COB');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCpfChange = (val: string) => {
    const clean = val.replace(/\D/g, '');
    const formatted = clean
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    if (clean.length <= 11) setCpf(formatted);
  };

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/\D/g, '');
    let formatted = clean;
    if (clean.length <= 10) {
      formatted = clean
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      formatted = clean
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    if (clean.length <= 11) setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{7}$/.test(milNumber)) {
      setError('O Número do Militar deve conter exatamente 7 dígitos.');
      return;
    }

    if (!rank || !password || !name) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(password, role, milNumber, rank, name, unit, phone || undefined, cpf || undefined, rg || undefined, birthDate || undefined, fullName || undefined);
    
    if (result.success) {
      navigate('/militares');
    } else {
      setError(`Erro: ${result.error || 'Ocorreu um erro desconhecido ao cadastrar o militar.'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/militares')}
          className="p-2 md:p-3 bg-surface-container-low border border-outline-variant rounded-2xl text-on-surface-variant hover:text-primary transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-[24px] md:rounded-[32px] border border-outline-variant overflow-hidden shadow-xl">
        <div className="p-6 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-error-container/50 border border-error/20 p-4 rounded-2xl flex items-center gap-3 text-error text-sm font-bold"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                    <Award className="w-3 h-3" />
                    Número do Bombeiro
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={7}
                    required
                    value={milNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 7) setMilNumber(val);
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                    placeholder="Ex: 1234567"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                    placeholder="Digite o nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Nome de Guerra
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                    placeholder="Digite o nome de guerra"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                    <UserPlus className="w-3 h-3" />
                    Posto/Graduação
                  </label>
                  <select
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="CEL">CEL</option>
                    <option value="TEN-CEL">TEN-CEL</option>
                    <option value="MAJ">MAJ</option>
                    <option value="CAP">CAP</option>
                    <option value="1º TEN">1º TEN</option>
                    <option value="2º TEN">2º TEN</option>
                    <option value="ASP">ASP</option>
                    <option value="SUBTEN">SUBTEN</option>
                    <option value="1º SGT">1º SGT</option>
                    <option value="2º SGT">2º SGT</option>
                    <option value="3º SGT">3º SGT</option>
                    <option value="CB">CB</option>
                    <option value="SD">SD</option>
                    <option value="BRIGADISTA">BRIGADISTA</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Nível de Acesso
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    {(currentUser?.role === UserRole.ADMINISTRADOR || currentUser?.role === UserRole.DESENVOLVEDOR) && (
                      <>
                        <option value={UserRole.ADMINISTRADOR}>ADMINISTRADOR</option>
                        <option value={UserRole.DESENVOLVEDOR}>DESENVOLVEDOR</option>
                      </>
                    )}
                    <option value={UserRole.CIA_OP}>CIA OP</option>
                    <option value={UserRole.CBU}>CBU</option>
                    <option value={UserRole.OPERACIONAL}>OPERACIONAL</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    Unidade
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    disabled={currentUser?.role !== UserRole.ADMINISTRADOR && currentUser?.role !== UserRole.DESENVOLVEDOR}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner appearance-none cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    <option value="6COB">6COB</option>
                    <option value="1ª CIA OP">1ª CIA OP</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    Senha de Acesso
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                    placeholder="Defina uma senha..."
                  />
                </div>
              </div>
            </div>

            {/* Divisor & Informações Pessoais */}
            <div className="border-t border-outline-variant/60 pt-8">
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Informações Pessoais & Documentos
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      Telefone Celular
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                      placeholder="Ex: (35) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                      <Fingerprint className="w-3 h-3" />
                      CPF
                    </label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => handleCpfChange(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                      placeholder="Ex: 000.000.000-00"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                      <Contact className="w-3 h-3" />
                      RG
                    </label>
                    <input
                      type="text"
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
                      maxLength={20}
                      className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                      placeholder="Ex: MG-12.345.678"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 md:pt-8 border-t border-outline-variant flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="order-1 md:order-1 flex-1 bg-primary text-white py-4 md:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl hover:shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Cadastrando...' : 'Salvar Militar'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/militares')}
                className="order-2 md:order-2 px-10 py-4 md:py-5 border border-outline-variant rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-on-surface-variant hover:bg-surface-container-low transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
