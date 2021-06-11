import { Department } from "src/departments/entities/department.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import { Profile } from "src/users/profiles/entities/profile.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { ProfessorTitle } from "../types";

@Entity()
export class Professor {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  profile: Profile;

  @ManyToOne(() => Department, (department) => department.professors, {
    eager: true,
    cascade: true,
  })
  department: Department;

  @OneToMany(() => Subject, (subject) => subject.professor, {
    cascade: true,
  })
  subjects: Subject[];

  // @OneToMany(() => Subject, (subject) => subject.assistant)
  // assistedSubjects: Subject[];

  @Column({
    type: "enum",
    enum: ProfessorTitle,
  })
  title: ProfessorTitle;
}
