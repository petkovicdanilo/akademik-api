import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsDateString,
  IsEmail,
  IsNotEmpty,
} from "class-validator";

export abstract class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsAlphanumeric()
  firstName: string;

  @ApiProperty({ required: false })
  @IsAlphanumeric()
  lastName: string;

  @ApiProperty({ required: false })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: false,
    type: () => String,
    format: "date",
  })
  @IsDateString()
  dateOfBirth: Date;
}
