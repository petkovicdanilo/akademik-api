import { ProfileType } from "src/users/profiles/types";
import { JwtPayload } from "./jwt-payload.dto";

export class AccessTokenPayload extends JwtPayload {
  type: "accessToken";
  limitedAccess?: boolean;

  constructor(id: number, type: ProfileType, limitedAccess?: boolean) {
    super(id, type);
    this.limitedAccess = limitedAccess;
    this.type = "accessToken";
  }
}
