const path = require('path');
const fs = require('fs');

// Check critical packages
const critical = [
  '@nestjs/common', '@nestjs/core', '@nestjs/config', '@nestjs/jwt',
  '@nestjs/passport', '@nestjs/platform-express', '@prisma/client',
  'bcryptjs', 'class-validator', 'class-transformer', 'jsonwebtoken',
  'passport', 'passport-jwt', 'rxjs', 'reflect-metadata',
  'nodemailer', 'handlebars', 'bullmq', 'ioredis',
  'multer', 'stripe'
];

const base = '/home/azureuser/Telehealings Project/packages/backend/node_modules';
for (const pkg of critical) {
  try {
    require.resolve(pkg, { paths: [base] });
    console.log(pkg + ': OK');
  } catch (e) {
    console.log(pkg + ': MISSING');
  }
}
