import { UserWithTypeDto } from "../dto/user-with-type.dto";
import { UserType } from "../types";
import { User } from "./user.entity";

export class UserWithType extends User {
  type: UserType;

  constructor(type: UserType, user: User) {
    super(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.salt,
      user.dateOfBirth,
      user.passwordResetToken,
    );

    this.type = type;
  }

  toDto(): UserWithTypeDto {
    return {
      type: this.type,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      email: this.email,
    };
  }
}
