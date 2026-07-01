import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { error } = await supabase.from('users').insert({ fake_column_does_not_exist: 1 });
  console.log("Erro no insert (esperado para descobrir as colunas reais):");
  console.log(error);
}

main();
