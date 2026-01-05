const fs = require('fs');
const content = fs.readFileSync('w:/wg/ny/PrajolsWeb/website_for_electrical_engineering_blog/post.html', 'utf8');
const match = content.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!match) {
    console.error('No script tag found');
    process.exit(1);
}
const js = match[1];
try {
    new Function(js);
    console.log('Syntax OK');
} catch (e) {
    console.error('Syntax Error:', e.message);
    // Find the approximate line number
    const lines = js.split('\n');
    console.log('Script length:', lines.length, 'lines');
}
