"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
    const initialPassword = useMemo(() => searchParams.get("password") ?? "", [searchParams]);

    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState(initialPassword);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const autoTriedRef = useRef(false);

    async function signIn(emailValue: string, passwordValue: string) {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: emailValue,
            password: passwordValue,
        });

        setLoading(false);

        if (signInError) {
            setError(signInError.message);
            return;
        }

        router.push("/");
        router.refresh();
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await signIn(email, password);
    }

    useEffect(() => {
        if (autoTriedRef.current) return;
        if (!initialEmail || !initialPassword) return;
        autoTriedRef.current = true;

        void signIn(initialEmail, initialPassword);
    }, [initialEmail, initialPassword]);

    return (
        <div className="dash-wrap" style={{ maxWidth: "28rem", paddingTop: "4rem" }}>
            <section className="card-static" style={{ padding: "2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🐝</div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-slate-900)" }}>로그인</h1>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-slate-500)", marginTop: "0.5rem" }}>
                        티꿀모아에 오신 것을 환영합니다
                    </p>
                </div>

                <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-slate-700)", marginBottom: "0.25rem", display: "block" }}>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="input"
                            style={{ height: "2.75rem" }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-slate-700)", marginBottom: "0.25rem", display: "block" }}>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input"
                            style={{ height: "2.75rem" }}
                            required
                        />
                    </div>
                    {error ? (
                        <p style={{ fontSize: "0.8125rem", color: "var(--color-rose-600)" }}>{error}</p>
                    ) : null}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", height: "2.75rem", fontSize: "0.875rem", fontWeight: 600, marginTop: "0.5rem" }}
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--color-slate-500)", marginTop: "1.5rem" }}>
                    계정이 없으신가요?{" "}
                    <Link href="/auth/signup" style={{ color: "var(--color-amber-600)", fontWeight: 600, textDecoration: "none" }}>
                        회원가입
                    </Link>
                </p>
            </section>
        </div>
    );
}
