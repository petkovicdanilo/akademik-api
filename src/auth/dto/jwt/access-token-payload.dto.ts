import { UserType } from "src/users/types";
import { JwtPayload } from "./jwt-payload.dto";

export class AccessTokenPayload extends JwtPayload {
  type: "accessToken";

  constructor(id: number, type: UserType) {
    super(id, type);
    this.type = "accessToken";
  }
}
