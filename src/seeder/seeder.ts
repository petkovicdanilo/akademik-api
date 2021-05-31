import { Injectable } from "@nestjs/common";
import { AdminsSeederService } from "./services/admins.service";
import { DepartmentsSeederService } from "./services/department.service";
import { ProfessorsSeederService } from "./services/professors.service";
import { StudentsSeederService } from "./services/students.service";

@Injectable()
export class Seeder {
  constructor(
    private readonly adminsSeederService: AdminsSeederService,
    private readonly studentsSeederService: StudentsSeederService,
    private readonly professorsSeederService: ProfessorsSeederService,
    private readonly departmentsSeederService: DepartmentsSeederService,
  ) {}

  async seed() {
    await this.departmentsSeederService.seed();

    await Promise.all([
      this.adminsSeederService.seed(),
      this.studentsSeederService.seed(),
      this.professorsSeederService.seed(),
    ]);
  }
}
