import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 환경변수 누락 시 서버 렌더 전체가 중단되지 않도록 안전 기본값으로 폴백한다.
    const safeUrl = supabaseUrl || "https://example.supabase.co";
    const safeAnonKey = supabaseAnonKey || "invalid-anon-key";

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("[Supabase][server] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }

    return createServerClient(
        safeUrl,
        safeAnonKey,
        {
            db: { schema: "tinyhoney" },
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing user sessions.
                    }
                },
            },
        }
    );
}
