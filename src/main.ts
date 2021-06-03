import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { UtilService } from "./util/util.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("akademik API")
    .setDescription(
      "API for application used by university students and professors",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.use(helmet());

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  const utilService = app.get(UtilService);
  const port = utilService.getPort();

  await app.listen(port);
}
bootstrap();
