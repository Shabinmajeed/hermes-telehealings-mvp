const Handlebars = require('/home/azureuser/Telehealings Project/packages/backend/node_modules/handlebars');
const fs = require('fs');
const path = require('path');

const templatesDir = '/home/azureuser/Telehealings Project/packages/backend/src/modules/mail/templates';

const templates = [
  { name: 'welcome.hbs', context: { name: 'John', loginUrl: 'https://telehealings.com/login' } },
  { name: 'booking-confirmation.hbs', context: { name: 'John', therapistName: 'Dr. Smith', sessionDate: 'June 15, 2026', sessionTime: '10:00 AM', sessionType: 'Video Call' } },
  { name: 'session-reminder.hbs', context: { name: 'John', therapistName: 'Dr. Smith', sessionDate: 'June 15, 2026', sessionTime: '10:00 AM', sessionType: 'Video Call' } },
  { name: 'password-reset.hbs', context: { name: 'John', resetUrl: 'https://telehealings.com/reset?token=abc123' } },
];

let allOk = true;
for (const t of templates) {
  try {
    const source = fs.readFileSync(path.join(templatesDir, t.name), 'utf8');
    const template = Handlebars.compile(source);
    const html = template(t.context);
    if (html.length > 100) {
      console.log('OK: ' + t.name + ' (' + html.length + ' chars)');
    } else {
      console.log('SUSPICIOUS: ' + t.name + ' (' + html.length + ' chars)');
      allOk = false;
    }
  } catch (e) {
    console.log('ERROR: ' + t.name + ': ' + e.message);
    allOk = false;
  }
}

if (allOk) {
  console.log('\nAll templates render successfully!');
}
