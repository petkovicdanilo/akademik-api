import { ProfileType } from "src/users/profiles/types";
import { JwtPayload } from "./jwt-payload.dto";

export class ResetPasswordTokenPayload extends JwtPayload {
  type: "resetPasswordToken";

  constructor(id: number, type: ProfileType) {
    super(id, type);
    this.type = "resetPasswordToken";
  }
}
