import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Sun, Moon } from 'lucide-react';
import ProfileCard from './components/ProfileCard';
import ActivityHeatmap from './components/ActivityHeatmap';
import { fetchAllStats } from './utils/api';
import leetcodeLogo from './assets/leetcode-logo.svg';
import codeforcesLogo from './assets/codeforces.png';
import codechefLogo from './assets/codechef.png';
import gfgLogo from './assets/gfg.png';

function App() {
  const [stats, setStats] = useState({
    leetcode: null,
    codeforces: null,
    codechef: null,
    gfg: null,
    loading: true,
    error: null
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsChanging(true);
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsChanging(false), 500); // Matches transition duration
  };

  const getStats = useCallback(async (force = false) => {
    setStats(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchAllStats(force);
      setStats({ ...data, loading: false });
    } catch (err) {
      setStats(prev => ({ ...prev, loading: false, error: "Sync failed" }));
    }
  }, []);

  useEffect(() => {
    getStats();
  }, [getStats]);

  const profileConfigs = [
    {
      platform: 'leetcode',
      logo: <img src={leetcodeLogo} alt="LeetCode" style={{ width: '18px', height: '18px' }} />,
      stats: stats.leetcode ? {
        'Solved': stats.leetcode.solved || '686',
        'Rating': stats.leetcode.rating || '1772'
      } : {
        'Solved': '686',
        'Rating': '1772'
      },
      profileUrl: `https://leetcode.com/u/an_astronaut`,
      color: '#FFA116'
    },
    {
      platform: 'codeforces',
      logo: <img src={codeforcesLogo} alt="Codeforces" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />,
      stats: stats.codeforces ? {
        'Rating': stats.codeforces.rating || '0',
        'Rank': stats.codeforces.rank || 'N/A'
      } : null,
      profileUrl: `https://codeforces.com/profile/geethsowri`,
      color: '#318CE7'
    },
    {
      platform: 'codechef',
      logo: <img src={codechefLogo} alt="CodeChef" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />,
      stats: stats.codechef ? {
        'Stars': stats.codechef.stars || 'N/A',
        'Rating': stats.codechef.rating || '0'
      } : null,
      profileUrl: `https://www.codechef.com/users/an_astronaut`,
      color: '#5B4638'
    },
    {
      platform: 'geeksforgeeks',
      logo: <img src={gfgLogo} alt="GFG" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />,
      stats: stats.gfg ? {
        'Solved': stats.gfg.solved || '551',
        'Score': stats.gfg.score || '2009'
      } : {
        'Solved': '551',
        'Score': '2009'
      },
      profileUrl: `https://auth.geeksforgeeks.org/user/geethsowri`,
      color: '#298D46'
    }
  ];

  return (
    <div className="app-shell animate-in">
      <header className="dash-header">
        <div className="brand">
          <div className="brand-icon">
            <img src="https://i.pinimg.com/736x/0c/f1/a7/0cf1a7aa42a1d56a04b9861706a1c60c.jpg" alt="Profile" />
          </div>
          <span className="brand-name">codefolio/geethsowri</span>
        </div>
        <div className="header-actions">
          <button
            className={`theme-toggle ${isChanging ? 'theme-changing' : ''}`}
            onClick={toggleTheme}
            data-theme={theme}
            aria-label="Toggle theme"
          >
            <div className="theme-icon-container">
              <Sun size={18} className="sun-icon" />
              <Moon size={18} className="moon-icon" />
            </div>
          </button>
          <button className="sync-btn" onClick={() => getStats(true)}>
            <RefreshCw size={12} className={stats.loading ? "spin" : ""} />
            <span>{stats.loading ? 'Syncing...' : 'Manual Sync'}</span>
          </button>
        </div>
      </header>

      <main className="dash-content">
        <section className="page-intro">
          <h1>aggregated my performance across various programming platforms.</h1>
        </section>

        <section className="cards-grid">
          {profileConfigs.map((profile, index) => (
            <ProfileCard key={index} {...profile} loading={stats.loading} />
          ))}
        </section>

        <ActivityHeatmap
          data={stats.leetcode?.calendar}
          loading={stats.loading}
        />
      </main>

      <footer className="dash-footer">
        <p>last synced: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
}

export default App;
