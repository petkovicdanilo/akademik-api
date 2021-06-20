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

      const schoolYearsToInsert = [];

      for (let i = 0; i < 5; i++) {
        const year = currentYear - i;
        const schoolYearId = this.schoolYearsService.schoolYearIdFromStartYear(
          year,
        );

        const startDate = new Date(`October 1, ${year} 00:00:00`);
        const endDate = new Date(`September 31, ${year} 00:00:00`);

        schoolYearsToInsert.push({
          id: schoolYearId,
          startDate,
          endDate,
        });
      }

      await this.schoolYearsRepository.save(schoolYearsToInsert);
    } catch (err) {
      console.log(err);
    }
  }
}
