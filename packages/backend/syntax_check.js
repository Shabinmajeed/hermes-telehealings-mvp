// Use typescript from hermes agent
const ts = require('/home/azureuser/.hermes/hermes-agent/node_modules/typescript');
const fs = require('fs');

const files = [
  '/home/azureuser/Telehealings Project/packages/backend/src/modules/mail/mail.module.ts',
  '/home/azureuser/Telehealings Project/packages/backend/src/modules/mail/mail.service.ts',
  '/home/azureuser/Telehealings Project/packages/backend/src/modules/mail/mail.controller.ts',
];

let hasErrors = false;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  // Check for obvious syntax issues by looking at the AST
  if (result.parseDiagnostics && result.parseDiagnostics.length > 0) {
    for (const d of result.parseDiagnostics) {
      console.log('SYNTAX ERROR: ' + file + ': ' + ts.flattenDiagnosticMessageText(d.messageText, '\n'));
      hasErrors = true;
    }
  } else {
    console.log('OK: ' + file);
  }
}

if (!hasErrors) {
  console.log('\nAll mail module files have valid TypeScript syntax!');
}
