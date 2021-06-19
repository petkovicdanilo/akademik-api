import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchoolYearsModule } from "src/school-years/school-years.module";
import { ExamPeriod } from "./entities/exam-period.entity";
import { ExamPeriodsOtherController } from "./exam-periods-other.controller";
import { ExamPeriodsController } from "./exam-periods.controller";
import { ExamPeriodsService } from "./exam-periods.service";

@Module({
  controllers: [ExamPeriodsController, ExamPeriodsOtherController],
  providers: [ExamPeriodsService],
  imports: [TypeOrmModule.forFeature([ExamPeriod]), SchoolYearsModule],
})
export class ExamsModule {}
