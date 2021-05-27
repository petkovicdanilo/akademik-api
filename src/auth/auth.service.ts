import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ProfessorsService } from "src/users/professors/professors.service";
import { StudentsService } from "src/users/students/students.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { MailService } from "src/mail/mail.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UsersService } from "src/users/users.service";
import { UserWithType } from "src/users/entities/user-with-type.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly professorsService: ProfessorsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new BadRequestException("Wrong username or password");
    }

    const hashedPassword = await this.hashPassword(
      loginDto.password,
      user.salt,
    );
    if (user.password != hashedPassword) {
      throw new BadRequestException("Wrong username or password");
    }

    return this.jwtService.sign({ id: user.id, type: user.type });
  }

  async register(registerDto: RegisterDto): Promise<UserWithType> {
    registerDto.salt = await bcrypt.genSalt();
    registerDto.password = await this.hashPassword(
      registerDto.password,
      registerDto.salt,
    );

    switch (registerDto.type) {
      case "student":
        const student = await this.studentsService.create(registerDto);
        return new UserWithType("student", student);
      case "professor":
        const professor = await this.professorsService.create(registerDto);
        return new UserWithType("professor", professor);
      default:
        throw new InternalServerErrorException("Internal server error");
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findUserByEmail(email);

    const token = await this.jwtService.signAsync({
      user: {
        id: user.id,
        email: user.email,
      },
      tokenType: "resetPassword",
    });

    switch (user.type) {
      case "student":
        this.studentsService.setPasswordResetToken(user.id, token);
        break;
      case "professor":
        this.professorsService.setPasswordResetToken(user.id, token);
        break;
      default:
        throw new InternalServerErrorException("Internal server error");
    }

    return this.mailService.sendResetPasswordEmail(user, token);
  }

  hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, user: UserWithType) {
    const password = await this.hashPassword(
      resetPasswordDto.password,
      user.salt,
    );

    switch (user.type) {
      case "student":
        await this.studentsService.resetPassword(user.id, password);
        break;
      case "professor":
        await this.professorsService.resetPassword(user.id, password);
        break;
      default:
        throw new BadRequestException();
    }
  }
}
