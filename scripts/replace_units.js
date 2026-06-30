const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      content = content.replace(/ITAJUBA/g, '1ª CIA OP');
      content = content.replace(/POUSO ALEGRE/g, '6COB');
      
      content = content.split('\n').filter(line => 
        !line.includes('value="EXTREMA"') && 
        !line.includes('value="PARAISOPOLIS"') &&
        !line.includes("case 'EXTREMA':") &&
        !line.includes("case 'PARAISOPOLIS':")
      ).join('\n');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Modified:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, '..', 'src'));
console.log('Done!');
