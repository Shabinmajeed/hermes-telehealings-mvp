"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let SanitizeInterceptor = class SanitizeInterceptor {
    xssPattern = /<[^>]*>|javascript:|on\w+\s*=|&#x?[0-9a-f]+;|%3C|%3E/gi;
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        if (request.body && typeof request.body === 'object') {
            try {
                request.body = this.sanitizeObject({ ...request.body });
            }
            catch {
            }
        }
        if (request.query && typeof request.query === 'object') {
            try {
                request.query = this.sanitizeObject({ ...request.query });
            }
            catch {
            }
        }
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data && typeof data === 'object') {
                return this.sanitizeObject(data);
            }
            return data;
        }));
    }
    sanitizeString(value) {
        return value
            .replace(this.xssPattern, '')
            .replace(/[<>]/g, '')
            .trim();
    }
    sanitizeObject(obj) {
        if (typeof obj === 'string') {
            return this.sanitizeString(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.sanitizeObject(item));
        }
        if (obj && typeof obj === 'object') {
            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                result[key] = this.sanitizeObject(value);
            }
            return result;
        }
        return obj;
    }
};
exports.SanitizeInterceptor = SanitizeInterceptor;
exports.SanitizeInterceptor = SanitizeInterceptor = __decorate([
    (0, common_1.Injectable)()
], SanitizeInterceptor);
//# sourceMappingURL=sanitize.interceptor.js.map