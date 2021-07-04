import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from "class-validator";
import { Semester, SubjectYear } from "../types";

export class UpdateSubjectDto {
  @IsAlphanumeric()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({
    enum: [1, 2],
  })
  @IsNumber()
  @Min(1)
  @Max(2)
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  semester?: Semester;

  @ApiProperty({
    enum: [1, 2, 3, 4],
  })
  @IsNumber()
  @Min(1)
  @Max(4)
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  year?: SubjectYear;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  compulsory?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  ectsPoints?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  professorId?: number;

  //   @IsNumber()
  //   @IsOptional()
  //   @ApiProperty({
  //     required: false,
  //   })
  //   assistantId?: number;
}
