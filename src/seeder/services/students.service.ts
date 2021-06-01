import { Injectable } from "@nestjs/common";
import * as faker from "faker";
import { RegisterDto } from "src/auth/dto/register.dto";
import { ProfileType } from "src/users/profiles/types";
import { StudentsService } from "src/users/students/students.service";
import { UnverifiedProfilesService } from "src/users/unverified-profiles/unverified-profiles.service";

@Injectable()
export class StudentsSeederService {
  constructor(
    private readonly unverifiedProfilesService: UnverifiedProfilesService,
    private readonly studentsService: StudentsService,
  ) {}

  async seed() {
    try {
      for (let i = 0; i < 30; i++) {
        const studentDto = this.generateStudentDto();
        const savedStudent = await this.unverifiedProfilesService.create(
          studentDto,
        );

        if (Math.random() * 100 > 33) {
          const profile = await this.unverifiedProfilesService.verify(
            savedStudent.id,
          );

          if (Math.random() * 100 > 10) {
            await this.studentsService.addStudentSpecificInfo(profile.id, {});
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  private generateStudentDto(): RegisterDto {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      firstName,
      lastName,
      dateOfBirth: faker.date.past(20),
      email: faker.internet.email(firstName, lastName),
      password: "password",
      type: ProfileType.Student,
    };
  }
}
