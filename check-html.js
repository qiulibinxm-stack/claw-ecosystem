const fs = require('fs');
const html = fs.readFileSync('projects/backup-dashboard/index.html', 'utf8');
console.log('File size:', html.length);
console.log('Has DOCTYPE:', html.includes('<!DOCTYPE'));
console.log('Has html tag:', html.includes('<html'));
console.log('Has body tag:', html.includes('<body'));
console.log('Has script tag:', html.includes('<script'));
console.log('Last 100 chars:', html.slice(-100));
