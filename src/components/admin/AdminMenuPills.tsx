"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminMenuItem {
    href: string;
    label: string;
}

interface AdminMenuPillsProps {
    menus: AdminMenuItem[];
}

function isMenuActive(pathname: string, href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminMenuPills({ menus }: AdminMenuPillsProps) {
    const pathname = usePathname();
    const activeMenu = menus.find((menu) => isMenuActive(pathname, menu.href));

    return (
        <div>
            <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.9rem", flexWrap: "wrap" }}>
                {menus.map((menu) => {
                    const active = isMenuActive(pathname, menu.href);
                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`pill ${active ? "pill-active" : ""}`}
                            aria-current={active ? "page" : undefined}
                        >
                            {menu.label}
                        </Link>
                    );
                })}
            </div>
            <p style={{ marginTop: "0.55rem", fontSize: "0.8rem", color: "var(--color-slate-500)" }}>
                현재 위치: {activeMenu?.label || "관리 페이지"}
            </p>
        </div>
    );
}
