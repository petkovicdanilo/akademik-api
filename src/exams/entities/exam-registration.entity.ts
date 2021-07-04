import { Subject } from "src/subjects/entities/subject.entity";
import { Grade } from "src/subjects/types";
import { Student } from "src/users/students/entities/student.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExamPeriod } from "./exam-period.entity";

@Entity()
@Index(["studentId", "subjectId", "examPeriodId"], { unique: true })
export class ExamRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @ManyToOne(() => Student, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "studentId" })
  student: Student;

  @Column()
  subjectId: number;

  @ManyToOne(() => Subject, { onDelete: "CASCADE" })
  @JoinColumn({ name: "subjectId" })
  subject: Subject;

  @Column()
  examPeriodId: number;

  @ManyToOne(() => ExamPeriod)
  @JoinColumn({ name: "examPeriodId" })
  examPeriod: ExamPeriod;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  grade?: Grade;
}
