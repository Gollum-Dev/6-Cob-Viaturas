-- ==========================================
-- SCRIPT COMPLETO DE CRIAÇÃO DO BANCO DE DADOS
-- ==========================================

-- 1. Tabela users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  milNumber TEXT NOT NULL,
  rank TEXT NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  phone TEXT,
  cpf TEXT,
  rg TEXT,
  birthDate TEXT,
  fullName TEXT,
  ala TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prefix TEXT NOT NULL,
  plate TEXT NOT NULL,
  type TEXT NOT NULL,
  unit TEXT NOT NULL,
  imageUrl TEXT,
  status TEXT NOT NULL,
  odometer INTEGER NOT NULL,
  lastOilChangeDate TEXT,
  lastOilChangeOdometer INTEGER,
  nextOilChangeDate TEXT,
  tireValidityDate TEXT,
  lastMaintenance TEXT,
  image TEXT,
  vehicleClass TEXT,
  patrimony TEXT,
  yearOfManufacture INTEGER,
  model TEXT,
  documentLink TEXT,
  radioModel TEXT,
  radioPatrimony TEXT,
  radioStatus TEXT,
  frontTireModel TEXT,
  rearTireModel TEXT,
  vehicleValue NUMERIC,
  marketValue NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela checklists
CREATE TABLE IF NOT EXISTS public.checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  vehicleId UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  vehiclePrefix TEXT,
  vehicleType TEXT,
  vehicleUnit TEXT,
  userId UUID REFERENCES public.users(id) ON DELETE CASCADE,
  userName TEXT,
  userRank TEXT,
  userMilNumber TEXT,
  userUnit TEXT,
  odometer INTEGER,
  items JSONB NOT NULL
);

-- 4. Tabela commitments
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
  initialValue NUMERIC NOT NULL,
  reinforcementValue NUMERIC NOT NULL,
  cancellationValue NUMERIC NOT NULL,
  budgetedToPay NUMERIC NOT NULL,
  liquidatedValue NUMERIC NOT NULL,
  balance NUMERIC NOT NULL,
  createdAt TIMESTAMPTZ DEFAULT now(),
  partDiscount NUMERIC,
  partTax NUMERIC,
  laborRate NUMERIC,
  laborTax NUMERIC
);

-- 5. Tabela maintenance
CREATE TABLE IF NOT EXISTS public.maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  odometerAtMaintenance INTEGER NOT NULL,
  workshop TEXT NOT NULL,
  status TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  vehicleId UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  notes TEXT,
  progress INTEGER,
  estimatedDelivery TEXT,
  servicesPerformed TEXT,
  budgetDocument TEXT,
  commitmentDocument TEXT,
  invoiceDocument TEXT,
  seiDocument TEXT,
  invoiceValue NUMERIC,
  commitmentId UUID REFERENCES public.commitments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabela audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  "user" TEXT NOT NULL,
  milNumber TEXT NOT NULL,
  action TEXT NOT NULL,
  resourceType TEXT NOT NULL,
  ip TEXT NOT NULL,
  severity TEXT NOT NULL
);

-- 7. Tabela time_bank
CREATE TABLE IF NOT EXISTS public.time_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  hours NUMERIC NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  createdAt TIMESTAMPTZ DEFAULT now(),
  createdBy TEXT,
  creatorRank TEXT,
  creatorName TEXT,
  km NUMERIC
);

-- 8. Tabela messages
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

-- 9. Tabela load_maps
CREATE TABLE IF NOT EXISTS public.load_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicleId UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  unit TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Tabela load_map_sectors
CREATE TABLE IF NOT EXISTS public.load_map_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loadMapId UUID NOT NULL REFERENCES public.load_maps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Tabela load_map_items
CREATE TABLE IF NOT EXISTS public.load_map_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sectorId UUID NOT NULL REFERENCES public.load_map_sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'DISPONÍVEL',
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Tabela load_checklists
CREATE TABLE IF NOT EXISTS public.load_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  loadMapId UUID REFERENCES public.load_maps(id) ON DELETE CASCADE,
  loadMapName TEXT NOT NULL,
  vehiclePrefix TEXT,
  userId UUID REFERENCES public.users(id) ON DELETE CASCADE,
  userName TEXT NOT NULL,
  userRank TEXT NOT NULL,
  userMilNumber TEXT NOT NULL,
  unit TEXT NOT NULL,
  items JSONB NOT NULL
);

-- ==========================================
-- HABILITAR RLS (Segurança) BÁSICA PARA TODAS
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
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

-- ==========================================
-- POLÍTICAS GENÉRICAS DE ACESSO (Permitir CRUD para usuários logados)
-- OBS: Estas são políticas abertas para facilitar a migração.
-- Recomendado ajustar posteriormente conforme as regras de negócio!
-- ==========================================
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
