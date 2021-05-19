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

@Injectable()
export class AuthService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly professorsService: ProfessorsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const student = await this.studentsService.findByEmail(loginDto.email);
    if (student != undefined) {
      const hashedPassword = await this.hashPassword(
        loginDto.password,
        student.salt,
      );
      if (student.password != hashedPassword) {
        throw new BadRequestException("Wrong username or password");
      }

      return this.jwtService.sign({ id: student.id, type: "student" });
    }

    const professor = await this.professorsService.findByEmail(loginDto.email);
    if (professor == undefined) {
      throw new BadRequestException("Wrong username or password");
    }

    const hashedPassword = await this.hashPassword(
      loginDto.password,
      professor.salt,
    );
    if (professor.password != hashedPassword) {
      throw new BadRequestException("Wrong username or password");
    }

    return this.jwtService.sign({ id: professor.id, type: "professor" });
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

  hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }
}
