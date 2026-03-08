import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = ({ stats }) => {
    const difficultyData = stats.leetcode ? [
        { name: 'Easy', value: stats.leetcode.easy || 0, color: '#38bdf8' },
        { name: 'Medium', value: stats.leetcode.medium || 0, color: '#10b981' },
        { name: 'Hard', value: stats.leetcode.hard || 0, color: '#f43f5e' },
    ] : [];

    const platformData = [
        { name: 'LeetCode', solved: stats.leetcode?.solved || 0 },
        { name: 'Codeforces', solved: stats.codeforces?.rating || 0 },
        { name: 'CodeChef', solved: stats.codechef?.currentRating || 0 },
        { name: 'GFG', solved: stats.gfg?.solved || 551 },
    ];

    return (
        <div className="glass-card" style={{ padding: '2rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>
                    Problem Solving Analytics
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Live Sync Active</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', flexGrow: 1 }}>
                {/* Distribution Chart */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '180px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={difficultyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {difficultyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                        {difficultyData.map((d, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color }}></div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Bar Chart */}
                <div style={{ height: '220px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={platformData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                            />
                            <Bar dataKey="solved" fill="var(--accent-primary)" radius={[6, 6, 6, 6]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
