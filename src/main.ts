import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { useContainer } from "class-validator";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new Logger(),
    });
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(3000);
}
bootstrap().then(() => {
    Logger.log("Start App on http://localhost:3000");
});
