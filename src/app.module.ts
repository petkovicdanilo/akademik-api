import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ProfessorsModule } from "./users/professors/professors.module";
import { MailModule } from "./mail/mail.module";
import { UtilModule } from "./util/util.module";
import { AdminsModule } from "./users/admins/admins.module";
import { DepartmentsModule } from "./departments/departments.module";
import { DbModule } from "./db/db.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SubjectsModule } from "./subjects/subjects.module";
import { SchoolYearsModule } from "./school-years/school-years.module";
import { ExamsModule } from "./exams/exams.module";
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    DbModule,
    UsersModule,
    AuthModule,
    ProfessorsModule,
    MailModule,
    UtilModule,
    AdminsModule,
    DepartmentsModule,
    ScheduleModule.forRoot(),
    SubjectsModule,
    SchoolYearsModule,
    ExamsModule,
    CaslModule,
  ],
})
export class AppModule {}
