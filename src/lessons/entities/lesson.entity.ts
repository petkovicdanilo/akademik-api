import { SchoolYear } from "src/school-years/entities/school-year.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "text", nullable: true })
  webSightRoomId?: string;

  @Column({ type: "text", nullable: false })
  name: string;

  @Column({ type: "timestamp", nullable: true })
  timeRoomOpened?: Timestamp;

  @Column({ type: "timestamp", nullable: true })
  timeRoomClosed?: Timestamp;

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
