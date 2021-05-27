export abstract class JwtPayload {
  user: {
    id: number;
    type: "student" | "professor";
  };

  constructor(id: number, type: "student" | "professor") {
    this.user = {
      id,
      type,
    };
  }
}
