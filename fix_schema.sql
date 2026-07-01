-- SCRIPT DE CORREÇÃO DO BANCO DE DADOS (Snake Case)
-- IMPORTANTE: Não apagaremos a tabela 'users' para preservar seu login de administrador.

-- 1. APAGAR TABELAS COM PROBLEMAS DE NOMENCLATURA
DROP TABLE IF EXISTS public.load_checklists CASCADE;
DROP TABLE IF EXISTS public.load_map_items CASCADE;
DROP TABLE IF EXISTS public.load_map_sectors CASCADE;
DROP TABLE IF EXISTS public.load_maps CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.time_bank CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.maintenance CASCADE;
DROP TABLE IF EXISTS public.commitments CASCADE;
DROP TABLE IF EXISTS public.checklists CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;


-- 2. RECRIAR TABELAS COM AS COLUNAS CORRETAS (Snake Case)

-- Tabela vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prefix TEXT NOT NULL,
  plate TEXT NOT NULL,
  type TEXT NOT NULL,
  unit TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL,
  odometer INTEGER NOT NULL,
  last_oil_change_date TIMESTAMP WITH TIME ZONE,
  last_oil_change_odometer INTEGER,
  next_oil_change_date TIMESTAMP WITH TIME ZONE,
  tire_validity_date TIMESTAMP WITH TIME ZONE,
  last_maintenance TIMESTAMP WITH TIME ZONE,
  vehicle_class TEXT,
  patrimony TEXT,
  year_of_manufacture INTEGER,
  model TEXT,
  document_link TEXT,
  radio_model TEXT,
  radio_patrimony TEXT,
  radio_status TEXT,
  front_tire_model TEXT,
  rear_tire_model TEXT,
  vehicle_value NUMERIC,
  market_value NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela checklists
CREATE TABLE IF NOT EXISTS public.checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  odometer INTEGER,
  items JSONB NOT NULL
);

-- Tabela commitments (Empenhos)
CREATE TABLE IF NOT EXISTS public.commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit TEXT NOT NULL,
  sei TEXT NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  supplier TEXT NOT NULL,
  number TEXT NOT NULL,
  year INTEGER NOT NULL,
  initial_value NUMERIC NOT NULL,
  reinforcement_value NUMERIC NOT NULL,
  cancellation_value NUMERIC NOT NULL,
  budgeted_to_pay NUMERIC NOT NULL,
  liquidated_value NUMERIC NOT NULL,
  balance NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  part_discount NUMERIC,
  part_tax NUMERIC,
  labor_rate NUMERIC,
  labor_tax NUMERIC
);

-- Tabela maintenance (Manutenções)
CREATE TABLE IF NOT EXISTS public.maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  odometer_at_maintenance INTEGER NOT NULL,
  workshop TEXT NOT NULL,
  status TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  notes TEXT,
  progress INTEGER,
  estimated_delivery TEXT,
  services_performed TEXT,
  budget_document TEXT,
  commitment_document TEXT,
  invoice_document TEXT,
  sei_document TEXT,
  invoice_value NUMERIC,
  commitment_id UUID REFERENCES public.commitments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  "user" TEXT NOT NULL,
  mil_number TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  ip TEXT NOT NULL,
  severity TEXT NOT NULL
);

-- Tabela time_bank
CREATE TABLE IF NOT EXISTS public.time_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  hours NUMERIC NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by TEXT,
  creator_rank TEXT,
  creator_name TEXT,
  km NUMERIC
);

-- Tabela messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  sender_name TEXT NOT NULL,
  sender_rank TEXT NOT NULL
);

-- Tabela load_maps
CREATE TABLE IF NOT EXISTS public.load_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  unit TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela load_map_sectors
CREATE TABLE IF NOT EXISTS public.load_map_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_map_id UUID NOT NULL REFERENCES public.load_maps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela load_map_items
CREATE TABLE IF NOT EXISTS public.load_map_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID NOT NULL REFERENCES public.load_map_sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'DISPONÍVEL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela load_checklists
CREATE TABLE IF NOT EXISTS public.load_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  load_map_id UUID REFERENCES public.load_maps(id) ON DELETE CASCADE,
  load_map_name TEXT NOT NULL,
  vehicle_prefix TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_rank TEXT NOT NULL,
  user_mil_number TEXT NOT NULL,
  unit TEXT NOT NULL,
  items JSONB NOT NULL
);


-- 3. HABILITAR SEGURANÇA E RESTAURAR PERMISSÕES
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.load_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.load_map_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.load_map_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.load_checklists ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE
    t_name text;
BEGIN
    FOR t_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow all for authenticated" ON %I', t_name);
        EXECUTE format('CREATE POLICY "Allow all for authenticated" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t_name);
    END LOOP;
END $$;
