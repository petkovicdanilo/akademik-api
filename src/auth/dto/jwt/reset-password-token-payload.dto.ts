import { JwtPayload } from "./jwt-payload.dto";

export class ResetPasswordTokenPayload extends JwtPayload {
  type: "resetPasswordToken";

  constructor(id: number, type: "student" | "professor") {
    super(id, type);
    this.type = "resetPasswordToken";
  }
}
