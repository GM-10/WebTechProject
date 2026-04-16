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

  // Regex to find CSS rule blocks
  content = content.replace(/([^{]+)\{([^}]+)\}/g, (match, selector, rules) => {
    // If the selector contains btn, badge, pill, notification-dot, etc., keep white text.
    if (/(btn|badge|pill-active|status|avatar|circle|toast)/i.test(selector)) {
      return match; 
    }
    
    // Otherwise, replace white with var(--text-main)
    const newRules = rules.replace(/color:\s*(?:white|#fff|#ffffff)\s*(?:!important)?;/gi, 'color: var(--text-main);')
                          .replace(/fill:\s*(?:white|#fff|#ffffff)\s*(?:!important)?;/gi, 'fill: var(--text-main);');
    return selector + '{' + newRules + '}';
  });

  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated Text in ' + path.basename(file));
  }
});
