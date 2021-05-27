import { UserType } from "../types";
import { UserDto } from "./user.dto";

export class UserWithTypeDto extends UserDto {
  type: UserType;
}
