import React from 'react';

const ActivityHeatmap = ({ data, loading }) => {
    // Generate last 12 weeks of dates
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        // Normalized to most recent midnight UTC
        // Pre-normalize data keys to midnight UTC to ensure matches
        const normalizedData = {};
        if (data) {
            Object.entries(data).forEach(([ts, count]) => {
                const d = new Date(parseInt(ts) * 1000);
                const normalizedTs = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
                normalizedData[normalizedTs] = count;
            });
        }

        // Normalized to most recent midnight UTC
        const now = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

        // Start from today and go back 52 weeks (364 days) to cover the full block width
        for (let i = 363; i >= 0; i--) {
            const date = new Date(now);
            date.setUTCDate(now.getUTCDate() - i);
            const timestamp = Math.floor(date.getTime() / 1000);
            dates.push({
                date: date,
                timestamp: timestamp,
                count: normalizedData[timestamp] || 0
            });
        }
        return dates;
    };

    const dates = generateDates();

    const getLevel = (count) => {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 4) return 2;
        if (count <= 6) return 3;
        return 4;
    };

    return (
        <div className="activity-section animate-in" style={{ animationDelay: '0.1s' }}>
            <div className="heatmap-container">
                <div className="heatmap-wrapper">
                    {loading ? (
                        <div className="heatmap-skeleton">
                            {[...Array(364)].map((_, i) => (
                                <div key={i} className="heatmap-cell skeleton"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="heatmap-grid">
                            {dates.map((item, i) => (
                                <div
                                    key={i}
                                    className={`heatmap-cell level-${getLevel(item.count)}`}
                                    title={`${item.date.toUTCString().split(' ').slice(0, 4).join(' ')}: ${item.count} submissions`}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="section-header">
                <span className="section-subtitle">submissions from leetcode</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
