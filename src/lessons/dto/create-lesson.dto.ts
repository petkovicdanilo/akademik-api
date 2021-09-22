import { IsAlphanumeric, IsNumber } from "class-validator";

export class CreateLessonDto {
  @IsNumber()
  professorId: number;

  @IsNumber()
  subjectId: number;

  @IsAlphanumeric()
  name: string;
}
