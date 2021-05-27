import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { UtilService } from "src/util/util.service";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly utilService: UtilService,
  ) {}

  async sendResetPasswordEmail(user: User, token: string) {
    await this.mailerService.sendMail({
      to: `${user.firstName} ${user.lastName} <${user.email}>`,
      subject: "Reset password",
      template: "./reset-password",
      context: {
        user,
        token,
        url: this.utilService.getFrontendResetPassewordUrl(),
      },
    });
  }
}
