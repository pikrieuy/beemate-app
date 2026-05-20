import { createClient } from "@supabase/supabase-js";

// Browser client — pakai anon key, untuk Realtime subscription
// Aman karena RLS sudah aktif di semua tabel
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  supabaseClient = createClient(url, anonKey, {
    realtime: { params: { eventsPerSecond: 10 } },
  });

  return supabaseClient;
}
