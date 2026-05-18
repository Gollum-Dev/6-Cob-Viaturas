import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Award, Shield, MapPin, Eye, EyeOff, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsView() {
  const { user, updatePassword } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!user) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('A nova senha deve conter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    setIsLoading(true);
    const result = await updatePassword(newPassword);
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg('Sua senha pessoal foi atualizada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMsg(result.error || 'Erro ao tentar atualizar a senha. Tente novamente.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
          <Key className="w-8 h-8 text-primary" />
          Configurações Pessoais
        </h1>
        <p className="text-on-surface-variant font-medium mt-1">
          Visualize seus dados cadastrais e gerencie sua segurança.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Personal Data Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant p-6 md:p-8 shadow-xl relative overflow-hidden group">
            {/* Visual background details */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-all duration-500" />
            
            <h2 className="text-lg font-black text-on-surface uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-outline-variant pb-4">
              <User className="w-5 h-5 text-primary" />
              Dados do Militar
            </h2>

            <div className="space-y-6">
              {/* Nome */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-surface-container-high border border-outline-variant text-on-surface-variant">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Nome de Guerra</p>
                  <p className="text-lg font-bold text-on-surface mt-0.5">{user.name}</p>
                </div>
              </div>

              {/* Militar Number */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-surface-container-high border border-outline-variant text-on-surface-variant">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Número de Bombeiro (RE)</p>
                  <p className="text-lg font-bold text-on-surface mt-0.5">{user.milNumber}</p>
                </div>
              </div>

              {/* Rank */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-surface-container-high border border-outline-variant text-on-surface-variant">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Posto / Graduação</p>
                  <p className="text-lg font-bold text-on-surface mt-0.5">{user.rank}</p>
                </div>
              </div>

              {/* Unit */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-surface-container-high border border-outline-variant text-on-surface-variant">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Unidade Lotada</p>
                  <p className="text-lg font-bold text-on-surface mt-0.5">{user.unit}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-surface-container-high border border-outline-variant text-on-surface-variant">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Nível de Permissão</p>
                  <p className="text-sm font-black text-primary uppercase tracking-widest mt-1 bg-primary/10 px-3 py-1 rounded-full w-fit">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Password Change Card */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant p-6 md:p-8 shadow-xl">
            <h2 className="text-lg font-black text-on-surface uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-outline-variant pb-4">
              <Lock className="w-5 h-5 text-primary" />
              Alterar Senha Pessoal
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-3 text-green-500 text-sm font-bold"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  {successMsg}
                </motion.div>
              )}

              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-error-container/50 border border-error/20 p-4 rounded-2xl flex items-center gap-3 text-error text-sm font-bold"
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  {errorMsg}
                </motion.div>
              )}

              {/* Password Input */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 pr-12 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                    placeholder="Mínimo 6 caracteres..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Confirmar Nova Senha
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                  placeholder="Confirme a nova senha..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl hover:shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  {isLoading ? 'Atualizando...' : 'Salvar Nova Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
