import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class RefreshToken {
  @PrimaryColumn()
  token: string;

  @Column()
  expirationTime: Date;
}
