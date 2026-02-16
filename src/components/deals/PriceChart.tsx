"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import type { PriceHistory } from "@/types/database";
import { formatPrice } from "@/lib/utils";

interface PriceChartProps {
    data: PriceHistory[];
}

export default function PriceChart({ data }: PriceChartProps) {
    const chartData = data
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((item) => ({
            date: new Date(item.created_at).toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
            }),
            price: item.recorded_price,
        }));

    return (
        <div
            className="card-static"
            style={{
                padding: "1.5rem",
                background: "var(--color-slate-50)",
                borderRadius: "0.75rem",
            }}
        >
            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        formatter={(value: number) => [formatPrice(value), "가격"]}
                        contentStyle={{
                            borderRadius: "0.5rem",
                            border: "1px solid #e2e8f0",
                            fontSize: "0.875rem",
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fill="url(#priceGrad)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
