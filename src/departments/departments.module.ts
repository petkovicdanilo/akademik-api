import { Module } from "@nestjs/common";
import { DepartmentsService } from "./departments.service";
import { DepartmentsController } from "./departments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department } from "./entities/department.entity";
import { UtilModule } from "src/util/util.module";
import { CaslModule } from "src/casl/casl.module";

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  imports: [TypeOrmModule.forFeature([Department]), UtilModule, CaslModule],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
