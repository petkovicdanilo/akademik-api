import { UserDto } from "./user.dto";

export class UserWithTypeDto extends UserDto {
  type: "student" | "professor";
}
