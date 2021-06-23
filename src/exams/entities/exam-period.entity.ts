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
    nullable: false,
  })
  schoolYear: SchoolYear;

  @Column()
  name: string;

  @Column({
    type: "date",
  })
  startDate: Date;

  @Column({
    type: "date",
  })
  endDate: Date;

  @Column({
    type: "date",
  })
  registrationStartDate: Date;

  @Column({
    type: "date",
  })
  registrationEndDate: Date;
}
