import { JwtPayload } from "./jwt-payload.dto";

export class AccessTokenPayload extends JwtPayload {
  type: "accessToken";

  constructor(id: number, type: "student" | "professor") {
    super(id, type);
    this.type = "accessToken";
  }
}
