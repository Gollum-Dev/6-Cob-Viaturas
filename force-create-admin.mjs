import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltam variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY no .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const milNumber = '1361104';
  const email = `mil${milNumber}@cbmmg.mg.gov.br`;
  const password = 'Bm@136';

  console.log(`Tentando registrar o email: ${email}...`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('User already registered')) {
      console.error(`\nERRO: O usuário ${email} já existe no módulo de Autenticação (Authentication -> Users) do Supabase.`);
      console.error(`Você PRECISA apagá-lo lá pelo painel do Supabase antes de rodar este script novamente!`);
    } else {
      console.error("\nErro ao criar usuário:", error);
    }
    return;
  }

  if (data.user) {
    console.log(`\nSUCESSO! O usuário foi criado de forma segura no Supabase. ID: ${data.user.id}`);
    console.log(`\n======================================================`);
    console.log(`PASSO FINAL: Copie e cole o código abaixo no SQL Editor do Supabase para confirmar o e-mail e dar permissão de Administrador:`);
    console.log(`======================================================\n`);
    console.log(`
-- 1. Forçar a confirmação do e-mail
UPDATE auth.users SET email_confirmed_at = now() WHERE id = '${data.user.id}';

-- 2. Apagar qualquer resquício do perfil antigo desse militar
DELETE FROM public.users WHERE mil_number = '${milNumber}';

-- 3. Inserir o perfil como Administrador
INSERT INTO public.users (id, role, mil_number, rank, name, unit, full_name)
VALUES ('${data.user.id}', 'ADMINISTRADOR', '${milNumber}', 'CEL', 'ADMIN', '6COB', 'ADMINISTRADOR 6COB');
    `);
  }
}

main();
