#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('Missing required environment variables');
  process.exit(1);
}

function apiRequest(path, page = 1) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: `${path}${path.includes('?') ? '&' : '?'}page=${page}&per_page=100`,
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'leaderboard-generator',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 400) {
            resolve({ data: [], hasNextPage: false });
            return;
          }
          const jsonData = JSON.parse(data);
          resolve({
            data: jsonData,
            hasNextPage: res.headers.link && res.headers.link.includes('rel="next"')
          });
        } catch {
          resolve({ data: [], hasNextPage: false });
        }
      });
    });

    req.on('error', () => resolve({ data: [], hasNextPage: false }));
    req.end();
  });
}

async function fetchAllPages(path) {
  let allData = [];
  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const response = await apiRequest(path, page);
    allData = allData.concat(response.data);
    hasNextPage = response.hasNextPage;
    page++;
    if (hasNextPage) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  return allData;
}

async function fetchUserProfile(username) {
  const response = await apiRequest(`/users/${username}`);
  return response.data || {};
}

// Normalizer: remove spaces, colons, dashes
function normalizeLabel(label) {
  return label.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function generateLeaderboard() {
  try {
    console.log('Fetching closed PRs...');
    const prs = await fetchAllPages(`/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=closed&sort=updated&direction=desc`);
    console.log(`Found ${prs.length} closed PRs`);

    const gssocStats = {};
    const osciStats = {};

    // Point systems
    const GSSOC_POINTS = { level1: 3, level2: 7, level3: 10 };
    const OSCI_POINTS = { easy: 10, intermediate: 20, hard: 30 };

    for (const pr of prs) {
      if (!pr.merged_at) continue;
      const labels = (pr.labels || []).map(label => normalizeLabel(label.name));
      const username = pr.user.login;

      // GSSoC’25
      if (labels.includes('gssoc25')) {
        if (!gssocStats[username]) {
          gssocStats[username] = { level1: 0, level2: 0, level3: 0, mergedPRs: 0, points: 0, email: '' };
        }
        gssocStats[username].mergedPRs++;
        for (const label of labels) {
          if (GSSOC_POINTS[label]) {
            gssocStats[username][label]++;
            gssocStats[username].points += GSSOC_POINTS[label];
          }
        }
      }

      // OSCI’25
      if (labels.includes('osci25')) {
        if (!osciStats[username]) {
          osciStats[username] = { easy: 0, intermediate: 0, hard: 0, mergedPRs: 0, points: 0, email: '' };
        }
        osciStats[username].mergedPRs++;
        for (const label of labels) {
          if (OSCI_POINTS[label]) {
            osciStats[username][label]++;
            osciStats[username].points += OSCI_POINTS[label];
          }
        }
      }
    }

    // Fetch emails
    for (const username of Object.keys({ ...gssocStats, ...osciStats })) {
      const profile = await fetchUserProfile(username);
      if (gssocStats[username]) gssocStats[username].email = profile.email || '';
      if (osciStats[username]) osciStats[username].email = profile.email || '';
    }

    let leaderboard = `# 🏆 Contributors Leaderboard\n\n*Last updated: ${new Date().toISOString().split('T')[0]}*\n\n`;

    // GSSoC Table
    leaderboard += `## 🌸 GSSoC '25 Leaderboard\n\n`;
    leaderboard += `| Username | Email | Level 1 | Level 2 | Level 3 | PRs Merged | Total Points |\n`;
    leaderboard += `|----------|-------|---------|---------|---------|------------|--------------|\n`;

    const sortedGssoc = Object.entries(gssocStats).map(([u, s]) => ({ username: u, ...s })).sort((a, b) => b.points - a.points);

    if (sortedGssoc.length === 0) {
      leaderboard += `| *No contributors yet* | - | - | - | - | - | - |\n`;
    } else {
      for (const c of sortedGssoc) {
        leaderboard += `| [@${c.username}](https://github.com/${c.username}) | ${c.email || '-'} | ${c.level1} | ${c.level2} | ${c.level3} | ${c.mergedPRs} | ${c.points} |\n`;
      }
    }

    leaderboard += `\n**Point System:** Level1 = 3, Level2 = 7, Level3 = 10\n\n`;

    // OSCI Table
    leaderboard += `## 🚀 OSCI '25 Leaderboard\n\n`;
    leaderboard += `| Username | Email | Easy | Intermediate | Hard | PRs Merged | Total Points |\n`;
    leaderboard += `|----------|-------|------|--------------|------|------------|--------------|\n`;

    const sortedOsci = Object.entries(osciStats).map(([u, s]) => ({ username: u, ...s })).sort((a, b) => b.points - a.points);

    if (sortedOsci.length === 0) {
      leaderboard += `| *No contributors yet* | - | - | - | - | - | - |\n`;
    } else {
      for (const c of sortedOsci) {
        leaderboard += `| [@${c.username}](https://github.com/${c.username}) | ${c.email || '-'} | ${c.easy} | ${c.intermediate} | ${c.hard} | ${c.mergedPRs} | ${c.points} |\n`;
      }
    }

    leaderboard += `\n**Point System:** Easy = 10, Intermediate = 20, Hard = 30\n`;

    fs.writeFileSync('LEADERBOARD.md', leaderboard);
    console.log('✅ LEADERBOARD.md generated with GSSoC & OSCI tables!');

  } catch (err) {
    console.error('❌ Error generating leaderboard:', err);
    process.exit(1);
  }
}

generateLeaderboard();
