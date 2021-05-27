import { Module } from "@nestjs/common";
import { ProfessorsModule } from "./professors/professors.module";
import { StudentsModule } from "./students/students.module";
import { UsersService } from "./users.service";

@Module({
  imports: [StudentsModule, ProfessorsModule],
  exports: [StudentsModule, ProfessorsModule, UsersService],
  providers: [UsersService],
})
export class UsersModule {}
