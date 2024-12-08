"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
const STATUS_MAP = {
    P2000: common_1.HttpStatus.PAYLOAD_TOO_LARGE,
    P2001: common_1.HttpStatus.NOT_FOUND,
    P2002: common_1.HttpStatus.CONFLICT,
    P2003: common_1.HttpStatus.CONFLICT,
    P2004: common_1.HttpStatus.CONFLICT,
    P2011: common_1.HttpStatus.CONFLICT,
    P2012: common_1.HttpStatus.BAD_REQUEST,
    P2013: common_1.HttpStatus.BAD_REQUEST,
    P2014: common_1.HttpStatus.CONFLICT,
    P2015: common_1.HttpStatus.NOT_FOUND,
    P2024: common_1.HttpStatus.GATEWAY_TIMEOUT,
    P2025: common_1.HttpStatus.NOT_FOUND,
};
let PrismaExceptionFilter = class PrismaExceptionFilter extends core_1.BaseExceptionFilter {
    catch(exception, host) {
        console.error(exception.message);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const message = exception.message.replace(/\n/g, '');
        if (!(exception.code in STATUS_MAP)) {
            super.catch(exception, host);
            return;
        }
        const status = STATUS_MAP[exception.code];
        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma.filter.js.map