import { User } from "src/users/entities/user.entity";
import { Entity } from "typeorm";
import { StudentDto } from "../dto/student.dto";

@Entity()
export class Student extends User {
  toDto(): StudentDto {
    return {
      id: this.id,
      dateOfBirth: this.dateOfBirth,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}
