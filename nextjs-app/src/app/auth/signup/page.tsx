import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "회원가입 - 티꿀모아",
};

export default function SignupPage() {
    return (
        <div className="dash-wrap" style={{ maxWidth: "28rem", paddingTop: "4rem" }}>
            <section className="card-static" style={{ padding: "2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🐝</div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-slate-900)" }}>회원가입</h1>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-slate-500)", marginTop: "0.5rem" }}>
                        핫딜 알림을 받으려면 가입하세요
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    <button className="btn btn-outline" style={{ width: "100%", height: "2.75rem", fontSize: "0.875rem", fontWeight: 600, gap: "0.5rem" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google로 가입
                    </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ flex: 1, height: "1px", background: "var(--color-slate-200)" }} />
                    <span style={{ fontSize: "0.75rem", color: "var(--color-slate-400)" }}>또는</span>
                    <div style={{ flex: 1, height: "1px", background: "var(--color-slate-200)" }} />
                </div>

                <form style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-slate-700)", marginBottom: "0.25rem", display: "block" }}>이메일</label>
                        <input type="email" name="email" placeholder="email@example.com" className="input" style={{ height: "2.75rem" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-slate-700)", marginBottom: "0.25rem", display: "block" }}>비밀번호</label>
                        <input type="password" name="password" placeholder="8자 이상" className="input" style={{ height: "2.75rem" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-slate-700)", marginBottom: "0.25rem", display: "block" }}>비밀번호 확인</label>
                        <input type="password" name="passwordConfirm" placeholder="비밀번호 다시 입력" className="input" style={{ height: "2.75rem" }} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%", height: "2.75rem", fontSize: "0.875rem", fontWeight: 600, marginTop: "0.5rem" }}>
                        가입하기
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--color-slate-500)", marginTop: "1.5rem" }}>
                    이미 계정이 있으신가요?{" "}
                    <Link href="/auth/login" style={{ color: "var(--color-amber-600)", fontWeight: 600, textDecoration: "none" }}>
                        로그인
                    </Link>
                </p>
            </section>
        </div>
    );
}
