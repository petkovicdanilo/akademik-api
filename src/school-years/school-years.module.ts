import { Module } from "@nestjs/common";
import { SchoolYearsService } from "./school-years.service";
import { SchoolYearsController } from "./school-years.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchoolYear } from "./entities/school-year.entity";

@Module({
  controllers: [SchoolYearsController],
  imports: [TypeOrmModule.forFeature([SchoolYear])],
  exports: [SchoolYearsService],
  providers: [SchoolYearsService],
})
export class SchoolYearsModule {}
