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
  return new Promise((resolve, reject) => {
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
        if (res.statusCode === 403) {
          console.warn(`API rate limit exceeded on ${path}`);
          resolve({
            data: [],
            hasNextPage: false
          });
          return;
        }
        if (res.statusCode >= 400) {
          console.warn(`API error ${res.statusCode} on ${path}: ${data.substring(0, 200)}`);
          resolve({
            data: [],
            hasNextPage: false
          });
          return;
        }
        try {
          const jsonData = JSON.parse(data);
          resolve({
            data: jsonData,
            hasNextPage: res.headers.link && res.headers.link.includes('rel="next"')
          });
        } catch (error) {
          console.warn(`JSON parse error on ${path}:`, error.message);
          resolve({
            data: [],
            hasNextPage: false
          });
        }
      });
    });

    req.on('error', (error) => {
      console.warn(`Network error on ${path}:`, error.message);
      resolve({
        data: [],
        hasNextPage: false
      });
    });
    req.end();
  });
}

async function fetchAllPages(path) {
  let allData = [];
  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    try {
      const response = await apiRequest(path, page);
      allData = allData.concat(response.data);
      hasNextPage = response.hasNextPage;
      page++;
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
      break;
    }
  }
  return allData;
}

// Fetch user public profile (for email)
async function fetchUserProfile(username) {
  try {
    const response = await apiRequest(`/users/${username}`);
    return response.data;
  } catch {
    return {};
  }
}

async function generateLeaderboard() {
  try {
    console.log('Fetching closed PRs...');
    const prs = await fetchAllPages(`/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=closed&sort=updated&direction=desc`);
    console.log(`Found ${prs.length} closed PRs`);
    const contributorStats = {};

    // Level point system
    const LEVEL_POINTS = {
      'level1': 3,
      'level 1': 3,
      'level2': 7,
      'level 2': 7,
      'level3': 10,
      'level 3': 10,
    };

    // For each PR, check if merged and has level label and 'gssoc25'
    for (const pr of prs) {
      if (!pr.merged_at) continue;
      const labels = (pr.labels || []).map(label => label.name.toLowerCase());
      const hasGssoc = labels.includes('gssoc25');
      const username = pr.user.login;
      if (!hasGssoc) continue;

      if (!contributorStats[username]) {
        contributorStats[username] = {
          level1: 0,
          level2: 0,
          level3: 0,
          mergedPRs: 0,
          points: 0,
          email: '',
        };
      }
      contributorStats[username].mergedPRs++;

      // Count level labels and calculate points
      for (const label of labels) {
        if (LEVEL_POINTS[label]) {
          if (label === 'level1' || label === 'level 1') contributorStats[username].level1++;
          if (label === 'level2' || label === 'level 2') contributorStats[username].level2++;
          if (label === 'level3' || label === 'level 3') contributorStats[username].level3++;
          contributorStats[username].points += LEVEL_POINTS[label];
        }
      }
    }

    // Fetch email addresses for contributors
    for (const username of Object.keys(contributorStats)) {
      const profile = await fetchUserProfile(username);
      contributorStats[username].email = profile.email || '';
    }

    // Generate leaderboard markdown
    let leaderboard = `# 🏆 GSSoC '25 Contributors Leaderboard

This leaderboard tracks contributors whose merged PRs have \`level1\`, \`level2\`, or \`level3\` labels **and** are part of \`gssoc25\`.

*Last updated: ${new Date().toISOString().split('T')[0]}*

| Username | Email | Level 1 | Level 2 | Level 3 | PRs Merged | Total Points |
|----------|-------|---------|---------|---------|------------|--------------|
`;

    const sortedContributors = Object.entries(contributorStats)
      .map(([username, stats]) => ({
        username,
        ...stats
      }))
      .sort((a, b) => b.points - a.points);

    if (sortedContributors.length === 0) {
      leaderboard += '| *No contributors yet* | - | - | - | - | - | - |\n';
    } else {
      for (const contributor of sortedContributors) {
        leaderboard += `| [@${contributor.username}](https://github.com/${contributor.username}) | ${contributor.email ? contributor.email : '-'} | ${contributor.level1} | ${contributor.level2} | ${contributor.level3} | ${contributor.mergedPRs} | ${contributor.points} |\n`;
      }
    }

    leaderboard += `
---

**Point System:**
- **Level 1 PR:** 3 points
- **Level 2 PR:** 7 points
- **Level 3 PR:** 10 points

Total Points = Sum of all level points earned.

*This leaderboard is automatically updated every day at 12:00 AM by GitHub Actions.*

- **Level 1/2/3:** Number of merged PRs with respective level label and 'gssoc25'
- **PRs Merged:** Number of merged PRs matching above criteria
- **Email:** Public email from GitHub profile (if available)
`;

    fs.writeFileSync('LEADERBOARD.md', leaderboard);

    console.log('✅ LEADERBOARD.md generated successfully!');
    console.log(`📊 Total contributors: ${sortedContributors.length}`);

  } catch (error) {
    console.error('❌ Error generating leaderboard:', error);
    process.exit(1);
  }
}

generateLeaderboard();