/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from './logger.service';
import { AuditEventQueueService } from 'src/jobs/queues/audit-event-queue.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: CustomLogger,
    private readonly auditEventQueueService: AuditEventQueueService,
    private readonly prismaService: PrismaService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, body } = req;

    // PEGAR IP DO USUÁRIO
    // const xForwardedFor = Array.isArray(req.headers['x-forwarded-for'])
    //   ? req.headers['x-forwarded-for'].join(', ')
    //   : req.headers['x-forwarded-for'] || '';

    // res.json = function (body) {
    //   res.locals.responseBody = body;
    //   return originalJson.call(this, body) as Response<
    //     any,
    //     Record<string, any>
    //   >;
    // };

    req.on('error', (error) => {
      this.logger.error(`Erro na requisição: ${error.message}`, 'HTTP', {
        method,
        originalUrl,
        error: error.stack,
      });
    });

    res.on('finish', () => {
      const handleFinish = () => {
        const { statusCode } = res;
        const duration = Date.now() - start;

        // const organization_id = req.params.organization_id;
        // const model = req.path.split('/')[1];

        // if (organization_id && req.user) {
        //   const auditEvent = await this.prismaService.auditEvent.findFirst({
        //     where: {
        //       organization_id,
        //       model,
        //     },
        //   });
        // }

        this.logger.log(`${originalUrl} - ${duration}ms`, 'HTTP', {
          method,
          statusCode,
          requestBody: body ? body : null,
        });
      };

      handleFinish();
    });

    next();
  }
}
