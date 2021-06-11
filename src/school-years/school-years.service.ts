import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSchoolYearDto } from "./dto/create-school-year.dto";
import { SchoolYearDto } from "./dto/school-year.dto";
import { UpdateSchoolYearDto } from "./dto/update-school-year.dto";
import { SchoolYear } from "./entities/school-year.entity";

@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear)
    private readonly schoolYearsRepository: Repository<SchoolYear>,
  ) {}

  create(createSchoolYearDto: CreateSchoolYearDto) {
    const startDate = new Date(createSchoolYearDto.startDate.toString());
    const endDate = new Date(createSchoolYearDto.endDate.toString());

    if (!this.validYears(startDate, endDate)) {
      throw new BadRequestException("Invalid start or end time");
    }

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    const id = `${startYear}-${endYear.toString().slice(2, 4)}`;

    const schoolYear: SchoolYear = {
      id,
      startDate: createSchoolYearDto.startDate,
      endDate: createSchoolYearDto.endDate,
    };

    return this.schoolYearsRepository.save(schoolYear);
  }

  findAll() {
    return this.schoolYearsRepository.find();
  }

  async findOne(id: string) {
    const schoolYear = await this.schoolYearsRepository.findOne(id);

    if (!schoolYear) {
      throw new NotFoundException("School year not found");
    }

    return schoolYear;
  }

  async update(id: string, updateSchoolYearDto: UpdateSchoolYearDto) {
    const schoolYear = await this.findOne(id);

    schoolYear.startDate =
      new Date(updateSchoolYearDto.startDate) ?? schoolYear.startDate;
    schoolYear.endDate =
      new Date(updateSchoolYearDto.endDate) ?? schoolYear.endDate;

    if (
      !this.validYears(schoolYear.startDate, schoolYear.endDate) ||
      schoolYear.startDate.getFullYear() != this.idToFirstYear(schoolYear.id)
    ) {
      throw new BadRequestException("Invalid start or end time");
    }

    this.schoolYearsRepository.save(schoolYear);

    return schoolYear;
  }

  async remove(id: string) {
    const schoolYear = await this.findOne(id);

    await this.schoolYearsRepository.remove(schoolYear);
    schoolYear.id = id;

    return schoolYear;
  }

  private validYears(startDate: Date, endDate: Date): boolean {
    return (
      startDate < endDate &&
      endDate.getFullYear() - startDate.getFullYear() == 1
    );
  }

  private idToFirstYear(id: string): number {
    return parseInt(id.slice(0, 4));
  }

  mapToDto(schoolYear: SchoolYear): SchoolYearDto {
    return {
      id: schoolYear.id,
      startDate: schoolYear.startDate,
      endDate: schoolYear.endDate,
    };
  }
}
