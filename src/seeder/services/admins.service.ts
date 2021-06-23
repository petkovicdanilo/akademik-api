import { Injectable } from "@nestjs/common";
import * as faker from "faker";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AdminsService } from "src/users/admins/admins.service";

@Injectable()
export class AdminsSeederService {
  constructor(private readonly adminsService: AdminsService) {}

  async seed() {
    try {
      await this.adminsService.create({
        email: "admin@akademik.com",
        firstName: "admin",
        lastName: "admin",
        dateOfBirth: new Date(),
        password: "admin",
      });

      for (let i = 0; i < 5; i++) {
        const admin = this.generateAdminDto();
        await this.adminsService.create(admin);
      }
    } catch (e) {
      console.log(e);
    }
  }

  private generateAdminDto(): CreateUserDto {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      firstName,
      lastName,
      dateOfBirth: faker.date.between("1945-01-01", "1990-12-31"),
      email: faker.internet.email(firstName, lastName).toLowerCase(),
      password: "password",
    };
  }
}
