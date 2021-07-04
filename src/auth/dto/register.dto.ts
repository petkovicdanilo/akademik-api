import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { ProfileType } from "src/users/profiles/types";

export class RegisterDto extends CreateUserDto {
  @ApiProperty({ enum: ["student", "professor"] })
  @IsEnum(ProfileType)
  type: ProfileType;
}
