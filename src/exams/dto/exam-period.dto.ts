import { ApiProperty } from "@nestjs/swagger";

export class ExamPeriodDto {
  id: number;

  schoolYearId: string;

  name: string;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  startDate: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  endDate: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  registrationStartDate: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  registrationEndDate: Date;
}
