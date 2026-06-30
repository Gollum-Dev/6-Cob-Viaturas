import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(url, key);

async function createUser() {
  const milNumber = '1361104';
  const password = 'Bm@136';
  const email = `mil${milNumber}@cbmmg.mg.gov.br`;

  console.log(`Buscando id do usuário auth para: ${email}`);
  
  // Como o auth já foi criado, vamos tentar fazer login para pegar o ID
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    console.error('Erro ao pegar usuário no Auth (talvez não tenha sido criado):', authError?.message);
    return;
  }

  console.log('ID do usuário:', authData.user.id);

  // 2. Inserir na tabela public.users
  const { data: dbData, error: dbError } = await supabase.from('users').insert({
    id: authData.user.id,
    mil_number: milNumber,
    role: 'ADMINISTRADOR',
    rank: 'SGT',
    name: 'Admin',
    unit: '6 COB',
  });

  if (dbError) {
    console.error('Erro ao inserir em public.users:', dbError.message);
  } else {
    console.log('Usuário inserido na tabela public.users com sucesso!');
  }
}

createUser();
