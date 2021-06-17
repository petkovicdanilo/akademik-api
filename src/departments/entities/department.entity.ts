import { Subject } from "src/subjects/entities/subject.entity";
import { Professor } from "src/users/professors/entities/professor.entity";
import { Student } from "src/users/students/entities/student.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(() => Student, (student) => student.department)
  students: Student[];

  @OneToMany(() => Professor, (professor) => professor.department)
  professors: Professor[];

  @OneToMany(() => Subject, (subject) => subject.department)
  subjects: Subject[];
}
