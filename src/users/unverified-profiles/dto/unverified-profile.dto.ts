import { ApiProperty } from "@nestjs/swagger";
import { ProfileDto } from "src/users/profiles/dto/profile.dto";

export class UnverifiedProfileDto extends ProfileDto {
  @ApiProperty({
    type: () => String,
    format: "date",
  })
  createdAt: Date;
}
