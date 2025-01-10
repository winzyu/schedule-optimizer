// scripts/analyze-build.js
const path = require('path');
const fs = require('fs');

async function analyzeModules() {
  console.log('Analyzing build modules...');
  
  // Read the webpack build stats
  const statsFile = path.join(process.cwd(), '.next', 'server', 'pages-manifest.json');
  if (!fs.existsSync(statsFile)) {
    console.log('No build stats found. Please run a build first.');
    return;
  }

  const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  
  // Analyze the stats
  console.log('\nPages and their chunks:');
  Object.entries(stats).forEach(([page, chunk]) => {
    console.log(`\nPage: ${page}`);
    console.log(`Chunk: ${chunk}`);
  });
}

analyzeModules().catch(console.error);
