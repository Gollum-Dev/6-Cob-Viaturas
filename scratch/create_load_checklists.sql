-- =============================================
-- SCRIPT DE CONFIGURAÇÃO DE CHECKLISTS DE CARGA
-- =============================================

CREATE TABLE IF NOT EXISTS public.load_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_map_id UUID NOT NULL REFERENCES public.load_maps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.load_checklists ENABLE ROW LEVEL SECURITY;

-- Criar Políticas RLS
DROP POLICY IF EXISTS "Allow authenticated operations on load_checklists" ON public.load_checklists;
CREATE POLICY "Allow authenticated operations on load_checklists"
  ON public.load_checklists
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Habilitar Realtime para esta tabela
alter publication supabase_realtime add table public.load_checklists;
