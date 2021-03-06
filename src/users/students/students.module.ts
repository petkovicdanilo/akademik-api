import { Module } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { Student } from "./entities/student.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfilesModule } from "../profiles/profiles.module";
import { UtilModule } from "src/util/util.module";
import { Profile } from "../profiles/entities/profile.entity";
import { StudentsOtherController } from "./students-other.controller";
import { SchoolYearsModule } from "src/school-years/school-years.module";
import { CaslModule } from "src/casl/casl.module";
import { DepartmentsModule } from "src/departments/departments.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Profile]),
    ProfilesModule,
    UtilModule,
    SchoolYearsModule,
    CaslModule,
    DepartmentsModule,
  ],
  exports: [StudentsService],
  controllers: [StudentsController, StudentsOtherController],
  providers: [StudentsService],
})
export class StudentsModule {}
