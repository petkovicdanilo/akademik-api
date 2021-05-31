import { AbstractUser } from "src/users/entities/abstract-user.entity";
import { CreateDateColumn, Entity } from "typeorm";

@Entity()
export class UnverifiedProfile extends AbstractUser {
  @CreateDateColumn({
    type: "date",
  })
  createdAt: Date;
}
