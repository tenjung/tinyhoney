import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const safeUrl = supabaseUrl || "https://example.supabase.co";
    const safeAnonKey = supabaseAnonKey || "invalid-anon-key";

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("[Supabase][client] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }

    return createBrowserClient(
        safeUrl,
        safeAnonKey,
        {
            db: { schema: "tinyhoney" },
        }
    );
}
