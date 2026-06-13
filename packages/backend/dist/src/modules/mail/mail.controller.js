"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./mail.service");
let MailController = class MailController {
    mailService;
    constructor(mailService) {
        this.mailService = mailService;
    }
    async getEmailLogs() {
        return this.mailService.getEmailLogs();
    }
    async testWelcome(body) {
        const logId = await this.mailService.sendWelcomeEmail(body.to, body.name);
        return { message: 'Welcome email queued', logId };
    }
    async testSessionReminder(body) {
        const logId = await this.mailService.sendSessionReminder(body.to, body.name, body.therapistName, body.sessionDate, body.sessionTime, body.sessionType);
        return { message: 'Session reminder queued', logId };
    }
    async testBookingConfirmation(body) {
        const logId = await this.mailService.sendBookingConfirmation(body.to, body.name, body.therapistName, body.sessionDate, body.sessionTime, body.sessionType);
        return { message: 'Booking confirmation queued', logId };
    }
    async testPasswordReset(body) {
        const logId = await this.mailService.sendPasswordReset(body.to, body.name, body.resetToken);
        return { message: 'Password reset email queued', logId };
    }
};
exports.MailController = MailController;
__decorate([
    (0, common_1.Get)('logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MailController.prototype, "getEmailLogs", null);
__decorate([
    (0, common_1.Post)('test/welcome'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "testWelcome", null);
__decorate([
    (0, common_1.Post)('test/session-reminder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "testSessionReminder", null);
__decorate([
    (0, common_1.Post)('test/booking-confirmation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "testBookingConfirmation", null);
__decorate([
    (0, common_1.Post)('test/password-reset'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "testPasswordReset", null);
exports.MailController = MailController = __decorate([
    (0, common_1.Controller)('mail'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
//# sourceMappingURL=mail.controller.js.map