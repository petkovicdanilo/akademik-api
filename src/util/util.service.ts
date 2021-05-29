import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UtilService {
  constructor(private readonly configService: ConfigService) {}

  getAppRoute(path: string) {
    const url = new URL(path, this.configService.get<string>("APP_URL"));
    return url.toString();
  }

  getFrontendUrl() {
    return this.configService.get<string>("FRONTEND_URL");
  }

  getFrontendResetPasswordUrl() {
    return new URL("/auth/reset-password", this.getFrontendUrl()).toString();
  }
}
