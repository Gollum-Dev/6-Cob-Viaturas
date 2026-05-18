import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

async function run() {
  console.log('Querying schema from information_schema...');
  const { data, error } = await supabase
    .from('vehicles')
    .select('id')
    .limit(1);
    
  console.log('Table accessibility check - error:', error);

  // We can execute a raw SQL query or check via RPC if available, or just run a direct query on information_schema if the user's RLS or API permissions allow.
  // Actually, we can fetch from a system table or use a postgrest direct call, or check the database migration files if any exist!
  // Let's also see if there are any migration files in the workspace.
}

run();
