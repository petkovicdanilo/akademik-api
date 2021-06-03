import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "../entities/refresh-token.entity";
import { Repository } from "typeorm";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { TokensService } from "src/util/tokens.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "refreshToken",
) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (req, rawJwtToken, done) => {
        const payload: any = jwtService.decode(rawJwtToken);

        if (!payload?.user?.id) {
          done("Unauthorized", null);
          return;
        }

        const profile = await profilesRepository.findOne(payload.user.id);

        if (!profile) {
          done("Unauthorized", null);
          return;
        }

        const secret: string = tokensService.getRefreshTokenSecret(
          profile.password,
        );

        done(null, secret);
      },
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const id = payload.user.id;
    const type = payload.user.type;

    const refreshToken: string = this.tokensService.parseToken(
      req.headers.authorization,
    );

    const tokenInDb = await this.refreshTokenRepository.findOne(refreshToken);

    if (!tokenInDb) {
      throw new ForbiddenException("Invalid refresh token");
    }

    return { id, type };
  }
}
