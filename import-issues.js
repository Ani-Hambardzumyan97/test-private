const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const GITHUB_TOKEN = process.env.MY_GITHUB_TOKEN;
const REPO_OWNER = 'Ani-Hambardzumyan97'; // Change to your GitHub username
const REPO_NAME = 'test-private'; // Change to your repo name
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;

async function createIssue(issue) {
    try {
        const response = await axios.post(API_URL, issue, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        console.log(`✅ Created issue: ${issue.title}`);
    } catch (error) {
        console.error(`❌ Error creating issue: ${issue.title}`, error.response.data);
    }
}

fs.createReadStream('issues.csv')
    .pipe(csv())
    .on('data', async (row) => {
        const issue = {
            title: row.title,
            body: row.body,
            labels: row.labels ? row.labels.split(',') : [],
            assignees: row.assignees ? row.assignees.split(',') : [],
        };
        await createIssue(issue);
    })
    .on('end', () => {
        console.log('🎉 All issues have been processed.');
    });
