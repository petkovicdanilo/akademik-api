import { Injectable } from "@nestjs/common";
import { AdminsSeederService } from "./services/admins.service";
import { DepartmentsSeederService } from "./services/department.service";
import { EnrolledSubjectsSeederService } from "./services/enrolled-subjects.service";
import { ProfessorsSeederService } from "./services/professors.service";
import { SchoolYearsSeederService } from "./services/school-years.service";
import { StudentsSeederService } from "./services/students.service";
import { SubjectsSeederService } from "./services/subjects.service";

@Injectable()
export class Seeder {
  constructor(
    private readonly adminsSeederService: AdminsSeederService,
    private readonly studentsSeederService: StudentsSeederService,
    private readonly professorsSeederService: ProfessorsSeederService,
    private readonly departmentsSeederService: DepartmentsSeederService,
    private readonly subjectsSeederService: SubjectsSeederService,
    private readonly enrolledSubjectsSeederService: EnrolledSubjectsSeederService,
    private readonly schoolYearsSeederService: SchoolYearsSeederService,
  ) {}

  async seed() {
    await this.schoolYearsSeederService.seed();

    await this.departmentsSeederService.seed();

    await this.adminsSeederService.seed();
    await this.studentsSeederService.seed();
    await this.professorsSeederService.seed();

    await this.subjectsSeederService.seed();
    await this.enrolledSubjectsSeederService.seed();
  }
}
