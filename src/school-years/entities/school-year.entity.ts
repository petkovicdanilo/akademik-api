import { Lesson } from "src/lessons/entities/lesson.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class SchoolYear {
  @PrimaryColumn()
  id: string;

  @Column({
    type: "date",
  })
  startDate: Date;

  @Column({
    type: "date",
  })
  endDate: Date;

  @Column()
  current: boolean;

  @OneToMany(() => Lesson, (lesson) => lesson.schoolYear, {
    cascade: true,
  })
  lessons?: Lesson[];
}
