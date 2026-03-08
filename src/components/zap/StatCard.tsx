'use client';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    isPositive?: boolean;
    color?: string;
    variant?: 'gold' | 'blue' | 'default';
}

export default function StatCard({ label, value, icon, trend, isPositive, color, variant = 'default' }: StatCardProps) {
    const cardStyle = variant === 'blue'
        ? { background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)', borderColor: 'rgba(59, 130, 246, 0.2)' }
        : variant === 'gold'
            ? { background: 'linear-gradient(135deg, rgba(201, 160, 91, 0.1) 0%, rgba(201, 160, 91, 0.05) 100%)', borderColor: 'rgba(201, 160, 91, 0.2)' }
            : {};

    return (
        <div className={`stat-card ${variant === 'gold' ? 'gold' : ''}`} style={cardStyle}>
            <div className="stat-top">
                <div className="stat-icon-box" style={{ color: color || (variant === 'gold' ? 'var(--gold-primary)' : 'var(--blue-accent)') }}>
                    {icon}
                </div>
                <div className="stat-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                </div>
            </div>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
            {trend && (
                <div className={`trend-badge ${isPositive ? 'trend-up' : ''}`} style={!isPositive ? { color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' } : {}}>
                    {isPositive && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '4px' }}><path d="M12 19V5M12 5l-7 7m7-7l7 7" /></svg>}
                    {trend}
                </div>
            )}
        </div>
    );
}
