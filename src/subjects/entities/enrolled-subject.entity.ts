import { SchoolYear } from "src/school-years/entities/school-year.entity";
import { Student } from "src/users/students/entities/student.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Grade } from "../types";
import { Subject } from "./subject.entity";

@Entity()
@Index(["studentId", "subjectId", "schoolYearId"], { unique: true })
export class EnrolledSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @ManyToOne(() => Student, (student) => student.enrolledSubjects, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "studentId" })
  student: Student;

  @Column()
  subjectId: number;

  @ManyToOne(() => Subject, (subject) => subject.enrolledStudents, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "subjectId" })
  subject: Subject;

  @Column()
  schoolYearId: string;

  @ManyToOne(() => SchoolYear)
  @JoinColumn({ name: "schoolYearId" })
  schoolYear: SchoolYear;

  @Column({ nullable: true })
  grade?: Grade;
}
