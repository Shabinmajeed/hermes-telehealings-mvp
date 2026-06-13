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
exports.TherapistsController = void 0;
const common_1 = require("@nestjs/common");
const therapists_service_1 = require("./therapists.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const dto_1 = require("./dto");
let TherapistsController = class TherapistsController {
    therapistsService;
    constructor(therapistsService) {
        this.therapistsService = therapistsService;
    }
    async findAll(params) {
        return this.therapistsService.findAll(params);
    }
    async findOne(id) {
        return this.therapistsService.findOne(id);
    }
    async createProfile(req, data) {
        return this.therapistsService.createProfile(req.user.id, data);
    }
    async updateProfile(req, data) {
        return this.therapistsService.updateProfile(req.user.id, data);
    }
    async getSessions(id) {
        return this.therapistsService.getSessions(id);
    }
    async getAvailability(id) {
        return this.therapistsService.getAvailability(id);
    }
};
exports.TherapistsController = TherapistsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.CLIENT, roles_decorator_1.Role.THERAPIST, roles_decorator_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TherapistsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.CLIENT, roles_decorator_1.Role.THERAPIST, roles_decorator_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TherapistsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('profile'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.THERAPIST),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateTherapistProfileDto]),
    __metadata("design:returntype", Promise)
], TherapistsController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.THERAPIST),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateTherapistProfileDto]),
    __metadata("design:returntype", Promise)
], TherapistsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(':id/sessions'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.CLIENT, roles_decorator_1.Role.THERAPIST, roles_decorator_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TherapistsController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)(':id/availability'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.CLIENT, roles_decorator_1.Role.THERAPIST, roles_decorator_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TherapistsController.prototype, "getAvailability", null);
exports.TherapistsController = TherapistsController = __decorate([
    (0, common_1.Controller)('therapists'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [therapists_service_1.TherapistsService])
], TherapistsController);
//# sourceMappingURL=therapists.controller.js.map