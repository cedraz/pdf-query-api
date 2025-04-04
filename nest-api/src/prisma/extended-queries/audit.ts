/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prisma } from '@prisma/client';
import { OperationType } from 'src/common/types/operation.enum';
import { AuditEventQueueService } from 'src/jobs/queues/audit-event-queue.service';

export const createAuditEventExtension = (
  auditEventQueueService: AuditEventQueueService,
) => {
  return Prisma.defineExtension((prisma) => {
    return prisma.$extends({
      name: 'AuditEventExtension',
      query: {
        async $allOperations({ operation, model, args, query }) {
          const action: OperationType = operation as OperationType;

          if (
            action !== 'create' &&
            action !== 'update' &&
            action !== 'delete'
          ) {
            return query(args);
          }

          let oldData = null;

          if (action === 'update' || action === 'delete') {
            if (model) {
              oldData = await prisma[model.toLowerCase()].findUnique({
                where: args.where,
              });
            }
          }

          const result = await query(args);

          let newData = null;
          if (action === 'create') {
            newData = result;
          } else if (action === 'update') {
            newData = result;
          }

          // IMPEDE A RECURSAO
          if (model !== 'AuditEvent') {
            // await auditEventQueueService.execute({
            //   title: 'Query no banco de dados',
            //   description: `Query: ${query.name}, Model: ${model}, Action: ${operation}`,
            //   model,
            //   new_data: newData || {},
            //   old_data: oldData || {},
            //   operation: action,
            // });
          }

          return result;
        },
      },
    });
  });
};
