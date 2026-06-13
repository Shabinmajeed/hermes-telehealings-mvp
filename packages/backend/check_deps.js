const deps = ['nodemailer', 'handlebars', 'bullmq', 'ioredis'];
for (const dep of deps) {
  try {
    require.resolve(dep);
    console.log(dep + ': OK');
  } catch (e) {
    console.log(dep + ': MISSING');
  }
}
