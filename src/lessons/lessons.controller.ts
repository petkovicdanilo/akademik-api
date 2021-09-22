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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { LessonDto } from "./dto/lesson.dto";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";

@Controller("lessons")
@ApiTags("lessons")
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async create(
    @Body() createLessonDto: CreateLessonDto,
    @Req() request: any,
  ): Promise<LessonDto> {
    const ability = this.caslAbilityFactory.createForLesson(request.user);
    if (ability.cannot(Action.Create, "all")) {
      throw new AccessForbiddenException("Can't create lesson");
    }

    const lesson = await this.lessonsService.create(createLessonDto);

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

  @Get(":lessonId/room-token")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async getRoomToken(
    @Param("lessonId") lessonId: number,
    @Req() request: any,
  ): Promise<string> {
    return this.lessonsService.getRoomToken(lessonId, request.user.id);
  }
}
