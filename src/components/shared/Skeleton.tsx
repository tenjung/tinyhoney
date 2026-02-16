export default function DealCardSkeleton() {
    return (
        <div className="card deal-card">
            <div className="deal-thumb skeleton" />
            <div className="deal-info" style={{ gap: "0.5rem" }}>
                <div className="deal-tags">
                    <div className="skeleton" style={{ width: "3rem", height: "1.2rem" }} />
                    <div className="skeleton" style={{ width: "4rem", height: "1.2rem" }} />
                </div>
                <div className="skeleton" style={{ width: "80%", height: "1rem" }} />
                <div className="deal-meta">
                    <div className="skeleton" style={{ width: "4rem", height: "1rem" }} />
                    <div className="skeleton" style={{ width: "3rem", height: "0.75rem" }} />
                </div>
            </div>
        </div>
    );
}

export function DealListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <section style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {Array.from({ length: count }).map((_, i) => (
                <DealCardSkeleton key={i} />
            ))}
        </section>
    );
}
