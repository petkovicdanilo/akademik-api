import { Module } from "@nestjs/common";
import { ProfessorsService } from "./professors.service";
import { ProfessorsController } from "./professors.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Professor } from "./entities/professor.entity";
import { UtilModule } from "src/util/util.module";

@Module({
  imports: [TypeOrmModule.forFeature([Professor]), UtilModule],
  exports: [ProfessorsService],
  controllers: [ProfessorsController],
  providers: [ProfessorsService],
})
export class ProfessorsModule {}
