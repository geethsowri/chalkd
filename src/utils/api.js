const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (err) {
        clearTimeout(id);
        throw err;
    }
};

const BACKEND_URL = '/api/stats';

export const fetchAllStats = async (force = false) => {
    const results = {
        leetcode: null,
        codeforces: null,
        codechef: null,
        gfg: null,
        loading: false,
        error: null
    };

    try {
        const response = await fetchWithTimeout(`${BACKEND_URL}?force=${force}`);

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();

        // Map backend data to frontend structure
        return {
            leetcode: data.leetcode ? {
                solved: data.leetcode.solved,
                rating: data.leetcode.rating,
                calendar: data.leetcode.calendar,
                streak: data.leetcode.streak,
                totalActiveDays: data.leetcode.totalActiveDays
            } : null,
            codeforces: data.codeforces ? {
                rating: data.codeforces.rating,
                rank: data.codeforces.rank
            } : null,
            codechef: data.codechef ? {
                stars: data.codechef.stars,
                rating: data.codechef.rating
            } : null,
            gfg: data.gfg ? {
                solved: data.gfg.solved,
                score: data.gfg.score
            } : null,
            loading: false,
            error: null
        };
    } catch (err) {
        console.error("Critical error in fetchAllStats (Local Backend):", err);
        return { ...results, error: err.message };
    }
};
