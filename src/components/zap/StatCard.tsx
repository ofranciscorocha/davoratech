'use client';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    isPositive?: boolean;
    variant?: 'gold' | 'blue' | 'default';
}

export default function StatCard({ label, value, icon, trend, isPositive, variant = 'default' }: StatCardProps) {
    return (
        <div className={`stat-card ${variant}`}>
            <div className="stat-card-inner">
                <div className="stat-header">
                    <div className="stat-icon-wrapper">
                        {icon}
                    </div>
                </div>

                <div className="stat-body">
                    <p className="stat-label">{label}</p>
                    <h2 className="stat-value">{value}</h2>
                </div>

                {trend && (
                    <div className="stat-footer">
                        <span className={`trend-tag ${isPositive ? 'up' : 'down'}`}>
                            {isPositive ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                            ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 7L17 17M17 17H7M17 17V7" /></svg>
                            )}
                            {trend}
                        </span>
                    </div>
                )}
            </div>

            <style jsx>{`
                .stat-card {
                    background: var(--bg-card);
                    border: 1px solid var(--glass-border);
                    border-radius: 28px;
                    padding: 24px;
                    transition: var(--transition);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 200px;
                }
                .stat-card:hover {
                    border-color: rgba(201, 160, 91, 0.4);
                    transform: translateY(-5px);
                    background: var(--bg-card-hover);
                }
                .stat-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    background: rgba(255, 255, 255, 0.04);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-primary);
                    margin-bottom: 20px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .stat-card.blue .stat-icon-wrapper {
                    background: rgba(59, 130, 246, 0.1);
                    color: #60a5fa;
                }
                .stat-card.gold .stat-icon-wrapper {
                    background: rgba(201, 160, 91, 0.1);
                    color: var(--gold-primary);
                }
                .stat-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin: 0;
                }
                .stat-value {
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 8px 0 0;
                    letter-spacing: -1px;
                }
                .trend-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 6px 12px;
                    border-radius: 10px;
                    margin-top: 16px;
                }
                .trend-tag.up {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }
                .trend-tag.down {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
}
