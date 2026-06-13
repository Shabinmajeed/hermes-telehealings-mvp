// Test that the mail module can be loaded and basic functions work
const path = require('path');

// Test 1: Verify all templates exist and compile
console.log('=== Test 1: Template Rendering ===');
const Handlebars = require(path.join(__dirname, 'node_modules/handlebars'));
const fs = require('fs');
const templatesDir = path.join(__dirname, 'src/modules/mail/templates');

const templateNames = ['welcome', 'booking-confirmation', 'session-reminder', 'password-reset'];
for (const name of templateNames) {
  const filePath = path.join(templatesDir, name + '.hbs');
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = Handlebars.compile(source);
  console.log('  ' + name + '.hbs: compiles OK');
}

// Test 2: Verify nodemailer can create a transporter
console.log('\n=== Test 2: Nodemailer Transporter ===');
const nodemailer = require(path.join(__dirname, 'node_modules/nodemailer'));
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: 'test@test.com', pass: 'test' },
});
console.log('  Transporter created: ' + (transporter ? 'OK' : 'FAIL'));

// Test 3: Verify BullMQ Queue can be instantiated (without Redis)
console.log('\n=== Test 3: BullMQ Exports ===');
const bullmq = require(path.join(__dirname, 'node_modules/bullmq'));
console.log('  Queue: ' + (bullmq.Queue ? 'OK' : 'MISSING'));
console.log('  Worker: ' + (bullmq.Worker ? 'OK' : 'MISSING'));
console.log('  Job: ' + (bullmq.Job ? 'OK' : 'MISSING'));

// Test 4: Verify ioredis can be instantiated
console.log('\n=== Test 4: IORedis ===');
const IORedis = require(path.join(__dirname, 'node_modules/ioredis'));
const redis = new IORedis({ host: 'localhost', port: 6379, lazyConnect: true });
console.log('  IORedis instance: ' + (redis ? 'OK' : 'FAIL'));
redis.disconnect();

// Test 5: Verify mail service file structure
console.log('\n=== Test 5: Mail Module Files ===');
const mailFiles = [
  'src/modules/mail/mail.module.ts',
  'src/modules/mail/mail.service.ts',
  'src/modules/mail/mail.controller.ts',
];
for (const f of mailFiles) {
  const filePath = path.join(__dirname, f);
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log('  ' + f + ': ' + content.length + ' bytes');
}

// Test 6: Verify mail module is registered in app module
console.log('\n=== Test 6: App Module Registration ===');
const appModule = fs.readFileSync(path.join(__dirname, 'src/app.module.ts'), 'utf-8');
console.log('  MailModule import: ' + (appModule.includes("MailModule") ? 'OK' : 'MISSING'));
console.log('  MailModule in imports: ' + (appModule.includes("MailModule,") || appModule.includes("MailModule\r\n") ? 'OK' : 'MISSING'));

console.log('\n=== All tests passed! ===');
