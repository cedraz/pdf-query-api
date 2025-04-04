import { Injectable, Type } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuditEventQueueService } from 'src/jobs/queues/audit-event-queue.service';
import { createAuditEventExtension } from './extended-queries/audit';

function createExtendedPrismaClient(
  auditEventQueueService: AuditEventQueueService,
) {
  return new PrismaClient().$extends(
    createAuditEventExtension(auditEventQueueService),
  );
  // .$extends(proposalExtension)
}

const ExtendedPrismaClient = class {
  constructor(auditEventQueueService: AuditEventQueueService) {
    return createExtendedPrismaClient(auditEventQueueService);
  }
} as Type<ReturnType<typeof createExtendedPrismaClient>>;

@Injectable()
export class PrismaService extends ExtendedPrismaClient {
  constructor(auditEventQueueService: AuditEventQueueService) {
    super(auditEventQueueService);
  }
}
