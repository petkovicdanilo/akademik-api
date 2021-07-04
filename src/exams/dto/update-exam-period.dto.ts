import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Matches, IsDateString } from "class-validator";

export class UpdateExamPeriodDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}/, {
    message: "schoolYearId must be in format 'dddd-dd'",
  })
  @ApiProperty({
    required: false,
  })
  schoolYearId?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  name?: string;

  @ApiProperty({
    type: () => String,
    format: "date",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  registrationStartDate?: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  registrationEndDate?: Date;
}
