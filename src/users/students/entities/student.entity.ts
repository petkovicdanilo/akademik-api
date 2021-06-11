import { Department } from "src/departments/entities/department.entity";
import { EnrolledSubject } from "src/subjects/entities/enrolled-subject.entity";
import { Profile } from "src/users/profiles/entities/profile.entity";
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Student {
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

  @ManyToOne(() => Department, (department) => department.students, {
    eager: true,
  })
  department: Department;

  @OneToMany(
    () => EnrolledSubject,
    (enrolledSubject) => enrolledSubject.student,
  )
  enrolledSubjects: EnrolledSubject[];
}
