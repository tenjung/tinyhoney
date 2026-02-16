import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let supabaseResponse = NextResponse.next({ request });

    // Vercel 환경변수 누락 시 미들웨어 전체 실패를 방지한다.
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("[Middleware] Supabase env is missing.");
        return supabaseResponse;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    try {
        // Refresh session if expired
        await supabase.auth.getUser();
    } catch (error) {
        console.error("[Middleware] Failed to refresh session.", error);
    }

    return supabaseResponse;
}
