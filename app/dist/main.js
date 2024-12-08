"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const prisma_filter_1 = require("./common/prisma/prisma.filter");
const config_service_1 = require("./common/config/config.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableShutdownHooks();
    app.enableCors();
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new prisma_filter_1.PrismaExceptionFilter(httpAdapter));
    await app.listen(app.get(config_service_1.ConfigService).getAppPort());
    process.on('SIGINT', async () => {
        await app.close();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        await app.close();
        process.exit(0);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map