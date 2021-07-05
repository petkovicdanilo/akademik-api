import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "src/mail/mail.module";
import { Professor } from "src/users/professors/entities/professor.entity";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { Student } from "src/users/students/entities/student.entity";
import { UsersModule } from "src/users/users.module";
import { UtilModule } from "src/util/util.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshToken } from "./entities/refresh-token.entity";
import { ResetPasswordStrategy } from "./strategies/reset-password.strategy";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { TokensService } from "../util/tokens.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Profile, Student, Professor, RefreshToken]),
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [UtilModule],
      useFactory: async (tokensService: TokensService) => ({
        secret: tokensService.getAccessTokenSecret(),
        signOptions: { expiresIn: tokensService.getAccessTokenExpiresIn() },
      }),
      inject: [TokensService],
    }),
    MailModule,
    UtilModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    ResetPasswordStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
