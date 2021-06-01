import { Professor } from "src/users/professors/entities/professor.entity";
import { Student } from "src/users/students/entities/student.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Student, (student) => student.department)
  students: Student[];

  @OneToMany(() => Professor, (professor) => professor.department)
  professors: Professor[];
}
