"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationExtension = void 0;
const client_1 = require("@prisma/client");
exports.PaginationExtension = client_1.Prisma.defineExtension((client) => {
    return client.$extends({
        name: 'PaginationExtension',
        query: {
            $allModels: {
                async findMany({ model, args, query }) {
                    if ('skip' in args && 'take' in args) {
                        const { skip, take, where } = args;
                        return {
                            data: await query(args),
                            meta: {
                                page: skip / take + 1,
                                limit: take,
                                total: await client[model].count({ where }),
                            },
                        };
                    }
                    return await query(args);
                },
            },
        },
    });
});
//# sourceMappingURL=prisma.extensions.js.map