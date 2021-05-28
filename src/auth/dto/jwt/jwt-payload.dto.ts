import { ProfileType } from "src/users/profiles/types";

export abstract class JwtPayload {
  user: {
    id: number;
    type: ProfileType;
  };

  constructor(id: number, type: ProfileType) {
    this.user = {
      id,
      type,
    };
  }
}
