import { Module } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { Student } from "./entities/student.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfilesModule } from "../profiles/profiles.module";
import { UtilModule } from "src/util/util.module";
import { Profile } from "../profiles/entities/profile.entity";
import { Department } from "src/departments/entities/department.entity";
import { StudentsOtherController } from "./students-other.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Profile, Department]),
    ProfilesModule,
    UtilModule,
  ],
  exports: [StudentsService],
  controllers: [StudentsController, StudentsOtherController],
  providers: [StudentsService],
})
export class StudentsModule {}
