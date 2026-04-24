const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/\bbg-slate-950\b/g, 'bg-background');
  content = content.replace(/\btext-white\b/g, 'text-foreground');
  content = content.replace(/\bbg-slate-900\b/g, 'bg-card');
  content = content.replace(/\btext-slate-400\b/g, 'text-muted-foreground');
  content = content.replace(/\bbg-white\/5\b/g, 'bg-black/5 dark:bg-white/5');
  content = content.replace(/\bborder-white\/10\b/g, 'border-black/10 dark:border-white/10');
  content = content.replace(/\bborder-white\/5\b/g, 'border-black/5 dark:border-white/5');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
