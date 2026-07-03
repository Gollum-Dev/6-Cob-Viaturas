import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { performance } from 'perf_hooks';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const adminEmail = 'mil2098765@cbmmg.mg.gov.br'; // From test-login.mjs maybe?
  const adminPassword = 'admin'; 
  // Wait, let's just use whatever login works or skip if not possible.
  
  // Actually, signUp can be slow due to hashing or triggers on auth.users in Supabase.
  const newMil = '9999999';
  const newEmail = `mil${newMil}@cbmmg.mg.gov.br`;
  const newPassword = 'testpassword';

  console.log("Signing up new user...");
  let start = performance.now();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: newEmail,
    password: newPassword,
  });
  console.log(`SignUp took: ${performance.now() - start}ms`);

  if (authError) {
      console.error("SignUp failed:", authError);
  }

  console.log("Calling RPC...");
  start = performance.now();
  if (authData?.user?.id) {
    const { error: rpcError } = await supabase.rpc('setup_new_military_user', {
      p_user_id: authData.user.id,
      p_mil_number: newMil,
      p_role: 'OPERACIONAL',
      p_rank: 'SD',
      p_name: 'TESTE',
      p_unit: '6COB',
      p_phone: null,
      p_cpf: null,
      p_rg: null,
      p_birth_date: null,
      p_full_name: 'TESTE FULL'
    });
    console.log(`RPC took: ${performance.now() - start}ms`);

    if (rpcError) {
        console.error("RPC failed:", rpcError);
    }
    
    // Clean up
    await supabase.rpc('delete_military_user', { p_user_id: authData.user.id });
  }

  console.log("Done.");
}

main();
