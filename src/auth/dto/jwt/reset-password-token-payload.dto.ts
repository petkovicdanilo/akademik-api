import { UserType } from "src/users/types";
import { JwtPayload } from "./jwt-payload.dto";

export class ResetPasswordTokenPayload extends JwtPayload {
  type: "resetPasswordToken";

  constructor(id: number, type: UserType) {
    super(id, type);
    this.type = "resetPasswordToken";
  }
}
