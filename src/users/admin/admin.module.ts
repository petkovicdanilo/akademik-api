import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UtilModule } from "src/util/util.module";
import { ProfilesModule } from "../profiles/profiles.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { Admin } from "./entity/admin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), ProfilesModule, UtilModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
