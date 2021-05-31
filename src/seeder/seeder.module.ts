import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbModule } from "src/db/db.module";
import { DepartmentsModule } from "src/departments/departments.module";
import { Admin } from "src/users/admins/entities/admin.entity";
import { UsersModule } from "src/users/users.module";
import { AdminsSeederService } from "./services/admins.service";
import { Seeder } from "./seeder";
import { DepartmentsSeederService } from "./services/department.service";
import { ProfessorsSeederService } from "./services/professors.service";
import { StudentsSeederService } from "./services/students.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    DbModule,
    UsersModule,
    DepartmentsModule,
    TypeOrmModule.forFeature([Admin]),
  ],
  providers: [
    Seeder,
    AdminsSeederService,
    StudentsSeederService,
    ProfessorsSeederService,
    DepartmentsSeederService,
  ],
})
export class SeederModule {}
