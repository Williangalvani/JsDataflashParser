const fs = require('fs');

// Read the parser code
const parserCode = fs.readFileSync('./parser.js', 'utf8');

// Create browser-compatible wrapper
const browserCode = `
// Browser-compatible version of DataflashParser
(function(global) {
    ${parserCode}
    
    // Export to browser global scope
    global.DataflashParser = DataflashParser;
    
})(typeof window !== 'undefined' ? window : this);
`;

// Write to dist directory
if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}
fs.writeFileSync('./dist/dataflash-parser.js', browserCode);
fs.writeFileSync('./dist/dataflash-parser.min.js', browserCode); // TODO: Add minification

console.log('Browser bundle created in dist/'); 