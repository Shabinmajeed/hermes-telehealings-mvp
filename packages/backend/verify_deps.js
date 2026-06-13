const deps = ['nodemailer', 'handlebars', 'bullmq', 'ioredis'];
for (const dep of deps) {
  try {
    // Use require.resolve to avoid actually loading the module (which may try to connect to Redis)
    require.resolve(dep);
    console.log(dep + ': OK');
  } catch (e) {
    console.log(dep + ': MISSING - ' + e.message.split('\n')[0]);
  }
}
