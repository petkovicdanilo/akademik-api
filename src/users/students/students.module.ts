import { Module } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { Student } from "./entities/student.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UtilModule } from "src/util/util.module";

@Module({
  imports: [TypeOrmModule.forFeature([Student]), UtilModule],
  exports: [StudentsService],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
