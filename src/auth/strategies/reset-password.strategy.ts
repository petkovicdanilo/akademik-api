import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ProfilesService } from "src/users/profiles/profiles.service";
import { TokensService } from "src/util/tokens.service";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";

@Injectable()
export class ResetPasswordStrategy extends PassportStrategy(
  Strategy,
  "resetPassword",
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
      throw new AccessForbiddenException("Invalid token");
    }

    return profile;
  }
}
