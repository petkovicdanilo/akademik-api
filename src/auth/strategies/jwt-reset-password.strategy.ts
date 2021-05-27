import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
  Strategy,
  "jwt-reset-password",
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("token"),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const email = payload.user.email;
    const user = await this.usersService.findUserByEmail(email);

    const token = req.body.token;

    if (user.passwordResetToken != token) {
      throw new UnauthorizedException("Unauthorized");
    }

    return user;
  }
}
