import { Test, TestingModule } from "@nestjs/testing";
import { ExamPeriodsController } from "./exam-periods.controller";

describe("ExamPeriodsController", () => {
  let controller: ExamPeriodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamPeriodsController],
      providers: [ExamsService],
    }).compile();

    controller = module.get<ExamPeriodsController>(ExamPeriodsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
