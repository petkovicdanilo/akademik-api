import { Department } from "src/departments/entities/department.entity";
import { Profile } from "src/users/profiles/entities/profile.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Column({
    type: "enum",
    enum: ProfessorTitle,
  })
  title: ProfessorTitle;
}
