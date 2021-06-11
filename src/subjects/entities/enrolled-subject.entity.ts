import { SchoolYear } from "src/school-years/entities/school-year.entity";
import { Student } from "src/users/students/entities/student.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Subject } from "./subject.entity";

@Entity()
export class EnrolledSubject {
  @ManyToOne(() => Student, (student) => student.enrolledSubjects, {
    primary: true,
  })
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Subject, (subject) => subject.enrolledStudents, {
    primary: true,
  })
  @JoinColumn()
  subject: Subject;

  @ManyToOne(() => SchoolYear, {
    primary: true,
  })
  @JoinColumn({
    name: "schoolYear",
  })
  schoolYear: SchoolYear;

  @Column({ nullable: true })
  grade?: number;
}
