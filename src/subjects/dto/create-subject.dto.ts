export class CreateSubjectDto {
  name: string;
  semester: 1 | 2;
  compulsory: boolean;
  ectsPoints: number;
  professorId: number;
  // assistantId: number;
  departmentId: number;
}
