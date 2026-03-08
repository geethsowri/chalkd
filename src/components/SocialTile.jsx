import React from 'react';

const SocialTile = ({ icon: Icon, label, url, color }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card"
            style={{
                padding: '1.25rem',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{
                color: color || '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <Icon size={24} />
                <span style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
                    {label}
                </span>
            </div>
        </a>
    );
};

export default SocialTile;
