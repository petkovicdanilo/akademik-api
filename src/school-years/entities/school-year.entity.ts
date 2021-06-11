import { Column, Entity, PrimaryColumn } from "typeorm";

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
}
