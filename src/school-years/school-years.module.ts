import { Module } from "@nestjs/common";
import { SchoolYearsService } from "./school-years.service";
import { SchoolYearsController } from "./school-years.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchoolYear } from "./entities/school-year.entity";
import { CaslModule } from "src/casl/casl.module";

@Module({
  controllers: [SchoolYearsController],
  imports: [TypeOrmModule.forFeature([SchoolYear]), CaslModule],
  exports: [SchoolYearsService],
  providers: [SchoolYearsService],
})
export class SchoolYearsModule {}
