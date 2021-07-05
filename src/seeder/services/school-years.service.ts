import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SchoolYear } from "src/school-years/entities/school-year.entity";
import { SchoolYearsService } from "src/school-years/school-years.service";
import { Repository } from "typeorm";

@Injectable()
export class SchoolYearsSeederService {
  constructor(
    @InjectRepository(SchoolYear)
    private readonly schoolYearsRepository: Repository<SchoolYear>,
    private readonly schoolYearsService: SchoolYearsService,
  ) {}

  async seed() {
    try {
      const today = new Date();
      let currentYear = today.getFullYear();

      // if is not past october
      if (today.getMonth() < 8) {
        currentYear--;
      }

      const schoolYearsToInsert: SchoolYear[] = [];

      for (let i = 0; i < 5; i++) {
        const year = currentYear - i;
        const schoolYearId = this.schoolYearsService.schoolYearIdFromStartYear(
          year,
        );

        const startDate = new Date(`${year}-10-01`);
        const endDate = new Date(`${year + 1}-09-30`);

        schoolYearsToInsert.push({
          id: schoolYearId,
          startDate,
          endDate,
          current: i == 0,
        });
      }

      await this.schoolYearsRepository.save(schoolYearsToInsert);
    } catch (err) {
      console.log(err);
    }
  }
}
