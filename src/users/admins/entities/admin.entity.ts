import { Profile } from "src/users/profiles/entities/profile.entity";
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Admin {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  profile: Profile;
}
