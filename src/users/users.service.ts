import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { RegisterDto } from "src/auth/dto/register.dto";
import { ProfessorsService } from "./professors/professors.service";
import { StudentsService } from "./students/students.service";
import { ProfileType } from "./profiles/types";
import { Profile } from "./profiles/entities/profile.entity";

@Injectable()
export class UsersService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly professorsService: ProfessorsService,
  ) {}

  async create(userDto: RegisterDto): Promise<Profile> {
    switch (userDto.type) {
      case ProfileType.Student:
        const student = await this.studentsService.create(userDto);
        return student.profile;
      case ProfileType.Professor:
        const professor = await this.professorsService.create(userDto);
        return professor.profile;
      default:
        throw new InternalServerErrorException("Internal server error");
    }
  }
}
