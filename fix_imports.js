const fs = require('fs');
const path = require('path');

function fixImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      fixImports(fullPath);
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;

      // Remove .ts and .tsx extensions from import statements
      content = content.replace(/\.ts(?=['"])/g, '');
      content = content.replace(/\.tsx(?=['"])/g, '');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

fixImports('src');