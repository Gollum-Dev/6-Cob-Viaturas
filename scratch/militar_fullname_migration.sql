-- 1. Adicionar coluna full_name à tabela public.users
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 2. Converter todos os postos/graduações existentes para maiúsculo
UPDATE public.users SET rank = UPPER(rank);

-- 3. Atualizar a função RPC de cadastro para suportar o novo campo p_full_name
CREATE OR REPLACE FUNCTION public.create_military_user(
  p_mil_number text,
  p_password text,
  p_role text,
  p_rank text,
  p_name text,
  p_unit text,
  p_phone text DEFAULT NULL,
  p_cpf text DEFAULT NULL,
  p_rg text DEFAULT NULL,
  p_birth_date date DEFAULT NULL,
  p_full_name text DEFAULT NULL
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'extensions'
 AS $function$
DECLARE
  v_user_id uuid;
  v_email text;
  v_encrypted_password text;
BEGIN
  -- Check admin permission
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'ADMINISTRADOR'
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem cadastrar militares.';
  END IF;

  v_email := 'mil' || p_mil_number || '@cbmmg.mg.gov.br';

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    RAISE EXCEPTION 'Militar já cadastrado com este número.';
  END IF;

  v_encrypted_password := extensions.crypt(p_password, extensions.gen_salt('bf', 10));

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_anonymous, is_sso_user,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    v_email, v_encrypted_password, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now(), false, false, '', '', '', ''
  ) RETURNING id INTO v_user_id;

  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_user_id, v_user_id::text,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
    'email', now(), now(), now()
  );

  INSERT INTO public.users (
    id, role, mil_number, rank, name, unit, phone, cpf, rg, birth_date, full_name
  ) VALUES (
    v_user_id, p_role, p_mil_number, UPPER(p_rank), p_name, p_unit, p_phone, p_cpf, p_rg, p_birth_date, p_full_name
  );

  RETURN v_user_id;
END;
$function$;
