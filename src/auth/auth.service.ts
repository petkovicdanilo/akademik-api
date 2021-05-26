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

@Injectable()
export class AuthService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly professorsService: ProfessorsService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private async findUserByEmail(email: string) {
    const student = await this.studentsService.findByEmail(email);
    if (student) {
      return {
        type: "student",
        ...student,
      };
    }

    const professor = await this.professorsService.findByEmail(email);
    return {
      type: "professor",
      ...professor,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.findUserByEmail(loginDto.email);

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

  async register(registerDto: RegisterDto) {
    registerDto.salt = await bcrypt.genSalt();
    registerDto.password = await this.hashPassword(
      registerDto.password,
      registerDto.salt,
    );

    switch (registerDto.type) {
      case "student":
        return this.studentsService.create(registerDto);
      case "professor":
        return this.professorsService.create(registerDto);
      default:
        throw new InternalServerErrorException("Internal server error");
    }
  }

  async forgotPassword(email: string) {
    return this.mailService.sendResetPasswordEmail(email);
  }

  hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }
}
