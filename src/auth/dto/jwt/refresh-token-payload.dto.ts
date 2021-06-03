import { ProfileType } from "src/users/profiles/types";
import { JwtPayload } from "./jwt-payload.dto";

export class RefreshTokenPayload extends JwtPayload {
  type: "refreshToken";

  constructor(id: number, type: ProfileType) {
    super(id, type);
    this.type = "refreshToken";
  }
}
