import { Department } from "src/departments/entities/department.entity";
import { Professor } from "src/users/professors/entities/professor.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EnrolledSubject } from "./enrolled-subject.entity";

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  semester: 1 | 2;

  @Column()
  compulsory: boolean;

  @Column()
  ectsPoints: number;

  @Column("int", { nullable: false })
  professorId: number;

  @ManyToOne(() => Professor, (professor) => professor.subjects, {
    eager: true,
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
  )
  enrolledStudents: Promise<EnrolledSubject[]>;
}
