import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as faker from "faker";
import { RegisterDto } from "src/auth/dto/register.dto";
import { Department } from "src/departments/entities/department.entity";
import { ProfessorsService } from "src/users/professors/professors.service";
import { ProfessorTitle } from "src/users/professors/types";
import { ProfileType } from "src/users/profiles/types";
import { UnverifiedProfilesService } from "src/users/unverified-profiles/unverified-profiles.service";
import { Repository } from "typeorm";

@Injectable()
export class ProfessorsSeederService {
  constructor(
    private readonly unverifiedProfilesService: UnverifiedProfilesService,
    private readonly professorsService: ProfessorsService,
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  async seed() {
    try {
      const departments = await this.departmentsRepository.find();
      const departmentIds = departments.map((department) => department.id);

      for (let i = 0; i < 10; i++) {
        const studentDto = this.generateProfessorDto();
        const savedStudent = await this.unverifiedProfilesService.create(
          studentDto,
        );

        if (Math.random() * 100 > 33) {
          const profile = await this.unverifiedProfilesService.verify(
            savedStudent.id,
          );

          if (Math.random() * 100 > 10) {
            const departmentId = faker.random.arrayElement(departmentIds);
            const titleStr = faker.random.arrayElement(
              Object.values(ProfessorTitle),
            );
            const title = ProfessorTitle[titleStr];

            await this.professorsService.addProfessorSpecificInfo(profile.id, {
              departmentId,
              title,
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  private generateProfessorDto(): RegisterDto {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      firstName,
      lastName,
      dateOfBirth: faker.date.past(20),
      email: faker.internet.email(firstName, lastName).toLowerCase(),
      password: "password",
      type: ProfileType.Professor,
    };
  }
}
