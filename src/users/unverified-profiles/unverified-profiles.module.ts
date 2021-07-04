import { Module } from "@nestjs/common";
import { UnverifiedProfilesService } from "./unverified-profiles.service";
import { UnverifiedProfilesController } from "./unverified-profiles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UnverifiedProfile } from "./entities/unverified-profile.entity";
import { UtilModule } from "src/util/util.module";
import { Profile } from "../profiles/entities/profile.entity";
import { ProfilesModule } from "../profiles/profiles.module";
import { MailModule } from "src/mail/mail.module";
import { CaslModule } from "src/casl/casl.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UnverifiedProfile]),
    TypeOrmModule.forFeature([Profile]),
    UtilModule,
    ProfilesModule,
    MailModule,
    CaslModule,
  ],
  controllers: [UnverifiedProfilesController],
  providers: [UnverifiedProfilesService],
  exports: [UnverifiedProfilesService],
})
export class UnverifiedProfilesModule {}
