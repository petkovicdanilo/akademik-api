import { User } from "src/users/entities/user.entity";
import { Entity } from "typeorm";
import { ProfessorDto } from "../dto/professor.dto";

@Entity()
export class Professor extends User {
  toDto(): ProfessorDto {
    return {
      dateOfBirth: this.dateOfBirth,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}
