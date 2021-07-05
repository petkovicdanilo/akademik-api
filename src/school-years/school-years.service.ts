import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundException } from "src/common/exceptions/entity-not-found.exception";
import { InvalidDataException } from "src/common/exceptions/invalid-data.exception";
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

  async create(createSchoolYearDto: CreateSchoolYearDto): Promise<SchoolYear> {
    const startDate = new Date(createSchoolYearDto.startDate.toString());
    const endDate = new Date(createSchoolYearDto.endDate.toString());

    if (!this.validYears(startDate, endDate)) {
      throw new InvalidDataException("Invalid start or end time");
    }

    const startYear = startDate.getFullYear();

    const id = this.schoolYearIdFromStartYear(startYear);

    const existingSchoolYear = await this.schoolYearsRepository.findOne(id);
    if (existingSchoolYear) {
      throw new InvalidDataException("School year already exists");
    }

    const schoolYear: SchoolYear = {
      id,
      startDate: createSchoolYearDto.startDate,
      endDate: createSchoolYearDto.endDate,
      current: false,
    };

    try {
      return await this.schoolYearsRepository.save(schoolYear);
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
  }

  findAll(): Promise<SchoolYear[]> {
    return this.schoolYearsRepository.find({
      order: {
        id: "DESC",
      },
    });
  }

  async findOne(id: string): Promise<SchoolYear> {
    const schoolYear = await this.schoolYearsRepository.findOne(id);

    if (!schoolYear) {
      throw new EntityNotFoundException(SchoolYear, "School year");
    }

    return schoolYear;
  }

  async update(
    id: string,
    updateSchoolYearDto: UpdateSchoolYearDto,
  ): Promise<SchoolYear> {
    const schoolYear = await this.findOne(id);

    schoolYear.startDate =
      new Date(updateSchoolYearDto.startDate) ?? schoolYear.startDate;
    schoolYear.endDate =
      new Date(updateSchoolYearDto.endDate) ?? schoolYear.endDate;

    if (
      !this.validYears(schoolYear.startDate, schoolYear.endDate) ||
      schoolYear.startDate.getFullYear() != this.idToFirstYear(schoolYear.id)
    ) {
      throw new InvalidDataException("Invalid start or end time");
    }

    this.schoolYearsRepository.save(schoolYear);

    return schoolYear;
  }

  async remove(id: string): Promise<SchoolYear> {
    const schoolYear = await this.findOne(id);

    if (schoolYear.current) {
      throw new InvalidDataException("Can't delete current school year");
    }

    await this.schoolYearsRepository.remove(schoolYear);
    schoolYear.id = id;

    return schoolYear;
  }

  async findCurrent(): Promise<SchoolYear> {
    const current = await this.schoolYearsRepository.findOne({
      where: {
        current: true,
      },
    });

    if (!current) {
      throw new EntityNotFoundException(SchoolYear, "School year");
    }

    return current;
  }

  async setCurrent(schoolYearId: string): Promise<SchoolYear> {
    const newCurrentSchoolYear = await this.findOne(schoolYearId);
    const currentSchoolYear = await this.findCurrent();

    newCurrentSchoolYear.current = true;

    if (!currentSchoolYear) {
      return this.schoolYearsRepository.save(newCurrentSchoolYear);
    }

    currentSchoolYear.current = false;

    this.schoolYearsRepository.save([currentSchoolYear, newCurrentSchoolYear]);

    return newCurrentSchoolYear;
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

  schoolYearIdFromStartYear(startYear: number) {
    const endYear = startYear + 1;
    return `${startYear}-${endYear.toString().slice(2, 4)}`;
  }

  mapToDto(schoolYear: SchoolYear): SchoolYearDto {
    return {
      id: schoolYear.id,
      startDate: schoolYear.startDate,
      endDate: schoolYear.endDate,
    };
  }
}
