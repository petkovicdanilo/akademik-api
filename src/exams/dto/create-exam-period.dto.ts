import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, Matches } from "class-validator";

export class CreateExamPeriodDto {
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}/, {
    message: "schoolYearId must be in format 'dddd-dd'",
  })
  schoolYearId: string;

  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  @IsDateString()
  registrationStartDate: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  @IsDateString()
  registrationEndDate: Date;
}
