import { Module } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { Student } from "./entities/student.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfilesModule } from "../profiles/profiles.module";
import { UtilModule } from "src/util/util.module";

@Module({
  imports: [TypeOrmModule.forFeature([Student]), ProfilesModule, UtilModule],
  exports: [StudentsService],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
