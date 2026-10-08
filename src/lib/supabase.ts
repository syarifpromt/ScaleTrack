import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lgkpdlnbshenbjufwemg.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_GJ2L4TxTnvqzM5f1nqAV-w_OVxiwudE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
