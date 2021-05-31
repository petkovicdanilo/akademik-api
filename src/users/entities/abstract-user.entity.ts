import { PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { ProfileType } from "../profiles/types";

export class AbstractUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ProfileType,
  })
  type: ProfileType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({
    type: "date",
  })
  dateOfBirth: Date;
}
