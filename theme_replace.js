const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client', 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const replacements = [
    { regex: /indigo-/g, replace: 'primary-' },
    { regex: /violet-/g, replace: 'secondary-' },
    { regex: /emerald-/g, replace: 'primary-' }, // Make green online dots neon cyan
    { regex: /teal-/g, replace: 'secondary-' }, // Convert teal to pink
    { regex: /rose-/g, replace: 'secondary-' },
    { regex: /amber-/g, replace: 'accent-' }, // Convert amber to purple
    { regex: /document\.body\.classList\.add\("light-theme"\);/g, replace: '' },
    { regex: /document\.body\.classList\.remove\("light-theme"\);/g, replace: '' },
];

walkDir(srcDir, function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        replacements.forEach(r => {
            content = content.replace(r.regex, r.replace);
        });
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});

console.log("Done updating theme classes.");
