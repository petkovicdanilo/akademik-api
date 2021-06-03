import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { TokensService } from "src/util/tokens.service";

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, "admin") {
  constructor(private readonly tokensService: TokensService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: tokensService.getAccessTokenSecret(),
    });
  }

  async validate(payload: any) {
    const id = payload.user.id;
    const type = payload.user.type;

    if (type != "admin") {
      throw new ForbiddenException("User is not admin");
    }

    return { id, type };
  }
}
