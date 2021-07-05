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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { CreateExamPeriodDto } from "./dto/create-exam-period.dto";
import { UpdateExamPeriodDto } from "./dto/update-exam-period.dto";
import { ExamPeriodsService } from "./exam-periods.service";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";

@Controller("exam-periods")
@ApiTags("exam-periods")
export class ExamPeriodsController {
  constructor(
    private readonly examPeriodsService: ExamPeriodsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async create(
    @Body() createExamPeriodDto: CreateExamPeriodDto,
    @Req() request: any,
  ) {
    const ability = this.caslAbilityFactory.createForExamPeriod(request.user);
    if (ability.cannot(Action.Create, "all")) {
      throw new AccessForbiddenException("Can't create exam period");
    }

    const examPeriod = await this.examPeriodsService.create(
      createExamPeriodDto,
    );

    return this.examPeriodsService.mapToDto(examPeriod);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const examPeriod = await this.examPeriodsService.findOne(+id);

    return this.examPeriodsService.mapToDto(examPeriod);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async update(
    @Param("id") id: number,
    @Body() updateExamPeriodDto: UpdateExamPeriodDto,
    @Req() request: any,
  ) {
    const ability = this.caslAbilityFactory.createForExamPeriod(request.user);
    if (ability.cannot(Action.Update, "all")) {
      throw new AccessForbiddenException("Can't update exam period");
    }

    const examPeriod = await this.examPeriodsService.update(
      +id,
      updateExamPeriodDto,
    );

    return this.examPeriodsService.mapToDto(examPeriod);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async remove(@Param("id") id: number, @Req() request: any) {
    const ability = this.caslAbilityFactory.createForExamPeriod(request.user);
    if (ability.cannot(Action.Delete, "all")) {
      throw new AccessForbiddenException("Can't delete exam period");
    }

    const examPeriod = await this.examPeriodsService.remove(+id);

    return this.examPeriodsService.mapToDto(examPeriod);
  }
}
