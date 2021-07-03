import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "src/subjects/entities/subject.entity";
import { Student } from "src/users/students/entities/student.entity";
import { Repository } from "typeorm";
import * as faker from "faker";
import { EnrolledSubject } from "src/subjects/entities/enrolled-subject.entity";
import { SchoolYear } from "src/school-years/entities/school-year.entity";

@Injectable()
export class EnrolledSubjectsSeederService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    @InjectRepository(EnrolledSubject)
    private readonly enrolledSubjectsRepository: Repository<EnrolledSubject>,
    @InjectRepository(SchoolYear)
    private readonly schoolYearsRepository: Repository<SchoolYear>,
  ) {}

  async seed() {
    try {
      const students = await this.studentsRepository.find();
      const subjects = await this.subjectsRepository.find();
      const schoolYears = await this.schoolYearsRepository.find();

      const departmentIdToSubjects = new Map<number, Set<Subject>>();

      subjects.forEach((subject) => {
        const departmentId = subject.departmentId;
        if (!departmentIdToSubjects.has(departmentId)) {
          departmentIdToSubjects.set(departmentId, new Set<Subject>());
        }

        departmentIdToSubjects.get(subject.departmentId).add(subject);
      });

      const enrolledSubjects = [];
      students.forEach((student) => {
        const pickedSubjects = faker.random.arrayElements(
          Array.from(
            departmentIdToSubjects.get(student.department.id).values(),
          ),
        );

        pickedSubjects.forEach((subject) => {
          const grade = faker.datatype.number({ min: 1, max: 10 });
          enrolledSubjects.push({
            student,
            subject,
            schoolYear: faker.random.arrayElement(
              schoolYears.filter(
                (schoolYear) => schoolYear.id >= student.startingSchoolYear.id,
              ),
            ),
            grade: grade > 5 ? grade : null,
          });
        });
      });

      await this.enrolledSubjectsRepository.save(enrolledSubjects);
    } catch (err) {
      console.log(err);
    }
  }
}
