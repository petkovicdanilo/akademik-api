import { User } from "src/users/entities/user.entity";
import { Entity } from "typeorm";

@Entity()
export class Professor extends User {}
