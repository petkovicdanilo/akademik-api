import { Department } from "src/departments/entities/department.entity";
import { Lesson } from "src/lessons/entities/lesson.entity";
import { Professor } from "src/users/professors/entities/professor.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Semester, SubjectYear } from "../types";
import { EnrolledSubject } from "./enrolled-subject.entity";

@Entity()
@Index(["name", "departmentId"], { unique: true })
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  semester: Semester;

  @Column()
  year: SubjectYear;

  @Column()
  compulsory: boolean;

  @Column()
  ectsPoints: number;

  @Column("int", { nullable: true })
  professorId: number;

  @ManyToOne(() => Professor, (professor) => professor.subjects, {
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "professorId" })
  professor: Promise<Professor>;

  // @ManyToOne(() => Professor, (professor) => professor.assistedSubjects)
  // assistant: Professor;

  @Column("int", { nullable: false })
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.subjects)
  @JoinColumn({ name: "departmentId" })
  department: Promise<Department>;

  @OneToMany(
    () => EnrolledSubject,
    (enrolledSubject) => enrolledSubject.subject,
    {
      cascade: true,
    },
  )
  enrolledStudents: Promise<EnrolledSubject[]>;

  @OneToMany(() => Lesson, (lesson) => lesson.subject, {
    cascade: true,
  })
  lessons: Lesson[];
}
