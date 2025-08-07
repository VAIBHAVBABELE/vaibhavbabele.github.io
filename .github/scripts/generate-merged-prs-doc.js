#!/usr/bin/env node

import https from 'https';
import fs from 'fs';

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
      path: `${path}${path.includes('?') ? '&' : '?'}page=${page}&per_page=50`,
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'merged-prs-doc-generator',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          console.warn(`API error ${res.statusCode} on ${path}: ${data.substring(0, 200)}`);
          resolve({ data: [], hasNextPage: false });
          return;
        }
        try {
          const jsonData = JSON.parse(data);
          resolve({
            data: jsonData,
            hasNextPage: res.headers.link && res.headers.link.includes('rel="next"')
          });
        } catch (err) {
          console.warn(`JSON parse error on ${path}:`, err.message);
          resolve({ data: [], hasNextPage: false });
        }
      });
    });
    req.on('error', (error) => {
      console.warn(`Network error on ${path}:`, error.message);
      resolve({ data: [], hasNextPage: false });
    });
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
      await new Promise(resolve => setTimeout(resolve, 120));
    }
  }
  return allData;
}

async function fetchFilesChanged(prNumber) {
  const files = await fetchAllPages(`/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${prNumber}/files`);
  return files.map(file => file.filename);
}

function trimDescription(text, maxWords = 100) {
  if (!text) return '_No description provided._';
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + ' ...';
}

async function fetchPRDetails(prNumber) {
  // Get extra details: commits, additions, deletions, etc.
  return apiRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${prNumber}`);
}

async function generateMergedPRsDoc() {
  try {
    console.log('Fetching closed PRs...');
    const prs = await fetchAllPages(`/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=closed&sort=updated&direction=desc`);
    const mergedPRs = prs.filter(pr => pr.merged_at);

    let doc = `# 📋 Merged Pull Requests Documentation

This document lists all merged PRs with details: author, title, description (max 100 words), files changed, labels, who merged, merge timestamp, number of lines updated, number of commits, and PR link.

*Last updated: ${new Date().toISOString().split('T')[0]}*

| # | Title | Author | Description | Files Changed | Labels | Merged By | Merged At | Lines Updated | Commits | PR Link |
|---|-------|--------|-------------|--------------|--------|-----------|-----------|--------------|---------|---------|
`;

    // For detailed listing below table
    let detailsSection = `\n---\n\n## 📝 Detailed Merged PRs\n`;

    for (let pr of mergedPRs) {
      // Get files changed
      const filesChanged = await fetchFilesChanged(pr.number);

      // Get labels
      const labels = (pr.labels || []).map(label => label.name);

      // Who merged
      let mergedBy = pr.merged_by?.login;
      if (!mergedBy) {
        const prDetailsResp = await fetchPRDetails(pr.number);
        if (prDetailsResp && prDetailsResp.data && prDetailsResp.data.merged_by) {
          mergedBy = prDetailsResp.data.merged_by.login;
        } else {
          mergedBy = 'Unknown';
        }
      }

      // Get PR details for lines updated, commits
      let prDetails = pr;
      if (!('additions' in pr) || !('deletions' in pr) || !('commits' in pr)) {
        const prDetailsResp = await fetchPRDetails(pr.number);
        if (prDetailsResp && prDetailsResp.data) {
          prDetails = prDetailsResp.data;
        }
      }
      const linesUpdated = (prDetails.additions || 0) + (prDetails.deletions || 0);
      const commitCount = prDetails.commits || '-';

      // Description
      const description = trimDescription(pr.body, 100);

      // Table row
      doc += `| [#${pr.number}](https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${pr.number}) | ${pr.title.replace(/\|/g, '\\|')} | [@${pr.user.login}](https://github.com/${pr.user.login}) | ${description.replace(/\|/g, '\\|')} | ${filesChanged.length} | ${labels.join(', ')} | [@${mergedBy}](https://github.com/${mergedBy}) | ${pr.merged_at ? pr.merged_at.split('T')[0] : '-'} | ${linesUpdated} | ${commitCount} | [PR Link](https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${pr.number}) |\n`;

      // Details section
      detailsSection += `
### [#${pr.number} ${pr.title}](https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${pr.number})

- **Author:** [@${pr.user.login}](https://github.com/${pr.user.login})
- **Description:**  
${description}
- **Files Changed (${filesChanged.length}):**
  ${filesChanged.length ? filesChanged.map(f => `  - \`${f}\``).join('\n') : 'None'}
- **Labels:** ${labels.length ? labels.map(l => `\`${l}\``).join(', ') : 'None'}
- **Merged By:** [@${mergedBy}](https://github.com/${mergedBy})
- **Merged At:** ${pr.merged_at ? pr.merged_at.replace('T', ' ').replace('Z', '') : '-'}
- **Lines Updated:** ${linesUpdated}
- **Commits:** ${commitCount}
- **PR Link:** [PR #${pr.number}](https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${pr.number})

---
`;
    }

    doc += detailsSection;

    fs.writeFileSync('MERGED_PRS.md', doc);
    console.log('✅ MERGED_PRS.md generated successfully!');
    console.log(`📊 Total merged PRs: ${mergedPRs.length}`);
  } catch (err) {
    console.error('❌ Error generating merged PRs documentation:', err);
    process.exit(1);
  }
}

generateMergedPRsDoc();
