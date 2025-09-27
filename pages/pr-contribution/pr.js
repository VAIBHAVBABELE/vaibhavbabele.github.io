(async function () {
    'use strict';

    const REPO = 'VAIBHAVBABELE/vaibhavbabele.github.io'; // Replace with your repo
    const API_TOKEN = ''; // Optional: GitHub token to avoid rate limits
    const HEADERS = { Accept: 'application/vnd.github.v3+json' };
    if (API_TOKEN) HEADERS['Authorization'] = `token ${API_TOKEN}`;

    const contentDiv = document.getElementById('content');

    function showLoading(msg) {
        contentDiv.innerHTML = `<div class="loading">${msg}</div>`;
    }

    function showError(msg) {
        contentDiv.innerHTML = `<div class="error">❌ ${msg}</div>`;
    }

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    // Fetch all merged PRs with pagination
    async function fetchAllMergedPRs() {
        let page = 1, perPage = 100, mergedPRs = [];
        while (true) {
            const res = await fetch(`https://api.github.com/repos/${REPO}/pulls?state=closed&per_page=${perPage}&page=${page}`, { headers: HEADERS });
            if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
            const prs = await res.json();
            const merged = prs.filter(p => p.merged_at);
            mergedPRs = mergedPRs.concat(merged);
            if (prs.length < perPage) break;
            page++;
        }
        return mergedPRs;
    }

    // Fallback: fetch leaderboard.md
    async function fetchLeaderboardMD() {
        const paths = ['./leaderboard.md', '../leaderboard.md', '../../leaderboard.md'];
        for (const p of paths) {
            try {
                const res = await fetch(p);
                if (!res.ok) continue;
                const text = await res.text();
                const map = parseLeaderboard(text);
                if (map.size) return map;
            } catch { continue; }
        }
        return null;
    }

    function parseLeaderboard(mdText) {
        const map = new Map();
        const lines = mdText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
            const m = line.match(/@?([A-Za-z0-9\-_]+)\s*[:\-–]\s*(\d+)/);
            if (m) map.set(m[1], parseInt(m[2]));
        }
        return map;
    }

    function render(contributors, mergedPRs) {
        const mergedCount = mergedPRs.length;
        const contribCount = contributors.length;

        let html = `
        <div class="stats">
            <div class="stat-card"><div class="stat-number">${mergedCount}</div><div class="stat-label">Merged PRs</div></div>
            <div class="stat-card"><div class="stat-number">${contribCount}</div><div class="stat-label">Contributors</div></div>
        </div>
        <div class="contributors-list">`;

        contributors.forEach(c => {
            html += `<div class="contributor">
                <img src="${c.avatar || ''}" alt="${c.name}" class="avatar">
                <div class="name">${escapeHtml(c.name)}</div>
                <div class="score">⭐ ${c.score || 0}</div>
                <div class="prs">📊 PRs: ${c.totalPRs || 0}</div>
            </div>`;
        });

        html += `</div>`;
        contentDiv.innerHTML = html;
    }

    async function main() {
        showLoading('🔄 Loading contributors...');
        try {
            let contributors = [];
            let mergedPRs = [];

            try {
                mergedPRs = await fetchAllMergedPRs();
                const map = new Map();
                mergedPRs.forEach(pr => {
                    const name = pr.user.login;
                    if (!map.has(name)) map.set(name, { name, avatar: pr.user.avatar_url, totalPRs: 0, score: 0 });
                    const c = map.get(name);
                    c.totalPRs++;
                    c.score = c.totalPRs * 5; // simple scoring
                });
                contributors = Array.from(map.values());
            } catch (err) {
                console.warn('GitHub API failed, using leaderboard.md', err);
                const lb = await fetchLeaderboardMD();
                if (!lb) throw new Error('Leaderboard not found.');
                contributors = Array.from(lb.entries()).map(([name, score]) => ({ name, score, totalPRs: 0, avatar: '' }));
            }

            render(contributors, mergedPRs);
        } catch (err) {
            showError(err.message);
        }
    }

    window.addEventListener('load', main);
})();
