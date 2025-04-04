import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export enum PrismaErrorCodes {
  UniqueConstraintFailed = 'P2002',
  ForeignKeyConstraintFailed = 'P2003',
  RecordNotFound = 'P2025',
}

@Injectable()
export class PrismaErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((exception) => {
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
          if (
            exception.code ===
            PrismaErrorCodes.UniqueConstraintFailed.toString()
          ) {
            const uniqueFields = (exception.meta as { target: string[] })
              .target;

            if (uniqueFields.length > 0) {
              return throwError(
                () =>
                  new ConflictException({
                    message: {
                      uniqueFields,
                    },
                    statusCode: 409,
                    error: 'Conflict',
                  }),
              );
            }
          }

          if (
            exception.code ===
            PrismaErrorCodes.ForeignKeyConstraintFailed.toString()
          ) {
            const constraintName = (exception.meta as { field_name: string })
              .field_name;

            if (constraintName) {
              return throwError(
                () =>
                  new NotFoundException({
                    message: {
                      constraintName,
                    },
                    statusCode: 404,
                    error: 'Not Found',
                  }),
              );
            }
          }

          if (exception.code === PrismaErrorCodes.RecordNotFound.toString()) {
            return throwError(
              () =>
                new NotFoundException({
                  message: `Record ${(exception.meta as { modelName: string }).modelName} not found`,
                  statusCode: 404,
                  error: 'Not Found',
                }),
            );
          }
        }

        return throwError(() => {
          if (exception instanceof HttpException) {
            return exception;
          }

          console.error(exception);

          return new InternalServerErrorException();
        });
      }),
    );
  }
}
