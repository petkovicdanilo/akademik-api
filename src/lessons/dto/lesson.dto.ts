import { ApiProperty } from "@nestjs/swagger";
import { Timestamp } from "typeorm";

export class LessonDto {
  id: string;
  name: string;
  @ApiProperty({
    type: () => String,
    format: "date-time",
  })
  timeRoomOpened: Timestamp;
  @ApiProperty({
    type: () => String,
    format: "date-time",
  })
  timeRoomClosed: Timestamp;
  professorId: number;
  subjectId: number;
  schoolYearId: string;
}
