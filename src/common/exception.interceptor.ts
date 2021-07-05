import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { EntityNotFoundException } from "./exceptions/entity-not-found.exception";
import { catchError } from "rxjs/operators";
import { InvalidDataException } from "./exceptions/invalid-data.exception";
import { AccessForbiddenException } from "./exceptions/access-forbidden.exception";

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof EntityNotFoundException) {
          throw new NotFoundException(error.message);
        } else if (error instanceof InvalidDataException) {
          throw new BadRequestException(error.message);
        } else if (error instanceof AccessForbiddenException) {
          throw new ForbiddenException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
