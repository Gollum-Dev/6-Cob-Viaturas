import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log("Verificando a estrutura da tabela users...");
  const { data, error } = await supabase.from('users').select('*').limit(1);
  
  if (error) {
    console.error("Erro ao ler tabela users:", error);
  } else {
    if (data && data.length > 0) {
      console.log("Colunas encontradas:", Object.keys(data[0]));
    } else {
      console.log("Tabela vazia, mas a query passou. Tentando inserir um dado fake e ver as colunas de erro...");
    }
  }
}

main();
