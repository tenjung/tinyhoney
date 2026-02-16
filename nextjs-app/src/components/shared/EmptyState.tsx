import Link from "next/link";

interface EmptyStateProps {
    icon: string;
    title: string;
    message: string;
    buttons?: { label: string; href: string; primary?: boolean; style?: React.CSSProperties }[];
}

export default function EmptyState({ icon, title, message, buttons }: EmptyStateProps) {
    return (
        <section className="card-static empty-state">
            <div className="icon">{icon}</div>
            <h3>{title}</h3>
            <p>{message}</p>
            {buttons && buttons.length > 0 && (
                <div className="actions">
                    {buttons.map((btn) => (
                        <Link
                            key={btn.label}
                            href={btn.href}
                            className={`btn ${btn.primary ? "btn-primary" : "btn-outline"}`}
                            style={btn.style}
                        >
                            {btn.label}
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
