"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";

export default function Header() {
    const user = useAuthStore((state) => state.user);
    const nickname = useAuthStore((state) => state.nickname);
    const avatarUrl = useAuthStore((state) => state.avatarUrl);
    const isAdmin = useAuthStore((state) => state.isAdmin);
    const initialized = useAuthStore((state) => state.initialized);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        clearAuth();
        setMenuOpen(false);
    }

    useEffect(() => {
        function onClickOutside(event: MouseEvent) {
            if (!menuRef.current) return;
            if (event.target instanceof Node && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        window.addEventListener("mousedown", onClickOutside);
        return () => window.removeEventListener("mousedown", onClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                                <span className="text-2xl">🐝</span>
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900">
                                티꿀모아
                                <span className="text-yellow-500 text-sm ml-1 italic font-medium">
                                    TinyHoney
                                </span>
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-sm font-semibold hover:text-yellow-500 transition-colors"
                            >
                                실시간 핫딜
                            </Link>
                            <Link
                                href="/events"
                                className="text-sm font-semibold hover:text-yellow-500 transition-colors"
                            >
                                진행 중 이벤트
                            </Link>
                            <Link
                                href="/community"
                                className="text-sm font-semibold hover:text-yellow-500 transition-colors"
                            >
                                커뮤니티
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                        {initialized && user ? (
                            <div ref={menuRef} style={{ position: "relative" }}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((v) => !v)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.625rem",
                                        padding: "0.35rem 0.7rem 0.35rem 0.4rem",
                                        borderRadius: "9999px",
                                        border: "1px solid var(--color-slate-200)",
                                        background: "white",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: "2rem",
                                            height: "2rem",
                                            borderRadius: "9999px",
                                            overflow: "hidden",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                                            color: "#111827",
                                            fontWeight: 800,
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {avatarUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={avatarUrl} alt={nickname} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            "🐝"
                                        )}
                                    </span>
                                    <span style={{ textAlign: "left", lineHeight: 1.1 }}>
                                        <span className="text-sm font-bold text-slate-800 block max-w-28 truncate">{nickname}</span>
                                        <span className="text-xs text-slate-500 block max-w-28 truncate">{user.email}</span>
                                    </span>
                                </button>

                                {menuOpen ? (
                                    <div
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                            top: "calc(100% + 0.6rem)",
                                            width: "13rem",
                                            border: "1px solid var(--color-slate-200)",
                                            borderRadius: "0.85rem",
                                            background: "white",
                                            boxShadow: "0 10px 28px rgba(2,6,23,0.10)",
                                            padding: "0.4rem",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.2rem",
                                        }}
                                    >
                                        <Link href="/mypage" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg px-3 py-2">
                                            마이페이지
                                        </Link>
                                        <Link href="/mypage/settings" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg px-3 py-2">
                                            정보 설정
                                        </Link>
                                        {isAdmin ? (
                                            <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-amber-700 hover:bg-amber-50 rounded-lg px-3 py-2">
                                                관리자 페이지
                                            </Link>
                                        ) : null}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg px-3 py-2"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
                                >
                                    로그인
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-sm font-bold rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
                                >
                                    시작하기
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
