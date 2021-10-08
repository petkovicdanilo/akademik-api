import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { LessonDto } from "./dto/lesson.dto";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";
import { SubjectsService } from "src/subjects/subjects.service";
import { ProfilesService } from "src/users/profiles/profiles.service";
import { StudentsService } from "src/users/students/students.service";

@Controller("lessons")
@ApiTags("lessons")
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly subjectsService: SubjectsService,
    private readonly profilesService: ProfilesService,
    private readonly studentsService: StudentsService,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async create(
    @Body() createLessonDto: CreateLessonDto,
    @Req() request: any,
  ): Promise<LessonDto> {
    const subject = await this.subjectsService.findOne(
      createLessonDto.subjectId,
    );

    const ability = this.caslAbilityFactory.createForLesson(request.user);
    if (ability.cannot(Action.Create, subject)) {
      throw new AccessForbiddenException(
        "Can't create lesson for this subject",
      );
    }

    const lesson = await this.lessonsService.create(createLessonDto);

    return this.lessonsService.mapToDto(lesson);
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    type: LessonDto,
  })
  async findOne(@Param("id") id: number): Promise<LessonDto> {
    const lesson = await this.lessonsService.findOne(+id);

    return this.lessonsService.mapToDto(lesson);
  }

  @Get(":subjectId")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async findBySubject(
    @Param("subjectId") subjectId: number,
  ): Promise<LessonDto[]> {
    const lessons = await this.lessonsService.findBySubject(subjectId);

    return lessons.map((subject) => this.lessonsService.mapToDto(subject));
  }

  @Post("/start-conference")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async startConference(
    @Body() { lessonId }: { lessonId: number },
    @Req() request: Request & { user: { id: number } },
  ): Promise<void> {
    const lesson = await this.lessonsService.findOne(lessonId);

    const user = await this.profilesService.findOne(request.user.id);

    const students = await this.studentsService.getSubjectStudents(
      lesson.subjectId,
      lesson.schoolYearId,
    );

    const profiles = students.map((student) => student.profile);

    await this.lessonsService.startConference(
      user.webSightApiId,
      lesson.webSightRoomId,
      `${user.firstName} ${user.lastName}`,
      lesson,
      profiles,
    );
  }

  @Post("/:lessonId/generate-web-sight-token")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async generateWebSightToken(
    @Param("lessonId") lessonId: number,
    @Req() request: any,
  ): Promise<string> {
    return this.lessonsService.generateWebSightToken(request.user.id, lessonId);
  }
}
