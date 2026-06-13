const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const configPath = '/home/azureuser/Telehealings Project/packages/backend/tsconfig.json';
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));

const mailFiles = [
  'src/modules/mail/mail.module.ts',
  'src/modules/mail/mail.service.ts',
  'src/modules/mail/mail.controller.ts',
];

const program = ts.createProgram(
  mailFiles.map(f => path.join('/home/azureuser/Telehealings Project/packages/backend', f)),
  {
    ...parsed.options,
    noEmit: true,
    skipLibCheck: true,
  }
);

const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length === 0) {
  console.log('No TypeScript errors in mail module!');
} else {
  for (const d of diagnostics) {
    const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    const file = d.file ? d.file.fileName : 'unknown';
    console.log(`ERROR: ${file}: ${msg}`);
  }
}
