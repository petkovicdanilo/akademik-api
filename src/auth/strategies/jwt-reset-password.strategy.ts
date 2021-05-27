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
    const id = payload.user.id;
    const type = payload.user.type;
    const user = await this.usersService.findUser(id, type);

    const token = req.body.token;

    if (user.passwordResetToken != token) {
      throw new UnauthorizedException("Unauthorized");
    }

    return user;
  }
}
