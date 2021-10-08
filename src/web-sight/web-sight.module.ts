import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { WebSightService } from "./web-sight.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: process.env.WEB_SIGHT_API_URL + "/api",
      headers: {
        api_authorization: process.env.WEB_SIGHT_API_KEY,
      },
    }),
  ],
  providers: [WebSightService],
  exports: [WebSightService],
})
export class WebSightModule {}
