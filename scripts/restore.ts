import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Para restaurar dados com todas as permissões, você precisará usar a SERVICE ROLE KEY do Supabase.
// Adicione SUPABASE_SERVICE_ROLE_KEY no seu arquivo .env na raiz do projeto.
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("ERRO: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no arquivo .env");
  console.error("A Service Role Key é necessária para ignorar as regras de segurança (RLS) durante a restauração.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// A ORDEM É EXTREMAMENTE IMPORTANTE PARA NÃO QUEBRAR CHAVES ESTRANGEIRAS (Foreign Keys)
const RESTORE_ORDER = [
  'users',
  'vehicles',
  'load_maps',
  'load_map_sectors',
  'load_map_items',
  'checklists',
  'load_checklists',
  'commitments',
  'maintenance',
  'time_bank',
  'audit_logs',
  'messages'
];

async function restoreBackup(filePath: string) {
  try {
    const absolutePath = path.resolve(filePath);
    console.log(`Lendo arquivo de backup: ${absolutePath}`);
    
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const backupData = JSON.parse(fileContent);

    console.log("Iniciando restauração dos dados...");

    for (const table of RESTORE_ORDER) {
      if (!backupData[table] || backupData[table].length === 0) {
        console.log(`Tabela '${table}' vazia ou não encontrada no backup. Pulando...`);
        continue;
      }

      const rows = backupData[table];
      console.log(`Restaurando ${rows.length} registros na tabela '${table}'...`);

      // O upsert tenta inserir os registros e caso o ID já exista, ele atualiza
      const { error } = await supabase.from(table).upsert(rows);

      if (error) {
        console.error(`❌ Erro ao restaurar tabela '${table}':`, error.message);
      } else {
        console.log(`✅ Tabela '${table}' restaurada com sucesso!`);
      }
    }

    console.log("\n🎉 Restauração finalizada!");

  } catch (err: any) {
    console.error("Erro fatal durante a restauração:", err.message);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Uso: npx tsx scripts/restore.ts <caminho_do_arquivo.json>");
  process.exit(1);
}

restoreBackup(args[0]);
