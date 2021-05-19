import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Reset password",
      template: "./reset-password",
      context: {
        name: `Pera Peric`,
      },
    });
  }
}
