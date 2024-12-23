const fs = require('fs');
const { DataflashParser } = require('./parser.js');

// Read the binary file
const data = fs.readFileSync('./rover.BIN');
const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

// Create parser instance and process data
const parser = new DataflashParser();
const result = parser.processData(buffer);

// Check total number of messages
const totalMessages = result.messages.length;
console.log(`Total messages parsed: ${totalMessages}`);

const MINIMUM_MESSAGES = 5511;
if (totalMessages < MINIMUM_MESSAGES) {
    console.error(`Test failed: Expected at least ${MINIMUM_MESSAGES} messages, but got ${totalMessages}`);
    console.error('This indicates a regression in the parser\'s ability to extract messages');
    process.exit(1);
} else {
    console.log(`Test passed: Successfully parsed ${totalMessages} messages (minimum: ${MINIMUM_MESSAGES})`);
}

// Print message types found
console.log('\nMessage types found:');
console.log(result.messageTypes); 