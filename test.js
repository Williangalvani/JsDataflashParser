const fs = require('fs');
const assert = require('assert');
const { DataflashParser } = require('./parser.js');

// Test suite
function runTests() {
    console.log('Running DataflashParser tests...\n');
    let totalTests = 0;
    let passedTests = 0;

    function test(name, fn) {
        totalTests++;
        try {
            fn();
            console.log(`✓ ${name}`);
            passedTests++;
        } catch (err) {
            console.error(`✗ ${name}`);
            console.error('  ', err.message);
        }
    }

    // Read test data
    const data = fs.readFileSync('./rover.BIN');
    const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

    // Create parser instance
    const parser = new DataflashParser();
    const result = parser.processData(buffer);

    // Test 1: Basic message count
    test('Should parse minimum number of messages', () => {
        const MINIMUM_MESSAGES = 5511;
        assert.ok(
            result.messages.length >= MINIMUM_MESSAGES,
            `Expected at least ${MINIMUM_MESSAGES} messages, but got ${result.messages.length}`
        );
    });

    // Test 2: Verify essential message types exist
    test('Should contain essential message types', () => {
        const requiredTypes = ['MSG', 'MODE', 'GPS', 'ATT', 'PARM'];
        const missingTypes = requiredTypes.filter(type => !result.messageTypes.includes(type));
        assert.strictEqual(
            missingTypes.length,
            0,
            `Missing required message types: ${missingTypes.join(', ')}`
        );
    });

    // Test 3: Check MSG messages format
    test('Should have properly formatted MSG messages', () => {
        const msgMessages = result.messages.filter(msg => msg.name === 'MSG');
        assert.ok(msgMessages.length > 0, 'No MSG messages found');

        // Check first MSG message structure
        const firstMsg = msgMessages[0];
        assert.ok(firstMsg.Message, 'MSG message missing Message field');
        assert.ok(firstMsg.time_boot_ms !== undefined, 'MSG message missing time_boot_ms');
    });

    // Test 4: Verify GPS messages contain required fields
    test('Should have valid GPS messages', () => {
        const gpsMessages = result.messages.filter(msg => msg.name === 'GPS');
        assert.ok(gpsMessages.length > 0, 'No GPS messages found');

        // Check first GPS message structure
        const firstGps = gpsMessages[0];
        const requiredFields = ['Lat', 'Lng', 'Alt'];
        requiredFields.forEach(field => {
            assert.ok(
                firstGps.hasOwnProperty(field),
                `GPS message missing required field: ${field}`
            );
        });
    });

    // Test 5: Check MODE messages for valid values
    test('Should have valid MODE messages', () => {
        const modeMessages = result.messages.filter(msg => msg.name === 'MODE');
        assert.ok(modeMessages.length > 0, 'No MODE messages found');

        // Verify mode values
        modeMessages.forEach(msg => {
            assert.ok(
                msg.hasOwnProperty('Mode') && typeof msg.Mode === 'number',
                'MODE message has invalid Mode value'
            );
            assert.ok(
                msg.hasOwnProperty('asText') && typeof msg.asText === 'string',
                'MODE message missing asText translation'
            );
        });
    });

    // Test 6: Verify message timestamps are sequential
    test('Should have sequential timestamps', () => {
        const messages = result.messages.filter(msg => msg.time_boot_ms !== undefined);
        let lastTime = 0;

        for (let i = 0; i < messages.length; i++) {
            const currentTime = messages[i].time_boot_ms;
            assert.ok(
                currentTime >= lastTime,
                `Message timestamps not sequential at index ${i}`
            );
            lastTime = currentTime;
        }
    });

    // Test 7: Check PARM messages format
    test('Should have valid PARM messages', () => {
        const parmMessages = result.messages.filter(msg => msg.name === 'PARM');
        assert.ok(parmMessages.length > 0, 'No PARM messages found');

        // Check PARM message structure
        const firstParm = parmMessages[0];
        assert.ok(firstParm.Name, 'PARM message missing Name field');
        assert.ok(firstParm.Value !== undefined, 'PARM message missing Value field');
    });

    // Print test summary
    console.log(`\nTest Summary: ${passedTests}/${totalTests} tests passed`);

    // Exit with appropriate code
    process.exit(passedTests === totalTests ? 0 : 1);
}

// Run the tests
runTests();