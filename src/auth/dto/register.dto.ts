import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { ProfileType } from "src/users/profiles/types";

export class RegisterDto extends CreateUserDto {
  @ApiProperty({ enum: ["student", "professor"] })
  type: ProfileType;
}
