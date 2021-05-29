import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { MailService } from "src/mail/mail.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ResetPasswordTokenPayload } from "./dto/jwt/reset-password-token-payload.dto";
import { AccessTokenPayload } from "./dto/jwt/access-token-payload.dto";
import { ProfilesService } from "src/users/profiles/profiles.service";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const profile = await this.profilesService.findByEmail(loginDto.email);

    if (!profile) {
      throw new BadRequestException("Wrong username or password");
    }

    const hashedPassword = await this.hashPassword(
      loginDto.password,
      profile.salt,
    );
    if (profile.password != hashedPassword) {
      throw new BadRequestException("Wrong username or password");
    }

    const payload = new AccessTokenPayload(profile.id, profile.type);
    return this.jwtService.sign({ ...payload });
  }

  async register(registerDto: RegisterDto): Promise<Profile> {
    return this.usersService.create(registerDto);
  }

  async forgotPassword(email: string) {
    const profile = await this.profilesService.findByEmail(email);

    const payload = new ResetPasswordTokenPayload(profile.id, profile.type);
    const token = await this.jwtService.signAsync({ ...payload });

    await this.profilesService.setPasswordResetToken(profile.id, token);

    return this.mailService.sendResetPasswordEmail(profile, token);
  }

  hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    profile: Profile,
  ): Promise<void> {
    this.profilesService.resetPassword(profile, resetPasswordDto.password);
  }
}
