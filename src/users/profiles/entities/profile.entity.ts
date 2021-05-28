import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { ProfileType } from "../types";

@Entity()
export class Profile {
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

  @Column()
  dateOfBirth: Date;

  @Column({
    nullable: true,
    default: null,
  })
  passwordResetToken?: string;
}
