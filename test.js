// test.js
const AuthWorkflow = require('./src/workflows/AuthWorkflow');
const assert = require('assert');

async function testAuthWorkflow() {
  const workflow = new AuthWorkflow();
  
  const states = [];
  workflow.on('stateChange', (state) => {
    console.log(`Workflow State: ${state}`);
    states.push(state);
  });

  const testUser = {
    user_id: "user123454444",
    password: "password123",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    role_id: 2
  };

  try {
    console.log('\n=== Testing Registration Flow ===');
    console.log('Starting test with user:', testUser);
    
    const result = await workflow.executeRegistrationFlow(testUser);
    console.log('Workflow result:', result);

    // Updated assertions to match actual response structure
    assert(result.token, 'Should have token');
    assert(result.dashboard, 'Should have dashboard');
    assert(result.dashboard.studentDashboard, 'Should have student dashboard content');
    
    // Verify state transitions
    assert(states.includes('REGISTERING'), 'Should enter REGISTERING state');
    assert(states.includes('AUTHENTICATING'), 'Should enter AUTHENTICATING state');
    assert(states.includes('ACCESSING_DASHBOARD'), 'Should enter ACCESSING_DASHBOARD state');
    assert(states.includes('COMPLETED'), 'Should reach COMPLETED state');

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

console.log('Starting AuthWorkflow tests...');
testAuthWorkflow().catch(console.error);