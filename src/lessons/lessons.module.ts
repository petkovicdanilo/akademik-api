import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lesson } from "./entities/lesson.entity";
import { SubjectsModule } from "src/subjects/subjects.module";
import { WebSightModule } from "src/web-sight/web-sight.module";
import { CaslModule } from "src/casl/casl.module";
import { ProfilesModule } from "src/users/profiles/profiles.module";
import { StudentsModule } from "src/users/students/students.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    SubjectsModule,
    WebSightModule,
    ProfilesModule,
    CaslModule,
    StudentsModule,
    ProfilesModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
