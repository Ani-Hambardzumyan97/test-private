const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load CSV file
const csvFilePath = path.join(__dirname, 'issues.csv');
const issuesData = fs.readFileSync(csvFilePath, 'utf-8');
const issues = issuesData.split('\n').slice(1).map(line => {
  const [title, body, labels, assignees] = line.split(',');
  return { title, body, labels, assignees: assignees || '' };
});

// Get the GitHub token from the environment variable
const token = process.env.MY_GITHUB_TOKEN;
const username = 'Ani-Hambardzumyan97';  // Replace with your username or organization name
const repository = 'test-private';  // Replace with your repository name

const apiUrl = `https://api.github.com/repos/${username}/${repository}/issues`;

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
};

async function createIssue(issue) {
  try {
    const response = await axios.post(apiUrl, {
      title: issue.title,
      body: issue.body,
      labels: issue.labels.split(','),
      assignees: issue.assignees ? issue.assignees.split(',') : [],
    }, { headers });

    console.log(`Issue created: ${response.data.title}`);
  } catch (error) {
    console.error(`❌ Error creating issue: ${issue.title}`, error.response.data);
  }
}

// Create issues
(async () => {
  for (const issue of issues) {
    await createIssue(issue);
  }
})();
