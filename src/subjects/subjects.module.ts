import { Module } from "@nestjs/common";
import { SubjectsService } from "./subjects.service";
import { SubjectsController } from "./subjects.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subject } from "./entities/subject.entity";
import { EnrolledSubject } from "./entities/enrolled-subject.entity";
import { SchoolYear } from "src/school-years/entities/school-year.entity";
import { UsersModule } from "src/users/users.module";
import { DepartmentsModule } from "src/departments/departments.module";

@Module({
  controllers: [SubjectsController],
  imports: [
    TypeOrmModule.forFeature([Subject, EnrolledSubject, SchoolYear]),
    UsersModule,
    DepartmentsModule,
  ],
  providers: [SubjectsService],
})
export class SubjectsModule {}
