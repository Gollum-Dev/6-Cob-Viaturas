import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ufkyzxjrgqahpzuwlgws.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVma3l6eGpyZ3FhaHB6dXdsZ3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTk5OTAsImV4cCI6MjA5NDUzNTk5MH0.sCJkMEMUiCeXoqUBjEuDIp_hNCa8K1LGO735MffC218';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('users').select('*');
  console.log('Users count:', data?.length);
  if (error) console.error('Error:', error);
}
test();
