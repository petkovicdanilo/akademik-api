import { ApiProperty } from "@nestjs/swagger";

export class ExamPeriodDto {
  id: number;

  schoolYearId: string;

  name: string;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  startTime: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  endTime: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  registrationStartTime: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  registrationEndTime: Date;
}
