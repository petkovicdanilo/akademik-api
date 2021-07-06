import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as faker from "faker";
import { RegisterDto } from "src/auth/dto/register.dto";
import { Department } from "src/departments/entities/department.entity";
import { SchoolYear } from "src/school-years/entities/school-year.entity";
import { ProfileType } from "src/users/profiles/types";
import { StudentsService } from "src/users/students/students.service";
import { UnverifiedProfilesService } from "src/users/unverified-profiles/unverified-profiles.service";
import { Repository } from "typeorm";

@Injectable()
export class StudentsSeederService {
  constructor(
    private readonly unverifiedProfilesService: UnverifiedProfilesService,
    private readonly studentsService: StudentsService,
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
    @InjectRepository(SchoolYear)
    private readonly schoolYearsRepository: Repository<SchoolYear>,
  ) {}

  async seed() {
    try {
      const departments = await this.departmentsRepository.find();
      const departmentIds = departments.map((department) => department.id);

      const schoolYears = await this.schoolYearsRepository.find();
      const schoolYearIds = schoolYears.map((schoolYear) => schoolYear.id);

      await this.createFirstStudent(departmentIds[0], schoolYearIds[0]);

      for (let i = 0; i < 500; i++) {
        const studentDto = this.generateStudentDto();
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
            const schoolYearId = faker.random.arrayElement(schoolYearIds);

            await this.studentsService.addStudentSpecificInfo(
              profile.id,
              {
                departmentId,
              },
              schoolYearId,
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  private async createFirstStudent(departmentId: number, schoolYearId: string) {
    const student = this.generateStudentDto();
    student.email = "student@akademik.com";
    student.firstName = "Student";
    student.lastName = "Student";

    const unverifiedProfile = await this.unverifiedProfilesService.create(
      student,
    );

    const profile = await this.unverifiedProfilesService.verify(
      unverifiedProfile.id,
      false,
    );

    await this.studentsService.addStudentSpecificInfo(
      profile.id,
      {
        departmentId: departmentId,
      },
      schoolYearId,
    );
  }

  private generateStudentDto(): RegisterDto {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      firstName,
      lastName,
      dateOfBirth: faker.date.between("1990-01-01", "2001-12-31"),
      email: faker.internet.email(firstName, lastName).toLowerCase(),
      password: "password",
      type: ProfileType.Student,
    };
  }
}
