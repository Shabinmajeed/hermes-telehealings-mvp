const { Client } = require('pg');

// Try connecting with individual params to avoid URL parsing issues
async function test() {
  const passwords = [
    'telehealings@2026!',
    'telehealings',
    'password',
    'postgres',
  ];

  for (const pwd of passwords) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'telehealings',
      password: pwd,
      database: 'telehealings',
    });
    try {
      await client.connect();
      const res = await client.query('SELECT count(*) FROM users');
      console.log('PASSWORD FOUND:', pwd);
      console.log('User count:', res.rows[0].count);
      await client.end();
      return;
    } catch(e) {
      console.log(`Password "${pwd}": ${e.message.split('\n')[0]}`);
      try { await client.end(); } catch(e2) {}
    }
  }
  console.log('No password worked');
}

test().catch(e => console.error('Fatal:', e.message));
