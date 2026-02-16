"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MeResponse {
    email?: string | null;
    nickname?: string;
    avatarUrl?: string | null;
    isAdmin?: boolean;
}

export default function MyPageSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [nickname, setNickname] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        void (async () => {
            try {
                const res = await fetch("/api/me", { cache: "no-store" });
                if (!res.ok) {
                    router.push("/auth/login");
                    return;
                }
                const data = (await res.json()) as MeResponse;
                setNickname(data.nickname || "");
                setAvatarUrl(data.avatarUrl || "");
            } finally {
                setLoading(false);
            }
        })();
    }, [router]);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setMessage(null);
        setError(null);

        const res = await fetch("/api/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nickname,
                avatarUrl,
            }),
        });
        const data = (await res.json()) as { error?: string };
        setSaving(false);

        if (!res.ok) {
            setError(data.error || "저장에 실패했습니다.");
            return;
        }

        setMessage("저장되었습니다.");
    }

    return (
        <div className="dash-wrap" style={{ maxWidth: "42rem" }}>
            <section className="card-static" style={{ padding: "1.5rem" }}>
                <h1 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>정보 설정</h1>
                <p style={{ fontSize: "0.9rem", color: "var(--color-slate-500)", marginBottom: "1.2rem" }}>
                    헤더에 표시할 닉네임과 아바타를 관리합니다.
                </p>

                {loading ? (
                    <p style={{ color: "var(--color-slate-500)" }}>불러오는 중...</p>
                ) : (
                    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.25rem" }}>닉네임</label>
                            <input className="input" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.25rem" }}>아바타 이미지 URL</label>
                            <input className="input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
                        </div>
                        {error ? <p style={{ color: "var(--color-rose-600)", fontSize: "0.85rem" }}>{error}</p> : null}
                        {message ? <p style={{ color: "var(--color-emerald-600)", fontSize: "0.85rem" }}>{message}</p> : null}
                        <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: "fit-content" }}>
                            {saving ? "저장 중..." : "저장하기"}
                        </button>
                    </form>
                )}
            </section>
        </div>
    );
}
