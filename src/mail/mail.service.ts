import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Lesson } from "src/lessons/entities/lesson.entity";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { UnverifiedProfile } from "src/users/unverified-profiles/entities/unverified-profile.entity";
import { UtilService } from "src/util/util.service";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly utilService: UtilService,
  ) {}

  async sendResetPasswordEmail(profile: Profile, token: string): Promise<void> {
    const url = encodeURI(
      this.utilService.getFrontendResetPasswordUrl() +
        `?token=${token}&name=${profile.firstName} ${profile.lastName}`,
    );

    await this.mailerService.sendMail({
      to: this.emailFromProfile(profile),
      subject: "Reset password",
      template: "./reset-password",
      context: {
        profile,
        token,
        url,
      },
    });
  }

  async sendVerifiedEmail(profile: Profile): Promise<void> {
    const url = this.utilService.getFrontendUrl();

    await this.mailerService.sendMail({
      to: this.emailFromProfile(profile),
      subject: "Your account has been verified",
      template: "./user-verified",
      context: {
        profile,
        url,
      },
    });
  }

  async sendRejectedEmail(profile: UnverifiedProfile) {
    const url = this.utilService.getFrontendUrl();

    await this.mailerService.sendMail({
      to: this.emailFromUnverifiedProfile(profile),
      subject: "Your account registration was rejected",
      template: "./user-rejected",
      context: {
        profile,
        url,
      },
    });
  }

  async sendConferenceStartedEmail(
    professorName: string,
    lesson: Lesson,
    profiles: Profile[],
  ): Promise<void> {
    const url =
      this.utilService.getFrontendUrl() +
      `/home/subjects/${lesson.subjectId}/lessons/${lesson.id}`;

    const profilesToReceive = profiles.map((profile) =>
      this.emailFromProfile(profile),
    );

    await this.mailerService.sendMail({
      to: profilesToReceive,
      subject: `${professorName} has started a new lesson`,
      template: "./conference-started",
      context: {
        professorName,
        subjectName: (await lesson.subject).name,
        lessonName: lesson.name,
        url,
      },
    });
  }

  private emailFromProfile(profile: Profile) {
    return `${profile.firstName} ${profile.lastName} <${profile.email}>`;
  }

  private emailFromUnverifiedProfile(profile: UnverifiedProfile) {
    return `${profile.firstName} ${profile.lastName} <${profile.email}>`;
  }
}
