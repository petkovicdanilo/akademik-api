import { Module } from "@nestjs/common";
import { UnverifiedProfilesService } from "./unverified-profiles.service";
import { UnverifiedProfilesController } from "./unverified-profiles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UnverifiedProfile } from "./entities/unverified-profile.entity";
import { UtilModule } from "src/util/util.module";
import { Profile } from "../profiles/entities/profile.entity";
import { ProfilesModule } from "../profiles/profiles.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UnverifiedProfile]),
    TypeOrmModule.forFeature([Profile]),
    UtilModule,
    ProfilesModule,
  ],
  controllers: [UnverifiedProfilesController],
  providers: [UnverifiedProfilesService],
  exports: [UnverifiedProfilesService],
})
export class UnverifiedProfilesModule {}
