import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { performance } from 'perf_hooks';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const adminEmail = 'mil1234567@cbmmg.mg.gov.br'; // From test-login.mjs maybe?
  const adminPassword = 'admin'; 
  
  let start = performance.now();
  const { data: adminSessionData, error: loginError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });
  console.log(`Login took: ${performance.now() - start}ms`);

  if (loginError) {
      console.error("Login failed:", loginError);
      return;
  }
  const adminSession = adminSessionData.session;

  const newMil = '9999999';
  const newEmail = `mil${newMil}@cbmmg.mg.gov.br`;
  const newPassword = 'testpassword';

  console.log("Signing up new user...");
  start = performance.now();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: newEmail,
    password: newPassword,
  });
  console.log(`SignUp took: ${performance.now() - start}ms`);

  console.log("Restoring admin session...");
  start = performance.now();
  if (adminSession) {
    await supabase.auth.setSession({
      access_token: adminSession.access_token,
      refresh_token: adminSession.refresh_token,
    });
  }
  console.log(`setSession took: ${performance.now() - start}ms`);

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

    // Clean up
    await supabase.rpc('delete_military_user', { p_user_id: authData.user.id });
  }

  console.log("Done.");
}

main();
