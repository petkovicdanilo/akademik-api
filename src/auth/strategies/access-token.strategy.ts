import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { TokensService } from "src/util/tokens.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "accessToken",
) {
  constructor(private readonly tokensService: TokensService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: tokensService.getAccessTokenSecret(),
    });
  }

  async validate(payload: any) {
    return { id: payload.user.id, type: payload.user.type };
  }
}
