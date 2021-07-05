import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { TokensDto } from "./dto/tokens.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ResetPasswordGuard } from "../common/guards/reset-password.guard";
import { UnverifiedProfileDto } from "src/users/unverified-profiles/dto/unverified-profile.dto";
import { UnverifiedProfilesService } from "src/users/unverified-profiles/unverified-profiles.service";
import { RefreshTokenGuard } from "../common/guards/refresh-token.guard";
import { TokensService } from "src/util/tokens.service";

@Controller()
@ApiTags("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly unverifiedProfilesService: UnverifiedProfilesService,
    private readonly tokensService: TokensService,
  ) {}

  @Post("login")
  @ApiResponse({
    status: 200,
    type: TokensDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<TokensDto> {
    return this.authService.login(loginDto);
  }

  @Post("logout")
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  async logout(@Request() req: any): Promise<void> {
    const refreshToken = this.tokensService.parseToken(
      req.headers.authorization,
    );
    return this.authService.invalidateRefreshToken(refreshToken);
  }

  @Post("register")
  @ApiResponse({
    status: 201,
    type: UnverifiedProfileDto,
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<UnverifiedProfileDto> {
    const profile = await this.authService.register(registerDto);

    return this.unverifiedProfilesService.mapToDto(profile);
  }

  @Post("refresh")
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  refreshToken(@Request() req: any): Promise<TokensDto> {
    const refreshToken = this.tokensService.parseToken(
      req.headers.authorization,
    );
    return this.authService.refreshToken(req.user.id, refreshToken);
  }

  @Post("forgot-password")
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post("reset-password")
  @UseGuards(ResetPasswordGuard)
  async resetPassword(
    @Request() request,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(resetPasswordDto, request.user);
  }
}
