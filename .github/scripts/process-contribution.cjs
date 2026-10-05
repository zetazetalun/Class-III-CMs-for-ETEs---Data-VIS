/**
 * GitHub Actions script: Process Paper Contribution from Issue
 * 
 * Automatically parses paper contribution submissions from GitHub Issues,
 * extracts manuscript files and metadata, creates structured directories
 * under /Contributions/, commits them directly to the repository,
 * and replies/closes the issue.
 * 
 * Zero External Servers Required!
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) {
    console.error('GITHUB_EVENT_PATH not set or file does not exist.');
    process.exit(1);
  }

  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const issue = event.issue;
  if (!issue) {
    console.log('No issue found in event payload. Skipping.');
    return;
  }

  // Check if issue is a contribution submission
  const labels = (issue.labels || []).map(l => (typeof l === 'string' ? l : l.name).toLowerCase());
  const title = issue.title || '';
  const isContribution = 
    labels.includes('contribution') || 
    labels.includes('paper-contribution') ||
    labels.includes('literature-submission') ||
    title.toLowerCase().startsWith('[contribution]') ||
    title.toLowerCase().startsWith('[paper submission]');

  if (!isContribution) {
    console.log('Issue is not labeled as a contribution. Skipping.');
    return;
  }

  // Check if already processed
  if (labels.includes('processed')) {
    console.log('Issue is already labeled "processed". Skipping.');
    return;
  }

  const body = issue.body || '';
  console.log(`Processing contribution issue #${issue.number}: "${title}"`);

  // 1. Parse metadata: First attempt structured JSON block, fallback to Markdown headings
  let metadata = {
    authors: '',
    contact: '',
    doi: '',
    title: '',
    notes: '',
    fileName: '',
    fileUrl: '',
    fileBase64: ''
  };

  const jsonMatch = body.match(/<!--\s*CONTRIBUTION_METADATA_START\s*-->([\s\S]*?)<!--\s*CONTRIBUTION_METADATA_END\s*-->/i);
  if (jsonMatch && jsonMatch[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1].trim());
      metadata = { ...metadata, ...parsed };
      console.log('Successfully extracted metadata from embedded JSON block.');
    } catch (e) {
      console.warn('Failed to parse embedded JSON block, falling back to markdown parsing:', e.message);
    }
  }

  // Fallback / complement with markdown heading extraction
  if (!metadata.authors) {
    const authorsMatch = body.match(/###\s*(?:Author\(s\)|Authors?)[\r\n]+([\s\S]*?)(?=###|$)/i);
    if (authorsMatch) metadata.authors = authorsMatch[1].trim();
  }
  if (!metadata.contact) {
    const contactMatch = body.match(/###\s*Contact[\r\n]+([\s\S]*?)(?=###|$)/i);
    if (contactMatch) metadata.contact = contactMatch[1].trim();
  }
  if (!metadata.doi) {
    const doiMatch = body.match(/###\s*(?:DOI|Digital Object Identifier)[\r\n]+([\s\S]*?)(?=###|$)/i);
    if (doiMatch) {
      metadata.doi = doiMatch[1].replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:)/i, '').trim();
    }
  }
  if (!metadata.title) {
    const titleMatch = body.match(/###\s*(?:Paper Title|Title)[\r\n]+([\s\S]*?)(?=###|$)/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    } else {
      // Clean title from issue title
      metadata.title = title.replace(/^\[(?:Contribution|Paper Submission)\]\s*:?\s*/i, '').trim();
    }
  }
  if (!metadata.notes) {
    const notesMatch = body.match(/###\s*(?:Notes|Abstract|Comments)[\r\n]+([\s\S]*?)(?=###|$)/i);
    if (notesMatch) metadata.notes = notesMatch[1].trim();
  }

  // Look for uploaded file in markdown links e.g. [paper.pdf](https://github.com/user-attachments/files/...)
  if (!metadata.fileUrl) {
    const fileLinkMatch = body.match(/\[([^\]]+\.(?:pdf|doc|docx|md|markdown))\]\((https:\/\/[^\s)]+)\)/i);
    if (fileLinkMatch) {
      metadata.fileName = metadata.fileName || fileLinkMatch[1];
      metadata.fileUrl = fileLinkMatch[2];
      console.log(`Found attached file link: ${metadata.fileName} at ${metadata.fileUrl}`);
    }
  }

  // Validate mandatory fields
  if (!metadata.authors || !metadata.contact || !metadata.doi) {
    const missing = [];
    if (!metadata.authors) missing.push('Author(s)');
    if (!metadata.contact) missing.push('Contact');
    if (!metadata.doi) missing.push('DOI');

    console.error(`Missing mandatory fields: ${missing.join(', ')}`);
    await postIssueComment(
      issue.number,
      `⚠️ **Contribution Incomplete**\n\nThe automated contribution processor could not find the following mandatory fields: **${missing.join(', ')}**.\n\nPlease edit your issue to include all mandatory fields so it can be committed to the literature review.`
    );
    return;
  }

  // Build target folder
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const safeAuthor = metadata.authors.trim().slice(0, 25).replace(/[^a-zA-Z0-9]/g, '_');
  const safeTitle = (metadata.title || 'Paper').trim().slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
  const folderName = `${timestamp}_${safeAuthor}_${safeTitle}`;
  const targetDir = path.join(process.cwd(), 'Contributions', folderName);

  fs.mkdirSync(targetDir, { recursive: true });

  // Handle manuscript file saving
  let savedFileName = metadata.fileName || 'manuscript.pdf';
  savedFileName = path.basename(savedFileName).replace(/[^a-zA-Z0-9._-]/g, '_');
  const targetFilePath = path.join(targetDir, savedFileName);
  let fileSaved = false;

  if (metadata.fileBase64) {
    try {
      const buffer = Buffer.from(metadata.fileBase64, 'base64');
      fs.writeFileSync(targetFilePath, buffer);
      fileSaved = true;
      console.log(`Saved manuscript from base64 payload (${buffer.length} bytes) to ${targetFilePath}`);
    } catch (e) {
      console.error('Failed to decode base64 file:', e);
    }
  } else if (metadata.fileUrl) {
    try {
      console.log(`Downloading manuscript file from ${metadata.fileUrl}...`);
      const token = process.env.GITHUB_TOKEN;
      const headers = { 'User-Agent': 'GitHub-Actions-Paper-Processor' };
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }
      const response = await fetch(metadata.fileUrl, { headers });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(targetFilePath, buffer);
        fileSaved = true;
        console.log(`Successfully downloaded file (${buffer.length} bytes) to ${targetFilePath}`);
      } else {
        console.warn(`File download failed with status ${response.status}. Will record file link in metadata.`);
      }
    } catch (e) {
      console.warn(`Error downloading file from URL: ${e.message}`);
    }
  }

  // If no file binary was retrievable, write a note file
  if (!fileSaved) {
    fs.writeFileSync(
      path.join(targetDir, 'FILE_ATTACHMENT_NOTICE.txt'),
      `The contributor submitted manuscript reference: ${savedFileName}\nFile URL / Attachment: ${metadata.fileUrl || 'Attached directly to GitHub Issue #' + issue.number}\nSubmitted by: ${issue.user ? issue.user.login : 'Contributor'}\nIssue URL: ${issue.html_url}\n`
    );
  }

  // Save metadata.json
  const finalMetadata = {
    title: metadata.title || savedFileName,
    authors: metadata.authors,
    contact: metadata.contact,
    doi: metadata.doi,
    notes: metadata.notes || '',
    submittedAt: now.toISOString(),
    githubIssueNumber: issue.number,
    githubIssueUrl: issue.html_url,
    contributorUsername: issue.user ? issue.user.login : '',
    fileName: savedFileName,
    fileSaved,
    folderName
  };
  fs.writeFileSync(path.join(targetDir, 'metadata.json'), JSON.stringify(finalMetadata, null, 2), 'utf8');

  // Save README.md in the folder
  const readmeContent = `# Literature Review Contribution: ${finalMetadata.title}

- **Author(s)**: ${finalMetadata.authors}
- **Contact**: ${finalMetadata.contact}
- **DOI**: [${finalMetadata.doi}](https://doi.org/${encodeURIComponent(finalMetadata.doi)})
- **Submitted Via**: GitHub Issue [#${issue.number}](${issue.html_url}) by @${finalMetadata.contributorUsername || 'contributor'}
- **Date**: ${finalMetadata.submittedAt}
- **Manuscript**: ${fileSaved ? `[${savedFileName}](./${encodeURIComponent(savedFileName)})` : `(Refer to GitHub Issue #${issue.number})`}

## Summary / Notes
${finalMetadata.notes || '*No additional notes provided.*'}

---
*Archived automatically via GitHub Actions Zero-Server Ingest Workflow.*
`;
  fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent, 'utf8');

  // Git commit and push directly to repository
  try {
    execSync('git config user.name "github-actions[bot]"', { stdio: 'inherit' });
    execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { stdio: 'inherit' });
    execSync(`git add "Contributions/${folderName}"`, { stdio: 'inherit' });
    execSync(`git commit -m "feat(contributions): archive submission from #${issue.number} - ${safeTitle} [skip ci]"`, { stdio: 'inherit' });
    execSync('git push origin HEAD', { stdio: 'inherit' });
    console.log(`Successfully committed and pushed Contributions/${folderName}`);
  } catch (err) {
    console.error('Git commit/push error:', err.message);
    throw err;
  }

  // Comment on issue and mark as processed
  const successComment = `### 🎉 Paper Contribution Accepted & Archived!

Thank you @${finalMetadata.contributorUsername || 'contributor'}! Your manuscript submission has been processed by our **Zero-Server GitHub Actions Workflow** and permanently archived into the systematic literature review repository:

📁 **Archived Folder**: [\`Contributions/${folderName}\`](./Contributions/${folderName})
📄 **Manuscript**: ${fileSaved ? `\`${savedFileName}\`` : 'Archived via Issue attachment'}
🏷️ **DOI**: [${finalMetadata.doi}](https://doi.org/${encodeURIComponent(finalMetadata.doi)})

This entry is now queued for inclusion in the Space Architecture systematic review dashboard.`;

  await postIssueComment(issue.number, successComment);
  await addIssueLabels(issue.number, ['processed', 'contribution']);
  await closeIssue(issue.number);

  console.log(`Completed processing issue #${issue.number}.`);
}

async function postIssueComment(issueNumber, commentBody) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) {
    console.log('Skipping API comment: GITHUB_TOKEN or GITHUB_REPOSITORY not set');
    return;
  }

  const url = `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Actions-Paper-Processor',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body: commentBody })
    });
  } catch (e) {
    console.warn(`Failed to post issue comment: ${e.message}`);
  }
}

async function addIssueLabels(issueNumber, labels) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) return;

  const url = `https://api.github.com/repos/${repo}/issues/${issueNumber}/labels`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Actions-Paper-Processor',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ labels })
    });
  } catch (e) {
    console.warn(`Failed to add labels: ${e.message}`);
  }
}

async function closeIssue(issueNumber) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) return;

  const url = `https://api.github.com/repos/${repo}/issues/${issueNumber}`;
  try {
    await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Actions-Paper-Processor',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ state: 'closed', state_reason: 'completed' })
    });
  } catch (e) {
    console.warn(`Failed to close issue: ${e.message}`);
  }
}

main().catch(err => {
  console.error('Fatal error in process-contribution:', err);
  process.exit(1);
});
