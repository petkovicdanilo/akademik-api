import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PaginationParams } from "src/pagination/pagination-params.dto";

@Injectable()
export class UtilService {
  constructor(private readonly configService: ConfigService) {}

  getAppRoute(path: string): string {
    const url = new URL(path, this.configService.get<string>("APP_URL"));
    return url.toString();
  }

  getFrontendUrl(): string {
    return this.configService.get<string>("FRONTEND_URL");
  }

  getFrontendResetPasswordUrl(): string {
    return new URL("/auth/reset-password", this.getFrontendUrl()).toString();
  }

  getPort(): number {
    return parseInt(this.configService.get("PORT"));
  }

  getPagingParams(paginationParams: PaginationParams, request: any) {
    const page = paginationParams.page || 1;
    const limit = paginationParams.limit || 10;

    const route = this.getAppRoute(request.path);

    return {
      page,
      limit,
      route,
    };
  }
}
