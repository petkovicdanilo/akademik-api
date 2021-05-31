import { Module } from "@nestjs/common";
import { UtilModule } from "src/util/util.module";
import { ProfessorsModule } from "./professors/professors.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { StudentsModule } from "./students/students.module";
import { UnverifiedProfilesModule } from "./unverified-profiles/unverified-profiles.module";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    StudentsModule,
    ProfessorsModule,
    ProfilesModule,
    UnverifiedProfilesModule,
    UtilModule,
  ],
  exports: [
    StudentsModule,
    ProfessorsModule,
    ProfilesModule,
    UnverifiedProfilesModule,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
