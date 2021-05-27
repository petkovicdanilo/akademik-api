import { Column, Index, PrimaryGeneratedColumn } from "typeorm";

export abstract class User {
  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    salt: string,
    dateOfBirth: Date,
    passwordResetToken?: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.salt = salt;
    this.dateOfBirth = dateOfBirth;
    this.passwordResetToken = passwordResetToken;
  }

  @PrimaryGeneratedColumn()
  id: number;

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
