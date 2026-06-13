// src/modules/mail/mail.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as Handlebars from 'handlebars';

describe('Mail Templates', () => {
  const templatesDir = join(__dirname, 'templates');

  it('should render welcome template with name and loginUrl', () => {
    const source = readFileSync(join(templatesDir, 'welcome.hbs'), 'utf-8');
    const template = Handlebars.compile(source);
    const html = template({ name: 'John', loginUrl: 'http://localhost:3001/login' });

    expect(html).toContain('John');
    expect(html).toContain('http://localhost:3001/login');
    expect(html).toContain('Welcome to TeleHealings');
  });

  it('should render booking-confirmation template with all context vars', () => {
    const source = readFileSync(join(templatesDir, 'booking-confirmation.hbs'), 'utf-8');
    const template = Handlebars.compile(source);
    const html = template({
      name: 'Jane',
      therapistName: 'Dr. Smith',
      sessionDate: 'June 15, 2026',
      sessionTime: '2:00 PM',
      sessionType: 'Video',
    });

    expect(html).toContain('Jane');
    expect(html).toContain('Dr. Smith');
    expect(html).toContain('June 15, 2026');
    expect(html).toContain('Video');
    expect(html).toContain('Booking Confirmed');
  });

  it('should render session-reminder template with all context vars', () => {
    const source = readFileSync(join(templatesDir, 'session-reminder.hbs'), 'utf-8');
    const template = Handlebars.compile(source);
    const html = template({
      name: 'Alex',
      therapistName: 'Dr. Brown',
      sessionDate: 'June 12, 2026',
      sessionTime: '10:00 AM',
      sessionType: 'Audio',
    });

    expect(html).toContain('Alex');
    expect(html).toContain('Dr. Brown');
    expect(html).toContain('June 12, 2026');
    expect(html).toContain('Audio');
    expect(html).toContain('Session Reminder');
  });

  it('should render password-reset template with name and resetUrl', () => {
    const source = readFileSync(join(templatesDir, 'password-reset.hbs'), 'utf-8');
    const template = Handlebars.compile(source);
    const html = template({
      name: 'Sam',
      resetUrl: 'http://localhost:3001/reset-password?token=abc123',
    });

    expect(html).toContain('Sam');
    expect(html).toContain('http://localhost:3001/reset-password?token=abc123');
    expect(html).toContain('Password Reset');
  });

  it('should have valid HTML structure in all templates', () => {
    const templates = ['welcome', 'booking-confirmation', 'session-reminder', 'password-reset'];
    for (const name of templates) {
      const source = readFileSync(join(templatesDir, `${name}.hbs`), 'utf-8');
      expect(source).toContain('<!DOCTYPE html>');
      expect(source).toContain('<html');
      expect(source).toContain('</html>');
    }
  });
});
