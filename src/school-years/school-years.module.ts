import { Module } from "@nestjs/common";
import { SchoolYearsService } from "./school-years.service";
import { SchoolYearsController } from "./school-years.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchoolYear } from "./entities/school-year.entity";
import { CaslModule } from "src/casl/casl.module";
import { Lesson } from "src/lessons/entities/lesson.entity";

@Module({
  controllers: [SchoolYearsController],
  imports: [TypeOrmModule.forFeature([SchoolYear, Lesson]), CaslModule],
  exports: [SchoolYearsService],
  providers: [SchoolYearsService],
})
export class SchoolYearsModule {}
