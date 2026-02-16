import type { Stat } from "@/types/database";

interface HeaderStatsProps {
    titleSmall?: string;
    title: string;
    subtitle: string;
    stats: Stat[];
}

export default function HeaderStats({
    titleSmall = "TinyHoney",
    title,
    subtitle,
    stats,
}: HeaderStatsProps) {
    return (
        <section className="card-static dash-header">
            <div>
                <p className="dash-header-title">{titleSmall}</p>
                <h1>{title}</h1>
                <p className="sub">{subtitle}</p>
            </div>
            <div className="stats-row">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-box">
                        <p className="stat-label">{stat.label}</p>
                        <p className="stat-value" style={stat.color ? { color: stat.color } : undefined}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
