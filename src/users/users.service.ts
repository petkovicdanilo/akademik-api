import { Injectable, NotFoundException } from "@nestjs/common";
import { UserWithType } from "./entities/user-with-type.entity";
import { ProfessorsService } from "./professors/professors.service";
import { StudentsService } from "./students/students.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly professorsService: ProfessorsService,
  ) {}

  async findUserByEmail(email: string): Promise<UserWithType> {
    const student = await this.studentsService.findByEmail(email);
    if (student) {
      return new UserWithType("student", student);
    }

    const professor = await this.professorsService.findByEmail(email);
    if (!professor) {
      throw new NotFoundException("User not found");
    }

    return new UserWithType("professor", professor);
  }
}
