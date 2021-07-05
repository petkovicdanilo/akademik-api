import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { SubjectsService } from "./subjects.service";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import { UpdateSubjectDto } from "./dto/update-subject.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";
import { SubjectDto } from "./dto/subject.dto";

@Controller("subjects")
@ApiTags("subjects")
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Req() request: any,
  ): Promise<SubjectDto> {
    const ability = this.caslAbilityFactory.createForSubject(request.user);
    if (ability.cannot(Action.Create, "all")) {
      throw new AccessForbiddenException("Can't create subject");
    }

    const subject = await this.subjectsService.create(createSubjectDto);

    return this.subjectsService.mapToDto(subject);
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<SubjectDto> {
    const subject = await this.subjectsService.findOne(+id);

    return this.subjectsService.mapToDto(subject);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async update(
    @Param("id") id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Req() request: any,
  ): Promise<SubjectDto> {
    const ability = this.caslAbilityFactory.createForSubject(request.user);
    if (ability.cannot(Action.Update, "all")) {
      throw new AccessForbiddenException("Can't update subject");
    }

    const subject = await this.subjectsService.update(+id, updateSubjectDto);

    return this.subjectsService.mapToDto(subject);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async remove(
    @Param("id") id: number,
    @Req() request: any,
  ): Promise<SubjectDto> {
    const ability = this.caslAbilityFactory.createForSubject(request.user);
    if (ability.cannot(Action.Delete, "all")) {
      throw new AccessForbiddenException("Can't delete subject");
    }

    const subject = await this.subjectsService.remove(+id);

    return this.subjectsService.mapToDto(subject);
  }
}
