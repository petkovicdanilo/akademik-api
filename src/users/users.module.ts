import { Module } from "@nestjs/common";
import { ProfessorsModule } from "./professors/professors.module";
import { StudentsModule } from "./students/students.module";

@Module({
  imports: [StudentsModule, ProfessorsModule],
  exports: [StudentsModule, ProfessorsModule],
})
export class UsersModule {}
