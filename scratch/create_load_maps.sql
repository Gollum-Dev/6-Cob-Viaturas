-- 1. Tabela de Mapas de Carga (com unit obrigatória e vehicle_id opcional)
CREATE TABLE IF NOT EXISTS public.load_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL, -- Vínculo flexível de viatura
  unit TEXT NOT NULL, -- Unidade militar à qual pertence o mapa de carga
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabela de Setores do Mapa de Carga
CREATE TABLE IF NOT EXISTS public.load_map_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_map_id UUID NOT NULL REFERENCES public.load_maps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabela de Itens do Setor
CREATE TABLE IF NOT EXISTS public.load_map_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID NOT NULL REFERENCES public.load_map_sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'DISPONÍVEL', -- 'DISPONÍVEL', 'AUSENTE', 'MANUTENÇÃO'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Habilitar RLS nas tabelas
ALTER TABLE public.load_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.load_map_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.load_map_items ENABLE ROW LEVEL SECURITY;

-- 5. Criar Políticas de Segurança RLS
-- public.load_maps
DROP POLICY IF EXISTS "Allow authenticated users to read load_maps" ON public.load_maps;
CREATE POLICY "Allow authenticated users to read load_maps" ON public.load_maps
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage load_maps" ON public.load_maps;
CREATE POLICY "Allow authenticated users to manage load_maps" ON public.load_maps
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- public.load_map_sectors
DROP POLICY IF EXISTS "Allow authenticated users to read sectors" ON public.load_map_sectors;
CREATE POLICY "Allow authenticated users to read sectors" ON public.load_map_sectors
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage sectors" ON public.load_map_sectors;
CREATE POLICY "Allow authenticated users to manage sectors" ON public.load_map_sectors
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- public.load_map_items
DROP POLICY IF EXISTS "Allow authenticated users to read items" ON public.load_map_items;
CREATE POLICY "Allow authenticated users to read items" ON public.load_map_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage items" ON public.load_map_items;
CREATE POLICY "Allow authenticated users to manage items" ON public.load_map_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
