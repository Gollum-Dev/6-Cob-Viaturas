import React, { useState } from 'react';
import { Shield, Lock, User as UserIcon, Award, Key, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export default function Login() {
  const { login } = useAuth();
  const [milNumber, setMilNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate milNumber
    if (!/^\d{7}$/.test(milNumber)) {
      setError('O Número do Militar deve conter exatamente 7 dígitos numéricos.');
      return;
    }

    setIsAuthenticating(true);
    const errorMsg = await login(milNumber, password);
    setIsAuthenticating(false);

    if (errorMsg) {
      // Translate common Supabase error messages
      let displayError = errorMsg;
      if (errorMsg.includes('Invalid login credentials')) {
        displayError = 'Credenciais inválidas. Verifique seu número e senha.';
      } else if (errorMsg.includes('Email not confirmed')) {
        displayError = 'E-mail não confirmado no banco de dados.';
      }
      
      setError(displayError);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements (only visible on mobile or behind split) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -ml-64 -mb-64" />

      <div className="w-full flex min-h-screen">
        {/* Left Side: Image/Branding (Hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2 relative bg-white">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 h-full w-full"
          >
            <img 
              src="https://www.mitren.com.br/wp-content/uploads/2018/06/abts_cbmmg_9878_tratada_blog.jpg" 
              alt="Viatura CBMMG" 
              className="h-full w-full object-cover opacity-90"
            />
          </motion.div>
          {/* Overlay gradient - fades to white on the right to blend with form */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white z-10" />
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10" />
        </div>

        {/* Right Side: Form Container */}
        <div className="w-full lg:w-1/2 flex items-stretch justify-center p-0 z-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full bg-white px-6 py-10 sm:p-12 md:p-20 relative overflow-y-auto flex flex-col justify-start md:justify-center min-h-screen lg:min-h-0"
          >
            {/* Form content */}
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                <img 
                  src="https://www.bombeiros.mg.gov.br/images/logo.png" 
                  alt="CBMMG Logo" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-xl"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="fallback-icon hidden w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-primary/20 relative z-10">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-on-surface uppercase tracking-tight mb-2">
                7ª CIA IND
              </h1>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">Sistema de Gestão de Frota e Carga</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-error-container text-error rounded-xl text-[10px] font-black uppercase tracking-widest text-center border border-error/10"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Award className="w-3 h-3" />
                  Número do Militar
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{7}"
                  maxLength={7}
                  required
                  value={milNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 7) setMilNumber(val);
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                  placeholder="Digite seu número (7 dígitos)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Key className="w-3 h-3" />
                  Senha de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className={`w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl mt-4 flex items-center justify-center gap-2 ${
                  isAuthenticating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black hover:shadow-primary/20 active:scale-[0.98]'
                }`}
              >
                {isAuthenticating ? 'Autenticando...' : 'Autenticar no Sistema'}
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant text-center">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">
                Acesso Restrito a Militares Credenciados
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale contrast-200">
               <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">Unidade de Apoio Técnico • 2026</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
