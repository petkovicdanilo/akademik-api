import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchoolYearsModule } from "src/school-years/school-years.module";
import { SubjectsModule } from "src/subjects/subjects.module";
import { UsersModule } from "src/users/users.module";
import { ExamPeriod } from "./entities/exam-period.entity";
import { ExamRegistration } from "./entities/exam-registration.entity";
import { ExamPeriodsOtherController } from "./exam-periods-other.controller";
import { ExamPeriodsController } from "./exam-periods.controller";
import { ExamPeriodsService } from "./exam-periods.service";
import { ExamRegistrationsController } from "./exam-registrations.controller";
import { ExamRegistrationsService } from "./exam-registrations.service";

@Module({
  controllers: [
    ExamPeriodsController,
    ExamPeriodsOtherController,
    ExamRegistrationsController,
  ],
  providers: [ExamPeriodsService, ExamRegistrationsService],
  imports: [
    TypeOrmModule.forFeature([ExamPeriod, ExamRegistration]),
    SchoolYearsModule,
    UsersModule,
    SchoolYearsModule,
    SubjectsModule,
  ],
})
export class ExamsModule {}
