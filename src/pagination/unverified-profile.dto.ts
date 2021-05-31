import { ApiProperty } from "@nestjs/swagger";
import { UnverifiedProfileDto } from "src/users/unverified-profiles/dto/unverified-profile.dto";
import { PaginatedDto } from "./pagination";

export class UnverifiedProfilesListDto {
  @ApiProperty()
  items: UnverifiedProfileDto[];
}

export class UnverifiedProfilesPaginatedDto extends PaginatedDto(
  UnverifiedProfilesListDto,
) {}
