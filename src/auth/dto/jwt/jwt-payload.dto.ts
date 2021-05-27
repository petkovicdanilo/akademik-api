import { UserType } from "src/users/types";

export abstract class JwtPayload {
  user: {
    id: number;
    type: UserType;
  };

  constructor(id: number, type: UserType) {
    this.user = {
      id,
      type,
    };
  }
}
