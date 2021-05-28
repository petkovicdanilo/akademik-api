import { Module } from "@nestjs/common";
import { ProfessorsModule } from "./professors/professors.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { StudentsModule } from "./students/students.module";
import { UsersService } from "./users.service";

@Module({
  imports: [StudentsModule, ProfessorsModule, ProfilesModule],
  exports: [StudentsModule, ProfessorsModule, ProfilesModule, UsersService],
  providers: [UsersService],
})
export class UsersModule {}
