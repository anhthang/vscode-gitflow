console.log('Testing extension loading...');
const extension = require('./out/extension.js');
console.log('Extension exports:', Object.keys(extension));
console.log('Activate function:', typeof extension.activate);
console.log('Deactivate function:', typeof extension.deactivate);
