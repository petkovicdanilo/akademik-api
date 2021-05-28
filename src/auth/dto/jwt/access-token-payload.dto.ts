import { ProfileType } from "src/users/profiles/types";
import { JwtPayload } from "./jwt-payload.dto";

export class AccessTokenPayload extends JwtPayload {
  type: "accessToken";

  constructor(id: number, type: ProfileType) {
    super(id, type);
    this.type = "accessToken";
  }
}
