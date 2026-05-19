import { useState, useEffect, useRef, useMemo, KeyboardEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { UserRole, ChatMessage } from '../types';
import { Send, MessageSquare, AlertTriangle, User, Search, RefreshCw, CheckCircle, Database } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ChatView() {
  const { user, registeredUsers } = useAuth();
  const { messages, sendMessage, markAsRead, isLocalFallback, isLoading } = useChat();
  
  const [inputText, setInputText] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === UserRole.ADMINISTRADOR;

  // Filter non-admin users for the administrator to chat with
  const chatPartners = useMemo(() => {
    if (!isAdmin) return [];
    return registeredUsers
      .filter((u) => u.role !== UserRole.ADMINISTRADOR)
      .filter((u) => {
        const term = searchTerm.toLowerCase();
        return (
          u.name.toLowerCase().includes(term) ||
          u.rank.toLowerCase().includes(term) ||
          u.unit.toLowerCase().includes(term)
        );
      });
  }, [registeredUsers, isAdmin, searchTerm]);

  // Find the selected user object
  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return registeredUsers.find((u) => u.id === selectedUserId) || null;
  }, [selectedUserId, registeredUsers]);

  // Filter messages for the active conversation
  const activeConversationMessages = useMemo(() => {
    if (!user) return [];
    
    if (isAdmin) {
      if (!selectedUserId) return [];
      // Admin sees messages between themselves/admins and the selected user
      // Also messages where sender is selected user and receiver is null (sent to all admins)
      return messages.filter(
        (msg) =>
          (msg.sender_id === selectedUserId && msg.receiver_id === null) || // user to admins
          (msg.sender_id === selectedUserId && msg.receiver_id === user.id) || // user to this specific admin
          (msg.sender_id === user.id && msg.receiver_id === selectedUserId) || // this specific admin to user
          (messages.some(m => m.sender_id === msg.sender_id && m.sender_id !== selectedUserId && m.sender_id !== user.id) ? false : false) // exclude unrelated
      ).filter(msg => 
        (msg.sender_id === selectedUserId && (msg.receiver_id === null || msg.receiver_id === user.id)) ||
        (msg.receiver_id === selectedUserId)
      );
    } else {
      // Normal user sees messages between themselves and anyone else (which will be admins)
      return messages.filter(
        (msg) => msg.sender_id === user.id || msg.receiver_id === user.id
      );
    }
  }, [messages, user, selectedUserId, isAdmin]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationMessages]);

  // Mark messages as read when opening a conversation
  useEffect(() => {
    if (!user) return;
    
    if (isAdmin && selectedUserId) {
      markAsRead(selectedUserId);
    } else if (!isAdmin) {
      // For normal users, mark all received messages as read
      markAsRead('');
    }
  }, [activeConversationMessages.length, selectedUserId, user, isAdmin]);

  // Calculate unread counts per user for administrators
  const unreadCountsPerUser = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!isAdmin) return counts;

    messages.forEach((msg) => {
      if (!msg.is_read && msg.receiver_id === null) {
        counts[msg.sender_id] = (counts[msg.sender_id] || 0) + 1;
      }
    });

    return counts;
  }, [messages, isAdmin]);

  // Quick responses suggestions
  const quickResponses = [
    'Ciente, obrigado!',
    'Viatura em manutenção.',
    'Retornando para a base.',
    'Em deslocamento para atendimento.',
    'Favor atualizar o checklist.',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !user) return;

    if (isAdmin) {
      if (!selectedUserId) return;
      await sendMessage(text, selectedUserId);
    } else {
      // Normal user sends to admins (receiver_id is null)
      await sendMessage(text, null);
    }

    setInputText('');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getUnitColor = (unit: string) => {
    switch ((unit || '').toUpperCase()) {
      case 'ITAJUBA': return 'bg-purple-100 text-purple-700';
      case 'POUSO ALEGRE': return 'bg-cyan-100 text-cyan-700';
      case 'EXTREMA': return 'bg-emerald-100 text-emerald-700';
      case 'PARAISOPOLIS': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-surface-container-lowest rounded-[32px] border border-outline-variant">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Carregando Mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">

      {/* SQL Setup Helper for Admins if in Fallback Mode */}
      {isAdmin && isLocalFallback && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-xs text-amber-800 uppercase tracking-widest">⚠️ Chat em Modo Local (LocalStorage)</h3>
              <p className="text-xs text-amber-700/80 mt-1">
                A tabela de mensagens não foi detectada no banco de dados. O chat está rodando localmente no navegador. 
                Para ativar a sincronização em rede real-time com Supabase, execute o script SQL nas configurações.
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              // Copy SQL Script to Clipboard
              navigator.clipboard.writeText(`-- Copiar e rodar no editor SQL do Supabase:
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  sender_name TEXT NOT NULL,
  sender_rank TEXT NOT NULL
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated insert" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Allow authenticated read" ON public.messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR (receiver_id IS NULL AND EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMINISTRADOR')));
CREATE POLICY "Allow authenticated update" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() = receiver_id OR (receiver_id IS NULL AND EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMINISTRADOR')));
`);
              alert('SQL do Chat copiado para a área de transferência! Cole no editor SQL do seu painel Supabase.');
            }}
            className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <Database className="w-3.5 h-3.5" />
            Copiar SQL de Configuração
          </button>
        </div>
      )}

      {/* Main Chat Box */}
      <div className="h-[calc(100vh-210px)] min-h-[400px] flex bg-surface-container-lowest border border-outline-variant rounded-[32px] overflow-hidden shadow-sm">
        
        {/* Left Side: Military List (Only for Administrators) */}
        {isAdmin && (
          <div className={cn(
            "w-full md:w-80 border-r border-outline-variant flex flex-col bg-surface-container-low/20",
            selectedUserId !== null && "hidden md:flex"
          )}>
            <div className="p-4 border-b border-outline-variant space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-on-surface-variant/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Buscar militar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary uppercase tracking-wider font-bold"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/30">
              {chatPartners.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant/50">
                  <p className="text-xs font-bold uppercase tracking-widest">Nenhum militar encontrado</p>
                </div>
              ) : (
                chatPartners.map((u) => {
                  const unreadCount = unreadCountsPerUser[u.id] || 0;
                  const isSelected = selectedUserId === u.id;
                  
                  return (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className={cn(
                        "w-full text-left p-4 flex items-start gap-3 transition-colors hover:bg-surface-container-low",
                        isSelected && "bg-surface-container-high/60"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary border border-primary/20">
                        <span className="font-black text-sm uppercase">{u.name.substring(0, 2)}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-black text-xs text-on-surface uppercase tracking-wide truncate">
                            {u.rank} {u.name}
                          </p>
                          {unreadCount > 0 && (
                            <span className="bg-error text-white font-black text-[9px] px-2 py-0.5 rounded-full animate-pulse">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-on-surface-variant/50 font-bold uppercase tracking-widest mt-0.5">RE: {u.milNumber}</p>
                        
                        <div className="flex gap-1.5 mt-2">
                          <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider", getUnitColor(u.unit))}>
                            {u.unit}
                          </span>
                          <span className="bg-surface-container-high text-on-surface-variant/70 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                            {u.role}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Right Side: Conversation Thread */}
        <div className={cn(
          "flex-1 flex flex-col bg-surface-container-lowest",
          isAdmin && selectedUserId === null && "hidden md:flex",
          isAdmin && !selectedUserId && "hidden md:flex justify-center items-center p-8 text-center"
        )}>
          {isAdmin && !selectedUserId ? (
            /* Admin Empty State */
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 rounded-[28px] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-inner">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-on-surface uppercase tracking-tight">Atendimento ao Militar</h2>
              <p className="text-sm text-on-surface-variant/70">
                Selecione um militar na barra lateral para ver o histórico e responder às mensagens enviadas.
              </p>
            </div>
          ) : (
            /* Active Thread */
            <>
              {/* Thread Header */}
              <div className="p-4 md:p-6 border-b border-outline-variant bg-surface-container-low/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-sm text-on-surface uppercase tracking-wide">
                      {isAdmin && selectedUser 
                        ? `${selectedUser.rank} ${selectedUser.name}` 
                        : 'Administração da Unidade'}
                    </h2>
                    <p className="text-[10px] text-on-surface-variant/50 font-bold uppercase tracking-widest">
                      {isAdmin && selectedUser 
                        ? `Unidade: ${selectedUser.unit} • RE: ${selectedUser.milNumber}` 
                        : 'Canal direto para envio de mensagens'}
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <button 
                    onClick={() => setSelectedUserId(null)}
                    className="md:hidden text-xs font-black uppercase text-primary tracking-widest"
                  >
                    Voltar
                  </button>
                )}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-surface-container-lowest">
                {activeConversationMessages.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center p-8 text-on-surface-variant/50 space-y-3">
                    <MessageSquare className="w-8 h-8 opacity-30 text-primary" />
                    <p className="text-xs font-bold uppercase tracking-widest">Nenhuma mensagem no histórico</p>
                    <p className="text-xs max-w-xs opacity-75">Envie uma mensagem abaixo para iniciar o diálogo.</p>
                  </div>
                ) : (
                  activeConversationMessages.map((msg) => {
                    const isOwnMessage = msg.sender_id === user?.id;
                    const date = new Date(msg.created_at);
                    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <div 
                        key={msg.id}
                        className={cn(
                          "flex flex-col max-w-[85%] md:max-w-[70%] animate-in slide-in-from-bottom-2 duration-200",
                          isOwnMessage ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                      >
                        {/* Sender info if received */}
                        {!isOwnMessage && (
                          <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-wider mb-1 opacity-60">
                            {msg.sender_rank} {msg.sender_name}
                          </span>
                        )}

                        <div className={cn(
                          "p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed break-words",
                          isOwnMessage 
                            ? "bg-primary text-white rounded-tr-none" 
                            : "bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant/40 shadow-inner"
                        )}>
                          {msg.content}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1 opacity-45 text-[8px] font-black uppercase tracking-wider pl-1">
                          <span>{formattedTime}</span>
                          {isOwnMessage && (
                            <>
                              <span>•</span>
                              <span>{msg.is_read ? 'Lida' : 'Entregue'}</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Responses Panel (suggestions) */}
              <div className="px-4 md:px-6 py-2 border-t border-outline-variant bg-surface-container-low/10 flex flex-wrap gap-2 items-center overflow-x-auto">
                <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">Sugestões:</span>
                {quickResponses.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => handleSend(qr)}
                    className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-surface-container-high hover:bg-primary hover:text-white rounded-lg text-on-surface-variant border border-outline-variant/30 hover:border-transparent transition-all whitespace-nowrap"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Message Input Box */}
              <div className="p-4 md:p-6 border-t border-outline-variant bg-surface-container-lowest">
                <div className="flex gap-4 items-center">
                  <textarea
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Digite sua mensagem aqui..."
                    className="flex-1 bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:border-primary resize-none placeholder:text-on-surface-variant/50 max-h-24 min-h-[44px]"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputText.trim()}
                    className="h-11 w-11 rounded-full bg-primary hover:bg-black text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-lg hover:shadow-primary/20 disabled:opacity-40 disabled:hover:bg-primary disabled:shadow-none"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
