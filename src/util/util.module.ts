import { Module } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { UtilService } from "./util.service";

@Module({
  providers: [UtilService, TokensService],
  exports: [UtilService, TokensService],
})
export class UtilModule {}
