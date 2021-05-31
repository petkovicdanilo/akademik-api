import { ApiProperty } from "@nestjs/swagger";
import { ProfileDto } from "src/users/profiles/dto/profile.dto";
import { PaginatedDto } from "./pagination";

export class ProfilesListDto {
  @ApiProperty()
  items: ProfileDto[];
}

export class ProfilesPaginatedDto extends PaginatedDto(ProfilesListDto) {}
