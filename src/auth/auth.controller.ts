import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UserWithTypeDto } from "src/users/dto/user-with-type.dto";

@Controller()
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    type: UserWithTypeDto,
  })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return user.toDto();
  }

  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }
}
