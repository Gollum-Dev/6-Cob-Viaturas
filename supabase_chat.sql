-- ==========================================
-- SCRIPT DE CONFIGURAÇÃO DO CHAT DO SUPABASE
-- ==========================================
-- Execute este script no Editor SQL (SQL Editor) do seu painel Supabase
-- para criar a tabela de mensagens com Segurança de Nível de Linha (RLS).

-- 1. Criar a tabela de mensagens
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- NULL significa que foi enviado para a "Administração"
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  sender_name TEXT NOT NULL,
  sender_rank TEXT NOT NULL
);

-- 2. Habilitar Segurança de Nível de Linha (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3. Criar Políticas de Segurança (Policies)

-- Política 1: Inserir mensagens (qualquer militar autenticado pode enviar mensagens que tenham seu próprio ID como remetente)
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.messages;
CREATE POLICY "Allow authenticated insert" 
ON public.messages 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = sender_id);

-- Política 2: Ler mensagens (militares podem ler mensagens que enviaram ou receberam, ou enviadas para admins se o próprio militar for administrador)
DROP POLICY IF EXISTS "Allow authenticated read" ON public.messages;
CREATE POLICY "Allow authenticated read" 
ON public.messages 
FOR SELECT 
TO authenticated 
USING (
  auth.uid() = sender_id 
  OR auth.uid() = receiver_id 
  OR (receiver_id IS NULL AND EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.role = 'ADMINISTRADOR'
  ))
);

-- Política 3: Atualizar status (militares podem atualizar mensagens para marcar como lidas se forem o destinatário ou se forem administradores lendo mensagens enviadas à administração)
DROP POLICY IF EXISTS "Allow authenticated update" ON public.messages;
CREATE POLICY "Allow authenticated update" 
ON public.messages 
FOR UPDATE 
TO authenticated 
USING (
  auth.uid() = receiver_id 
  OR (receiver_id IS NULL AND EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.role = 'ADMINISTRADOR'
  ))
);

-- 4. Habilitar a tabela para Realtime (Sincronização em tempo real)
alter publication supabase_realtime add table public.messages;
