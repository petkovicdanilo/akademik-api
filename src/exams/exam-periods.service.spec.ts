import { Test, TestingModule } from "@nestjs/testing";
import { ExamPeriodsService } from "./exam-periods.service";

describe("ExamPeriodsService", () => {
  let service: ExamPeriodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamPeriodsService],
    }).compile();

    service = module.get<ExamPeriodsService>(ExamPeriodsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
