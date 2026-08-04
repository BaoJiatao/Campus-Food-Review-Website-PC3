import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://jwsymrhazhpyeiuejzxk.supabase.co";

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_1Sab70x6g_5MfrXBjjpxRg_9RADp2g5";

export const supabase = createClient(supabaseUrl, supabaseKey);