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

      await this.createFirstProfessor(departmentIds[0]);

      for (let i = 0; i < 100; i++) {
        const studentDto = this.generateProfessorDto();
        const savedStudent = await this.unverifiedProfilesService.create(
          studentDto,
        );

        if (Math.random() * 100 > 33) {
          const profile = await this.unverifiedProfilesService.verify(
            savedStudent.id,
            false,
          );

          if (Math.random() * 100 > 10) {
            const departmentId = faker.random.arrayElement(departmentIds);
            const title = this.randomProfessorTitle();

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

  private randomProfessorTitle() {
    const titleStr = faker.random.arrayElement(Object.values(ProfessorTitle));
    const title = ProfessorTitle[titleStr];
    return title;
  }

  private async createFirstProfessor(departmentId: number) {
    const professor = this.generateProfessorDto();
    professor.email = "professor@akademik.com";
    professor.firstName = "Professor";
    professor.lastName = "Professor";

    const unverifiedProfile = await this.unverifiedProfilesService.create(
      professor,
    );

    const profile = await this.unverifiedProfilesService.verify(
      unverifiedProfile.id,
      false,
    );

    await this.professorsService.addProfessorSpecificInfo(profile.id, {
      departmentId: departmentId,
      title: this.randomProfessorTitle(),
    });
  }

  private generateProfessorDto(): RegisterDto {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      firstName,
      lastName,
      dateOfBirth: faker.date.between("1945-01-01", "1990-12-31"),
      email: faker.internet.email(firstName, lastName).toLowerCase(),
      password: "password",
      type: ProfileType.Professor,
    };
  }
}
