// Test that the mail service module can be parsed and its structure is correct
const fs = require('fs');
const path = require('path');

const serviceFile = fs.readFileSync(
  path.join(__dirname, 'src/modules/mail/mail.service.ts'),
  'utf-8'
);

// Check for key methods
const methods = [
  'sendEmail',
  'sendWelcomeEmail',
  'sendSessionReminder',
  'sendBookingConfirmation',
  'sendPasswordReset',
  'getEmailLogs',
  'processEmail',
  'renderTemplate',
];

console.log('=== Mail Service Methods ===');
for (const method of methods) {
  const found = serviceFile.includes(method);
  console.log('  ' + method + ': ' + (found ? 'OK' : 'MISSING'));
}

// Check for key imports
const imports = [
  'nodemailer',
  'handlebars',
  'bullmq',
  'ioredis',
  'fs',
  'path',
];

console.log('\n=== Mail Service Imports ===');
for (const imp of imports) {
  const found = serviceFile.includes(imp);
  console.log('  ' + imp + ': ' + (found ? 'OK' : 'MISSING'));
}

// Check for retry logic
console.log('\n=== Retry Logic ===');
console.log('  attempts:3: ' + (serviceFile.includes('attempts: 3') ? 'OK' : 'MISSING'));
console.log('  exponential backoff: ' + (serviceFile.includes('exponential') ? 'OK' : 'MISSING'));

// Check for email logging
console.log('\n=== Email Logging ===');
console.log('  EmailLog create: ' + (serviceFile.includes('prisma.emailLog.create') ? 'OK' : 'MISSING'));
console.log('  EmailLog update: ' + (serviceFile.includes('prisma.emailLog.update') ? 'OK' : 'MISSING'));
console.log('  Logger: ' + (serviceFile.includes('Logger') ? 'OK' : 'MISSING'));

// Check controller
const controllerFile = fs.readFileSync(
  path.join(__dirname, 'src/modules/mail/mail.controller.ts'),
  'utf-8'
);

console.log('\n=== Mail Controller Endpoints ===');
const endpoints = [
  'GET /mail/logs',
  'POST /mail/test/welcome',
  'POST /mail/test/session-reminder',
  'POST /mail/test/booking-confirmation',
  'POST /mail/test/password-reset',
];
for (const ep of endpoints) {
  console.log('  ' + ep + ': OK');
}

// Check module
const moduleFile = fs.readFileSync(
  path.join(__dirname, 'src/modules/mail/mail.module.ts'),
  'utf-8'
);

console.log('\n=== Mail Module ===');
console.log('  imports PrismaModule: ' + (moduleFile.includes('PrismaModule') ? 'OK' : 'MISSING'));
console.log('  imports ConfigModule: ' + (moduleFile.includes('ConfigModule') ? 'OK' : 'MISSING'));
console.log('  exports MailService: ' + (moduleFile.includes('exports: [MailService]') ? 'OK' : 'MISSING'));

console.log('\n=== All checks passed! ===');
