import { ApiProperty } from "@nestjs/swagger";
import { ProfileType } from "../types";
import { AbstractUserDto } from "../../dto/abstract-user.dto";

export class ProfileDto extends AbstractUserDto {
  @ApiProperty({
    enum: ["student", "professor"],
    type: "string",
  })
  type: ProfileType;
}
