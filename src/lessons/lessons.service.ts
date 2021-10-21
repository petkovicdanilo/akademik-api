import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { Lesson } from "./entities/lesson.entity";
import { SubjectsService } from "src/subjects/subjects.service";
import { InvalidDataException } from "src/common/exceptions/invalid-data.exception";
import { WebSightRoom } from "src/web-sight/WebSightRoom";
import { WebSightRoomCardinalityType } from "src/web-sight/WebSightRoomCardinalityType";
import { WebSightService } from "src/web-sight/web-sight.service";
import { WebSightUserRoom } from "src/web-sight/WebSightUserRoom";
import { WebSightRole } from "src/web-sight/WebSightRole";
import { v4 } from "uuid";
import { LessonDto } from "./dto/lesson.dto";
import { EntityNotFoundException } from "src/common/exceptions/entity-not-found.exception";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { ProfilesService } from "src/users/profiles/profiles.service";

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
    private readonly subjectsService: SubjectsService,
    private readonly webSightService: WebSightService,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(lesson: CreateLessonDto, profiles: Profile[]): Promise<Lesson> {
    const subjects = await this.subjectsService.findByProfessor(
      lesson.professorId,
    );

    if (!subjects.find((sub) => sub.id === lesson.subjectId)) {
      throw new InvalidDataException(
        "Cannot create a lesson if it's not a part of the given subject.",
      );
    }

    const newLesson = await this.lessonsRepository.save(lesson);

    const room: WebSightRoom = {
      id: v4(),
      name: lesson.name,
      roomCardinalityType: WebSightRoomCardinalityType.P2P,
    };

    const newRoom = await this.webSightService.createWebSightRoom(room);

    newLesson.webSightRoomId = newRoom.id;

    const user = await this.profilesService.findOne(lesson.professorId);

    const userRoom: WebSightUserRoom = {
      userId: user.webSightApiId,
      roomId: newRoom.id,
      role: WebSightRole.HOST,
    };

    await this.webSightService.createWebSightUserRoom(userRoom);

    for (let i = 0; i < profiles.length; ++i) {
      await this.webSightService.createWebSightUserRoom({
        userId: profiles[i].webSightApiId,
        roomId: newRoom.id,
        role: WebSightRole.GUEST,
      });
    }

    const finalLesson = await this.lessonsRepository.save(newLesson);

    return finalLesson;
  }

  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOne(id);

    if (!lesson) {
      throw new EntityNotFoundException(Lesson);
    }

    return lesson;
  }

  async findBySubject(subjectId: number): Promise<Lesson[]> {
    return this.lessonsRepository.find({
      where: {
        subjectId,
      },
      order: {
        timeRoomOpened: "ASC",
      },
    });
  }

  async startConference(
    userId: number,
    roomId: string,
    professorName: string,
    lesson: Lesson,
    profiles: Profile[],
  ): Promise<void> {
    await this.webSightService.startRoomConference(
      userId,
      roomId,
      professorName,
      lesson,
      profiles,
    );
  }

  async generateWebSightToken(
    userId: number,
    lessonId: number,
  ): Promise<string> {
    const lesson = await this.findOne(lessonId);

    return this.webSightService.getWebSightRoomToken(
      userId,
      lesson.webSightRoomId,
    );
  }

  mapToDto(lesson: Lesson): LessonDto {
    return {
      id: lesson.id,
      name: lesson.name,
      webSightRoom: lesson.webSightRoomId,
      subjectId: lesson.subjectId,
      professorId: lesson.professorId,
      schoolYearId: lesson.schoolYearId,
      timeRoomOpened: lesson.timeRoomOpened,
      timeRoomClosed: lesson.timeRoomClosed,
    };
  }
}
