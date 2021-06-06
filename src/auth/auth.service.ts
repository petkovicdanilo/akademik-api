import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { MailService } from "src/mail/mail.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ResetPasswordTokenPayload } from "./dto/jwt/reset-password-token-payload.dto";
import { AccessTokenPayload } from "./dto/jwt/access-token-payload.dto";
import { ProfilesService } from "src/users/profiles/profiles.service";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { UnverifiedProfilesService } from "src/users/unverified-profiles/unverified-profiles.service";
import { UnverifiedProfile } from "src/users/unverified-profiles/entities/unverified-profile.entity";
import { RefreshTokenPayload } from "./dto/jwt/refresh-token-payload.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "./entities/refresh-token.entity";
import { Repository } from "typeorm";
import { TokensDto } from "./dto/tokens.dto";
import { TokensService } from "../util/tokens.service";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class AuthService {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly unverifiedProfilesService: UnverifiedProfilesService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly tokensService: TokensService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  async login(loginDto: LoginDto) {
    const profile = await this.profilesService.findByEmail(loginDto.email);

    if (!profile) {
      throw new BadRequestException("Wrong username or password");
    }

    const hashedPassword = await this.profilesService.hashPassword(
      loginDto.password,
      profile.salt,
    );
    if (profile.password != hashedPassword) {
      throw new BadRequestException("Wrong username or password");
    }

    return this.generateTokens(profile);
  }

  async register(registerDto: RegisterDto): Promise<UnverifiedProfile> {
    return this.unverifiedProfilesService.create(registerDto);
  }

  async refreshToken(id: number, oldRefreshToken: string) {
    const profile = await this.profilesService.findOne(id);
    return this.generateTokens(profile, oldRefreshToken);
  }

  async forgotPassword(email: string) {
    const profile = await this.profilesService.findByEmail(email);

    if (!profile) {
      throw new NotFoundException("Email not found");
    }

    const payload = new ResetPasswordTokenPayload(profile.id, profile.type);
    const token = await this.jwtService.signAsync(
      { ...payload },
      {
        secret: this.tokensService.getResetPasswordTokenSecret(),
        expiresIn: this.tokensService.getResetPasswordTokenExpiresIn(),
      },
    );

    await this.profilesService.setPasswordResetToken(profile.id, token);

    return this.mailService.sendResetPasswordEmail(profile, token);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    profile: Profile,
  ): Promise<void> {
    this.profilesService.resetPassword(profile, resetPasswordDto.password);
  }

  private async generateTokens(
    profile: Profile,
    oldRefreshToken?: string,
  ): Promise<TokensDto> {
    const accessTokenPayload = new AccessTokenPayload(
      profile.id,
      profile.type,
      profile.hasAdditionalInfo ? undefined : true,
    );
    const accessToken = this.jwtService.sign({ ...accessTokenPayload });

    if (oldRefreshToken) {
      await this.invalidateRefreshToken(oldRefreshToken);
    }

    const refreshTokenPayload = new RefreshTokenPayload(
      profile.id,
      profile.type,
    );

    const refreshTokenExpiresIn = this.tokensService.getRefreshTokenExpiresIn();

    const refreshToken = this.jwtService.sign(
      { ...refreshTokenPayload },
      {
        secret: this.tokensService.getRefreshTokenSecret(profile.password),
        expiresIn: refreshTokenExpiresIn,
      },
    );

    const expirationTime = new Date();
    expirationTime.setSeconds(
      expirationTime.getSeconds() + refreshTokenExpiresIn,
    );

    await this.refreshTokensRepository.save({
      token: refreshToken,
      expirationTime,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async invalidateRefreshToken(refreshToken: string) {
    await this.refreshTokensRepository.delete(refreshToken);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  private async clearExpiredRefreshTokens() {
    await this.refreshTokensRepository
      .createQueryBuilder()
      .delete()
      .from(RefreshToken)
      .where("expirationTime < :expirationTime", {
        expirationTime: new Date(),
      })
      .execute();
  }
}
