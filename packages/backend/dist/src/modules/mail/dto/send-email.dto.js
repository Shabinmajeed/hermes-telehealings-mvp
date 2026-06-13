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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendPasswordResetDto = exports.SendBookingConfirmationDto = exports.SendSessionReminderDto = exports.SendWelcomeEmailDto = void 0;
const class_validator_1 = require("class-validator");
class SendWelcomeEmailDto {
    to;
    name;
}
exports.SendWelcomeEmailDto = SendWelcomeEmailDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendWelcomeEmailDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendWelcomeEmailDto.prototype, "name", void 0);
class SendSessionReminderDto {
    to;
    name;
    therapistName;
    sessionDate;
    sessionTime;
    sessionType;
}
exports.SendSessionReminderDto = SendSessionReminderDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendSessionReminderDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSessionReminderDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSessionReminderDto.prototype, "therapistName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSessionReminderDto.prototype, "sessionDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSessionReminderDto.prototype, "sessionTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSessionReminderDto.prototype, "sessionType", void 0);
class SendBookingConfirmationDto {
    to;
    name;
    therapistName;
    sessionDate;
    sessionTime;
    sessionType;
}
exports.SendBookingConfirmationDto = SendBookingConfirmationDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendBookingConfirmationDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendBookingConfirmationDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendBookingConfirmationDto.prototype, "therapistName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendBookingConfirmationDto.prototype, "sessionDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendBookingConfirmationDto.prototype, "sessionTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendBookingConfirmationDto.prototype, "sessionType", void 0);
class SendPasswordResetDto {
    to;
    name;
    resetToken;
}
exports.SendPasswordResetDto = SendPasswordResetDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendPasswordResetDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendPasswordResetDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendPasswordResetDto.prototype, "resetToken", void 0);
//# sourceMappingURL=send-email.dto.js.map