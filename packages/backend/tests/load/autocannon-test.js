// tests/load/autocannon-test.js
// Run with: node tests/load/autocannon-test.js
// Or: npx autocannon -c 50 -d 30 http://localhost:5172/api/sessions

const autocannon = require('autocannon');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5172/api';

async function runLoadTest() {
  console.log(`\n=== TeleHealings Load Test ===`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  const tests = [
    { name: 'Health Check', path: '/health' },
    { name: 'List Sessions', path: '/sessions?limit=20' },
    { name: 'List Therapists', path: '/therapists?limit=20' },
    { name: 'List Bookings', path: '/bookings?limit=20' },
  ];

  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    try {
      const result = await autocannon({
        url: `${BASE_URL}${test.path}`,
        connections: 50,
        duration: 15,
        pipelining: 1,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`  Requests/sec: ${result.requests.average}`);
      console.log(`  Latency avg:  ${result.latency.average}ms`);
      console.log(`  Latency p95:  ${result.latency.p95}ms`);
      console.log(`  Latency p99:  ${result.latency.p99}ms`);
      console.log(`  Throughput:   ${(result.throughput.average / 1024).toFixed(1)} KB/s`);
      console.log(`  Errors:       ${result.errors}`);
      console.log(`  Timeouts:     ${result.timeouts}`);
      console.log(`  Total:        ${result.requests.total} requests`);

      if (result.latency.p95 < 200) {
        console.log(`  Status: PASS (p95 < 200ms)`);
      } else {
        console.log(`  Status: FAIL (p95 >= 200ms)`);
      }
    } catch (err) {
      console.log(`  Error: ${err.message}`);
    }
  }
}

runLoadTest().catch(console.error);
