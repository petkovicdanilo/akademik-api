import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ProfilesService } from "src/users/profiles/profiles.service";
import { TokensService } from "src/util/tokens.service";

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
  Strategy,
  "jwt-reset-password",
) {
  constructor(
    private readonly profileService: ProfilesService,
    private readonly tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("token"),
      ignoreExpiration: false,
      secretOrKey: tokensService.getResetPasswordTokenSecret(),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const id = payload.user.id;
    const profile = await this.profileService.findOne(id);

    const token = req.body.token;

    if (profile.passwordResetToken != token) {
      throw new ForbiddenException("Invalid token");
    }

    return profile;
  }
}
