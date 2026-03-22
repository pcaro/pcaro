const fs = require('fs');
const { generateStats, generateLanguagesStats } = require('github-readme-stats');

async function updateStats() {
  const stats = await generateStats({
    username: 'pcaro',
    show: true,
    hide_rank: true,
    count_private: true,
    all: true,
  });

  const languages = await generateLanguagesStats({
    username: 'pcaro',
    layout: 'compact',
    limit: 6,
    hide: [],
  });

  // Read current README
  let readme = fs.readFileSync('README.md', 'utf8');

  // Replace stats section
  const statsStart = '<!-- STATS:START -->';
  const statsEnd = '<!-- STATS:END -->';
  const statsSection = `${statsStart}\n<p align="left">\n  <img height="180em" src="${stats}" />\n  <img height="180em" src="${languages}" />\n</p>\n${statsEnd}`;

  if (readme.includes(statsStart)) {
    readme = readme.replace(new RegExp(`${statsStart}[\\s\\S]*?${statsEnd}`), statsSection);
  } else {
    // Insert after the header section
    const headerEnd = readme.indexOf('\n---\n\n## 📝 Latest from my blog');
    if (headerEnd !== -1) {
      readme = readme.slice(0, headerEnd) + '\n' + statsSection + readme.slice(headerEnd);
    }
  }

  fs.writeFileSync('README.md', readme);
  console.log('Stats updated!');
}

updateStats().catch(console.error);
