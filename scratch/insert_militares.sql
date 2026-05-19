CREATE EXTENSION IF NOT EXISTS pgcrypto;
BEGIN;

-- Militar: TEN CEL MAURO (1289990)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1289990@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1289990', 'TEN CEL', 'MAURO', 'POUSO ALEGRE', 
      '(35) 99138-0906', '000.818.436-40', 'M-6675716', 
      '1974-06-13'::date, 'MAURO MARTINS DA SILVA'
    );
  END IF;
END $$;

-- Militar: MAJ TRISTÃO (1368687)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1368687@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1368687', 'MAJ', 'TRISTÃO', 'POUSO ALEGRE', 
      '(32) 98877-3077', '014.106.666-03', 'MG-11486417', 
      '1981-09-09'::date, 'ACÁCIO TRISTÃO GOUVEA'
    );
  END IF;
END $$;

-- Militar: CAP CANTELLE (1592468)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1592468@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1592468', 'CAP', 'CANTELLE', 'POUSO ALEGRE', 
      '(32) 99963-3355', '088.541.446-22', 'MG-12340909', 
      '1987-10-23'::date, 'GUILHERME CANTELLE LOPES PAIVA'
    );
  END IF;
END $$;

-- Militar: CAP OLIVEIRA (1603687)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1603687@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1603687', 'CAP', 'OLIVEIRA', 'POUSO ALEGRE', 
      '(35) 99815-0051', '013.808.626-55', 'MG-15410306', 
      '1990-01-08'::date, 'LUCAS ANTONIO DE OLIVEIRA'
    );
  END IF;
END $$;

-- Militar: 1º TEN ANDERSON (1675040)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1675040@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1675040', '1º TEN', 'ANDERSON', 'POUSO ALEGRE', 
      '(31) 99651-7440', '064.310.846-75', 'MG-13735841', 
      '1988-09-20'::date, 'ANDERSON FERRAZ DE AQUINO'
    );
  END IF;
END $$;

-- Militar: 1º TEN JOSUE (1722412)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1722412@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1722412', '1º TEN', 'JOSUE', 'POUSO ALEGRE', 
      '(31) 98206-3553', '111.831.206-64', 'MG-13745894', 
      '1991-05-28'::date, 'JOSUE DA SILVA ANDRADE'
    );
  END IF;
END $$;

-- Militar: 1º TEN NOGUEIRA (1725225)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1725225@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1725225', '1º TEN', 'NOGUEIRA', 'POUSO ALEGRE', 
      '(31) 98733-9366', '369.027.578-44', 'SP-450279546', 
      '1989-02-18'::date, 'LEANDRO FERNANDES NOGUEIRA'
    );
  END IF;
END $$;

-- Militar: 1º TEN VIOL (1766435)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1766435@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1766435', '1º TEN', 'VIOL', 'POUSO ALEGRE', 
      '(32) 99173-8233', '118.781.926-39', 'MG-14513819', 
      '1995-03-21'::date, 'RODRIGO VIOL DOS SANTOS'
    );
  END IF;
END $$;

-- Militar: 2º TEN IVO (1317080)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1317080@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1317080', '2º TEN', 'IVO', 'POUSO ALEGRE', 
      '(32) 99931-6483', '042.943.166-08', 'MG-11345109', 
      '1981-02-22'::date, 'IVO DIAS DOS REIS'
    );
  END IF;
END $$;

-- Militar: 2º TEN ANDRE LUIZ (1805332)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1805332@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1805332', '2º TEN', 'ANDRE LUIZ', 'POUSO ALEGRE', 
      '(32) 98406-6482', '109.564.386-01', 'MG-13680221', 
      '1992-11-03'::date, 'ANDRE LUIZ AVILA DE OLIVEIRA'
    );
  END IF;
END $$;

-- Militar: 2º TEN ILLUI (1805373)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1805373@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1805373', '2º TEN', 'ILLUI', 'POUSO ALEGRE', 
      '(31) 99606-8554', '123.431.626-97', 'MG-14296695', 
      '1996-04-03'::date, 'ILLUI PEREIRA SOUZA DINIZ'
    );
  END IF;
END $$;

-- Militar: SUB TEN BATISTA (1223999)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1223999@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1223999', 'SUB TEN', 'BATISTA', 'POUSO ALEGRE', 
      '(35) 99971-8636', '984.580.356-34', 'M-4940023', 
      '1968-06-08'::date, 'ANDRÉ BATISTA DOMINGUES'
    );
  END IF;
END $$;

-- Militar: 1º SGT PEREIRA (1051572)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1051572@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1051572', '1º SGT', 'PEREIRA', 'POUSO ALEGRE', 
      '(35) 98845-7955', '606.449.746-72', 'M-4424476', 
      '1969-04-07'::date, 'LUIZ CELSO PEREIRA'
    );
  END IF;
END $$;

-- Militar: 1º SGT BUSTAMANTE (1363803)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1363803@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1363803', '1º SGT', 'BUSTAMANTE', 'POUSO ALEGRE', 
      '(35) 99194-5670', '004.116.586-11', 'M-7592550', 
      '1975-09-06'::date, 'JOSE MENDES BUSTAMANTE JUNIOR'
    );
  END IF;
END $$;

-- Militar: 1º SGT MATHEUS (1429927)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1429927@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1429927', '1º SGT', 'MATHEUS', 'POUSO ALEGRE', 
      '(35) 99891-0671', '071.494.216-28', 'MG-11537151', 
      '1984-09-11'::date, 'LUCAS VÍTULO MATHEUS'
    );
  END IF;
END $$;

-- Militar: 1º SGT FERREIRA (1272848)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1272848@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1272848', '1º SGT', 'FERREIRA', 'POUSO ALEGRE', 
      '(35) 99134-9632', '937.684.606-06', 'M-6820135', 
      '1973-12-26'::date, 'ERIC DOS SANTOS FERREIRA'
    );
  END IF;
END $$;

-- Militar: 2º SGT LELES (1317023)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1317023@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1317023', '2º SGT', 'LELES', 'POUSO ALEGRE', 
      '(35) 8852-0730', '053.597.986-02', 'MG-10954379', 
      '1981-01-23'::date, 'WAGNER AUGUSTO LELES DE OLIVEIRA'
    );
  END IF;
END $$;

-- Militar: 2º SGT VINICIUS (1364256)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1364256@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1364256', '2º SGT', 'VINICIUS', 'POUSO ALEGRE', 
      '(35) 99110-4636', '076.553.076-79', 'MG-12647668', 
      '1985-06-26'::date, 'THIAGO VINICIUS DE OLIVEIRA'
    );
  END IF;
END $$;

-- Militar: 2º SGT KLEBER (1264530)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1264530@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1264530', '2º SGT', 'KLEBER', 'POUSO ALEGRE', 
      '(35) 99183-1373', '736.920.346-87', 'M-6168780', 
      '1972-10-08'::date, 'KLEBER PEREIRA DA SILVA'
    );
  END IF;
END $$;

-- Militar: 2º SGT GENOVEZ (1364900)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1364900@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1364900', '2º SGT', 'GENOVEZ', 'POUSO ALEGRE', 
      '(35) 99982-2605', '068.180.286-32', 'MG-11980078', 
      '1984-05-26'::date, 'FABIANO DE CARVALHO GENOVEZ'
    );
  END IF;
END $$;

-- Militar: 2º SGT TALLES (1552223)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1552223@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1552223', '2º SGT', 'TALLES', 'POUSO ALEGRE', 
      '(35) 99809-4414', '014.736.806-54', 'MG-11393941', 
      '1984-02-07'::date, 'TALLES THIAGO DA SILVA BRAGA'
    );
  END IF;
END $$;

-- Militar: 2º SGT BOUSSADA (1482355)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1482355@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1482355', '2º SGT', 'BOUSSADA', 'POUSO ALEGRE', 
      '(37) 99808-5933', '084.714.656-12', 'MG-13217952', 
      '1988-07-21'::date, 'ARTHUR MANOEL JARDIM BOUSSADA'
    );
  END IF;
END $$;

-- Militar: 2º SGT ROGERIO (1265172)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1265172@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1265172', '2º SGT', 'ROGERIO', 'POUSO ALEGRE', 
      '(35) 99907-0443', '040.046.846-84', 'M-7670796', 
      '1988-07-27'::date, 'ROGÉRIO DOS SANTOS CONSTANTINO'
    );
  END IF;
END $$;

-- Militar: 2º SGT SCODELER (1271782)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1271782@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1271782', '2º SGT', 'SCODELER', 'POUSO ALEGRE', 
      '(35) 8471-7359', '739.189.036-72', 'M-5733181', 
      '1972-10-18'::date, 'CRISTIANO SCODELER PEREIRA'
    );
  END IF;
END $$;

-- Militar: 2º SGT VINHAIS (1272707)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1272707@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1272707', '2º SGT', 'VINHAIS', 'POUSO ALEGRE', 
      '(35) 99921-7206', '948.314.836-72', 'M-7505156', 
      '1978-02-13'::date, 'ALEXANDRE VINHAIS ARAÚJO'
    );
  END IF;
END $$;

-- Militar: 2º SGT RODOLFO (1273028)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1273028@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1273028', '2º SGT', 'RODOLFO', 'POUSO ALEGRE', 
      '(35) 99830-4868', '039.734.056-70', 'MG-10527452', 
      '1977-11-17'::date, 'WILLIAN RODOLFO SILVA'
    );
  END IF;
END $$;

-- Militar: 2º SGT ASSIS (1364454)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1364454@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1364454', '2º SGT', 'ASSIS', 'POUSO ALEGRE', 
      '(35) 99805-9069', '033.153.486-00', 'M-7489984', 
      '1976-02-22'::date, 'GERALDO DE ASSIS SILVA'
    );
  END IF;
END $$;

-- Militar: 2º SGT ANDRADE (1319862)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1319862@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1319862', '2º SGT', 'ANDRADE', 'POUSO ALEGRE', 
      '(35) 98897-7734', '049.595.036-02', 'MG-12241754', 
      '1982-03-18'::date, 'MARCELO DE ANDRADE'
    );
  END IF;
END $$;

-- Militar: 3º SGT MAIA (1364629)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1364629@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1364629', '3º SGT', 'MAIA', 'POUSO ALEGRE', 
      '(35) 99993-0193', '061.026.886-43', 'MG-10397090', 
      '1982-12-05'::date, 'LUIZ GUILHERME DE OLIVEIRA MAIA'
    );
  END IF;
END $$;

-- Militar: 3º SGT ALCANTARA (1481167)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1481167@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1481167', '3º SGT', 'ALCANTARA', 'POUSO ALEGRE', 
      '(38) 99132-4581', '097.206.116-93', 'MG-14348339', 
      '1988-12-27'::date, 'VICTOR HUGO DE ALCANTARA'
    );
  END IF;
END $$;

-- Militar: 3º SGT LAURO (1480946)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1480946@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1480946', '3º SGT', 'LAURO', 'POUSO ALEGRE', 
      '(38) 99149-0522', '057.504.766-69', 'MG-12223839', 
      '1982-06-12'::date, 'LAURO ANDERSON RIBEIRO MOREIRA'
    );
  END IF;
END $$;

-- Militar: 3º SGT DANTAS (1481787)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1481787@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1481787', '3º SGT', 'DANTAS', 'POUSO ALEGRE', 
      '(35) 99939-3144', '088.408.756-54', 'MG-14699994', 
      '1987-09-22'::date, 'RAMON DANTAS FERREIRA TUTRUT'
    );
  END IF;
END $$;

-- Militar: 3º SGT RAMON (1481613)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1481613@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1481613', '3º SGT', 'RAMON', 'POUSO ALEGRE', 
      '(32) 99120-6008', '101.399.126-57', 'MG-14734043', 
      '1989-03-05'::date, 'RAMON DOS SANTOS ROSA'
    );
  END IF;
END $$;

-- Militar: 3º SGT JARDEL (1788363)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1788363@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1788363', '3º SGT', 'JARDEL', 'POUSO ALEGRE', 
      '(33) 99174-9324', '081.639.406-70', 'MG-15186228', 
      '1993-04-29'::date, 'JARDEL DE SOUZA FERNANDES'
    );
  END IF;
END $$;

-- Militar: 3º SGT TIBURTINO (1550581)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1550581@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1550581', '3º SGT', 'TIBURTINO', 'POUSO ALEGRE', 
      '(35) 99112-2238', '089.739.956-00', 'MG-7050236', 
      '1987-08-18'::date, 'ANDERSON TIBURTINO DA SILVA SOARES'
    );
  END IF;
END $$;

-- Militar: 3º SGT FERREIRA (1549419)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549419@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549419', '3º SGT', 'FERREIRA', 'POUSO ALEGRE', 
      '(34) 99150-0129', '339.739.828-21', 'SP-426122586', 
      '1985-09-19'::date, 'ADRIANO FERREIRA GUIMARÃES'
    );
  END IF;
END $$;

-- Militar: 3º SGT JOERCIO (1550268)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1550268@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1550268', '3º SGT', 'JOERCIO', 'POUSO ALEGRE', 
      '(35) 99940-2246', '070.849.716-02', 'SP-502413785', 
      '1985-07-20'::date, 'JOERCIO RENATO ALKIMIN'
    );
  END IF;
END $$;

-- Militar: 3º SGT JETTERSON (1554062)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1554062@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1554062', '3º SGT', 'JETTERSON', 'POUSO ALEGRE', 
      '(31) 98263-3145', '093.885.516-64', 'MG-16068356', 
      '1990-12-08'::date, 'JETTERSON FERNANDES SOARES'
    );
  END IF;
END $$;

-- Militar: 3º SGT VENÂNCIO (1550615)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1550615@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1550615', '3º SGT', 'VENÂNCIO', 'POUSO ALEGRE', 
      '(35) 99110-8880', '066.992.806-27', 'MG-13832306', 
      '1988-09-21'::date, 'ANDRÉ VENÂNCIO SOARES'
    );
  END IF;
END $$;

-- Militar: 3º SGT RODRIGUES (1549484)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549484@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549484', '3º SGT', 'RODRIGUES', 'POUSO ALEGRE', 
      '(35) 8816-8477', '314.414.488-61', 'MG-10232489', 
      '1985-03-21'::date, 'VINÍCIUS RODRIGUES DOS SANTOS'
    );
  END IF;
END $$;

-- Militar: 3º SGT JEFFERSON (1549328)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549328@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549328', '3º SGT', 'JEFFERSON', 'POUSO ALEGRE', 
      '(34) 98721-4114', '000.769.411-32', 'GO-4391460', 
      '1982-03-16'::date, 'JEFFERSON RODRIGUES DE OLIVEIRA'
    );
  END IF;
END $$;

-- Militar: 3º SGT SEBASTIÃO (1549880)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549880@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549880', '3º SGT', 'SEBASTIÃO', 'POUSO ALEGRE', 
      '(35) 99735-2423', '065.626.256-70', 'MG-12281024', 
      '1985-03-11'::date, 'JOSÉ SEBASTIÃO DA SILVA'
    );
  END IF;
END $$;

-- Militar: 3º SGT FURLANI (1551324)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1551324@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1551324', '3º SGT', 'FURLANI', 'POUSO ALEGRE', 
      '(35) 99117-1093', '059.712.236-90', 'MG-12592147', 
      '1982-01-13'::date, 'RICARDO FURLANI'
    );
  END IF;
END $$;

-- Militar: 3º SGT FELICIANO (1549989)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549989@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549989', '3º SGT', 'FELICIANO', 'POUSO ALEGRE', 
      '(34) 99695-4874', '953.661.301-82', 'GO-3975455', 
      '1981-06-28'::date, 'EVERTON DOS SANTOS FELICIANO'
    );
  END IF;
END $$;

-- Militar: 3º SGT LEONARDO HENRIQUE (1551969)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1551969@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1551969', '3º SGT', 'LEONARDO HENRIQUE', 'POUSO ALEGRE', 
      '(38) 99725-4466', '067.549.696-95', 'MG-13689203', 
      '1985-02-27'::date, 'LEONARDO HENRIQUE GOMES'
    );
  END IF;
END $$;

-- Militar: 3º SGT MATEUS (1548866)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1548866@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1548866', '3º SGT', 'MATEUS', 'POUSO ALEGRE', 
      '(34) 99275-0193', '086.249.266-10', 'MG-14671866', 
      '1987-10-03'::date, 'MATEUS ALVES DE OLIVEIRA'
    );
  END IF;
END $$;

-- Militar: 3º SGT TIAGO SILVA (1552181)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1552181@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1552181', '3º SGT', 'TIAGO SILVA', 'POUSO ALEGRE', 
      '(35) 98868-5551', '062.495.486-29', 'MG-13479992', 
      '1986-01-29'::date, 'TIAGO CAZELATO SILVA'
    );
  END IF;
END $$;

-- Militar: 3º SGT JEAN (1551381)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1551381@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1551381', '3º SGT', 'JEAN', 'POUSO ALEGRE', 
      '(35) 99847-1755', '086.357.776-89', 'MG-12512030', 
      '1989-07-25'::date, 'JEAN WILLIAM BERNARDES'
    );
  END IF;
END $$;

-- Militar: 3º SGT M. VINÍCIUS (1549864)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549864@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549864', '3º SGT', 'M. VINÍCIUS', 'POUSO ALEGRE', 
      '(35) 99241-0967', '058.360.076-08', 'MG-13304541', 
      '1984-03-13'::date, 'MARCOS VINÍCIUS DE ANDRADE'
    );
  END IF;
END $$;

-- Militar: 3º SGT BRUNO (1549831)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549831@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549831', '3º SGT', 'BRUNO', 'POUSO ALEGRE', 
      '(35) 99930-6157', '079.817.036-03', 'MG-11305847', 
      '1985-12-11'::date, 'BRUNO DA ROCHA MEIRA'
    );
  END IF;
END $$;

-- Militar: 3º SGT CAMARGO (1549104)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549104@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549104', '3º SGT', 'CAMARGO', 'POUSO ALEGRE', 
      '(34) 8408-3449', '896.375.501-00', 'GO-3789663', 
      '1981-02-08'::date, 'RICARDO SANTOS DO CARMO'
    );
  END IF;
END $$;

-- Militar: 3º SGT MÚCIO MARINHO MUNIZ (1550250)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1550250@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1550250', '3º SGT', 'MÚCIO MARINHO MUNIZ', 'POUSO ALEGRE', 
      '(38) 99919-2742', '091.974.596-23', 'MG-15262363', 
      '1990-05-14'::date, 'MÚCIO MARINHO MUNIZ'
    );
  END IF;
END $$;

-- Militar: CB ADAMI (1525922)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1525922@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1525922', 'CB', 'ADAMI', 'POUSO ALEGRE', 
      '(35) 99943-3771', '014.497.626-97', 'MG-12856839', 
      '1984-05-18'::date, 'GLÁUCIO AURÉLIO ADAMI'
    );
  END IF;
END $$;

-- Militar: CB GUSTAVO ROSA (1640408)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1640408@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1640408', 'CB', 'GUSTAVO ROSA', 'POUSO ALEGRE', 
      '(35) 98822-1408', '016.048.826-54', 'MG-14606548', 
      '1987-07-31'::date, 'GUSTAVO PEREIRA ROSA FERRAZANI'
    );
  END IF;
END $$;

-- Militar: CB CARVALHO NOGUEIRA (1638840)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1638840@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1638840', 'CB', 'CARVALHO NOGUEIRA', 'POUSO ALEGRE', 
      '(35) 99254-5166', '079.867.316-80', 'SP-553313125', 
      '1985-11-19'::date, 'VINÍCIUS CARVALHO NOGUEIRA'
    );
  END IF;
END $$;

-- Militar: CB NASCIMENTO (1638717)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1638717@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1638717', 'CB', 'NASCIMENTO', 'POUSO ALEGRE', 
      '(35) 99872-4279', '108.753.626-05', 'MG-17420555', 
      '1993-06-18'::date, 'MATHEUS NASCIMENTO COELHO'
    );
  END IF;
END $$;

-- Militar: CB FERNANDES (1640432)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1640432@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1640432', 'CB', 'FERNANDES', 'POUSO ALEGRE', 
      '(35) 99197-4651', '111.848.316-29', 'MG-14899192', 
      '1992-11-14'::date, 'YGOR FERNANDES ARAÚJO'
    );
  END IF;
END $$;

-- Militar: CB RENÓ (1640556)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1640556@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1640556', 'CB', 'RENÓ', 'POUSO ALEGRE', 
      '(35) 8443-9849', '084.813.306-47', 'MG-12824680', 
      '1986-01-04'::date, 'THOMAZ ANTÔNIO RENÓ'
    );
  END IF;
END $$;

-- Militar: CB DOS SANTOS (1640200)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1640200@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1640200', 'CB', 'DOS SANTOS', 'POUSO ALEGRE', 
      '(35) 98832-4623', '080.398.146-50', 'MG-20619150', 
      '1986-06-20'::date, 'CARLOS EDUARDO DOS SANTOS'
    );
  END IF;
END $$;

-- Militar: CB VELOSO (1639673)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1639673@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1639673', 'CB', 'VELOSO', 'POUSO ALEGRE', 
      '(35) 99831-4383', '076.301.886-41', 'MG-14654912', 
      '1987-06-09'::date, 'VALDIR NEI VELOSO'
    );
  END IF;
END $$;

-- Militar: CB FILIPE (1641513)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1641513@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1641513', 'CB', 'FILIPE', 'POUSO ALEGRE', 
      '(31) 99416-8964', '090.896.966-01', 'MG-15849269', 
      '1990-06-30'::date, 'SAMUEL FILIPE DE OLIVEIRA PEREIRA'
    );
  END IF;
END $$;

-- Militar: CB AGOSTINHO (1649912)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1649912@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1649912', 'CB', 'AGOSTINHO', 'POUSO ALEGRE', 
      '(37) 99814-8122', '113.872.646-05', 'MG-15989999', 
      '1990-11-20'::date, 'GUSTAVO AGOSTINHO'
    );
  END IF;
END $$;

-- Militar: CB JOÃO PAULO (1730332)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1730332@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1730332', 'CB', 'JOÃO PAULO', 'POUSO ALEGRE', 
      '(35) 99852-5749', '118.342.156-76', 'MG-15324897', 
      '1992-12-16'::date, 'JOÃO PAULO CALDEIRA RAMOS'
    );
  END IF;
END $$;

-- Militar: SD JONES (1791417)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1791417@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1791417', 'SD', 'JONES', 'POUSO ALEGRE', 
      '(35) 99946-9746', '016.301.896-00', 'MG-14785370', 
      '1990-08-15'::date, 'WELLITON JONES PEREIRA'
    );
  END IF;
END $$;

-- Militar: SD DIONNATA (1790138)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1790138@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1790138', 'SD', 'DIONNATA', 'POUSO ALEGRE', 
      '(32) 98426-4550', '112.148.066-78', 'MG-16167347', 
      '1993-05-12'::date, 'DIONNATA MARTINS PEDROSA'
    );
  END IF;
END $$;

-- Militar: SD LEMES (1796101)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1796101@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1796101', 'SD', 'LEMES', 'POUSO ALEGRE', 
      '(35) 99147-5269', '100.460.956-67', 'MG-16679377', 
      '1991-11-22'::date, 'AMÂNCIO LEMES FARIA'
    );
  END IF;
END $$;

-- Militar: SD DIEGO (1795798)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1795798@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1795798', 'SD', 'DIEGO', 'POUSO ALEGRE', 
      '(31) 98320-9768', '101.412.116-79', 'MG-14223053', 
      '1992-03-20'::date, 'DIEGO JOSE LUCAS NAZARÉ'
    );
  END IF;
END $$;

-- Militar: SD ALEX SANDRO (1796218)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1796218@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1796218', 'SD', 'ALEX SANDRO', 'POUSO ALEGRE', 
      '(79) 99803-8062', '042.783.925-40', 'SE-31767796', 
      '1990-07-01'::date, 'ALEX SANDRO DE FARIA SANTANA'
    );
  END IF;
END $$;

-- Militar: SD MARCAL (1821891)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1821891@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1821891', 'SD', 'MARCAL', 'POUSO ALEGRE', 
      '(21) 98884-7611', '137.172.587-02', 'RJ-258060094', 
      '1994-09-12'::date, 'VINICIUS MARCAL SANTOS DA SILVA'
    );
  END IF;
END $$;

-- Militar: SD RATTS (1841410)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1841410@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1841410', 'SD', 'RATTS', 'POUSO ALEGRE', 
      '(37) 99116-1582', '017.615.706-92', 'MG-18332814', 
      '2001-03-11'::date, 'GUSTAVO RATTS D'AVILA'
    );
  END IF;
END $$;

-- Militar: SD BASTOS (1843176)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1843176@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1843176', 'SD', 'BASTOS', 'POUSO ALEGRE', 
      '(32) 98400-3394', '145.309.396-69', 'MG-20966499', 
      '2002-08-12'::date, 'VITOR MARTINS BASTOS'
    );
  END IF;
END $$;

-- Militar: SD MARIANA (1844588)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1844588@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1844588', 'SD', 'MARIANA', 'POUSO ALEGRE', 
      '(31) 98586-7304', '126.111.966-56', 'MG-14276879', 
      '1996-03-18'::date, 'MARINA DAMASCENO PAIXÃO'
    );
  END IF;
END $$;

-- Militar: SD AZEVEDO (1841956)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1841956@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1841956', 'SD', 'AZEVEDO', 'POUSO ALEGRE', 
      '(35) 99992-2768', '139.922.576-65', 'MG-20382995', 
      '2001-07-12'::date, 'CARLOS EDUARDO FERREIRA DE AZEVEDO'
    );
  END IF;
END $$;

-- Militar: SD JUNIOR (1842582)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1842582@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1842582', 'SD', 'JUNIOR', 'POUSO ALEGRE', 
      '(21) 99160-5298', '157.975.177-60', 'RJ-214646028', 
      '1997-12-23'::date, 'AUGUSTO WAGNER DE MEDEIROS PEREIRA JUNIOR'
    );
  END IF;
END $$;

-- Militar: SD LEAL (1895713)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1895713@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1895713', 'SD', 'LEAL', 'POUSO ALEGRE', 
      '(35) 91001-2911', '080.180.326-88', 'MG-20547713', 
      '2001-04-09'::date, 'MATHEUS VELOSO LEAL'
    );
  END IF;
END $$;

-- Militar: SD LARCHER (1895028)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1895028@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1895028', 'SD', 'LARCHER', 'POUSO ALEGRE', 
      '(32) 98440-0287', '151.768.476-55', 'MG-17395401', 
      '2001-10-08'::date, 'DOUGLAS AMORIM LARCHER'
    );
  END IF;
END $$;

-- Militar: SD BITENCOURT (1897131)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1897131@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1897131', 'SD', 'BITENCOURT', 'POUSO ALEGRE', 
      '(31) 98815-2229', '144.970.516-25', 'MG-19897386', 
      '2002-11-27'::date, 'SAULO FRANÇA BITENCOURT'
    );
  END IF;
END $$;

-- Militar: 2º TEN MARÇAL (1729839)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1729839@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1729839', '2º TEN', 'MARÇAL', 'ITAJUBA', 
      '(31) 99764-7838', '094.892.536-18', 'MG-15520827', 
      '1990-01-22'::date, 'DOUGLAS MARÇAL BRITO RIBEIRO'
    );
  END IF;
END $$;

-- Militar: SUB TEN JAYME (1223973)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1223973@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1223973', 'SUB TEN', 'JAYME', 'ITAJUBA', 
      '(35) 98438-2633', '028.316.186-81', 'M-8037616', 
      '1977-09-12'::date, 'JAYME CUSTODIO DE CAMPOS'
    );
  END IF;
END $$;

-- Militar: 1º SGT DE MORAIS (1234004)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1234004@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1234004', '1º SGT', 'DE MORAIS', 'PARAISOPOLIS', 
      '(35) 9 9968-8814', '027.131.666-75', 'M-5905742', 
      '1973-08-16'::date, 'VALTECIR DE MORAIS'
    );
  END IF;
END $$;

-- Militar: 2º SGT RIBEIRO (1265271)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1265271@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1265271', '2º SGT', 'RIBEIRO', 'ITAJUBA', 
      '(35) 8476-7789', '948.680.506-72', 'M-7246612', 
      '1972-04-11'::date, 'FRANCISLEY WILSON RIBEIRO'
    );
  END IF;
END $$;

-- Militar: 2º SGT EDMILSON (1224047)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1224047@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1224047', '2º SGT', 'EDMILSON', 'ITAJUBA', 
      '(35) 98401-0135', '028.283.866-00', 'M-8825638', 
      '1975-10-19'::date, 'EDMILSON RODRIGUES DA COSTA'
    );
  END IF;
END $$;

-- Militar: 2º SGT ALEX (1551787)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1551787@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1551787', '2º SGT', 'ALEX', 'ITAJUBA', 
      '(35) 99913-0391', '081.953.916-30', 'MG-15133412', 
      '1986-03-07'::date, 'ALEX CRISTIANO DOS SANTOS'
    );
  END IF;
END $$;

-- Militar: 2º SGT MARCOS VAZ (1264290)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1264290@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1264290', '2º SGT', 'MARCOS VAZ', 'ITAJUBA', 
      '(35) 99854-2809', '035.029.916-18', 'MG-12622061', 
      '1977-09-28'::date, 'MARCOS ANTONIO DOS SANTOS VAZ'
    );
  END IF;
END $$;

-- Militar: 3º SGT VAGNER (1320191)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1320191@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1320191', '3º SGT', 'VAGNER', 'ITAJUBA', 
      '(12) 997927170', '159.676.608-52', 'MG-14241354', 
      '1976-02-03'::date, 'VAGNER SOARES DA CUNHA'
    );
  END IF;
END $$;

-- Militar: 3º SGT CARDOSO (1272491)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1272491@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1272491', '3º SGT', 'CARDOSO', 'ITAJUBA', 
      '(35) 98849 1162', '029.903.716-99', 'M-8037736', 
      '1978-07-08'::date, 'ANDERSON HENRIQUE CARDOSO'
    );
  END IF;
END $$;

-- Militar: 3º SGT SERGIO (1727841)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1727841@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1727841', '3º SGT', 'SERGIO', 'ITAJUBA', 
      '(31) 98978-2160', '086.288.126-95', 'MG-10829288', 
      '1989-01-25'::date, 'SÉRGIO LUIZ TAVARES PINTO'
    );
  END IF;
END $$;

-- Militar: 3º SGT GOMES (1525906)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1525906@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1525906', '3º SGT', 'GOMES', 'ITAJUBA', 
      '(35) 98892-1925', '074.654.456-12', 'MG-13537411', 
      '1986-06-10'::date, 'GILSON BATISTA GOMES'
    );
  END IF;
END $$;

-- Militar: 3º SGT SARKIS (1526276)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1526276@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1526276', '3º SGT', 'SARKIS', 'ITAJUBA', 
      '(35) 98804-4998', '044.164.516-01', 'MG-11587987', 
      '1981-07-21'::date, 'SARKIS SALES EL KHOURI SOUZA'
    );
  END IF;
END $$;

-- Militar: 3º SGT LIDOMAR (1524800)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1524800@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1524800', '3º SGT', 'LIDOMAR', 'ITAJUBA', 
      '(38) 99987-1229', '075.402.746-54', 'MG-14312832', 
      '1985-09-07'::date, 'LIDOMAR DE SOUZA GUIMARAES'
    );
  END IF;
END $$;

-- Militar: 3º SGT VALERIANO (1550029)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1550029@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1550029', '3º SGT', 'VALERIANO', 'ITAJUBA', 
      '(35) 98451-1165', '078.344.176-22', 'MG-14100882', 
      '1986-04-16'::date, 'WILLIAM AGNALDO VALERIANO'
    );
  END IF;
END $$;

-- Militar: CB SANTOS (1548593)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1548593@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1548593', 'CB', 'SANTOS', 'PARAISOPOLIS', 
      '(35) 99194-2343', '324.389.528-65', 'RJ-335598341', 
      '1983-11-08'::date, 'THIAGO JOSÉ DOS SANTOS'
    );
  END IF;
END $$;

-- Militar: 3º SGT ROBSON (1549229)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549229@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549229', '3º SGT', 'ROBSON', 'PARAISOPOLIS', 
      '(34) 99887-9270', '080.747.306-54', 'MG-15146613', 
      '1988-12-08'::date, 'ROBSON ALVES PIMENTA JUNIOR'
    );
  END IF;
END $$;

-- Militar: CB SAMIRO (1638576)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1638576@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1638576', 'CB', 'SAMIRO', 'ITAJUBA', 
      '(35) 99173-3944', '090.539.656-10', 'MG-15922431', 
      '1990-12-20'::date, 'SAMIRO CAMPOS DA SILVEIRA'
    );
  END IF;
END $$;

-- Militar: CB DASSAEV (1640580)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1640580@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1640580', 'CB', 'DASSAEV', 'ITAJUBA', 
      '(35) 99895-9117', '097.774.766-20', 'MG-16243092', 
      '1988-12-16'::date, 'DASSAEV NANNINI DOS SANTOS'
    );
  END IF;
END $$;

-- Militar: CB FRANKLIN (1640465)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1640465@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1640465', 'CB', 'FRANKLIN', 'ITAJUBA', 
      '(35) 98814-6976', '096.654.776-41', 'MG-10264442', 
      '1989-09-12'::date, 'IGOR PLUM FRANKLIN DA CUNHA'
    );
  END IF;
END $$;

-- Militar: CB MARIO HENRIQUE (1644616)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1644616@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1644616', 'CB', 'MARIO HENRIQUE', 'ITAJUBA', 
      '(35) 99804-5599', '121.699.346-77', 'MG-19006332', 
      '1992-08-18'::date, 'MÁRIO HENRIQUE MENDES SILVA'
    );
  END IF;
END $$;

-- Militar: CB EDMAR (1643964)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1643964@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1643964', 'CB', 'EDMAR', 'ITAJUBA', 
      '(35) 98448-2340', '089.794.716-96', 'MG-15772189', 
      '1988-07-20'::date, 'JOSÉ EDMAR APARECIDO DA SILVA'
    );
  END IF;
END $$;

-- Militar: CB GUILHERME (1726918)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1726918@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1726918', 'CB', 'GUILHERME', 'ITAJUBA', 
      '(35) 99895-9612', '062.897.919-31', 'SC-54292204', 
      '1987-06-16'::date, 'GUILHERME ÁVILA DE CESERO'
    );
  END IF;
END $$;

-- Militar: CB GONZAGA (1730373)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1730373@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1730373', 'CB', 'GONZAGA', 'ITAJUBA', 
      '(35) 8408-0909', '129.219.846-01', 'MG-19198164', 
      '1997-06-13'::date, 'LUIZ FELIPE MARQUES GONZAGA'
    );
  END IF;
END $$;

-- Militar: SD COELHO (1792985)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1792985@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1792985', 'SD', 'COELHO', 'ITAJUBA', 
      '(31) 981162745', '109.593.796-06', 'MG-12416443', 
      '1993-03-24'::date, 'ARTHUR BOLIVAR GIBIM COELHO'
    );
  END IF;
END $$;

-- Militar: SD BRITO (1793660)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1793660@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1793660', 'SD', 'BRITO', 'ITAJUBA', 
      '(35) 99245-8707', '069.755.066-47', 'MG-14167045', 
      '1985-04-21'::date, 'LUIZ FELIPE DE BRITO'
    );
  END IF;
END $$;

-- Militar: SD FREITAS (1822493)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1822493@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1822493', 'SD', 'FREITAS', 'ITAJUBA', 
      '(12) 98156-2767', '430.592.328-90', 'SP-387250219', 
      '1999-06-18'::date, 'MIGUEL JULIO DE FREITAS'
    );
  END IF;
END $$;

-- Militar: SD JOSÉ (1895879)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1895879@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1895879', 'SD', 'JOSÉ', 'ITAJUBA', 
      '(35) 99837-9717', '018.295.636-96', 'MG-17405402', 
      '1998-03-18'::date, 'JOSÉ LUCAS DA SILVA'
    );
  END IF;
END $$;

-- Militar: SD COSTA COELHO (1897065)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1897065@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1897065', 'SD', 'COSTA COELHO', 'ITAJUBA', 
      '(32) 99935-5898', '118.479.856-70', 'MG-11847985670', 
      '1995-09-20'::date, 'ANDRESA CAROLINA DA SILVA COSTA E COELHO'
    );
  END IF;
END $$;

-- Militar: SD LUZ (1895986)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1895986@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1895986', 'SD', 'LUZ', 'ITAJUBA', 
      '(31) 98245-2091', '703.707.626-06', 'MG-17294101', 
      '2003-12-31'::date, 'PEDRO HENRIQUE LUZ MOREIRA'
    );
  END IF;
END $$;

-- Militar: SD BRAGA (1896554)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1896554@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1896554', 'SD', 'BRAGA', 'ITAJUBA', 
      '(35) 99979-7937', '136.971.356-86', 'MG-15481478', 
      '2000-01-10'::date, 'MATHEUS FELIPE BRAGA NEVES'
    );
  END IF;
END $$;

-- Militar: SD PIMENTA (1893700)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1893700@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1893700', 'SD', 'PIMENTA', 'ITAJUBA', 
      '(31) 99965-1616', '129.014.926-73', 'MG-16735994', 
      '1994-02-10'::date, 'LAURA CRISTINA PIMENTA'
    );
  END IF;
END $$;

-- Militar: SD BRUGNI (1897032)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1897032@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1897032', 'SD', 'BRUGNI', 'ITAJUBA', 
      '(24) 99954-1480', '172.399.027-22', 'RJ-300566221', 
      '2000-12-18'::date, 'DANIEL BRUGNI BORBA RIBEIRO'
    );
  END IF;
END $$;

-- Militar: SD RAFAEL (1896232)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1896232@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1896232', 'SD', 'RAFAEL', 'ITAJUBA', 
      '(32) 99967-1009', '134.974.796-32', 'MG-13497479632', 
      '1998-07-28'::date, 'RAFAEL OLIVEIRA DIAS'
    );
  END IF;
END $$;

-- Militar: SD MELO (1896117)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1896117@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1896117', 'SD', 'MELO', 'ITAJUBA', 
      '(32) 99151-5678', '117.700.656-10', 'MG-18229065', 
      '1995-10-31'::date, 'IGOR DE MELO SOUZA'
    );
  END IF;
END $$;

-- Militar: 1º TEN LINCOLN (1272640)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1272640@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1272640', '1º TEN', 'LINCOLN', 'EXTREMA', 
      '(35) 99830-0193', '007.131.836-40', 'MG-7628558', 
      '1977-01-26'::date, 'LINCOLN FERREIRA DE AZEVEDO'
    );
  END IF;
END $$;

-- Militar: 1º SGT W. BRAGA (1429554)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1429554@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1429554', '1º SGT', 'W. BRAGA', 'EXTREMA', 
      '(35) 99214-8578', '014.900.416-80', 'MG-12053567', 
      '1982-09-08'::date, 'FERNANDO WELLINGTON BRAGA DOS SANTOS'
    );
  END IF;
END $$;

-- Militar: 2º SGT ANDERSON (1550599)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1550599@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1550599', '2º SGT', 'ANDERSON', 'EXTREMA', 
      '(11) 98998-6098', '088.490.356-75', 'MG-15466058', 
      '1989-02-22'::date, 'ANDERSON SOARES DE OLIVEIRA'
    );
  END IF;
END $$;

-- Militar: 3º SGT PEREIRA (1364728)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1364728@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1364728', '3º SGT', 'PEREIRA', 'EXTREMA', 
      '(35) 8439-1134', '070.003.076-09', 'MG-12575392', 
      '1985-08-31'::date, 'EDSON PEREIRA DA SILVA'
    );
  END IF;
END $$;

-- Militar: 3º SGT FACHINELI (1479138)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1479138@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1479138', '3º SGT', 'FACHINELI', 'EXTREMA', 
      '(34) 99164-0960', '066.408.556-31', 'MG-12846994', 
      '1984-06-19'::date, 'TIAGO FACHINELLI'
    );
  END IF;
END $$;

-- Militar: 3º SGT ALEXANDRO (1526680)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1526680@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1526680', '3º SGT', 'ALEXANDRO', 'EXTREMA', 
      '(35) 98820-1470', '015.200.986-85', 'MG-10067929', 
      '1986-05-07'::date, 'ALEXANDRO MORENO'
    );
  END IF;
END $$;

-- Militar: 3º SGT NETO (1525013)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1525013@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1525013', '3º SGT', 'NETO', 'EXTREMA', 
      '(34) 99192-4988', '095.932.486-09', 'MG-10037870', 
      '1988-12-09'::date, 'ADERBAL GUIMARAES BORGES NETO'
    );
  END IF;
END $$;

-- Militar: 3º SGT MARTINS (1728682)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1728682@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1728682', '3º SGT', 'MARTINS', 'EXTREMA', 
      '(37) 99122-1349', '393.851.868-50', 'MG-22186817', 
      '1989-01-23'::date, 'LUCAS MARTINS ARAUJO'
    );
  END IF;
END $$;

-- Militar: 3º SGT HENRIQUE (1552140)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1552140@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1552140', '3º SGT', 'HENRIQUE', 'EXTREMA', 
      '(35) 98855-9791', '098.233.296-30', 'MG-13245129', 
      '1990-05-12'::date, 'PEDRO HENRIQUE DA SILVA COELHO'
    );
  END IF;
END $$;

-- Militar: 3º SGT WESLLEY (1549179)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549179@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549179', '3º SGT', 'WESLLEY', 'EXTREMA', 
      '(34) 99766-4403', '091.317.996-55', 'MG-15885980', 
      '1986-08-05'::date, 'WESLLEY FRANCIS FERREIRA ANTUNES'
    );
  END IF;
END $$;

-- Militar: 3º SGT DOUGLAS (1549401)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549401@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549401', '3º SGT', 'DOUGLAS', 'EXTREMA', 
      '(34) 99121-2481', '076.785.556-60', 'MG-13540844', 
      '1985-04-27'::date, 'DOUGLAS FERNANDO RIBEIRO'
    );
  END IF;
END $$;

-- Militar: 3º SGT MARÇAL (1549096)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1549096@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1549096', '3º SGT', 'MARÇAL', 'EXTREMA', 
      '(34) 98823-9856', '095.389.306-57', 'MG-13548982', 
      '1989-09-24'::date, 'FERNANDO CASTRO MARÇAL'
    );
  END IF;
END $$;

-- Militar: CB EMERSON CARDOSO (1525765)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1525765@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1525765', 'CB', 'EMERSON CARDOSO', 'EXTREMA', 
      '(34) 99136-1784', '303.651.928-99', 'SP-348768278', 
      '1982-06-21'::date, 'EMERSON CARDOSO'
    );
  END IF;
END $$;

-- Militar: CB GOMES (1636497)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1636497@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1636497', 'CB', 'GOMES', 'EXTREMA', 
      '(35) 99888-1699', '016.143.376-67', 'MG-16373808', 
      '1994-12-12'::date, 'MATHEUS GOMES CAMPOS CLARO'
    );
  END IF;
END $$;

-- Militar: CB ALVIM (1644285)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1644285@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1644285', 'CB', 'ALVIM', 'EXTREMA', 
      '(32) 99134-4890', '089.949.286-00', 'MG-14777935', 
      '1989-12-11'::date, 'ANDRÉ ALVIM MOREIRA'
    );
  END IF;
END $$;

-- Militar: CB FURTADO (1729003)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1729003@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1729003', 'CB', 'FURTADO', 'EXTREMA', 
      '(32) 99100-1096', '130.074.137-61', 'RJ-214828782', 
      '1988-10-06'::date, 'JOAREZ MONTEIRO FURTADO LEAL DO AMARAL'
    );
  END IF;
END $$;

-- Militar: SD MOTTA (1789106)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1789106@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1789106', 'SD', 'MOTTA', 'EXTREMA', 
      '(21) 98092-7315', '104.618.666-33', 'MG-14691527', 
      '1992-08-09'::date, 'LUCIANO GONÇALVES MOTTA'
    );
  END IF;
END $$;

-- Militar: SD TEMPONI (1786649)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1786649@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1786649', 'SD', 'TEMPONI', 'EXTREMA', 
      '(31) 97510-8566', '098.152.056-17', 'MG-14647138', 
      '1992-06-02'::date, 'MATEUS TEMPONI VILARINO GODINHO'
    );
  END IF;
END $$;

-- Militar: SD LAVATORI (1785781)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1785781@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1785781', 'SD', 'LAVATORI', 'EXTREMA', 
      '(21) 97145-9618', '130.656.147-74', 'RJ-209487651', 
      '1992-05-25'::date, 'GUSTAVO HENRIQUE LAVATORI'
    );
  END IF;
END $$;

-- Militar: SD EDUARDO (1786060)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1786060@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1786060', 'SD', 'EDUARDO', 'EXTREMA', 
      '(31) 99747-8647', '085.337.596-81', 'MG-15478533', 
      '1997-05-13'::date, 'CARLOS EDUARDO DOS SANTOS LIMA'
    );
  END IF;
END $$;

-- Militar: SD BRENO (1788199)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1788199@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1788199', 'SD', 'BRENO', 'EXTREMA', 
      '(31) 8420-8080', '071.570.336-66', 'MG-12478543', 
      '1992-09-17'::date, 'BRENO HENRIQUE CORREIA NASCIMENTO'
    );
  END IF;
END $$;

-- Militar: SD NUNES (1844281)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1844281@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1844281', 'SD', 'NUNES', 'EXTREMA', 
      '(11) 96911-3214', '475.130.178-08', 'SP-500089401', 
      '1999-06-14'::date, 'RODNEY NUNES BARBOSA'
    );
  END IF;
END $$;

-- Militar: SD VENENO (1843754)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1843754@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1843754', 'SD', 'VENENO', 'EXTREMA', 
      '(33) 99707-8625', '133.108.516-05', 'MG-15275359', 
      '1999-02-17'::date, 'GABRIEL DIAS ALVES VENENO'
    );
  END IF;
END $$;

-- Militar: SD PAULA ABREU (1840768)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1840768@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1840768', 'SD', 'PAULA ABREU', 'EXTREMA', 
      '(32) 99161-7974', '022.651.796-98', 'MG-20700363', 
      '2000-03-30'::date, 'PAULA DE ABREU GUIMARÃES'
    );
  END IF;
END $$;

-- Militar: SD GIOVANNA (1840578)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1840578@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1840578', 'SD', 'GIOVANNA', 'EXTREMA', 
      '(35) 99897-3746', '023.633.156-69', 'MG-20998932', 
      '2000-03-25'::date, 'GIOVANNA SILVA RIBEIRO'
    );
  END IF;
END $$;

-- Militar: SD FERREIRA (1895267)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1895267@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1895267', 'SD', 'FERREIRA', 'EXTREMA', 
      '(34) 99672-6527', '020.735.626-20', 'MG-20155208', 
      '1997-12-01'::date, 'JOÃO PAULO ALVES FERREIRA'
    );
  END IF;
END $$;

-- Militar: SD LARISSA FORTUNATO (1893452)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1893452@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1893452', 'SD', 'LARISSA FORTUNATO', 'EXTREMA', 
      '(31) 99450-6073', '159.309.136-25', 'MG-21.507.541', 
      '2005-06-23'::date, 'LARISSA SILVA FORTUNATO'
    );
  END IF;
END $$;

-- Militar: SD MONTEIRO (1895911)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1895911@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1895911', 'SD', 'MONTEIRO', 'EXTREMA', 
      '(32) 8469-8791', '158.987.856-63', 'MG-21.206.357', 
      '2005-09-20'::date, 'LUCAS MONTEIRO DA SILVA'
    );
  END IF;
END $$;

-- Militar: SD JÚNIOR (1896539)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'mil1896539@cbmmg.mg.gov.br';
  v_encrypted_password text := extensions.crypt('bm123456', extensions.gen_salt('bf', 10));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    -- auth.users
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false, '', '', '', ''
    );

    -- auth.identities
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );

    -- public.users
    INSERT INTO public.users (
      id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
    ) VALUES (
      v_user_id, 'OPERACIONAL', '1896539', 'SD', 'JÚNIOR', 'EXTREMA', 
      '(32) 99126-4035', '135.411.426-42', 'MG-25045636', 
      '2001-12-17'::date, 'NILSON ALCANTARA JUNIOR'
    );
  END IF;
END $$;
COMMIT;