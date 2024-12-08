"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClient = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_extensions_1 = require("./prisma.extensions");
class PrismaClient extends client_1.PrismaClient {
    constructor(options) {
        super({
            ...(!!options ? options : {}),
            log: [
                {
                    emit: 'event',
                    level: 'info',
                },
                {
                    emit: 'event',
                    level: 'query',
                },
            ],
        });
        this.$on('info', (e) => {
            common_1.Logger.log(e.message, 'PrismaInfo');
        });
        this.$on('query', (e) => {
            common_1.Logger.log(JSON.stringify(e), 'PrismaQuery');
        });
        const prisma = (0, prisma_extensions_1.PaginationExtension)(this);
        return prisma;
    }
}
exports.PrismaClient = PrismaClient;
//# sourceMappingURL=prisma.client.js.map