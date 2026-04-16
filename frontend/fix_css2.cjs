const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findCssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      findCssFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.css')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const cssFiles = findCssFiles(srcDir);

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalLength = content.length;

  content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.0[23]\s*\)/g, 'var(--overlay-light)');
  content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.0[45]\s*\)/g, 'var(--overlay-medium)');
  content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.[01][6890]\s*\)/g, 'var(--overlay-heavy)');
  content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.[12][0-9]*\s*\)/g, 'var(--overlay-border)');

  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated Overlays in ' + path.basename(file));
  }
});
