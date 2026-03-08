import React from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

const ProfileCard = ({ platform, logo, stats, profileUrl, color, loading }) => {
    return (
        <div className="profile-card" onClick={() => window.open(profileUrl, '_blank')}>
            <div className="card-header">
                <div className="platform-info">
                    <div className="platform-icon" style={{ background: `${color}15`, color: color }}>
                        {React.cloneElement(logo, { size: 18 })}
                    </div>
                    <span className="platform-name">{platform}</span>
                </div>
                <ExternalLink size={14} className="external-link" />
            </div>

            <div className="card-body">
                {loading ? (
                    <div className="loading-state">
                        <Loader2 className="spin" size={14} />
                        <span>Syncing...</span>
                    </div>
                ) : stats ? (
                    <div className="stats-row">
                        {Object.entries(stats).map(([label, value], index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-label">{label}</div>
                                <div className="stat-value">{value}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="error-state">
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No data found</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
