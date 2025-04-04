import { Operation as PrismaOperation } from '@prisma/client';

export type OperationType = keyof typeof PrismaOperation;
