import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { WebSightService } from "./web-sight.service";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: process.env.WEB_SIGHT_API_URL + "/api",
      headers: {
        api_authorization: process.env.WEB_SIGHT_API_KEY,
      },
    }),
    MailModule,
  ],
  providers: [WebSightService],
  exports: [WebSightService],
})
export class WebSightModule {}
