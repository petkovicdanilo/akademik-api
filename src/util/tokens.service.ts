import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokensService {
  constructor(private readonly configService: ConfigService) {}

  parseToken(header: string) {
    return header.split("Bearer ")[1];
  }

  getAccessTokenSecret(): string {
    return this.configService.get("ACCESS_TOKEN_SECRET");
  }

  getAccessTokenExpiresIn(): number {
    return parseInt(this.configService.get("ACCESS_TOKEN_EXPIRES_IN"));
  }

  getRefreshTokenSecret(password: string): string {
    return this.configService.get("REFRESH_TOKEN_SECRET") + password;
  }

  getRefreshTokenExpiresIn(): number {
    return parseInt(this.configService.get("REFRESH_TOKEN_EXPIRES_IN"));
  }

  getResetPasswordTokenSecret(): string {
    return this.configService.get("RESET_PASSWORD_TOKEN_SECRET");
  }

  getResetPasswordTokenExpiresIn(): number {
    return parseInt(this.configService.get("RESET_PASSWORD_TOKEN_EXPIRES_IN"));
  }
}
