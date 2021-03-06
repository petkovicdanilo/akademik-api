import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "src/casl/casl.module";
import { UtilModule } from "src/util/util.module";
import { ProfilesModule } from "../profiles/profiles.module";
import { AdminsController } from "./admins.controller";
import { AdminsService } from "./admins.service";
import { Admin } from "./entities/admin.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    ProfilesModule,
    UtilModule,
    CaslModule,
  ],
  providers: [AdminsService],
  controllers: [AdminsController],
  exports: [AdminsService],
})
export class AdminsModule {}
