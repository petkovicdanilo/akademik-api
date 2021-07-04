import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { CurrentUser } from "src/common/types";
import { Department } from "src/departments/entities/department.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { ProfileType } from "src/users/profiles/types";
import { Student } from "src/users/students/entities/student.entity";

export enum Action {
  Manage = "manage",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}

type UserSubjects = InferSubjects<typeof Profile | typeof CurrentUser> | "all";
export type UserAbility = Ability<[Action, UserSubjects]>;

type UnverifiedUserSubjects = "all";
export type UnverifiedUserAbility = Ability<[Action, UnverifiedUserSubjects]>;

type AdminSubjects = "all";
export type AdminAbility = Ability<[Action, AdminSubjects]>;

type StudentSubjects = InferSubjects<typeof Profile> | "all";
export type StudentAbility = Ability<[Action, StudentSubjects]>;

type ProfessorSubjects = InferSubjects<typeof Profile> | "all";
export type ProfessorAbility = Ability<[Action, ProfessorSubjects]>;

type DepartmentSubjects =
  | InferSubjects<typeof Department | typeof CurrentUser>
  | "all";
export type DepartmentAbility = Ability<[Action, DepartmentSubjects]>;

type SubjectSubjects =
  | InferSubjects<typeof Subject | typeof CurrentUser | typeof Profile>
  | "all";
export type SubjectAbility = Ability<[Action, SubjectSubjects]>;

type SchoolYearSubjects = "all";
export type SchoolYearAbility = Ability<[Action, SchoolYearSubjects]>;

type ExamPeriodSubjects = "all";
export type ExamPeriodAbility = Ability<[Action, ExamPeriodSubjects]>;

type GradeSubjects = InferSubjects<typeof Subject> | "all";
export type GradeAbility = Ability<[Action, GradeSubjects]>;

type ExamRegistrationSubjects = InferSubjects<typeof Student> | "all";
export type ExamRegistrationAbility = Ability<
  [Action, ExamRegistrationSubjects]
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<Ability<[Action, UserSubjects]>>(
      Ability as AbilityClass<UserAbility>,
    );

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<UserSubjects>,
    });
  }

  createForUnverifiedUser(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, UnverifiedUserSubjects]>
    >(Ability as AbilityClass<UnverifiedUserAbility>);

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    return build();
  }

  createForAdmin(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<Ability<[Action, AdminSubjects]>>(
      Ability as AbilityClass<AdminAbility>,
    );

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    return build();
  }

  createForStudent(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, StudentSubjects]>
    >(Ability as AbilityClass<StudentAbility>);

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    if (user.type == ProfileType.Student) {
      can(Action.Manage, Profile, { id: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<StudentSubjects>,
    });
  }

  createForProfessor(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, ProfessorSubjects]>
    >(Ability as AbilityClass<ProfessorAbility>);

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    if (user.type == ProfileType.Professor) {
      can(Action.Manage, Profile, { id: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<ProfessorSubjects>,
    });
  }

  createForDepartment(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, DepartmentSubjects]>
    >(Ability as AbilityClass<DepartmentAbility>);

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<DepartmentSubjects>,
    });
  }

  createForSubject(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, SubjectSubjects]>
    >(Ability as AbilityClass<SubjectAbility>);

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    // enroll in subjects
    if (user.type == ProfileType.Student) {
      can(Action.Read, Profile, { id: user.id });
      can(Action.Create, Profile, { id: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<SubjectSubjects>,
    });
  }

  createForSchoolYear(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, SchoolYearSubjects]>
    >(Ability as AbilityClass<SchoolYearAbility>);

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    return build();
  }

  createForExamPeriod(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, ExamPeriodSubjects]>
    >(Ability as AbilityClass<ExamPeriodAbility>);

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    return build();
  }

  createForGrade(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<Ability<[Action, GradeSubjects]>>(
      Ability as AbilityClass<GradeAbility>,
    );

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    if (user.type == ProfileType.Professor) {
      can(Action.Manage, Subject, { professorId: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<GradeSubjects>,
    });
  }

  createForExamRegistration(user: CurrentUser) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, ExamRegistrationSubjects]>
    >(Ability as AbilityClass<ExamRegistrationAbility>);

    if (user.type == ProfileType.Admin) {
      can(Action.Manage, "all");
    }

    if (user.type == ProfileType.Student) {
      can(Action.Manage, Student, { id: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<ExamRegistrationSubjects>,
    });
  }
}
