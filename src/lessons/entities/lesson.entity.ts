import { SchoolYear } from "src/school-years/entities/school-year.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  webSightRoomId?: string;

  @Column({ type: "text", nullable: false })
  name: string;

  @Column({ type: "timestamptz", nullable: true })
  timeRoomOpened?: Date;

  @Column({ type: "timestamptz", nullable: true })
  timeRoomClosed?: Date;

  @Column({ type: "int", nullable: false })
  professorId: number;

  @Column()
  subjectId: number;

  @ManyToOne(() => Subject, { onDelete: "CASCADE" })
  @JoinColumn({ name: "subjectId" })
  subject: Subject;

  @Column()
  schoolYearId: string;

  @ManyToOne(() => SchoolYear, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "schoolYearId" })
  schoolYear: SchoolYear;
}
