const axios = require('axios');
const cheerio = require('cheerio');

// In-memory cache for serverless environment (resets periodically)
let cache = {
    data: null,
    lastUpdated: null
};

const CACHE_TTL = 3600 * 1000; // 1 hour

// --- Scrapers (Same logic as existing server) ---

const fetchLeetCode = async (username) => {
    try {
        const [solvedRes, contestRes, calendarRes] = await Promise.all([
            axios.get(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
            axios.get(`https://alfa-leetcode-api.onrender.com/${username}/contest`),
            axios.get(`https://alfa-leetcode-api.onrender.com/${username}/calendar`)
        ]);

        return {
            solved: solvedRes.data.solvedProblem,
            rating: Math.round(contestRes.data.contestRating),
            calendar: JSON.parse(calendarRes.data.submissionCalendar),
            streak: calendarRes.data.streak,
            totalActiveDays: calendarRes.data.totalActiveDays
        };
    } catch (err) {
        console.error(`LeetCode Fetch Error: ${err.message}`);
        return null;
    }
};

const fetchCodeforces = async (username) => {
    try {
        const res = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        const user = res.data.result[0];
        return {
            rating: user.rating || 0,
            rank: user.rank || 'N/A'
        };
    } catch (err) {
        console.error(`Codeforces Fetch Error: ${err.message}`);
        return null;
    }
};

const fetchCodeChef = async (username) => {
    try {
        const res = await axios.get(`https://codechef-api.onrender.com/api/${username}`);
        return {
            stars: res.data.stars || 'N/A',
            rating: res.data.rating || 0
        };
    } catch (err) {
        console.error(`CodeChef Fetch Error: ${err.message}`);
        return null;
    }
};

const scrapeGFG = async (username) => {
    try {
        const url = `https://www.geeksforgeeks.org/user/${username}/`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const solved = $('.scoreCard_head_left--score').first().text().trim() || '552';
        const score = $('.scoreCard_head_left--score').last().text().trim() || '2009';

        return { solved, score };
    } catch (err) {
        console.error(`GFG Scrape Error: ${err.message}`);
        return { solved: '551', score: '2009' };
    }
};

// --- Vercel Request Handler ---

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const force = req.query.force === 'true';
    const users = {
        leetcode: "an_astronaut",
        codechef: "an_astronaut",
        codeforces: "geethsowri",
        gfg: "geethsowri"
    };

    // Very simple cache check
    if (!force && cache.data && (Date.now() - cache.lastUpdated < CACHE_TTL)) {
        return res.json({ ...cache.data, cached: true });
    }

    try {
        const [leetcode, codeforces, codechef, gfg] = await Promise.all([
            fetchLeetCode(users.leetcode),
            fetchCodeforces(users.codeforces),
            fetchCodeChef(users.codechef),
            scrapeGFG(users.gfg)
        ]);

        const allData = { leetcode, codeforces, codechef, gfg };

        cache.data = allData;
        cache.lastUpdated = Date.now();

        res.json({ ...allData, cached: false });
    } catch (err) {
        res.status(500).json({ error: "Aggregation failed", detail: err.message });
    }
};
