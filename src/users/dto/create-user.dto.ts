import { ApiProperty, ApiHideProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsDateString,
  IsEmail,
  IsNotEmpty,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsAlphanumeric()
  firstName: string;

  @ApiProperty()
  @IsAlphanumeric()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiHideProperty()
  salt?: string;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  @IsDateString()
  dateOfBirth: Date;
}
