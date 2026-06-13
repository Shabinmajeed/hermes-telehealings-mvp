// tests/load/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '1m', target: 100 },   // Stay at 100 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],   // p95 < 200ms
    http_req_duration: ['p(99)<500'],   // p99 < 500ms
    errors: ['rate<0.01'],              // Error rate < 1%
    http_req_failed: ['rate<0.01'],     // Failed requests < 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5172/api';

// First, login to get a token
function login() {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'client@test.com',
    password: 'TestPass123!',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginRes.status === 200) {
    return loginRes.json('accessToken');
  }
  return null;
}

export function setup() {
  const token = login();
  return { token };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (data.token) {
    headers['Authorization'] = `Bearer ${data.token}`;
  }

  // Test 1: List sessions (most common endpoint)
  const sessionsRes = http.get(`${BASE_URL}/sessions?limit=20`, { headers });
  check(sessionsRes, {
    'sessions status is 200': (r) => r.status === 200,
    'sessions response time < 200ms': (r) => r.timings.duration < 200,
  });
  errorRate.add(sessionsRes.status !== 200);
  responseTime.add(sessionsRes.timings.duration);

  sleep(0.5);

  // Test 2: List therapists
  const therapistsRes = http.get(`${BASE_URL}/therapists?limit=20`, { headers });
  check(therapistsRes, {
    'therapists status is 200': (r) => r.status === 200,
    'therapists response time < 200ms': (r) => r.timings.duration < 200,
  });
  errorRate.add(therapistsRes.status !== 200);
  responseTime.add(therapistsRes.timings.duration);

  sleep(0.5);

  // Test 3: Get user profile
  if (data.token) {
    const meRes = http.get(`${BASE_URL}/auth/me`, { headers });
    check(meRes, {
      'me status is 200': (r) => r.status === 200,
      'me response time < 200ms': (r) => r.timings.duration < 200,
    });
    errorRate.add(meRes.status !== 200);
    responseTime.add(meRes.timings.duration);
  }

  sleep(1);
}
