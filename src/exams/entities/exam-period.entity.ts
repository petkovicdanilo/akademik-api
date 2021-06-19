import { SchoolYear } from "src/school-years/entities/school-year.entity";
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
@Index(["name", "schoolYear"], { unique: true })
export class ExamPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SchoolYear, {
    eager: true,
  })
  schoolYear: SchoolYear;

  @Column()
  name: string;

  @Column({
    type: "date",
  })
  startTime: Date;

  @Column({
    type: "date",
  })
  endTime: Date;

  @Column({
    type: "date",
  })
  registrationStartTime: Date;

  @Column({
    type: "date",
  })
  registrationEndTime: Date;
}
