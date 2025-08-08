#!/usr/bin/env node

import https from "https";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error("Missing required environment variables");
  process.exit(1);
}

function apiRequest(path, method = "GET", body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method,
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "User-Agent": "close-inactive-issues-script",
        "Accept": "application/vnd.github.v3+json"
      }
    };
    if (body) {
      options.headers["Content-Type"] = "application/json";
    }
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        if (res.statusCode >= 400) {
          console.error(`API error ${res.statusCode} for ${path}: ${data}`);
          resolve(null);
          return;
        }
        resolve(JSON.parse(data));
      });
    });
    req.on("error", (error) => {
      console.error(`Network error: ${error.message}`);
      reject(error);
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function getAllOpenIssues() {
  let page = 1, allIssues = [];
  while (true) {
    const issues = await apiRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&per_page=100&page=${page}`);
    if (!issues || issues.length === 0) break;
    // Filter to only issues (not PRs)
    allIssues = allIssues.concat(issues.filter(issue => !issue.pull_request));
    if (issues.length < 100) break;
    page++;
  }
  return allIssues;
}

function daysAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.floor((now - past) / msInDay);
}

async function closeIssue(issue) {
  await apiRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}`, "PATCH", { state: "closed" });
  await apiRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}/comments`, "POST", {
    body: "Closing this issue automatically because it has been inactive and unlabeled for more than 5 days."
  });
  console.log(`Closed issue #${issue.number}`);
}

async function main() {
  const issues = await getAllOpenIssues();
  for (const issue of issues) {
    // If issue is open for more than 5 days and has no labels assigned
    if (daysAgo(issue.created_at) >= 5 && (!issue.labels || issue.labels.length === 0)) {
      await closeIssue(issue);
    }
  }
}

main();
