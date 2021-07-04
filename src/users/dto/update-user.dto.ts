import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

export abstract class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsAlphanumeric()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsAlphanumeric()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @ApiProperty({
    required: false,
    type: () => String,
    format: "date",
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;
}
