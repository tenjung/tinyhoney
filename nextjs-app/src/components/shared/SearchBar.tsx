"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { FilterOption } from "@/types/database";

interface FilterConfig {
    type: "select" | "checkbox";
    name: string;
    options?: FilterOption[];
    label?: string;
}

interface SearchBarProps {
    placeholder: string;
    filters?: FilterConfig[];
    buttons?: { label: string; href: string; style?: string }[];
}

export default function SearchBar({
    placeholder,
    filters = [],
    buttons = [],
}: SearchBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const params = new URLSearchParams();
            formData.forEach((value, key) => {
                if (value && value !== "null") params.set(key, value.toString());
            });
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname]
    );

    const hasAdvancedFilters = filters.some(
        (f) => searchParams.get(f.name) !== null
    );

    return (
        <section className="card-static search-bar">
            <form onSubmit={handleSubmit}>
                <div className="search-row">
                    <div className="search-field-wrap">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-5-5m1-4a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            name="q"
                            defaultValue={searchParams.get("q") || ""}
                            placeholder={placeholder}
                            className="input input-search"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        검색
                    </button>
                    <a href={pathname} className="btn btn-outline">
                        초기화
                    </a>
                    {buttons.map((btn) => (
                        <a
                            key={btn.label}
                            href={btn.href}
                            className="btn btn-primary"
                            style={btn.style ? undefined : undefined}
                        >
                            {btn.label}
                        </a>
                    ))}
                </div>

                {filters.length > 0 && (
                    <details
                        open={hasAdvancedFilters}
                        className="adv-filter"
                    >
                        <summary>고급 필터</summary>
                        <div className="adv-filter-grid">
                            {filters.map((filter) => {
                                if (filter.type === "select" && filter.options) {
                                    return (
                                        <select
                                            key={filter.name}
                                            name={filter.name}
                                            defaultValue={searchParams.get(filter.name) || ""}
                                            className="input"
                                        >
                                            {filter.options.map((opt) => (
                                                <option key={opt.label} value={opt.value || ""}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    );
                                }
                                if (filter.type === "checkbox") {
                                    return (
                                        <label key={filter.name} className="input" style={{ cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                name={filter.name}
                                                value="1"
                                                defaultChecked={searchParams.get(filter.name) === "1"}
                                                style={{
                                                    width: "1rem",
                                                    height: "1rem",
                                                    accentColor: "var(--color-amber-500)",
                                                }}
                                            />
                                            <span style={{ fontSize: "0.8125rem", color: "var(--color-slate-600)" }}>
                                                {filter.label}
                                            </span>
                                        </label>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </details>
                )}
            </form>
        </section>
    );
}
