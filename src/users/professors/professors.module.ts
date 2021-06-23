import { Module } from "@nestjs/common";
import { ProfessorsService } from "./professors.service";
import { ProfessorsController } from "./professors.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Professor } from "./entities/professor.entity";
import { UtilModule } from "src/util/util.module";
import { ProfilesModule } from "../profiles/profiles.module";
import { Profile } from "../profiles/entities/profile.entity";
import { Department } from "src/departments/entities/department.entity";
import { ProfessorsOtherController } from "./professors-other.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Professor, Profile, Department]),
    UtilModule,
    ProfilesModule,
  ],
  exports: [ProfessorsService],
  controllers: [ProfessorsController, ProfessorsOtherController],
  providers: [ProfessorsService],
})
export class ProfessorsModule {}
