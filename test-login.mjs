import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  console.log("Tentando login com 1361104...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'mil1361104@cbmmg.mg.gov.br',
    password: 'Bm@136'
  });

  if (authError) {
    console.error("Erro no login:", authError);
    return;
  }

  console.log("Login OK! User ID:", authData.user.id);

  console.log("Tentando buscar o perfil...");
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    console.error("Erro ao buscar perfil:", profileError);
  } else {
    console.log("Perfil encontrado:", profile);
  }
}

main();
