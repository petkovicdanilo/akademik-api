import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { UtilService } from "src/util/util.service";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly utilService: UtilService,
  ) {}

  async sendResetPasswordEmail(profile: Profile, token: string) {
    await this.mailerService.sendMail({
      to: `${profile.firstName} ${profile.lastName} <${profile.email}>`,
      subject: "Reset password",
      template: "./reset-password",
      context: {
        profile,
        token,
        url: this.utilService.getFrontendResetPasswordUrl(),
      },
    });
  }
}
