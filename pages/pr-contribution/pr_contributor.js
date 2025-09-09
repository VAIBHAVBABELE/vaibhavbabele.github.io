

(function () {
    'use strict';

    // ----- Configuration -----
    const API_TOKEN = ''; // Optional: add a GitHub token to increase rate limits
    let useApiToken = Boolean(API_TOKEN && API_TOKEN.length > 0);

    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
    const CACHE_KEYS = {
        PRS: 'github_prs_cache',
        CONTRIBUTORS: 'github_contributors_cache',
        TIMESTAMP: 'github_cache_timestamp'
    };

    // ----- Utilities -----
    function debugLog(...args) {
        if (window.location.search.includes('debug')) console.log(...args);
    }

    function saveToCache(key, data) {
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
            sessionStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
            debugLog('Saved to cache', key);
        } catch (e) {
            console.warn('Cache save failed', e);
        }
    }

    function getFromCache(key) {
        try {
            const timestamp = sessionStorage.getItem(CACHE_KEYS.TIMESTAMP);
            if (!timestamp) return null;
            const age = Date.now() - parseInt(timestamp, 10);
            if (age > CACHE_DURATION) {
                clearCache();
                return null;
            }
            const raw = sessionStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.warn('Cache read failed', e);
            return null;
        }
    }

    function clearCache() {
        try {
            Object.values(CACHE_KEYS).forEach(k => sessionStorage.removeItem(k));
            console.log('🗑️ Cache cleared');
        } catch (e) {
            console.warn('Cache clear failed', e);
        }
    }

    function isCacheValid() {
        const ts = sessionStorage.getItem(CACHE_KEYS.TIMESTAMP);
        if (!ts) return false;
        return (Date.now() - parseInt(ts, 10)) < CACHE_DURATION;
    }

    function displayCacheStatus() {
        const ts = sessionStorage.getItem(CACHE_KEYS.TIMESTAMP);
        if (!ts) return;
        const age = Date.now() - parseInt(ts, 10);
        const remaining = Math.max(0, CACHE_DURATION - age);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const statusDiv = document.createElement('div');
        statusDiv.className = 'cache-status';
        statusDiv.style.cssText = `
            position: fixed;
            bottom: 12px;
            right: 12px;
            background: rgba(0,128,0,0.85);
            color: white;
            padding: 8px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 10000;
        `;
        statusDiv.textContent = `💾 Cache: ${minutes}m ${seconds}s left`;
        document.body.appendChild(statusDiv);
        setTimeout(() => statusDiv.remove(), 5000);
    }

    function checkRateLimitFromHeaders(response) {
        if (!response || !response.headers) return null;
        const info = {
            limit: response.headers.get('X-RateLimit-Limit'),
            remaining: response.headers.get('X-RateLimit-Remaining'),
            reset: response.headers.get('X-RateLimit-Reset')
        };
        if (info.reset) info.resetDate = new Date(parseInt(info.reset, 10) * 1000).toLocaleString();
        return info;
    }

    function displayRateLimitOnPage(rateLimitInfo) {
        if (!rateLimitInfo) return;
        const el = document.querySelector('.rate-limit-info');
        if (el) el.remove();
        const div = document.createElement('div');
        div.className = 'rate-limit-info';
        div.style.cssText = `
            position: fixed;
            top: 12px;
            right: 12px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 10000;
        `;
        div.innerHTML = `<strong>GitHub API</strong><br>Remaining: ${rateLimitInfo.remaining||'N/A'}/${rateLimitInfo.limit||'N/A'}<br>Reset: ${rateLimitInfo.resetDate || 'N/A'}`;
        document.body.appendChild(div);
        setTimeout(()=>div.remove(), 8000);
    }

    function getContrastColor(hexColor) {
        if (!hexColor) return '#000';
        hexColor = hexColor.replace('#', '');
        if (hexColor.length !== 6) return '#000';
        const r = parseInt(hexColor.substr(0,2),16);
        const g = parseInt(hexColor.substr(2,2),16);
        const b = parseInt(hexColor.substr(4,2),16);
        const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    function getRepoFromDocOrHost() {
        // 1) explicit override via <body data-repo="owner/repo">
        const bodyRepo = document.body.getAttribute('data-repo');
        if (bodyRepo && bodyRepo.includes('/')) return bodyRepo.trim();

        // 2) if running on GitHub Pages (owner.github.io / repo in path)
        const hostname = window.location.hostname.toLowerCase();
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (hostname.endsWith('github.io')) {
            const owner = hostname.split('.')[0];
            const repo = pathParts.length > 0 ? pathParts[0] : `${owner}.github.io`;
            return `${owner}/${repo}`;
        }

        // 3) fallback (edit this if you want a different default)
        console.warn('Could not auto-detect repo — falling back to default. Set <body data-repo="owner/repo"> to override.');
        return 'VAIBHAVBABELE/vaibhavbabele.github.io';
    }

    // Try fetching a local or raw GitHub leaderboard.md. Returns a Map(usernameLower -> points) or null.
    async function tryLoadLeaderboard(ownerRepo) {
        const [owner, repo] = ownerRepo.split('/');
        const candidatePaths = [
            './leaderboard.md',
            '../leaderboard.md',
            '../../leaderboard.md',
            '../../../leaderboard.md'
        ];

        // 1) try relative local files
        for (const p of candidatePaths) {
            try {
                const r = await fetch(p);
                if (r.ok) {
                    const text = await r.text();
                    const parsed = parseLeaderboardMarkdown(text);
                    if (parsed && parsed.size) {
                        console.log('✅ Loaded leaderboard.md from relative path', p);
                        return parsed;
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        // 2) try raw.githubusercontent (main, then master)
        const rawCandidates = [
            `https://raw.githubusercontent.com/${owner}/${repo}/main/leaderboard.md`,
            `https://raw.githubusercontent.com/${owner}/${repo}/master/leaderboard.md`
        ];
        for (const url of rawCandidates) {
            try {
                const r = await fetch(url);
                if (r.ok) {
                    const text = await r.text();
                    const parsed = parseLeaderboardMarkdown(text);
                    if (parsed && parsed.size) {
                        console.log('✅ Loaded leaderboard.md from', url);
                        return parsed;
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        return null;
    }

    // Lightweight markdown table or list parser for leaderboard.md
    function parseLeaderboardMarkdown(mdText) {
        if (!mdText) return null;
        const lines = mdText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const tableRows = lines.filter(l => l.startsWith('|') && l.includes('|'));
        const map = new Map();

        if (tableRows.length >= 2) {
            // Try to parse header and data rows
            // header e.g. | Rank | Contributor | Points |
            const headerCols = tableRows[0].split('|').map(s => s.trim()).filter(Boolean);
            const pointsIdx = headerCols.findIndex(h => /points|score/i.test(h));
            const nameIdx = headerCols.findIndex(h => /contributor|name|github|user/i.test(h));
            // default fallbacks
            const pIdx = pointsIdx >= 0 ? pointsIdx : headerCols.length - 1;
            const nIdx = nameIdx >= 0 ? nameIdx : 1;

            // data rows start after header and separator
            for (let i = 1; i < tableRows.length; i++) {
                const cols = tableRows[i].split('|').map(s=>s.trim()).filter(Boolean);
                if (cols.length < 2) continue;
                const rawName = (cols[nIdx] || cols[0] || '').replace(/["'`]/g, '').trim();
                const rawPoints = (cols[pIdx] || cols[cols.length - 1] || '').replace(/[^0-9\-]/g, '').trim();
                const points = parseInt(rawPoints, 10);
                const username = sanitizeLeaderboardName(rawName);
                if (username && !Number.isNaN(points)) {
                    map.set(username.toLowerCase(), points);
                }
            }
            if (map.size) return map;
        }

        // Fallback: parse bullet lines like "- username - 42" or "username: 42"
        for (const line of lines) {
            // skip header lines
            if (/^#/.test(line) || /^\|/.test(line)) continue;
            const match1 = line.match(/@?([A-Za-z0-9\-_]+)\s*[:\-–]\s*(\d+)/);
            if (match1) {
                map.set(match1[1].toLowerCase(), parseInt(match1[2], 10));
                continue;
            }
            const match2 = line.match(/([A-Za-z0-9\-_]+)\s+(\d+)\s*pts?/i);
            if (match2) {
                map.set(match2[1].toLowerCase(), parseInt(match2[2], 10));
                continue;
            }
        }

        return map.size ? map : null;
    }

    function sanitizeLeaderboardName(raw) {
        if (!raw) return '';
        // if it's a markdown link: [name](https://github.com/username) -> try extract username
        const linkMatch = raw.match(/\((https?:\/\/github\.com\/([A-Za-z0-9\-_]+))\)/i);
        if (linkMatch) return linkMatch[2];
        // if there's a slash like owner/username or @username
        const atMatch = raw.match(/@?([A-Za-z0-9\-_]+)/);
        return atMatch ? atMatch[1] : raw.replace(/[^A-Za-z0-9\-_]/g,'');
    }

    // ----- Main logic -----
    async function fetchAllMergedPRs(repo) {
        const headers = { 'Accept': 'application/vnd.github.v3+json' };
        if (useApiToken && API_TOKEN) headers['Authorization'] = `token ${API_TOKEN}`;

        let page = 1;
        const perPage = 100;
        let all = [];
        while (true) {
            const url = `https://api.github.com/repos/${repo}/pulls?state=closed&per_page=${perPage}&page=${page}&sort=updated&direction=desc`;
            const resp = await fetch(url, { headers });
            const rl = checkRateLimitFromHeaders(resp);
            displayRateLimitOnPage(rl);
            if (!resp.ok) {
                if (resp.status === 403 && !useApiToken && API_TOKEN) {
                    useApiToken = true;
                    return await fetchAllMergedPRs(repo);
                }
                throw new Error(`GitHub API error fetching PRs: ${resp.status} ${resp.statusText}`);
            }
            const pageData = await resp.json();
            if (!Array.isArray(pageData)) break;
            all = all.concat(pageData.filter(p => p.merged_at));
            if (pageData.length < perPage) break;
            page++;
            await new Promise(r => setTimeout(r, 300)); // small delay between pages
        }
        return all;
    }

    // Compute initial contributor entries from PRs and then fetch profile details in batches
    async function processContributors(prs, repo, leaderboardMap) {
        const contributors = new Map();
        prs.forEach(pr => {
            const username = (pr.user && pr.user.login) ? pr.user.login : 'unknown';
            if (!contributors.has(username)) {
                contributors.set(username, {
                    name: username,
                    avatar: pr.user ? pr.user.avatar_url : '',
                    profileUrl: pr.user ? pr.user.html_url : '',
                    prs: [],
                    totalPRs: 0,
                    levelPRs: {1:0,2:0,3:0},
                    maxLevel: 1,
                    level: 1,
                    score: 0,
                    bio: '',
                    company: '',
                    location: '',
                    linkedinUrl: '',
                    twitterUrl: '',
                    websiteUrl: ''
                });
            }
            const c = contributors.get(username);
            c.prs.push(pr);
            c.totalPRs++;
            const lvl = extractLevelFromLabels(pr.labels || []);
            c.levelPRs[lvl] = (c.levelPRs[lvl] || 0) + 1;
            if (lvl > c.maxLevel) c.maxLevel = lvl;
        });

        // Batch fetch profiles for contributors (skip some well-known bots or yourself if needed)
        const excludedUsers = ['dependabot[bot]']; // add any additional excludes (case-sensitive)
        const usernames = Array.from(contributors.keys()).filter(u => !excludedUsers.includes(u));
        const batchSize = 10;
        for (let i = 0; i < usernames.length; i += batchSize) {
            const batch = usernames.slice(i, i + batchSize);
            const promises = batch.map(async (username, idx) => {
                try {
                    // small stagger inside batch
                    await new Promise(r => setTimeout(r, idx * 150));
                    const headers = {'Accept': 'application/vnd.github.v3+json'};
                    if (useApiToken && API_TOKEN) headers['Authorization'] = `token ${API_TOKEN}`;
                    const res = await fetch(`https://api.github.com/users/${username}`, { headers });
                    if (!res.ok) {
                        if (res.status === 403) {
                            console.warn('Rate limited fetching user', username);
                            return;
                        }
                        console.warn('Failed to fetch user', username, res.status);
                        return;
                    }
                    const ud = await res.json();
                    const c = contributors.get(username);
                    if (!c) return;
                    c.bio = ud.bio || '';
                    c.company = ud.company || '';
                    c.location = ud.location || '';
                    c.websiteUrl = ud.blog || '';
                    c.twitterUrl = ud.twitter_username ? `https://twitter.com/${ud.twitter_username}` : '';
                    // try to detect linkedin from bio
                    const bioLower = (ud.bio || '').toLowerCase();
                    const liMatch = (ud.blog || '').match(/linkedin\.com\/in\/[A-Za-z0-9\-_]+/i) || bioLower.match(/linkedin\.com\/in\/([a-z0-9\-_]+)/i);
                    if (liMatch) {
                        c.linkedinUrl = liMatch[0].startsWith('http') ? liMatch[0] : `https://${liMatch[0]}`;
                    }
                } catch (e) {
                    console.warn('Error fetching user profile', username, e.message);
                }
            });
            await Promise.all(promises);
            // small pause between batches
            if (i + batchSize < usernames.length) await new Promise(r => setTimeout(r, 700));
        }

        // compute baseline scores from labels
        contributors.forEach(c => {
            c.level = c.maxLevel || 1;
            c.score = ( (c.levelPRs[1] || 0) * 3 ) + ( (c.levelPRs[2] || 0) * 7 ) + ( (c.levelPRs[3] || 0) * 10 );
        });

        // if a leaderboard.md override exists, apply those points (override score)
        if (leaderboardMap && leaderboardMap.size) {
            leaderboardMap.forEach((points, usernameLower) => {
                // find matching contributor by lowercase username
                const found = Array.from(contributors.values()).find(cc => cc.name.toLowerCase() === usernameLower);
                if (found) {
                    found.score = points;
                    found._scoreSource = 'leaderboard.md';
                } else {
                    // If not found, add a placeholder contributor (so leaderboard matches)
                    contributors.set(usernameLower, {
                        name: usernameLower,
                        avatar: '',
                        profileUrl: `https://github.com/${usernameLower}`,
                        prs: [],
                        totalPRs: 0,
                        levelPRs: {1:0,2:0,3:0},
                        maxLevel: 1,
                        level: 1,
                        score: points,
                        bio: '',
                        company: '',
                        location: '',
                        linkedinUrl: '',
                        twitterUrl: '',
                        websiteUrl: '',
                        _scoreSource: 'leaderboard.md'
                    });
                }
            });
        }

        return contributors;
    }

    function extractLevelFromLabels(labels) {
        if (!Array.isArray(labels)) return 1;
        for (const label of labels) {
            const n = (label && label.name) ? label.name.toString().toLowerCase() : '';
            if (/level\s*3|level3|hard|critical/.test(n)) return 3;
            if (/level\s*2|level2|medium|moderate/.test(n)) return 2;
            if (/level\s*1|level1|easy|low/.test(n)) return 1;
        }
        return 1;
    }

    // ----- Render helpers -----
    function createCertificateLink(obj, rank) {
        const params = new URLSearchParams({
            name: obj.name || '',
            level: obj.level || '',
            prs: obj.totalPRs || 0,
            rank: rank || '',
            score: obj.score || 0,
            avatar: encodeURIComponent(obj.avatar || '')
        });
        return `certificate.html?${params.toString()}`;
    }

    function displayResults(prs, contributorsMap) {
        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            console.error('content element not found');
            return;
        }

        const contributorsCount = contributorsMap.size;
        const level3Count = Array.from(contributorsMap.values()).filter(c => c.level === 3).length;
        const level2Count = Array.from(contributorsMap.values()).filter(c => c.level === 2).length;

        const statsHTML = `
            <div class="stats">
                <div class="stat-card"><div class="stat-number">${prs.length}</div><div class="stat-label">Merged PRs</div></div>
                <div class="stat-card"><div class="stat-number">${contributorsCount}</div><div class="stat-label">Contributors</div></div>
                <div class="stat-card"><div class="stat-number">${level3Count}</div><div class="stat-label">Level 3</div></div>
                <div class="stat-card"><div class="stat-number">${level2Count}</div><div class="stat-label">Level 2</div></div>
            </div>
        `;

        const contributorsHTML = renderContributorsSection(contributorsMap);
        const prsHTML = renderPRsSection(prs);

        contentDiv.innerHTML = statsHTML + contributorsHTML + prsHTML;
    }

    function renderContributorsSection(contributorsMap) {
        const excludedUsersLower = ['vaibhavbabele', 'dependabot[bot]'].map(s => s.toLowerCase());

        const arr = Array.from(contributorsMap.values()).filter(c => !excludedUsersLower.includes((c.name || '').toLowerCase()));
        arr.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (b.totalPRs || 0) - (a.totalPRs || 0);
        });

        const topThree = arr.slice(0, 3);
        const rest = arr.slice(3);

        // podium
        let podiumHTML = `<div class="ranking-podium">`;
        const podiumItem = (item, pos) => {
            if (!item) return '';
            const crown = pos === 1 ? '👑' : pos === 2 ? '🥈' : '🥉';
            const rank = pos;
            const certLink = createCertificateLink(item, rank);
            return `
                <div class="podium-item position-${pos}">
                    <div class="podium-avatar"><img src="${item.avatar || ''}" alt="${item.name}"><div class="crown">${crown}</div></div>
                    <div class="podium-name">${item.name}</div>
                    <div class="podium-score">⭐ ${item.score}</div>
                    <div class="podium-level">Level ${item.level}</div>
                    <div class="podium-prs">📊 ${item.totalPRs || 0} PRs</div>
                    <div class="podium-links">
                        <a href="${item.profileUrl || '#'}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
                        ${item.linkedinUrl ? `<a href="${item.linkedinUrl}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
                    </div>
                    <div class="download-certificate">
                        <a href="${certLink}" class="download-link" target="_blank" title="Download Certificate"><p>Download Certificate</p></a>
                    </div>
                </div>
            `;
        };

        // order visually as 2,1,3 if you want center-first look — keeping simple: 1,2,3
        podiumHTML += podiumItem(topThree[0], 1);
        podiumHTML += podiumItem(topThree[1], 2);
        podiumHTML += podiumItem(topThree[2], 3);
        podiumHTML += `</div>`;

        // list the rest
        const listHTML = rest.map((c, i) => {
            const rank = i + 4;
            const levelTextArr = ['Beginner','Intermediate','Advanced'];
            const levelText = levelTextArr[(c.level || 1) - 1] || 'Beginner';
            const certLink = createCertificateLink(c, rank);
            return `
                <div class="contributor-rank-item level-${c.level || 1}">
                    <div class="rank-number">${rank}</div>
                    <div class="contributor-avatar"><img src="${c.avatar || ''}" alt="${c.name}"></div>
                    <div class="contributor-details">
                        <div class="contributor-name">${c.name}</div>
                        <div class="contributor-level">Level ${c.level || 1} - ${levelText}</div>
                        ${c.bio ? `<div class="contributor-bio">${c.bio.substring(0,120)}${c.bio.length>120 ? '...' : ''}</div>` : ''}
                    </div>
                    <div class="contributor-stats">
                        <div class="score">⭐ ${c.score}</div>
                        <div class="pr-count">📊 ${c.totalPRs || 0} PRs</div>
                    </div>
                    <div class="contributor-actions">
                        <div class="social-links">
                            <a href="${c.profileUrl || '#'}" target="_blank"><i class="fab fa-github"></i></a>
                            ${c.linkedinUrl ? `<a href="${c.linkedinUrl}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        </div>
                        <div class="download-certificate">
                            <a href="${certLink}" class="download-link" target="_blank"><p>Download Certificate</p></a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="contributors-section">
                <h2 class="section-title">🏆 Top Contributors Ranking</h2>
                ${podiumHTML}
                <div class="contributors-ranking-list">
                    ${listHTML}
                </div>
            </div>
        `;
    }

    function renderPRsSection(prs) {
        const prsHTML = prs.slice(0, 10).map(pr => {
            const labels = (pr.labels || []).map(label => `<span class="label" style="background-color: #${label.color}; color: ${getContrastColor(label.color)}">${label.name}</span>`).join('');
            const mergedDate = pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : '';
            const level = extractLevelFromLabels(pr.labels || []);
            const emoji = level === 3 ? '💎' : level === 2 ? '⭐' : '🔰';
            return `
                <div class="pr-item">
                    <div class="pr-header-item">
                        <div class="pr-title">${emoji} ${escapeHtml(pr.title || '')}</div>
                        <a href="${pr.html_url}" target="_blank" class="pr-number">#${pr.number}</a>
                    </div>
                    <div class="pr-meta"><span>👤 ${pr.user.login}</span> <span>📅 Merged: ${mergedDate}</span></div>
                    ${labels ? `<div class="pr-labels">${labels}</div>` : ''}
                </div>
            `;
        }).join('');
        return `
            <div class="prs-section">
                <h2 class="section-title">📋 Recent Merged Pull Requests</h2>
                <div class="prs-list">${prsHTML}</div>
            </div>
        `;
    }

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m]; });
    }

    function showError(message) {
        const contentDiv = document.getElementById('content');
        if (contentDiv) contentDiv.innerHTML = `<div class="error">❌ ${escapeHtml(message)}</div>`;
    }

    // Add a small refresh button for manual reload / clearing cache
    function addRefreshButton() {
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed; top:100px; left:12px; z-index:10000;';
        container.innerHTML = `<button id="pr-refresh-btn" title="Refresh contributors and clear cache" style="padding:8px 10px;border-radius:6px;border:none;background:#222;color:#fff;cursor:pointer;">🔄 Refresh</button>`;
        document.body.appendChild(container);
        const btn = document.getElementById('pr-refresh-btn');
        btn.addEventListener('click', () => {
            clearCache();
            fetchPRs(); // re-run main flow
        });
    }

    // ----- Main entrypoint -----
    async function fetchPRs() {
        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            console.error('No #content container. Aborting.');
            return;
        }
        contentDiv.innerHTML = `<div class="loading">🔄 Fetching contributors — please wait...</div>`;

        const repo = getRepoFromDocOrHost();
        if (!repo) {
            showError('Could not determine repository. Add data-repo="owner/repo" to <body>.');
            return;
        }

        // Try cache
        const cachedPRs = getFromCache(CACHE_KEYS.PRS);
        const cachedContributors = getFromCache(CACHE_KEYS.CONTRIBUTORS);

        if (cachedPRs && cachedContributors && isCacheValid()) {
            console.log('Using cached data');
            const prs = cachedPRs;
            const contributorsMap = new Map(cachedContributors);
            displayResults(prs, contributorsMap);
            displayCacheStatus();
            return;
        }

     try {
    // Try loading leaderboard.md (local or raw)
    const leaderboardMap = await tryLoadLeaderboard(repo);

    let mergedPRs = [];
    let contributorsMap = new Map();

    try {
        // Fetch all merged PRs (paginated)
        mergedPRs = await fetchAllMergedPRs(repo);

        // Process contributors and fetch profile details
        contributorsMap = await processContributors(mergedPRs, repo, leaderboardMap);

        // Cache results
        saveToCache(CACHE_KEYS.PRS, mergedPRs);
        saveToCache(CACHE_KEYS.CONTRIBUTORS, Array.from(contributorsMap.entries()));

        console.log('✅ Contributors data fetched via GitHub API.');

    } catch (apiErr) {
        console.warn('GitHub API failed, falling back to leaderboard.md', apiErr);

        if (!leaderboardMap || leaderboardMap.size === 0) {
            showError('Could not fetch contributors from GitHub API and leaderboard.md is empty.');
            return;
        }

        // Build contributorsMap directly from leaderboard
        leaderboardMap.forEach((points, usernameLower) => {
            contributorsMap.set(usernameLower, {
                name: usernameLower,
                avatar: '',
                profileUrl: `https://github.com/${usernameLower}`,
                prs: [],
                totalPRs: 0,
                levelPRs: {1:0,2:0,3:0},
                maxLevel: 1,
                level: 1,
                score: points,
                bio: '',
                company: '',
                location: '',
                linkedinUrl: '',
                twitterUrl: '',
                websiteUrl: '',
                _scoreSource: 'leaderboard.md'
            });
        });

        console.log('✅ Contributors data loaded from leaderboard.md fallback.');
    }

    // Finally, display whatever we have
    displayResults(mergedPRs, contributorsMap);
    displayCacheStatus();

} catch (err) {
    console.error(err);
    showError(err.message || 'Unknown error while fetching contributors.');
}

    }

    // Initialize on load
    window.addEventListener('load', () => {
        try {
            fetchPRs();
            addRefreshButton();
        } catch (e) {
            console.error(e);
        }
    });

})();


