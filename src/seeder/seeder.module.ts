import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbModule } from "src/db/db.module";
import { DepartmentsModule } from "src/departments/departments.module";
import { Admin } from "src/users/admins/entities/admin.entity";
import { UsersModule } from "src/users/users.module";
import { AdminsSeederService } from "./services/admins.service";
import { Seeder } from "./seeder";
import { DepartmentsSeederService } from "./services/department.service";
import { ProfessorsSeederService } from "./services/professors.service";
import { StudentsSeederService } from "./services/students.service";
import { Department } from "src/departments/entities/department.entity";
import { Professor } from "src/users/professors/entities/professor.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import { Student } from "src/users/students/entities/student.entity";
import { EnrolledSubject } from "src/subjects/entities/enrolled-subject.entity";
import { SchoolYear } from "src/school-years/entities/school-year.entity";
import { SubjectsSeederService } from "./services/subjects.service";
import { RefreshToken } from "src/auth/entities/refresh-token.entity";
import { EnrolledSubjectsSeederService } from "./services/enrolled-subjects.service";
import { SchoolYearsSeederService } from "./services/school-years.service";
import { SchoolYearsModule } from "src/school-years/school-years.module";
import { ExamPeriod } from "src/exams/entities/exam-period.entity";
import { ExamPeriodsSeederService } from "./services/exam-periods.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    DbModule,
    UsersModule,
    DepartmentsModule,
    TypeOrmModule.forFeature([
      Admin,
      Department,
      Professor,
      Subject,
      Student,
      EnrolledSubject,
      SchoolYear,
      RefreshToken,
      ExamPeriod,
    ]),
    SchoolYearsModule,
  ],
  providers: [
    Seeder,
    AdminsSeederService,
    StudentsSeederService,
    ProfessorsSeederService,
    DepartmentsSeederService,
    SubjectsSeederService,
    EnrolledSubjectsSeederService,
    SchoolYearsSeederService,
    ExamPeriodsSeederService,
  ],
})
export class SeederModule {}
