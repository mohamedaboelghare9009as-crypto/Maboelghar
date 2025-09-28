import { supabase } from '../lib/supabaseClient';

async function testConnection() {
  const { data, error } = await supabase.from('doctors').select('*');

  if (error) {
    console.error('❌ Connection failed:', error.message);
  } else {
    console.log('✅ Connection successful! Data:', data);
  }
}

testConnection();
