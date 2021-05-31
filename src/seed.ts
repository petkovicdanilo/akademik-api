import { NestFactory } from "@nestjs/core";
import { Seeder } from "./seeder/seeder";
import { SeederModule } from "./seeder/seeder.module";

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  const seeder = appContext.get(Seeder);
  try {
    await seeder.seed();
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    appContext.close();
  }
}
bootstrap();
