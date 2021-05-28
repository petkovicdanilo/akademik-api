import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ProfilesService } from "src/users/profiles/profiles.service";

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
  Strategy,
  "jwt-reset-password",
) {
  constructor(private readonly profileService: ProfilesService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("token"),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const id = payload.user.id;
    const profile = await this.profileService.findOne(id);

    const token = req.body.token;

    if (profile.passwordResetToken != token) {
      throw new UnauthorizedException("Unauthorized");
    }

    return profile;
  }
}
