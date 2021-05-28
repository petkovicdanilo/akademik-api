import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtResetPasswordGuard } from "./guards/jwt-reset-password.guard";
import { ProfileDto } from "src/users/profiles/dto/profile.dto";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { ProfilesService } from "src/users/profiles/profiles.service";

@Controller()
@ApiTags("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post("login")
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
  })
  async login(@Body() loginDto: LoginDto) {
    return {
      token: await this.authService.login(loginDto),
    };
  }

  @Post("register")
  @ApiResponse({
    status: 201,
    type: ProfileDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<ProfileDto> {
    const profile: Profile = await this.authService.register(registerDto);
    return this.profilesService.mapProfileToProfileDto(profile);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post("reset-password")
  @UseGuards(JwtResetPasswordGuard)
  async resetPassword(
    @Request() request,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto, request.user);
  }
}
