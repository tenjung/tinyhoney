"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryPillsProps {
    basePath: string;
    paramName: string;
    categories: [string, string | null][];
    extraParams?: Record<string, string | null>;
}

export default function CategoryPills({
    basePath,
    paramName,
    categories,
    extraParams = {},
}: CategoryPillsProps) {
    const searchParams = useSearchParams();
    const currentValue = searchParams.get(paramName);

    return (
        <section className="pill-row">
            {categories.map(([label, value]) => {
                const isActive =
                    (!currentValue && value === null) || currentValue === value;

                const params = new URLSearchParams();
                if (value) params.set(paramName, value);
                Object.entries(extraParams).forEach(([k, v]) => {
                    if (v) params.set(k, v);
                });
                const href = params.toString()
                    ? `${basePath}?${params.toString()}`
                    : basePath;

                return (
                    <Link
                        key={label}
                        href={href}
                        className={`pill ${isActive ? "pill-active" : ""}`}
                    >
                        {label}
                    </Link>
                );
            })}
        </section>
    );
}
