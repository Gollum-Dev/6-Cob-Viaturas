-- ==========================================================
-- SCRIPT DE MIGRAÇÃO: EXPANSÃO DO CADASTRO DE VIATURAS
-- ==========================================================
-- Execute este script no editor SQL do seu painel do Supabase
-- para habilitar os novos campos técnicos, operacionais e de rádio.

ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS vehicle_class TEXT,
ADD COLUMN IF NOT EXISTS patrimony TEXT,
ADD COLUMN IF NOT EXISTS year_of_manufacture INTEGER,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS document_link TEXT,
ADD COLUMN IF NOT EXISTS radio_model TEXT,
ADD COLUMN IF NOT EXISTS radio_patrimony TEXT,
ADD COLUMN IF NOT EXISTS radio_status TEXT,
ADD COLUMN IF NOT EXISTS front_tire_model TEXT,
ADD COLUMN IF NOT EXISTS rear_tire_model TEXT,
ADD COLUMN IF NOT EXISTS vehicle_value NUMERIC,
ADD COLUMN IF NOT EXISTS market_value NUMERIC;

-- Comentários das colunas para documentação do banco de dados
COMMENT ON COLUMN public.vehicles.vehicle_class IS 'Classe operacional/administrativa da viatura';
COMMENT ON COLUMN public.vehicles.patrimony IS 'Número de controle patrimonial do estado';
COMMENT ON COLUMN public.vehicles.year_of_manufacture IS 'Ano de fabricação da viatura';
COMMENT ON COLUMN public.vehicles.model IS 'Modelo e fabricante da viatura (Ex: Toyota Hilux)';
COMMENT ON COLUMN public.vehicles.document_link IS 'URL ou link para o documento do veículo (CRLV)';
COMMENT ON COLUMN public.vehicles.radio_model IS 'Modelo do rádio comunicador instalado';
COMMENT ON COLUMN public.vehicles.radio_patrimony IS 'Número de patrimônio específico do rádio comunicador';
COMMENT ON COLUMN public.vehicles.radio_status IS 'Situação/status do rádio comunicador (Ex: Instalado, Manutenção)';
COMMENT ON COLUMN public.vehicles.front_tire_model IS 'Modelo/especificação do pneu dianteiro';
COMMENT ON COLUMN public.vehicles.rear_tire_model IS 'Modelo/especificação do pneu traseiro';
COMMENT ON COLUMN public.vehicles.vehicle_value IS 'Valor contábil da viatura';
COMMENT ON COLUMN public.vehicles.market_value IS 'Valor venal estimado (mercado)';
