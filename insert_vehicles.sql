-- ==========================================================
-- SCRIPT DE INSERÇÃO: IMPORTAÇÃO DOS VEÍCULOS
-- ==========================================================
-- Execute este script no editor SQL do painel do Supabase
-- para adicionar todas as 38 viaturas ao sistema.

-- Garante que todas as colunas existem antes da inserção
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

-- Remove viaturas de teste se existirem
DELETE FROM public.vehicles WHERE prefix LIKE 'TEST-TMP%';

-- Inserção em lote das 38 viaturas
INSERT INTO public.vehicles (
  prefix, plate, type, unit, status, odometer,
  last_oil_change_date, last_oil_change_odometer, next_oil_change_date,
  vehicle_class, patrimony, year_of_manufacture, document_link,
  radio_model, radio_patrimony, radio_status,
  front_tire_model, rear_tire_model, vehicle_value, market_value
) VALUES
  ('APV 1358', 'PUE8101', 'ADMINISTRATIVO', 'POUSO ALEGRE', 'DISPONÍVEL', 246659, '2025-12-01 12:00:00+00'::timestamptz, 242305, NULL, 'LEVE - APV', '4028122-1', 2015, 'https://drive.google.com/file/d/1qsx_V-hov1L-cEBM_BI1-qdteLsyN8io/view?usp=drive_link', 'MOTOROLA DGM8500', '4028121-3', 'FUNCIONANDO 5.5', '175/70 R14', '175/70 R14', 37989, 15195.6),
  ('APV 1356', 'PUE8043', 'ADMINISTRATIVO', 'ITAJUBA', 'DISPONÍVEL', 177741, '2024-08-19 12:00:00+00'::timestamptz, 175262, NULL, 'LEVE - APV', '1392743-4', 2015, 'https://drive.google.com/file/d/1LUewlP2kseWtX6TEnulb7fQQjmehO85_/view?usp=drive_link', 'MOTOROLA DGM8500', '4028067-5', 'FUNCIONANDO 5.5', '175/70 R14', '175/70 R14', 37989, 15195.6),
  ('APV 1321', 'PUE8020', 'ADMINISTRATIVO', 'EXTREMA', 'DISPONÍVEL', 189095, '2025-02-27 12:00:00+00'::timestamptz, 189000, NULL, 'LEVE - APV', '4028018-7', 2015, 'https://drive.google.com/file/d/1xV9uT2oVaCbFA2X_MCY67iBgIEI-XpKq/view?usp=drive_link', 'MOTOROLA DGM8500', 'SEM PATRIMONIO', 'FUNCIONANDO 5.5', '175/70 R14', '165/70 R13', 37989, 15195.6),
  ('APV 0291', 'HMG3977', 'ADMINISTRATIVO', 'EXTREMA', 'DISPONÍVEL', 251700, '2025-03-13 12:00:00+00'::timestamptz, 251400, NULL, 'LEVE - APV', '1400623-5', 2005, 'https://drive.google.com/file/d/1km-tIqRxinHCZwe2W2xHKjAHwgX4xkTm/view?usp=drive_link', 'MOTOROLA DGM8500', '4028095-0', 'FUNCIONANDO 5.5', '165/70 R13', '165/70 R13', 12379, 4951.6),
  ('AMA 0938', 'HMH3770', 'RESGATE', 'POUSO ALEGRE', 'DISPONÍVEL', 75308, '2026-01-09 12:00:00+00'::timestamptz, 75176, NULL, 'RESGATE - AMA', '3538978-8', 2007, NULL, 'MOTOROLA DGM4100+', '4008039-0', 'FUNCIONANDO 5.5', '205/75 R16C', '205/75 R16C', 46260, 18504),
  ('UR 05590', 'QXW5F90', 'RESGATE', 'ITAJUBA', 'DISPONÍVEL', 26846, '2025-04-11 12:00:00+00'::timestamptz, 20121, NULL, 'RESGATE - UR', '7687760-4', 2023, 'https://drive.google.com/file/d/1otpiwXbZJ-3GMfxGhaKLcN8Ex7c3U-qR/view?usp=drive_link', 'MOTOROLA DGM8500', 'SEM PATRIMONIO', 'FUNCIONANDO 5.5', '205/75 R16C', '205/75 R16C', 185670, 74268),
  ('UR 02096', 'QXW2A96', 'RESGATE', 'EXTREMA', 'DISPONÍVEL', 93466, '2024-03-11 12:00:00+00'::timestamptz, 86744, NULL, 'RESGATE - UR', '7681684-2', 2021, 'https://drive.google.com/file/d/185Xpo1AyUKziKEnkb2CMStJ5O9R_uwRG/view?usp=drive_link', 'MOTOROLA DGM8500', '76792xx-9', 'FUNCIONANDO 5.5', '205/75 R16C', '205/75 R16C', 55869, 22347.6),
  ('UR 10331', 'QMV0331', 'RESGATE', 'POUSO ALEGRE', 'DISPONÍVEL', 124567, '2026-02-02 12:00:00+00'::timestamptz, 119967, NULL, 'RESGATE - UR', '6059253-2', 2016, 'https://drive.google.com/file/d/1Sq6Cj9zHaCMYoqbuawf64CC2ubQ6jxlM/view?usp=drive_link', 'MOTOROLA DGM8500', '4023694-3', 'FUNCIONANDO 5.5', '205/75 R16C', '205/75 R16C', 70290, 28116),
  ('UR 08838', 'PUE8838', 'RESGATE', 'POUSO ALEGRE', 'DISPONÍVEL', 110612, '2025-11-21 12:00:00+00'::timestamptz, 107608, NULL, 'RESGATE - UR', '4035528-4', 2016, 'https://drive.google.com/file/d/1fw3lkDLBIGekU2CBxNtbwpYQZ8wBYMTa/view?usp=drive_link', 'MOTOROLA DGM8500', '4008037-4', 'FUNCIONANDO 5.5', '205/75 R16C', '205/75 R16C', 70290, 28116),
  ('ASL 00147', 'SYZ0B47', 'SALVAMENTO', 'ITAJUBA', 'DISPONÍVEL', 15928, '2025-06-27 12:00:00+00'::timestamptz, 9952, NULL, 'SALVAMENTO - ASL', '7690054-1', 2024, 'https://drive.google.com/file/d/1oKJdijS2QxoUX8Oe5JCD7P3EExtkmCB5/view?usp=drive_link', 'MOTOROLA DGM8500', '7679265-0', 'FUNCIONANDO 5.5', '265/75 R16', '265/75 R16', 210140, 84056),
  ('ASL 02328', 'SIZ2D28', 'SALVAMENTO', 'ITAJUBA', 'DISPONÍVEL', 23286, '2025-10-22 12:00:00+00'::timestamptz, 19088, NULL, 'SALVAMENTO - ASL', '7689704-4', 2023, 'https://drive.google.com/file/d/1HvlZt4VeQlvUsjDDHAZBLzjGBr15VoqR/view?usp=drive_link', 'MOTOROLA DGM8500', 'SEM PATRIMONIO', 'FUNCIONANDO 5.5', '265/75 R16', '265/75 R16', 176200, 70480),
  ('ASL 02318', 'SIZ2D18', 'SALVAMENTO', 'EXTREMA', 'DISPONÍVEL', 37489, '2025-06-25 12:00:00+00'::timestamptz, 29948, NULL, 'SALVAMENTO - ASL', '7689699-4', 2023, 'https://drive.google.com/file/d/1deD3V2TdYofl3BHNthdcufgrboezjks1/view?usp=drive_link', 'MOTOROLA DGM8500', 'SEM PATRIMONIO', 'FUNCIONANDO 5.5', '265/75 R16', '265/75 R16', 176200, 70480),
  ('ASL 04430', 'QXW4E30', 'SALVAMENTO', 'POUSO ALEGRE', 'DISPONÍVEL', 45789, '2025-09-17 12:00:00+00'::timestamptz, 40919, NULL, 'SALVAMENTO - ASL', '7683987-7', 2022, 'https://drive.google.com/file/d/1L0L6F-I-BGDVubKRKQavrcTsuljwMyuB/view?usp=drive_link', 'MOTOROLA DGM8500', '7681617-6', 'FUNCIONANDO 5.5', '265/75 R16', '265/75 R16', 168650, 67460),
  ('ASL 00065', 'PUE8377', 'SALVAMENTO', 'PARAISOPOLIS', 'DISPONÍVEL', 135144, NULL, NULL, NULL, 'SALVAMENTO - ASL', '4028349-6', 2015, NULL, 'MOTOROLA DGM8500', '7679262-5', 'FUNCIONANDO 5.5', '265/75 R16', '265/75 R16', 79300, 31720),
  ('ASL 1277', 'ORC8D94', 'SALVAMENTO', 'EXTREMA', 'DISPONÍVEL', 197900, '2025-06-05 12:00:00+00'::timestamptz, 189901, NULL, 'SALVAMENTO - ASL', '4025299-0', 2013, 'https://drive.google.com/file/d/1eJE4NpSIoOA6S1iVQ9qSjptvygdJdFGW/view?usp=drive_link', 'MOTOROLA DGM8500', '4026359-2', 'FUNCIONANDO 5.5', '265/75 R16', '265/75 R16', 63720, 25488),
  ('ASL 0661', 'HMH0499', 'SALVAMENTO', 'ITAJUBA', 'BAIXADA', 216913, '2024-10-25 12:00:00+00'::timestamptz, 216695, NULL, 'SALVAMENTO - ASL', '1398943-0', 2005, 'https://drive.google.com/file/d/13bgIsg1tY_dBN-RXGx79hCnYZkhp8Ixd/view?usp=drive_link', 'MOTOROLA DGM8500', 'SEM PATRIMONIO', 'FUNCIONANDO 5.5', '265/75 R16', '265/75 R16', 70860, 28344),
  ('ASM 02841', 'TEB2I41', 'SALVAMENTO', 'EXTREMA', 'DISPONÍVEL', 1024, NULL, 0, NULL, 'SALVAMENTO - ASM', '901129550', 2024, NULL, 'MOTOROLA DGM8500', NULL, 'FUNCIONANDO 5.5', '205/75 R16C', '205/75 R16C', NULL, NULL),
  ('ASM 10251', 'QXW0C51', 'SALVAMENTO', 'ITAJUBA', 'DISPONÍVEL', 74093, '2024-11-12 12:00:00+00'::timestamptz, 66480, NULL, 'SALVAMENTO - ASM', '7676356-0', 2021, 'https://drive.google.com/file/d/1dmDb17P2EdyEmrNVV_ZhlzJ7fkZLI4Db/view?usp=drive_link', 'MOTOROLA DGM8500', '7679248-0', 'FUNCIONANDO 5.5', '205/75 R16C', '205/75 R16C', 157089, 62835.6),
  ('ABT 0542', 'HMG8668', 'SOCORRO', 'ITAJUBA', 'DISPONÍVEL', 84247, '2024-08-15 12:00:00+00'::timestamptz, 81524, NULL, 'SOCORRO - ABT', '1400625-1', 2006, 'https://drive.google.com/file/d/12TpRoKPXxYiWCkEf2TDyCkkFe8qlgm5m/view?usp=drive_link', 'MOTOROLA DGM8500', '7679280-3', 'FUNCIONANDO 5.5', '275/80 R22,5 - Direcional', '275/80 R22,5 - Tração', 55989, 22395.6),
  ('ABTS 09741', 'TCR9H41', 'SOCORRO', 'POUSO ALEGRE', 'DISPONÍVEL', 16671, NULL, 9741, NULL, 'SOCORRO - ABTS', '7691884-0', 2024, 'https://drive.google.com/file/d/1j2Et4GyGy6-QfnRcslVqbKE0pUyB7twU/view?usp=drive_link', 'MOTOROLA DGM8500', '7681621-4', 'FUNCIONANDO 5.5', '275/80 R22,5 - Direcional', '275/80 R22,5 - Tração', 683319, 273327.6),
  ('ABT 01384', 'TDG1D84', 'SOCORRO', 'ITAJUBA', 'DISPONÍVEL', 6971, NULL, 0, NULL, 'SOCORRO - ABTS', '7696075-7', 2024, 'https://drive.google.com/file/d/1qgwpYxt-5aMF_uhcVnP1JFMrsx4EZMxx/view?usp=drive_link', 'MOTOROLA DGM8500', NULL, 'FUNCIONANDO 5.5', '275/80 R22,5 - Direcional', '275/80 R22,5 - Tração', 683319, 273327.6),
  ('ATB 0760', 'HMH1024', 'SOCORRO', 'POUSO ALEGRE', 'DISPONÍVEL', 101143, '2025-08-09 12:00:00+00'::timestamptz, 98825, NULL, 'SOCORRO - ATB', '1397668-0 / 1387745-3', 2005, 'https://drive.google.com/file/d/1ps-KoueEyJjhrCHClFOZ0YbyDuB2-ru_/view?usp=drive_link', 'MOTOROLA DGM8500', 'SEM PATRIMONIO', 'FUNCIONANDO 5.5', '275/80 R22,5 - Direcional', '275/80 R22,5 - Tração', 137190, 54876),
  ('MB 0134', 'GWU4163', 'APOIO', 'POUSO ALEGRE', 'DISPONÍVEL', 0, NULL, 25622, NULL, 'APOIO - MB', '1408812-6', 2002, 'https://drive.google.com/file/d/1Ki_CIuI9vQwVQVpCmDQX1--TaTrtjfiw/view?usp=drive_link', NULL, 'SEM RÁDIO', 'NÃO TEM RÁDIO', '90/90 R21', '120/90 R17', NULL, NULL),
  ('TC 1143', 'HNH1101', 'APOIO', 'POUSO ALEGRE', 'DISPONÍVEL', 211542, '2026-01-30 12:00:00+00'::timestamptz, 210178, NULL, 'APOIO - TC', '4010043-0', 2010, 'https://drive.google.com/file/d/1OKQp-SAQ-F8aFq3nuTh7QrLGg2evptzv/view?usp=drive_link', NULL, 'SEM RÁDIO', 'NÃO TEM RÁDIO', '225/75 R16C', '225/75 R16C', 42279, 16911.6),
  ('APV 6235', 'SSN6C35', 'ADMINISTRATIVO', 'POUSO ALEGRE', 'DISPONÍVEL', 15127, '2026-01-29 12:00:00+00'::timestamptz, 10333, NULL, 'LEVE - APV', '7698983-6', 2024, 'https://drive.google.com/file/d/1zWS0n1MFuXTSDx6tGsLzqDPhRerkx5h-/view?usp=drive_link', NULL, 'SEM RÁDIO', 'NÃO TEM RÁDIO', '185/60 R15', '185/60 R15', NULL, NULL),
  ('APV 06245', 'SSN6C45', 'ADMINISTRATIVO', 'ITAJUBA', 'DISPONÍVEL', 3168, NULL, 0, NULL, 'LEVE - APV', '7698980-1', 2024, 'https://drive.google.com/file/d/1uNc362o0liKzH9l6WNWTnNrO9brzL4FD/view?usp=drive_link', NULL, NULL, 'NÃO TEM RÁDIO', '185/60 R15', '185/60 R15', NULL, NULL),
  ('APV 0102', 'PUE8344', 'ADMINISTRATIVO', 'POUSO ALEGRE', 'DISPONÍVEL', 131797, '2026-03-18 12:00:00+00'::timestamptz, 130700, NULL, 'LEVE - APV', '4028284-8', 2015, 'https://drive.google.com/file/d/1vyqy60vQfgtL19Yrivte-j8p3Zi6em5o/view?usp=drive_link', NULL, 'SEM RÁDIO', 'NÃO TEM RÁDIO', '195/55 R16', '195/55 R16', 37999, 15199.6),
  ('ASL 02165', 'SYZ2B65', 'SALVAMENTO', 'POUSO ALEGRE', 'DISPONÍVEL', 23491, '2025-10-13 12:00:00+00'::timestamptz, 21752, NULL, 'SALVAMENTO - ASL', '9010667-8', 2024, NULL, NULL, 'SEM RÁDIO', 'NÃO TEM RÁDIO', '265/65 R17', '265/65 R17C', 204920, 81968),
  ('ASL 07378', 'GMF7378', 'SALVAMENTO', 'POUSO ALEGRE', 'DISPONÍVEL', 179219, '2026-02-05 12:00:00+00'::timestamptz, 175723, NULL, 'SALVAMENTO - ASL', '7688881-9', 2013, 'https://drive.google.com/file/d/16r7CehCbZAT6tYn_VAc24s7Cn2m_426L/view?usp=drive_link', NULL, 'SEM RÁDIO', 'NÃO TEM RÁDIO', '265/70 R16', '265/70 R16', 68870, 27548),
  ('ASM 04886', 'TCF4I86', 'SALVAMENTO', 'POUSO ALEGRE', 'DISPONÍVEL', 30102, '2026-01-28 12:00:00+00'::timestamptz, 26470, NULL, 'SALVAMENTO - ASM', '7691686-3', 2023, 'https://drive.google.com/file/d/123A0etkWF5vFVIDoyHoFzSU2MpVwbxjn/view?usp=drive_link', NULL, 'SEM RÁDIO', 'NÃO TEM RÁDIO', '205/75 R16C', '205/75 R16C', 186309, 74523.6),
  ('ABT 1065', 'HNH0644', 'SOCORRO', 'POUSO ALEGRE', 'DISPONÍVEL', 205240, '2023-10-09 12:00:00+00'::timestamptz, 199008, NULL, 'SOCORRO - ABT', '1398821-2 / 1405130-3', 2010, 'https://drive.google.com/file/d/19CfEnBLxFVcxxr_ai2bKwM-IlnICZFSn/view?usp=drive_link', NULL, NULL, 'NÃO TEM RÁDIO', '275/80 R22,5 - Direcional', '275/80 R22,5 - Tração', 125340, 50136),
  ('ABT 0537', 'HMG8451', 'SOCORRO', 'EXTREMA', 'DISPONÍVEL', 110343, '2025-11-17 12:00:00+00'::timestamptz, 109742, NULL, 'SOCORRO - ABT', '1400621-9', 2006, 'https://drive.google.com/file/d/15mXqAmFMvqspS3cWOvN6MnddfuCjLHzM/view?usp=drive_link', NULL, 'SEM RÁDIO', 'NÃO TEM RÁDIO', '275/80 R22,5 - Direcional', '275/80 R22,5 - Tração', 55989, 22395.6),
  ('ABT 0545', 'HMG8670', 'SOCORRO', 'EXTREMA', 'DISPONÍVEL', 124722, '2025-07-25 12:00:00+00'::timestamptz, 123928, NULL, 'SOCORRO - ABT', '1400623-5', 2006, 'https://drive.google.com/file/d/1XMJ9_q_LDHMT0F7wePONAL8q4G9JtNrv/view?usp=drive_link', NULL, NULL, 'NÃO TEM RÁDIO', '275/80 R22,5 - Direcional', '275/80 R22,5 - Tração', 55989, 22395.6),
  ('APP 0742', 'HMH1513', 'SALVAMENTO', 'POUSO ALEGRE', 'DISPONÍVEL', 31406, '2025-11-13 12:00:00+00'::timestamptz, 31208, NULL, 'SALVAMENTO - APP', '1396018-0', 2006, 'https://drive.google.com/file/d/1iPcysWsgecM3D7IEWW5_znC-dCfmvbjC/view?usp=drive_link', 'MOTOROLA DGM8500', '4026343-6', 'RÁDIO INOPERANTE', '275/80 R22,5 - Direcional', '275/80 R22,5 - Tração', 55989, 22395.6),
  ('TPP 0312', 'HMG4083', 'APOIO', 'POUSO ALEGRE', 'DISPONÍVEL', 122518, '2025-03-24 12:00:00+00'::timestamptz, 121073, NULL, 'APOIO - TPP', '1408908-4', 2004, 'https://drive.google.com/file/d/1q7KHA2egqq1rCZf56Zgyf8Qzzdaap3ru/view?usp=drive_link', 'MOTOROLA DGM4100+', 'SEM PATRIMONIO', 'RÁDIO NÃO FOI TESTADO', '195/75 R16C', '195/75 R16', 30918, 12367.2),
  ('ACA 00426', 'NXX1I57', 'SALVAMENTO', 'POUSO ALEGRE', 'BAIXADA', 149649, '2025-12-19 12:00:00+00'::timestamptz, 149264, NULL, 'SALVAMENTO - ACA', '4016585-0', 2012, 'https://drive.google.com/file/d/1oEdd0I5VXbSJpjC7KRax3kZIt5fJA2OG/view?usp=drive_link', 'MOTOROLA DGM8500', NULL, 'RÁDIO NÃO FOI TESTADO', '265/70 R16', '265/70 R16', 66600, 26640),
  ('ASL 02024', 'TEF2A24', 'ADMINISTRATIVO', 'POUSO ALEGRE', 'DISPONÍVEL', 0, NULL, NULL, NULL, 'LEVE - APV', NULL, 2024, 'https://drive.google.com/file/d/1llMZHqHs66djP23gJ3Gk13B8hl5mmRcZ/view?usp=drive_link', NULL, NULL, 'RÁDIO NÃO FOI TESTADO', NULL, NULL, NULL, NULL),
  ('UR 04197', 'QXW4B97', 'RESGATE', 'POUSO ALEGRE', 'BAIXADA', 77580, NULL, NULL, NULL, 'RESGATE - UR', '404164 5-3', 2021, 'https://drive.google.com/file/d/1pUmTZfIjjsnbtr5pJqBwcdrBZ3g_F6JH/view?usp=drive_link', NULL, NULL, 'RÁDIO NÃO FOI TESTADO', '205/75 R16C', '205/75 R16C', 208638, 83455.2);

SELECT count(*) as total_vehicles_in_db FROM public.vehicles;
