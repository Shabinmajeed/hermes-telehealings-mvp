"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/prisma.service");
const nodemailer = __importStar(require("nodemailer"));
const Handlebars = __importStar(require("handlebars"));
const fs_1 = require("fs");
const path_1 = require("path");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
let MailService = MailService_1 = class MailService {
    configService;
    prisma;
    transporter;
    emailQueue;
    logger = new common_1.Logger(MailService_1.name);
    templatesDir = (0, path_1.join)(__dirname, 'templates');
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
            port: this.configService.get('SMTP_PORT', 587),
            secure: this.configService.get('SMTP_SECURE', false),
            auth: {
                user: this.configService.get('SMTP_USER', ''),
                pass: this.configService.get('SMTP_PASS', ''),
            },
        });
        const connection = new ioredis_1.default({
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get('REDIS_PORT', 6379),
            maxRetriesPerRequest: null,
        });
        this.emailQueue = new bullmq_1.Queue('email-queue', { connection });
        new bullmq_1.Worker('email-queue', async (job) => {
            await this.processEmail(job);
        }, { connection });
    }
    renderTemplate(templateName, context) {
        const templatePath = (0, path_1.join)(this.templatesDir, `${templateName}.hbs`);
        const templateSource = (0, fs_1.readFileSync)(templatePath, 'utf-8');
        const template = Handlebars.compile(templateSource);
        return template(context);
    }
    async processEmail(job) {
        const { to, subject, template, context, emailLogId } = job.data;
        try {
            const html = this.renderTemplate(template, context);
            await this.transporter.sendMail({
                from: this.configService.get('MAIL_FROM', '"TeleHealings" <noreply@telehealings.com>'),
                to,
                subject,
                html,
            });
            await this.prisma.emailLog.update({
                where: { id: emailLogId },
                data: { status: 'sent', sentAt: new Date(), attempts: job.attemptsMade + 1 },
            });
            this.logger.log(`Email sent successfully to ${to} (${template})`);
        }
        catch (error) {
            const attempts = job.attemptsMade + 1;
            await this.prisma.emailLog.update({
                where: { id: emailLogId },
                data: {
                    status: attempts >= 3 ? 'failed' : 'retrying',
                    attempts,
                    error: error.message,
                },
            });
            this.logger.error(`Failed to send email to ${to} (attempt ${attempts}/3): ${error.message}`);
            throw error;
        }
    }
    async sendEmail(to, subject, template, context) {
        const emailLog = await this.prisma.emailLog.create({
            data: {
                to,
                subject,
                template,
                status: 'pending',
                attempts: 0,
            },
        });
        await this.emailQueue.add('send-email', { to, subject, template, context, emailLogId: emailLog.id }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
        });
        this.logger.log(`Email queued: ${subject} to ${to} (log: ${emailLog.id})`);
        return emailLog.id;
    }
    async sendWelcomeEmail(to, name) {
        return this.sendEmail(to, 'Welcome to TeleHealings!', 'welcome', {
            name,
            loginUrl: this.configService.get('APP_URL', 'https://telehealings.com'),
        });
    }
    async sendSessionReminder(to, name, therapistName, sessionDate, sessionTime, sessionType) {
        return this.sendEmail(to, 'Session Reminder - TeleHealings', 'session-reminder', {
            name,
            therapistName,
            sessionDate,
            sessionTime,
            sessionType,
        });
    }
    async sendBookingConfirmation(to, name, therapistName, sessionDate, sessionTime, sessionType) {
        return this.sendEmail(to, 'Booking Confirmed - TeleHealings', 'booking-confirmation', {
            name,
            therapistName,
            sessionDate,
            sessionTime,
            sessionType,
        });
    }
    async sendPasswordReset(to, name, resetToken) {
        const resetUrl = `${this.configService.get('APP_URL', 'https://telehealings.com')}/reset-password?token=${resetToken}`;
        return this.sendEmail(to, 'Password Reset - TeleHealings', 'password-reset', {
            name,
            resetUrl,
        });
    }
    async getEmailLogs() {
        return this.prisma.emailLog.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], MailService);
//# sourceMappingURL=mail.service.js.map