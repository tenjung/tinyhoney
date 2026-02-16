import { requireAdmin } from "@/lib/auth/admin";
import AdminMenuPills from "@/components/admin/AdminMenuPills";

const ADMIN_MENUS = [
    { href: "/admin", label: "대시보드" },
    { href: "/admin/deals", label: "핫딜 관리" },
    { href: "/admin/events", label: "이벤트 관리" },
    { href: "/admin/community", label: "커뮤니티 관리" },
    { href: "/admin/registrations", label: "등록 관리" },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return (
        <div className="dash-wrap">
            <header className="card-static" style={{ padding: "1rem 1.2rem", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-amber-600)", marginBottom: "0.35rem" }}>
                    TinyHoney Admin
                </p>
                <h1 style={{ fontSize: "1.3rem", fontWeight: 900 }}>운영 관리 콘솔</h1>
                <AdminMenuPills menus={ADMIN_MENUS} />
            </header>
            {children}
        </div>
    );
}
