import { Module } from "@nestjs/common";
import { ProfessorsService } from "./professors.service";
import { ProfessorsController } from "./professors.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Professor } from "./entities/professor.entity";
import { UtilModule } from "src/util/util.module";
import { ProfilesModule } from "../profiles/profiles.module";
import { Profile } from "../profiles/entities/profile.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Professor]),
    TypeOrmModule.forFeature([Profile]),
    UtilModule,
    ProfilesModule,
  ],
  exports: [ProfessorsService],
  controllers: [ProfessorsController],
  providers: [ProfessorsService],
})
export class ProfessorsModule {}
