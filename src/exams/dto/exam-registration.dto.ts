import { StudentDto } from "src/users/students/dto/student.dto";

export class ExamRegistrationDto {
  student: StudentDto;
  subjectId: number;
  examPeriodId: number;
  createdAt: Date;
  grade?: number;
}
