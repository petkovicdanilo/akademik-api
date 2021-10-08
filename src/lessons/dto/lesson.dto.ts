import { ApiProperty } from "@nestjs/swagger";

export class LessonDto {
  id: number;
  name: string;
  webSightRoom: string;
  @ApiProperty({
    type: () => String,
    format: "date-time",
  })
  timeRoomOpened: Date;
  @ApiProperty({
    type: () => String,
    format: "date-time",
  })
  timeRoomClosed: Date;
  professorId: number;
  subjectId: number;
  schoolYearId: string;
}
