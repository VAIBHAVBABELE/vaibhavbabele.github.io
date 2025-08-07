#!/usr/bin/env node

const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// GitHub API helper function
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

// Fetch all pages of results
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

async function generateLeaderboard() {
  try {
    console.log('Fetching closed PRs...');
    // Fetch closed PRs
    const prs = await fetchAllPages(`/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=closed&sort=updated&direction=desc`);
    console.log(`Found ${prs.length} closed PRs`);
    const contributorStats = {};

    // Only merged PRs with required labels
    const requiredLevels = ['level1', 'level2', 'level3', 'level 1', 'level 2', 'level 3'];

    // For each PR, check if merged and has level label and 'gssoc25'
    prs.forEach(pr => {
      if (!pr.merged_at) return; // Only merged PRs
      const labels = (pr.labels || []).map(label => label.name.toLowerCase());
      const hasLevel = labels.some(label => requiredLevels.includes(label));
      const hasGssoc = labels.includes('gssoc25');
      if (hasLevel && hasGssoc) {
        const username = pr.user.login;
        if (!contributorStats[username]) {
          contributorStats[username] = {
            level1: 0,
            level2: 0,
            level3: 0,
            mergedPRs: 0
          };
        }
        contributorStats[username].mergedPRs++;
        // Increment levels according to label
        if (labels.includes('level1') || labels.includes('level 1')) contributorStats[username].level1++;
        if (labels.includes('level2') || labels.includes('level 2')) contributorStats[username].level2++;
        if (labels.includes('level3') || labels.includes('level 3')) contributorStats[username].level3++;
      }
    });

    // Generate leaderboard markdown
    let leaderboard = `# 🏆 GSSoC '25 Contributors Leaderboard

This leaderboard tracks contributors whose merged PRs have \`level1\`, \`level2\`, or \`level3\` labels **and** are part of \`gssoc25\`.

*Last updated: ${new Date().toISOString().split('T')[0]}*

| Username | Level 1 | Level 2 | Level 3 | PRs Merged |
|----------|---------|---------|---------|-------------|
`;

    // Sort contributors by total contributions (sum of all levels + PRs)
    const sortedContributors = Object.entries(contributorStats)
      .map(([username, stats]) => ({
        username,
        ...stats,
        total: stats.level1 + stats.level2 + stats.level3 + stats.mergedPRs
      }))
      .sort((a, b) => b.total - a.total);

    if (sortedContributors.length === 0) {
      leaderboard += '| *No contributors yet* | - | - | - | - |\n';
    } else {
      sortedContributors.forEach(contributor => {
        leaderboard += `| [@${contributor.username}](https://github.com/${contributor.username}) | ${contributor.level1} | ${contributor.level2} | ${contributor.level3} | ${contributor.mergedPRs} |\n`;
      });
    }

    leaderboard += `
---

**Legend:**
- **Level 1/2/3**: Number of merged PRs with respective level labels and 'gssoc25'
- **PRs Merged**: Number of merged PRs matching above criteria
- Contributors are sorted by total contributions (levels + PRs)

*This leaderboard is automatically updated by GitHub Actions.*
`;

    // Write to file
    const fs = require('fs');
    fs.writeFileSync('LEADERBOARD.md', leaderboard);

    console.log('✅ LEADERBOARD.md generated successfully!');
    console.log(`📊 Total contributors: ${sortedContributors.length}`);

  } catch (error) {
    console.error('❌ Error generating leaderboard:', error);
    process.exit(1);
  }
}

generateLeaderboard();
