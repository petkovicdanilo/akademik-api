import { AbstractUser } from "src/users/entities/abstract-user.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Profile extends AbstractUser {
  @Column({
    nullable: true,
    default: null,
  })
  passwordResetToken?: string;

  @Column({
    default: true,
  })
  hasAdditionalInfo: boolean;
}
